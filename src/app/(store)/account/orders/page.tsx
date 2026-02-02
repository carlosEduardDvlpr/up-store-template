'use client'

import { useEffect, useState } from 'react'

import { OrderTable } from '@/components/Tables/user-orders'
import { useTokenContext } from '@/contexts/token-context'

import { Order } from '@/data/types/orders'
import { getOrders } from '@/lib/database'

export default function OrdersPage() {
  const { user } = useTokenContext()
  const [orders, setOrders] = useState<Order[] | null>([])

  useEffect(() => {
    getOrders().then((result) => {
      setOrders(result)
    })
  }, [user])

  return (
    <div className="h-full min-h-screen mx-auto max-w-2xl lg:max-w-full px-8 py-8">
      <OrderTable orders={orders} />
    </div>
  )
}
