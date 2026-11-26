import React, { useState, useCallback } from 'react';
import { ArrowLeft, Building2, Mail, Phone, MapPin, User, FileText, CheckCircle2, AlertCircle, GraduationCap, KeyRound, Lock, Briefcase, ShieldCheck, ArrowRight, Upload } from 'lucide-react';

// IT Departmanı için Not: Firebase Kimlik Doğrulama (Auth) ve Veritabanı (Firestore) modülleri içeri aktarıldı.
import { auth, db, googleProvider } from '../utils/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import useAppStore from '../store/useAppStore';
import useAdminStore from '../brain/useAdminStore';
import { getTenantConfig } from '../config/tenantConfig';
import { authenticateAndFetchGoogleProfile } from '../utils/googleAuthProfile';
import {
  EDEVLET_NOT_FOUND_MESSAGE,
  verifyEDevletStudentOrAlumni,
  verifyEDevletStudentOrAlumniSync,
} from '../services/edevletVerificationService';
import SafeAvatar from './shared/SafeAvatar';
import Logo from './Logo';
import ThemeToggle from './shared/ThemeToggle';
import LanguageSwitcher from './shared/LanguageSwitcher';

const REGISTRATION_UNAVAILABLE_MESSAGE = 'Kayıt servisine şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.';
const PROFILE_SAVE_FAILED_MESSAGE = 'Profil bilgileriniz kaydedilemedi. Lütfen tekrar deneyin veya Kariyer Geliştirme Merkezi ile iletişime geçin.';

const normalizeRoleKey = (role) => {
  if (role === 'staff' || role === 'academic') return 'academic';
  if (role === 'company' || role === 'employer') return 'employer';
  if (role === 'student') return 'student';
  return 'alumni';
};

const ROLE_META = {
  alumni: {
    tabLabel: 'Mezun Kaydı',
    submitLabel: 'Mezun Hesabımı Aktifleştir',
    kvkkText: 'mezun bilgi havuzunda profilimin işlenmesini onaylıyorum.'
  },
  student: {
    tabLabel: 'Öğrenci Kaydı',
    submitLabel: 'Öğrenci Hesabımı Oluştur',
    kvkkText: 'kişisel ve akademik verilerimin staj ve kariyer olanakları kapsamında işlenmesini onaylıyorum.'
  },
  academic: {
    tabLabel: 'Akademik Personel',
    submitLabel: 'Akademik Hesabımı Aktifleştir',
    kvkkText: 'akademik verilerimin ve danışmanlık kayıtlarımın işlenmesini onaylıyorum.'
  },
  employer: {
    tabLabel: 'Firma Kaydı',
    submitLabel: 'Firma Hesabımı Aktifleştir & Kaydı Tamamla',
    kvkkText: 've Platform Kullanım Koşulları\'nı okudum, kurumsal verilerimizin işlenmesini onaylıyorum.'
  }
};

const PERSON_NAME_REGEX = /^[a-zA-ZçğıöşüÇĞİÖŞÜ\s.'-]+$/;
const STUDENT_ID_REGEX = /^\d{9,11}$/;
const URL_REGEX = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const EMAIL_FIELDS = ['email', 'studentEmail', 'alumniEmail', 'academicEmail'];

export const getEmailFieldForRole = (accountType) => {
  if (accountType === 'student') return 'studentEmail';
  if (accountType === 'academic') return 'academicEmail';
  if (accountType === 'employer') return 'email';
  return 'alumniEmail';
};

export const isValidEmailFormat = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed || /\s/.test(trimmed)) return false;
  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;
  const [localPart, domainPart] = parts;
  if (!localPart || !domainPart) return false;
  if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) return false;
  if (domainPart.startsWith('.') || domainPart.endsWith('.') || domainPart.includes('..')) return false;
  if (!/^[a-zA-Z0-9._%+-]+$/.test(localPart)) return false;
  const domainLabels = domainPart.split('.');
  if (domainLabels.length < 2) return false;
  const tld = domainLabels[domainLabels.length - 1];
  if (!/^[a-zA-Z]{2,}$/.test(tld)) return false;
  return domainLabels.every(label => /^[a-zA-Z0-9-]+$/.test(label) && !label.startsWith('-') && !label.endsWith('-'));
};

