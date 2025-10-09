import api from '../lib/api'
import { AuthResponse } from '../types'

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password })
  return response.data
}

export const register = async (
  email: string,
  fullName: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { email, fullName, password })
  return response.data
}

export const getProfile = async () => {
  const response = await api.get('/auth/profile')
  return response.data
}

