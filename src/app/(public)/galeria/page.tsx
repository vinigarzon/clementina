import type { Metadata } from "next";
import { getPublishedGalleryAssets } from "@/lib/data/gallery";
import { GaleriaContent } from "./galeria-content";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Imágenes de bodas, quinces, eventos corporativos y celebraciones que hemos vivido en Finca La Clementina.",
};

export const revalidate = 60;

export default async function GaleriaPage() {
  const assets = await getPublishedGalleryAssets();
  return <GaleriaContent assets={assets} />;
}
