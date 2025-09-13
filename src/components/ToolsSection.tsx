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
  const handleGetStarted = (toolId: string) => {
    switch (toolId) {
      case 'milk-yield':
        const milkYieldElement = document.getElementById('milk-yield-form');
        if (milkYieldElement) {
          milkYieldElement.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'disease-detection':
        const diseaseElement = document.getElementById('disease-detection-form');
        if (diseaseElement) {
          diseaseElement.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'csv-analysis':
        const csvElement = document.getElementById('csv-upload-section');
        if (csvElement) {
          csvElement.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      default:
        break;
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful AI Tools for Modern Dairy Farming
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our suite of AI-powered tools designed specifically for dairy farmers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <Card key={tool.id} className="group hover:shadow-floating transition-all duration-300 bg-gradient-card border-border">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-soft">
                  <img 
                    src={tool.icon} 
                    alt={tool.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                  size="lg"
                  onClick={() => handleGetStarted(tool.id)}
                >
                  Get Started
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