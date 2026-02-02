// src/app/api/cart/cookie/route.ts
import { CART_COOKIE_NAME } from '@/data/constants'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { cart } = await request.json() // ✅ Pega o objeto "cart"

  const allCookies = await cookies()
  allCookies.set(CART_COOKIE_NAME, JSON.stringify(cart), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30 * 12, // 1 year
    path: '/',
  })
  return NextResponse.json({ message: 'Cart cookie updated' }, { status: 200 })
}

export async function GET() {
  const allCookies = await cookies()
  const cartCookie = allCookies.get(CART_COOKIE_NAME)
  const cookieValue = cartCookie?.value

  if (cookieValue) {
    try {
      const parsed = JSON.parse(cookieValue)
      return NextResponse.json({ cart: parsed }, { status: 200 }) // ✅ Correto
    } catch (error) {
      console.error('Invalid cart cookie JSON:', error)
      return NextResponse.json({ cart: { id: '', items: [] } }, { status: 200 }) // ✅ Mantém padrão
    }
  }

  return NextResponse.json({ cart: { id: '', items: [] } }, { status: 200 }) // ✅ Mantém padrão
}

export async function DELETE() {
  const allCookies = await cookies()

  allCookies.set(CART_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })

  return NextResponse.json(
    JSON.stringify({ message: `${CART_COOKIE_NAME} cookie deleted` }),
    {
      status: 200, // OK status
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}
