import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../components/shared/Toast';

const StudentRegisterPage = ({ authService }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentNo: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authService && authService.register) {
         await authService.register(formData);
      } else {
         throw new Error("mock error");
      }

      toast.success('Kayıt başarılı! E-postanızı doğrulayın.');

      // Formu temizle ve Login'e yönlendir
      setFormData({
        studentNo: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      navigate('/login');

    } catch (error) {
      console.error("Kayıt hatası:", error);

      if (error.code === 'auth/email-already-in-use') {
        toast.error('Bu e-posta adresi zaten kullanımda. Lütfen başka bir tane deneyin.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Şifreniz çok zayıf. Lütfen daha güçlü bir şifre seçin.');
      } else {
        toast.error('Kayıt olurken bir hata oluştu: ' + (error.message || "Bilinmeyen hata"));
      }
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit} data-testid="register-form">
            <button type="submit">Register</button>
        </form>
    </div>
  );
};

export default StudentRegisterPage;
