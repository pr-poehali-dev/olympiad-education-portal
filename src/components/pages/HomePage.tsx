import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Grade, ViewType } from '@/types';
import { gradeNames } from '@/data/mockData';

interface HomePageProps {
  onViewChange: (view: ViewType) => void;
  onGradeSelect: (grade: Grade) => void;
}

export default function HomePage({ onViewChange, onGradeSelect }: HomePageProps) {
  const handleGradeClick = (grade: Grade) => {
    onGradeSelect(grade);
    onViewChange('olympiads');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="py-8 sm:py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-montserrat font-bold text-secondary mb-4 sm:mb-6 md:mb-8 animate-fade-in">
            Образовательные <span className="text-primary">олимпиады</span><br />
            для юных талантов
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-open-sans max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 animate-fade-in leading-relaxed">
            Развивайте знания и навыки ваших детей через увлекательные олимпиады 
            по всем школьным предметам с автоматической выдачей сертификатов
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 sm:mb-14 md:mb-20 animate-scale-in">
            <Button 
              size="lg" 
              onClick={() => onViewChange('olympiads')}
              className="bg-primary hover:bg-primary-600 text-white font-open-sans px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg shadow-lg"
            >
              <Icon name="Trophy" size={20} className="mr-2 sm:mr-3" />
              Начать олимпиаду
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onViewChange('about')}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-open-sans px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg shadow-md"
            >
              <Icon name="BookOpen" size={24} className="mr-3" />
              Узнать больше
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-10 sm:mb-14 md:mb-20">
            {Object.entries(gradeNames).map(([grade, name]) => (
              <Card 
                key={grade}
                className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-primary-100 hover:border-primary-200 animate-fade-in group bg-white hover:bg-primary-50"
                onClick={() => handleGradeClick(grade as Grade)}
              >
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary-100 group-hover:bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 transition-all duration-300 shadow-md">
                    <Icon name="GraduationCap" size={24} className="text-primary sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className="font-montserrat font-bold text-secondary text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{name}</h3>
                  <p className="text-muted-foreground font-open-sans text-xs sm:text-sm">9 олимпиад</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-12 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold text-primary mb-2 sm:mb-3">70000+</div>
              <div className="text-sm sm:text-base md:text-lg text-muted-foreground font-open-sans">Участников</div>
            </div>
            <div className="text-center animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold text-primary mb-2 sm:mb-3">40+</div>
              <div className="text-sm sm:text-base md:text-lg text-muted-foreground font-open-sans">Олимпиад</div>
            </div>
            <div className="text-center animate-fade-in bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
              <div className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold text-primary mb-2 sm:mb-3">98%</div>
              <div className="text-sm sm:text-base md:text-lg text-muted-foreground font-open-sans">Довольных родителей</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}