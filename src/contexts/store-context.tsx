"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  CategoryStoreConfig,
  getCategoryStoreConfigurations,
} from "@/clients/database/get-category-store-configurations";
import { ToastError } from "@/components/Toaster/toast-error";

interface StoreConfigurationContextType {
  categories: CategoryStoreConfig[] | [];
}

const StoreConfigurationContext = createContext<
  StoreConfigurationContextType | undefined
>(undefined);

export function StoreConfigurationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categories, setCategories] = useState<CategoryStoreConfig[] | []>([]);
  useEffect(() => {
    const handleSetup = async () => {
      try {
        const categoryConfigs = await getCategoryStoreConfigurations();
        if (categoryConfigs) {
          setCategories(categoryConfigs);
        }
      } catch (err) {
        ToastError({
          title: "Configurações da loja",
          description: "Falha ao buscar configurações de categoria da loja",
        });
        return;
      }
    };
    handleSetup();
  }, []);

  const value = {
    categories,
  };

  return (
    <StoreConfigurationContext.Provider value={value}>
      {children}
    </StoreConfigurationContext.Provider>
  );
}

export function useStoreConfiguration() {
  const context = useContext(StoreConfigurationContext);
  if (context === undefined) {
    throw new Error(
      "useStore must be used within a StoreConfigurationProvider",
    );
  }
  return context;
}
