import { ReactNode, Suspense } from "react";
import ChatBody from "@/app/chat/components/Chat";

import { MainFooter } from "@/components/Footers/main";
import { Header } from "@/components/Header";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto bg-white min-h-screen w-full md:pt-0 overflow-x-hidden dark:bg-zinc-800 dark:text-zinc-50">
      <Suspense>
        <Header />
      </Suspense>
      {children}
      <ChatBody />
      <MainFooter />
    </div>
  );
}
