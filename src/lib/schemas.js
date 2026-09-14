import { z } from 'zod';

export const jobApplicationSchema = z.object({
  fullName: z.string().min(2, { message: "Ad Soyad en az 2 karakter olmalıdır" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  phone: z.string().min(10, { message: "Telefon numarası en az 10 hane olmalıdır" }),
  university: z.string().min(2, { message: "Üniversite adı gereklidir" }),
  department: z.string().min(2, { message: "Bölüm adı gereklidir" }),
  gpa: z.number().min(0).max(4.0, { message: "GPA 0.00 - 4.00 arasında olmalıdır" }).optional(),
  coverLetter: z.string().min(20, { message: "Önyazı en az 20 karakter olmalıdır" }),
  termsAccepted: z.boolean().refine(val => val === true, { message: "Kullanım şartlarını kabul etmelisiniz" })
});

export const dietitianAppointmentSchema = z.object({
  studentId: z.string().min(5, { message: "Öğrenci numarası gereklidir" }),
  weight: z.number().min(30, { message: "Geçerli bir kilo giriniz (kg)" }).max(250),
  height: z.number().min(100, { message: "Geçerli bir boy giriniz (cm)" }).max(230),
  age: z.number().min(16).max(99),
  gender: z.enum(["male", "female", "other"]),
  notes: z.string().optional()
});

export const clubApplicationSchema = z.object({
  clubId: z.string().min(1, { message: "Kulüp seçimi gereklidir" }),
  motivation: z.string().min(15, { message: "Motivasyon açıklaması en az 15 karakter olmalıdır" }),
  experience: z.string().optional()
});
