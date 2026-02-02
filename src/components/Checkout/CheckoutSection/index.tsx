"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Divider } from "@/components/Divider";
import ShippingSection from "./shipping-section";
import { Steps } from "../Steps";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "../order-summary";
import { CheckoutAddressSection } from "../AddressSection";
import { CheckoutPhoneSection } from "../PhoneSection";
import { CheckoutProvider, useCheckout } from "@/contexts/checkout-context";
import { User } from "@/data/types/user";
import CheckoutOrderSummary from "./order-summary";

export interface ShippingInfo {
  name: string;
  maxDate: string;
  serviceCode: string;
  price: number;
  observations?: string;
}

const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -100, transition: { duration: 0.3, ease: "easeIn" } },
};

function CheckoutContent({ user }: { user: User }) {
  const {
    currentStep,
    nextStep,
    prevStep,
    canProceedToNextStep,
    handleCompleteCheckout,
  } = useCheckout();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <Divider value="Endereço de Entrega" />
            <CheckoutAddressSection user={user} />
            <Divider value="Telefone" />
            <CheckoutPhoneSection user={user} />
          </>
        );
      case 2:
        return (
          <>
            <Divider value="Forma de Entrega" />
            <span className="mt-4 block text-center text-md text-gray-500">
              O valor e o prazo do frete são uma simulação e podem sofrer
              alterações.
            </span>
            <ShippingSection />
          </>
        );
      case 3:
        return <CheckoutOrderSummary />;
      default:
        return null;
    }
  };

  const steps = [
    {
      number: 1,
      title: "Endereço de Compras",
      description: "Selecione o endereço e telefone de entrega",
    },
    {
      number: 2,
      title: "Método de Entrega",
      description: "Selecione a forma de entrega",
    },
    {
      number: 3,
      title: "Confirmação",
      description: "Revise e confirme as informações do pedido.",
    },
  ];

  return (
    <>
      <OrderSummary />
      <section className="flex-auto space-y-2 overflow-y-auto px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-4">
        <Steps currentStep={currentStep} steps={steps} />
        <div className="mx-auto max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="text-base font-base uppercase"
              >
                Voltar
              </Button>
            )}
            {currentStep < 3 && (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className={
                  currentStep === 1
                    ? "ml-auto text-sm font-base uppercase"
                    : "text-sm font-base uppercase"
                }
              >
                Próximo
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                type="button"
                onClick={handleCompleteCheckout}
                className="text-sm font-base uppercase bg-green-700"
              >
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function CheckoutSectionWrapper({ user }: { user: User }) {
  return (
    <CheckoutProvider>
      <CheckoutContent user={user} />
    </CheckoutProvider>
  );
}
