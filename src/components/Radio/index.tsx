'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type RadioProps = {
  name: string
  items: { value: string; name: string; description: string; price: string }[]
  value: string | null
  onChange: (value: string) => void
}

export function RadioGroup({ name, items, value, onChange }: RadioProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (selectedValue: string) => {
    onChange(selectedValue)

    // Update URL without scrolling
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, selectedValue)
    router.replace(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-4 mt-6">
      {items.map((item) => (
        <div
          key={item.value}
          className="relative flex justify-between items-center cursor-pointer rounded-lg border bg-white mt-4 px-6 py-4 shadow-sm focus:outline-none"
          onClick={() => handleChange(item.value)}
        >
          <input
            name={name}
            type="radio"
            value={item.value}
            id={name + item.value}
            checked={value === item.value}
            onChange={(e) => handleChange(e.target.value)}
          />
          <label
            htmlFor={name + item.value}
            className="flex flex-col text-end w-full cursor-pointer text-base font-base uppercase"
          >
            {item.name}
            <span className="text-gray-500 font-base uppercase block sm:inline mt-2 text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
              {item.description}
            </span>
          </label>
        </div>
      ))}
    </div>
  )
}
