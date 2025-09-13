import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import milkYieldIcon from "@/assets/milk-yield-icon.jpg";
import diseaseDetectionIcon from "@/assets/disease-detection-icon.jpg";
import csvAnalysisIcon from "@/assets/csv-analysis-icon.jpg";

const tools = [
  {
    id: "milk-yield",
    title: "Milk Yield Prediction",
    description: "Enter cow details and get accurate daily and weekly milk yield predictions powered by AI",
    icon: milkYieldIcon,
    features: ["Daily predictions", "Weekly forecasts", "Historical analysis", "Breed optimization"],
    primaryColor: "success"
  },
  {
    id: "disease-detection",
    title: "Disease Detection",
    description: "Early detection of cattle diseases with symptoms analysis and prevention recommendations",
    icon: diseaseDetectionIcon,
    features: ["Symptom analysis", "Early detection", "Prevention tips", "Treatment guidance"],
    primaryColor: "warning"
  },
  {
    id: "csv-analysis",
    title: "Bulk CSV Analysis",
    description: "Upload CSV files for comprehensive analysis of multiple cows and farm-wide insights",
    icon: csvAnalysisIcon,
    features: ["Batch processing", "Farm insights", "Export reports", "Data visualization"],
    primaryColor: "accent"
  }
];

const ToolsSection = () => {
  return (
    <section className="py-24 bg-gradient-card relative overflow-hidden floating-orbs">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-5"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-glow rounded-full opacity-30 animate-pulse-glow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 slide-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 gradient-text">
            Powerful AI Tools for Modern Dairy Farming
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose from our suite of AI-powered tools designed specifically for dairy farmers ✨
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-24 h-1 bg-gradient-primary rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 stagger-children">
          {tools.map((tool, index) => (
            <Card key={tool.id} className="group hover:shadow-depth transition-all duration-500 bg-gradient-card border-border hover:-translate-y-2 relative overflow-hidden">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-soft group-hover:shadow-glow transition-all duration-300 float">
                  <img 
                    src={tool.icon} 
                    alt={tool.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground gradient-text group-hover:animate-bounce">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6 relative z-10">
                <ul className="space-y-3">
                  {tool.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <div className="w-3 h-3 bg-gradient-primary rounded-full mr-4 pulse-glow"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-gradient-primary hover:bg-gradient-hero hover-scale glow-on-hover text-white font-semibold py-4 text-lg shadow-neon group-hover:shadow-glow transition-all duration-300"
                  size="lg"
                >
                  Get Started ✨
                  <span className="ml-2 group-hover:animate-bounce">🚀</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;