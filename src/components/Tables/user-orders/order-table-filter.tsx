"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";

const orderFiltersSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  integrationStatus: z.string().optional(),
  operationCode: z.string().optional(),
});

type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>;

export function OrderTableFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const title = searchParams.get("q");
  const integrationStatus = searchParams.get("integrationStatus");
  const operationCode = searchParams.get("operationCode");

  const { register, handleSubmit, control, reset } =
    useForm<OrderFiltersSchema>({
      resolver: zodResolver(orderFiltersSchema),
      defaultValues: {
        id: id ?? "",
        title: title ?? "",
        integrationStatus: integrationStatus ?? "all",
        operationCode: operationCode ?? "all",
      },
    });

  function handleFilter(data: OrderFiltersSchema) {
    const params = new URLSearchParams();

    if (data.id) {
      params.set("id", data.id);
    }

    if (data.title) {
      params.set("q", data.title);
    }

    if (data.integrationStatus && data.integrationStatus !== "all") {
      params.set("integrationStatus", data.integrationStatus);
    }

    if (data.operationCode && data.operationCode !== "all") {
      params.set("operationCode", data.operationCode);
    }

    // Push the new URL with the updated search parameters
    router.push(`?${params.toString()}`);
  }

  function handleReset() {
    reset({
      id: "",
      title: "",
      integrationStatus: "all",
      operationCode: "all",
    });
    router.push("/admin/orders/list");
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="ID do pedido"
        className="h-8 w-auto"
        {...register("id")}
      />
      <Input
        placeholder="E-mail ou CEP"
        className="h-8 w-[320px]"
        {...register("title")}
      />

      <Controller
        name="integrationStatus"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue=""
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="Canceled">Cancelado</SelectItem>
                <SelectItem value="Blocked">Bloqueado</SelectItem>
                <SelectItem value="InProgress">Em Progresso</SelectItem>
                <SelectItem value="PartiallyAnswered">
                  Parcialmente Atendido
                </SelectItem>
                <SelectItem value="Attended">Atendido</SelectItem>
              </SelectContent>
            </Select>
          );
        }}
      />
      <Controller
        name="operationCode"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue=""
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Operações</SelectItem>
                <SelectItem value="500">(500) Showroom Atacado</SelectItem>
                <SelectItem value="510">(510) E-commerce Varejo</SelectItem>
                <SelectItem value="701">(701) Exportação Atacado</SelectItem>
                <SelectItem value="702">(702) Exportação Varejo</SelectItem>
                <SelectItem value="704">(704) Exportação Atacado 2</SelectItem>
                <SelectItem value="1911">(1191) Remessa Marketing</SelectItem>
                <SelectItem value="752">
                  (752) Exportação Remessa Marketing
                </SelectItem>
              </SelectContent>
            </Select>
          );
        }}
      />

      <Button variant="secondary" size="sm" type="submit">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>
      <Button variant="outline" size="sm" type="button" onClick={handleReset}>
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  );
}
