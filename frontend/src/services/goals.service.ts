import api from '../lib/api'
import { Goal } from '../types'

export const getGoals = async (): Promise<Goal[]> => {
  const response = await api.get('/goals')
  return response.data
}

export const getGoal = async (id: string): Promise<Goal> => {
  const response = await api.get(`/goals/${id}`)
  return response.data
}

export const createGoal = async (data: Partial<Goal>): Promise<Goal> => {
  const response = await api.post('/goals', data)
  return response.data
}

export const updateGoal = async (id: string, data: Partial<Goal>): Promise<Goal> => {
  const response = await api.patch(`/goals/${id}`, data)
  return response.data
}

export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete(`/goals/${id}`)
}

export const getGoalProgress = async (id: string) => {
  const response = await api.get(`/goals/${id}/progress`)
  return response.data
}

export const contributeToGoal = async (id: string, amount: number) => {
  const response = await api.post(`/goals/${id}/contribute`, { amount })
  return response.data
}

