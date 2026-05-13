"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/i18n/locale-context";
import { Container } from "@/components/ui/container";

interface QuoteByLocale {
  text: string;
  author: string;
  role: string;
}

interface Quote {
  es: QuoteByLocale;
  en: QuoteByLocale;
}

const QUOTES: Quote[] = [
  {
    es: {
      text: "He aprendido que la gente olvidará lo que dijiste, olvidará lo que hiciste, pero nunca olvidará cómo los hiciste sentir.",
      author: "Maya Angelou",
      role: "Poeta y escritora",
    },
    en: {
      text: "I've learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
      author: "Maya Angelou",
      role: "Poet and writer",
    },
  },
  {
    es: {
      text: "No recordamos días. Recordamos momentos.",
      author: "Cesare Pavese",
      role: "Escritor",
    },
    en: {
      text: "We do not remember days. We remember moments.",
      author: "Cesare Pavese",
      role: "Writer",
    },
  },
  {
    es: {
      text: "Las mejores y más bellas cosas del mundo no se pueden ver ni tocar; se sienten con el corazón.",
      author: "Helen Keller",
      role: "Escritora y activista",
    },
    en: {
      text: "The best and most beautiful things in the world cannot be seen or even touched, they must be felt with the heart.",
      author: "Helen Keller",
      role: "Writer and activist",
    },
  },
];

const INTERVAL = 8000;

export function QuoteSection() {
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (QUOTES.length <= 1) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, INTERVAL);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="relative py-28 sm:py-36 bg-clementina-900 text-cream-50 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,239,226,1),transparent_60%)]" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Comilla decorativa */}
          <div
            className="font-display text-cream-100/15 leading-none mx-auto"
            style={{ fontSize: "110px", marginBottom: "-2.5rem" }}
            aria-hidden="true"
          >
            “
          </div>

          {/*
            Stack de citas usando grid: todas las citas se apilan en la
            MISMA celda (col-start-1 row-start-1). La celda toma la altura
            de la cita más larga, así nada se desborda ni interfiere con
            los dots que vienen después.
          */}
          <div className="grid">
            {QUOTES.map((q, i) => {
              const active = i === index;
              return (
                <div
                  key={i}
                  className={`col-start-1 row-start-1 transition-opacity duration-[1500ms] ${
                    active ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  aria-hidden={!active}
                >
                  <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.3] text-cream-50 italic max-w-3xl mx-auto">
                    {q[locale].text}
                  </blockquote>

                  <div className="mt-10 flex items-center justify-center gap-4">
                    <span className="block w-12 h-px bg-cream-100/40" />
                    <div className="text-center">
                      <p className="font-sans text-sm uppercase tracking-[0.25em] text-cream-50">
                        {q[locale].author}
                      </p>
                      <p className="font-sans text-xs text-cream-100/60 mt-1">
                        {q[locale].role}
                      </p>
                    </div>
                    <span className="block w-12 h-px bg-cream-100/40" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dots, fuera del grid → siempre debajo, nunca interfieren */}
          {QUOTES.length > 1 && (
            <div className="flex justify-center gap-2 mt-16">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Cita ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-8 bg-cream-50"
                      : "w-1.5 bg-cream-50/40 hover:bg-cream-50/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
