import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

interface ToastDecreaseCartItemProps {
  title: string
  color: string
  size: string
  image: string
}

export function ToastDecreaseCartItem({
  title,
  image,
}: ToastDecreaseCartItemProps) {
  const toastInstance = toast({
    variant: 'destructive',
    title: 'Reduzido do carrinho',
    description: (
      <div className="max-h-24 w-auto grid grid-cols-6 bg-[#fef2f3] rounded-none mt-1">
        {image ? (
          <Image
            height={300}
            width={200}
            src={image}
            alt={title}
            className="max-h-20 w-auto rounded-none shadow-md"
            style={{ aspectRatio: '3/4' }}
          />
        ) : (
          <ImageIcon className="max-h-20 w-full object-cover rounded-none shadow-md" />
        )}
        <div className="col-span-5 flex flex-col justify-center bg-[#fef2f3] text-[#46090c] pl-2">
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
