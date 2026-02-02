import Image from 'next/image'
import dznesLogo from '@/../public/logo.svg'
import { UpdatePasswordForm } from '@/components/Forms/UpdatePassword'
import { validateResetPasswordToken } from '@/lib/database'
import Link from 'next/link'

interface ParamsProps {
  params: Promise<{
    id: string
  }>
}

export default async function UpdatePasswordPage(props: ParamsProps) {
  const params = await props.params;
  const { user_id } = await validateResetPasswordToken(params.id)

  if (!user_id) {
    return (
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            className="mx-auto h-24 w-auto"
            src={dznesLogo}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Alteração de senha
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border border-gray-200 rounded-lg p-4 shadow-lg">
          <p className="mt-2 text-center text-sm text-gray-500">
            Link inválido ou expirado, solicite um novo link de alteração de
            senha.
          </p>

          <div className="text-sm text-center mt-10 rounded-md p-2 bg-gray-600 px-3 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
            <Link href="/forgot-password">Gerar novo link</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-24 w-auto"
          src={dznesLogo}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Alteração de senha
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border border-gray-200 rounded-lg p-4 shadow-lg">
        <UpdatePasswordForm user_id={user_id} token_id={params.id} />

        <p className="mt-2 text-center text-sm text-gray-500">
          Atualizar senha de acesso.
        </p>
      </div>
    </div>
  )
}
