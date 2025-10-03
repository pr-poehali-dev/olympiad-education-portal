import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserProfile, ViewType } from '@/types';

interface HeaderProps {
  user: UserProfile | null;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

export default function Header({ user, onViewChange, onLogout }: HeaderProps) {
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
