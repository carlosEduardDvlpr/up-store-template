import { toast } from '@/hooks/use-toast'
// import { ToastAction } from '../ui/toast'

interface ToastErrorProps {
  title: string
  role?: 'admin' | 'customer'
  description: string
  jsonError?: string
}

export function ToastError({
  title,
  description,
  jsonError,
  role,
}: ToastErrorProps) {
  const toastInstance = toast({
    variant: 'destructive',
    title,
    description: role && role === 'admin' ? jsonError : description,
    duration: 2000,
    onClick: () => {
      toastInstance.dismiss()
    },
  })
}
