import type { Metadata } from "next";
import { PrivacidadContent } from "./privacidad-content";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Cómo Finca La Clementina trata tus datos personales, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
};

export default function PrivacidadPage() {
  return <PrivacidadContent />;
}
