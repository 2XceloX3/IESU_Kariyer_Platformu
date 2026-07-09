import React, { useState } from 'react';
2: import { Users, Building2, Calendar, FileSpreadsheet, Activity, LayoutDashboard, Settings, LogOut, CheckCircle, XCircle, Send, Image as ImageIcon, Briefcase, ExternalLink, Globe, Newspaper, GraduationCap, Check, X, AlertTriangle, MessageSquareQuote, MoreHorizontal, Heart, Bookmark, ArrowRight } from 'lucide-react';
3: 
4: export default function AdminDashboard({ setView, posts, setPosts, news, setNews, events, setEvents, semCourses, setSemCourses, surveys, setSurveys, students, setStudents, alumni, setAlumni, companies, setCompanies }) {
5:   const [activeTab, setActiveTab] = useState('overview'); 
6:   // overview, cms, survey, news_events, sem, student_pool, alumni_pool, company
7: 
8:   // Form States (CMS Feed)
9:   const [newPostContent, setNewPostContent] = useState('');
10:   const [newPostImage, setNewPostImage] = useState('');
11:   const [isJobPost, setIsJobPost] = useState(false);
12: 
13:   // Form States (Survey)
14:   const [surveyTitle, setSurveyTitle] = useState('');
15:   const [surveyQuestion, setSurveyQuestion] = useState('');
16: 
17:   // Form States (News & Events)
18:   const [neType, setNeType] = useState('haber');
19:   const [neTitle, setNeTitle] = useState('');
20:   const [neDesc, setNeDesc] = useState('');
21:   const [neDate, setNeDate] = useState('');
22:   const [neImage, setNeImage] = useState('');
23: 
24:   // Form States (SEM)
25:   const [semTitle, setSemTitle] = useState('');
26:   const [semDesc, setSemDesc] = useState('');
27:   const [semImage, setSemImage] = useState('');
28:   
29:   const handlePostSubmit = (e) => {
30:     e.preventDefault();
31:     if (!newPostContent.trim()) return;
32: 
33:     const newPost = {
34:       id: Date.now(),
35:       author: {
36:         name: "Süper Admin (Kariyer Ofisi)",
37:         title: isJobPost ? "Öne Çıkan İlan" : "Resmi Duyuru",
38:         avatar: "https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png"
39:       },
40:       time: "Şimdi",
41:       image: newPostImage || null,
42:       content: newPostContent,
43:       likes: 0,
44:       comments: 0,
45:       isJob: isJobPost,
46:       isApproved: true
47:     };
48: 
49:     setPosts([newPost, ...posts]);
50:     setNewPostContent('');
51:     setNewPostImage('');
52:     setIsJobPost(false);
53:     alert("Gönderi başarıyla Öğrenci/Mezun Ağına (Feed) gönderildi!");
54:   };
55: 
56:   const handleSurveySubmit = (e) => {
57:     e.preventDefault();
58:     if(!surveyTitle || !surveyQuestion) return;
59:     const newSurvey = {
60:       id: Date.now(),
61:       title: surveyTitle,
62:       question: surveyQuestion,
63:       time: "Şimdi",
64:       author: "Süper Admin (Kariyer Ofisi)",
65:       avatar: "https://www.esenyurt.edu.tr/uploads/2024/06/70ojf22yz63ip-esenyurt-universitesi-logo.png"
66:     };
67:     setSurveys([newSurvey, ...(surveys || [])]);
68:     setSurveyTitle('');
69:     setSurveyQuestion('');
70:     alert("Anket yayınlandı. Öğrenciler/Mezunlar Likert (1-5) oylamasını görebilecek.");
71:   };
72: 
73:   const handleNewsSubmit = (e) => {
74:     e.preventDefault();
75:     const newItem = { id: Date.now(), title: neTitle, description: neDesc, date: neDate };
76:     if (neType === 'haber') {
77:       setNews([newItem, ...(news || [])]);
78:     } else {
79:       setEvents([newItem, ...(events || [])]);
80:     }
