import { env } from '@/env'

export async function databaseApi(path: string, init?: RequestInit) {
  const baseUrl = env.DATABASE_URL
  const apiPrefix = '/api'
  const url = new URL(apiPrefix.concat(path), baseUrl)

  return fetch(url, init)
}
