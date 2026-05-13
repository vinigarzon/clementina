import type { Metadata } from "next";
import { LaFincaContent } from "./la-finca-content";

export const metadata: Metadata = {
  title: "La Finca | Finca La Clementina - Eventos en Tulcán, Carchi",
  description:
    "Conoce Finca La Clementina: salón de eventos, áreas verdes, lago artificial, pérgola para bodas, parqueadero y servicios integrales para celebraciones en Tulcán, Carchi.",
};

export default function LaFincaPage() {
  return <LaFincaContent />;
}
