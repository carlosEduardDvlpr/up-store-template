import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";

import { OrderDetails } from "./order-details";
import { OrderStatus } from "./order-status";
import { Order } from "@/data/types/orders";

export interface OrderTableRowProps {
  order: Order;
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <OrderDetails order={order} />
      </TableCell>
      <TableCell className="font-mono text-sm font-base">
        {order.code}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(order.created_at, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell>
        <OrderStatus status={order.integration_status ?? null} />
      </TableCell>
      <TableCell>{order.items_quantity ?? 0}</TableCell>
    </TableRow>
  );
}
