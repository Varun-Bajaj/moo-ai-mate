import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Droplets } from "lucide-react";

interface CowData {
  breed: string;
  age: string;
  lactationStage: string;
  lastMilkYield: string;
  feedQuality: string;
  healthStatus: string;
}

interface PredictionResult {
  dailyYield: number;
  weeklyYield: number;
  confidence: number;
  recommendations: string[];
}

const MilkYieldForm = () => {
  const [cowData, setCowData] = useState<CowData>({
    breed: "",
    age: "",
    lactationStage: "",
    lastMilkYield: "",
    feedQuality: "",
    healthStatus: ""
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof CowData, value: string) => {
    setCowData(prev => ({ ...prev, [field]: value }));
  };

  const handlePredict = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockPrediction: PredictionResult = {
        dailyYield: Math.round((15 + Math.random() * 10) * 100) / 100,
        weeklyYield: Math.round((105 + Math.random() * 70) * 100) / 100,
        confidence: Math.round((85 + Math.random() * 10) * 100) / 100,
        recommendations: [
          "Increase protein-rich feed by 10%",
          "Ensure adequate water supply (80-100L daily)",
          "Monitor for signs of mastitis",
          "Maintain consistent milking schedule"
        ]
      };
      
      setPrediction(mockPrediction);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Milk Yield Prediction
          </h2>
          <p className="text-xl text-muted-foreground">
            Enter your cow's details to get accurate AI-powered yield predictions
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Cow Details
              </CardTitle>
              <CardDescription>
                Provide information about your cow for accurate predictions
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Select onValueChange={(value) => handleInputChange("breed", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="holstein">Holstein</SelectItem>
                      <SelectItem value="jersey">Jersey</SelectItem>
                      <SelectItem value="gir">Gir</SelectItem>
                      <SelectItem value="sahiwal">Sahiwal</SelectItem>
                      <SelectItem value="murrah">Murrah Buffalo</SelectItem>
                      <SelectItem value="crossbred">Crossbred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="age">Age (Years)</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="e.g., 3"
                    value={cowData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Lactation Stage</Label>
                  <Select onValueChange={(value) => handleInputChange("lactationStage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early">Early (0-100 days)</SelectItem>
                      <SelectItem value="mid">Mid (100-200 days)</SelectItem>
                      <SelectItem value="late">Late (200+ days)</SelectItem>
                      <SelectItem value="dry">Dry Period</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="lastYield">Last Milk Yield (Liters)</Label>
                  <Input
                    id="lastYield"
                    type="number"
                    placeholder="e.g., 18"
                    value={cowData.lastMilkYield}
                    onChange={(e) => handleInputChange("lastMilkYield", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Feed Quality</Label>
                  <Select onValueChange={(value) => handleInputChange("feedQuality", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Health Status</Label>
                  <Select onValueChange={(value) => handleInputChange("healthStatus", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">Healthy</SelectItem>
                      <SelectItem value="minor-issues">Minor Issues</SelectItem>
                      <SelectItem value="recovering">Recovering</SelectItem>
                      <SelectItem value="sick">Sick</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handlePredict}
                disabled={isLoading || !cowData.breed || !cowData.age}
                className="w-full bg-gradient-primary text-lg py-3"
                size="lg"
              >
                {isLoading ? "Analyzing..." : "Predict Milk Yield"}
              </Button>
            </CardContent>
          </Card>

          {prediction && (
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <TrendingUp className="w-5 h-5" />
                  Prediction Results
                </CardTitle>
                <CardDescription>
                  AI-powered predictions based on your cow's data
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                    <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{prediction.dailyYield}L</div>
                    <div className="text-sm text-muted-foreground">Daily Yield</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                    <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{prediction.weeklyYield}L</div>
                    <div className="text-sm text-muted-foreground">Weekly Yield</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge className="bg-success text-success-foreground text-lg px-4 py-2">
                    {prediction.confidence}% Confidence
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default MilkYieldForm;