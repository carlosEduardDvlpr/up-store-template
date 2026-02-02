'use server'

import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { getUser } from '@/lib/database'

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return <>{children}</>
}
