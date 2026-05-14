import type { Metadata } from "next";
import { TerminosContent } from "./terminos-content";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos de uso del sitio web de Finca La Clementina.",
};

export default function TerminosPage() {
  return <TerminosContent />;
}
