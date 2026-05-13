import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { LocaleProvider } from "@/i18n/locale-context";
import { SiteSettingsProvider } from "@/components/site/site-settings-provider";
import { getSiteSettings } from "@/lib/data/site-settings";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Finca La Clementina · Convenciones & Eventos en Carchi",
    template: "%s · Finca La Clementina",
  },
  description:
    "Finca exclusiva en Carchi, Ecuador. Bodas, quinces, grados, eventos corporativos y sociales en un entorno natural impresionante con servicios de alta calidad.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lee la configuración del sitio (con fallback a defaults) y la
  // pasa al provider para que cualquier client component pueda
  // consumirla con useSiteSettings().
  const settings = await getSiteSettings();

  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-cream-50 text-clementina-900 antialiased"
        suppressHydrationWarning
      >
        <SiteSettingsProvider value={settings}>
          <LocaleProvider>{children}</LocaleProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
