interface OrderStatusProps {
  status: string | null;
}

const statusMap: Record<string, string> = {
  PAID: "Pago",
  SEPARATED: "Separado",
  BLOCKED: "Bloqueado",
  CANCELADO: "Cancelado",
  WAITING: "Aguardando",
  "Not Registered": "Não Registrado",
  PaymentError: "Erro de pagamento",
  Error: "Erro de integração",
};

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {!status && <span className="h-2 w-2 rounded-full bg-amber-500" />}
      {status === "Attended" && (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      )}
      {status === "PartiallyAnswered" && (
        <span className="h-2 w-2 rounded-full bg-amber-800" />
      )}

      {status === "Blocked" && (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}

      {status === "Canceled" && (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}

      {status === "InProgress" && (
        <span className="h-2 w-2 rounded-full bg-blue-500" />
      )}

      <span className="font-base text-muted-foreground">
        {!status ? "Aguardando aprovação" : statusMap[status]}
      </span>
    </div>
  );
}
