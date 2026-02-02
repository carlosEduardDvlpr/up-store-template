"use client";

import { useForm, Controller } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import * as Input from "@/components/Input";
import * as Select from "@/components/Select";
import { Mail } from "lucide-react";
import { formatDocumentCode, removeSpecialCharacters } from "@/lib/utils";
import { User } from "@/data/types/user";
import { ToastSuccess } from "@/components/Toaster/toast-success";
import { Button } from "@/components/ui/button";

const newSignUpFormSchema = zod.object({
  id: zod.string(),
  status: zod.number().min(0).max(9999),
  name: zod
    .string()
    .min(3, { message: "Mínimo de 3 caracteres" })
    .max(20, { message: "Máximo de 20 caracteres" }),
  email: zod
    .string()
    .email({ message: "E-mail inválido" })
    .max(50, { message: "Máximo de 50 caracteres" }),

  cpf: zod.string().max(14, { message: "Máximo de 14 caracteres" }),
  cnpj: zod.string().max(14, { message: "Máximo de 14 caracteres" }).optional(),
  gender: zod.string().optional(),
  birth_date: zod.string().optional(),
  newsletter: zod.boolean().optional(),
});

export type NewUpdateProfileFormData = zod.infer<typeof newSignUpFormSchema>;

interface ProfileProps {
  onUpdateProfile: (data: NewUpdateProfileFormData) => Promise<void>;
  user: User;
}

export function ProfileForm({ user, onUpdateProfile }: ProfileProps) {
  const {
    register,
    handleSubmit,
    reset,
    // watch,
    control,
    formState: { errors },
  } = useForm<NewUpdateProfileFormData>({
    resolver: zodResolver(newSignUpFormSchema),
    defaultValues: {
      id: user.id,
      status: user.status ?? 200,
      name: user.name,
      cpf: user.cpf,
      cnpj: user.cnpj,
      email: user.email,
      gender: user.gender,
      birth_date: user.birth_date ?? "",
      newsletter: user.newsletter,
    },
  });

  async function handleUpdateProfile(data: NewUpdateProfileFormData) {
    await onUpdateProfile(data);
    reset();
    ToastSuccess({
      title: "Atualização de perfil",
      description: "Informações do perfil atualizadas com sucesso!",
    });
    return Response.json({ message: "Atualização realizada com sucesso!" });
  }

  const handleCancel = () => {
    reset();
  };

  return (
    <form
      id="update_profile"
      onSubmit={handleSubmit(handleUpdateProfile)}
      className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200 dark:divide-zinc-800"
    >
      {/* names */}
      <div className="grid gap-3 pt-5 lg:grid-cols-form">
        <label
          htmlFor="name"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          Nome e sobrenome
          {errors.name && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.name.message}
            </span>
          )}
        </label>

        <div className="grid grid-cols-1 gap-6">
          <Input.Root>
            <Input.Control
              id="name"
              type="string"
              placeholder="Nome"
              required
              {...register("name")}
            />
          </Input.Root>
        </div>
      </div>

      {/* email */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="email"
          className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
        >
          E-mail
          {errors.email && (
            <span className="text-sm font-normal text-red-500 dark:text-red-500">
              {errors.email.message}
            </span>
          )}
        </label>
        <div className="flex gap-3">
          <Input.Root>
            <Input.Prefix>
              <Mail className="h-5 w-5 text-zinc-500" />
            </Input.Prefix>
            <Input.Control
              id="email"
              type="text"
              placeholder="fulano.silva@exemplo.com.br"
              required
              {...register("email")}
            />
          </Input.Root>
        </div>
      </div>

      {/* CPF */}
      <Controller
        name="cpf"
        control={control}
        defaultValue="" // Ensure it starts controlled
        render={({ field }) => (
          <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
            <label
              htmlFor="cpf"
              className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
            >
              CPF
              {errors.cpf && (
                <span className="text-sm font-normal text-red-500 dark:text-red-500">
                  {errors.cpf.message}
                </span>
              )}
            </label>
            <div className="flex gap-3">
              <Input.Root className="bg-white">
                <Input.Control
                  id="cpf"
                  type="text"
                  placeholder="Numeração do documento"
                  value={field.value ? formatDocumentCode(field.value) : ""} // Ensure it's formatted but never undefined
                  onChange={(e) => {
                    const rawValue = removeSpecialCharacters(e.target.value); // Clean input
                    field.onChange(rawValue); // Update form state with clean value
                  }}
                />
              </Input.Root>
            </div>
          </div>
        )}
      />

      {/* CNPJ */}
      <Controller
        name="cnpj"
        control={control}
        defaultValue="" // Ensure it starts controlled
        render={({ field }) => (
          <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
            <label
              htmlFor="cnpj"
              className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100"
            >
              CNPJ
              {errors.cnpj && (
                <span className="text-sm font-normal text-red-500 dark:text-red-500">
                  {errors.cnpj.message}
                </span>
              )}
            </label>
            <div className="flex gap-3">
              <Input.Root className="bg-white">
                <Input.Control
                  id="cnpj"
                  type="text"
                  placeholder="Numeração do documento"
                  value={field.value ? formatDocumentCode(field.value) : ""} // Ensure it's formatted but never undefined
                  onChange={(e) => {
                    const rawValue = removeSpecialCharacters(e.target.value); // Clean input
                    field.onChange(rawValue); // Update form state with clean value
                  }}
                />
              </Input.Root>
            </div>
          </div>
        )}
      />

      {/* gender */}
      <label className="grid gap-3 pt-5 lg:grid-cols-form">
        <span className="flex flex-col text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-100">
          Gênero
        </span>

        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select.Root value={field.value} onValueChange={field.onChange}>
              <Select.Trigger>
                <Select.Value placeholder="Selecione seu gênero" />
              </Select.Trigger>

              <Select.Content>
                <Select.Item value="Female">
                  <Select.ItemText>Feminino</Select.ItemText>
                </Select.Item>
                <Select.Item value="Male">
                  <Select.ItemText>Masculino</Select.ItemText>
                </Select.Item>
                <Select.Item value="Non-binary">
                  <Select.ItemText>Não binário</Select.ItemText>
                </Select.Item>
                <Select.Item value="Cisgender">
                  <Select.ItemText>Cisgênero</Select.ItemText>
                </Select.Item>
                <Select.Item value="Transgender">
                  <Select.ItemText>Transgênero</Select.ItemText>
                </Select.Item>
                <Select.Item value="Others">
                  <Select.ItemText>Outros...</Select.ItemText>
                </Select.Item>
              </Select.Content>
            </Select.Root>
          )}
        />
      </label>

      {/* birthday */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="birth_date"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-100"
        >
          Data de nascimento
        </label>
        <div className="flex gap-3">
          <Input.Root>
            <Input.Control
              id="birth_date"
              type="date"
              {...register("birth_date")}
            />
          </Input.Root>
        </div>
      </div>

      {/* newsletter */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="newsletter"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-100"
        >
          Newsletter
        </label>

        <div className="flex gap-3">
          <div className="flex h-5 items-center mr-2">
            <input
              id="newsletter"
              type="checkbox"
              required
              defaultChecked
              className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:border-2 focus:border-gray-300 focus:ring-2 focus:ring-offset-0 focus:ring-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-5">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-none border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50"
        >
          Cancelar
        </button>
        <Button
          type="submit"
          form="update_profile"
          className="rounded-none bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
        >
          Atualizar Perfil
        </Button>
      </div>
    </form>
  );
}
