import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

type Grade = 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5';
type Subject = 'math' | 'russian' | 'english' | 'reading' | 'traffic' | 'informatics' | 'logic' | 'world' | 'meta';
type ViewType = 'home' | 'olympiads' | 'faq' | 'about' | 'contacts' | 'auth' | 'profile' | 'change-password' | 'olympiad-quiz';

interface Olympiad {
  id: string;
  subject: Subject;
  grade: Grade;
  title: string;
  description: string;
  duration: number;
  questionsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  certificateTemplate: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  grade: Grade;
  registrationDate: Date;
  results: OlympiadResult[];
}

interface OlympiadResult {
  olympiadId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  certificateUrl?: string;
  position: number;
  totalParticipants: number;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizState {
  olympiadId: string;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: number[];
  timeLeft: number;
  isComplete: boolean;
  startTime: Date;
}

const gradeNames = {
  grade1: '1 класс',
  grade2: '2 класс', 
  grade3: '3 класс',
  grade4: '4 класс',
  grade5: '5 класс'
};

const subjectNames = {
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

const subjectIcons = {
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

const mockOlympiads: Olympiad[] = [
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

const mockQuestions: { [olympiadId: string]: QuizQuestion[] } = {
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

const teamMembers: TeamMember[] = [
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

const faqData: FAQItem[] = [
  {
    question: 'Как участвовать в олимпиадах?',
    answer: 'Для участия в олимпиадах необходимо зарегистрироваться на сайте, выбрать подходящую олимпиаду по классу и предмету, и пройти тестирование онлайн.'
  },
  {
    question: 'Сколько стоит участие?',
    answer: 'Участие в олимпиаде стоит 197 рублей за олимпиаду.'
  },
  {
    question: 'Как получить сертификат?',
    answer: 'Сертификат автоматически генерируется после прохождения олимпиады и становится доступен для скачивания в личном кабинете участника.'
  },

  {
    question: 'Какие требования к техническому оборудованию?',
    answer: 'Для участия достаточно любого устройства с доступом в интернет - компьютер, планшет или смартфон с современным браузером.'
  }
];

function Index() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedGrade, setSelectedGrade] = useState<Grade>('grade1');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const mockUser: UserProfile = {
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

  const handleLogin = () => {
    setUser(mockUser);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const startOlympiad = (olympiadId: string) => {
    if (!user) return;
    
    const questions = mockQuestions[olympiadId];
    if (!questions) return;
    
    const olympiad = mockOlympiads.find(o => o.id === olympiadId);
    if (!olympiad) return;
    
    setQuizState({
      olympiadId,
      questions: questions.slice(0, olympiad.questionsCount),
      currentQuestionIndex: 0,
      answers: [],
      timeLeft: 0,
      isComplete: false,
      startTime: new Date()
    });
    
    setCurrentView('olympiad-quiz');
  };

  const answerQuestion = (answerIndex: number) => {
    if (!quizState || quizState.isComplete) return;
    
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = answerIndex;
    
    const nextIndex = quizState.currentQuestionIndex + 1;
    const isLastQuestion = nextIndex >= quizState.questions.length;
    
    if (isLastQuestion) {
      const score = calculateScore(quizState.questions, newAnswers);
      completeOlympiad(score, newAnswers.length);
    } else {
      setQuizState({
        ...quizState,
        answers: newAnswers,
        currentQuestionIndex: nextIndex
      });
    }
  };

  const calculateScore = (questions: QuizQuestion[], answers: number[]): number => {
    return answers.reduce((score, answer, index) => {
      if (questions[index] && answer === questions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const completeOlympiad = (score: number, totalQuestions: number) => {
    if (!user || !quizState) return;
    
    const olympiad = mockOlympiads.find(o => o.id === quizState.olympiadId);
    if (!olympiad) return;
    
    const newResult: OlympiadResult = {
      olympiadId: quizState.olympiadId,
      score,
      maxScore: totalQuestions,
      completedAt: new Date(),
      position: Math.floor(Math.random() * 100) + 1,
      totalParticipants: olympiad.participants,
      certificateUrl: `/certificates/cert-${Date.now()}.pdf`
    };
    
    const updatedUser = {
      ...user,
      results: [...user.results.filter(r => r.olympiadId !== quizState.olympiadId), newResult]
    };
    
    setUser(updatedUser);
    setQuizState({ ...quizState, isComplete: true });
    
    setTimeout(() => {
      setCurrentView('profile');
      setQuizState(null);
    }, 3000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Спасибо за обращение! Мы свяжемся с вами в ближайшее время.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const filteredOlympiads = mockOlympiads.filter(o => o.grade === selectedGrade);
  const totalParticipants = mockOlympiads.reduce((sum, o) => sum + o.participants, 0);

  const renderHeader = () => (
    <header className="bg-gradient-to-r from-white to-primary-25 shadow-lg border-b border-primary-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center">
                <Icon name="Trophy" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-montserrat font-bold text-secondary">За скобками</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('olympiads')}
              className="font-open-sans hover:text-primary text-base"
            >
              Олимпиады
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('faq')}
              className="font-open-sans hover:text-primary text-base"
            >
              FAQ
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('about')}
              className="font-open-sans hover:text-primary text-base"
            >
              О нас
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setCurrentView('contacts')}
              className="font-open-sans hover:text-primary text-base"
            >
              Контакты
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
                  onClick={() => setCurrentView('profile')}
                >
                  <AvatarFallback className="bg-primary text-white font-montserrat">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <span className="font-open-sans text-sm text-secondary font-medium">{user.firstName}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="ml-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    Выйти
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => setCurrentView('auth')}
                className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-open-sans px-6 shadow-md"
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-orange-25 to-white">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold text-secondary mb-8 animate-fade-in">
            Образовательные <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">олимпиады</span><br />
            для юных талантов
          </h1>
          <p className="text-xl text-muted-foreground font-open-sans max-w-3xl mx-auto mb-12 animate-fade-in leading-relaxed">
            Развивайте знания и навыки ваших детей через увлекательные олимпиады 
            по всем школьным предметам с автоматической выдачей сертификатов
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-scale-in">
            <Button 
              size="lg" 
              onClick={() => setCurrentView('olympiads')}
              className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-open-sans px-10 py-4 text-lg shadow-lg"
            >
              <Icon name="Trophy" size={24} className="mr-3" />
              Начать олимпиаду
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => setCurrentView('about')}
              className="border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-orange-500 hover:text-white font-open-sans px-10 py-4 text-lg shadow-md"
            >
              <Icon name="BookOpen" size={24} className="mr-3" />
              Узнать больше
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-20">
            {Object.entries(gradeNames).map(([grade, name]) => (
              <Card 
                key={grade}
                className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-primary-100 hover:border-primary-200 animate-fade-in group bg-gradient-to-br from-white to-primary-25 hover:from-primary-25 hover:to-orange-25"
                onClick={() => {
                  setSelectedGrade(grade as Grade);
                  setCurrentView('olympiads');
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-md">
                    <Icon name="GraduationCap" size={32} className="text-primary" />
                  </div>
                  <h3 className="font-montserrat font-bold text-secondary text-lg mb-2">{name}</h3>
                  <p className="text-muted-foreground font-open-sans">9 олимпиад</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in bg-gradient-to-br from-white to-primary-25 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl font-montserrat font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-3">70000+</div>
              <div className="text-lg text-muted-foreground font-open-sans">Участников</div>
            </div>
            <div className="text-center animate-fade-in bg-gradient-to-br from-white to-orange-25 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl font-montserrat font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-3">40+</div>
              <div className="text-lg text-muted-foreground font-open-sans">Олимпиад</div>
            </div>
            <div className="text-center animate-fade-in bg-gradient-to-br from-white to-primary-25 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl font-montserrat font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-3">98%</div>
              <div className="text-lg text-muted-foreground font-open-sans">Довольных родителей</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderOlympiads = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-25 via-white to-primary-25 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-montserrat font-bold text-secondary mb-4">Олимпиады по классам</h1>
          <p className="text-lg text-muted-foreground font-open-sans max-w-2xl mx-auto">
            Выберите класс и предмет для участия в олимпиаде. Все задания адаптированы под возраст участников.
          </p>
        </div>
        
        <Tabs value={selectedGrade} onValueChange={(value) => setSelectedGrade(value as Grade)}>
          <TabsList className="grid w-full grid-cols-5 mb-12 h-14">
            {Object.entries(gradeNames).map(([grade, name]) => (
              <TabsTrigger key={grade} value={grade} className="font-open-sans text-base py-3">
                {name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedGrade}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(subjectNames).map(([subject, name]) => {
                const olympiad = filteredOlympiads.find(o => o.subject === subject);
                return (
                  <Card key={subject} className="hover:shadow-xl transition-all duration-300 animate-fade-in group border-2 hover:border-primary-200">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center transition-colors">
                          <Icon 
                            name={subjectIcons[subject as Subject]} 
                            size={28} 
                            className="text-primary" 
                          />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="font-montserrat text-xl text-secondary">{name}</CardTitle>
                          <CardDescription className="font-open-sans text-base">
                            {gradeNames[selectedGrade]}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {olympiad ? (
                        <div className="space-y-4">
                          <h3 className="font-montserrat font-semibold text-lg text-secondary">{olympiad.title}</h3>
                          <p className="text-muted-foreground font-open-sans leading-relaxed">
                            {olympiad.description}
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Icon name="Clock" size={18} className="text-primary" />
                              <span className="font-open-sans">15 мин</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="HelpCircle" size={18} className="text-primary" />
                              <span className="font-open-sans">10 вопросов</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Icon name="Users" size={18} className="text-primary" />
                              <span className="font-open-sans">4 623 участников</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-primary hover:bg-primary-600 text-white font-open-sans py-6 text-lg mt-6"
                            disabled={!user}
                            onClick={() => user && startOlympiad(olympiad.id)}
                          >
                            {user ? 'Начать олимпиаду' : 'Войдите для участия'}
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Icon name="Construction" size={48} className="text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-montserrat font-semibold text-lg text-muted-foreground mb-2">Скоро появится</h3>
                          <p className="text-muted-foreground font-open-sans">Мы работаем над созданием олимпиады</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-25 to-orange-25 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-montserrat font-bold text-secondary mb-4">Часто задаваемые вопросы</h1>
          <p className="text-lg text-muted-foreground font-open-sans">
            Ответы на популярные вопросы участников и родителей
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-2 border-gray-100 rounded-lg px-6">
              <AccordionTrigger className="font-montserrat font-semibold text-lg text-left hover:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-open-sans text-muted-foreground leading-relaxed text-base pt-2 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-8 bg-primary-50 rounded-2xl text-center">
          <Icon name="MessageCircle" size={48} className="text-primary mx-auto mb-4" />
          <h3 className="font-montserrat font-bold text-xl text-secondary mb-2">Не нашли ответ?</h3>
          <p className="text-muted-foreground font-open-sans mb-6">
            Свяжитесь с нами, и мы ответим на любые вопросы
          </p>
          <Button 
            onClick={() => setCurrentView('contacts')}
            className="bg-primary hover:bg-primary-600 text-white font-open-sans px-8"
          >
            Связаться с нами
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-25 via-white to-orange-25 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-montserrat font-bold text-secondary mb-6">О проекте "За скобками"</h1>
          <p className="text-xl text-muted-foreground font-open-sans max-w-3xl mx-auto leading-relaxed">
            Наша миссия — сделать образование увлекательным и доступным для каждого ребенка, 
            помогая раскрыть их потенциал через интерактивные олимпиады и современные методики обучения.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8 bg-white">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Icon name="Target" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-xl text-secondary mb-2">Наша цель</h3>
                <p className="text-muted-foreground font-open-sans leading-relaxed">
                  Создать современную образовательную платформу, которая поможет детям развивать 
                  критическое мышление, логику и предметные знания в игровой форме.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-white">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Icon name="Heart" size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-xl text-secondary mb-2">Наши ценности</h3>
                <p className="text-muted-foreground font-open-sans leading-relaxed">
                  Мы верим в индивидуальный подход к каждому ребенку, качественное образование 
                  и поддержку творческого потенциала юных талантов.
                </p>
              </div>
            </div>
          </Card>
        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Award" size={32} className="text-primary" />
            </div>
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-2">2019</h3>
            <p className="text-muted-foreground font-open-sans">Год основания проекта</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} className="text-primary" />
            </div>
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-2">74 000+</h3>
            <p className="text-muted-foreground font-open-sans">Участников за все время</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="BookOpen" size={32} className="text-primary" />
            </div>
            <h3 className="font-montserrat font-bold text-2xl text-primary mb-2">9</h3>
            <p className="text-muted-foreground font-open-sans">Предметных направлений</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-25 via-white to-orange-25 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-montserrat font-bold text-secondary mb-4">Свяжитесь с нами</h1>
          <p className="text-lg text-muted-foreground font-open-sans">
            Мы всегда готовы ответить на ваши вопросы и помочь
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-montserrat font-bold text-secondary mb-8">Контактная информация</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Icon name="Mail" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-secondary mb-1">Email</h3>
                  <p className="text-muted-foreground font-open-sans">za-skobkami.info@yandex.ru</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Icon name="Phone" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-secondary mb-1">Телефон</h3>
                  <p className="text-muted-foreground font-open-sans">+7 (495) 123-45-67</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Icon name="Clock" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-montserrat font-semibold text-secondary mb-1">Время работы</h3>
                  <p className="text-muted-foreground font-open-sans">Пн-Пт: 9:00-18:00<br />Сб-Вс: 10:00-16:00</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-montserrat font-semibold text-secondary mb-4">Социальные сети</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white">
                  <Icon name="Send" size={18} className="mr-2" />
                  Telegram
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-primary hover:text-white">
                  <Icon name="MessageCircle" size={18} className="mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-8">
            <h2 className="text-2xl font-montserrat font-bold text-secondary mb-6">Форма обратной связи</h2>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-open-sans font-medium">Имя *</Label>
                <Input 
                  id="name" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  placeholder="Ваше имя" 
                  required 
                  className="py-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="font-open-sans font-medium">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  placeholder="your@email.com" 
                  required 
                  className="py-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="font-open-sans font-medium">Тема</Label>
                <Input 
                  id="subject" 
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  placeholder="Тема обращения" 
                  className="py-3"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="font-open-sans font-medium">Сообщение *</Label>
                <Textarea 
                  id="message" 
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="Ваше сообщение..." 
                  rows={6}
                  required 
                  className="resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-600 text-white font-open-sans py-3"
              >
                <Icon name="Send" size={20} className="mr-2" />
                Отправить сообщение
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!user) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-25 via-white to-primary-25 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 mb-8 animate-fade-in">
            <div className="flex items-center space-x-8 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-white text-3xl font-montserrat">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-montserrat font-bold text-secondary mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-muted-foreground font-open-sans text-lg mb-2">{user.email}</p>
                <div className="flex items-center space-x-4">
                  <Badge className="font-open-sans bg-primary text-white text-base px-3 py-1">
                    {gradeNames[user.grade]}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-open-sans">
                    Регистрация: {user.registrationDate.toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('change-password')}
                className="font-open-sans hover:bg-primary hover:text-white"
              >
                <Icon name="Settings" size={18} className="mr-2" />
                Настройки
              </Button>
            </div>
            
            <Separator className="mb-8" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-montserrat font-bold text-secondary">
                Результаты олимпиад
              </h2>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="font-open-sans text-base px-3 py-1">
                  Пройдено: {user.results.length}
                </Badge>
                <Button 
                  onClick={() => setCurrentView('olympiads')}
                  className="bg-primary hover:bg-primary-600 text-white font-open-sans"
                >
                  Новая олимпиада
                </Button>
              </div>
            </div>
            
            {user.results.length > 0 ? (
              <div className="space-y-6">
                {user.results.map((result, index) => {
                  const olympiad = mockOlympiads.find(o => o.id === result.olympiadId);
                  if (!olympiad) return null;
                  
                  const percentage = Math.round((result.score / result.maxScore) * 100);
                  
                  return (
                    <Card key={index} className="animate-fade-in border-2 hover:border-primary-200 transition-colors">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                              <Icon 
                                name={subjectIcons[olympiad.subject]} 
                                size={28} 
                                className="text-primary" 
                              />
                            </div>
                            <div>
                              <h3 className="font-montserrat font-bold text-xl text-secondary mb-1">{olympiad.title}</h3>
                              <p className="text-muted-foreground font-open-sans text-lg">
                                {subjectNames[olympiad.subject]} • {gradeNames[olympiad.grade]}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <span className="font-open-sans">
                                  Пройдено: {result.completedAt.toLocaleDateString('ru-RU')}
                                </span>
                                <span className="font-open-sans">
                                  Место: {result.position} из {result.totalParticipants}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-montserrat font-bold text-primary mb-1">
                              {percentage}%
                            </div>
                            <div className="text-lg text-muted-foreground font-open-sans mb-4">
                              {result.score} из {result.maxScore} баллов
                            </div>
                            {result.certificateUrl && (
                              <Button 
                                variant="outline" 
                                className="font-open-sans hover:bg-primary hover:text-white px-6"
                              >
                                <Icon name="Download" size={18} className="mr-2" />
                                Скачать сертификат
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Icon name="Trophy" size={80} className="text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-montserrat font-bold text-muted-foreground mb-4">
                  Пока нет результатов
                </h3>
                <p className="text-lg text-muted-foreground font-open-sans mb-8 max-w-md mx-auto">
                  Пройдите первую олимпиаду, чтобы увидеть результаты и получить сертификат
                </p>
                <Button 
                  onClick={() => setCurrentView('olympiads')}
                  className="bg-primary hover:bg-primary-600 text-white font-open-sans px-8 py-3 text-lg"
                >
                  Перейти к олимпиадам
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  };

  const renderAuth = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg animate-scale-in">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-montserrat font-bold text-secondary">
            {isLoginMode ? 'Вход в систему' : 'Регистрация'}
          </CardTitle>
          <CardDescription className="font-open-sans text-lg">
            {isLoginMode 
              ? 'Войдите в свой аккаунт для участия в олимпиадах'
              : 'Создайте аккаунт для участия в олимпиадах'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-8">
          {!isLoginMode && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-open-sans font-medium">Имя</Label>
                  <Input id="firstName" placeholder="Анна" className="py-3" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-open-sans font-medium">Фамилия</Label>
                  <Input id="lastName" placeholder="Петрова" className="py-3" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade" className="font-open-sans font-medium">Класс</Label>
                <select className="w-full px-3 py-3 border border-gray-300 rounded-md font-open-sans focus:ring-2 focus:ring-primary focus:border-primary">
                  {Object.entries(gradeNames).map(([grade, name]) => (
                    <option key={grade} value={grade}>{name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-open-sans font-medium">Email</Label>
            <Input id="email" type="email" placeholder="anna@example.com" className="py-3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-open-sans font-medium">Пароль</Label>
            <Input id="password" type="password" className="py-3" />
          </div>
          {!isLoginMode && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-open-sans font-medium">Подтвердите пароль</Label>
              <Input id="confirmPassword" type="password" className="py-3" />
            </div>
          )}
          <Button 
            className="w-full bg-primary hover:bg-primary-600 text-white font-open-sans py-4 text-lg"
            onClick={handleLogin}
          >
            {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
          </Button>
          
          {isLoginMode && (
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setCurrentView('change-password')}
                className="font-open-sans text-primary hover:text-primary-600"
              >
                Забыли пароль?
              </Button>
            </div>
          )}
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="font-open-sans text-primary hover:text-primary-600 text-base"
            >
              {isLoginMode 
                ? 'Нет аккаунта? Зарегистрируйтесь'
                : 'Уже есть аккаунт? Войдите'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChangePassword = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary-25 via-white to-orange-25 py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-montserrat font-bold text-secondary">
              Смена пароля
            </CardTitle>
            <CardDescription className="font-open-sans">
              {user ? 'Введите новый пароль для вашего аккаунта' : 'Введите email для восстановления пароля'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!user && (
              <div className="space-y-2">
                <Label htmlFor="resetEmail" className="font-open-sans font-medium">Email</Label>
                <Input id="resetEmail" type="email" placeholder="your@email.com" className="py-3" />
              </div>
            )}
            {user && (
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="font-open-sans font-medium">Текущий пароль</Label>
                <Input id="currentPassword" type="password" className="py-3" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-open-sans font-medium">
                {user ? 'Новый пароль' : 'Временный пароль будет отправлен на email'}
              </Label>
              {user && <Input id="newPassword" type="password" className="py-3" />}
            </div>
            {user && (
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword" className="font-open-sans font-medium">Подтвердите новый пароль</Label>
                <Input id="confirmNewPassword" type="password" className="py-3" />
              </div>
            )}
            <Button 
              className="w-full bg-primary hover:bg-primary-600 text-white font-open-sans py-3"
              onClick={() => {
                alert(user ? 'Пароль успешно изменен!' : 'Инструкции отправлены на email!');
                setCurrentView(user ? 'profile' : 'auth');
              }}
            >
              {user ? 'Изменить пароль' : 'Восстановить пароль'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full font-open-sans"
              onClick={() => setCurrentView(user ? 'profile' : 'auth')}
            >
              Отмена
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderOlympiadQuiz = () => {
    if (!quizState || !user) return null;

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const olympiad = mockOlympiads.find(o => o.id === quizState.olympiadId);
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;

    if (quizState.isComplete) {
      const score = calculateScore(quizState.questions, quizState.answers);
      const percentage = Math.round((score / quizState.questions.length) * 100);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-orange-25 to-white flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-2xl animate-scale-in shadow-2xl border-2 border-primary-200">
            <CardContent className="p-12 text-center bg-gradient-to-br from-white to-primary-25 rounded-lg">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Icon name="Trophy" size={64} className="text-primary" />
              </div>
              <h1 className="text-5xl font-montserrat font-bold text-secondary mb-6">
                Олимпиада завершена!
              </h1>
              <p className="text-2xl text-muted-foreground font-open-sans mb-8">
                Вы набрали {score} из {quizState.questions.length} баллов ({percentage}%)
              </p>
              <Badge className="bg-gradient-to-r from-primary to-orange-500 text-white text-xl px-8 py-3 mb-8 shadow-lg">
                Сертификат готов к скачиванию!
              </Badge>
              <div className="bg-gradient-to-r from-primary-50 to-orange-50 p-6 rounded-xl mb-6">
                <Icon name="Star" size={32} className="text-primary mx-auto mb-2" />
                <p className="text-lg text-secondary font-montserrat font-semibold">
                  Отличная работа! Продолжайте развиваться!
                </p>
              </div>
              <p className="text-muted-foreground font-open-sans">
                Переходим в личный кабинет...
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 animate-fade-in shadow-2xl border-2 border-primary-200 bg-gradient-to-br from-white to-primary-25">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-montserrat font-bold text-secondary mb-4">
                  {olympiad?.title}
                </h1>
                <div className="flex items-center justify-center space-x-4">
                  <Badge className="bg-primary text-white text-lg px-4 py-2">
                    Вопрос {quizState.currentQuestionIndex + 1} из {quizState.questions.length}
                  </Badge>
                  <Badge variant="outline" className="border-primary text-primary text-lg px-4 py-2">
                    Без ограничения времени
                  </Badge>
                </div>
              </div>
              
              <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-4 mb-8 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-primary to-orange-500 h-4 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="bg-gradient-to-br from-white to-primary-25 rounded-2xl p-8 border-2 border-primary-200 shadow-lg">
                <h2 className="text-2xl font-montserrat font-semibold text-secondary mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-6 h-auto text-left justify-start border-2 border-gray-200 hover:border-primary hover:bg-gradient-to-r hover:from-primary-50 hover:to-orange-50 transition-all duration-300 group shadow-md hover:shadow-lg"
                      onClick={() => answerQuestion(index)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-orange-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-sm">
                        <span className="font-montserrat font-bold text-primary">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <span className="font-open-sans text-lg">{option}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-orange-50 font-open-sans">
      {renderHeader()}
      {currentView === 'home' && renderHome()}
      {currentView === 'olympiads' && renderOlympiads()}
      {currentView === 'faq' && renderFAQ()}
      {currentView === 'about' && renderAbout()}
      {currentView === 'contacts' && renderContacts()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'auth' && renderAuth()}
      {currentView === 'change-password' && renderChangePassword()}
      {currentView === 'olympiad-quiz' && renderOlympiadQuiz()}
    </div>
  );
}

export default Index;