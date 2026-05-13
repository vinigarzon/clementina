"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Locale } from "./messages";
import { messages, detectLocale } from "./messages";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

const STORAGE_KEY = "clementina_locale";

interface LocaleProviderProps {
  children: React.ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  // Inicializa en español; el detector real corre en useEffect (cliente)
  const [locale, setLocaleState] = useState<Locale>("es");

  // Detección inicial al montar
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "es" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
        return;
      }
      const detected = detectLocale(navigator.language);
      setLocaleState(detected);
      document.documentElement.lang = detected;
    } catch {
      // Si localStorage está bloqueado, simplemente quedamos en español
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      return messages[locale][key] ?? messages.es[key] ?? key;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale debe usarse dentro de un <LocaleProvider>");
  }
  return ctx;
}

/**
 * Atajo cuando solo necesitas la función `t`.
 */
export function useT() {
  return useLocale().t;
}
