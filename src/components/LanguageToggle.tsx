import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const languages = [
  // Indian Languages
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn' as Language, name: 'বাংলা', flag: '🇮🇳' },
  { code: 'te' as Language, name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr' as Language, name: 'मराठी', flag: '🇮🇳' },
  { code: 'ta' as Language, name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu' as Language, name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ur' as Language, name: 'اردو', flag: '🇮🇳' },
  { code: 'kn' as Language, name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or' as Language, name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa' as Language, name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'as' as Language, name: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ne' as Language, name: 'नेपाली', flag: '🇮🇳' },
  { code: 'ml' as Language, name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'sa' as Language, name: 'संस्कृतम्', flag: '🇮🇳' },
  { code: 'ks' as Language, name: 'کٲشُر', flag: '🇮🇳' },
  { code: 'sd' as Language, name: 'سنڌي', flag: '🇮🇳' },
  { code: 'bo' as Language, name: 'བོད་ཡིག', flag: '🇮🇳' },
  // International Languages
  { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
  { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
  { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt' as Language, name: 'Português', flag: '🇵🇹' },
  { code: 'it' as Language, name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' },
  { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
  { code: 'ko' as Language, name: '한국어', flag: '🇰🇷' },
  { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
  { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' }
];

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, isLoading, translateAllContent } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const handleTranslateAll = async () => {
    await translateAllContent();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 backdrop-blur-sm shadow-lg"
          disabled={isLoading}
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
          <span className="sm:hidden">
            {currentLanguage?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-xl"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{lang.flag}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {lang.name}
              </span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
        {/* Translate All Button */}
        {language !== 'en' && (
          <>
            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
            <DropdownMenuItem
              onClick={handleTranslateAll}
              disabled={isLoading}
              className="flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-primary font-medium"
            >
              {isLoading ? (
                <span className="text-sm">Translating...</span>
              ) : (
                <span className="text-sm">🔄 Translate All Content</span>
              )}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
