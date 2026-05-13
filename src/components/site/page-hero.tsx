import Image from "next/image";
import { Container } from "@/components/ui/container";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /**
   * Imagen de fondo opcional. Cuando se provee, el hero se renderiza
   * con foto a pantalla completa (mismo estilo que /la-finca y
   * /tipos-de-eventos/[slug]). Si se omite, se usa el gradiente sólido.
   */
  image?: {
    src: string;
    alt: string;
  };
}

/**
 * Hero reutilizable para páginas internas.
 * - Con `image`: hero alto con foto + overlay (uniforme con /la-finca).
 * - Sin `image`: gradiente sólido (útil para páginas legales).
 */
export function PageHero({ eyebrow, title, description, image }: PageHeroProps) {
  if (image) {
    return (
      <section className="relative min-h-[60vh] sm:min-h-[65vh] flex items-end overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-clementina-900/45 via-clementina-900/25 to-clementina-900/85" />

        <Container className="relative z-10 pb-16 sm:pb-24 pt-40">
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/90 mb-6 drop-shadow">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-cream-50 leading-[1.05] drop-shadow-lg">
              {title}
            </h1>
            {description && (
              <p className="font-sans text-lg sm:text-xl text-cream-100/90 leading-relaxed max-w-2xl mt-8 drop-shadow">
                {description}
              </p>
            )}
          </div>
        </Container>
      </section>
    );
  }

  // Fallback con gradiente (para páginas legales y otras sin foto).
  return (
    <section className="relative pt-40 pb-16 sm:pt-48 sm:pb-24 bg-gradient-to-br from-clementina-800 via-clementina-700 to-clementina-900 text-cream-50 overflow-hidden">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(245,239,226,0.4),transparent_60%)]" />
      <Container className="relative z-10">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-cream-100/80 mb-6">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream-50 leading-tight mb-6">
            {title}
          </h1>
          {description && (
            <p className="font-sans text-lg text-cream-100/85 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
