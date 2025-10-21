export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  createdAt: string;
  avatar?: string;
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
  dueDate?: string;
  status: 'assigned' | 'in_progress' | 'completed';
  progress: number;
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
  },
  {
    id: 'student-2',
    email: 'petrova@mail.ru',
    name: 'Петрова Мария Сергеевна',
    role: 'student',
    createdAt: '2024-03-01',
  },
  {
    id: 'student-3',
    email: 'sidorov@mail.ru',
    name: 'Сидоров Петр Александрович',
    role: 'student',
    createdAt: '2024-03-10',
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
    dueDate: '2024-04-01',
    status: 'in_progress',
    progress: 65,
  },
  {
    id: 'assign-2',
    studentId: 'student-1',
    courseId: 'course-2',
    assignedAt: '2024-03-05',
    dueDate: '2024-04-05',
    status: 'completed',
    progress: 100,
  },
  {
    id: 'assign-3',
    studentId: 'student-2',
    courseId: 'course-1',
    assignedAt: '2024-03-10',
    dueDate: '2024-04-10',
    status: 'in_progress',
    progress: 45,
  },
  {
    id: 'assign-4',
    studentId: 'student-2',
    courseId: 'course-3',
    assignedAt: '2024-03-12',
    dueDate: '2024-04-12',
    status: 'assigned',
    progress: 0,
  },
  {
    id: 'assign-5',
    studentId: 'student-3',
    courseId: 'course-4',
    assignedAt: '2024-03-15',
    dueDate: '2024-05-15',
    status: 'in_progress',
    progress: 30,
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

export let currentUser: User | null = mockUsers[1];

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;
