import api from '../lib/api'
import { DashboardOverview, CashFlowData, FinancialHealth } from '../types'

export const getOverview = async (): Promise<DashboardOverview> => {
  const response = await api.get('/dashboard/overview')
  return response.data
}

export const getCashFlow = async (months = 6): Promise<CashFlowData[]> => {
  const response = await api.get('/dashboard/cash-flow', { params: { months } })
  return response.data
}

export const getSpendingByCategory = async (startDate?: string, endDate?: string) => {
  const response = await api.get('/dashboard/spending-by-category', {
    params: { startDate, endDate }
  })
  return response.data
}

export const getIncomeByCategory = async (startDate?: string, endDate?: string) => {
  const response = await api.get('/dashboard/income-by-category', {
    params: { startDate, endDate }
  })
  return response.data
}

export const getRecentTransactions = async (limit = 10) => {
  const response = await api.get('/dashboard/recent-transactions', { params: { limit } })
  return response.data
}

export const getAccountsOverview = async () => {
  const response = await api.get('/dashboard/accounts-overview')
  return response.data
}

export const getBudgetStatus = async () => {
  const response = await api.get('/dashboard/budget-status')
  return response.data
}

export const getFinancialHealth = async (): Promise<FinancialHealth> => {
  const response = await api.get('/dashboard/financial-health')
  return response.data
}

