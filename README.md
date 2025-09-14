# 🐄 Dairy AI Assistant

A comprehensive AI-powered dairy management platform that helps farmers predict milk yield, detect diseases early, and get expert advice in multiple languages.

## 🌟 Features

### 🤖 AI-Powered Predictions
- **Milk Yield Prediction**: Predict daily and weekly milk production based on cow health, feed, and environmental factors
- **Disease Detection**: Early detection of common dairy cattle diseases with prevention recommendations
- **Bulk CSV Analysis**: Analyze multiple cows simultaneously with detailed reports
- **PDF Report Downloads**: Download comprehensive PDF reports for all predictions and analyses

### 💬 AI Chat Assistant
- **Context-Aware Chat**: Get personalized advice based on your latest predictions
- **Expert Recommendations**: Receive actionable insights for improving dairy operations
- **Multi-Language Support**: Chat in your preferred language

### 🌍 Multilingual Support
- **18 Indian Regional Languages**: Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Punjabi, Assamese, Nepali, Malayalam, Sanskrit, Kashmiri, Sindhi, Tibetan
- **International Languages**: English, Spanish, French, German, Portuguese, Italian, Russian, Japanese, Korean, Chinese, Arabic
- **Dynamic Translation**: Real-time translation using free APIs
- **One-Click Translation**: Translate entire website content instantly

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Professional user experience with smooth transitions
- **Agricultural Theme**: Beautiful design inspired by dairy farming

### 📄 Report Generation
- **PDF Reports**: Download detailed PDF reports for all predictions
- **Professional Formatting**: Well-structured reports with charts and analysis
- **Record Keeping**: Save reports for future reference and veterinary consultation
- **Multiple Formats**: Individual cow reports and bulk analysis summaries

### ✅ Form Validation
- **Smart Validation**: Real-time form validation with clear error messages
- **Required Field Checking**: Prevents submission with incomplete data
- **User-Friendly Feedback**: Clear indication of missing fields
- **Button State Management**: Disabled buttons until all required fields are filled

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/moo-ai-mate.git

# Navigate to project directory
cd moo-ai-mate

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components

### State Management
- **React Context API** - Global state management for predictions and theme
- **React Query** - Server state management and caching

### Translation & Internationalization
- **Dynamic Translation APIs** - MyMemory, LibreTranslate, Google Translate
- **Language Context** - Centralized language management
- **Translation Caching** - Optimized performance with cached translations

### Backend Integration
- **RESTful APIs** - Integration with AI prediction services
- **File Upload** - CSV bulk analysis support
- **Real-time Chat** - AI assistant integration

## 📱 Usage Guide

### 1. Milk Yield Prediction
1. Navigate to the "Start Predicting" section
2. Fill in cow details (breed, age, weight, feed information, etc.)
3. Submit the form to get AI predictions
4. View detailed results with optimization hints
5. Download detailed PDF report for record keeping

### 2. Disease Detection
1. Click "Get Started" on the Disease Detection card
2. Enter cow health information
3. Get disease predictions and prevention tips
4. Access detailed explanations and recommendations
5. Download health report as PDF for veterinary consultation

### 3. Bulk CSV Analysis
1. Download the CSV template
2. Fill in data for multiple cows
3. Upload the CSV file
4. View comprehensive analysis results for all cows
5. Download complete analysis report as PDF

### 4. AI Chat Assistant
1. Complete at least one prediction to unlock chat
2. Ask questions about your dairy operations
3. Get personalized advice based on your data
4. Chat in your preferred language

### 5. Language Selection
1. Click the language toggle in the top-right corner
2. Select your preferred language
3. Content will automatically translate
4. Use "Translate All Content" for manual translation

### 6. Report Downloads
1. Complete any prediction (Milk Yield, Disease Detection, or CSV Analysis)
2. View detailed results on the website
3. Click the "Download Report" button in the results section
4. PDF report opens in a new tab for download
5. Save reports for future reference or veterinary consultation

## 🔧 API Endpoints

The application integrates with the following AI services:

- **Milk Yield Prediction**: `https://bcs7cd8f-8000.inc1.devtunnels.ms/predict_yield`
- **Disease Detection**: `https://bcs7cd8f-8000.inc1.devtunnels.ms/predict_disease`
- **CSV Analysis**: `https://bcs7cd8f-8000.inc1.devtunnels.ms/predict_csv`
- **AI Chat**: `https://bcs7cd8f-8000.inc1.devtunnels.ms/chat`
- **Report Downloads**: `https://bcs7cd8f-8000.inc1.devtunnels.ms/download/{filename}`

## 📊 Data Schema

### Cow Data Input
```typescript
interface CowData {
  // Basic Information
  breed: string;
  age: number;
  weight: number;
  lactation_stage: string;
  parity: number;
  past_yield: number;
  reproductive_status: string;
  
  // Feed & Nutrition
  feed_type: string;
  feed_qty: number;
  feeding_freq: number;
  
  // Activity & Behavior
  walking_distance: number;
  grazing_hours: number;
  rumination_time: number;
  resting_hours: number;
  
  // Health
  body_temp: number;
  heart_rate: number;
  vaccination_status: string;
  disease_history: string;
  activity_alert: string;
  
  // Environment
  ambient_temp: number;
  humidity: number;
  season: string;
  housing_condition: string;
  
  // Additional
  farmer_description: string;
  lang: string;
}
```

## 🌐 Supported Languages

### Indian Regional Languages
- हिन्दी (Hindi)
- বাংলা (Bengali)
- తెలుగు (Telugu)
- मराठी (Marathi)
- தமிழ் (Tamil)
- ગુજરાતી (Gujarati)
- اردو (Urdu)
- ಕನ್ನಡ (Kannada)
- ଓଡ଼ିଆ (Odia)
- ਪੰਜਾਬੀ (Punjabi)
- অসমীয়া (Assamese)
- नेपाली (Nepali)
- മലയാളം (Malayalam)
- संस्कृतम् (Sanskrit)
- کٲشُر (Kashmiri)
- سنڌي (Sindhi)
- བོད་ཡིག (Tibetan)

### International Languages
- English, Español, Français, Deutsch, Português, Italiano, Русский, 日本語, 한국어, 中文, العربية

## 🚀 Deployment

### Using Lovable
1. Open your [Lovable Project](https://lovable.dev/projects/9cedbe93-b205-46d0-995d-550ba8b0de3b)
2. Click Share → Publish
3. Your app will be deployed automatically

### Custom Domain
1. Navigate to Project > Settings > Domains
2. Click Connect Domain
3. Follow the DNS configuration instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AI prediction models for dairy cattle management
- Free translation APIs for multilingual support
- Open source UI components from shadcn/ui
- React and TypeScript communities

## 📞 Support

For support, email your-email@example.com or create an issue in this repository.

---

**Made with ❤️ for dairy farmers worldwide** 🐄🌍