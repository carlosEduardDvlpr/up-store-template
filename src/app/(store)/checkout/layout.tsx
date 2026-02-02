'use server'

import { ReactNode } from 'react'

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  return <>{children}</>
}
