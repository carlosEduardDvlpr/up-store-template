import { InputHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type ControlProps = InputHTMLAttributes<HTMLInputElement>

const Control = forwardRef<HTMLInputElement, ControlProps>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className={twMerge(
        'flex-1 border-0 bg-transparent p-0 text-base font-base text-zinc-900 placeholder-zinc-600 outline-none focus:ring-0 dark:text-zinc-100 dark:placeholder-zinc-400',
        props.className,
      )}
    />
  )
})

Control.displayName = 'Control'

export { Control }
