export default function PaymentsPage() {
  return (
    <div className="col col-span-1 w-full">
      {/* Header */}
      <div className="flex w-full h-40 bg-gray-200 p-2 items-center justify-left pl-4 text-4xl font-base lg:justify-center lg:items-center lg:h-60 uppercase">
        <h1>Pagamento</h1>
      </div>

      {/* Content */}
      <div className="py-10 px-4 lg:px-40 lg:py-20 lg:mx-96 text-sm font-base space-y-4 leading-loose">
        <InfoCard title="Formas de pagamento">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>PIX</strong> (10% de desconto)
            </li>
            <li>
              <strong>VISA, MASTER, ELO, HIPER, AMEX</strong> (em até 5x,
              parcela mínima de R$ 200,00)
            </li>
          </ul>
        </InfoCard>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 lg:p-6">
      <h2 className="text-base lg:text-lg font-medium text-gray-900">
        {title}
      </h2>
      <div className="mt-3 space-y-2 text-gray-700">{children}</div>
    </section>
  );
}
