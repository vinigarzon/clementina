import type { Metadata } from "next";
import { getPublishedTeamMembers } from "@/lib/data/team";
import { EquipoContent } from "./equipo-content";

export const metadata: Metadata = {
  title: "Equipo",
  description:
    "Conoce al equipo humano detrás de Finca La Clementina. Personas que cuidan cada detalle para que tu evento sea inolvidable.",
};

export const revalidate = 60;

export default async function EquipoPage() {
  const members = await getPublishedTeamMembers();
  return <EquipoContent members={members} />;
}
