import api from '../lib/api'
import { Budget } from '../types'

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get('/budgets')
  return response.data
}

export const getBudget = async (id: string): Promise<Budget> => {
  const response = await api.get(`/budgets/${id}`)
  return response.data
}

export const createBudget = async (data: Partial<Budget>): Promise<Budget> => {
  const response = await api.post('/budgets', data)
  return response.data
}

export const updateBudget = async (id: string, data: Partial<Budget>): Promise<Budget> => {
  const response = await api.patch(`/budgets/${id}`, data)
  return response.data
}

export const deleteBudget = async (id: string): Promise<void> => {
  await api.delete(`/budgets/${id}`)
}

export const getBudgetProgress = async (id: string) => {
  const response = await api.get(`/budgets/${id}/progress`)
  return response.data
}

