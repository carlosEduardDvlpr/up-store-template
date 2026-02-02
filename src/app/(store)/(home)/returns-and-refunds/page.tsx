export default function ReturnsAndRefundsPage() {
  return (
    <div className="col col-span-1 w-full">
      {/* Header */}
      <div className="flex w-full h-40 bg-gray-200 p-2 items-center justify-left pl-4 text-4xl font-base lg:justify-center lg:items-center lg:h-60 uppercase">
        <h1>Trocas e devoluções</h1>
      </div>

      {/* Content */}
      <div className="py-10 px-4 lg:px-40 lg:py-20 lg:mx-96 text-sm font-base space-y-4 leading-loose">
        <PageTitle>TROCA E DEVOLUÇÃO</PageTitle>

        <InfoCard title="Devolução">
          <p>Solicitação em até 7 dias corridos após o recebimento.</p>
          <p>
            *Por se tratar de venda no atacado, a parte da compra que o cliente
            permanecer não pode ser inferior a 12 peças (pedido mínimo)
          </p>
        </InfoCard>

        <InfoCard title="Troca">
          <ul className="list-disc pl-5 space-y-1">
            <li>Solicitação em até 30 dias corridos.</li>
            <li>trocamos somente COR e TAMANHO.</li>
            <li>Não trocamos peças utilizadas, lavadas ou danificadas.</li>
            <li>Os fretes da troca por conta do cliente.</li>
            <li>
              Não nos responsabilizamos por danos na costura/tecido causados por
              mau uso ou escolha incorreta de tamanho
              <br />
              Atenção: produtos sem elastano não podem ser vestidos em numeração
              maior do que a indicada. Nesses casos, não será considerado
              defeito de fabricação.
            </li>
            <li>
              É normal ter encolhimento dos produtos de fibras naturais e
              artificiais como algodão, linho e viscose, após a 1ª lavagem.
            </li>
          </ul>
        </InfoCard>

        <InfoCard title="Estorno">
          <ul className="list-disc pl-5 space-y-1">
            <li>Cartão de Crédito: será solicitado ao banco em até 5 dias úteis.</li>
            <li>PIX/TED/DOC será realizado em até 7 dias úteis.</li>
            <li>
              Cancelamento do pedido da Mercadoria retornada ao remetente por
              motivo de Endereço Incorreto/Incompleto, Carteiro não atendido,
              Não Retirado, o valor do frete não será estornado.
            </li>
          </ul>
        </InfoCard>
      </div>
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 lg:px-6">
      <h2 className="text-base lg:text-lg font-medium text-gray-900">
        {children}
      </h2>
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
      <h2 className="text-base lg:text-lg font-medium text-gray-900">{title}</h2>
      <div className="mt-3 space-y-2 text-gray-700">{children}</div>
    </section>
  );
}

