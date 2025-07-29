import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-sage-200">
      <Globe className="w-4 h-4 text-sage-600" />
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'fr'
            ? 'bg-sage-600 text-white shadow-sm'
            : 'text-sage-600 hover:bg-sage-100'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
          language === 'en'
            ? 'bg-sage-600 text-white shadow-sm'
            : 'text-sage-600 hover:bg-sage-100'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageToggle;