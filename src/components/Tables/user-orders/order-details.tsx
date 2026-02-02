import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderTableRowProps } from "./order-table-row";
import { OrderStatus } from "./order-status";
import { SearchCheckIcon } from "lucide-react";
import { formatCEP, formatCurrency } from "@/lib/utils";

export function OrderDetails({ order }: OrderTableRowProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {order.id}
          <span className="sr-only">Detalhes do pedido</span>
          <SearchCheckIcon
            className="w-4 h-4 lg:w-6 lg:h-6"
            strokeWidth={0.9}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Pedido: {order.code}</DialogTitle>
          <DialogDescription>Detalhes do pedido</DialogDescription>
        </DialogHeader>

        <div className="max-h-[75vh] overflow-y-auto space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <OrderStatus
                    status={
                      order.integration_status ?? "Aguardando confirmação"
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">ID</TableCell>
                <TableCell className="flex justify-end">{order.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Cliente</TableCell>
                <TableCell className="flex justify-end">
                  {order.user.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Qnt.</TableCell>
                <TableCell className="flex justify-end">
                  {order.items_quantity}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Criado à
                </TableCell>
                <TableCell className="flex justify-end">
                  {" "}
                  {formatDistanceToNow(order.created_at, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Telefone
                </TableCell>
                <TableCell className="flex justify-end">
                  {order.user.phones?.[0]?.ddd_code
                    ? `(${order.user.phones?.[0]?.ddd_code}) `
                    : ""}
                  {order.user.phones?.[0]?.number ?? "Não informado"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">CEP</TableCell>
                <TableCell className="flex justify-end">
                  {formatCEP(order.shipping_address?.zip_code)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Endereço
                </TableCell>
                <TableCell className="flex justify-end">
                  {order.shipping_address?.street ?? "Não informado"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Código</TableHead>
                <TableHead className="text-center">Cor</TableHead>
                <TableHead className="text-right">Tam.</TableHead>
                <TableHead className="text-right">Solicitado</TableHead>
                <TableHead className="text-right">Faturado</TableHead>
                <TableHead className="text-right">Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items.map((item, index) => {
                const discountPercentage = item.discount_percentage ?? 0;
                const priceWithDiscount =
                  item.price * (1 - discountPercentage / 100);
                return (
                  <TableRow key={index}>
                    <TableCell className="font-base">
                      {item.product_code}
                    </TableCell>
                    <TableCell className="font-base text-center">
                      {item.color_name}
                    </TableCell>
                    <TableCell className="font-base">
                      {item.size_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.settled_quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {Number(priceWithDiscount).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total do pedido</TableCell>
                <TableCell className="text-right font-base">
                  {formatCurrency(order.total_value)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
