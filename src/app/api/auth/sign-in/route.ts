import { REFRESH_TOKEN } from '@/data/constants'
import { databaseApi } from '@/data/database-api'
import { env } from '@/env'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'



export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const response = await databaseApi('/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-frontend-key': env.DATABASE_API_SECRET_KEY,
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  const { token } = await response.json()
  const decodedToken = jwt.decode(token)

  return NextResponse.json(JSON.stringify(decodedToken), {
    status: 200,
  })
}
