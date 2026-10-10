import { Training } from '../types';

export const SAMPLE_TRAINING_PRESETS: {
  name: string;
  role: string;
  targetGoal: string;
  trainings: Training[];
}[] = [
  {
    name: 'Yazılım & Teknoloji (Frontend → Lead / Cloud)',
    role: 'Mid-Level Frontend Geliştirici',
    targetGoal: 'Kıdemli Fullstack & Bulut Mimarisi (Tech Lead / Cloud Architect) seviyesine yükselmek',
    trainings: [
      {
        id: 'train-1',
        title: 'Modern React & TypeScript ile Ölçeklenebilir Web Mimarisi',
        provider: 'Frontend Masters & Kurumsal Akademi',
        date: '2024 - 40 Saat',
        skills: 'React 19, TypeScript, State Management, Next.js, Performance Optimization',
        content: `Müfredat Kapsamı:
- TypeScript ile tip güvenli mimari, jenerikler ve ileri seviye tip kalıpları
- React Hooks derinlemesine, custom hooks ve performans optimizasyonu (useMemo, useCallback, memo)
- Sunucu tarafı render (SSR) ve Statik Site Üretimi (SSG) mekanizmaları
- Bileşen tabanlı tasarım sistemleri ve erişilebilirlik (a11y) standartları
- State yönetimi ve mikro-frontend kavramlarına temel giriş.`
      },
      {
        id: 'train-2',
        title: 'REST API Tasarımı ve Node.js Backend Temelleri',
        provider: 'Udemy / Coursera Pro',
        date: '2023 - 35 Saat',
        skills: 'Node.js, Express, RESTful API, PostgreSQL Temelleri, JWT Kimlik Doğrulama',
        content: `Müfredat Kapsamı:
- Express.js ile modüler backend API geliştirme, middleware mimarisi
- İlişkisel veritabanı modellemesi ve temel CRUD işlemleri
- Güvenlik: JWT ile kimlik doğrulama, bcrypt ile parola hashleme, CORS yönetimi
- Hata yakalama mekanizmaları ve API loglama.`
      },
      {
        id: 'train-3',
        title: 'Git ile Profesyonel Versiyon Kontrolü & CI/CD Giriş',
        provider: 'TechLead Bootcamp',
        date: '2023 - 20 Saat',
        skills: 'Git Flow, GitHub Actions, Docker Temelleri, Test Otomasyonu',
        content: `Müfredat Kapsamı:
- İleri seviye git rebase, cherry-pick ve merge conflict yönetimi
- GitHub Actions ile otomatik test ve linting pipeline oluşturma
- Dockerfile hazırlama ve temel konteynerizasyon.`
      }
    ]
  },
  {
    name: 'Ürün & Büyüme (Junior PM → Kıdemli Ürün Yöneticisi)',
    role: 'Ürün Uzmanı (Associate Product Manager)',
    targetGoal: 'Veri odaklı Kıdemli Ürün Yöneticisi (Senior PM) olmak ve B2B SaaS ürün vizyonunu yönetmek',
    trainings: [
      {
        id: 'train-pm-1',
        title: 'Agile & Scrum ile Çevik Ürün Yönetimi',
        provider: 'Scrum Alliance & PMI',
        date: '2024 - 30 Saat',
        skills: 'Scrum, User Stories, Sprint Planning, Backlog Refinement, Jira',
        content: `Müfredat Kapsamı:
- Agile prensipleri ve Scrum seremonilerinin etkin yönetimi
- Değer odaklı kullanıcı hikayeleri (User Story) ve kabul kriterleri yazımı
- MVP (Minimum Viable Product) tanımlama ve kapsam daraltma teknikleri
- Paydaş iletişimi ve geliştirme takımıyla senkronizasyon.`
      },
      {
        id: 'train-pm-2',
        title: 'Kullanıcı Deneyimi (UX) Araştırması ve Ürün Keşfi (Discovery)',
        provider: 'Interaction Design Foundation',
        date: '2023 - 25 Saat',
        skills: 'Kullanıcı Mülakatları, Persona Oluşturma, Wireframing, Figma, Müşteri Yolculuğu',
        content: `Müfredat Kapsamı:
- Niteliksel kullanıcı görüşmeleri ve problem tanılama metotları
- Persona ve Müşteri Yolculuk Haritası (Customer Journey Map) çıkarma
- Hızlı prototipleme ve kullanılabilirlik testleri yapma.`
      }
    ]
  },
  {
    name: 'Veri & İş Zekası (Analist → Veri Bilimci)',
    role: 'İş ve Veri Analisti',
    targetGoal: 'Makine Öğrenimi ve Tahmine Dayalı Modelleme yapabilen Kıdemli Veri Bilimci olmak',
    trainings: [
      {
        id: 'train-ds-1',
        title: 'İleri Seviye SQL ve İlişkisel Veritabanı Sorgulama',
        provider: 'DataCamp Pro',
        date: '2024 - 30 Saat',
        skills: 'SQL, Window Functions, CTE, Veri Modelleme, Optimizasyon',
        content: `Müfredat Kapsamı:
- Karmaşık alt sorgular (Subqueries), CTE ve Pencere Fonksiyonları (Window Functions)
- Sorgu planı analizi ve indeks optimizasyonu
- Çoklu tablolarda analitik veri ambarı sorgulamaları.`
      },
      {
        id: 'train-ds-2',
        title: 'Power BI ve Tableau ile Veri Görselleştirme ve Dashboard Tasarımı',
        provider: 'Kurumsal Eğitim Akademisi',
        date: '2023 - 25 Saat',
        skills: 'Power BI, DAX, Veri Hikayeleştirme, KPI Raporlama',
        content: `Müfredat Kapsamı:
- İşletme liderleri için KPI dashboardları ve etkileşimli raporlar hazırlama
- DAX formülleri ile dinamik ölçümler üretme
- Veri hikayeleştirme (Data Storytelling) ve yönetim sunumları.`
      }
    ]
  }
];

export const POPULAR_INTERVIEWER_ROLES = [
  {
    title: 'İK Direktörü (Head of People / HR Director)',
    tag: 'Kültür & Uyum',
    desc: 'Şirket kültürüne uyum, çatışma çözme, kariyer sadakati, motivasyon ve liderlik potansiyelini tartar.'
  },
  {
    title: 'Teknolojiden Sorumlu Başkan (CTO / VP of Eng)',
    tag: 'Mimari & Vizyon',
    desc: 'Teknik borç, büyük ölçeklenebilirlik kararları, sistem mimarisi, mühendislik ekibine liderlik kabiliyeti.'
  },
  {
    title: 'Kıdemli Mühendislik Takım Lideri (Tech Lead)',
    tag: 'Kod Kalitesi & Pratik',
    desc: 'Günlük pratikler, code review, debug refleksi, teknoloji seçimleri ve takıma katkı derinliği.'
  },
  {
    title: 'Ürün Direktörü / Baş Ürün Yöneticisi (CPO / VP of Product)',
    tag: 'İş Etkisi & Kullanıcı',
    desc: 'Ürün vizyonu, metrikler, önceliklendirme, kullanıcı empatisi ve mühendislik-ürün dengesi.'
  },
  {
    title: 'Genel Müdür / Kurucu Ortak (CEO / Co-Founder)',
    tag: 'Misyon & ROI',
    desc: 'İşin geleceği, katma değer, problem sahiplenme, girişimci refleks ve şirketin 3 yıllık hedeflerine katkı.'
  },
  {
    title: 'Pazarlama Direktörü (CMO / Growth Lead)',
    tag: 'Büyüme & CAC/LTV',
    desc: 'Metrik odaklı düşünme, kanal optimizasyonu, yaratıcı stratejiler ve bütçe/ROI yönetimi.'
  }
];

export const SAMPLE_CLIENTS: import('../types').ClientProfile[] = [
  {
    id: 'cli-1',
    fullName: 'Canberk Yılmaz',
    email: 'canberk.yilmaz@example.com',
    targetRole: 'Kıdemli Fullstack Mühendisi / Tech Lead',
    targetCompany: 'Fintech Scale-up (Getir / Trendyol Tech)',
    interviewerTitle: 'Teknolojiden Sorumlu Başkan (CTO)',
    interviewDate: '16 Ekim 2026',
    status: 'Mülakat Haftası',
    readinessScore: 88,
    coachNotes: [
      'Sistem tasarımı ve mimari ölçekleme sorularında çok güçlü.',
      'Önceki projelerindeki iş çıktısını ve metrikleri (ROI) vurgulamalı, CTO iş etkisine bakar.',
      'Son prova puanı: 85/100.'
    ],
    assignedTasks: [
      { id: 'task-1', text: 'CTO için 3 adet akıllıca karşı soru hazırla', done: true },
      { id: 'task-2', text: 'Dağıtık önbellekleme kriz senaryosu provası yap', done: true },
      { id: 'task-3', text: 'AWS Solutions Architect sertifika modüllerini gözden geçir', done: false }
    ],
    completedSimulationsCount: 4,
    lastActive: 'Bugün, 10:45',
    trainingsCount: 3
  },
  {
    id: 'cli-2',
    fullName: 'Selin Demir',
    email: 'selin.demir@example.com',
    targetRole: 'Kıdemli Ürün Yöneticisi (Senior PM)',
    targetCompany: 'Global SaaS (Insider / Peak)',
    interviewerTitle: 'Baş Ürün Yöneticisi (CPO / VP of Product)',
    interviewDate: '22 Ekim 2026',
    status: 'Simülasyon Aşamasında',
    readinessScore: 74,
    coachNotes: [
      'Kullanıcı keşfi (discovery) tarafı sağlam, ancak gelir metrikleri ve A/B test kurgularında derinleşmeli.',
      'Eğitim portföyü analiz edildi; büyüme ürün yönetimi (Growth PM) eğitimi önerildi.'
    ],
    assignedTasks: [
      { id: 'task-4', text: 'Mevcut Agile eğitim içeriklerini portföye işle', done: true },
      { id: 'task-5', text: 'CPO ile kriz senaryosu provasını tamamla', done: false }
    ],
    completedSimulationsCount: 2,
    lastActive: 'Dün, 16:20',
    trainingsCount: 2
  },
  {
    id: 'cli-3',
    fullName: 'Mert Aksoy',
    email: 'mert.aksoy@example.com',
    targetRole: 'Veri Bilimci (Data Scientist)',
    targetCompany: 'Banka Dijital Bankacılık Birimi',
    interviewerTitle: 'İK Direktörü & Analitik Takım Lideri',
    interviewDate: '28 Ekim 2026',
    status: 'Hazırlanıyor',
    readinessScore: 62,
    coachNotes: [
      'Teknik arka plan iyi, ancak davranışsal mülakatlarda STAR yöntemini daha net kurgulamalı.',
      'Model deployment (MLOps) tarafında eğitim eksikliği var.'
    ],
    assignedTasks: [
      { id: 'task-6', text: 'Geçmiş eğitim sertifikalarını listele', done: true },
      { id: 'task-7', text: 'İK Direktörü davranışsal soruları provasını yap', done: false }
    ],
    completedSimulationsCount: 1,
    lastActive: '3 gün önce',
    trainingsCount: 2
  },
  {
    id: 'cli-4',
    fullName: 'Ayşe Kaya',
    email: 'ayse.kaya@example.com',
    targetRole: 'Pazarlama Müdürü (Head of Growth)',
    targetCompany: 'E-ticaret Platformu',
    interviewerTitle: 'Genel Müdür (CEO / Kurucu)',
    interviewDate: '12 Ekim 2026',
    status: 'Teklif Alındı',
    readinessScore: 96,
    coachNotes: [
      'Mülakat başarıyla tamamlandı, ilk teklif paketi masada. Maaş ve hak müzakeresi üzerine konuşulacak.'
    ],
    assignedTasks: [
      { id: 'task-8', text: 'Teklif müzakeresi koçluk seansı planla', done: true }
    ],
    completedSimulationsCount: 6,
    lastActive: '1 saat önce',
    trainingsCount: 4
  }
];

