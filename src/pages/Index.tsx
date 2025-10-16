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
import Header from '@/components/Header';
import HomePage from '@/components/pages/HomePage';
import { Grade, ViewType, UserProfile, OlympiadResult, QuizState, QuizQuestion } from '@/types';
import { gradeNames, subjectNames, subjectIcons, mockOlympiads, mockQuestions, mockUser, teamMembers, faqData } from '@/data/mockData';

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

  const renderHome = () => (
    <HomePage onViewChange={setCurrentView} onGradeSelect={setSelectedGrade} />
  );

  const renderOlympiads = () => (
    <div className="min-h-screen bg-gray-50 py-12">
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
                          <Icon name={subjectIcons[subject as keyof typeof subjectIcons] as any} size={28} className="text-primary" />
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
                            {user ? 'Начать олимпиаду' : 'Принять участие'}
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
    <div className="min-h-screen bg-gray-50 py-12">
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
            Напишите нам, и мы обязательно вам поможем!
          </p>
          <Button 
            onClick={() => setCurrentView('contacts')}
            className="bg-primary hover:bg-primary-600 text-white font-open-sans px-8 py-3"
          >
            Связаться с нами
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-montserrat font-bold text-secondary mb-4">О нашем проекте</h1>
          <p className="text-lg text-muted-foreground font-open-sans max-w-3xl mx-auto">
            Мы создаем образовательные олимпиады для развития потенциала каждого ребенка
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <Card className="p-8 border-2 border-primary-100">
            <Icon name="Target" size={48} className="text-primary mb-6" />
            <h2 className="font-montserrat font-bold text-2xl text-secondary mb-4">Наша миссия</h2>
            <p className="font-open-sans text-muted-foreground leading-relaxed text-lg">
              Предоставить каждому ребенку возможность развивать свои таланты через интересные и качественные 
              образовательные олимпиады, доступные онлайн в любое время.
            </p>
          </Card>
          
          <Card className="p-8 border-2 border-primary-100">
            <Icon name="Eye" size={48} className="text-primary mb-6" />
            <h2 className="font-montserrat font-bold text-2xl text-secondary mb-4">Наше видение</h2>
            <p className="font-open-sans text-muted-foreground leading-relaxed text-lg">
              Мы стремимся стать ведущей платформой для интеллектуального развития детей, 
              создавая увлекательные задания, которые вдохновляют на изучение нового.
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center border-2 border-primary-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Award" size={32} className="text-primary" />
            </div>
            <h3 className="font-montserrat font-bold text-xl text-secondary mb-3">Качество</h3>
            <p className="font-open-sans text-muted-foreground leading-relaxed">
              Все задания разработаны профессиональными педагогами и методистами
            </p>
          </Card>
          
          <Card className="p-8 text-center border-2 border-primary-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Heart" size={32} className="text-primary" />
            </div>
            <h3 className="font-montserrat font-bold text-xl text-secondary mb-3">Забота</h3>
            <p className="font-open-sans text-muted-foreground leading-relaxed">
              Мы заботимся о комфорте и безопасности каждого участника
            </p>
          </Card>
          
          <Card className="p-8 text-center border-2 border-primary-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Lightbulb" size={32} className="text-primary" />
            </div>
            <h3 className="font-montserrat font-bold text-xl text-secondary mb-3">Инновации</h3>
            <p className="font-open-sans text-muted-foreground leading-relaxed">
              Используем современные подходы к образованию и оценке знаний
            </p>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-montserrat font-bold text-secondary mb-4">Свяжитесь с нами</h1>
          <p className="text-lg text-muted-foreground font-open-sans">
            Мы всегда рады ответить на ваши вопросы и предложения
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center border-2 border-primary-100">
            <Icon name="Mail" size={40} className="text-primary mx-auto mb-4" />
            <h3 className="font-montserrat font-semibold text-lg text-secondary mb-2">Email</h3>
            <p className="font-open-sans text-muted-foreground">info@zaskobkami.ru</p>
          </Card>
          
          <Card className="p-6 text-center border-2 border-primary-100">
            <Icon name="Phone" size={40} className="text-primary mx-auto mb-4" />
            <h3 className="font-montserrat font-semibold text-lg text-secondary mb-2">Телефон</h3>
            <p className="font-open-sans text-muted-foreground">+7 (999) 123-45-67</p>
          </Card>
          
          <Card className="p-6 text-center border-2 border-primary-100">
            <Icon name="MapPin" size={40} className="text-primary mx-auto mb-4" />
            <h3 className="font-montserrat font-semibold text-lg text-secondary mb-2">Адрес</h3>
            <p className="font-open-sans text-muted-foreground">153013, г. Иваново, пр-кт Текстильщиков д.2 кв.66.</p>
          </Card>
        </div>

        <Card className="p-8 border-2 border-primary-100">
          <h2 className="font-montserrat font-bold text-2xl text-secondary mb-6">Отправить сообщение</h2>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="font-open-sans text-base">Ваше имя</Label>
                <Input 
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="font-open-sans mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-open-sans text-base">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="font-open-sans mt-2"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="subject" className="font-open-sans text-base">Тема сообщения</Label>
              <Input 
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="font-open-sans mt-2"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="message" className="font-open-sans text-base">Сообщение</Label>
              <Textarea 
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                className="font-open-sans mt-2 min-h-[150px]"
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-600 text-white font-open-sans py-6 text-lg"
            >
              <Icon name="Send" size={20} className="mr-2" />
              Отправить сообщение
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );

  const renderAuth = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 animate-scale-in border-2 border-primary-100">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="UserCircle" size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-montserrat font-bold text-secondary mb-2">
            {isLoginMode ? 'Вход' : 'Регистрация'}
          </h1>
          <p className="text-muted-foreground font-open-sans">
            {isLoginMode ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
          {!isLoginMode && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="font-open-sans">Имя</Label>
                <Input id="firstName" className="font-open-sans mt-2" required />
              </div>
              <div>
                <Label htmlFor="lastName" className="font-open-sans">Фамилия</Label>
                <Input id="lastName" className="font-open-sans mt-2" required />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="email" className="font-open-sans">Email</Label>
            <Input id="email" type="email" className="font-open-sans mt-2" required />
          </div>
          
          <div>
            <Label htmlFor="password" className="font-open-sans">Пароль</Label>
            <Input id="password" type="password" className="font-open-sans mt-2" required />
          </div>
          
          {!isLoginMode && (
            <div>
              <Label htmlFor="grade" className="font-open-sans">Класс</Label>
              <select 
                id="grade"
                className="w-full mt-2 p-2 border rounded-md font-open-sans"
                required
              >
                {Object.entries(gradeNames).map(([grade, name]) => (
                  <option key={grade} value={grade}>{name}</option>
                ))}
              </select>
            </div>
          )}
          
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-600 text-white font-open-sans py-6"
          >
            {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-primary hover:text-primary-600 font-open-sans text-sm"
          >
            {isLoginMode ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
          </button>
        </div>
      </Card>
    </div>
  );

  const renderProfile = () => {
    if (!user) return null;

    return (
      <div className="min-h-screen bg-gray-50 py-12">
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
                <Icon name="Lock" size={18} className="mr-2" />
                Изменить пароль
              </Button>
            </div>
            
            <Separator className="my-8" />
            
            <div>
              <h2 className="text-2xl font-montserrat font-bold text-secondary mb-6">Мои результаты</h2>
              
              {user.results.length > 0 ? (
                <div className="space-y-4">
                  {user.results.map((result) => {
                    const olympiad = mockOlympiads.find(o => o.id === result.olympiadId);
                    if (!olympiad) return null;
                    
                    return (
                      <Card key={result.olympiadId} className="p-6 border-2 border-primary-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6 flex-1">
                            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                              <Icon name={subjectIcons[olympiad.subject as keyof typeof subjectIcons] as any} size={32} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-montserrat font-bold text-xl text-secondary mb-1">
                                {olympiad.title}
                              </h3>
                              <p className="text-muted-foreground font-open-sans">
                                {subjectNames[olympiad.subject]} • {gradeNames[olympiad.grade]}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-muted-foreground font-open-sans">
                                  Пройдено: {result.completedAt.toLocaleDateString('ru-RU')}
                                </span>
                                <Badge variant="outline" className="font-open-sans">
                                  Место: {result.position} из {result.totalParticipants}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
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
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Trophy" size={64} className="text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-montserrat font-semibold text-xl text-muted-foreground mb-2">
                    Пока нет результатов
                  </h3>
                  <p className="text-muted-foreground font-open-sans mb-6">
                    Примите участие в олимпиаде, чтобы получить первый сертификат!
                  </p>
                  <Button 
                    onClick={() => setCurrentView('olympiads')}
                    className="bg-primary hover:bg-primary-600 text-white font-open-sans px-8 py-3"
                  >
                    <Icon name="Trophy" size={20} className="mr-2" />
                    Выбрать олимпиаду
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderChangePassword = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="p-8 border-2 border-primary-100">
          <h1 className="text-2xl font-montserrat font-bold text-secondary mb-6">Изменить пароль</h1>
          <form onSubmit={(e) => { e.preventDefault(); alert('Пароль успешно изменен!'); setCurrentView('profile'); }} className="space-y-6">
            <div>
              <Label htmlFor="currentPassword" className="font-open-sans">Текущий пароль</Label>
              <Input id="currentPassword" type="password" className="font-open-sans mt-2" required />
            </div>
            
            <div>
              <Label htmlFor="newPassword" className="font-open-sans">Новый пароль</Label>
              <Input id="newPassword" type="password" className="font-open-sans mt-2" required />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword" className="font-open-sans">Подтвердите новый пароль</Label>
              <Input id="confirmPassword" type="password" className="font-open-sans mt-2" required />
            </div>
            
            <div className="flex space-x-4">
              <Button 
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-600 text-white font-open-sans py-3"
              >
                Сохранить
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => setCurrentView('profile')}
                className="flex-1 font-open-sans py-3"
              >
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );

  const renderOlympiadQuiz = () => {
    if (!quizState || !user) return null;
    
    const olympiad = mockOlympiads.find(o => o.id === quizState.olympiadId);
    if (!olympiad) return null;
    
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const progress = ((quizState.currentQuestionIndex + 1) / quizState.questions.length) * 100;
    
    if (quizState.isComplete) {
      const score = calculateScore(quizState.questions, quizState.answers);
      const percentage = Math.round((score / quizState.questions.length) * 100);
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <Card className="w-full max-w-2xl animate-scale-in shadow-2xl border-2 border-primary-200">
            <CardContent className="p-12 text-center bg-white rounded-lg">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Icon name="Trophy" size={64} className="text-primary" />
              </div>
              <h1 className="text-5xl font-montserrat font-bold text-secondary mb-6">
                Олимпиада завершена!
              </h1>
              <p className="text-2xl text-muted-foreground font-open-sans mb-8">
                Вы набрали {score} из {quizState.questions.length} баллов ({percentage}%)
              </p>
              <Badge className="bg-primary text-white text-xl px-8 py-3 mb-8 shadow-lg">
                Сертификат готов к скачиванию!
              </Badge>
              <div className="bg-primary-50 p-6 rounded-xl mb-6">
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
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 animate-fade-in shadow-2xl border-2 border-primary-200 bg-white">
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
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-8 shadow-inner">
                <div 
                  className="bg-primary h-4 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="bg-white rounded-2xl p-8 border-2 border-primary-200 shadow-lg">
                <h2 className="text-2xl font-montserrat font-semibold text-secondary mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-6 h-auto text-left justify-start border-2 border-gray-200 hover:border-primary hover:bg-primary-50 transition-all duration-300 group shadow-md hover:shadow-lg"
                      onClick={() => answerQuestion(index)}
                    >
                      <div className="w-8 h-8 bg-primary-100 group-hover:bg-primary-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-sm">
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
    <div className="min-h-screen bg-gray-50 font-open-sans">
      <Header user={user} onViewChange={setCurrentView} onLogout={handleLogout} />
      {currentView === 'home' && renderHome()}
      {currentView === 'olympiads' && renderOlympiads()}
      {currentView === 'faq' && renderFAQ()}
      {currentView === 'about' && renderAbout()}
      {currentView === 'contacts' && renderContacts()}
      {currentView === 'auth' && renderAuth()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'change-password' && renderChangePassword()}
      {currentView === 'olympiad-quiz' && renderOlympiadQuiz()}
    </div>
  );
}

export default Index;