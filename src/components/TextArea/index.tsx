import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type TextareaProps = ComponentProps<'textarea'>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    return (
      <textarea
        ref={ref}
        className={twMerge(
          'flex min-h-[120px] w-full resize-y items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 font-base text-base placeholder:uppercase',
          'focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-100 dark:focus-visible:border-gray-500 dark:focus-visible:ring-gray-500/10',
          props.className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'