export const isValidFullName = (value) => {
  const trimmed = String(value || '').trim().replace(/\s+/g, ' ');
  if (trimmed.length < 4 || !PERSON_NAME_REGEX.test(trimmed)) return false;
  const parts = trimmed.split(' ').filter(p => p.replace(/[.'-]/g, '').length >= 2);
  return parts.length >= 2;
};

export const isValidPhone = (value) => {
  const digits = String(value || '').replace(/[\s()-]/g, '').replace(/^\+90/, '0');
  return /^0?[25]\d{9}$/.test(digits);
};

export const validateRoleFields = (accountType, formData) => {
  const fieldErrors = {};

  if (accountType === 'employer') {
    const companyName = String(formData.companyName || '').trim();
    const sector = String(formData.sector || '').trim();
    const website = String(formData.website || '').trim();
    const contactName = String(formData.contactName || '').trim();
    const title = String(formData.title || '').trim();
    const email = String(formData.email || '').trim();
    const phone = String(formData.phone || '').trim();

    if (!companyName || companyName.length < 2) {
      fieldErrors.companyName = 'Şirket / Kurum adı boş bırakılamaz (en az 2 karakter olmalıdır).';
    }
    if (!sector || sector.length < 2) {
      fieldErrors.sector = 'Faaliyet sektörü alanı boş bırakılamaz.';
    }
    if (!website) {
      fieldErrors.website = 'Şirket web sayfası / iletişim URL alanı boş bırakılamaz.';
    } else if (!URL_REGEX.test(website)) {
      fieldErrors.website = 'Geçerli bir web adresi giriniz (https:// veya http:// ile başlamalıdır).';
    }
    if (!contactName) {
      fieldErrors.contactName = 'Yetkili kişi adı ve soyadı boş bırakılamaz.';
    } else if (!isValidFullName(contactName)) {
      fieldErrors.contactName = 'Yetkili kişi bilgisi en az ad ve soyaddan oluşmalı, yalnızca harf içermelidir.';
    }
    if (!title || title.length < 2) {
      fieldErrors.title = 'Yetkili kişinin firmadaki görev tanımı / unvanı boş bırakılamaz.';
    }
    if (!email) {
      fieldErrors.email = 'Yetkili kurumsal e-posta adresi boş bırakılamaz.';
    } else if (!isValidEmailFormat(email)) {
      fieldErrors.email = 'Geçerli bir kurumsal e-posta adresi formatı giriniz (örn: ad.soyad@firma.com).';
    }
    if (!phone) {
      fieldErrors.phone = 'Yetkili telefon numarası boş bırakılamaz.';
    } else if (!isValidPhone(phone)) {
      fieldErrors.phone = 'Yetkili telefon numarası geçerli formatta olmalıdır (örn: 05XX XXX XX XX).';
    }
  } else if (accountType === 'student') {
    const studentId = String(formData.studentId || '').trim();
    const studentName = String(formData.studentName || '').trim();
    const studentDepartment = String(formData.studentDepartment || '').trim();
    const studentGrade = String(formData.studentGrade || '').trim();
    const studentEmail = String(formData.studentEmail || '').trim();

    if (!studentId) {
      fieldErrors.studentId = 'Öğrenci kaydı için Öğrenci Numarası (Student ID) zorunludur.';
    } else if (!STUDENT_ID_REGEX.test(studentId)) {
      fieldErrors.studentId = 'Öğrenci numarası 9 ile 11 hane arasında yalnızca rakamlardan oluşmalıdır.';
    } else {
      const edevletVerification = verifyEDevletStudentOrAlumniSync({
        studentNo: studentId,
        fullName: studentName,
        role: 'student',
      });
      if (!edevletVerification.verified) {
        fieldErrors.studentId = edevletVerification.detail || EDEVLET_NOT_FOUND_MESSAGE;
      }
    }
    if (!studentName) {
      fieldErrors.studentName = 'Öğrenci adı ve soyadı boş bırakılamaz.';
    } else if (!isValidFullName(studentName)) {
      fieldErrors.studentName = 'Ad Soyadı alanı en az iki kelimeden oluşmalı ve yalnızca harf içermelidir.';
    }
    if (!studentDepartment || studentDepartment.length < 2) {
      fieldErrors.studentDepartment = 'Bölüm bilgisi boş bırakılamaz.';
    }
    if (!studentGrade) {
      fieldErrors.studentGrade = 'Sınıf / öğrenim düzeyi seçimi zorunludur.';
    }
    if (!studentEmail) {
      fieldErrors.studentEmail = 'Öğrenci e-posta adresi boş bırakılamaz.';
    } else if (!isValidEmailFormat(studentEmail)) {
      fieldErrors.studentEmail = 'Geçerli bir öğrenci e-posta adresi formatı giriniz.';
    }
  } else if (accountType === 'alumni') {
    const alumniName = String(formData.alumniName || '').trim();
    const alumniId = String(formData.alumniId || '').trim();
    const alumniDepartment = String(formData.alumniDepartment || '').trim();
    const graduationYear = String(formData.graduationYear || '').trim();
    const alumniEmail = String(formData.alumniEmail || '').trim();
    const currentYear = new Date().getFullYear() + 1;
    const numericYear = Number(graduationYear);

    if (!alumniName) {
      fieldErrors.alumniName = 'Mezun adı ve soyadı boş bırakılamaz.';
    } else if (!isValidFullName(alumniName)) {
      fieldErrors.alumniName = 'Ad Soyadı alanı en az iki kelimeden oluşmalı ve yalnızca harf içermelidir.';
    }
    if (!alumniId) {
      fieldErrors.alumniId = 'Mezun aktivasyonu için Öğrenci Numarası zorunludur.';
    } else if (!STUDENT_ID_REGEX.test(alumniId)) {
      fieldErrors.alumniId = 'Öğrenci (Mezun) numarası 9 ile 11 hane arasında yalnızca rakamlardan oluşmalıdır.';
    } else {
      const edevletVerification = verifyEDevletStudentOrAlumniSync({
        studentNo: alumniId,
        fullName: alumniName,
        graduationYear,
        role: 'alumni',
      });
      if (!edevletVerification.verified) {
        fieldErrors.alumniId = edevletVerification.detail || EDEVLET_NOT_FOUND_MESSAGE;
      }
    }
    if (!alumniDepartment || alumniDepartment.length < 2) {
      fieldErrors.alumniDepartment = 'Mezun olunan bölüm alanı boş bırakılamaz.';
    }
    if (!graduationYear) {
      fieldErrors.graduationYear = 'Mezuniyet yılı boş bırakılamaz.';
    } else if (!/^\d{4}$/.test(graduationYear) || numericYear < 1990 || numericYear > currentYear) {
      fieldErrors.graduationYear = `Mezuniyet yılı 1990 ile ${currentYear} arasında 4 haneli bir yıl olmalıdır.`;
    }
    if (!alumniEmail) {
      fieldErrors.alumniEmail = 'E-posta adresi boş bırakılamaz.';
    } else if (!isValidEmailFormat(alumniEmail)) {
      fieldErrors.alumniEmail = 'Geçerli bir e-posta adresi formatı giriniz.';
    }
  } else if (accountType === 'academic') {
    const academicName = String(formData.academicName || '').trim();
    const academicTitle = String(formData.academicTitle || '').trim();
    const academicDepartment = String(formData.academicDepartment || '').trim();
    const academicEmail = String(formData.academicEmail || '').trim();

    if (!academicName) {
      fieldErrors.academicName = 'Akademisyen adı ve soyadı boş bırakılamaz.';
    } else if (!isValidFullName(academicName)) {
      fieldErrors.academicName = 'Ad Soyadı alanı en az iki kelimeden oluşmalı ve yalnızca harf içermelidir.';
    }
    if (!academicTitle || academicTitle.length < 2) {
      fieldErrors.academicTitle = 'Akademik unvan alanı boş bırakılamaz.';
    }
    if (!academicDepartment || academicDepartment.length < 2) {
      fieldErrors.academicDepartment = 'Bölüm / Fakülte alanı boş bırakılamaz.';
    }
    if (!academicEmail) {
      fieldErrors.academicEmail = 'Kurumsal e-posta adresi boş bırakılamaz.';
    } else if (!isValidEmailFormat(academicEmail)) {
      fieldErrors.academicEmail = 'Geçerli bir kurumsal e-posta adresi formatı giriniz.';
    }
  }

  return fieldErrors;
};

export default function Register({ setView, setCurrentUser, setUserRole }) {
  const { setStudents, setAlumni, setAcademicStaff, setCompanies, registerAccountType } = useAppStore();
  const normalizeRegisterType = (t) => (
    t === 'student' ? 'student' :
    (t === 'employer' || t === 'company') ? 'employer' : 'alumni'
  );
  const [step, setStep] = useState(1); // 1: Info, 2: Success
  const [accountType, setAccountType] = useState(() => normalizeRegisterType(registerAccountType)); // 'student', 'alumni', 'employer'
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [activationNotice, setActivationNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [kvkkConsent, setKvkkConsent] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [companyLogoData, setCompanyLogoData] = useState(null);
  const [googleLinkedProfile, setGoogleLinkedProfile] = useState(null);
  const tenant = getTenantConfig();

  React.useEffect(() => {
    if (registerAccountType) {
      setAccountType(normalizeRegisterType(registerAccountType));
    }
  }, [registerAccountType]);

  // Role-specific + shared form state
  const [formData, setFormData] = useState({
    companyName: '', website: '', contactName: '', title: '', email: '', phone: '', sector: 'Teknoloji & Bilişim', taxNo: '',
    studentName: '', studentId: '', studentEmail: '', studentDepartment: '', studentGrade: '1. Sınıf', password: '', passwordConfirm: '',
    academicName: '', academicEmail: '', academicTitle: '', academicDepartment: '', staffId: '',
    alumniName: '', alumniId: '', alumniEmail: '', graduationYear: '', alumniDepartment: ''
  });

  const applyGoogleCompanyPrefill = useCallback((profile) => {
    if (!profile || !profile.email) return;
    setAccountType('employer');
    setGoogleLinkedProfile(profile);
    if (profile.avatar) {
      setCompanyLogoData(profile.avatar);
    }
    setKvkkConsent(true);
    setFieldErrors({});
    setError(null);
    setFormData((prev) => {
      const nextData = {
        ...prev,
        companyName: profile.companyName || prev.companyName || '',
        website: profile.website || prev.website || '',
        contactName: profile.contactName || prev.contactName || '',
        title: profile.title || prev.title || '',
        email: profile.email || prev.email || '',
        phone: profile.phone || prev.phone || '',
        sector: profile.sector || prev.sector || 'Teknoloji & Bilişim'
      };
      const missingFields = [];
      if (!nextData.companyName) missingFields.push('Şirket / Kurum Adı');
      if (!nextData.website) missingFields.push('Web Adresi');
      if (!nextData.contactName) missingFields.push('Yetkili Ad Soyad');
      if (!nextData.title) missingFields.push('Görev / Unvan');
      if (!nextData.phone) missingFields.push('Telefon Numarası');

      const pulledSummary = Array.isArray(profile.pulledFields) && profile.pulledFields.length > 0
        ? profile.pulledFields.join(', ')
        : 'E-Posta ve Profil Bilgileri';

      if (missingFields.length === 0) {
        setActivationNotice(
          `Google hesabınızdan (${profile.email}) gerçek profil ve kurum bilgileriniz (${pulledSummary}) doğrulandı ve forma aktarıldı. Bilgileri kontrol ederek hesabınızı hemen aktifleştirebilirsiniz.`
        );
      } else {
        setActivationNotice(
          `Google hesabınızdan (${profile.email}) gerçek bilgileriniz (${pulledSummary}) çekilerek forma yansıtıldı. Google profilinizde bulunmayan alanları (${missingFields.join(', ')}) tamamlayarak kaydınızı oluşturabilirsiniz.`
        );
      }
      return nextData;
    });
  }, []);

  React.useEffect(() => {
    if (registerAccountType) {
      setAccountType(normalizeRegisterType(registerAccountType));
      setFieldErrors({});
      setTouchedFields({});
    }
  }, [registerAccountType]);

  React.useEffect(() => {
    try {
      const rawPrefill = sessionStorage.getItem('iesu_google_company_prefill');
      if (rawPrefill) {
        sessionStorage.removeItem('iesu_google_company_prefill');
        const parsed = JSON.parse(rawPrefill);
        if (parsed && typeof parsed === 'object') {
          applyGoogleCompanyPrefill(parsed);
        }
      }
    } catch { /* intentional */ }
  }, [applyGoogleCompanyPrefill]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: value };
    setFormData(nextData);
    const isEmailInput = EMAIL_FIELDS.includes(name);
    const isInstantStudentVerifyField =
      (name === 'studentId' && STUDENT_ID_REGEX.test(String(value).trim())) ||
      (name === 'alumniId' && STUDENT_ID_REGEX.test(String(value).trim())) ||
      (name === 'studentName' && STUDENT_ID_REGEX.test(String(nextData.studentId).trim())) ||
      (name === 'alumniName' && STUDENT_ID_REGEX.test(String(nextData.alumniId).trim()));

    if (isEmailInput || isInstantStudentVerifyField) {
      const targetKey = name === 'studentName' ? 'studentId' : name === 'alumniName' ? 'alumniId' : name;
      setTouchedFields(prev => (prev[targetKey] ? prev : { ...prev, [targetKey]: true }));
    }
    if (isEmailInput || isInstantStudentVerifyField || touchedFields[name] || fieldErrors[name]) {
      const updatedRoleErrors = validateRoleFields(accountType, nextData);
      setFieldErrors(prev => {
        const copy = { ...prev };
        if (updatedRoleErrors[name]) {
          copy[name] = updatedRoleErrors[name];
        } else {
          delete copy[name];
        }
        if (name === 'studentId' || name === 'studentName') {
          if (updatedRoleErrors.studentId) copy.studentId = updatedRoleErrors.studentId;
          else delete copy.studentId;
        }
        if (name === 'alumniId' || name === 'alumniName') {
          if (updatedRoleErrors.alumniId) copy.alumniId = updatedRoleErrors.alumniId;
          else delete copy.alumniId;
        }
        return copy;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const updatedRoleErrors = validateRoleFields(accountType, formData);
    setFieldErrors(prev => {
      const copy = { ...prev };
      if (updatedRoleErrors[name]) {
        copy[name] = updatedRoleErrors[name];
      } else {
        delete copy[name];
      }
      return copy;
    });
  };

  const handleGoogleCompanyRegister = async () => {
    setError(null);
    setActivationNotice(null);
    setIsLoading(true);
    try {
      const storeCompanies = useAppStore.getState().companies || [];
      const profile = await authenticateAndFetchGoogleProfile({
        auth,
        db,
        googleProvider,
        signInWithPopup,
        existingCompanies: storeCompanies,
        formData
      });
      applyGoogleCompanyPrefill(profile);
    } catch (err) {
      console.warn('Google gerçek profil çekme hatası:', err?.message);
      setError(
        err?.message ||
          'Google hesabınızdan bilgi çekilirken bir hata oluştu. Lütfen Google oturumunuzu doğrulayıp tekrar deneyin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const activateAndEnterPortal = (userObj, roleType) => {
    localStorage.removeItem('iesu_admin_session');
    sessionStorage.removeItem('iesu_admin_session');
    localStorage.removeItem('iesu_coordinator_token');
    sessionStorage.removeItem('iesu_coordinator_token');

    const normalizedRole = roleType === 'employer' ? 'company' : roleType;
    const activeUser = {
      ...(userObj || {}),
      role: roleType === 'employer' ? 'employer' : normalizedRole,
      status: 'Aktif',
      onboardingCompleted: true,
      activatedAt: new Date().toISOString()
    };

    try {
      sessionStorage.setItem('iesu_mock_user', JSON.stringify(activeUser));
      sessionStorage.setItem('iesu_user_role_v1', normalizedRole);
      const s = useAppStore.getState();
      s.setUserRole?.(normalizedRole);
      s.setCurrentUser?.(activeUser);
      const branchMap = { student: 'student', alumni: 'alumni', company: 'company', employer: 'company', academic: 'academic' };
      s.setActivePortalBranch?.(branchMap[normalizedRole] || 'student');
    } catch { /* intentional */ }

    if (setCurrentUser) setCurrentUser(activeUser);
    if (setUserRole) setUserRole(normalizedRole);
    setView(normalizedRole);
  };

  const createAccount = async (email, password, mockPrefix) => {
    if (!auth) {
      if (import.meta.env.DEV) {
        console.warn('Firebase Auth hazır değil, geliştirme mock ID atanıyor.');
        return `${mockPrefix}_${Date.now()}`;
      }
      throw new Error(REGISTRATION_UNAVAILABLE_MESSAGE);
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      try {
        if (typeof sendEmailVerification === 'function' && auth.currentUser) {
          await sendEmailVerification(auth.currentUser);
        }
      } catch (_e) {
        /* intentional - don't block registration */
      }
      return userCredential.user.uid;
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-in-use' || authErr.code === 'auth/weak-password') {
        throw authErr;
      }

      if (import.meta.env.DEV) {
        console.warn('Firebase Auth bağlanamadı, geliştirme kaydı kullanılıyor:', authErr.message);
        return `${mockPrefix}_${Date.now()}`;
      }

      throw new Error(REGISTRATION_UNAVAILABLE_MESSAGE);
    }
  };

  const saveProfile = async (userId, profile) => {
    try {
      await setDoc(doc(db, 'users', userId), profile);
      if (profile.role === 'employer' || profile.role === 'company') {
        try {
          await setDoc(doc(db, 'company_profiles', userId), profile);
        } catch { /* intentional */ }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn("Firestore'a kayıt edilemedi, geliştirme verisiyle devam ediliyor:", err);
        return;
      }

      throw new Error(PROFILE_SAVE_FAILED_MESSAGE);
    }
  };

  const handleInstantGoogleCompanyActivate = async () => {
    setError(null);
    const roleValidationErrors = validateRoleFields('employer', formData);
    if (Object.keys(roleValidationErrors).length > 0) {
      setFieldErrors(roleValidationErrors);
      setError(Object.values(roleValidationErrors)[0]);
      return;
    }
    setIsLoading(true);
    const tenantId = tenant?.id || 'iesu';
    try {
      const companyUid = googleLinkedProfile?.uid || (`CMP-GGL-${Date.now()}`);
      const newCompany = {
        id: companyUid,
        tenantId,
        name: formData.companyName.trim(),
        username: formData.email.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        contactName: formData.contactName.trim(),
        title: formData.title.trim(),
        website: formData.website.trim(),
        sector: formData.sector.trim(),
        password: formData.password || '',
        role: 'employer',
        status: 'Aktif',
        onboardingCompleted: true,
        googleVerified: true,
        avatar: companyLogoData || googleLinkedProfile?.avatar || null,
        kvkkConsent: true,
        kvkkConsentDate: new Date().toISOString(),
        activatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      try {
        await saveProfile(companyUid, newCompany);
      } catch { /* intentional for instant Google corporate activation */ }

      if (setCompanies) {
        setCompanies(prev => {
          const list = prev || [];
          const filtered = list.filter(c => c.id !== newCompany.id && String(c.email || '').toLowerCase() !== String(newCompany.email || '').toLowerCase());
          return [...filtered, newCompany];
        });
      }
      setRegisteredUser(newCompany);
      activateAndEnterPortal(newCompany, 'employer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Role-specific dynamic required field & format validation
    const roleValidationErrors = validateRoleFields(accountType, formData);
    if (Object.keys(roleValidationErrors).length > 0) {
      setFieldErrors(roleValidationErrors);
      setError(Object.values(roleValidationErrors)[0]);
      return;
    }

    setFieldErrors({});

    if (formData.password !== formData.passwordConfirm) {
      setError("Şifreler eşleşmiyor! Lütfen kontrol edin.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (!kvkkConsent) {
      setError("Kayıt işlemine devam edebilmek için KVKK Aydınlatma Metnini onaylamanız gerekmektedir.");
      return;
    }

    setIsLoading(true);
    const tenantId = tenant?.id || 'iesu';
    
    try {
      if (accountType === 'student' || accountType === 'alumni') {
        const asyncVerification = await verifyEDevletStudentOrAlumni({
          studentNo: accountType === 'student' ? formData.studentId : formData.alumniId,
          fullName: accountType === 'student' ? formData.studentName : formData.alumniName,
          graduationYear: accountType === 'alumni' ? formData.graduationYear : undefined,
          role: accountType,
        });
        if (!asyncVerification.verified) {
          const targetKey = accountType === 'student' ? 'studentId' : 'alumniId';
          const errMsg = asyncVerification.detail || EDEVLET_NOT_FOUND_MESSAGE;
          setFieldErrors((prev) => ({ ...prev, [targetKey]: errMsg }));
          setError(errMsg);
          setIsLoading(false);
          return;
        }
      }

      if (accountType === 'student') {
        const studentUid = await createAccount(formData.studentEmail, formData.password, 'mock_stu');

        const newStudent = {
          id: studentUid,
          tenantId,
          name: formData.studentName || 'Yeni Öğrenci',
          studentId: formData.studentId,
          email: formData.studentEmail,
          department: formData.studentDepartment || 'Belirtilmedi',
          password: formData.password,
          role: 'student',
          grade: formData.studentGrade || 'Aktif',
          status: 'Aktif',
          internshipStatus: 'Arıyor',
          avatar: null,
          onboardingCompleted: true,
          kvkkConsent: kvkkConsent,
          kvkkConsentDate: new Date().toISOString(),
          activatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await saveProfile(studentUid, newStudent);

        if (setStudents) {
          setStudents(prev => {
            const list = prev || [];
            const filtered = list.filter(s => String(s.studentId || '') !== String(newStudent.studentId || '') && String(s.email || '').toLowerCase() !== String(newStudent.email || '').toLowerCase());
            return [...filtered, newStudent];
          });
        }
        setRegisteredUser(newStudent);
        
      } else if (accountType === 'employer') {
        let companyUid = googleLinkedProfile?.uid || null;
        if (!companyUid) {
          try {
            companyUid = await createAccount(formData.email, formData.password, 'mock_cmp');
          } catch (empAuthErr) {
            if (empAuthErr?.code === 'auth/email-already-in-use' && googleLinkedProfile) {
              companyUid = googleLinkedProfile.uid || `mock_cmp_${Date.now()}`;
            } else {
              throw empAuthErr;
            }
          }
        }

        const newCompany = {
          id: companyUid,
          tenantId,
          name: formData.companyName,
          username: formData.email,
          email: formData.email,
          phone: formData.phone,
          contactName: formData.contactName,
          title: formData.title,
          website: formData.website,
          sector: formData.sector || 'Teknoloji & Bilişim',
          taxNo: formData.taxNo,
          password: formData.password,
          role: 'employer',
          status: 'Aktif',
          onboardingCompleted: true,
          googleVerified: Boolean(googleLinkedProfile),
          avatar: companyLogoData || googleLinkedProfile?.avatar || null,
          kvkkConsent: kvkkConsent,
          kvkkConsentDate: new Date().toISOString(),
          activatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await saveProfile(companyUid, newCompany);
        if (setCompanies) {
          setCompanies(prev => {
            const list = prev || [];
            const filtered = list.filter(c => c.id !== newCompany.id && String(c.email || '').toLowerCase() !== String(newCompany.email || '').toLowerCase());
            return [...filtered, newCompany];
          });
        }
        setRegisteredUser(newCompany);
      } else if (accountType === 'academic') {
        const academicUid = await createAccount(formData.academicEmail, formData.password, 'mock_acad');

        // role=academic is NOT self-selectable (firestore.rules); admin claim promotes later.
        const newAcademic = {
          id: academicUid,
          tenantId,
          name: formData.academicName || 'Yeni Akademisyen',
          staffId: formData.staffId || `AKD-${Date.now().toString().slice(-6)}`,
          email: formData.academicEmail,
          title: formData.academicTitle || 'Akademisyen',
          password: formData.password,
          role: 'alumni',
          requestedRole: 'academic',
          department: formData.academicDepartment || 'Belirtilmedi',
          status: 'Aktif',
          onboardingCompleted: true,
          avatar: null,
          kvkkConsent: kvkkConsent,
          kvkkConsentDate: new Date().toISOString(),
          activatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await saveProfile(academicUid, newAcademic);
        if (setAcademicStaff) {
          setAcademicStaff(prev => {
            const list = prev || [];
            const filtered = list.filter(a => String(a.email || '').toLowerCase() !== String(newAcademic.email || '').toLowerCase());
            return [...filtered, { ...newAcademic, role: 'academic' }];
          });
        }
        setRegisteredUser({ ...newAcademic, role: 'academic' });
      } else if (accountType === 'alumni') {
        const alumniUid = await createAccount(formData.alumniEmail, formData.password, 'mock_alum');

        const newAlumni = {
          id: alumniUid,
          tenantId,
          name: formData.alumniName || 'Yeni Mezun',
          studentId: formData.alumniId,
          email: formData.alumniEmail,
          department: formData.alumniDepartment || 'Belirtilmedi',
          graduationYear: formData.graduationYear || new Date().getFullYear().toString(),
          password: formData.password,
          role: 'alumni',
          status: 'Aktif',
          onboardingCompleted: true,
          avatar: null,
          kvkkConsent: kvkkConsent,
          kvkkConsentDate: new Date().toISOString(),
          activatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        await saveProfile(alumniUid, newAlumni);
        if (setAlumni) {
          setAlumni(prev => {
            const list = prev || [];
            const filtered = list.filter(a => String(a.studentId || '') !== String(newAlumni.studentId || '') && String(a.email || '').toLowerCase() !== String(newAlumni.email || '').toLowerCase());
            return [...filtered, newAlumni];
          });
        }
        setRegisteredUser(newAlumni);
      }
      
      try {
        const regEmail = formData.studentEmail || formData.email || formData.academicEmail || formData.alumniEmail || 'kayitli_kullanici';
        useAdminStore.getState().logAuditAction?.(
          regEmail,
          `Kayıt ve KVKK Onayı: ${accountType.toUpperCase()}`,
          'Kullanıcı & KVKK',
          'info',
          { tenantId, role: accountType, kvkkVersion: 'KVKK-2026-V1' }
        );
      } catch { /* intentional */ }

      localStorage.removeItem('iesu_admin_session');
      sessionStorage.removeItem('iesu_admin_session');
      setStep(2);

    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Bu e-posta adresi zaten kullanımda!');
      else if (err.code === 'auth/weak-password') setError('Şifre çok zayıf. Lütfen daha güçlü bir şifre seçin.');
      else if (err.message === REGISTRATION_UNAVAILABLE_MESSAGE || err.message === PROFILE_SAVE_FAILED_MESSAGE) setError(err.message);
      else setError('Kayıt işlemi tamamlanamadı. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const activeMeta = ROLE_META[accountType] || ROLE_META.alumni;
  const activeEmailField = getEmailFieldForRole(accountType);
  const activeEmailValue = String(formData[activeEmailField] || '').trim();
  const isActiveEmailValid = activeEmailValue.length > 0 && isValidEmailFormat(activeEmailValue);
  const hasInvalidTypedEmail = activeEmailValue.length > 0 && !isActiveEmailValid;

  const getInputClass = (fieldName, extra = '') => {
    const hasErr = Boolean(fieldErrors[fieldName]);
    const isValidEmailField = EMAIL_FIELDS.includes(fieldName) && String(formData[fieldName] || '').trim().length > 0 && !hasErr && isValidEmailFormat(formData[fieldName]);
    return `w-full h-12 pl-11 pr-10 border rounded-2xl outline-none text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium transition-all duration-200 ${
      hasErr
        ? 'bg-red-50/70 dark:bg-red-950/30 border-red-400 focus:bg-white dark:focus:bg-slate-800 focus:border-red-500 focus:ring-4 focus:ring-red-500/15'
        : isValidEmailField
        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15'
        : 'bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border-slate-200/90 dark:border-slate-700 hover:border-slate-300 focus:bg-white dark:focus:bg-slate-800 focus:border-[#dc2626] focus:ring-4 focus:ring-[#dc2626]/15 shadow-2xs'
    } ${extra}`.trim();
  };

  const renderFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      return (
        <p data-testid={`field-error-${fieldName}`} role="alert" className="mt-1.5 pl-1 text-[11px] font-bold text-red-600 dark:text-rose-400 flex items-center gap-1">
          <AlertCircle size={12} className="shrink-0" />
          <span>{fieldErrors[fieldName]}</span>
        </p>
      );
    }
    if (EMAIL_FIELDS.includes(fieldName) && String(formData[fieldName] || '').trim().length > 0 && isValidEmailFormat(formData[fieldName])) {
      return (
        <p data-testid={`email-valid-${fieldName}`} className="mt-1.5 pl-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <CheckCircle2 size={12} className="shrink-0" />
          <span>Geçerli e-posta formatı doğrulandı.</span>
        </p>
      );
    }
    if ((fieldName === 'studentId' || fieldName === 'alumniId') && STUDENT_ID_REGEX.test(String(formData[fieldName] || '').trim())) {
      const instantCheck = verifyEDevletStudentOrAlumniSync({
        studentNo: formData[fieldName],
        fullName: fieldName === 'studentId' ? formData.studentName : formData.alumniName,
        role: fieldName === 'studentId' ? 'student' : 'alumni',
      });
      if (instantCheck.verified) {
        return (
          <p data-testid={`edevlet-verified-${fieldName}`} className="mt-1.5 pl-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} className="shrink-0" />
            <span>Kayıtlı öğrenci/mezun bilgisi doğrulandı ({instantCheck.fullName}).</span>
          </p>
        );
      }
    }
    return null;
  };

  const renderEmailStatusIcon = (fieldName) => {
    const val = String(formData[fieldName] || '').trim();
    if (!val && !fieldErrors[fieldName]) return null;
    if (fieldErrors[fieldName] || !isValidEmailFormat(val)) {
      return <AlertCircle size={17} data-testid={`email-invalid-icon-${fieldName}`} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none" />;
    }
    return <CheckCircle2 size={17} data-testid={`email-valid-icon-${fieldName}`} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />;
  };

  // Conditionally renders role-specific required fields based on selected user role
  const renderRoleSpecificFields = () => {
    if (accountType === 'student') {
      return (
        <div data-testid="role-specific-fields-student" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-1">
            <label htmlFor="studentId" className="sr-only">Öğrenci Numarası</label>
            <div className="relative group">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="studentId"
                aria-label="Öğrenci Numarası"
                type="text"
                name="studentId"
                pattern="[0-9]{9,11}"
                value={formData.studentId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Öğrenci Numarası (Örn: 202315130)"
                className={getInputClass('studentId', 'tabular-nums')}
                required
              />
            </div>
            {renderFieldError('studentId')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="studentName" className="sr-only">Ad Soyadı</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="studentName"
                aria-label="Ad Soyadı"
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Adınız ve Soyadınız"
                className={getInputClass('studentName')}
                required
              />
            </div>
            {renderFieldError('studentName')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="studentDepartment" className="sr-only">Bölüm</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="studentDepartment"
                aria-label="Bölüm"
                type="text"
                name="studentDepartment"
                value={formData.studentDepartment}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Bölüm (Örn: Yazılım Mühendisliği)"
                className={getInputClass('studentDepartment')}
                required
              />
            </div>
            {renderFieldError('studentDepartment')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="studentGrade" className="sr-only">Sınıf</label>
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <select
                id="studentGrade"
                aria-label="Sınıf"
                name="studentGrade"
                value={formData.studentGrade}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass('studentGrade')}
                required
              >
                <option value="Hazırlık">Hazırlık</option>
                <option value="1. Sınıf">1. Sınıf</option>
                <option value="2. Sınıf">2. Sınıf</option>
                <option value="3. Sınıf">3. Sınıf</option>
                <option value="4. Sınıf">4. Sınıf</option>
                <option value="Yüksek Lisans">Yüksek Lisans</option>
              </select>
            </div>
            {renderFieldError('studentGrade')}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="studentEmail" className="sr-only">E-Posta Adresi</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="studentEmail"
                aria-label="E-Posta Adresi"
                aria-invalid={Boolean(fieldErrors.studentEmail)}
                type="email"
                name="studentEmail"
                value={formData.studentEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Öğrenci E-Posta Adresi (ornek@ogrenci.esenyurt.edu.tr)"
                className={getInputClass('studentEmail')}
                required
              />
              {renderEmailStatusIcon('studentEmail')}
            </div>
            {renderFieldError('studentEmail')}
          </div>
        </div>
      );
    }

    if (accountType === 'alumni') {
      return (
        <div data-testid="role-specific-fields-alumni" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-1">
            <label htmlFor="alumniName" className="sr-only">Ad Soyadı</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="alumniName"
                aria-label="Ad Soyadı"
                type="text"
                name="alumniName"
                value={formData.alumniName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Adınız ve Soyadınız"
                className={getInputClass('alumniName')}
                required
              />
            </div>
            {renderFieldError('alumniName')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="alumniId" className="sr-only">Öğrenci Numarası</label>
            <div className="relative group">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="alumniId"
                aria-label="Öğrenci Numarası"
                type="text"
                name="alumniId"
                pattern="[0-9]{9,11}"
                value={formData.alumniId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Öğrenci Numaranız"
                className={getInputClass('alumniId', 'tabular-nums')}
                required
              />
            </div>
            {renderFieldError('alumniId')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="alumniDepartment" className="sr-only">Mezun Olunan Bölüm</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="alumniDepartment"
                aria-label="Mezun Olunan Bölüm"
                type="text"
                name="alumniDepartment"
                value={formData.alumniDepartment}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Mezun Olunan Bölüm"
                className={getInputClass('alumniDepartment')}
                required
              />
            </div>
            {renderFieldError('alumniDepartment')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="graduationYear" className="sr-only">Mezuniyet Yılı</label>
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="graduationYear"
                aria-label="Mezuniyet Yılı"
                type="text"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Mezuniyet Yılı (Örn: 2024)"
                className={getInputClass('graduationYear', 'tabular-nums')}
                required
              />
            </div>
            {renderFieldError('graduationYear')}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="alumniEmail" className="sr-only">E-Posta Adresi</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="alumniEmail"
                aria-label="E-Posta Adresi"
                aria-invalid={Boolean(fieldErrors.alumniEmail)}
                type="email"
                name="alumniEmail"
                value={formData.alumniEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="E-Posta Adresiniz"
                className={getInputClass('alumniEmail')}
                required
              />
              {renderEmailStatusIcon('alumniEmail')}
            </div>
            {renderFieldError('alumniEmail')}
          </div>
        </div>
      );
    }

    if (accountType === 'academic') {
      return (
        <div data-testid="role-specific-fields-academic" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="sm:col-span-1">
            <label htmlFor="academicName" className="sr-only">Ad Soyadı</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="academicName"
                aria-label="Ad Soyadı"
                type="text"
                name="academicName"
                value={formData.academicName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Adınız ve Soyadınız"
                className={getInputClass('academicName')}
                required
              />
            </div>
            {renderFieldError('academicName')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="academicTitle" className="sr-only">Unvan</label>
            <div className="relative group">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="academicTitle"
                aria-label="Unvan"
                type="text"
                name="academicTitle"
                value={formData.academicTitle}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Akademik Unvan (Prof. Dr., Doç. Dr.)"
                className={getInputClass('academicTitle')}
                required
              />
            </div>
            {renderFieldError('academicTitle')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="academicDepartment" className="sr-only">Bölüm / Fakülte</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="academicDepartment"
                aria-label="Bölüm / Fakülte"
                type="text"
                name="academicDepartment"
                value={formData.academicDepartment}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Bölüm / Fakülte"
                className={getInputClass('academicDepartment')}
                required
              />
            </div>
            {renderFieldError('academicDepartment')}
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="academicEmail" className="sr-only">Kurumsal E-Posta Adresi</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
              <input
                id="academicEmail"
                aria-label="Kurumsal E-Posta Adresi"
                aria-invalid={Boolean(fieldErrors.academicEmail)}
                type="email"
                name="academicEmail"
                value={formData.academicEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Kurumsal E-Posta (@esenyurt.edu.tr)"
                className={getInputClass('academicEmail')}
                required
              />
              {renderEmailStatusIcon('academicEmail')}
            </div>
            {renderFieldError('academicEmail')}
          </div>
        </div>
      );
    }

    // Employer / Corporate role-specific fields (without tax number)
    return (
      <div data-testid="role-specific-fields-employer" className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="sm:col-span-2">
          <label htmlFor="companyName" className="sr-only">Şirket / Kurum Adı</label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
            <input
              id="companyName"
              aria-label="Şirket / Kurum Adı"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Şirket / Kurum Adı"
              className={getInputClass('companyName')}
              required
            />
          </div>
          {renderFieldError('companyName')}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="sector" className="sr-only">Faaliyet Sektörü</label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
            <input
              id="sector"
              aria-label="Faaliyet Sektörü"
              type="text"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Faaliyet Sektörü (Örn: Teknoloji)"
              className={getInputClass('sector')}
              required
            />
          </div>
          {renderFieldError('sector')}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="website" className="sr-only">Şirket Web Sayfası / İletişim URL</label>
          <div className="relative group">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
            <input
              id="website"
              aria-label="Şirket Web Sayfası / İletişim URL"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Web Adresi (https://...)"
              className={getInputClass('website')}
              required
            />
          </div>
          {renderFieldError('website')}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="contactName" className="sr-only">Yetkili Adı Soyadı</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
            <input
              id="contactName"
              aria-label="Yetkili Adı Soyadı"
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Yetkili Adı ve Soyadı"
              className={getInputClass('contactName')}
              required
            />
          </div>
          {renderFieldError('contactName')}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="title" className="sr-only">Firmadaki Görev Tanımı / Unvan</label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
            <input
              id="title"
              aria-label="Firmadaki Görev Tanımı / Unvan"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Yetkili Görev / Unvan (Örn: İK Direktörü)"
              className={getInputClass('title')}
              required
            />
          </div>
          {renderFieldError('title')}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="email" className="sr-only">Yetkili Kurumsal E-Posta</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
            <input
              id="email"
              aria-label="Yetkili Kurumsal E-Posta"
              aria-invalid={Boolean(fieldErrors.email)}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Yetkili Kurumsal E-Posta"
              className={getInputClass('email')}
              required
            />
            {renderEmailStatusIcon('email')}
          </div>
          {renderFieldError('email')}
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="phone" className="sr-only">Yetkili Telefon Numarası</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
            <input
              id="phone"
              aria-label="Yetkili Telefon Numarası"
              type="tel"
              pattern="[0-9]{10,11}"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Telefon (05XX XXX XX XX)"
              className={getInputClass('phone', 'tabular-nums')}
              required
            />
          </div>
          {renderFieldError('phone')}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="companyLogo"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#dc2626]/50 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
              <Upload size={16} className="text-slate-400 group-hover:text-[#dc2626] transition-colors" />
              <span>{companyLogoData ? 'Kurumsal Logo Yüklendi (Değiştirmek için tıklayın)' : 'Kurumsal Firma Logosu Yükle (İsteğe Bağlı)'}</span>
            </div>
            <span className="text-[11px] font-bold text-[#990000] dark:text-rose-400 bg-red-50 dark:bg-slate-700 px-2.5 py-1 rounded-lg">
              Dosya Seç
            </span>
            <input
              id="companyLogo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setCompanyLogoData(ev.target?.result);
                  reader.readAsDataURL(file);
                }
              }}
              className="sr-only"
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden bg-slate-950 py-10 px-4">
      {/* Background with Campus Image & Deep Gradient Overlay (Matching Login.jsx) */}
      <img
        src="https://panel.esenyurt.edu.tr/assets/2026/resimler/hitm/519cc07174684619b555d5bb4eecac4f_b54816bd1b5941a595a60eb469b5b4c7.jpg"
        alt="İESÜ Kampüs"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-75 scale-105 fixed"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/90 fixed" />

      {/* Top Left Back to Login Button */}
      <button
        type="button"
        onClick={() => setView('login')}
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white text-xs font-extrabold transition-all cursor-pointer shadow-lg hover:-translate-x-0.5"
      >
        <ArrowLeft size={16} />
        <span>Giriş Ekranına Dön</span>
      </button>

      {/* Top Right Language & Theme Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2.5">
        <LanguageSwitcher variant="dark" />
        <ThemeToggle variant="header" />
      </div>

      {/* Centered Container Matching Login.jsx */}
      <div className="relative z-10 w-full max-w-xl p-2 sm:p-4 mt-6 sm:mt-0">
        {/* Header Title with Official Full-Size White Logo */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div
            onClick={() => setView('landing')}
            className="mb-3.5 cursor-pointer hover:scale-105 transition-transform"
            title="Ana Sayfa"
          >
            <Logo size="xl" variant="white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider text-center drop-shadow-md">
            İstanbul Esenyurt Üniversitesi
          </h1>
          <p className="text-[11px] text-red-200 font-extrabold tracking-widest mt-1 text-center">
            Kariyer Geliştirme Koordinatörlüğü
          </p>
        </div>

        {/* Main Glassmorphic Card with Top Crimson Line */}
        <div className="bg-[#f8f9fa]/95 dark:bg-slate-900/95 backdrop-blur-2xl text-slate-900 dark:text-slate-100 rounded-[32px] shadow-2xl p-6 sm:p-9 relative overflow-hidden border-t-4 border-[#dc2626] dark:border-x dark:border-b dark:border-slate-800 transition-colors duration-300">
          {error && (
            <div className="mb-5 p-4 bg-red-50 dark:bg-red-950/50 border-l-4 border-red-600 text-red-700 dark:text-rose-300 rounded-r-xl font-bold text-xs sm:text-sm flex items-center gap-2.5">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activationNotice && !error && step === 1 && (
            <div data-testid="activation-prefill-notice" className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-600 text-emerald-900 dark:text-emerald-200 rounded-r-xl font-bold text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{activationNotice}</span>
            </div>
          )}

          {step === 1 ? (
            <>
              {/* Role Selector Pill Tabs (Öğrenci, Mezun ve Kurumsal Firma — Akademik kapalı) */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800 rounded-2xl mb-6">
                {(['student', 'alumni', 'employer']).map((roleKey) => {
                  const meta = ROLE_META[roleKey];
                  const isActive = accountType === roleKey;
                  const IconComp = roleKey === 'employer' ? Building2 : roleKey === 'student' ? User : GraduationCap;
                  return (
                    <button
                      key={roleKey}
                      type="button"
                      onClick={() => { setAccountType(roleKey); setActivationNotice(null); setError(null); setFieldErrors({}); setTouchedFields({}); }}
                      className={`flex-1 py-2.5 px-2.5 text-[12px] sm:text-[13px] font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-[#990000] text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <IconComp size={15} />
                      <span>{meta.tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              {/* Employer Google Quick Autofill Integration */}
              {accountType === 'employer' && (
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={handleGoogleCompanyRegister}
                    disabled={isLoading}
                    data-testid="google-company-register-btn"
                    className="w-full flex items-center justify-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 text-slate-800 dark:text-slate-100 h-12 px-4 rounded-2xl transition-all shadow-xs font-bold text-xs sm:text-sm cursor-pointer active:scale-[0.99]"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>{googleLinkedProfile ? 'Google Kurumsal Bilgileri Güncelle / Yeniden Yansıt' : 'Google ile Firma Bilgilerini Doldur & Kurumsal Kayıt Ol'}</span>
                  </button>

                  {googleLinkedProfile && (
                    <div data-testid="google-company-reflected-card" className="mt-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <SafeAvatar
                          src={companyLogoData || googleLinkedProfile.avatar}
                          name={formData.contactName || googleLinkedProfile.contactName || googleLinkedProfile.email}
                          className="w-10 h-10 rounded-xl border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                            {googleLinkedProfile.hostedDomain
                              ? `Google Workspace (${googleLinkedProfile.hostedDomain}) Doğrulandı`
                              : 'Google Hesabı Doğrulandı'}
                          </p>
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                            {formData.contactName || googleLinkedProfile.contactName || googleLinkedProfile.email}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                            {formData.email || googleLinkedProfile.email}
                            {formData.companyName ? ` · ${formData.companyName}` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleInstantGoogleCompanyActivate}
                        disabled={isLoading}
                        data-testid="instant-company-activate-btn"
                        className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs transition active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Hemen Aktifleştir & Firma Portalına Geç
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Unified Dynamic Registration Form */}
              <form className="space-y-4" onSubmit={handleSubmit} noValidate data-testid={`registration-form-${accountType}`}>
                {/* Dynamic Role-Specific Fields */}
                {renderRoleSpecificFields()}

                {/* Shared Password & Account Security Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label htmlFor={`${accountType}Password`} className="sr-only">Yeni Şifre</label>
                    <div className="relative group">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
                      <input
                        id={`${accountType}Password`}
                        aria-label="Yeni Şifre"
                        type="password"
                        name="password"
                        minLength={6}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Yeni Şifre (En az 6 karakter)"
                        className="w-full h-12 pl-11 pr-4 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-[#dc2626] focus:ring-4 focus:ring-[#dc2626]/15 outline-none text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium shadow-2xs transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${accountType}PasswordConfirm`} className="sr-only">Yeni Şifre Tekrar</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dc2626] transition-colors pointer-events-none" size={17} />
                      <input
                        id={`${accountType}PasswordConfirm`}
                        aria-label="Yeni Şifre Tekrar"
                        type="password"
                        name="passwordConfirm"
                        minLength={6}
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        placeholder="Yeni Şifre (Tekrar)"
                        className="w-full h-12 pl-11 pr-4 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-[#dc2626] focus:ring-4 focus:ring-[#dc2626]/15 outline-none text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-medium shadow-2xs transition-all duration-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Clean KVKK Consent Row */}
                <div className="pt-1 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id={`kvkk-check-${accountType}`}
                    checked={kvkkConsent}
                    onChange={(e) => setKvkkConsent(e.target.checked)}
                    required
                    aria-required="true"
                    className="mt-0.5 rounded border-slate-300 text-[#dc2626] focus:ring-[#dc2626] cursor-pointer"
                  />
                  <label htmlFor={`kvkk-check-${accountType}`} className="text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer leading-relaxed">
                    6698 sayılı{' '}
                    <button type="button" onClick={() => setView?.('kvkk')} className="text-[#dc2626] dark:text-rose-400 font-extrabold hover:underline cursor-pointer">
                      KVKK Aydınlatma Metni
                    </button>
                    &apos;ni okudum, {activeMeta.kvkkText}
                  </label>
                </div>

                <button
                  disabled={isLoading || hasInvalidTypedEmail}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-2xl transition-all shadow-lg hover:shadow-red-600/30 active:scale-[0.98] mt-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  <span>{activeMeta.submitLabel}</span>
                  {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6" data-testid="registration-activation-success">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 flex items-center justify-center mx-auto mb-5 shadow-xs">
                <CheckCircle2 size={34} className="text-emerald-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Hesap Aktivasyonu Tamamlandı
              </h2>
              <div className="mb-5 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-full">
                <ShieldCheck size={14} /> Kayıt ve Hesap Aktivasyonu Başarılı
              </div>

              {registeredUser && (
                <div className="max-w-md mx-auto mb-6 p-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl text-left shadow-xs">
                  <div className="flex items-center justify-between mb-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Aktifleştirilen Hesap Özeti</span>
                    <span className="text-emerald-600 font-extrabold">{registeredUser.status || 'Aktif'}</span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{registeredUser.name}</p>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">{registeredUser.email}</p>
                  {(registeredUser.department || registeredUser.sector) && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {registeredUser.sector || registeredUser.department}
                    </p>
                  )}
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-7 font-medium">
                {accountType === 'student'
                  ? 'Öğrenci hesabınız başarıyla oluşturuldu. Staj, Ulusal Staj Programı ve kariyer araçlarını kullanmak için Öğrenci Portalına geçebilirsiniz.'
                  : accountType === 'employer'
                    ? 'Kurumsal firma kaydınız ve hesap aktivasyonunuz Kariyer Geliştirme Koordinatörlüğü sisteminde tamamlanmıştır. Şimdi doğrudan Firma Portalına geçiş yapabilirsiniz.'
                    : "Mezun hesabınız başarıyla oluşturuldu ve aktifleştirildi. İESÜ Mezunlar Portalı'na hemen giriş yapabilirsiniz."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  type="button"
                  data-testid="complete-activation-enter-btn"
                  onClick={() => activateAndEnterPortal(registeredUser, accountType === 'student' ? 'student' : accountType === 'employer' ? 'employer' : 'alumni')}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-[#990000] hover:bg-red-800 text-white font-extrabold text-sm py-3.5 px-7 rounded-2xl transition-all shadow-lg active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  {accountType === 'student' ? 'Öğrenci Portalına Giriş Yap & Devam Et' : accountType === 'employer' ? 'Firma Portalına Giriş Yap & Devam Et' : 'Mezun Portalına Giriş Yap & Devam Et'}
                </button>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300/80 text-slate-700 dark:text-slate-200 font-bold text-sm py-3.5 px-5 rounded-2xl transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  Giriş Ekranına Dön
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



