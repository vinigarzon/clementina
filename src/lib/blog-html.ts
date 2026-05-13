/**
 * Helpers para el contenido del blog.
 *
 * El editor Tiptap del admin guarda HTML. Pero los 6 posts del seed
 * inicial vinieron en Markdown, así que detectamos el formato y
 * convertimos cuando es necesario.
 */

/**
 * Heurística: si el contenido tiene tags HTML, lo consideramos HTML.
 */
export function isHtml(content: string): boolean {
  return /<(p|h2|h3|ul|ol|blockquote|strong|em|a|br)\b/i.test(content);
}

/**
 * Sanitiza HTML eliminando scripts y atributos peligrosos.
 * Implementación simple y conservadora.
 */
export function sanitizeBlogHtml(html: string): string {
  return html
    // Remover etiquetas peligrosas completas
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Atributos peligrosos
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\sjavascript\s*:/gi, "");
}

/**
 * Fallback para contenido legacy en Markdown.
 * Convierte sintaxis básica a HTML para renderizar bien.
 */
export function markdownFallbackToHtml(md: string): string {
  const blocks = md.split(/\n\n+/);
  const out: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      out.push(`<h2>${inline(trimmed.slice(3))}</h2>`);
    } else if (trimmed.startsWith("### ")) {
      out.push(`<h3>${inline(trimmed.slice(4))}</h3>`);
    } else if (trimmed.split("\n").every((l) => l.trim().startsWith(">"))) {
      const text = trimmed
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join(" ");
      out.push(`<blockquote><p>${inline(text)}</p></blockquote>`);
    } else if (trimmed.split("\n").every((l) => l.trim().startsWith("- "))) {
      const items = trimmed
        .split("\n")
        .map((l) => `<li>${inline(l.trim().slice(2))}</li>`)
        .join("");
      out.push(`<ul>${items}</ul>`);
    } else {
      out.push(`<p>${inline(trimmed.replace(/\n/g, "<br/>"))}</p>`);
    }
  }
  return out.join("");
}

function inline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}
