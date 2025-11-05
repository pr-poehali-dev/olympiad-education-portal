import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { UserProfile, ViewType } from '@/types';

interface HeaderProps {
  user: UserProfile | null;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

export default function Header({ user, onViewChange, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (view: ViewType) => {
    onViewChange(view);
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-primary-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onViewChange('home')}
            >
              <img 
                src="https://cdn.poehali.dev/files/9b209914-bd9b-4460-b717-2bfabce4ce7e.png" 
                alt="За скобками" 
                className="h-12 w-auto"
              />
              <img 
                src="https://cdn.poehali.dev/files/1d1bd7ee-b7d7-4e6a-bf25-0dc2d9086f96.png" 
                alt="ЗА СКОБКАМИ" 
                className="h-8 w-auto"
              />
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => onViewChange('olympiads')}
              className="font-open-sans hover:text-primary text-base"
            >
              Олимпиады
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onViewChange('faq')}
              className="font-open-sans hover:text-primary text-base"
            >
              FAQ
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onViewChange('about')}
              className="font-open-sans hover:text-primary text-base"
            >
              О нас
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onViewChange('contacts')}
              className="font-open-sans hover:text-primary text-base"
            >
              Контакты
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Icon name="Menu" size={24} className="text-secondary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="font-montserrat text-2xl text-secondary">Меню</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('home')}
                    className="justify-start font-open-sans text-lg hover:bg-primary-100"
                  >
                    <Icon name="Home" size={20} className="mr-3" />
                    Главная
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('olympiads')}
                    className="justify-start font-open-sans text-lg hover:bg-primary-100"
                  >
                    <Icon name="Trophy" size={20} className="mr-3" />
                    Олимпиады
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('faq')}
                    className="justify-start font-open-sans text-lg hover:bg-primary-100"
                  >
                    <Icon name="HelpCircle" size={20} className="mr-3" />
                    FAQ
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('about')}
                    className="justify-start font-open-sans text-lg hover:bg-primary-100"
                  >
                    <Icon name="Info" size={20} className="mr-3" />
                    О нас
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation('contacts')}
                    className="justify-start font-open-sans text-lg hover:bg-primary-100"
                  >
                    <Icon name="Mail" size={20} className="mr-3" />
                    Контакты
                  </Button>
                  {user && (
                    <>
                      <div className="border-t pt-4 mt-4">
                        <Button
                          variant="ghost"
                          onClick={() => handleNavigation('profile')}
                          className="justify-start font-open-sans text-lg hover:bg-primary-100 w-full"
                        >
                          <Icon name="User" size={20} className="mr-3" />
                          Профиль
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => { onLogout(); setIsOpen(false); }}
                          className="justify-start font-open-sans text-lg hover:bg-primary-100 w-full text-muted-foreground"
                        >
                          <Icon name="LogOut" size={20} className="mr-3" />
                          Выйти
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            {user ? (
              <div className="flex items-center space-x-3">
                <Avatar 
                  className="cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
                  onClick={() => onViewChange('profile')}
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
                    onClick={onLogout}
                    className="ml-2 text-xs text-muted-foreground hover:text-primary"
                  >
                    Выйти
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={() => onViewChange('auth')}
                className="bg-primary hover:bg-primary-600 text-white font-open-sans px-6 shadow-md"
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}