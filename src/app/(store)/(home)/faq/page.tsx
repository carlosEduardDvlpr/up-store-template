export default function FaqPage() {
  return (
    <div className="col col-span-1 w-full">
      {/* Header */}
      <div className="flex w-full h-40 bg-gray-200 p-2 items-center justify-left pl-4 text-4xl font-base lg:justify-center lg:items-center lg:h-60 uppercase">
        <h1>Perguntas frequentes</h1>
      </div>

      {/* Content */}
      <div className="py-10 px-4 lg:px-40 lg:py-20 lg:mx-96 text-sm font-base space-y-4 leading-loose">
        <FaqItem title="Pedido mínimo?">
          <p>O pedido mínimo é de 12 peças, podendo ser variadas.</p>
        </FaqItem>

        <FaqItem title="Como é o processo de compra?">
          <ol className="list-decimal pl-5 space-y-1">
            <li>O cliente realiza o pedido</li>
            <li>A Kalli envia a confirmação do pedido</li>
            <li>Quando necessário, é solicitado um sinal de pagamento</li>
            <li>O pedido entra em separação</li>
            <li>Após a separação, o pedido é finalizado</li>
            <li>O cliente escolhe a forma de envio e realiza o pagamento</li>
            <li>O pagamento é aprovado</li>
            <li>O pedido é enviado ou liberado para retirada</li>
          </ol>
        </FaqItem>

        <FaqItem title="Quais tamanhos a Kalli trabalha?">
          <p>A Kalli Fashion trabalha com os tamanhos P (38) ao GG (44).</p>
        </FaqItem>

        <FaqItem title="Os produtos são fabricados no Brasil ou são importados?">
          <p>
            - Todos os produtos da Kalli são de fabricação própria no Brasil.
          </p>
        </FaqItem>

        <FaqItem title="Fiz pedido e não tem mais disponibilidade da peça">
          <p>O pedido só é garantido após a confirmação e separação.</p>
          <p>
            Produtos no carrinho ou no pedido ainda não separado podem ficar
            indisponíveis.
          </p>
        </FaqItem>

        <FaqItem title="Os tecidos encolhem?">
          <p>
            Tecidos de fibras naturais e artificiais como algodão, linho e
            viscose podem encolher após a primeira lavagem.
          </p>
          <p>Isso é uma característica normal desse tipo de fibra.</p>
          <p>
            Quando a lavagem é feita de forma incorreta (água quente, secadora,
            centrifugação forte), o encolhimento pode ser maior do que o
            esperado.
          </p>
          <p>
            Por isso, é essencial seguir as instruções da etiqueta de composição
            que fica dentro da peça.
          </p>
          <p>Não recomendamos o uso de secadora para esses tecidos.</p>
        </FaqItem>

        <FaqItem title="Como devo lavar minhas peças?">
          <p>
            Sempre siga as instruções da etiqueta de composição que fica dentro
            da sua roupa.
          </p>
          <p>Ela informa a forma correta de lavar, secar e passar.</p>
          <p>Além disso, recomendamos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Lavar as roupas separadas por cor
              <br />
              (cores escuras podem soltar tinta e manchar as claras,
              especialmente branco)
            </li>
            <li>
              Usar saco protetor de lavagem, para proteger o tecido e aumentar a
              durabilidade
            </li>
            <li>
              Evitar secadora, principalmente em peças de algodão, linho e
              viscose
            </li>
          </ul>
        </FaqItem>

        <FaqItem title="Como funciona a entrega dos pedidos?">
          <p>O custo de envio é sempre por conta do cliente.</p>
          <p>Você pode escolher a forma que for mais conveniente:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Correios (SEDEX e PAC)</li>
            <li>Transportadora de sua preferência (com coleta agendada)</li>
            <li>Retirada pelo próprio cliente</li>
            <li>Retirada por representante</li>
            <li>Motoboy do cliente</li>
            <li>Motoboy parceiro da Kalli</li>
            <li>
              Entrega: realizamos entregas em um raio de até 10 minutos a pé do
              nosso endereço, acima dessa distância, o custo do motoboy será
              cobrado do cliente.
            </li>
          </ul>
        </FaqItem>
      </div>
    </div>
  );
}

function FaqItem({
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
