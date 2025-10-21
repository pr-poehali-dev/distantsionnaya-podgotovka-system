export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  createdAt: string;
  avatar?: string;
  position?: string;
  organizationId?: string;
  organization?: string;
  group?: string;
  login?: string;
  password?: string;
}

export interface Organization {
  id: string;
  name: string;
  inn: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface TrainingRequest {
  id: string;
  organizationId: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed';
  students: RequestStudent[];
  completedAt?: string;
}

export interface RequestStudent {
  id: string;
  requestId: string;
  name: string;
  position: string;
  email?: string;
  studentId?: string;
  courseIds: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  lessonsCount: number;
  createdAt: string;
  status: 'active' | 'draft' | 'archived';
}

export interface CourseAssignment {
  id: string;
  studentId: string;
  courseId: string;
  assignedAt: string;
  activatedAt?: string;
  expiresAt?: string;
  completedAt?: string;
  status: 'draft' | 'active' | 'completed';
  progress: number;
  subscriptionsUsed: number;
}

export interface TestQuestion {
  id: string;
  courseId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface TestResult {
  id: string;
  studentId: string;
  courseId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  type: 'presentation' | 'document' | 'video';
  url: string;
  order: number;
}

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  type: 'certificate' | 'diploma' | 'transcript';
  issuedAt: string;
  certificateNumber: string;
}

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@edu.ru',
    name: 'Администратор Система',
    role: 'admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'student-1',
    email: 'ivanov@mail.ru',
    name: 'Иванов Иван Иванович',
    role: 'student',
    createdAt: '2024-02-15',
    organization: 'ООО "Стройтехнология"',
    group: 'ОТ-2024-01',
    login: 'ivanov_ii',
    password: 'pass1234',
  },
  {
    id: 'student-2',
    email: 'petrova@mail.ru',
    name: 'Петрова Мария Сергеевна',
    role: 'student',
    createdAt: '2024-03-01',
    organization: 'АО "ЭнергоМаш"',
    group: 'ЭБ-2024-02',
    login: 'petrova_ms',
    password: 'pass5678',
  },
  {
    id: 'student-3',
    email: 'sidorov@mail.ru',
    name: 'Сидоров Петр Александрович',
    role: 'student',
    createdAt: '2024-03-10',
    organization: 'ООО "Стройтехнология"',
    group: 'ОТ-2024-01',
    login: 'sidorov_pa',
    password: 'pass9012',
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Охрана труда для руководителей',
    description: 'Программа повышения квалификации по охране труда для руководителей и специалистов',
    category: 'Охрана труда',
    duration: 40,
    lessonsCount: 12,
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: 'course-2',
    title: 'Пожарная безопасность',
    description: 'Пожарно-технический минимум для ответственных лиц',
    category: 'Пожарная безопасность',
    duration: 28,
    lessonsCount: 8,
    createdAt: '2024-01-20',
    status: 'active',
  },
  {
    id: 'course-3',
    title: 'Электробезопасность до 1000В',
    description: 'Подготовка персонала для работы с электроустановками до 1000В',
    category: 'Электробезопасность',
    duration: 32,
    lessonsCount: 10,
    createdAt: '2024-02-01',
    status: 'active',
  },
  {
    id: 'course-4',
    title: 'Промышленная безопасность',
    description: 'Подготовка руководителей и специалистов опасных производственных объектов',
    category: 'Промышленная безопасность',
    duration: 72,
    lessonsCount: 18,
    createdAt: '2024-02-10',
    status: 'active',
  },
];

export const mockAssignments: CourseAssignment[] = [
  {
    id: 'assign-1',
    studentId: 'student-1',
    courseId: 'course-1',
    assignedAt: '2024-03-01',
    activatedAt: '2024-03-01',
    expiresAt: '2024-04-30',
    status: 'active',
    progress: 65,
    subscriptionsUsed: 1,
  },
  {
    id: 'assign-2',
    studentId: 'student-1',
    courseId: 'course-2',
    assignedAt: '2024-03-05',
    activatedAt: '2024-03-05',
    expiresAt: '2024-05-04',
    completedAt: '2024-04-05',
    status: 'completed',
    progress: 100,
    subscriptionsUsed: 1,
  },
  {
    id: 'assign-3',
    studentId: 'student-2',
    courseId: 'course-1',
    assignedAt: '2024-03-10',
    activatedAt: '2024-03-10',
    expiresAt: '2024-05-09',
    status: 'active',
    progress: 45,
    subscriptionsUsed: 1,
  },
  {
    id: 'assign-4',
    studentId: 'student-2',
    courseId: 'course-3',
    assignedAt: '2024-03-12',
    status: 'draft',
    progress: 0,
    subscriptionsUsed: 0,
  },
  {
    id: 'assign-5',
    studentId: 'student-3',
    courseId: 'course-4',
    assignedAt: '2024-03-15',
    activatedAt: '2024-03-15',
    expiresAt: '2024-05-14',
    status: 'active',
    progress: 30,
    subscriptionsUsed: 1,
  },
];

