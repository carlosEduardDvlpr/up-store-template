import { cn } from '@/lib/utils'

interface Step {
  number: number
  title: string
  description: string
}

interface StepsProps {
  currentStep: number
  steps: Step[]
}

export function Steps({ currentStep, steps }: StepsProps) {
  return (
    <div className="w-full max-w-lg mx-auto px-4 pt-8">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step) => (
            <li key={step.number} className="md:flex-1">
              <div
                className={cn(
                  'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                  step.number <= currentStep
                    ? 'border-gray-600'
                    : 'border-gray-200',
                )}
              >
                <span
                  className={cn(
                    'text-sm font-base uppercase',
                    step.number <= currentStep
                      ? 'text-gray-900'
                      : 'text-gray-500',
                  )}
                >
                  <span className="font-bold mr-1">{step.number}.</span>
                  {step.title}
                </span>
                <span className="text-sm font-base text-gray-500">
                  {step.description}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
