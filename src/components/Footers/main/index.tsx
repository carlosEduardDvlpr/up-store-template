import { WhatsAppIcon } from "@/components/Icons/whatsapp-icon";
import {
  COMPANY_INSTAGRAM,
  COMPANY_TELEPHONE_NUMBER,
  COMPANY_TELEPHONE_NUMBER_2,
  COMPANY_WHATSAPP_NUMBER,
  COMPANY_WHATSAPP_ASSISTANT,
  SAC_EMAIL,
  COMPANY_NAME,
  COMPANY_ADDRESS_STREET,
  COMPANY_ADDRESS_CITY,
  COMPANY_ADDRESS_STATE,
  COMPANY_ADDRESS_ZIP_CODE,
  COMPANY_CNPJ,
  COMPANY_COUNTRY,
  UP_LOGO_SVG,
  WHATSAPP_URL,
} from "@/data/constants";
import { removeNonNumericalChars } from "@/lib/utils";
import {
  BotIcon,
  Instagram,
  Mail,
  MapPinned,
  MessageCircleIcon,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MainFooter() {
  // Google maps configs
  const fullAddress = [
    COMPANY_ADDRESS_STREET,
    COMPANY_ADDRESS_CITY,
    COMPANY_ADDRESS_STATE,
    COMPANY_ADDRESS_ZIP_CODE,
    COMPANY_COUNTRY,
  ]
    .filter(Boolean)
    .join(", ");

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    fullAddress,
  )}`;

  return (
    <footer className="bg-background">
      <div className="bg-[#f5f5f5] py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-3xl font-light italic">A</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                Desde 2013, a Kalli é referência em moda feminina no atacado,
                trazendo para o mercado peças que unem elegância, qualidade e
                tendência. Criamos roupas pensadas para valorizar a mulher
                moderna e para acompanhar o ritmo da moda com sofisticação. Para
                lojistas, a Kalli é a parceira perfeita: nossas coleções ajudam
                a preencher a loja com peças que encantam suas clientes, com
                caimento impecável e estilo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* COMPANY INFO */}
            <div className="lg:col-span-1">
              <h3 className="text-xs font-medium tracking-wide uppercase mb-4">
                {COMPANY_NAME}
              </h3>

              <div className="space-y-4 text-xs font-light text-muted-foreground">
                <div>
                  <p className="text-foreground font-normal">Endereço</p>
                  <p>{COMPANY_ADDRESS_STREET}</p>
                  <p>
                    {COMPANY_ADDRESS_CITY} – {COMPANY_ADDRESS_STATE} • CEP{" "}
                    {COMPANY_ADDRESS_ZIP_CODE}
                  </p>
                  <Link
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block underline underline-offset-2 mt-1"
                  >
                    Ver no mapa
                  </Link>
                </div>

                <div>
                  <p className="text-foreground font-normal">
                    Horário de atendimento
                  </p>
                  <p>Segunda a Sexta, das 8:00 às 17:00</p>
                </div>
              </div>
            </div>

            {/* SOBRE */}
            <div>
              <h3 className="text-xs font-medium tracking-wide uppercase mb-4">
                Sobre
              </h3>
              <ul className="space-y-2 text-xs font-light text-muted-foreground">
                <li>
                  <Link href="/about-us">Quem Somos</Link>
                </li>
                <li>
                  <Link href="/faq">Perguntas Frequentes</Link>
                </li>
              </ul>
            </div>

            {/* MEUS DADOS */}
            <div>
              <h3 className="text-xs font-medium tracking-wide uppercase mb-4">
                Meus Dados
              </h3>
              <ul className="space-y-2 text-xs font-light text-muted-foreground">
                <li>
                  <Link href="/account/profile">Minha Conta</Link>
                </li>
                <li>
                  <Link href="/account/orders">Meus Pedidos</Link>
                </li>
              </ul>
            </div>

            {/* POLÍTICAS */}
            <div>
              <h3 className="text-xs font-medium tracking-wide uppercase mb-4">
                Políticas
              </h3>
              <ul className="space-y-2 text-xs font-light text-muted-foreground">
                <li>
                  <Link href="/returns-and-refunds">Trocas e Devoluções</Link>
                </li>
                <li>
                  <Link href="/shippings">Entrega e Frete</Link>
                </li>
                <li>
                  <Link href="/payments">Pagamento</Link>
                </li>
                <li>
                  <Link href="/privicy-and-policy">Privacidade e política</Link>
                </li>
              </ul>
            </div>

            {/* CONTATO */}
            <div>
              <h3 className="text-xs font-medium tracking-wide uppercase mb-4">
                Contato
              </h3>
              <ul className="space-y-2 text-xs font-light text-muted-foreground">
                <p className="text-foreground font-normal">Telefone</p>
                <li className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <Link
                    href={`tel:+${removeNonNumericalChars(
                      COMPANY_TELEPHONE_NUMBER,
                    )}`}
                    className="block underline underline-offset-2"
                  >
                    {COMPANY_TELEPHONE_NUMBER}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <Link
                    href={`tel:+${removeNonNumericalChars(
                      COMPANY_TELEPHONE_NUMBER_2,
                    )}`}
                    className="block underline underline-offset-2"
                  >
                    {COMPANY_TELEPHONE_NUMBER_2}
                  </Link>
                </li>

                <p className="text-foreground font-normal">Whatsapp</p>
                <li className="flex items-center gap-2">
                  <MessageCircleIcon className="h-3 w-3" /> Atendente
                  <Link
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {COMPANY_WHATSAPP_NUMBER}
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <BotIcon className="h-3 w-3" /> Assistente Virtual 24h
                  <Link
                    href={`https://wa.me/${removeNonNumericalChars(
                      COMPANY_WHATSAPP_ASSISTANT,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {COMPANY_WHATSAPP_NUMBER}
                  </Link>
                </li>
                <p className="text-foreground font-normal">E-mail</p>
                <li className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <Link href={`mailto:${SAC_EMAIL}`} className="break-all">
                    {SAC_EMAIL}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* SOCIAL BAR */}
          <div className="flex items-center justify-center gap-6 mb-8 pb-8 border-b border-border">
            <Link
              href={`https://instagram.com/${COMPANY_INSTAGRAM}`}
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href={WHATSAPP_URL} aria-label="WhatsApp">
              <WhatsAppIcon className="h-5 w-5" />
            </Link>
            <Link href={googleMapsUrl} aria-label="GoogleMaps">
              <MapPinned className="h-5 w-5" />
            </Link>
            <Link href={`mailto:${SAC_EMAIL}`} aria-label="Email">
              <Mail className="h-5 w-5" />
            </Link>
          </div>

          {/* BOTTOM BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-light text-muted-foreground">
            <p>
              © 2026 {COMPANY_NAME} — CNPJ {COMPANY_CNPJ}
            </p>

            <Image
              src={UP_LOGO_SVG}
              alt="Grupo UP"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
