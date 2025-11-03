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
  snils?: string;
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
  snils?: string;
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
  regulatoryDocument?: string;
  documentClause?: string;
  clauseText?: string;
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
    snils: '123-456-789 00',
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
    snils: '234-567-890 11',
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
    snils: '345-678-901 22',
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
    regulatoryDocument: 'Трудовой кодекс Российской Федерации',
    documentClause: 'Статья 219, часть 2',
    clauseText: 'Работодатель обязан обеспечить обучение безопасным методам и приемам выполнения работ и оказанию первой помощи пострадавшим на производстве, проведение инструктажа по охране труда, стажировки на рабочем месте и проверки знания требований охраны труда. Обучение по охране труда руководителей и специалистов проводится не реже одного раза в три года.',
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
    regulatoryDocument: 'Постановление Минтруда РФ и Минобразования РФ от 13.01.2003 N 1/29',
    documentClause: 'Пункт 7.2.3',
    clauseText: 'Первичный инструктаж на рабочем месте проводится до начала самостоятельной работы непосредственным руководителем работ (мастером, прорабом), прошедшим в установленном порядке обучение по охране труда и проверку знаний требований охраны труда.',
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
    regulatoryDocument: 'Федеральный закон "Технический регламент о требованиях пожарной безопасности" от 22.07.2008 N 123-ФЗ',
    documentClause: 'Статья 8, часть 1',
    clauseText: 'Пожары классифицируются по виду горючего материала и подразделяются на следующие классы: пожары твердых горючих веществ и материалов (класс A); пожары горючих жидкостей или плавящихся твердых веществ и материалов (класс B); пожары газов (класс C); пожары металлов (класс D).',
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
    regulatoryDocument: 'СП 9.13130.2009 "Техника пожарная. Огнетушители"',
    documentClause: 'Пункт 4.1.8',
    clauseText: 'Не допускается применение пенных огнетушителей для тушения пожаров электрооборудования, находящегося под напряжением, так как водная пенообразующая жидкость является электропроводной. Для тушения электроустановок под напряжением до 1000 В используются порошковые, углекислотные и хладоновые огнетушители.',
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
    regulatoryDocument: 'Правила по охране труда при эксплуатации электроустановок, утв. Приказом Минтруда России от 15.12.2020 N 903н',
    documentClause: 'Пункт 2.3',
    clauseText: 'Группа I по электробезопасности распространяется на неэлектротехнический персонал, выполняющий работы, при которых может возникнуть опасность поражения электрическим током. Присвоение группы I производится путем проведения инструктажа, который должен завершаться проверкой знаний в форме устного опроса.',
  },
  {
    id: 'q-6',
    courseId: 'course-1',
    question: 'Какова максимальная продолжительность рабочего времени в неделю по ТК РФ?',
    options: ['36 часов', '40 часов', '42 часа', '48 часов'],
    correctAnswer: 1,
    regulatoryDocument: 'Трудовой кодекс РФ',
    documentClause: 'Статья 91',
    clauseText: 'Нормальная продолжительность рабочего времени не может превышать 40 часов в неделю.',
  },
  {
    id: 'q-7',
    courseId: 'course-1',
    question: 'Какой вид инструктажа проводится при приеме на работу?',
    options: ['Первичный', 'Вводный', 'Повторный', 'Целевой'],
    correctAnswer: 1,
    regulatoryDocument: 'Постановление Минтруда РФ от 13.01.2003 N 1/29',
    documentClause: 'Пункт 7.1.1',
    clauseText: 'Вводный инструктаж по охране труда проводится при приеме на работу со всеми вновь принимаемыми на работу.',
  },
  {
    id: 'q-8',
    courseId: 'course-1',
    question: 'С какой периодичностью проводится повторный инструктаж?',
    options: ['Ежемесячно', 'Ежеквартально', 'Раз в полгода', 'Ежегодно'],
    correctAnswer: 2,
    regulatoryDocument: 'Постановление Минтруда РФ от 13.01.2003 N 1/29',
    documentClause: 'Пункт 7.2.6',
    clauseText: 'Повторный инструктаж проводится не реже одного раза в шесть месяцев.',
  },
  {
    id: 'q-9',
    courseId: 'course-1',
    question: 'Кто утверждает инструкции по охране труда?',
    options: ['Работодатель', 'Профсоюз', 'Трудовая инспекция', 'Минтруд РФ'],
    correctAnswer: 0,
    regulatoryDocument: 'Постановление Минтруда РФ от 17.12.2002 N 80',
    documentClause: 'Пункт 5.4',
    clauseText: 'Инструкция по охране труда для работника утверждается работодателем.',
  },
  {
    id: 'q-10',
    courseId: 'course-1',
    question: 'Какова продолжительность ежегодного оплачиваемого отпуска?',
    options: ['14 дней', '21 день', '28 дней', '30 дней'],
    correctAnswer: 2,
    regulatoryDocument: 'Трудовой кодекс РФ',
    documentClause: 'Статья 115',
    clauseText: 'Ежегодный основной оплачиваемый отпуск предоставляется работникам продолжительностью 28 календарных дней.',
  },
  {
    id: 'q-11',
    courseId: 'course-2',
    question: 'Какой класс пожара соответствует горению жидкостей?',
    options: ['Класс A', 'Класс B', 'Класс C', 'Класс D'],
    correctAnswer: 1,
    regulatoryDocument: 'Федеральный закон от 22.07.2008 N 123-ФЗ',
    documentClause: 'Статья 8',
    clauseText: 'Класс B - пожары горючих жидкостей или плавящихся твердых веществ и материалов.',
  },
  {
    id: 'q-12',
    courseId: 'course-2',
    question: 'Какова минимальная ширина эвакуационного выхода?',
    options: ['0.6 м', '0.8 м', '1.0 м', '1.2 м'],
    correctAnswer: 1,
    regulatoryDocument: 'СП 1.13130.2020',
    documentClause: 'Пункт 5.1.5',
    clauseText: 'Ширина эвакуационных выходов должна быть не менее 0,8 м.',
  },
  {
    id: 'q-13',
    courseId: 'course-2',
    question: 'Какое максимальное расстояние до огнетушителя в помещении?',
    options: ['10 м', '20 м', '30 м', '40 м'],
    correctAnswer: 1,
    regulatoryDocument: 'СП 9.13130.2009',
    documentClause: 'Приложение А',
    clauseText: 'Расстояние от возможного очага пожара до места размещения огнетушителя не должно превышать 20 метров.',
  },
  {
    id: 'q-14',
    courseId: 'course-2',
    question: 'Какой знак пожарной безопасности имеет красный цвет?',
    options: ['Предупреждающий', 'Запрещающий', 'Указательный', 'Предписывающий'],
    correctAnswer: 1,
    regulatoryDocument: 'ГОСТ Р 12.4.026-2015',
    documentClause: 'Раздел 4',
    clauseText: 'Запрещающие знаки имеют форму круга красного цвета с белым полем внутри.',
  },
  {
    id: 'q-15',
    courseId: 'course-2',
    question: 'С какой периодичностью проводится проверка огнетушителей?',
    options: ['Ежемесячно', 'Ежеквартально', 'Раз в полгода', 'Ежегодно'],
    correctAnswer: 3,
    regulatoryDocument: 'СП 9.13130.2009',
    documentClause: 'Пункт 4.3.1',
    clauseText: 'Огнетушители должны подвергаться техническому обслуживанию не реже одного раза в год.',
  },
  {
    id: 'q-16',
    courseId: 'course-3',
    question: 'Какое напряжение считается безопасным в помещениях с повышенной опасностью?',
    options: ['12 В', '24 В', '36 В', '42 В'],
    correctAnswer: 0,
    regulatoryDocument: 'Правила по охране труда при эксплуатации электроустановок',
    documentClause: 'Пункт 2.1.8',
    clauseText: 'В помещениях с повышенной опасностью номинальное напряжение переносных светильников не должно превышать 12 В.',
  },
  {
    id: 'q-17',
    courseId: 'course-3',
    question: 'Какова минимальная группа электробезопасности для электромонтера?',
    options: ['II группа', 'III группа', 'IV группа', 'V группа'],
    correctAnswer: 1,
    regulatoryDocument: 'Правила по охране труда при эксплуатации электроустановок',
    documentClause: 'Приложение N 1',
    clauseText: 'Электромонтеры должны иметь группу по электробезопасности не ниже III.',
  },
  {
    id: 'q-18',
    courseId: 'course-3',
    question: 'На какое расстояние нельзя приближаться к оборванному проводу ЛЭП?',
    options: ['2 метра', '4 метра', '8 метров', '10 метров'],
    correctAnswer: 2,
    regulatoryDocument: 'Правила по охране труда при эксплуатации электроустановок',
    documentClause: 'Пункт 2.3.5',
    clauseText: 'К оборванному проводу ЛЭП запрещается приближаться на расстояние менее 8 метров.',
  },
  {
    id: 'q-19',
    courseId: 'course-3',
    question: 'Какого цвета должен быть защитный нулевой проводник?',
    options: ['Красный', 'Синий', 'Желто-зеленый', 'Черный'],
    correctAnswer: 2,
    regulatoryDocument: 'ГОСТ Р 50462-2009',
    documentClause: 'Пункт 5.2.1',
    clauseText: 'Защитный нулевой проводник должен иметь желто-зеленую цветовую маркировку.',
  },
  {
    id: 'q-20',
    courseId: 'course-3',
    question: 'С какой периодичностью проверяется заземление электроустановок?',
    options: ['Ежемесячно', 'Ежеквартально', 'Раз в полгода', 'Ежегодно'],
    correctAnswer: 3,
    regulatoryDocument: 'Правила технической эксплуатации электроустановок потребителей',
    documentClause: 'Пункт 2.7.9',
    clauseText: 'Проверка состояния заземляющих устройств производится не реже одного раза в год.',
  },
  {
    id: 'q-21',
    courseId: 'course-1',
    question: 'Кто проводит специальную оценку условий труда?',
    options: ['Работодатель самостоятельно', 'Аккредитованная организация', 'Трудовая инспекция', 'Профсоюз'],
    correctAnswer: 1,
    regulatoryDocument: 'Федеральный закон от 28.12.2013 N 426-ФЗ',
    documentClause: 'Статья 8',
    clauseText: 'Специальная оценка условий труда проводится совместно работодателем и организацией, соответствующей требованиям статьи 19 настоящего Федерального закона.',
  },
  {
    id: 'q-22',
    courseId: 'course-1',
    question: 'Какова периодичность проведения СОУТ?',
    options: ['Ежегодно', 'Раз в 3 года', 'Раз в 5 лет', 'Раз в 10 лет'],
    correctAnswer: 2,
    regulatoryDocument: 'Федеральный закон от 28.12.2013 N 426-ФЗ',
    documentClause: 'Статья 8',
    clauseText: 'Специальная оценка условий труда проводится не реже чем один раз в пять лет.',
  },
  {
    id: 'q-23',
    courseId: 'course-1',
    question: 'Какой документ является основным для работника по охране труда?',
    options: ['Должностная инструкция', 'Инструкция по охране труда', 'Трудовой договор', 'Положение об оплате труда'],
    correctAnswer: 1,
    regulatoryDocument: 'Постановление Минтруда РФ от 17.12.2002 N 80',
    documentClause: 'Пункт 1.1',
    clauseText: 'Инструкция по охране труда для работника является основным документом, определяющим требования охраны труда для данной профессии или вида работ.',
  },
  {
    id: 'q-24',
    courseId: 'course-2',
    question: 'Какое время горения первичных средств пожаротушения?',
    options: ['5-10 секунд', '10-20 секунд', '20-40 секунд', '40-60 секунд'],
    correctAnswer: 2,
    regulatoryDocument: 'СП 9.13130.2009',
    documentClause: 'Таблица 1',
    clauseText: 'Продолжительность подачи огнетушащего вещества огнетушителей составляет от 20 до 40 секунд.',
  },
  {
    id: 'q-25',
    courseId: 'course-2',
    question: 'На какой высоте должен находиться огнетушитель?',
    options: ['Не выше 1.0 м', 'Не выше 1.5 м', 'Не выше 2.0 м', 'Любая высота'],
    correctAnswer: 1,
    regulatoryDocument: 'СП 9.13130.2009',
    documentClause: 'Пункт 4.1.31',
    clauseText: 'Огнетушители должны размещаться на высоте не более 1,5 метра до верхней части огнетушителя.',
  },
  {
    id: 'q-26',
    courseId: 'course-3',
    question: 'Какова максимальная величина тока, не опасная для человека?',
    options: ['1 мА', '5 мА', '10 мА', '50 мА'],
    correctAnswer: 2,
    regulatoryDocument: 'ГОСТ 12.1.038-82',
    documentClause: 'Пункт 2.2',
    clauseText: 'Пороговый неотпускающий ток при частоте 50 Гц составляет 10 мА.',
  },
  {
    id: 'q-27',
    courseId: 'course-1',
    question: 'Сколько времени хранятся журналы инструктажей по охране труда?',
    options: ['1 год', '3 года', '5 лет', '10 лет'],
    correctAnswer: 3,
    regulatoryDocument: 'Приказ Росархива от 20.12.2019 N 236',
    documentClause: 'Раздел 8',
    clauseText: 'Журналы регистрации инструктажей по охране труда хранятся 10 лет.',
  },
  {
    id: 'q-28',
    courseId: 'course-2',
    question: 'Какова температура воспламенения бумаги?',
    options: ['150°C', '230°C', '300°C', '450°C'],
    correctAnswer: 1,
    regulatoryDocument: 'НПБ 105-03',
    documentClause: 'Приложение А',
    clauseText: 'Температура самовоспламенения бумаги составляет примерно 230°C.',
  },
  {
    id: 'q-29',
    courseId: 'course-3',
    question: 'Какой класс помещений по электробезопасности самый опасный?',
    options: ['Без повышенной опасности', 'С повышенной опасностью', 'Особо опасные', 'Все одинаковы'],
    correctAnswer: 2,
    regulatoryDocument: 'Правила устройства электроустановок (ПУЭ)',
    documentClause: 'Глава 1.1',
    clauseText: 'Особо опасные помещения характеризуются наличием одного из условий: особая сырость, химически активная среда, одновременное наличие двух или более условий повышенной опасности.',
  },
  {
    id: 'q-30',
    courseId: 'course-1',
    question: 'Какова максимальная масса груза для женщин при подъеме вручную?',
    options: ['5 кг', '7 кг', '10 кг', '15 кг'],
    correctAnswer: 2,
    regulatoryDocument: 'Постановление Правительства РФ от 25.02.2000 N 162',
    documentClause: 'Приложение',
    clauseText: 'Предельно допустимая масса груза при подъеме и перемещении тяжестей вручную для женщин составляет 10 кг.',
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