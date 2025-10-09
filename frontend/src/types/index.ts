export interface User {
  id: string
  email: string
  fullName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export type AccountType = 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'loan' | 'other'

export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  creditLimit?: number | null
  currency: string
  color?: string | null
  icon?: string | null
  description?: string | null
  isActive: boolean
  includeInTotal: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: CategoryType
  color?: string | null
  icon?: string | null
  description?: string | null
  isSystem: boolean
  userId?: string | null
  createdAt: string
  updatedAt: string
}

export type TransactionType = 'income' | 'expense' | 'transfer'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  date: string
  description?: string | null
  notes?: string | null
  payee?: string | null
  tags?: string[] | null
  attachments?: string[] | null
  userId: string
  accountId: string
  categoryId?: string | null
  toAccountId?: string | null
  isRecurring: boolean
  recurringFrequency?: string | null
  account?: Account
  category?: Category
  toAccount?: Account
  createdAt: string
  updatedAt: string
}

export type BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  period: BudgetPeriod
  startDate: string
  endDate: string
  rollover: boolean
  isActive: boolean
  notes?: string | null
  userId: string
  categoryId?: string | null
  category?: Category
  createdAt: string
  updatedAt: string
}

export type GoalStatus = 'in_progress' | 'completed' | 'cancelled'

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate?: string | null
  status: GoalStatus
  color?: string | null
  icon?: string | null
  description?: string | null
  milestones?: Milestone[] | null
  userId: string
  accountId?: string | null
  account?: Account
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  amount: number
  description: string
  achieved: boolean
}

export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
export type RecurringStatus = 'active' | 'paused' | 'completed' | 'cancelled'

export interface RecurringTransaction {
  id: string
  name: string
  type: TransactionType
  amount: number
  frequency: RecurringFrequency
  startDate: string
  endDate?: string | null
  nextOccurrence: string
  lastProcessed?: string | null
  status: RecurringStatus
  description?: string | null
  notes?: string | null
  payee?: string | null
  tags?: string[] | null
  occurrenceCount: number
  maxOccurrences?: number | null
  autoCreate: boolean
  notifyBeforeCreation: boolean
  notifyDaysBefore: number
  userId: string
  accountId: string
  categoryId?: string | null
  toAccountId?: string | null
  account?: Account
  category?: Category
  toAccount?: Account
  createdAt: string
  updatedAt: string
}

export type NotificationType = 
  | 'budget_alert'
  | 'budget_exceeded'
  | 'goal_milestone'
  | 'goal_completed'
  | 'recurring_upcoming'
  | 'low_balance'
  | 'unusual_spending'
  | 'monthly_summary'
  | 'system'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  data?: any
  isRead: boolean
  readAt?: string | null
  isActionable: boolean
  actionUrl?: string | null
  actionLabel?: string | null
  userId: string
  createdAt: string
}

export interface DashboardOverview {
  totalBalance: number
  accountCount: number
  thisMonth: {
    income: number
    expenses: number
    netIncome: number
    transactionCount: number
  }
  budgets: {
    total: number
    spent: number
    remaining: number
    percentage: number
    count: number
  }
  goals: {
    target: number
    current: number
    remaining: number
    percentage: number
    count: number
  }
}

export interface CashFlowData {
  month: string
  income: number
  expenses: number
  netIncome: number
}

export interface CategorySpending {
  name: string
  amount: number
  count: number
  color: string
  icon: string
  percentage: number
}

export interface FinancialHealth {
  score: number
  status: string
  insights: {
    type: 'positive' | 'negative' | 'warning' | 'neutral'
    message: string
  }[]
  metrics: {
    totalBalance: number
    savingsRate: number
    monthlyIncome: number
    monthlyExpenses: number
  }
}

