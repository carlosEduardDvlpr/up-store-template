import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Order } from '@/data/types/orders'
import { OrderTableRow } from './order-table-row'

interface OrderTableProps {
  orders: Order[] | null | []
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <>
      <div className="pb-4 pt-4 flex items-start justify-start">
        <h1 className="text-xl tracking-tight text-gray-900">PEDIDOS</h1>
      </div>

      <div className="rounded-md border bg-white">
        {!orders || orders.length === 0 ? (
          <div className="text-center p-4 space-y-2">
            <p className="text-lg font-bold">Ainda não há pedidos</p>
            <p className="text-md font-normal">
              Vá até a loja e faça seu primeiro pedido.
            </p>
          </div>
        ) : (
          <Table className="bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="w-35">Detalhes</TableHead>
                <TableHead className="w-35">Código</TableHead>
                <TableHead className="w-45">Criado há</TableHead>
                <TableHead className="w-35">Status</TableHead>
                <TableHead className="w-35">Itens</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders &&
                orders.length > 0 &&
                orders.map((order: Order) => {
                  return (
                    <OrderTableRow
                      key={`${order.id}-${order.code}`}
                      order={order}
                    />
                  )
                })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}
