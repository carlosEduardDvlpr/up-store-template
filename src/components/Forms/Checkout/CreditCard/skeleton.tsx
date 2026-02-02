export function CreditCardSkeleton() {
  return (
    <div className="mt-6 flex w-full flex-col gap-5 divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-100">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md mb-4">
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">
          Informações necessárias
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Para completar seu pedido, você precisará fornecer as seguintes
          informações:
        </p>
        <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 list-disc pl-5 space-y-1">
          <li>Nome do titular do cartão</li>
          <li>Número do cartão de crédito</li>
          <li>Data de validade (mês e ano)</li>
          <li>Código de segurança (CVV)</li>
        </ul>
      </div>

      <div className="grid grid-cols-12 gap-x-4 gap-y-6">
        {/* Titular do Cartão Skeleton */}
        <div className="col-span-full">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Número do Cartão Skeleton */}
        <div className="col-span-full">
          <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Data de Validade Skeleton */}
        <div className="col-span-4 sm:col-span-4">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="col-span-4 sm:col-span-4">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* CVV Skeleton */}
        <div className="col-span-4 sm:col-span-4">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Checkbox Skeleton */}
      <div className="mt-6 flex space-x-2 pt-6">
        <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Button Skeleton */}
      <div className="mt-6 pt-6">
        <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Security Info Skeleton */}
      <div className="mt-6 pt-6 flex justify-center">
        <div className="h-5 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
