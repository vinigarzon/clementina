import type { Metadata } from "next";
import { CookiesContent } from "./cookies-content";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Cómo usamos cookies en nuestro sitio web.",
};

export default function CookiesPage() {
  return <CookiesContent />;
}
