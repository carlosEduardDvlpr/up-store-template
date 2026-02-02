import "./globals.css";

import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";

import { TokenProvider } from "@/contexts/token-context";
import { UtmProvider } from "@/contexts/utm-contex";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "@/components/ui/toaster";
import { ChatProviders } from "./chat/contexts";
import { COMPANY_NAME } from "@/data/constants";
import { StoreConfigurationProvider } from "@/contexts/store-context";

export const metadata: Metadata = {
  title: {
    template: `%s | ${COMPANY_NAME}`,
    default: COMPANY_NAME,
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID ?? "";

// const GTM_ID = 'GTM-T2NBMHJJ'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <GoogleTagManager gtmId={GTM_ID} />
      <body className={`h-full bg-[#4E4E5A] antialiased p-0 m-0`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <div className="min-h-screen flex flex-col">
          <TokenProvider>
            <StoreConfigurationProvider>
              <UtmProvider>
                <CartProvider>
                  <ChatProviders>
                    {children}
                    {/* <Toaster richColors /> */}
                    <Toaster />
                  </ChatProviders>
                </CartProvider>
              </UtmProvider>
            </StoreConfigurationProvider>
          </TokenProvider>
        </div>
      </body>
    </html>
  );
}
