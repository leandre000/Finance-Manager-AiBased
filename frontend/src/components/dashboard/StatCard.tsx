import { motion } from 'framer-motion'
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '../../lib/utils'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  trend?: 'up' | 'down'
  trendValue?: string
  color: 'blue' | 'green' | 'red' | 'purple'
}

const colorClasses = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-orange-500',
  purple: 'from-purple-500 to-pink-500',
}

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          
          {trend && trendValue && (
            <div className="mt-2 flex items-center gap-1">
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-success-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-danger-500" />
              )}
              <span className={cn(
                "text-sm font-medium",
                trend === 'up' ? 'text-success-500' : 'text-danger-500'
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>

        <div className={cn(
          "p-3 rounded-xl bg-gradient-to-br",
          colorClasses[color]
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard

