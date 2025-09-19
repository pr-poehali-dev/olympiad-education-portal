import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type Grade = 'preschool' | 'grade1' | 'grade2' | 'grade3' | 'grade4';
type Subject = 'math' | 'russian' | 'english' | 'reading' | 'traffic' | 'informatics' | 'logic' | 'world' | 'meta';

interface Olympiad {
  id: string;
  subject: Subject;
  grade: Grade;
  title: string;
  description: string;
  duration: number;
  questionsCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  grade: Grade;
  results: OlympiadResult[];
}

interface OlympiadResult {
  olympiadId: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  certificateUrl?: string;
}

const gradeNames = {
  preschool: 'Дошкольная группа',
  grade1: '1 класс',
  grade2: '2 класс', 
  grade3: '3 класс',
  grade4: '4 класс'
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
  reading: 'Book',
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
    description: 'Веселые задачки на сложение и вычитание',
    duration: 30,
    questionsCount: 10,
    difficulty: 'easy'
  },
  {
    id: '2',
    subject: 'russian',
    grade: 'grade1',
    title: 'Буквы и звуки',
    description: 'Изучаем алфавит и правописание',
    duration: 25,
    questionsCount: 15,
    difficulty: 'easy'
  },
  {
    id: '3',
    subject: 'logic',
    grade: 'grade2',
    title: 'Логические цепочки',
    description: 'Развиваем логическое мышление',
    duration: 40,
    questionsCount: 12,
    difficulty: 'medium'
  },
  {
    id: '4',
    subject: 'english',
    grade: 'grade3',
    title: 'Мои первые слова',
    description: 'Изучаем английские слова и фразы',
    duration: 35,
    questionsCount: 20,
    difficulty: 'medium'
  },
  {
    id: '5',
    subject: 'traffic',
    grade: 'preschool',
    title: 'Безопасная дорога',
    description: 'Основы дорожной безопасности для малышей',
    duration: 20,
    questionsCount: 8,
    difficulty: 'easy'
  }
];

