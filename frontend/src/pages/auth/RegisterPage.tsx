import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error(t('auth.passwordMismatch'))
      return
    }

    if (password.length < 8) {
      toast.error(t('validation.minLength', { field: t('common.password'), length: 8 }))
      return
    }

    setLoading(true)

    try {
      await register(email, fullName, password)
      toast.success(t('auth.registerSuccess'))
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('auth.registerError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('auth.registerTitle')}</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">{t('auth.registerSubtitle')}</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="label">{t('auth.fullName')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input pl-10"
                placeholder={t('auth.fullNamePlaceholder')}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">{t('common.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
                placeholder={t('auth.emailPlaceholder')}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="label">{t('common.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10 pr-10"
                placeholder={t('auth.passwordPlaceholder')}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('validation.minLength', { field: t('common.password'), length: 8 })}</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="label">{t('auth.confirmPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pl-10"
                placeholder={t('auth.confirmPasswordPlaceholder')}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? `${t('common.loading')}...` : t('auth.registerButton')}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or</span>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold">
            {t('auth.loginLink')}
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default RegisterPage

