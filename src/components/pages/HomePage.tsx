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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-montserrat font-bold text-secondary mb-8 animate-fade-in">
            Образовательные <span className="text-primary">олимпиады</span><br />
            для юных талантов
          </h1>
          <p className="text-xl text-muted-foreground font-open-sans max-w-3xl mx-auto mb-12 animate-fade-in leading-relaxed">
            Развивайте знания и навыки ваших детей через увлекательные олимпиады 
            по всем школьным предметам с автоматической выдачей сертификатов
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-scale-in">
            <Button 
              size="lg" 
              onClick={() => onViewChange('olympiads')}
              className="bg-primary hover:bg-primary-600 text-white font-open-sans px-10 py-4 text-lg shadow-lg"
            >
              <Icon name="Trophy" size={24} className="mr-3" />
              Начать олимпиаду
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onViewChange('about')}
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-open-sans px-10 py-4 text-lg shadow-md"
            >
              <Icon name="BookOpen" size={24} className="mr-3" />
              Узнать больше
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-20">
            {Object.entries(gradeNames).map(([grade, name]) => (
              <Card 
                key={grade}
                className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 border-2 border-primary-100 hover:border-primary-200 animate-fade-in group bg-white hover:bg-primary-50"
                onClick={() => handleGradeClick(grade as Grade)}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 group-hover:bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-md">
                    <Icon name="GraduationCap" size={32} className="text-primary" />
                  </div>
                  <h3 className="font-montserrat font-bold text-secondary text-lg mb-2">{name}</h3>
                  <p className="text-muted-foreground font-open-sans">9 олимпиад</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-5xl font-montserrat font-bold text-primary mb-3">70000+</div>
              <div className="text-lg text-muted-foreground font-open-sans">Участников</div>
            </div>
            <div className="text-center animate-fade-in bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-5xl font-montserrat font-bold text-primary mb-3">40+</div>
              <div className="text-lg text-muted-foreground font-open-sans">Олимпиад</div>
            </div>
            <div className="text-center animate-fade-in bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-5xl font-montserrat font-bold text-primary mb-3">98%</div>
              <div className="text-lg text-muted-foreground font-open-sans">Довольных родителей</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
