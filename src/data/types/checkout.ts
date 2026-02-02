import { NewOrderFormData } from '@/components/Forms/Checkout/CreditCard'

export interface CheckoutBody extends Omit<NewOrderFormData, 'payment'> {
  payment: {
    payment_method: string
    payment_installments: number
    customer?: {
      name: string
      cpf?: string
      cnpj?: string
    }
    card?: {
      card_token?: string
      brand?: string
      number: string
      holder_name: string
      exp_month: number
      exp_year: number
      cvv: string
    }
    boleto?: {
      instructions: string
      due_at: Date
      nosso_numero: string
      type: string
      document_number: string
    }
  }
}
