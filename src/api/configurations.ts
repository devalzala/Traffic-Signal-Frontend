import type { IntersectionType } from '../constants/intersections'
import { api } from './client'

export interface ApiConfiguration {
  id: number
  intersectionType: IntersectionType
  signalTimes: number[]
  emergencyTime: number
  createdAt: string
  updatedAt: string
}

export const getConfigurations = async (): Promise<ApiConfiguration[]> => {
  const { data } = await api.get<{ data: ApiConfiguration[] }>('/configurations')
  return data.data
}

export const putConfiguration = async (
  type: IntersectionType,
  signalTimes: number[]
): Promise<ApiConfiguration> => {
  const { data } = await api.put<{ data: ApiConfiguration }>(`/configurations/${type}`, {
    signalTimes,
  })
  return data.data
}
