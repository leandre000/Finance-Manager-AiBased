import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    toast.success(t('settings.updateSuccess'));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('settings.title')}
      </h1>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('settings.theme')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {theme === 'light' ? t('settings.lightMode') : t('settings.darkMode')}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Toggle between light and dark mode like Instagram
        </p>
      </div>

      {/* Language Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('settings.language')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Choose your preferred language
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* English */}
          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              currentLanguage === 'en'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            }`}
          >
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">
                {t('settings.english')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">English</p>
            </div>
          </button>

          {/* French */}
          <button
            onClick={() => handleLanguageChange('fr')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              currentLanguage === 'fr'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
            }`}
          >
            <div className="text-left">
              <p className="font-semibold text-gray-900 dark:text-white">
                {t('settings.french')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Français</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
