"use client";

import { useForm, Controller } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import * as Input from "@/components/Input";
import { Mail } from "lucide-react";

import { useUtmContext } from "@/contexts/utm-contex";
import {
  formatDocumentCode,
  removeSpecialCharacters,
  validateDocumentCode,
  isValidCEP,
  removeNonNumericalChars,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { Divider } from "@/components/Divider";
import { registerCustomer } from "@/clients/database/register-customer";
import { ToastError } from "@/components/Toaster/toast-error";
import { ToastSuccess } from "@/components/Toaster/toast-success";
import { addressInfoViaCEP } from "@/lib/via-cep";
import { SignUpFormHeader } from "./sign-up-form-header";
import { LoadingCircleAnimation } from "@/components/Animations/loading-circle-animation";
import { Button } from "@/components/Buttons";
import { BackToSignInPageButton } from "./back-to-sign-in-button";

const addressSchema = zod.object({
  type: zod.string().default("Delivery"),
  status: zod.number().default(200),
  zip_code: zod.string().min(1, { message: "Informe o CEP." }),
  street: zod.string().min(1, { message: "Informe a rua." }),
  number: zod.coerce
    .number()
    .min(1, { message: "Informe a numeração do endereço." }),
  complement: zod.string().optional(),
  neighborhood: zod.string().min(1, { message: "Informe o bairro." }),
  country: zod.string().min(1, { message: "Informe o país." }),
  city: zod.string().min(1, { message: "Informe a cidade." }),
  state: zod.string().min(1, { message: "Informe o estado" }),
});

const newSignUpFormSchema = zod
  .object({
    status: zod.number().min(0).max(200),
    name: zod
      .string()
      .min(3, { message: "Mínimo de 3 caracteres" })
      .max(100, { message: "Máximo de 20 caracteres" }),
    email: zod
      .string()
      .email({ message: "E-mail inválido" })
      .max(100, { message: "Máximo de 50 caracteres" }),
    password: zod
      .string()
      .min(6, { message: "Mínimo de 6 caracteres" })
      .max(50, { message: "Máximo de 50 caracteres" }),
    password_confirmation: zod
      .string()
      .max(50, { message: "Máximo de 50 caracteres" }),
    document_code: zod.string().max(14, { message: "Máximo de 14 caracteres" }),
    newsletter: zod.boolean().optional(),
    // Address fields as a nested object
    address: addressSchema,
    phone: zod.object({
      ddd_code: zod.string().min(2).max(2),
      number: zod.string().min(8).max(9),
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"], // field that will receive the error
  });

export type NewSignUpFormData = zod.infer<typeof newSignUpFormSchema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { cart } = useCart();
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<NewSignUpFormData>({
    resolver: zodResolver(newSignUpFormSchema),
    defaultValues: {
      status: 200,
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      document_code: "",
      newsletter: true,
      // Address defaults as a nested object
      address: {
        type: "Delivery",
        status: 200,
        zip_code: "",
        street: "",
        number: 0,
        complement: "",
        neighborhood: "",
        country: "",
        city: "",
        state: "",
      },
      phone: {
        ddd_code: "",
        number: "",
      },
    },
  });

  const { utmParamsFirstSession, utmParamsCurrentSession, referrer } =
    useUtmContext();
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("seller_id");

  const router = useRouter();

  const zip_code = watch("address.zip_code");

  useEffect(() => {
    async function fetchAddressData(cep: string) {
      try {
        const response = await addressInfoViaCEP(cep);

        if ("message" in response) {
          ToastError({
            title: "Endereço",
            description: response.message,
          });
          return;
        }

        const { uf, localidade, logradouro, bairro } = response;

        // Update the address fields with the response data while preserving other form values
        const currentValues = watch();
        reset({
          ...currentValues,
          address: {
            ...currentValues.address,
            street: logradouro,
            neighborhood: bairro,
            city: localidade,
            state: uf,
            country: "Brasil",
          },
        });
      } catch (error) {
        ToastError({
          title: "Endereço",
          description: "Erro ao buscar endereço pelo CEP",
          jsonError: JSON.stringify(error),
        });
      }
    }

    if (zip_code && isValidCEP(zip_code)) {
      fetchAddressData(removeNonNumericalChars(zip_code));
    }
  }, [zip_code, reset, watch]);

  async function handleNewSignUp(data: NewSignUpFormData) {
    setIsLoading(true);

    const isValidDocument = validateDocumentCode(data.document_code);

    if (!isValidDocument) {
      ToastError({
        title: "Cadastro de usuário",
        description: "CPF ou CNPJ inválido",
      });
      setIsLoading(false);
      return;
    }

    try {
      const {
        name,
        email,
        password,
        document_code,
        newsletter,
        address,
        phone,
      } = data;

      // Dynamically check if document_code is CPF or CNPJ
      const isCpf = document_code.length <= 11; // CPF has 11 digits, CNPJ has 14 digits
      const documentType = isCpf ? "cpf" : "cnpj";

      const response = await registerCustomer({
        name,
        [documentType]: document_code, // Use the appropriate document code
        email,
        password,
        newsletter,
        // Address is already an object
        address,
        utm_source:
          utmParamsCurrentSession?.utm_source ??
          utmParamsFirstSession?.utm_source ??
          referrer ??
          "",
        utm_medium:
          utmParamsCurrentSession?.utm_medium ??
          utmParamsFirstSession?.utm_medium ??
          "",
        utm_campaign:
          utmParamsCurrentSession?.utm_campaign ??
          utmParamsFirstSession?.utm_campaign ??
          "",
        utm_term:
          utmParamsCurrentSession?.utm_term ??
          utmParamsFirstSession?.utm_term ??
          "",
        utm_content:
          utmParamsCurrentSession?.utm_content ??
          utmParamsFirstSession?.utm_content ??
          "",
        referrer: referrer ?? "",
        cart_id: cart?.id,
        seller_id: sellerId ?? undefined,
        phone,
      });

      if (response.message) {
        ToastError({
          title: "Cadastro de usuário",
          description: response.message,
        });
        return;
      }

      if (response.user) {
        // GTM login event
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "sign_up",
          method: "Email",
          userEmail: data.email, // or any other relevant information
          userId: response.user.id,
          role: response.user.role,
          utm_source:
            utmParamsCurrentSession?.utm_source ??
            utmParamsFirstSession?.utm_source ??
            referrer ??
            "",
          utm_medium:
            utmParamsCurrentSession?.utm_medium ??
            utmParamsFirstSession?.utm_medium ??
            "",
          utm_campaign:
            utmParamsCurrentSession?.utm_campaign ??
            utmParamsFirstSession?.utm_campaign ??
            "",
          utm_term:
            utmParamsCurrentSession?.utm_term ??
            utmParamsFirstSession?.utm_term ??
            "",
          utm_content:
            utmParamsCurrentSession?.utm_content ??
            utmParamsFirstSession?.utm_content ??
            "",
          referrer,
        });

        reset();
        router.push("/sign-in");
        ToastSuccess({
          title: "Cadastro de usuário",
          description: "Cadastro realizado com sucesso!",
        });
      }
    } catch (error) {
      // Log any errors during form submission
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const name = watch("name");
  const email = watch("email");
  const document_code = watch("document_code");
  const password = watch("password");
  const password_confirmation = watch("password_confirmation");
  // Address fields for validation
  const address = watch("address");

  const isSubmitDisable =
    !name ||
    !email ||
    !document_code ||
    !password ||
    !password_confirmation ||
    password !== password_confirmation ||
    // Address validation
    !address.zip_code ||
    !address.country ||
    !address.state ||
    !address.city ||
    !address.street ||
    !address.number ||
    isLoading;

  return (
    <>
      <SignUpFormHeader />
      <form
        id="register_customer"
        onSubmit={handleSubmit(handleNewSignUp)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1 gap-5">
            <div className="md:pt-0 pt-10">
              <h3 className="flex justify-center items-center font-base text-base text-zinc-600 dark:text-zinc-100 uppercase">
                Empresa
              </h3>
              <Divider value="" />
            </div>

            {/* document_code */}
            <Controller
              name="document_code"
              control={control}
              defaultValue="" // Ensure it starts controlled
              render={({ field }) => (
                <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
                  <label
                    htmlFor="document_code"
                    className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
                  >
                    CNPJ
                    {errors.document_code && (
                      <span className="text-sm font-base text-red-500 dark:text-red-500">
                        {errors.document_code.message}
                      </span>
                    )}
                  </label>
                  <div className="flex gap-3">
                    <Input.Root className="bg-white">
                      <Input.Control
                        id="document_code"
                        type="text"
                        placeholder="00.000.000/0000-00"
                        required
                        value={
                          field.value ? formatDocumentCode(field.value) : ""
                        } // Ensure it's formatted but never undefined
                        onChange={(e) => {
                          const rawValue = removeSpecialCharacters(
                            e.target.value,
                          ); // Clean input
                          field.onChange(rawValue); // Update form state with clean value
                        }}
                      />
                    </Input.Root>
                  </div>
                </div>
              )}
            />
            {/* names */}
            <div className="grid gap-3 pt-5 lg:grid-cols-form">
              <label
                htmlFor="name"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                Razão Social
                {errors.name && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.name.message}
                  </span>
                )}
              </label>

              <div className="flex gap-3">
                <Input.Root className="bg-white">
                  <Input.Control
                    id="name"
                    type="string"
                    placeholder="Razão social da empresa"
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
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                E-mail
                {errors.email && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </label>
              <div className="flex gap-3">
                <Input.Root className="bg-white">
                  <Input.Prefix>
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </Input.Prefix>
                  <Input.Control
                    id="email"
                    type="text"
                    placeholder="seu@email.com.br"
                    required
                    {...register("email")}
                  />
                </Input.Root>
              </div>
            </div>

            <div className="grid gap-3 pt-5 lg:grid-cols-form">
              <label
                htmlFor="address.city"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                Número de telefone
                {errors.address?.city && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.city.message}
                  </span>
                )}
                {errors.address?.state && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.state.message}
                  </span>
                )}
              </label>
              <div className="grid grid-cols-4 gap-6">
                <Input.Root className="bg-white col-span-1">
                  <Input.Control
                    id="phone.ddd_code"
                    type="string"
                    placeholder="DDD"
                    required
                    {...register("phone.ddd_code")}
                  />
                </Input.Root>
                <Input.Root className="bg-white col-span-3">
                  <Input.Control
                    id="phone.number"
                    type="string"
                    placeholder="Número de telefone"
                    required
                    {...register("phone.number")}
                  />
                </Input.Root>
              </div>
            </div>

            {/* password */}
            <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
              <label
                htmlFor="password"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                Senha de acesso
                {errors.password && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.password.message}
                  </span>
                )}
                {errors.password_confirmation && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.password_confirmation.message}
                  </span>
                )}
              </label>
              <Input.Root className="bg-white">
                <Input.Control
                  id="password"
                  type="password"
                  placeholder="Senha de acesso"
                  required
                  {...register("password")}
                />
              </Input.Root>
              <Input.Root className="bg-white">
                <Input.Control
                  id="password_confirmation"
                  type="password"
                  placeholder="Confirmação de senha"
                  required
                  {...register("password_confirmation")}
                />
              </Input.Root>
            </div>
          </div>
          <div className="md:col-span-1 gap-5">
            {/* Address Section Header */}
            <div className="md:pt-0 pt-10">
              <h3 className="flex justify-center items-center font-base text-base text-zinc-600 dark:text-zinc-100 uppercase">
                Endereço
              </h3>
              <Divider value="" />
            </div>

            {/* zip_code */}
            <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
              <label
                htmlFor="address.zip_code"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                CEP
                {errors.address?.zip_code && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.zip_code.message}
                  </span>
                )}
              </label>
              <div className="flex gap-3">
                <Input.Root className="bg-white">
                  <Input.Control
                    id="address.zip_code"
                    type="text"
                    placeholder="Exemplo: 01149-130"
                    required
                    {...register("address.zip_code")}
                  />
                </Input.Root>
              </div>
            </div>

            {/* street and number */}
            <div className="grid gap-3 pt-5 lg:grid-cols-form">
              <label
                htmlFor="address.street"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                Endereço
                {errors.address?.street && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.street.message}
                  </span>
                )}
                {errors.address?.number && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.number.message}
                  </span>
                )}
              </label>
              <div className="grid grid-cols-10 gap-6">
                <Input.Root className="col-span-8 bg-white">
                  <Input.Control
                    id="address.street"
                    type="string"
                    placeholder="Nome da rua"
                    required
                    {...register("address.street")}
                  />
                </Input.Root>
                <Input.Root className="col-span-2 bg-white">
                  <Input.Control
                    id="address.number"
                    type="number"
                    placeholder="Número"
                    required
                    {...register("address.number")}
                  />
                </Input.Root>
              </div>
            </div>

            {/* complements */}
            <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
              <label
                htmlFor="address.complement"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                Complementos
                {errors.address?.complement && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.complement.message}
                  </span>
                )}
              </label>
              <div className="grid grid-cols gap-6">
                <Input.Root className="bg-white">
                  <Input.Control
                    id="address.complement"
                    type="text"
                    placeholder="Exemplo: Apartamento 1405"
                    {...register("address.complement")}
                  />
                </Input.Root>
              </div>
            </div>

            {/* neighborhood */}
            <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
              <label
                htmlFor="address.neighborhood"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                Bairro
                {errors.address?.neighborhood && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.neighborhood.message}
                  </span>
                )}
              </label>
              <div className="flex gap-3">
                <Input.Root className="bg-white">
                  <Input.Control
                    id="address.neighborhood"
                    type="text"
                    placeholder="Exemplo: Vila Mariana"
                    required
                    {...register("address.neighborhood")}
                  />
                </Input.Root>
              </div>
            </div>

            {/* country */}
            <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
              <label
                htmlFor="address.country"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                País
                {errors.address?.country && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.country.message}
                  </span>
                )}
              </label>
              <div className="flex gap-3">
                <Input.Root className="bg-white">
                  <Input.Control
                    id="address.country"
                    type="text"
                    placeholder="Exemplo: Brasil"
                    required
                    {...register("address.country")}
                  />
                </Input.Root>
              </div>
            </div>

            {/* city and state */}
            <div className="grid gap-3 pt-5 lg:grid-cols-form">
              <label
                htmlFor="address.city"
                className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
              >
                Cidade e Estado
                {errors.address?.city && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.city.message}
                  </span>
                )}
                {errors.address?.state && (
                  <span className="text-sm font-base text-red-500 dark:text-red-500">
                    {errors.address.state.message}
                  </span>
                )}
              </label>

              <div className="grid grid-cols-2 gap-6">
                <Input.Root className="bg-white">
                  <Input.Control
                    id="address.city"
                    type="string"
                    placeholder="Cidade"
                    required
                    {...register("address.city")}
                  />
                </Input.Root>
                <Input.Root className="bg-white">
                  <Input.Control
                    id="address.state"
                    type="string"
                    placeholder="Estado"
                    required
                    {...register("address.state")}
                  />
                </Input.Root>
              </div>
            </div>
          </div>
        </div>

        {/* newsletter */}
        <div className="gap-3 pt-5 grid grid-cols-5">
          <label
            htmlFor="newsletter"
            className="text-xs font-small text-zinc-700 dark:text-zinc-100 col-span-4 flex items-center"
          >
            Receba nossos lançamentos e promoções
          </label>

          <div className="flex col-span-1 justify-end">
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
          <BackToSignInPageButton isLoading={isLoading} />
          <Button
            type="submit"
            form="register_customer"
            disabled={isSubmitDisable}
            className="rounded-none bg-green-700 px-4 py-2 text-base font-base uppercase text-white shadow-sm hover:bg-green-500 flex items-center justify-center min-w-[100px]"
          >
            {isLoading ? <LoadingCircleAnimation /> : "Cadastrar"}
          </Button>
        </div>
      </form>
    </>
  );
}
