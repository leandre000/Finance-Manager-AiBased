import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Target, PieChart, Bell, Globe, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Finance Manager
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-400" />
              )}
            </button>
            
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {t('common.login')}
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
            >
              {t('common.register')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Take Control of Your
              <span className="text-primary-600 dark:text-primary-400"> Financial Future</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Track expenses, manage budgets, achieve savings goals, and get AI-powered insights - all in one place.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl text-lg font-semibold"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:shadow-lg transition-all border-2 border-gray-200 dark:border-gray-700 text-lg font-semibold"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">$12,450.00</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Income</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">$5,200</p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expenses</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">$3,850</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Manage Your Money
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Powerful features to help you take control of your finances
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Budgeting
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Set and track budgets with real-time alerts when you're approaching your limits
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Goal Tracking
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize and achieve your savings goals with progress tracking and milestones
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              AI Insights
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized financial recommendations and spending insights powered by AI
            </p>
          </motion.div>
        </div>
      </section>

      {/* Multi-language Feature */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-800 dark:to-purple-800 rounded-2xl p-12 text-center text-white">
          <Globe className="w-16 h-16 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">
            Available in Multiple Languages
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Use Finance Manager in English or French - switch anytime!
          </p>
          <div className="flex justify-center space-x-4">
            <span className="px-6 py-3 bg-white/20 rounded-lg backdrop-blur-sm">
              🇬🇧 English
            </span>
            <span className="px-6 py-3 bg-white/20 rounded-lg backdrop-blur-sm">
              🇫🇷 Français
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Your Financial Journey?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who are already taking control of their finances
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl text-xl font-semibold"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Finance Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

