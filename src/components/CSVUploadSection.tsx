import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, BarChart3, AlertCircle, AlertTriangle, Loader2, TrendingUp, Heart, CheckCircle } from "lucide-react";
import { useState } from "react";
import { usePredictionContext } from "@/contexts/PredictionContext";

interface CowResult {
  cow_id: number;
  predicted_yield: number;
  predicted_weekly_yield: number;
  disease_prediction: string;
  prevention: string;
  yield_explanation: string;
  disease_explanation: string;
}

interface CSVResponse {
  results: CowResult[];
}

const CSVUploadSection = () => {
  const { addCSVPrediction } = usePredictionContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvResults, setCsvResults] = useState<CSVResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setError(null);
      setCsvResults(null);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a CSV file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/predict_csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze CSV file');
      }

      const result: CSVResponse = await response.json();
      setCsvResults(result);
      addCSVPrediction(result);
    } catch (error) {
      console.error('Error analyzing CSV:', error);
      setError('Failed to analyze CSV file. Please try again.');
      
      // Fallback to mock data for development
      const mockResults: CSVResponse = {
        results: [
          {
            cow_id: 1,
            predicted_yield: 10.83,
            predicted_weekly_yield: 75.79,
            disease_prediction: "Healthy",
            prevention: "Maintain proper feed and clean water. Routine vet check-ups recommended.",
            yield_explanation: "Hello Farmer. Your cow gives 10.83 liters of milk every day. In one week, your cow gives 75.79 liters of milk. Food is very important for milk. Good food makes more milk.",
            disease_explanation: "Your cow appears to be healthy based on the provided data. Continue regular care practices."
          },
          {
            cow_id: 2,
            predicted_yield: 8.4,
            predicted_weekly_yield: 58.8,
            disease_prediction: "Healthy",
            prevention: "Maintain proper feed and clean water. Routine vet check-ups recommended.",
            yield_explanation: "Hello Farmer. Your cow gives 8.4 liters of milk every day. Weekly milk: 58.8 liters. If you give 10% more food, milk will increase.",
            disease_explanation: "Your cow looks healthy. Maybe cow is not eating well or water is not clean. Give good food and clean water."
          }
        ]
      };
      setCsvResults(mockResults);
      addCSVPrediction(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create and download CSV template with all required fields
    const csvContent = `breed,age,weight,lactation_stage,parity,past_yield,reproductive_status,feed_type,feed_qty,feeding_freq,walking_distance,grazing_hours,rumination_time,resting_hours,body_temp,heart_rate,vaccination_status,disease_history,activity_alert,ambient_temp,humidity,season,housing_condition,farmer_description,lang
Holstein,36,550,Early,2,25,Lactating,High Quality Grass,25,3,2,6,8,10,38.5,72,Up to Date,None,Normal,25,65,Spring,Good,,en
Jersey,24,400,Mid,1,18,Lactating,Mixed Feed,20,2,1.5,5,7,12,38.2,68,Up to Date,None,Normal,28,70,Summer,Excellent,,en
Gir,48,600,Late,3,30,Dry,Silage,30,3,3,8,9,8,38.8,75,Due Soon,Mastitis (2023),Low Activity,22,60,Monsoon,Average,,en
Sahiwal,30,450,Early,1,22,Pregnant,Hay,22,2,1,4,6,14,38.3,70,Up to Date,None,Normal,26,68,Winter,Good,,en`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dairy_farm_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section id="csv-upload-section" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Bulk CSV Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload your farm data in CSV format for comprehensive analysis and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-gradient-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Your Data
              </CardTitle>
              <CardDescription>
                Upload a CSV file containing your farm's cow data for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="csv-file">CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                {selectedFile && (
                  <div className="text-sm text-green-600 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Selected: {selectedFile.name}
                  </div>
                )}
                {error && (
                  <div className="text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
              </div>


              <Button 
                onClick={handleAnalyze}
                disabled={isLoading || !selectedFile}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Template and Features */}
          <div className="space-y-6">
            {/* Template Download */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Download Template
                </CardTitle>
                <CardDescription>
                  Download our CSV template to ensure your data is in the correct format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle>What You'll Get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-success text-success-foreground">✓</Badge>
                    <div>
                      <h4 className="font-semibold">Batch Predictions</h4>
                      <p className="text-sm text-muted-foreground">Get milk yield predictions for all your cows at once</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="bg-success text-success-foreground">✓</Badge>
                    <div>
                      <h4 className="font-semibold">Farm Insights</h4>
                      <p className="text-sm text-muted-foreground">Comprehensive analysis of your entire herd</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="bg-success text-success-foreground">✓</Badge>
                    <div>
                      <h4 className="font-semibold">Export Reports</h4>
                      <p className="text-sm text-muted-foreground">Download detailed reports in PDF or Excel format</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Badge className="bg-success text-success-foreground">✓</Badge>
                    <div>
                      <h4 className="font-semibold">Data Visualization</h4>
                      <p className="text-sm text-muted-foreground">Charts and graphs to visualize your farm data</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-gradient-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  File Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Maximum file size: 10MB</p>
                  <p>• Supported format: CSV only</p>
                  <p>• Required columns: breed, age, weight, lactation_stage, parity</p>
                  <p>• All 25 columns must be present for accurate analysis</p>
                  <p>• Use our template for best results</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {csvResults && (
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Analysis Results
              </h3>
              <p className="text-lg text-muted-foreground">
                Detailed insights for {csvResults.results.length} cow{csvResults.results.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {csvResults.results.map((result, index) => (
                <Card key={result.cow_id} className="shadow-card bg-gradient-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">🐄</span>
                        Cow #{result.cow_id}
                      </CardTitle>
                      <Badge 
                        className={`${
                          result.disease_prediction === 'Healthy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {result.disease_prediction}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Yield Predictions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                        <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                        <div className="text-xl font-bold text-foreground">{result.predicted_yield}L</div>
                        <div className="text-sm text-muted-foreground">Daily Yield</div>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg shadow-soft">
                        <BarChart3 className="w-6 h-6 text-success mx-auto mb-2" />
                        <div className="text-xl font-bold text-foreground">{result.predicted_weekly_yield}L</div>
                        <div className="text-sm text-muted-foreground">Weekly Yield</div>
                      </div>
                    </div>

                    {/* Prevention */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Health Prevention
                      </h4>
                      <p className="text-blue-800 text-sm">{result.prevention}</p>
                    </div>

                    {/* Yield Explanation */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Yield Analysis
                      </h4>
                      <div className="text-green-800 text-sm whitespace-pre-line max-h-32 overflow-y-auto">
                        {result.yield_explanation}
                      </div>
                    </div>

                    {/* Disease Explanation */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Health Analysis
                      </h4>
                      <div className="text-orange-800 text-sm whitespace-pre-line max-h-32 overflow-y-auto">
                        {result.disease_explanation}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-soft">
                <div className="text-3xl font-bold text-primary mb-2">
                  {csvResults.results.length}
                </div>
                <div className="text-muted-foreground">Total Cows Analyzed</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-soft">
                <div className="text-3xl font-bold text-success mb-2">
                  {(csvResults.results.reduce((sum, r) => sum + r.predicted_yield, 0) / csvResults.results.length).toFixed(1)}L
                </div>
                <div className="text-muted-foreground">Average Daily Yield</div>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-soft">
                <div className="text-3xl font-bold text-warning mb-2">
                  {csvResults.results.filter(r => r.disease_prediction === 'Healthy').length}
                </div>
                <div className="text-muted-foreground">Healthy Cows</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CSVUploadSection;
