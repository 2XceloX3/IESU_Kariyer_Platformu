

export const STUDENTS = [
  { id:'STD-001', name:'Ayşe Kaya',      dept:'Bilgisayar Müh.', year:3, gpa:3.4, cv:true,  status:'Aktif' },
  { id:'STD-002', name:'Mehmet Demir',   dept:'Endüstri Müh.',   year:4, gpa:2.9, cv:false, status:'Aktif' },
  { id:'STD-003', name:'Elif Şahin',     dept:'İşletme',         year:2, gpa:3.8, cv:true,  status:'Aktif' },
  { id:'STD-004', name:'Burak Yılmaz',   dept:'Yazılım Müh.',    year:3, gpa:3.1, cv:true,  status:'Pasif' },
  { id:'STD-005', name:'Selin Çelik',    dept:'Makine Müh.',     year:4, gpa:3.6, cv:false, status:'Aktif' },
  { id:'STD-006', name:'Can Arslan',     dept:'Elektrik Müh.',   year:1, gpa:3.2, cv:false, status:'Aktif' },
  { id:'STD-007', name:'Zeynep Kurt',    dept:'Bilgisayar Müh.', year:4, gpa:3.9, cv:true,  status:'Aktif' },
  { id:'STD-008', name:'Emre Doğan',     dept:'İnşaat Müh.',     year:2, gpa:2.7, cv:false, status:'Aktif' },
  { id:'STD-009', name:'Seda Tunç',      dept:'İşletme',         year:3, gpa:3.5, cv:true,  status:'Aktif' },
  { id:'STD-010', name:'Tarık Polat',    dept:'Yazılım Müh.',    year:1, gpa:2.5, cv:false, status:'Aktif' },
];

export const ALUMNI = [];
export const COMPANIES = [];
export const ALUMNI_CARDS = [];
export const JOBS_INIT = [];
export const MENTORSHIPS_INIT = [];
export const VOLUNTEER_INIT = [];
export const MESSAGES_INIT = [];

export const SURVEYS_INIT = [
  { id:'SRV-001', title:'Kariyer Beklentileri Anketi 2026', responses:87, total:120, status:'Aktif',  date:'01.07.2026' },
  { id:'SRV-002', title:'Staj Memnuniyet Anketi',          responses:34, total:50,  status:'Kapandı', date:'15.06.2026' },
  { id:'SRV-003', title:'SEM Kurs Değerlendirmesi',        responses:12, total:30,  status:'Aktif',  date:'05.07.2026' },
];

export const SEM_INIT = [
  { id:'SEM-001', title:'Python ile Veri Bilimi',      instructor:'Dr. Hasan Öztürk', quota:30, enrolled:24, date:'10.07.2026', status:'Aktif'       },
  { id:'SEM-002', title:'Dijital Pazarlama Sertifikası',instructor:'Fatma Yıldız',    quota:25, enrolled:25, date:'20.07.2026', status:'Dolu'         },
  { id:'SEM-003', title:'Kariyer Koçluğu Programı',    instructor:'Ali Koç',          quota:20, enrolled:8,  date:'01.08.2026', status:'Kayıt Açık'   },
  { id:'SEM-004', title:'İş Hukuku Temelleri',         instructor:'Av. Selin Ekici', quota:35, enrolled:18, date:'05.08.2026', status:'Kayıt Açık'   },
];

export const NEWS_INIT = [];

export const EVENTS_INIT = [
  { id:'EVT-001', title:'Kariyer Fuarı 2026',  category:'Kariyer', type:'Yüz yüze', date:'15.07.2026', quota:500, status:'Yayında'   },
  { id:'EVT-002', title:'Google ile Buluşma',  category:'Firma',   type:'Online',   date:'20.07.2026', quota:200, status:'Beklemede' },
  { id:'EVT-003', title:'Mezun Günü',          category:'Mezun',   type:'Yüz yüze', date:'01.08.2026', quota:300, status:'Yayında'   },
];

export const ORG = {
  name:'Prof. Dr. Ahmet Bulut', title:'Rektör',
  children:[{
    name:'Dr. Zeynep Aksoy', title:'Kariyer Merkezi Direktörü',
    children:[
      { name:'Murat Koç',     title:'Kariyer Danışmanı',    children:[] },
      { name:'Seda Türkmen',  title:'Mezun İlişkileri',     children:[] },
      { name:'Tarık Polat',   title:'Firma İlişkileri',     children:[] },
    ]
  }]
};
