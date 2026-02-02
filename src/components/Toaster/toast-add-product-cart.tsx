import { toast } from '@/hooks/use-toast'
import { ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ToastAddToCartProps {
  title: string
  color: string
  size: string
  image: string | null
}

export function ToastAddToCart({ title, image }: ToastAddToCartProps) {
  const toastInstance = toast({
    variant: 'success',
    title: 'Adicionado ao carrinho',
    description: (
      <div className="max-h-24 w-auto grid grid-cols-6 bg-[#f6fbf2] rounded-none mt-1">
        {image ? (
          <Image
            height={300}
            width={200}
            src={image}
            alt={title}
            className="max-h-24 w-full rounded-none shadow-md"
            style={{ aspectRatio: '3/4' }}
          />
        ) : (
          <ImageIcon className="max-h-24 w-full object-cover rounded-none shadow-md" />
        )}
        <div className="col-span-5 flex flex-col justify-center bg-[#f6fbf2] text-[#20472b] pl-2">
          <p className="text-xs text-gray-700 font-base">{title}</p>
        </div>
      </div>
    ),
    duration: 2000,
    onClick: () => {
      toastInstance.dismiss()
    },
  })
}
