import api from '../lib/api'
import { Account } from '../types'

export const getAccounts = async (): Promise<Account[]> => {
  const response = await api.get('/accounts')
  return response.data
}

export const getAccount = async (id: string): Promise<Account> => {
  const response = await api.get(`/accounts/${id}`)
  return response.data
}

export const createAccount = async (data: Partial<Account>): Promise<Account> => {
  const response = await api.post('/accounts', data)
  return response.data
}

export const updateAccount = async (id: string, data: Partial<Account>): Promise<Account> => {
  const response = await api.patch(`/accounts/${id}`, data)
  return response.data
}

export const deleteAccount = async (id: string): Promise<void> => {
  await api.delete(`/accounts/${id}`)
}

export const getTotalBalance = async (): Promise<number> => {
  const response = await api.get('/accounts/total-balance')
  return response.data.totalBalance || response.data
}

