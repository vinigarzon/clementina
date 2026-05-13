"use client";

import Image from "next/image";
import { useEffect, useCallback } from "react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string | null;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const isOpen = index !== null;

  const prev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const next = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  // Teclado: Escape, flechas
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, prev, next]);

  // Bloquear scroll del body cuando abierto
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen || index === null) return null;
  const current = images[index];
  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-clementina-900/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Vista ampliada de imagen"
    >
      {/* Click en el fondo cierra */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar"
      />

      {/* Cerrar */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar (Esc)"
        className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-clementina-800/60 hover:bg-clementina-800 text-cream-50 flex items-center justify-center text-2xl transition-colors"
      >
        ×
      </button>

      {/* Contador */}
      <div className="absolute top-6 left-6 z-10 font-sans text-sm text-cream-50/80">
        {index + 1} / {images.length}
      </div>

      {/* Anterior */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={prev}
          aria-label="Anterior (←)"
          className="absolute left-4 sm:left-8 z-10 w-12 h-12 rounded-full bg-clementina-800/60 hover:bg-clementina-800 text-cream-50 flex items-center justify-center text-xl transition-colors"
        >
          ‹
        </button>
      )}

      {/* Imagen */}
      <div className="relative z-0 w-full h-full max-w-7xl max-h-[90vh] flex flex-col items-center justify-center px-16 sm:px-20 py-8 pointer-events-none">
        <div className="relative w-full flex-1">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
        {current.caption && (
          <p className="font-sans text-sm text-cream-50/90 mt-4 max-w-xl text-center">
            {current.caption}
          </p>
        )}
      </div>

      {/* Siguiente */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={next}
          aria-label="Siguiente (→)"
          className="absolute right-4 sm:right-8 z-10 w-12 h-12 rounded-full bg-clementina-800/60 hover:bg-clementina-800 text-cream-50 flex items-center justify-center text-xl transition-colors"
        >
          ›
        </button>
      )}
    </div>
  );
}
