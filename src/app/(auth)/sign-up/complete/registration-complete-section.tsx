"use client"

import Link from "next/link"
import { CheckCircle, Mail, Clock, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RegistrationCompleteSectionProps {
  email?: string
}

export default function RegistrationCompleteSection({
  email = "seu-email@exemplo.com",
}: RegistrationCompleteSectionProps) {
  const handleResendEmail = async () => {
    // TODO: Implement resend confirmation email logic
    console.log("Reenviando e-mail de confirmação...")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Cadastro Realizado com Sucesso!</CardTitle>
          <CardDescription className="text-base">
            Sua solicitação de cadastro foi enviada e está sendo processada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Mail className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Passo 1:</strong> Um e-mail de confirmação foi enviado para{" "}
                <span className="font-semibold">{email}</span>. Clique no link do e-mail para confirmar seu endereço.
              </AlertDescription>
            </Alert>

            <Alert className="border-orange-200 bg-orange-50">
              <Clock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Passo 2:</strong> Após a confirmação do e-mail, sua conta será enviada para avaliação pela nossa
                equipe para aprovação final.
              </AlertDescription>
            </Alert>

            <Alert className="border-purple-200 bg-purple-50">
              <Users className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Tempo de Análise:</strong> O processo de aprovação pode levar de 1 a 3 dias úteis. Você receberá
                um e-mail com o resultado da análise.
              </AlertDescription>
            </Alert>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Próximos Passos:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
              <li>Verifique sua caixa de entrada (e spam) para o e-mail de confirmação</li>
              <li>Clique no link de confirmação no e-mail recebido</li>
              <li>Aguarde a aprovação da nossa equipe</li>
              <li>Você receberá um e-mail quando sua conta for aprovada</li>
            </ol>
          </div>

          <div className="space-y-3">
            <Button onClick={handleResendEmail} variant="outline" className="w-full bg-transparent">
              <Mail className="mr-2 h-4 w-4" />
              Reenviar E-mail de Confirmação
            </Button>

            <Button asChild variant="default" className="w-full">
              <Link href="/login">Voltar para Login</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Não recebeu o e-mail ou tem dúvidas?{" "}
              <Link href="/support" className="font-medium text-primary hover:underline">
                Entre em Contato
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

