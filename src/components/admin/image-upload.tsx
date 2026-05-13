"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { maybeConvertHeic, isHeic } from "@/lib/heic-convert";

interface ImageUploadProps {
  /** URL actual de la imagen (opcional). */
  value: string | null;
  /** Carpeta dentro del bucket "media" (ej: "team", "gallery"). */
  folder: string;
  /** Callback con la nueva URL pública cuando termina el upload. */
  onChange: (url: string | null) => void;
  /** Aspect ratio del preview. Por defecto 4:5 vertical. */
  aspect?: "square" | "portrait" | "landscape";
}

const ASPECTS = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
} as const;

export function ImageUpload({
  value,
  folder,
  onChange,
  aspect = "portrait",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      // Si es HEIC (iPhone), convertir a JPEG primero
      const wasHeic = isHeic(file);
      const finalFile = await maybeConvertHeic(file);

      const supabase = createClient();
      const ext = finalFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filename, finalFile, {
          upsert: false,
          contentType: finalFile.type,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("media").getPublicUrl(filename);
      onChange(data.publicUrl);

      if (wasHeic) {
        console.log("[upload] HEIC convertido a JPEG:", finalFile.name);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Error al subir";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  return (
    <div>
      <div
        className={`relative ${ASPECTS[aspect]} rounded-xl overflow-hidden border-2 border-dashed border-clementina-200 bg-clementina-50/40 max-w-xs`}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
              sizes="320px"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-clementina-900/80 text-cream-50 flex items-center justify-center text-lg hover:bg-clementina-900"
              aria-label="Quitar imagen"
            >
              ×
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-clementina-700/70">
            <span className="font-sans text-3xl mb-2">+</span>
            <span className="font-sans text-xs">
              Sin imagen.
              <br />
              Haz click abajo para subir.
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 max-w-xs">
        <label
          className={`inline-flex items-center justify-center w-full px-5 py-2.5 rounded-lg font-sans text-sm font-medium cursor-pointer transition-colors ${
            uploading
              ? "bg-clementina-300 text-cream-50 cursor-wait"
              : "bg-clementina-800 text-cream-50 hover:bg-clementina-700"
          }`}
        >
          {uploading ? "Subiendo..." : value ? "Reemplazar imagen" : "Subir imagen"}
          <input
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleInputChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {error && (
          <p className="mt-2 font-sans text-xs text-red-700">{error}</p>
        )}
      </div>
    </div>
  );
}
