// context/utm-context.tsx
"use client";

import React, { createContext, ReactNode, useMemo } from "react";

type UtmParams = Record<string, string>;

interface UtmContextType {
  utmParamsFirstSession: UtmParams | null;
  utmParamsCurrentSession: UtmParams | null;
  referrer: string | null;
}

const UtmContext = createContext<UtmContextType | undefined>(undefined);

interface UtmProviderProps {
  children: ReactNode;
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function pickUtmParamsFromUrl(): UtmParams {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UtmParams = {};

  [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ].forEach((param) => {
    const value = urlParams.get(param);
    if (value) utmParams[param] = value;
  });

  return utmParams;
}

export const UtmProvider = ({ children }: UtmProviderProps) => {
  const value = useMemo<UtmContextType>(() => {
    if (typeof window === "undefined") {
      return {
        utmParamsFirstSession: null,
        utmParamsCurrentSession: null,
        referrer: null,
      };
    }

    // --- UTMs (current + first) ---
    const utmParamsFromUrl = pickUtmParamsFromUrl();

    // carrega armazenados
    let utmParamsCurrentSession = safeJsonParse<UtmParams>(
      localStorage.getItem("utmParamsCurrentSession"),
    );
    let utmParamsFirstSession = safeJsonParse<UtmParams>(
      localStorage.getItem("utmParamsFirstSession"),
    );

    // se URL tem UTM, sobrescreve current e inicializa first se ainda não existir
    if (Object.keys(utmParamsFromUrl).length > 0) {
      utmParamsCurrentSession = utmParamsFromUrl;
      localStorage.setItem(
        "utmParamsCurrentSession",
        JSON.stringify(utmParamsFromUrl),
      );

      if (!utmParamsFirstSession) {
        utmParamsFirstSession = utmParamsFromUrl;
        localStorage.setItem(
          "utmParamsFirstSession",
          JSON.stringify(utmParamsFromUrl),
        );
      }
    }

    // --- referrer (apenas externo) ---
    let referrer = localStorage.getItem("referrer");
    const documentReferrer = document.referrer;
    const isExternalReferrer =
      documentReferrer && !documentReferrer.includes(window.location.hostname);

    if (isExternalReferrer) {
      referrer = documentReferrer;
      localStorage.setItem("referrer", documentReferrer);
    }

    return {
      utmParamsFirstSession,
      utmParamsCurrentSession,
      referrer: referrer || null,
    };
  }, []);

  return <UtmContext.Provider value={value}>{children}</UtmContext.Provider>;
};

export const useUtmContext = () => {
  const context = React.useContext(UtmContext);
  if (!context) {
    throw new Error("useUtmContext must be used within an UtmProvider");
  }
  return context;
};
