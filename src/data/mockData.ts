import { Olympiad, QuizQuestion, TeamMember, FAQItem, UserProfile } from '@/types';

export const gradeNames = {
  grade1: '1 класс',
  grade2: '2 класс', 
  grade3: '3 класс',
  grade4: '4 класс',
  grade5: '5 класс'
};

export const subjectNames = {
  math: 'Математика',
  russian: 'Русский язык',
  english: 'Английский язык',
  reading: 'Чтение',
  traffic: 'ПДД',
  informatics: 'Информатика',
  logic: 'Логика',
  world: 'Окружающий мир',
  meta: 'Метапредметная'
};

export const subjectIcons = {
  math: 'Calculator',
  russian: 'BookOpen',
  english: 'Languages',
  reading: 'BookText',
  traffic: 'Car',
  informatics: 'Computer',
  logic: 'Brain',
  world: 'Globe',
  meta: 'Puzzle'
};

export const mockOlympiads: Olympiad[] = [
  {
    id: '1',
    subject: 'math',
    grade: 'grade1',
    title: 'Математические загадки',
    description: 'Веселые задачки на сложение и вычитание с элементами логики',
    duration: 30,
    questionsCount: 10,
    difficulty: 'easy',
    participants: 1250,
    certificateTemplate: 'math-basic'
  },
  {
    id: '2',
    subject: 'russian',
    grade: 'grade1',
    title: 'Буквы и звуки',
    description: 'Изучаем алфавит, правописание и основы грамматики',
    duration: 25,
    questionsCount: 15,
    difficulty: 'easy',
    participants: 980,
    certificateTemplate: 'russian-basic'
  },
  {
    id: '3',
    subject: 'logic',
    grade: 'grade2',
    title: 'Логические цепочки',
    description: 'Развиваем логическое мышление через интересные задачи',
    duration: 40,
    questionsCount: 12,
    difficulty: 'medium',
    participants: 756,
    certificateTemplate: 'logic-medium'
  },
  {
    id: '4',
    subject: 'english',
    grade: 'grade3',
    title: 'Мои первые слова',
    description: 'Изучаем английские слова, фразы и простую грамматику',
    duration: 35,
    questionsCount: 20,
    difficulty: 'medium',
    participants: 623,
    certificateTemplate: 'english-medium'
  },
  {
    id: '5',
    subject: 'traffic',
    grade: 'grade1',
    title: 'Безопасная дорога',
    description: 'Основы дорожной безопасности для первоклассников',
    duration: 20,
    questionsCount: 8,
    difficulty: 'easy',
    participants: 1100,
    certificateTemplate: 'traffic-basic'
  }
];

export const mockQuestions: { [olympiadId: string]: QuizQuestion[] } = {
  '1': [
    {
      id: '1-1',
      question: 'Сколько будет 5 + 3?',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
      explanation: '5 + 3 = 8. Считаем: 5, 6, 7, 8!'
    },
    {
      id: '1-2',
      question: 'У Кати было 10 конфет. Она съела 3. Сколько осталось?',
      options: ['5', '6', '7', '8'],
      correctAnswer: 2,
      explanation: '10 - 3 = 7. От 10 отнимаем 3, получается 7 конфет.'
    },
    {
      id: '1-3',
      question: 'Какое число больше: 4 или 6?',
      options: ['4', '6', 'Одинаковые', 'Не знаю'],
      correctAnswer: 1,
      explanation: '6 больше чем 4. На числовой прямой 6 стоит правее 4.'
    }
  ],
  '3': [
    {
      id: '3-1',
      question: 'Продолжите последовательность: 2, 4, 6, 8, ...',
      options: ['9', '10', '11', '12'],
      correctAnswer: 1,
      explanation: 'Это последовательность четных чисел. После 8 идет 10.'
    },
    {
      id: '3-2',
      question: 'Если все птицы умеют летать, а пингвин - птица, то пингвин умеет летать?',
      options: ['Да', 'Нет', 'Не знаю', 'Иногда'],
      correctAnswer: 1,
      explanation: 'Не все птицы умеют летать! Пингвины - это птицы, которые не летают, но отлично плавают.'
    },
    {
      id: '3-3',
      question: 'У фермера есть куры и кролики, всего 10 голов и 28 ног. Сколько кроликов?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      explanation: 'У курицы 2 ноги, у кролика 4. Если кроликов 4, то у них 16 ног, а у 6 куриц - 12 ног. 16 + 12 = 28!'
    }
  ],
  '5': [
    {
      id: '5-1',
      question: 'На какой свет светофора можно переходить дорогу?',
      options: ['Красный', 'Желтый', 'Зеленый', 'Любой'],
      correctAnswer: 2,
      explanation: 'Переходить дорогу можно только на зеленый свет! Красный - стой, желтый - жди.'
    },
    {
      id: '5-2',
      question: 'Где безопасно переходить дорогу?',
      options: ['Где удобно', 'По пешеходному переходу', 'Рядом с машинами', 'Быстро перебежать'],
      correctAnswer: 1,
      explanation: 'Дорогу нужно переходить только по пешеходному переходу - там водители вас ждут!'
    }
  ]
};

export const teamMembers: TeamMember[] = [
  {
    name: 'Анна Петрова',
    role: 'Основатель и директор',
    bio: 'Педагог с 15-летним стажем, кандидат педагогических наук',
    avatar: 'АП'
  },
  {
    name: 'Михаил Сидоров',
    role: 'Методист',
    bio: 'Эксперт по разработке образовательных программ',
    avatar: 'МС'
  },
  {
    name: 'Елена Козлова',
    role: 'Психолог',
    bio: 'Специалист по детской психологии и развитию',
    avatar: 'ЕК'
  }
];

export const faqData: FAQItem[] = [
  {
    question: 'Как участвовать в онлайн олимпиаде?',
    answer: 'Для участия в олимпиадах необходимо зарегистрироваться на сайте, выбрать подходящую олимпиаду по классу и предмету, и пройти тестирование онлайн.'
  },
  {
    question: 'Как получить сертификат?',
    answer: 'Сертификат автоматически генерируется после прохождения олимпиады и становится доступен для скачивания в личном кабинете участника.'
  },
  {
    question: 'Как участвовать в очной олимпиаде?',
    answer: 'Для участия в очной олимпиаде нужно написать нам в любом удобном мессенджере или на почту. Мы скоординируем в дальнейших действиях.'
  },
  {
    question: 'Ошиблись в имени ребенка, что делать?',
    answer: 'Не волнуйтесь, это не проблема! Наша команда всегда рядом. Просто дайте нам знать об ошибке, укажите номер диплома, и мы все исправим.'
  }
];

export const mockUser: UserProfile = {
  firstName: 'Анна',
  lastName: 'Петрова',
  email: 'anna.petrova@example.com',
  grade: 'grade2',
  registrationDate: new Date('2024-01-10'),
  results: [
    {
      olympiadId: '1',
      score: 8,
      maxScore: 10,
      completedAt: new Date('2024-01-15'),
      certificateUrl: '/certificates/cert-1.pdf',
      position: 15,
      totalParticipants: 1250
    },
    {
      olympiadId: '3',
      score: 10,
      maxScore: 12,
      completedAt: new Date('2024-02-10'),
      certificateUrl: '/certificates/cert-2.pdf',
      position: 3,
      totalParticipants: 756
    }
  ]
};
