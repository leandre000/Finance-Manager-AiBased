import { useEffect, useState } from 'react'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Activity
} from 'lucide-react'
import * as dashboardService from '../../services/dashboard.service'
import { DashboardOverview } from '../../types'
import { formatCurrency } from '../../lib/utils'
import StatCard from '../../components/dashboard/StatCard'
import CashFlowChart from '../../components/dashboard/CashFlowChart'
import SpendingChart from '../../components/dashboard/SpendingChart'
import RecentTransactions from '../../components/dashboard/RecentTransactions'
import BudgetProgress from '../../components/dashboard/BudgetProgress'
import GoalProgress from '../../components/dashboard/GoalProgress'
import FinancialHealthCard from '../../components/dashboard/FinancialHealthCard'

const DashboardPage = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await dashboardService.getOverview()
      setOverview(data)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(overview.totalBalance)}
          icon={Wallet}
          trend={overview.thisMonth.netIncome > 0 ? 'up' : 'down'}
          trendValue={`${formatCurrency(Math.abs(overview.thisMonth.netIncome))} this month`}
          color="blue"
        />
        
        <StatCard
          title="Income (This Month)"
          value={formatCurrency(overview.thisMonth.income)}
          icon={TrendingUp}
          trend="up"
          trendValue={`${overview.thisMonth.transactionCount} transactions`}
          color="green"
        />
        
        <StatCard
          title="Expenses (This Month)"
          value={formatCurrency(overview.thisMonth.expenses)}
          icon={TrendingDown}
          trend="down"
          trendValue={`${overview.thisMonth.transactionCount} transactions`}
          color="red"
        />
        
        <StatCard
          title="Net Income"
          value={formatCurrency(overview.thisMonth.netIncome)}
          icon={Activity}
          trend={overview.thisMonth.netIncome > 0 ? 'up' : 'down'}
          trendValue={`Savings rate: ${((overview.thisMonth.netIncome / overview.thisMonth.income) * 100).toFixed(1)}%`}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowChart />
        <SpendingChart />
      </div>

      {/* Financial Health */}
      <FinancialHealthCard />

      {/* Budget & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgress />
        <GoalProgress />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  )
}

export default DashboardPage