export const CURATED_RESOURCES: import('../types').LearningResource[] = [
  {
    id: 'res-1',
    title: 'Cracking the Coding Interview & System Design Primer',
    category: 'Mülakat Hazırlığı',
    type: 'Rehber',
    description: 'Büyük ölçekli yazılım ve mimari mülakatları için soru kalıpları, algoritma analizi ve sistem tasarımı taktikleri.',
    targetAudience: 'Yazılım Mühendisleri, Tech Lead & Mimar Adayları',
    provider: 'Gayle Laakmann McDowell & Open Community'
  },
  {
    id: 'res-2',
    title: 'Decode and Conquer & The Product Manager Interview',
    category: 'Mülakat Hazırlığı',
    type: 'Kitap',
    description: 'CIRCLES metodu ile ürün tasarımı, metrik analizi, fiyatlandırma ve strateji sorularına yanıt verme çerçevesi.',
    targetAudience: 'Ürün Yöneticileri (PM / APM / Group PM)',
    provider: 'Lewis C. Lin'
  },
  {
    id: 'res-3',
    title: 'AWS Certified Solutions Architect & Cloud Engineering',
    category: 'Sertifikasyon',
    type: 'Sertifika',
    description: 'Dağıtık bulut mimarisi, yüksek erişilebilirlik, felaket kurtarma ve maliyet optimizasyonu global akreditasyonu.',
    targetAudience: 'Bulut ve Altyapı Adayları, Kıdemli Geliştiriciler',
    provider: 'Amazon Web Services (AWS)'
  },
  {
    id: 'res-4',
    title: 'Executive Presence: The Missing Link Between Merit and Success',
    category: 'Liderlik & İletişim',
    type: 'Kitap',
    description: 'Yönetici seviyesi mülakatlarda duruş, güven, stratejik kelime seçimi ve paydaş yönetimi psikolojisi.',
    targetAudience: 'Müdür, Direktör ve C-Level Adayları',
    provider: 'Sylvia Ann Hewlett'
  },
  {
    id: 'res-5',
    title: 'Refactoring UI & Tasarım Sistemleri Mimarisi',
    category: 'Teknik Yetkinlik',
    type: 'Rehber',
    description: 'Kullanıcı dostu arayüzler, modern CSS mimarisi ve bileşen hiyerarşisi oluşturma ilkeleri.',
    targetAudience: 'Frontend Geliştiriciler ve UI/UX Tasarımcılar',
    provider: 'Adam Wathan & Steve Schoger'
  },
  {
    id: 'res-6',
    title: 'Professional Scrum Master (PSM I / PSM II)',
    category: 'Sertifikasyon',
    type: 'Sertifika',
    description: 'Çevik takım yönetimi, sprint optimizasyonu ve ürün geliştirme kültürü uluslararası sertifikasyonu.',
    targetAudience: 'Scrum Master, Proje Yöneticisi, Agile Koç',
    provider: 'Scrum.org'
  }
];

