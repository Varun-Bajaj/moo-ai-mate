import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-dairy-farm.jpg";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";

const DairyHero = () => {
  const { tSync } = useLanguage();
  
  const scrollToMilkYieldForm = () => {
    const element = document.getElementById('milk-yield-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToChatInterface = () => {
    const element = document.getElementById('chat-interface');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 dark:from-primary/95 dark:to-primary/80"></div>
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      </div>
      
      {/* Theme and Language Toggles - Fixed Position */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <Badge className="mb-6 bg-success text-success-foreground text-sm font-medium">
          🐄 AI-Powered Dairy Management
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {tSync('hero.title', 'Dairy AI Assistant')}
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          {tSync('hero.subtitle', 'Predict milk yield, detect diseases early, and get expert advice in multiple languages. Empower your dairy farming with AI technology.')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 dark:bg-primary dark:text-white dark:hover:bg-primary/90 px-8 py-4 text-lg font-semibold border-2 border-white dark:border-primary"
            onClick={scrollToMilkYieldForm}
          >
            {tSync('hero.startPredicting', 'Start Predicting')}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary dark:border-white/80 dark:hover:bg-white dark:hover:text-primary px-8 py-4 text-lg font-semibold"
            onClick={scrollToChatInterface}
          >
            {tSync('hero.chatAssistant', 'Chat with AI Assistant')}
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-white/80 dark:text-white/70">{tSync('hero.farmersHelped', 'Farmers Helped')}</div>
          </div>
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
            <div className="text-3xl font-bold text-white">95%</div>
            <div className="text-white/80 dark:text-white/70">{tSync('hero.predictionAccuracy', 'Prediction Accuracy')}</div>
          </div>
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-white/80 dark:text-white/70">{tSync('hero.aiSupport', 'AI Support')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DairyHero;