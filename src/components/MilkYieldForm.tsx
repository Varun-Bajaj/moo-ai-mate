import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Droplets, Download, AlertCircle } from "lucide-react";
import { usePredictionContext } from "@/contexts/PredictionContext";

interface CowData {
  breed: string;
  age: number;
  weight: number;
  lactation_stage: string;
  parity: number;
  past_yield: number;
  reproductive_status: string;
  feed_type: string;
  feed_qty: number;
  feeding_freq: number;
  walking_distance: number;
  grazing_hours: number;
  rumination_time: number;
  resting_hours: number;
  body_temp: number;
  heart_rate: number;
  vaccination_status: string;
  disease_history: string;
  activity_alert: string;
  ambient_temp: number;
  humidity: number;
  season: string;
  housing_condition: string;
  farmer_description: string;
  lang: string;
}

interface PredictionResult {
  predicted_yield: number;
  predicted_weekly_yield: number;
  optimization_hint: string;
  explanation: string;
  tips: string[];
  report_file: string;
}

const MilkYieldForm = () => {
  const { addYieldPrediction } = usePredictionContext();
  const [cowData, setCowData] = useState<CowData>({
    breed: "",
    age: 0,
    weight: 0,
    lactation_stage: "",
    parity: 0,
    past_yield: 0,
    reproductive_status: "",
    feed_type: "",
    feed_qty: 0,
    feeding_freq: 0,
    walking_distance: 0,
    grazing_hours: 0,
    rumination_time: 0,
    resting_hours: 0,
    body_temp: 0,
    heart_rate: 0,
    vaccination_status: "",
    disease_history: "",
    activity_alert: "",
    ambient_temp: 0,
    humidity: 0,
    season: "",
    housing_condition: "",
    farmer_description: "",
    lang: "en"
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const handleInputChange = (field: keyof CowData, value: string | number) => {
    setCowData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
      setShowValidation(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Required string fields
    const requiredStringFields: (keyof CowData)[] = [
      'breed', 'lactation_stage', 'reproductive_status', 'feed_type', 
      'vaccination_status', 'disease_history', 'activity_alert', 'season', 'housing_condition'
    ];
    
    requiredStringFields.forEach(field => {
      if (!cowData[field] || cowData[field] === '') {
        errors.push(`${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`);
      }
    });
    
    // Required numeric fields
    const requiredNumericFields: (keyof CowData)[] = [
      'age', 'weight', 'parity', 'past_yield', 'feed_qty', 'feeding_freq',
      'walking_distance', 'grazing_hours', 'rumination_time', 'resting_hours',
      'body_temp', 'heart_rate', 'ambient_temp', 'humidity'
    ];
    
    requiredNumericFields.forEach(field => {
      if (cowData[field] === 0 || cowData[field] === '') {
        errors.push(`${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`);
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const isFormValid = (): boolean => {
    const requiredStringFields: (keyof CowData)[] = [
      'breed', 'lactation_stage', 'reproductive_status', 'feed_type', 
      'vaccination_status', 'disease_history', 'activity_alert', 'season', 'housing_condition'
    ];
    
    const requiredNumericFields: (keyof CowData)[] = [
      'age', 'weight', 'parity', 'past_yield', 'feed_qty', 'feeding_freq',
      'walking_distance', 'grazing_hours', 'rumination_time', 'resting_hours',
      'body_temp', 'heart_rate', 'ambient_temp', 'humidity'
    ];
    
    const stringFieldsValid = requiredStringFields.every(field => 
      cowData[field] && cowData[field] !== ''
    );
    
    const numericFieldsValid = requiredNumericFields.every(field => 
      cowData[field] !== 0 && cowData[field] !== ''
    );
    
    return stringFieldsValid && numericFieldsValid;
  };

  const handlePredict = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      setShowValidation(true);
      return;
    }
    
    setIsLoading(true);
    setShowValidation(false);
    
    try {
        const response = await fetch('https://bcs7cd8f-8000.inc1.devtunnels.ms/predict_yield', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'Access-Control-Allow-Origin': '*', // Add this
      },
      body: JSON.stringify(cowData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const result: PredictionResult = await response.json();
      setPrediction(result);
      addYieldPrediction(result);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      // Fallback to mock data for development
      const mockPrediction: PredictionResult = {
        predicted_yield: 8.85,
        predicted_weekly_yield: 61.97,
        optimization_hint: "If you improve feed by 10%, yield may rise to ~8.85 L/day.",
        explanation: "Hello Farmer. Your cow gives 8.85 liters of milk every day. In one week, your cow gives 8.85 x 7 = 62 liters of milk.",
        tips: [
          "Hello Farmer.",
          "Your cow gives 8.85 liters of milk every day.",
          "In one week, your cow gives 8.85 x 7 = 62 liters of milk.",
          "Food is very important for milk. Good food makes more milk. Bad food makes less milk.",
          "Here are 3 tips to get more milk:",
          "1. Give your cow fresh water every day.",
          "2. Give your cow good food with nutrients.",
          "3. Keep your cow clean and happy.",
          "Remember, happy cow gives more milk!"
        ],
        report_file: "yield_report_mock.pdf"
      };
      setPrediction(mockPrediction);
      addYieldPrediction(mockPrediction);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
  if (prediction?.report_file) {
    // Extract just the filename if it includes the full path
    const filename = prediction.report_file.includes('/') 
      ? prediction.report_file.split('/').pop() 
      : prediction.report_file;
    
    const downloadUrl = `https://bcs7cd8f-8000.inc1.devtunnels.ms/download/${filename}`;
    window.open(downloadUrl, '_blank');
  }
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
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="breed">Breed</Label>
                  <Select onValueChange={(value) => handleInputChange("breed", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select breed" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Holstein">Holstein</SelectItem>
                        <SelectItem value="Jersey">Jersey</SelectItem>
                        <SelectItem value="Gir">Gir</SelectItem>
                        <SelectItem value="Sahiwal">Sahiwal</SelectItem>
                        <SelectItem value="Murrah">Murrah Buffalo</SelectItem>
                        <SelectItem value="Crossbred">Crossbred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                    <Label htmlFor="age">Age (Months)</Label>
                  <Input
                    id="age"
                    type="number"
                      placeholder="e.g., 36"
                      value={cowData.age || ''}
                      onChange={(e) => handleInputChange("age", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 550"
                      value={cowData.weight || ''}
                      onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                <div>
                  <Label>Lactation Stage</Label>
                    <Select onValueChange={(value) => handleInputChange("lactation_stage", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Early">Early (0-100 days)</SelectItem>
                        <SelectItem value="Mid">Mid (100-200 days)</SelectItem>
                        <SelectItem value="Late">Late (200+ days)</SelectItem>
                        <SelectItem value="Dry">Dry Period</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parity">Parity</Label>
                    <Input
                      id="parity"
                      type="number"
                      placeholder="e.g., 2"
                      value={cowData.parity || ''}
                      onChange={(e) => handleInputChange("parity", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="past_yield">Past Yield (Liters)</Label>
                    <Input
                      id="past_yield"
                      type="number"
                      placeholder="e.g., 18"
                      value={cowData.past_yield || ''}
                      onChange={(e) => handleInputChange("past_yield", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Reproductive Status</Label>
                  <Select onValueChange={(value) => handleInputChange("reproductive_status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pregnant">Pregnant</SelectItem>
                      <SelectItem value="Lactating">Lactating</SelectItem>
                      <SelectItem value="Dry">Dry</SelectItem>
                      <SelectItem value="Heifer">Heifer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Feed Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Feed Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Feed Type</Label>
                    <Select onValueChange={(value) => handleInputChange("feed_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feed type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High Quality Grass">High Quality Grass</SelectItem>
                        <SelectItem value="Mixed Feed">Mixed Feed</SelectItem>
                        <SelectItem value="Silage">Silage</SelectItem>
                        <SelectItem value="Hay">Hay</SelectItem>
                        <SelectItem value="Concentrate">Concentrate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="feed_qty">Feed Quantity (kg)</Label>
                    <Input
                      id="feed_qty"
                      type="number"
                      placeholder="e.g., 25"
                      value={cowData.feed_qty || ''}
                      onChange={(e) => handleInputChange("feed_qty", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="feeding_freq">Feeding Frequency (times/day)</Label>
                  <Input
                    id="feeding_freq"
                    type="number"
                    placeholder="e.g., 3"
                    value={cowData.feeding_freq || ''}
                    onChange={(e) => handleInputChange("feeding_freq", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Activity Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Activity Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="walking_distance">Walking Distance (km)</Label>
                    <Input
                      id="walking_distance"
                      type="number"
                      placeholder="e.g., 2"
                      value={cowData.walking_distance || ''}
                      onChange={(e) => handleInputChange("walking_distance", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="grazing_hours">Grazing Hours</Label>
                    <Input
                      id="grazing_hours"
                      type="number"
                      placeholder="e.g., 6"
                      value={cowData.grazing_hours || ''}
                      onChange={(e) => handleInputChange("grazing_hours", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rumination_time">Rumination Time (hours)</Label>
                    <Input
                      id="rumination_time"
                      type="number"
                      placeholder="e.g., 8"
                      value={cowData.rumination_time || ''}
                      onChange={(e) => handleInputChange("rumination_time", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="resting_hours">Resting Hours</Label>
                    <Input
                      id="resting_hours"
                      type="number"
                      placeholder="e.g., 10"
                      value={cowData.resting_hours || ''}
                      onChange={(e) => handleInputChange("resting_hours", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Health Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Health Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="body_temp">Body Temperature (°C)</Label>
                    <Input
                      id="body_temp"
                      type="number"
                      placeholder="e.g., 38.5"
                      value={cowData.body_temp || ''}
                      onChange={(e) => handleInputChange("body_temp", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                    <Input
                      id="heart_rate"
                      type="number"
                      placeholder="e.g., 72"
                      value={cowData.heart_rate || ''}
                      onChange={(e) => handleInputChange("heart_rate", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Vaccination Status</Label>
                  <Select onValueChange={(value) => handleInputChange("vaccination_status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Up to Date">Up to Date</SelectItem>
                      <SelectItem value="Due Soon">Due Soon</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Not Vaccinated">Not Vaccinated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="disease_history">Disease History</Label>
                  <Input
                    id="disease_history"
                    placeholder="e.g., Mastitis (2023), None"
                    value={cowData.disease_history}
                    onChange={(e) => handleInputChange("disease_history", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Activity Alert</Label>
                  <Select onValueChange={(value) => handleInputChange("activity_alert", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low Activity">Low Activity</SelectItem>
                      <SelectItem value="High Activity">High Activity</SelectItem>
                      <SelectItem value="Alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Environmental Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Environmental Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ambient_temp">Ambient Temperature (°C)</Label>
                    <Input
                      id="ambient_temp"
                      type="number"
                      placeholder="e.g., 25"
                      value={cowData.ambient_temp || ''}
                      onChange={(e) => handleInputChange("ambient_temp", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="humidity">Humidity (%)</Label>
                  <Input
                      id="humidity"
                    type="number"
                      placeholder="e.g., 65"
                      value={cowData.humidity || ''}
                      onChange={(e) => handleInputChange("humidity", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Season</Label>
                    <Select onValueChange={(value) => handleInputChange("season", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Monsoon">Monsoon</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                    <Label>Housing Condition</Label>
                    <Select onValueChange={(value) => handleInputChange("housing_condition", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Average">Average</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Language and Description */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="farmer_description">Additional Notes (Optional)</Label>
                  <Input
                    id="farmer_description"
                    placeholder="Any additional information about the cow..."
                    value={cowData.farmer_description}
                    onChange={(e) => handleInputChange("farmer_description", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Language</Label>
                  <Select onValueChange={(value) => handleInputChange("lang", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={handlePredict}
                disabled={isLoading || !isFormValid()}
                className="w-full bg-gradient-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? "Analyzing..." : "Predict Milk Yield"}
              </Button>
              
              {/* Validation Error Display */}
              {showValidation && validationErrors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">Please fill in all required fields:</h4>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
                    <div className="text-2xl font-bold text-foreground">{prediction.predicted_yield}L</div>
                    <div className="text-sm text-muted-foreground">Daily Yield</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                    <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{prediction.predicted_weekly_yield}L</div>
                    <div className="text-sm text-muted-foreground">Weekly Yield</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Optimization Hint</h4>
                  <p className="text-blue-800 text-sm">{prediction.optimization_hint}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">📝 Detailed Explanation</h4>
                  <div className="text-green-800 text-sm whitespace-pre-line">{prediction.explanation}</div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">🎯 Key Tips</h4>
                  <ul className="space-y-2">
                    {prediction.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    onClick={handleDownloadReport}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Detailed Report
                  </Button>
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