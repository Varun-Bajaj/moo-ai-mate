import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/hero-dairy-farm.jpg";

const DairyHero = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden floating-orbs">
      {/* Animated background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-slow"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-mesh opacity-20"></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-glow rounded-full opacity-60 animate-float"></div>
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-floating rounded-lg rotate-45 opacity-40 animate-pulse-glow"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white/30 rounded-full animate-ping"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center slide-up">
        <Badge className="mb-6 bg-white/20 text-white border border-white/30 text-sm font-medium glass hover-scale glow-on-hover">
          🐄 AI-Powered Dairy Management
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight gradient-text animate-fade-in-up">
          Dairy AI Assistant
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          Predict milk yield, detect diseases early, and get expert advice in Hindi or English. 
          Empower your dairy farming with cutting-edge AI technology.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold hover-scale glow-on-hover shadow-neon neon-border">
            Start Predicting ✨
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/50 text-white hover:bg-white/20 px-8 py-4 text-lg font-semibold glass hover-scale backdrop-blur-sm"
          >
            Chat with AI Assistant 🤖
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center stagger-children">
          <div className="glass rounded-2xl p-8 hover-scale glow-on-hover border border-white/20 group">
            <div className="text-4xl font-bold text-white mb-2 gradient-text group-hover:animate-bounce">500+</div>
            <div className="text-white/80 text-lg">Farmers Helped</div>
            <div className="mt-2 text-2xl animate-pulse">🚜</div>
          </div>
          <div className="glass rounded-2xl p-8 hover-scale glow-on-hover border border-white/20 group">
            <div className="text-4xl font-bold text-white mb-2 gradient-text group-hover:animate-bounce">95%</div>
            <div className="text-white/80 text-lg">Prediction Accuracy</div>
            <div className="mt-2 text-2xl animate-pulse">🎯</div>
          </div>
          <div className="glass rounded-2xl p-8 hover-scale glow-on-hover border border-white/20 group">
            <div className="text-4xl font-bold text-white mb-2 gradient-text group-hover:animate-bounce">24/7</div>
            <div className="text-white/80 text-lg">AI Support</div>
            <div className="mt-2 text-2xl animate-pulse">🤖</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DairyHero;