import api from '../lib/api'

export const getIncomeExpenseReport = async (params: {
  startDate: string
  endDate: string
  groupBy?: 'day' | 'week' | 'month'
}) => {
  const response = await api.get('/reports/income-expense', { params })
  return response.data
}

export const getCashFlowReport = async (params: {
  startDate: string
  endDate: string
}) => {
  const response = await api.get('/reports/cash-flow', { params })
  return response.data
}

export const getCategoryBreakdown = async (params: {
  startDate: string
  endDate: string
  type?: 'income' | 'expense'
}) => {
  const response = await api.get('/reports/category-breakdown', { params })
  return response.data
}

export const getFinancialSummary = async (params: {
  startDate: string
  endDate: string
}) => {
  const response = await api.get('/reports/financial-summary', { params })
  return response.data
}

export const exportReport = async (
  reportType: string,
  params: any,
  format: 'csv' | 'pdf' | 'excel'
) => {
  const response = await api.get(`/reports/${reportType}/export`, {
    params: { ...params, format },
    responseType: 'blob',
  })
  return response.data
}

