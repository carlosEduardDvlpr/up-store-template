export default function PrivicyAndPolicyPage() {
  return (
    <div className="col col-span-1 w-full">
      {/* Header */}
      <div className="flex w-full h-40 bg-gray-200 p-2 items-center justify-left pl-4 text-4xl font-base lg:justify-center lg:items-center lg:h-60 uppercase">
        <h1>Privacidade e Política</h1>
      </div>

      {/* Content */}
      <div className="py-10 px-4 lg:px-40 lg:py-20 lg:mx-96 text-sm font-base space-y-4 leading-loose">
        <InfoCard title="Privacidade">
          <p>
            A CONFECCOES KALLI LTDA, inscrita no CNPJ/MF sob o número
            17.685.729/0001-08, (“Kalli Fashion”, “Kalli”) respeita sua
            privacidade e protege seus dados pessoais.
          </p>
          <p>
            Ao usar nosso site, catálogo, WhatsApp, redes sociais ou realizar um
            pedido, você concorda com esta Política de Privacidade.
          </p>
        </InfoCard>

        <InfoCard title="Uso, cadastro e dados">
          <p>
            A Kalli é destinada a pessoas maiores de 18 anos, lojistas,
            revendedores e compradores no atacado.
          </p>
          <p>O cadastro pode ser feito com CNPJ do ramo de vestuário ou CPF.</p>
          <p>
            Ao informar seus dados, você declara que são verdadeiros e que pode
            contratar.
          </p>
          <p>
            Podemos coletar nome, CPF e/ou CNPJ, razão social, endereço,
            telefone, WhatsApp, e-mail, dados de pagamento, histórico de pedidos
            e dados de navegação, como IP, cookies e origem de tráfego.
          </p>
          <p>
            Esses dados são usados para criar e gerenciar seu cadastro,
            processar pedidos, emitir notas fiscais, organizar entregas,
            realizar atendimento, enviar informações sobre pedidos, lançamentos
            e campanhas, cumprir obrigações legais e melhorar nossos anúncios e
            comunicações.
          </p>
        </InfoCard>

        <InfoCard title="WhatsApp e comunicações">
          <p>
            Ao informar seu número, você autoriza a Kalli a entrar em contato
            por WhatsApp para atendimento, envio de catálogo, pedidos e
            campanhas.
          </p>
          <p>
            Você pode pedir para parar de receber mensagens promocionais a
            qualquer momento.
          </p>
        </InfoCard>

        <InfoCard title="Pagamentos">
          <p>A Kalli não armazena dados de cartão.</p>
          <p>
            Os pagamentos são processados pelas operadoras e plataformas de
            pagamento.
          </p>
          <p>Recebemos apenas a confirmação do pagamento.</p>
        </InfoCard>

        <InfoCard title="E-mail e marketing">
          <p>
            Seu e-mail pode ser usado para enviar lançamentos, novidades e
            campanhas.
          </p>
          <p>
            Também utilizamos seu e-mail para enviar informações sobre seus
            pedidos, como confirmação de compra, status e envio.
          </p>
        </InfoCard>

        <InfoCard title="Compartilhamento de dados">
          <p>A Kalli não vende seus dados.</p>
          <p>
            Eles podem ser compartilhados apenas com empresas necessárias para o
            funcionamento do serviço, como pagamento, entrega, nota fiscal,
            anúncios, CRM, WhatsApp e tecnologia.
          </p>
        </InfoCard>

        <InfoCard title="Armazenamento">
          <p>
            Seus dados ficam armazenados em servidores próprios ou de parceiros.
          </p>
          <p>
            Eles são mantidos enquanto houver relação comercial ou exigência
            legal.
          </p>
        </InfoCard>

        <InfoCard title="Cookies e anúncios">
          <p>
            Usamos cookies para medir acessos, melhorar anúncios e campanhas.
          </p>
          <p>
            Você pode desativá-los no navegador, mas isso pode limitar algumas
            funções.
          </p>
        </InfoCard>

        <InfoCard title="Segurança">
          <p>Usamos medidas de segurança para proteger seus dados.</p>
          <p>
            Mesmo assim, é importante que você também proteja seus dispositivos
            e senhas.
          </p>
        </InfoCard>

        <InfoCard title="Alterações">
          <p>Esta política pode ser atualizada a qualquer momento.</p>
          <p>
            A versão válida será sempre a publicada nos canais oficiais da
            Kalli.
          </p>
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
