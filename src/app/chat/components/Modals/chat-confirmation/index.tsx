import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog'

type ConfirmVariant = 'exit' | 'danger' | 'action'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  variant?: ConfirmVariant
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'action',
}: ConfirmModalProps) {
  let confirmButtonText: string
  let confirmButtonClasses: string

  switch (variant) {
    case 'exit':
      confirmButtonText = 'Sair'
      confirmButtonClasses = 'bg-gray-600 hover:bg-gray-700 text-white'
      break
    case 'danger':
      confirmButtonText = 'Delete'
      confirmButtonClasses = 'bg-red-600 hover:bg-red-700 text-white'
      break
    default:
      // "action"
      confirmButtonText = 'Confirm'
      confirmButtonClasses = 'bg-gray-600 hover:bg-gray-700 text-white'
      break
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[320px] rounded-2xl border-0 bg-white/90 backdrop-blur-sm p-0 shadow-xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-gray-700">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-2 p-2">
          <Button
            onClick={onConfirm}
            className={`w-full rounded-xl h-11 ${confirmButtonClasses}`}
          >
            {confirmButtonText}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full border-gray-200 hover:bg-gray-50 hover:text-gray-900 rounded-xl h-11"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
