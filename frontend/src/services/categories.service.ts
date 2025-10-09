import api from '../lib/api'
import { Category } from '../types'

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories')
  return response.data
}

export const getCategory = async (id: string): Promise<Category> => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const createCategory = async (data: Partial<Category>): Promise<Category> => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  const response = await api.patch(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`)
}

