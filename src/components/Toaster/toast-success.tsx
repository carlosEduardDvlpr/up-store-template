import { toast } from '@/hooks/use-toast'
// import { ToastAction } from '../ui/toast'

interface ToastSuccessProps {
  title: string
  description: string
}

export function ToastSuccess({ title, description }: ToastSuccessProps) {
  const toastInstance = toast({
    variant: 'success',
    title,
    description,
    duration: 2000,
    onClick: () => {
      toastInstance.dismiss()
    },
  })
}
