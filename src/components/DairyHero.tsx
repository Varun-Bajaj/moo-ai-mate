import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-dairy-farm.jpg";

const DairyHero = () => {
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <Badge className="mb-6 bg-success text-success-foreground text-sm font-medium">
          🐄 AI-Powered Dairy Management
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Dairy AI Assistant
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Predict milk yield, detect diseases early, and get expert advice in Hindi or English. 
          Empower your dairy farming with AI technology.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold"
            onClick={scrollToMilkYieldForm}
          >
            Start Predicting
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold"
            onClick={scrollToChatInterface}
          >
            Chat with AI Assistant
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white">500+</div>
            <div className="text-white/80">Farmers Helped</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white">95%</div>
            <div className="text-white/80">Prediction Accuracy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl font-bold text-white">24/7</div>
            <div className="text-white/80">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DairyHero;