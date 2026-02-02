import { ReactNode, HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface RootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Root(props: RootProps) {
  return (
    <div
      {...props}
      className={twMerge(
        'flex w-full items-center gap-2 rounded-none border px-3 py-2 shadow-sm outline-none dark:border-zinc-700 dark:bg-zinc-800',
        'focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-gray-200 dark:focus-within:border-gray-500 dark:focus-within:ring-gray-500/10',
        props.className,
      )}
    />
  )
}