function Index() {
  const [currentView, setCurrentView] = useState<'home' | 'olympiads' | 'profile' | 'auth'>('home');
  const [selectedGrade, setSelectedGrade] = useState<Grade>('grade1');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const mockUser: UserProfile = {
    firstName: 'Анна',
    lastName: 'Петрова',
    email: 'anna.petrova@example.com',
    grade: 'grade2',
    results: [
      {
        olympiadId: '1',
        score: 8,
        maxScore: 10,
        completedAt: new Date('2024-01-15'),
        certificateUrl: '/certificates/cert-1.pdf'
      },
      {
        olympiadId: '3',
        score: 10,
        maxScore: 12,
        completedAt: new Date('2024-02-10'),
        certificateUrl: '/certificates/cert-2.pdf'
      }
    ]
  };

  const handleLogin = () => {
    setUser(mockUser);
    setCurrentView('home');
  };

  const filteredOlympiads = mockOlympiads.filter(o => o.grade === selectedGrade);

  const renderHeader = () => (
    <header className=\"bg-white shadow-sm border-b border-gray-100\">
      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">
        <div className=\"flex justify-between items-center h-16\">
          <div className=\"flex items-center space-x-4\">
            <div 
              className=\"flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity\"
              onClick={() => setCurrentView('home')}
            >
              <div className=\"w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center\">
                <Icon name=\"Trophy\" size={20} className=\"text-white\" />
              </div>
              <h1 className=\"text-xl font-montserrat font-bold text-secondary\">За скобками</h1>
            </div>
          </div>
          
          <nav className=\"hidden md:flex items-center space-x-6\">
            <Button 
              variant=\"ghost\" 
              onClick={() => setCurrentView('olympiads')}
              className=\"font-open-sans hover:text-primary\"
            >
              Олимпиады
            </Button>
            <Button variant=\"ghost\" className=\"font-open-sans hover:text-primary\">FAQ</Button>
            <Button variant=\"ghost\" className=\"font-open-sans hover:text-primary\">О нас</Button>
            <Button variant=\"ghost\" className=\"font-open-sans hover:text-primary\">Контакты</Button>
          </nav>

          <div className=\"flex items-center space-x-4\">
            {user ? (
              <div className=\"flex items-center space-x-3\">
                <Avatar 
                  className=\"cursor-pointer hover:ring-2 hover:ring-primary transition-all\" 
                  onClick={() => setCurrentView('profile')}
                >
                  <AvatarFallback className=\"bg-primary text-white font-montserrat\">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className=\"hidden sm:block font-open-sans text-sm text-secondary\">{user.firstName}</span>
              </div>
            ) : (
              <Button 
                onClick={() => setCurrentView('auth')}
                className=\"bg-primary hover:bg-primary-600 text-white font-open-sans\"
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
    <div className=\"min-h-screen bg-gradient-to-br from-primary-50 to-white\">
      <section className=\"py-20 px-4\">
        <div className=\"max-w-6xl mx-auto text-center\">
          <h1 className=\"text-4xl md:text-6xl font-montserrat font-bold text-secondary mb-6 animate-fade-in\">
            Образовательные <span className=\"text-primary\">олимпиады</span><br />
            для юных талантов
          </h1>
          <p className=\"text-lg text-muted-foreground font-open-sans max-w-2xl mx-auto mb-12 animate-fade-in\">
            Развивайте знания и навыки ваших детей через увлекательные олимпиады 
            по всем школьным предметам с автоматической выдачей сертификатов
          </p>
          
          <div className=\"flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in\">
            <Button 
              size=\"lg\" 
              onClick={() => setCurrentView('olympiads')}
              className=\"bg-primary hover:bg-primary-600 text-white font-open-sans px-8 py-3\"
            >
              <Icon name=\"Trophy\" size={20} className=\"mr-2\" />
              Начать олимпиаду
            </Button>
            <Button 
              size=\"lg\" 
              variant=\"outline\" 
              className=\"border-primary text-primary hover:bg-primary-50 font-open-sans px-8 py-3\"
            >
              <Icon name=\"BookOpen\" size={20} className=\"mr-2\" />
              Узнать больше
            </Button>
          </div>

          <div className=\"grid grid-cols-1 md:grid-cols-5 gap-4 mb-16\">
            {Object.entries(gradeNames).map(([grade, name]) => (
              <Card 
                key={grade}
                className=\"p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 border border-primary-100 animate-fade-in\"
                onClick={() => {
                  setSelectedGrade(grade as Grade);
                  setCurrentView('olympiads');
                }}
              >
                <div className=\"text-center\">
                  <div className=\"w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3\">
                    <Icon name=\"GraduationCap\" size={24} className=\"text-primary\" />
                  </div>
                  <h3 className=\"font-montserrat font-semibold text-secondary\">{name}</h3>
                  <p className=\"text-sm text-muted-foreground font-open-sans mt-1\">
                    {mockOlympiads.filter(o => o.grade === grade).length} олимпиад
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <div className=\"grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto\">
            <div className=\"text-center animate-fade-in\">
              <div className=\"text-3xl font-montserrat font-bold text-primary mb-2\">1000+</div>
              <div className=\"text-muted-foreground font-open-sans\">Участников</div>
            </div>
            <div className=\"text-center animate-fade-in\">
              <div className=\"text-3xl font-montserrat font-bold text-primary mb-2\">50+</div>
              <div className=\"text-muted-foreground font-open-sans\">Олимпиад</div>
            </div>
            <div className=\"text-center animate-fade-in\">
              <div className=\"text-3xl font-montserrat font-bold text-primary mb-2\">95%</div>
              <div className=\"text-muted-foreground font-open-sans\">Довольных родителей</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderOlympiads = () => (
    <div className=\"min-h-screen bg-gray-50 py-8\">
      <div className=\"max-w-6xl mx-auto px-4\">
        <div className=\"mb-8\">
          <h1 className=\"text-3xl font-montserrat font-bold text-secondary mb-4\">Олимпиады</h1>
          
          <Tabs value={selectedGrade} onValueChange={(value) => setSelectedGrade(value as Grade)}>
            <TabsList className=\"grid w-full grid-cols-5 mb-8\">
              {Object.entries(gradeNames).map(([grade, name]) => (
                <TabsTrigger key={grade} value={grade} className=\"font-open-sans\">
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedGrade}>
              <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
                {Object.entries(subjectNames).map(([subject, name]) => {
                  const olympiad = filteredOlympiads.find(o => o.subject === subject);
                  return (
                    <Card key={subject} className=\"hover:shadow-lg transition-all duration-300 animate-fade-in\">
                      <CardHeader>
                        <div className=\"flex items-center space-x-3\">
                          <div className=\"w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center\">
                            <Icon 
                              name={subjectIcons[subject as Subject]} 
                              size={20} 
                              className=\"text-primary\" 
                            />
                          </div>
                          <div>
                            <CardTitle className=\"font-montserrat text-lg\">{name}</CardTitle>
                            <CardDescription className=\"font-open-sans\">
                              {gradeNames[selectedGrade]}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {olympiad ? (
                          <div className=\"space-y-3\">
                            <p className=\"text-sm text-muted-foreground font-open-sans\">
                              {olympiad.description}
                            </p>
                            <div className=\"flex items-center space-x-4 text-sm text-muted-foreground\">
                              <div className=\"flex items-center space-x-1\">
                                <Icon name=\"Clock\" size={16} />
                                <span className=\"font-open-sans\">{olympiad.duration} мин</span>
                              </div>
                              <div className=\"flex items-center space-x-1\">
                                <Icon name=\"HelpCircle\" size={16} />
                                <span className=\"font-open-sans\">{olympiad.questionsCount} вопросов</span>
                              </div>
                            </div>
                            <Badge 
                              variant={olympiad.difficulty === 'easy' ? 'secondary' : 'default'}
                              className=\"font-open-sans\"
                            >
                              {olympiad.difficulty === 'easy' ? 'Легкий' : 
                               olympiad.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                            </Badge>
                            <Button 
                              className=\"w-full bg-primary hover:bg-primary-600 text-white font-open-sans mt-4\"
                            >
                              Начать олимпиаду
                            </Button>
                          </div>
                        ) : (
                          <div className=\"text-center py-8\">
                            <Icon name=\"Construction\" size={32} className=\"text-muted-foreground mx-auto mb-3\" />
                            <p className=\"text-muted-foreground font-open-sans\">Скоро появится</p>
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
    </div>
  );

  const renderProfile = () => {
    if (!user) return null;

    return (
      <div className=\"min-h-screen bg-gray-50 py-8\">
        <div className=\"max-w-4xl mx-auto px-4\">
          <div className=\"bg-white rounded-lg shadow-sm p-8 mb-8 animate-fade-in\">
            <div className=\"flex items-center space-x-6 mb-8\">
              <Avatar className=\"w-20 h-20\">
                <AvatarFallback className=\"bg-primary text-white text-2xl font-montserrat\">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className=\"text-2xl font-montserrat font-bold text-secondary\">
                  {user.firstName} {user.lastName}
                </h1>
                <p className=\"text-muted-foreground font-open-sans\">{user.email}</p>
                <Badge className=\"mt-2 font-open-sans bg-primary text-white\">{gradeNames[user.grade]}</Badge>
              </div>
            </div>
            
            <Separator className=\"mb-8\" />
            
            <div className=\"flex items-center justify-between mb-6\">
              <h2 className=\"text-xl font-montserrat font-semibold text-secondary\">
                Результаты олимпиад
              </h2>
              <Badge variant=\"outline\" className=\"font-open-sans\">
                Пройдено: {user.results.length}
              </Badge>
            </div>
            
            {user.results.length > 0 ? (
              <div className=\"space-y-4\">
                {user.results.map((result, index) => {
                  const olympiad = mockOlympiads.find(o => o.id === result.olympiadId);
                  if (!olympiad) return null;
                  
                  const percentage = Math.round((result.score / result.maxScore) * 100);
                  
                  return (
                    <Card key={index} className=\"animate-fade-in\">
                      <CardContent className=\"p-6\">
                        <div className=\"flex items-center justify-between\">
                          <div className=\"flex items-center space-x-4\">
                            <div className=\"w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center\">
                              <Icon 
                                name={subjectIcons[olympiad.subject]} 
                                size={20} 
                                className=\"text-primary\" 
                              />
                            </div>
                            <div>
                              <h3 className=\"font-montserrat font-semibold\">{olympiad.title}</h3>
                              <p className=\"text-sm text-muted-foreground font-open-sans\">
                                {subjectNames[olympiad.subject]} • {gradeNames[olympiad.grade]}
                              </p>
                              <p className=\"text-xs text-muted-foreground font-open-sans\">
                                Пройдено: {result.completedAt.toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                          </div>
                          <div className=\"text-right\">
                            <div className=\"text-2xl font-montserrat font-bold text-primary\">
                              {percentage}%
                            </div>
                            <div className=\"text-sm text-muted-foreground font-open-sans\">
                              {result.score} из {result.maxScore} баллов
                            </div>
                            {result.certificateUrl && (
                              <Button 
                                variant=\"outline\" 
                                size=\"sm\" 
                                className=\"mt-2 font-open-sans hover:bg-primary hover:text-white\"
                              >
                                <Icon name=\"Download\" size={16} className=\"mr-2\" />
                                Сертификат
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
              <div className=\"text-center py-12\">
                <Icon name=\"Trophy\" size={64} className=\"text-muted-foreground mx-auto mb-4\" />
                <h3 className=\"text-lg font-montserrat font-semibold text-muted-foreground mb-2\">
                  Пока нет результатов
                </h3>
                <p className=\"text-muted-foreground font-open-sans mb-6\">
                  Пройдите первую олимпиаду, чтобы увидеть результаты здесь
                </p>
                <Button 
                  onClick={() => setCurrentView('olympiads')}
                  className=\"bg-primary hover:bg-primary-600 text-white font-open-sans\"
                >
                  Перейти к олимпиадам
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAuth = () => (
    <div className=\"min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center py-12 px-4\">
      <Card className=\"w-full max-w-md animate-scale-in\">
        <CardHeader className=\"text-center\">
          <CardTitle className=\"text-2xl font-montserrat font-bold text-secondary\">
            {isLoginMode ? 'Вход' : 'Регистрация'}
          </CardTitle>
          <CardDescription className=\"font-open-sans\">
            {isLoginMode 
              ? 'Войдите в свой аккаунт для участия в олимпиадах'
              : 'Создайте аккаунт для участия в олимпиадах'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className=\"space-y-4\">
          {!isLoginMode && (
            <>
              <div className=\"grid grid-cols-2 gap-4\">
                <div className=\"space-y-2\">
                  <Label htmlFor=\"firstName\" className=\"font-open-sans\">Имя</Label>
                  <Input id=\"firstName\" placeholder=\"Анна\" />
                </div>
                <div className=\"space-y-2\">
                  <Label htmlFor=\"lastName\" className=\"font-open-sans\">Фамилия</Label>
                  <Input id=\"lastName\" placeholder=\"Петрова\" />
                </div>
              </div>
              <div className=\"space-y-2\">
                <Label htmlFor=\"grade\" className=\"font-open-sans\">Класс</Label>
                <select className=\"w-full px-3 py-2 border border-gray-300 rounded-md font-open-sans\">
                  {Object.entries(gradeNames).map(([grade, name]) => (
                    <option key={grade} value={grade}>{name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className=\"space-y-2\">
            <Label htmlFor=\"email\" className=\"font-open-sans\">Email</Label>
            <Input id=\"email\" type=\"email\" placeholder=\"anna@example.com\" />
          </div>
          <div className=\"space-y-2\">
            <Label htmlFor=\"password\" className=\"font-open-sans\">Пароль</Label>
            <Input id=\"password\" type=\"password\" />
          </div>
          <Button 
            className=\"w-full bg-primary hover:bg-primary-600 text-white font-open-sans\"
            onClick={handleLogin}
          >
            {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
          </Button>
          <div className=\"text-center\">
            <Button 
              variant=\"link\" 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className=\"font-open-sans text-primary hover:text-primary-600\"
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

  return (
    <div className=\"min-h-screen bg-white font-open-sans\">
      {renderHeader()}
      {currentView === 'home' && renderHome()}
      {currentView === 'olympiads' && renderOlympiads()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'auth' && renderAuth()}
    </div>
  );
}

export default Index;