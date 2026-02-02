import { getOrder } from "@/lib/database";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import dznesLogo from "@/../public/logo.svg";
import { Suspense } from "react";
import { groupOrderItemsByProductName } from "@/lib/product-helpers";
import { OrderItemsSummary } from "@/components/Checkout/order-items-summary";

interface ParamOrderProps {
  params: Promise<{
    orderId: string;
  }>;
}

function formatDateTime(value?: string | Date | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function OrderCompletePage(props: ParamOrderProps) {
  const params = await props.params;
  const { order } = await getOrder(params.orderId);
  const items = order ? order.order_items : [];
  const groupedItems = groupOrderItemsByProductName(items);

  return (
    <main className="relative lg:min-h-full">
      <Suspense>
        <div className="flex flex-col justify-start items-start pt-4 px-6 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:py-4 xl:py-6 pb-10">
          <Image
            width={900}
            height={1200}
            src={dznesLogo}
            alt="TODO"
            className="mx-auto h-32 w-96 mb-10"
          />
          <p className="mt-2 text-3xl font-thin tracking-tight text-gray-900 uppercase">
            Pedido solicitado com sucesso!
          </p>
          <p className="mt-6 text-lg font-thin text-gray-500">
            Seu pedido foi enviado para nossa equipe. Em breve uma de nossas
            vendedoras vai entrar em contato para prosseguir com o seu pedido,
            sinta-se livre para chamar sua vendedora favorita.
          </p>
          <div className="mt-10 text-sm font-thin">
            <h2 className="text-gray-900 font-thin text-xl uppercase">
              Código do Pedido
            </h2>
            <div className="mt-2 font-thin text-gray-500">{order?.code}</div>
          </div>
          <div className="mt-10">
            <h2 className="font-thin text-gray-900 text-xl uppercase">
              Vendedora
            </h2>
            <div className="mt-2">
              <address className="not-italic font-thin text-md text-gray-500">
                <span className="block">
                  {order?.seller_id ?? "Não informado"}
                </span>
              </address>
            </div>
          </div>
          <div className="lg:flex lg:flex-row lg:row-span-2 lg:space-x-4">
            <div className="mt-10">
              <h2 className="font-thin text-gray-900 text-xl uppercase">
                Endereço de entrega
              </h2>
              <div className="mt-2">
                <address className="not-italic font-thin text-md text-gray-500">
                  <span className="block">{order?.user.name}</span>
                  <span className="block">{`${order?.shipping_address?.street}, ${order?.shipping_address?.number}`}</span>
                  <span className="block">{`${order?.shipping_address?.state}, ${order?.shipping_address?.city}`}</span>
                </address>
              </div>
            </div>
            <div className="mt-10">
              <h2 className="font-thin text-gray-900 text-xl uppercase">
                Forma de Envio
              </h2>
              <div className="mt-2">
                <address className="not-italic font-thin text-md text-gray-500">
                  <span className="block">
                    {order.shipping_company_code &&
                      order.shipping_company_code === "PICKUP"
                      ? "Coleta na loja"
                      : "Correios"}
                  </span>
                  <span className="block text-md font-normal text-gray-900">
                    {formatDateTime(order.arrival_date) ?? (
                      <span className="text-gray-400 italic">
                        Não informado
                      </span>
                    )}
                  </span>

                  <span className="block">{`Obervações: ${order?.shipping_observations}`}</span>
                </address>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="mx-auto mb-4 max-w-2xl pb-2 px-4 pt-4 md:pt-0 md:px-0 lg:grid lg:max-w-[96vw] lg:grid-cols-2">
            <div className="lg:col-start-2">
              <p className="border-t border-x lg:border-0 py-4 px-2 text-2xl font-thin tracking-tight text-gray-900 uppercase">
                Produtos do pedido
              </p>
              <div
                className="
    border border-gray-200/70
    bg-white
    shadow-sm
    max-h-[56vh]
    overflow-y-auto overflow-x-hidden
    overscroll-contain
    [scrollbar-gutter:stable]
    [-webkit-overflow-scrolling:touch]
    transition-shadow
    duration-200
    hover:shadow-md
  "
              >
                <OrderItemsSummary groupedItems={groupedItems} />
              </div>

              <dl className="space-y-6 border-t border-gray-200 pt-6 text-lg font-thin uppercase text-gray-500">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="text-gray-900">
                    {formatCurrency(order?.total_items ?? 0)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Frete</dt>
                  <dd className="text-gray-900">
                    {formatCurrency(order?.freight_value ?? 0)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Desconto</dt>
                  <dd className="text-gray-900">
                    {formatCurrency(order?.discount_value ?? 0)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <dt className="text-2xl">Total</dt>
                  <dd className="text-2xl">
                    {formatCurrency(order?.total_value ?? 0)}
                  </dd>
                </div>
              </dl>
              <dl className="grid grid-cols-2 gap-x-4 text-sm text-gray-600 font-thin">
                {order.transactions && order.transactions.length > 0 ? (
                  <div>
                    <dt className="font-thin text-gray-900 text-2xl uppercase">
                      Informações do pagamento
                    </dt>
                    {order.transactions[0].payment_type === "credit_card" ? (
                      <dd className="mt-2 space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                        <div className="flex-none">
                          <svg
                            aria-hidden="true"
                            width={36}
                            height={24}
                            viewBox="0 0 36 24"
                            className="h-6 w-auto"
                          >
                            <rect
                              width={36}
                              height={24}
                              rx={4}
                              fill="#224DBA"
                            />
                            <path
                              d="M10.925 15.673H8.874l-1.538-6c-.073-.276-.228-.52-.456-.635A6.575 6.575 0 005 8.403v-.231h3.304c.456 0 .798.347.855.75l.798 4.328 2.05-5.078h1.994l-3.076 7.5zm4.216 0h-1.937L14.8 8.172h1.937l-1.595 7.5zm4.101-5.422c.057-.404.399-.635.798-.635a3.54 3.54 0 011.88.346l.342-1.615A4.808 4.808 0 0020.496 8c-1.88 0-3.248 1.039-3.248 2.481 0 1.097.969 1.673 1.653 2.02.74.346 1.025.577.968.923 0 .519-.57.75-1.139.75a4.795 4.795 0 01-1.994-.462l-.342 1.616a5.48 5.48 0 002.108.404c2.108.057 3.418-.981 3.418-2.539 0-1.962-2.678-2.077-2.678-2.942zm9.457 5.422L27.16 8.172h-1.652a.858.858 0 00-.798.577l-2.848 6.924h1.994l.398-1.096h2.45l.228 1.096h1.766zm-2.905-5.482l.57 2.827h-1.596l1.026-2.827z"
                              fill="#fff"
                            />
                          </svg>
                          <p className="sr-only">Visa</p>
                        </div>
                        <div className="flex-auto">
                          <p className="text-gray-900">Ending with 4242</p>
                          <p>Expires 12 / 21</p>
                        </div>
                      </dd>
                    ) : (
                      <dd className="mt-2 space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
                        <div className="flex-none">
                          <p>Boleto</p>
                        </div>
                        <div className="flex-auto">
                          <p className="text-gray-900">
                            Link: {order.transactions[0].boleto_url ?? ""}
                          </p>
                          <p>Código: {order.transactions[0].line_code ?? ""}</p>
                        </div>
                      </dd>
                    )}
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
