import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'gu' | 'ur' | 'kn' | 'or' | 'pa' | 'as' | 'ne' | 'ml' | 'sa' | 'ks' | 'sd' | 'bo' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ru' | 'ja' | 'ko' | 'zh' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => Promise<string>;
  tSync: (key: string, fallback?: string) => string;
  translateAllContent: () => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation cache to avoid repeated API calls
const translationCache = new Map<string, string>();

// Comprehensive translations for all website sections
const defaultTranslations: Record<string, Record<Language, string>> = {
  // Hero Section
  'hero.title': {
    en: 'Dairy AI Assistant', hi: 'डेयरी AI सहायक', bn: 'ডেইরি AI সহায়ক', te: 'డెయిరీ AI అసిస్టెంట్', mr: 'डेअरी AI सहायक', ta: 'பால் AI உதவியாளர்', gu: 'ડેરી AI સહાયક', ur: 'ڈیری AI اسسٹنٹ', kn: 'ಹಾಲು AI ಸಹಾಯಕ', or: 'ଡେରି AI ସହାୟକ', pa: 'ਡੇਅਰੀ AI ਸਹਾਇਕ', as: 'ডেৰী AI সহায়ক', ne: 'डेरी AI सहायक', ml: 'പാൽ AI അസിസ്റ്റന്റ്', sa: 'दुग्ध AI सहायक', ks: 'ڈیری AI مددگار', sd: 'ڊيري AI مددگار', bo: 'འོ་མ་ AI ལས་དོན་དཔྱོད་པ', es: 'Asistente de IA Láctea', fr: 'Assistant IA Laitier', de: 'Milchvieh KI-Assistent', pt: 'Assistente de IA Láctea', it: 'Assistente IA Lattiero', ru: 'Молочный ИИ Помощник', ja: '酪農AIアシスタント', ko: '낙농 AI 어시스턴트', zh: '乳业AI助手', ar: 'مساعد الذكاء الاصطناعي للألبان'
  },
  'hero.subtitle': {
    en: 'Predict milk yield, detect diseases early, and get expert advice in multiple languages. Empower your dairy farming with AI technology.',
    hi: 'दूध उत्पादन की भविष्यवाणी करें, बीमारियों का जल्दी पता लगाएं, और कई भाषाओं में विशेषज्ञ सलाह प्राप्त करें। AI तकनीक के साथ अपने डेयरी खेती को सशक्त बनाएं।',
    bn: 'দুধের ফলন ভবিষ্যদ্বাণী করুন, রোগের প্রাথমিক সনাক্তকরণ করুন এবং একাধিক ভাষায় বিশেষজ্ঞ পরামর্শ পান। AI প্রযুক্তির সাথে আপনার দুগ্ধ খামারকে শক্তিশালী করুন।',
    te: 'పాల ఉత్పాదనను అంచనా వేయండి, వ్యాధులను త్వరగా గుర్తించండి, మరియు బహుళ భాషలలో నిపుణుల సలహా పొందండి। AI సాంకేతికతతో మీ పాల పెంపకాన్ని బలోపేతం చేయండి।',
    mr: 'दुधाच्या उत्पादनाचा अंदाज घ्या, रोगांची लवकर ओळख करा, आणि अनेक भाषांमध्ये तज्ञांचा सल्ला घ्या। AI तंत्रज्ञानाने आपल्या दुग्ध व्यवसायाला सक्षम करा।',
    ta: 'பால் விளைச்சலை கணிக்கவும், நோய்களை ஆரம்பத்தில் கண்டறியவும், பல மொழிகளில் நிபுணர் ஆலோசனையைப் பெறவும்। AI தொழில்நுட்பத்துடன் உங்கள் பால் வளர்ப்பை வலுப்படுத்தவும்।',
    gu: 'દૂધની ઉપજની આગાહી કરો, રોગોની વહેલી ઓળખ કરો, અને બહુવિધ ભાષાઓમાં નિષ્ણાત સલાહ મેળવો। AI ટેક્નોલોજી સાથે તમારા ડેરી ખેતીને સશક્ત બનાવો।',
    ur: 'دودھ کی پیداوار کی پیشن گوئی کریں، بیماریوں کی جلدی تشخیص کریں، اور متعدد زبانوں میں ماہرین کی مشاورت حاصل کریں۔ AI ٹیکنالوجی کے ساتھ اپنے ڈیری فارمنگ کو مضبوط بنائیں۔',
    kn: 'ಹಾಲಿನ ಇಳುವರಿಯನ್ನು ಊಹಿಸಿ, ರೋಗಗಳನ್ನು ಬೇಗನೆ ಗುರುತಿಸಿ, ಮತ್ತು ಬಹು ಭಾಷೆಗಳಲ್ಲಿ ತಜ್ಞರ ಸಲಹೆ ಪಡೆಯಿರಿ। AI ತಂತ್ರಜ್ಞಾನದೊಂದಿಗೆ ನಿಮ್ಮ ಹಾಲು ಕೃಷಿಯನ್ನು ಶಕ್ತಿಶಾಲಿಯಾಗಿಸಿ।',
    or: 'ଦୁଗ୍ଧ ଉତ୍ପାଦନ ଭବିଷ୍ୟତବାଣୀ କରନ୍ତୁ, ରୋଗଗୁଡ଼ିକର ଶୀଘ୍ର ସନ୍ଧାନ କରନ୍ତୁ, ଏବଂ ବହୁ ଭାଷାରେ ବିଶେଷଜ୍ଞ ପରାମର୍ଶ ପାଆନ୍ତୁ। AI ପ୍ରଯୁକ୍ତି ସହିତ ଆପଣଙ୍କ ଡେରି କୃଷିକୁ ସଶକ୍ତ କରନ୍ତୁ।',
    pa: 'ਦੁੱਧ ਦੀ ਪੈਦਾਵਾਰ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ, ਬੀਮਾਰੀਆਂ ਦੀ ਜਲਦੀ ਪਛਾਣ ਕਰੋ, ਅਤੇ ਕਈ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਮਾਹਿਰ ਸਲਾਹ ਪ੍ਰਾਪਤ ਕਰੋ। AI ਤਕਨਾਲੋਜੀ ਨਾਲ ਆਪਣੇ ਡੇਅਰੀ ਫਾਰਮਿੰਗ ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਓ।',
    as: 'গাখীৰৰ উৎপাদন ভৱিষ্যতবাণী কৰক, ৰোগৰ প্ৰাৰম্ভিক সনাক্তকৰণ কৰক, আৰু বহু ভাষাত বিশেষজ্ঞৰ পৰামৰ্শ লাভ কৰক। AI প্ৰযুক্তিৰে আপোনাৰ গাখীৰ খেতিক শক্তিশালী কৰক।',
    ne: 'दुधको उत्पादनको भविष्यवाणी गर्नुहोस्, रोगहरूको छिटो पहिचान गर्नुहोस्, र धेरै भाषाहरूमा विशेषज्ञ सल्लाह प्राप्त गर्नुहोस्। AI प्रविधिको साथ आफ्नो डेरी खेतीलाई सशक्त बनाउनुहोस्।',
    ml: 'പാലിന്റെ വിളവ് പ്രവചിക്കുക, രോഗങ്ങളെ നേരത്തെ കണ്ടെത്തുക, കൂടാതെ ഒന്നിലധികം ഭാഷകളിൽ വിദഗ്ധ ഉപദേശം നേടുക। AI സാങ്കേതികവിദ്യ ഉപയോഗിച്ച് നിങ്ങളുടെ പാൽ കൃഷിയെ ശക്തമാക്കുക।',
    sa: 'दुग्धोत्पादनस्य भविष्यवाणीं कुरुत, रोगाणां शीघ्रं निर्णयं कुरुत, बहुभाषासु विशेषज्ञपरामर्शं प्राप्नुत। AI तकनीकेन स्वस्य दुग्धकृषिं सशक्तं कुरुत।',
    ks: 'دودھ دی پیداوار دی پیشن گوئی کرو، بیماریاں دی جلدی تشخیص کرو، تے کئی زباناں وچ ماہرین دی مشاورت حاصل کرو۔ AI ٹیکنالوجی نال اپݨے ڈیری فارمنگ کوں مضبوط بݨاؤ۔',
    sd: 'ڊيري جي پيداوار جو اندازو لڳايو، بيمارين جي جلدي سڃاڻپ ڪريو، ۽ ڪيترين ئي ٻولين ۾ ماهرن جي صلاح حاصل ڪريو۔ AI ٽيڪنالاجي سان پنهنجي ڊيري فارمنگ کي طاقتور بڻايو۔',
    bo: 'འོ་མའི་ཐོན་ཁུངས་ཀྱི་ཕྱི་ལོའི་ཁ་གསལ་བྱེད་པ། ནད་ཡམས་ཀྱི་ཆུང་ཚེས་ཀྱི་ངོས་འཛིན་བྱེད་པ། ཡི་གེ་མང་པོའི་ནང་ཤེས་ཡོན་པའི་གསལ་ཁ་ཐོབ་པ། AI ཅིག་གི་ཐོག་ལས་ཁྱོད་ཀྱི་འོ་མའི་ལས་དོན་ཤུགས་ཆེན་བྱེད་པ།',
    es: 'Predice el rendimiento de leche, detecta enfermedades temprano y obtén consejos expertos en múltiples idiomas. Potencia tu ganadería lechera con tecnología de IA.',
    fr: 'Prédisez le rendement laitier, détectez les maladies tôt et obtenez des conseils d\'experts en plusieurs langues. Renforcez votre élevage laitier avec la technologie IA.',
    de: 'Vorhersage der Milchleistung, frühzeitige Erkennung von Krankheiten und Expertenberatung in mehreren Sprachen. Stärken Sie Ihre Milchviehhaltung mit KI-Technologie.',
    pt: 'Preveja a produção de leite, detecte doenças precocemente e obtenha conselhos de especialistas em vários idiomas. Potencialize sua pecuária leiteira com tecnologia de IA.',
    it: 'Prevedi la resa del latte, rileva le malattie precocemente e ottieni consigli di esperti in più lingue. Potenzia la tua zootecnia da latte con la tecnologia IA.',
    ru: 'Предсказывайте надой молока, раннее обнаружение болезней и получайте экспертные советы на нескольких языках. Усильте свое молочное животноводство с помощью технологии ИИ.',
    ja: '乳量を予測し、病気を早期に発見し、複数の言語で専門家のアドバイスを得てください。AI技術で酪農を強化しましょう。',
    ko: '우유 생산량을 예측하고, 질병을 조기에 발견하며, 여러 언어로 전문가 조언을 받으세요. AI 기술로 낙농을 강화하세요.',
    zh: '预测产奶量，早期发现疾病，并获得多语言专家建议。用AI技术增强您的乳业养殖。',
    ar: 'توقع إنتاج الحليب، واكتشف الأمراض مبكراً، واحصل على نصائح الخبراء بلغات متعددة. عزز تربية الألبان الخاصة بك بتقنية الذكاء الاصطناعي.'
  },
  'hero.startPredicting': {
    en: 'Start Predicting', hi: 'भविष्यवाणी शुरू करें', bn: 'ভবিষ্যদ্বাণী শুরু করুন', te: 'అంచనా ప్రారంభించండి', mr: 'अंदाज सुरू करा', ta: 'கணிப்பைத் தொடங்குங்கள்', gu: 'આગાહી શરૂ કરો', ur: 'پیشن گوئی شروع کریں', kn: 'ಊಹಿಸಲು ಪ್ರಾರಂಭಿಸಿ', or: 'ଭବିଷ୍ୟତବାଣୀ ଆରମ୍ଭ କରନ୍ତୁ', pa: 'ਅੰਦਾਜ਼ਾ ਸ਼ੁਰੂ ਕਰੋ', as: 'ভৱিষ্যতবাণী আৰম্ভ কৰক', ne: 'भविष्यवाणी सुरु गर्नुहोस्', ml: 'പ്രവചനം ആരംഭിക്കുക', sa: 'भविष्यवाणीं आरभ्यताम्', ks: 'پیشن گوئی شروع کرو', sd: 'پيشن گوئي شروع ڪريو', bo: 'ཕྱི་ལོའི་ཁ་གསལ་འགོ་བཙུགས་པ།', es: 'Comenzar Predicción', fr: 'Commencer la Prédiction', de: 'Vorhersage Starten', pt: 'Iniciar Previsão', it: 'Inizia Previsione', ru: 'Начать Прогнозирование', ja: '予測を開始', ko: '예측 시작', zh: '开始预测', ar: 'ابدأ التنبؤ'
  },
  'hero.chatAssistant': {
    en: 'Chat with AI Assistant', hi: 'AI सहायक से चैट करें', bn: 'AI সহায়কের সাথে চ্যাট করুন', te: 'AI అసిస్టెంట్ తో చాట్ చేయండి', mr: 'AI सहायकाशी चॅट करा', ta: 'AI உதவியாளருடன் அரட்டையடிக்கவும்', gu: 'AI સહાયક સાથે ચેટ કરો', ur: 'AI اسسٹنٹ کے ساتھ چیٹ کریں', kn: 'AI ಸಹಾಯಕರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ', or: 'AI ସହାୟକ ସହିତ ଚାଟ୍ କରନ୍ତୁ', pa: 'AI ਸਹਾਇਕ ਨਾਲ ਚੈਟ ਕਰੋ', as: 'AI সহায়কৰ সৈতে চেট কৰক', ne: 'AI सहायकसँग च्याट गर्नुहोस्', ml: 'AI അസിസ്റ്റന്റുമായി ചാറ്റ് ചെയ്യുക', sa: 'AI सहायकेन सह चर्चां कुरुत', ks: 'AI مددگار نال چیٹ کرو', sd: 'AI مددگار سان گالھ ڪريو', bo: 'AI ལས་དོན་དཔྱོད་པ་དང་ཞུ་ཆུང་བྱེད་པ།', es: 'Chatear con Asistente IA', fr: 'Discuter avec l\'Assistant IA', de: 'Mit KI-Assistent Chatten', pt: 'Conversar com Assistente IA', it: 'Chatta con Assistente IA', ru: 'Чат с ИИ Помощником', ja: 'AIアシスタントとチャット', ko: 'AI 어시스턴트와 채팅', zh: '与AI助手聊天', ar: 'تحدث مع مساعد الذكاء الاصطناعي'
  },
  'hero.farmersHelped': {
    en: 'Farmers Helped', hi: 'किसानों की मदद की', bn: 'কৃষকদের সাহায্য', te: 'రైతులకు సహాయం', mr: 'शेतकऱ्यांना मदत', ta: 'விவசாயிகளுக்கு உதவி', gu: 'કૃષકોને મદદ', ur: 'کسانوں کی مدد', kn: 'ರೈತರಿಗೆ ಸಹಾಯ', or: 'କୃଷକଙ୍କୁ ସାହାଯ୍ୟ', pa: 'ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ', as: 'খেতিয়কসকলক সহায়তা', ne: 'किसानहरूलाई मद्दत', ml: 'കർഷകർക്ക് സഹായം', sa: 'कृषकानां साहाय्यम्', ks: 'کساناں دی مدد', sd: 'کسانن جي مدد', bo: 'ཞིང་པ་རྣམས་ལ་རོགས་རམ།', es: 'Agricultores Ayudados', fr: 'Agriculteurs Aidés', de: 'Landwirten Geholfen', pt: 'Agricultores Ajudados', it: 'Agricoltori Aiutati', ru: 'Помогли Фермерам', ja: '支援した農家', ko: '도움받은 농부', zh: '帮助的农民', ar: 'المزارعون المساعدون'
  },
  'hero.predictionAccuracy': {
    en: 'Prediction Accuracy', hi: 'भविष्यवाणी सटीकता', bn: 'ভবিষ্যদ্বাণীর নির্ভুলতা', te: 'అంచనా ఖచ్చితత్వం', mr: 'अंदाजाची अचूकता', ta: 'கணிப்பு துல்லியம்', gu: 'આગાહીની ચોકસાઈ', ur: 'پیشن گوئی کی درستگی', kn: 'ಊಹೆಯ ನಿಖರತೆ', or: 'ଭବିଷ୍ୟତବାଣୀର ସଠିକତା', pa: 'ਅੰਦਾਜ਼ੇ ਦੀ ਸ਼ੁੱਧਤਾ', as: 'ভৱিষ্যতবাণীৰ সঠিকতা', ne: 'भविष्यवाणीको शुद्धता', ml: 'പ്രവചനത്തിന്റെ കൃത്യത', sa: 'भविष्यवाण्याः शुद्धता', ks: 'پیشن گوئی دی درستگی', sd: 'پيشن گوئي جي درستگي', bo: 'ཕྱི་ལོའི་ཁ་གསལ་གྱི་ཆ་ཤས་ཆེན་པོ།', es: 'Precisión de Predicción', fr: 'Précision de Prédiction', de: 'Vorhersagegenauigkeit', pt: 'Precisão da Previsão', it: 'Precisione della Previsione', ru: 'Точность Прогнозирования', ja: '予測精度', ko: '예측 정확도', zh: '预测准确性', ar: 'دقة التنبؤ'
  },
  'hero.aiSupport': {
    en: 'AI Support', hi: 'AI सहायता', bn: 'AI সহায়তা', te: 'AI మద్దతు', mr: 'AI समर्थन', ta: 'AI ஆதரவு', gu: 'AI સહાયતા', ur: 'AI سپورٹ', kn: 'AI ಬೆಂಬಲ', or: 'AI ସହାୟତା', pa: 'AI ਸਹਾਇਤਾ', as: 'AI সহায়তা', ne: 'AI सहयोग', ml: 'AI പിന്തുണ', sa: 'AI साहाय्यम्', ks: 'AI مدد', sd: 'AI مدد', bo: 'AI རོགས་རམ།', es: 'Soporte IA', fr: 'Support IA', de: 'KI-Unterstützung', pt: 'Suporte IA', it: 'Supporto IA', ru: 'ИИ Поддержка', ja: 'AIサポート', ko: 'AI 지원', zh: 'AI支持', ar: 'دعم الذكاء الاصطناعي'
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    const validLanguages = ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ne', 'ml', 'sa', 'ks', 'sd', 'bo', 'es', 'fr', 'de', 'pt', 'it', 'ru', 'ja', 'ko', 'zh', 'ar'];
    if (savedLanguage && validLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Enhanced translation function with multiple API fallbacks
  const translate = async (text: string, targetLang: Language): Promise<string> => {
    const cacheKey = `${text}-${targetLang}`;
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // If target language is English, return original text
    if (targetLang === 'en') {
      return text;
    }

    try {
      setIsLoading(true);
      
      // Try multiple translation APIs for better reliability
      const translationAPIs = [
        // MyMemory API (Free, no key required)
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`,
        // LibreTranslate API (Free, no key required)
        `https://libretranslate.de/translate`,
        // Google Translate (Free tier)
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      ];

      // Try MyMemory API first (most reliable for free)
      try {
        const response = await fetch(translationAPIs[0]);
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
          const translatedText = data.responseData.translatedText;
          translationCache.set(cacheKey, translatedText);
          return translatedText;
        }
      } catch (error) {
        console.log('MyMemory API failed, trying LibreTranslate...');
      }

      // Try LibreTranslate API
      try {
        const response = await fetch(translationAPIs[1], {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: targetLang,
            format: 'text'
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.translatedText) {
            const translatedText = data.translatedText;
            translationCache.set(cacheKey, translatedText);
            return translatedText;
          }
        }
      } catch (error) {
        console.log('LibreTranslate API failed, trying Google Translate...');
      }

      // Try Google Translate API
      try {
        const response = await fetch(translationAPIs[2]);
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && data[0][0] && data[0][0][0]) {
            const translatedText = data[0][0][0];
            translationCache.set(cacheKey, translatedText);
            return translatedText;
          }
        }
      } catch (error) {
        console.log('Google Translate API failed');
      }
      
      // If all APIs fail, return original text
      console.warn('All translation APIs failed for:', text);
      return text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setIsLoading(false);
    }
  };

  // Main translation function with dynamic translation
  const t = async (key: string, fallback?: string): Promise<string> => {
    // Check if we have a default translation for this key
    if (defaultTranslations[key] && defaultTranslations[key][language]) {
      return defaultTranslations[key][language];
    }
    
    // If no default translation, try to translate the fallback or key
    const textToTranslate = fallback || key;
    
    // If it's English, return as is
    if (language === 'en') {
      return textToTranslate;
    }
    
    // Try to translate dynamically
    try {
      const translatedText = await translate(textToTranslate, language);
      return translatedText;
    } catch (error) {
      console.error('Dynamic translation failed:', error);
      return textToTranslate;
    }
  };

  // Synchronous version for immediate use (returns English if not cached)
  const tSync = (key: string, fallback?: string): string => {
    // Check if we have a default translation for this key
    if (defaultTranslations[key] && defaultTranslations[key][language]) {
      return defaultTranslations[key][language];
    }
    
    // Check cache for dynamic translations
    const textToTranslate = fallback || key;
    const cacheKey = `${textToTranslate}-${language}`;
    
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }
    
    // Return original text if not translated yet
    return textToTranslate;
  };

  // Function to translate all content on the page
  const translateAllContent = async () => {
    if (language === 'en') return;
    
    setIsLoading(true);
    
    try {
      // Get all text elements on the page
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, button, label, a');
      
      const translationPromises = Array.from(textElements).map(async (element) => {
        const text = element.textContent?.trim();
        if (text && text.length > 0 && text.length < 200) { // Only translate short texts
          try {
            const translatedText = await translate(text, language);
            if (translatedText !== text) {
              element.textContent = translatedText;
            }
          } catch (error) {
            console.error('Failed to translate:', text, error);
          }
        }
      });
      
      await Promise.all(translationPromises);
    } catch (error) {
      console.error('Error translating all content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    
    // Automatically translate all content when language changes
    if (lang !== 'en') {
      setTimeout(() => {
        translateAllContent();
      }, 100);
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    tSync,
    translateAllContent,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
