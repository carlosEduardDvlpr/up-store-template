"use client";

import Link from "next/link";
import { AlertCircle, Mail, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccountExistsSection() {
  const handleSendPasswordReset = async () => {
    // TODO: Implement password reset email logic
    console.log("Sending password reset email...");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-0">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Usuário já cadastrado
          </CardTitle>
          <CardDescription>
            Uma conta com este e-mail ou código de documento já está registrada
            em nosso sistema.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Caso não tenha configurado ou esquecido a senha clique no botão
              abaixo. Caso contrário prossiga com o login.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={handleSendPasswordReset}
              className="w-full"
              variant="default"
            >
              <Mail className="mr-2 h-4 w-4" />
              Solicitar troca de senha por E-mail.
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Realizar o Login
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Precisa de ajuda?{" "}
              <Link
                href="/support"
                className="font-medium text-primary hover:underline"
              >
                Contate o Suporte
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

