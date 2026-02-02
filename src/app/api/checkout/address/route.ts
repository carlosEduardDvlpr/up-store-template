import { cookies } from 'next/headers'
import { REFRESH_TOKEN } from '@/data/constants'
import { databaseApi } from '@/data/database-api'
import { env } from '@/env'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const data = await request.json()

  const token = cookieStore.get(REFRESH_TOKEN)
  if (!token?.value) {
    return new Response('Usuário não autenticado', { status: 401 })
  }
  const response = await databaseApi('/checkouts/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
      'x-api-frontend-key': env.DATABASE_API_SECRET_KEY,
    },
    body: JSON.stringify(data),
  })
  if (response.status === 201) {
    return new Response(
      JSON.stringify({ message: 'Cadastro realizado com sucesso!' }),
      {
        status: 201,
      },
    )
  } else {
    return new Response('Erro ao cadastrar Telefone', { status: 400 })
  }
}