export const mockTestQuestions: TestQuestion[] = [
  {
    id: 'q-1',
    courseId: 'course-1',
    question: 'Какова периодичность обучения по охране труда для руководителей?',
    options: [
      'Один раз в год',
      'Один раз в три года',
      'Один раз в пять лет',
      'По мере необходимости',
    ],
    correctAnswer: 1,
    explanation: 'Согласно ТК РФ, руководители проходят обучение по охране труда один раз в три года',
  },
  {
    id: 'q-2',
    courseId: 'course-1',
    question: 'Кто обязан проводить инструктаж по охране труда на рабочем месте?',
    options: [
      'Непосредственный руководитель работ',
      'Специалист по охране труда',
      'Директор организации',
      'Представитель профсоюза',
    ],
    correctAnswer: 0,
    explanation: 'Инструктаж проводит непосредственный руководитель работ, прошедший обучение',
  },
  {
    id: 'q-3',
    courseId: 'course-2',
    question: 'Какой класс пожара соответствует горению твердых веществ?',
    options: [
      'Класс A',
      'Класс B',
      'Класс C',
      'Класс D',
    ],
    correctAnswer: 0,
    explanation: 'Класс A - пожары твердых горючих веществ',
  },
  {
    id: 'q-4',
    courseId: 'course-2',
    question: 'Какой огнетушитель НЕ применяется для тушения электроустановок под напряжением?',
    options: [
      'Порошковый',
      'Углекислотный',
      'Пенный',
      'Хладоновый',
    ],
    correctAnswer: 2,
    explanation: 'Пенные огнетушители нельзя применять для тушения электроустановок под напряжением из-за электропроводности пены',
  },
  {
    id: 'q-5',
    courseId: 'course-3',
    question: 'Какая группа по электробезопасности присваивается неэлектротехническому персоналу?',
    options: [
      'I группа',
      'II группа',
      'III группа',
      'IV группа',
    ],
    correctAnswer: 0,
    explanation: 'Неэлектротехническому персоналу присваивается I группа по электробезопасности',
  },
];

export const mockMaterials: CourseMaterial[] = [
  {
    id: 'mat-1',
    courseId: 'course-1',
    title: 'Введение в охрану труда',
    type: 'presentation',
    url: '/materials/ot-intro.pdf',
    order: 1,
  },
  {
    id: 'mat-2',
    courseId: 'course-1',
    title: 'Трудовой кодекс РФ (выдержки)',
    type: 'document',
    url: '/materials/tk-rf.pdf',
    order: 2,
  },
  {
    id: 'mat-3',
    courseId: 'course-2',
    title: 'Правила пожарной безопасности',
    type: 'presentation',
    url: '/materials/fire-safety.pdf',
    order: 1,
  },
  {
    id: 'mat-4',
    courseId: 'course-3',
    title: 'Электробезопасность - основы',
    type: 'presentation',
    url: '/materials/electric-safety.pdf',
    order: 1,
  },
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    studentId: 'student-1',
    courseId: 'course-2',
    type: 'certificate',
    issuedAt: '2024-03-20',
    certificateNumber: 'УПК-2024-00001',
  },
];

