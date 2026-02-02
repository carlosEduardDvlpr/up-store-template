'use client'

import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'

import * as Input from '@/components/Input'
import { useRouter } from 'next/navigation'
import { updateUserPassword } from '@/lib/database'
import { ToastError } from '@/components/Toaster/toast-error'
import { ToastSuccess } from '@/components/Toaster/toast-success'

const updatePasswordFormSchema = zod
  .object({
    password: zod
      .string()
      .min(6, { message: 'Mínimo de 6 caracteres' })
      .max(50, { message: 'Máximo de 50 caracteres' }),
    password_confirmation: zod
      .string()
      .max(50, { message: 'Máximo de 50 caracteres' }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'As senhas não coincidem',
    path: ['password_confirmation'], // field that will receive the error
  })

type UpdatePasswordFormData = zod.infer<typeof updatePasswordFormSchema>

interface UpdatePasswordFormProps {
  user_id: string
  token_id: string
}

export function UpdatePasswordForm({
  user_id,
  token_id,
}: UpdatePasswordFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  })

  async function handleUpdatePassword(data: UpdatePasswordFormData) {
    setIsLoading(true)
    try {
      const { user, message } = await updateUserPassword({
        id: user_id,
        password: data.password,
        token_id,
      })

      if (message) {
        ToastError({
          title: 'Atualização de senha',
          description: message,
        })
        return
      }

      reset()
      ToastSuccess({
        title: 'Atualização de senha',
        description: 'Senha atualizada com sucesso',
      })

      // GTM login event
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'update-password',
        user_id: user.id,
        role: user.role,
      })

      router.push('/sign-in')
    } catch (error) {
      ToastError({
        title: 'Atualização de senha',
        description: 'Erro ao atualizar senha',
        jsonError: JSON.stringify(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6" id="update-password-form">
      {/* password */}
      <div className="flex flex-col gap-3 pt-5 lg:grid lg:grid-cols-form">
        <label
          htmlFor="password"
          className="flex flex-col text-sm font-base leading-relaxed text-zinc-700 dark:text-zinc-100 uppercase"
        >
          Senha de acesso
          <span className="text-sm font-base text-red-500 dark:text-red-500 min-h-[20px]">
            {errors.password?.message || '\u00A0'}
          </span>
        </label>
        <Input.Root className="bg-white">
          <Input.Control
            id="password"
            type="password"
            placeholder="Senha de acesso"
            required
            {...register('password')}
          />
        </Input.Root>
        {errors.password_confirmation && (
          <span className="text-sm font-base text-red-500 dark:text-red-500">
            {errors.password_confirmation.message}
          </span>
        )}
        <Input.Root className="bg-white">
          <Input.Control
            id="password_confirmation"
            type="password"
            placeholder="Confirmação de senha"
            required
            {...register('password_confirmation')}
          />
        </Input.Root>
      </div>

      <div>
        <button
          type="submit"
          form="update-password-form"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50"
          onClick={handleSubmit(handleUpdatePassword)}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processando...
            </>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
    </form>
  )
}
