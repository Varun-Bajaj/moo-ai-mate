import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Heart, Shield, Activity, Download, AlertCircle } from "lucide-react";
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

interface DiseaseResult {
  disease_prediction: string;
  prevention: string;
  explanation: string;
  tips: string[];
  report_file: string;
}

const DiseaseDetectionForm = () => {
  const { addDiseasePrediction } = usePredictionContext();
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
  
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
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

  const handleDetect = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      setShowValidation(true);
      return;
    }
    
    setIsLoading(true);
    setShowValidation(false);
    
    try {
        const response = await fetch('https://bcs7cd8f-8000.inc1.devtunnels.ms/predict_disease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cowData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch disease detection');
      }

      const result: DiseaseResult = await response.json();
      setDiseaseResult(result);
      addDiseasePrediction(result);
    } catch (error) {
      console.error('Error fetching disease detection:', error);
      // Fallback to mock data for development
      const mockResult: DiseaseResult = {
        disease_prediction: "Healthy - No immediate concerns detected",
        prevention: "Continue current care practices. Regular monitoring recommended.",
        explanation: "Hello Farmer. Your cow appears to be in good health based on the provided data. All vital signs are within normal ranges, and no concerning symptoms were detected.",
        tips: [
          "Hello Farmer.",
          "Your cow appears to be in good health.",
          "Continue regular feeding and care practices.",
          "Monitor for any changes in behavior or appetite.",
          "Schedule regular veterinary check-ups.",
          "Maintain clean housing conditions.",
          "Ensure proper vaccination schedule is followed.",
          "Watch for early signs of illness."
        ],
        report_file: "disease_report_mock.pdf"
      };
      setDiseaseResult(mockResult);
      addDiseasePrediction(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (diseaseResult?.report_file) {
      const downloadUrl = `https://bcs7cd8f-8000.inc1.devtunnels.ms/download_report/${diseaseResult.report_file}`;
      window.open(downloadUrl, '_blank');
    }
  };

  return (
    <section id="disease-detection-form" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Disease Detection
          </h2>
          <p className="text-xl text-muted-foreground">
            Enter your cow's details for early disease detection and prevention recommendations
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Cow Health Details
              </CardTitle>
              <CardDescription>
                Provide comprehensive information about your cow for accurate disease detection
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
                  <Label htmlFor="farmer_description">Additional Symptoms/Notes (Optional)</Label>
                  <Input
                    id="farmer_description"
                    placeholder="Describe any symptoms or concerns..."
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
                onClick={handleDetect}
                disabled={isLoading || !isFormValid()}
                className="w-full bg-gradient-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isLoading ? "Analyzing..." : "Detect Disease"}
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

          {diseaseResult && (
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <Heart className="w-5 h-5" />
                  Disease Detection Results
                </CardTitle>
                <CardDescription>
                  AI-powered health analysis and recommendations
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">🩺 Disease Prediction</h4>
                  <p className="text-orange-800 text-sm">{diseaseResult.disease_prediction}</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🛡️ Prevention Measures</h4>
                  <p className="text-blue-800 text-sm">{diseaseResult.prevention}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3">📝 Detailed Analysis</h4>
                  <div className="text-green-800 text-sm whitespace-pre-line">{diseaseResult.explanation}</div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-3">🎯 Health Tips</h4>
                  <ul className="space-y-2">
                    {diseaseResult.tips.map((tip, index) => (
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
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    size="lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Health Report
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

export default DiseaseDetectionForm;