export const mockTestResults: TestResult[] = [
  {
    id: 'res-1',
    studentId: 'student-1',
    courseId: 'course-1',
    questionId: 'q-1',
    selectedAnswer: 1,
    isCorrect: true,
    attemptedAt: '2024-03-15T10:30:00',
  },
  {
    id: 'res-2',
    studentId: 'student-1',
    courseId: 'course-1',
    questionId: 'q-2',
    selectedAnswer: 0,
    isCorrect: true,
    attemptedAt: '2024-03-15T10:32:00',
  },
];

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'ООО "Стройтехнология"',
    inn: '7701234567',
    contactPerson: 'Смирнов Алексей Петрович',
    contactEmail: 'smirnov@stroyteh.ru',
    contactPhone: '+7 495 123-45-67',
    address: 'г. Москва, ул. Строителей, д. 15',
  },
  {
    id: 'org-2',
    name: 'АО "ЭнергоМаш"',
    inn: '7702345678',
    contactPerson: 'Кузнецова Ольга Ивановна',
    contactEmail: 'kuznetsova@energomash.ru',
    contactPhone: '+7 495 234-56-78',
    address: 'г. Москва, пр-т Энергетиков, д. 42',
  },
  {
    id: 'org-3',
    name: 'ПАО "МетТрейд"',
    inn: '7703456789',
    contactPerson: 'Волков Дмитрий Сергеевич',
    contactEmail: 'volkov@mettrade.ru',
    contactPhone: '+7 495 345-67-89',
    address: 'г. Москва, ул. Металлургов, д. 8',
  },
];

export const mockTrainingRequests: TrainingRequest[] = [
  {
    id: 'req-1',
    organizationId: 'org-1',
    requestDate: '2024-03-01',
    status: 'completed',
    completedAt: '2024-03-25',
    students: [
      { id: 'rs-1', requestId: 'req-1', name: 'Иванов Петр Сергеевич', position: 'Инженер', email: 'ivanov@stroyteh.ru', studentId: 'student-1', courseIds: ['course-1', 'course-2'] },
      { id: 'rs-2', requestId: 'req-1', name: 'Сидоров Иван Петрович', position: 'Мастер участка', email: 'sidorov@stroyteh.ru', studentId: 'student-3', courseIds: ['course-1'] },
    ],
  },
  {
    id: 'req-2',
    organizationId: 'org-2',
    requestDate: '2024-03-10',
    status: 'in_progress',
    students: [
      { id: 'rs-3', requestId: 'req-2', name: 'Петрова Анна Владимировна', position: 'Электрик', email: 'petrova@energomash.ru', studentId: 'student-2', courseIds: ['course-3'] },
      { id: 'rs-4', requestId: 'req-2', name: 'Николаев Сергей Иванович', position: 'Электромонтер', email: 'nikolaev@energomash.ru', courseIds: ['course-3', 'course-2'] },
      { id: 'rs-5', requestId: 'req-2', name: 'Федоров Алексей Дмитриевич', position: 'Начальник смены', email: 'fedorov@energomash.ru', courseIds: ['course-1', 'course-3'] },
    ],
  },
  {
    id: 'req-3',
    organizationId: 'org-3',
    requestDate: '2024-03-15',
    status: 'approved',
    students: [
      { id: 'rs-6', requestId: 'req-3', name: 'Морозов Игорь Александрович', position: 'Главный инженер', email: 'morozov@mettrade.ru', courseIds: ['course-2', 'course-1'] },
      { id: 'rs-7', requestId: 'req-3', name: 'Соколова Елена Петровна', position: 'Инженер по ОТ', email: 'sokolova@mettrade.ru', courseIds: ['course-1'] },
    ],
  },
  {
    id: 'req-4',
    organizationId: 'org-1',
    requestDate: '2024-03-20',
    status: 'pending',
    students: [
      { id: 'rs-8', requestId: 'req-4', name: 'Павлов Михаил Сергеевич', position: 'Директор по производству', email: 'pavlov@stroyteh.ru', courseIds: ['course-4'] },
      { id: 'rs-9', requestId: 'req-4', name: 'Козлов Андрей Владимирович', position: 'Заместитель директора', email: 'kozlov@stroyteh.ru', courseIds: ['course-4', 'course-1'] },
      { id: 'rs-10', requestId: 'req-4', name: 'Новиков Денис Игоревич', position: 'Начальник цеха', email: 'novikov@stroyteh.ru', courseIds: ['course-4'] },
      { id: 'rs-11', requestId: 'req-4', name: 'Лебедев Роман Петрович', position: 'Мастер смены', email: 'lebedev@stroyteh.ru', courseIds: ['course-4', 'course-2'] },
    ],
  },
];

export let currentUser: User | null = mockUsers[1];

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;