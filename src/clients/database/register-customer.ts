import { http } from "@/clients/http";
import { User } from "@/data/types/user";

interface RegisterUserProps {
  name: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  birth_date?: string;
  gender?: string;
  email: string;
  password: string;
  newsletter?: boolean;
  utm_campaign: string;
  utm_source: string;
  utm_medium: string;
  utm_content: string;
  utm_term: string;
  referrer: string;
  cart_id?: string;
  seller_id?: string;
  address?: {
    street: string;
    number: number;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  phone?: {
    ddd_code: string;
    number: string;
  };
}
interface RegisterResponse {
  message?: string;
  user?: User;
}

export async function registerCustomer(
  body: RegisterUserProps,
): Promise<RegisterResponse> {
  try {
    const response = await http<RegisterResponse>(
      "/api/customers/registrations",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    const { user } = response;
    return { user };
  } catch (err: any) {
    if (err?.body) {
      console.log("Erro cadastro");
      console.log(err);
      if (typeof err.body === "string") {
        return { message: err.body };
      }

      if (typeof err.body === "object") {
        return {
          message:
            err.body.message ?? err.body.error ?? "Erro ao registrar usuário",
        };
      }
    }
    console.log(err);
    return { message: "Documento CNPJ/CPF ou e-mail já cadastrado." };
  }
}
