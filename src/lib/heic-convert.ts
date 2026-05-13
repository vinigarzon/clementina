/**
 * Detecta y convierte archivos HEIC/HEIF a JPEG en el navegador,
 * para que Chrome/Firefox/otros browsers puedan mostrarlos.
 *
 * `heic2any` se importa dinámicamente para no inflar el bundle
 * (es ~600KB; solo se carga si efectivamente hay un HEIC).
 */

const HEIC_EXTENSIONS = /\.(heic|heif)$/i;
const HEIC_MIMES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

export function isHeic(file: File): boolean {
  return HEIC_MIMES.has(file.type) || HEIC_EXTENSIONS.test(file.name);
}

/**
 * Si el archivo es HEIC, lo convierte a JPEG.
 * Si no, lo devuelve tal cual.
 */
export async function maybeConvertHeic(
  file: File,
  quality = 0.85,
): Promise<File> {
  if (!isHeic(file)) return file;

  try {
    const mod = await import("heic2any");
    const heic2any = mod.default;
    const result = (await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality,
    })) as Blob | Blob[];

    const blob = Array.isArray(result) ? result[0] : result;
    const newName = file.name.replace(HEIC_EXTENSIONS, ".jpg");
    return new File([blob], newName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (e) {
    throw new Error(
      `No pude convertir ${file.name} desde HEIC. ${e instanceof Error ? e.message : ""}`,
    );
  }
}
