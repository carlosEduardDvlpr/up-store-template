import { SliderImage } from '@/clients/database/get-active-slider'
import Image from 'next/image'

export interface BannerImageProps {
  image: SliderImage
}

export function BannerImage({ image }: BannerImageProps) {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          width={2716}
          height={1600}
          src={image.file_key}
          alt={image.file_key}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col sm:hidden"
      >
        <Image
          width={2716}
          height={1600}
          src={image.file_key}
          alt={image.file_key}
          className="h-full w-full object-cover object-center"
        />
      </div>
    </>
  )
}
