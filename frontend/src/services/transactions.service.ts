import api from '../lib/api'
import { Transaction } from '../types'

export const getTransactions = async (params?: any): Promise<Transaction[]> => {
  const response = await api.get('/transactions', { params })
  return response.data
}

export const getTransaction = async (id: string): Promise<Transaction> => {
  const response = await api.get(`/transactions/${id}`)
  return response.data
}

export const createTransaction = async (data: Partial<Transaction>): Promise<Transaction> => {
  const response = await api.post('/transactions', data)
  return response.data
}

export const updateTransaction = async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
  const response = await api.patch(`/transactions/${id}`, data)
  return response.data
}

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`)
}

export const getStatistics = async (startDate: string, endDate: string) => {
  const response = await api.get('/transactions/statistics', {
    params: { startDate, endDate }
  })
  return response.data
}

