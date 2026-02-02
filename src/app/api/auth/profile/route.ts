import { cookies } from 'next/headers'
import { REFRESH_TOKEN } from '@/data/constants'
import { databaseApi } from '@/data/database-api'
import { env } from '@/env'

export async function GET() {
  const cookieStore = await cookies()

  const token = cookieStore.get(REFRESH_TOKEN)
  if (!token?.value) {
    return new Response('Usuário não autenticado', { status: 401 })
  }
  const { user } = await databaseApi('/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
      'x-api-frontend-key': env.DATABASE_API_SECRET_KEY,
    },
  }).then((res) => res.json())

  return new Response(JSON.stringify(user), {
    status: 200,
  })
}
