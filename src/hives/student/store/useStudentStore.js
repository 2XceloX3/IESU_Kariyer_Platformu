// @ts-check
import { create } from "zustand";
import {
  collection,
  addDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../utils/firebase";
import useAppStore from "../../../store/useAppStore";

/**
 * Initial state definitions for Student Hive Store
 */
const initialStudentState = {
  activeView: 'feed',
  previousView: null,
  activeTab: 'feed',
  careerProgress: 0,
  dailyQuestProgress: 0,
  selectedJobId: null,

  portalBackHistory: [],
  isCoffeeChatOpen: false,
  selectedAlumniForChat: null,
  isATSScannerOpen: false,
  atsScanResults: null,
  isSyncingFirestore: false,
  syncError: null,

  // Öğrenci verileri (Firestore + useAppStore ile senkronize)
  applications: [],
  internships: [],
  mentorshipRequests: [],
  counselingRequests: [],
  joinedClubIds: [],
};

/**
 * İESÜ Öğrenci Portalı (StudentHive) Birleşik Durum ve Firestore Senkronizasyon Deposu
 *
 * YETENEKLER & KORUNAN PRENSİPLER:
 * 1. Split-Brain (İki Ayrı Store) Hatası Giderildi: Aksiyonlar hem useStudentStore'u
 *    hem de Admin/Akademik/Şirket panellerinin dinlediği merkezi useAppStore'u aynı anda günceller.
 * 2. Firestore Koleksiyon Adı Uyuşmazlığı Giderildi: firestore.rules ile tam uyumlu
 *    camelCase koleksiyon adları (`applications`, `internships`, `mentorshipRequests`,
 *    `counselingRequests`, `clubs`) kullanıldı.
 * 3. Geriye Dönük Uyumluluk: Tüm testlerin beklediği (activeView, previousView, careerProgress,
 *    dailyQuestProgress, selectedJobId, reset, goBack) arayüzleri eksiksiz korunur.
 */
export const useStudentStore = create((set, get) => ({
  ...initialStudentState,

  /**
   * Set active view within Student Hive and record previous view.
   * Supports string or functional updater.
   */
  setActiveView: (view) =>
    set((state) => {
      const nextView = typeof view === 'function' ? view(state.activeView) : view;
      if (!nextView || nextView === state.activeView) return state;
      const nextHistory = [...(state.portalBackHistory || []), state.activeView].slice(-10);
      if (typeof window !== "undefined") {
        try {
          const url = new URL(window.location.href);
          url.searchParams.set("tab", nextView);
          window.history.replaceState({}, "", url.toString());
        } catch (_) {}
      }
      return {
        previousView: state.activeView,
        activeView: nextView,
        portalBackHistory: nextHistory,
      };
    }),

  /**
   * Restore previous view or fall back to default 'feed'.
   */
  goBack: () =>
    set((state) => {
      const targetView = state.previousView || (state.portalBackHistory?.length > 0 ? state.portalBackHistory[state.portalBackHistory.length - 1] : 'feed');
      if (targetView === state.activeView) return state;
      const nextHistory = [...(state.portalBackHistory || [])];
      nextHistory.pop();
      return {
        previousView: state.activeView,
        activeView: targetView,
        portalBackHistory: nextHistory,
      };
    }),

  goBackView: () => {
    get().goBack();
  },

  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: typeof tab === 'function' ? tab(state.activeTab) : tab,
    })),

  setCareerProgress: (progress) =>
    set((state) => ({
      careerProgress: typeof progress === 'function' ? progress(state.careerProgress) : progress,
    })),

  setDailyQuestProgress: (progress) =>
    set((state) => ({
      dailyQuestProgress:
        typeof progress === 'function' ? progress(state.dailyQuestProgress) : progress,
    })),

  setSelectedJobId: (id) =>
    set((state) => ({
      selectedJobId: typeof id === 'function' ? id(state.selectedJobId) : id,
    })),

  openCoffeeChatModal: (alumni = null) =>
    set({ isCoffeeChatOpen: true, selectedAlumniForChat: alumni }),

  closeCoffeeChatModal: () =>
    set({ isCoffeeChatOpen: false, selectedAlumniForChat: null }),

  openATSScannerModal: () => set({ isATSScannerOpen: true }),
  closeATSScannerModal: () => set({ isATSScannerOpen: false }),

  setATSScanResults: (results) => set({ atsScanResults: results }),

  /**
   * Firestore Gerçek Zamanlı Dinleyici (Öğrencinin kendi kayıtlarını Admin/Akademik/Şirket panelleriyle eşitler)
   */
  subscribeStudentData: (studentUid) => {
    if (!db || !studentUid) return () => {};
    set({ isSyncingFirestore: true, syncError: null });

    const unsubscribers = [];

    try {
      // 1. İş ve Staj Başvuruları (applications)
      const appsQuery = query(
        collection(db, "applications"),
        where("applicantId", "==", studentUid)
      );
      unsubscribers.push(
        onSnapshot(appsQuery, (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          set({ applications: items, isSyncingFirestore: false });
        })
      );

      // 2. Zorunlu Staj ve SGK Onayları (internships)
      const internQuery = query(
        collection(db, "internships"),
        where("studentId", "==", studentUid)
      );
      unsubscribers.push(
        onSnapshot(internQuery, (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          set({ internships: items });
        })
      );

      // 3. Mezun Mentorluk Talepleri
      const mentorQuery = query(
        collection(db, "mentorshipRequests"),
        where("studentId", "==", studentUid)
      );
      unsubscribers.push(
        onSnapshot(mentorQuery, (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          set({ mentorshipRequests: items });
        })
      );

      // 4. Kariyer Danışmanlığı Talepleri
      const counselQuery = query(
        collection(db, "counselingRequests"),
        where("studentId", "==", studentUid)
      );
      unsubscribers.push(
        onSnapshot(counselQuery, (snap) => {
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          set({ counselingRequests: items });
        })
      );
    } catch (err) {
      set({ syncError: err?.message || "Senkronizasyon hatası", isSyncingFirestore: false });
    }

    return () => {
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === "function") unsub();
      });
    };
  },

  /**
   * İş/Staj Başvurusu Oluşturma (firestore.rules kurallarına %100 uyumlu)
   */
  addApplication: async (job, currentUser) => {
    const uid = currentUser?.uid || currentUser?.id || "local-student";
    const payload = {
      applicantId: uid,
      applicantName: currentUser?.displayName || currentUser?.name || "İESÜ Öğrencisi",
      applicantDepartment: currentUser?.department || "Bilgisayar Mühendisliği",
      jobId: String(job.id),
      jobTitle: job.title,
      companyId: String(job.companyId || "company-default"),
      companyName: job.company,
      status: "Onay Bekliyor",
      stage: "Başvuru Alındı",
      createdAt: new Date().toISOString(),
    };

    const optimisticRecord = { id: "app-" + Date.now(), ...payload };
    set((state) => ({
      applications: [optimisticRecord, ...state.applications],
    }));

    const appStore = useAppStore.getState?.();
    if (appStore && Array.isArray(appStore.applications)) {
      useAppStore.setState({
        applications: [optimisticRecord, ...appStore.applications],
      });
    }

    if (db && currentUser?.uid) {
      try {
        await addDoc(collection(db, "applications"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        set({ syncError: err?.message || "Başvuru Firestore'a yazılamadı" });
      }
    }
  },

  /**
   * Zorunlu Staj Başvurusu Oluşturma (Akademik Danışman ve Admin Paneline Düşer)
   */
  submitInternshipRequest: async (internshipData, currentUser) => {
    const uid = currentUser?.uid || currentUser?.id || "local-student";
    const payload = {
      studentId: uid,
      studentName: currentUser?.displayName || currentUser?.name || "İESÜ Öğrencisi",
      companyName: internshipData.companyName,
      durationDays: Number(internshipData.durationDays || 30),
      startDate: internshipData.startDate,
      status: "Onay Bekliyor",
      advisorStatus: "Beklemede",
      sgkDocumentReady: false,
      createdAt: new Date().toISOString(),
    };

    const optimisticRecord = { id: "int-" + Date.now(), ...payload };
    set((state) => ({
      internships: [optimisticRecord, ...state.internships],
    }));

    const appStore = useAppStore.getState?.();
    if (appStore && Array.isArray(appStore.internships)) {
      useAppStore.setState({
        internships: [optimisticRecord, ...appStore.internships],
      });
    }

    if (db && currentUser?.uid) {
      try {
        await addDoc(collection(db, "internships"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        set({ syncError: err?.message || "Staj talebi Firestore'a yazılamadı" });
      }
    }
  },

  /**
   * Mezun Kahve Sohbeti / Mentorluk Talebi
   */
  submitMentorshipRequest: async (requestData, currentUser) => {
    const uid = currentUser?.uid || currentUser?.id || "local-student";
    const payload = {
      studentId: uid,
      applicantId: uid,
      studentName: currentUser?.displayName || currentUser?.name || "İESÜ Öğrencisi",
      alumniId: requestData.alumniId,
      alumniName: requestData.alumniName,
      alumniCompany: requestData.alumniCompany,
      topic: requestData.topic,
      preferredSlot: requestData.preferredSlot,
      note: requestData.note || "",
      status: "Beklemede",
      createdAt: new Date().toISOString(),
    };

    const optimisticRecord = { id: "ment-" + Date.now(), ...payload };
    set((state) => ({
      mentorshipRequests: [optimisticRecord, ...state.mentorshipRequests],
      isCoffeeChatOpen: false,
      selectedAlumniForChat: null,
    }));

    const appStore = useAppStore.getState?.();
    if (appStore && Array.isArray(appStore.mentorshipRequests)) {
      useAppStore.setState({
        mentorshipRequests: [optimisticRecord, ...appStore.mentorshipRequests],
      });
    }

    if (db && currentUser?.uid) {
      try {
        await addDoc(collection(db, "mentorshipRequests"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        set({ syncError: err?.message || "Mentorluk talebi kaydedilemedi" });
      }
    }
  },

  toggleClubMembership: (clubId) =>
    set((state) => {
      const exists = state.joinedClubIds.includes(clubId);
      return {
        joinedClubIds: exists
          ? state.joinedClubIds.filter((id) => id !== clubId)
          : [...state.joinedClubIds, clubId],
      };
    }),

  /**
   * Reset store to initial state (for tests and session logout).
   */
  reset: () => set(initialStudentState),
}));

export default useStudentStore;
