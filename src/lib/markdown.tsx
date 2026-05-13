import { Fragment } from "react";

/**
 * Render simple de Markdown a JSX.
 * Soporta:
 *  - ## y ### subtítulos
 *  - **negrita** y *cursiva*
 *  - [texto](url) enlaces
 *  - > citas
 *  - listas con `- `
 *  - párrafos separados por línea en blanco
 *
 * Para casos más complejos se podría reemplazar con react-markdown,
 * pero esto evita una dependencia extra y es suficiente para el blog.
 */

interface InlineToken {
  type: "text" | "bold" | "italic" | "link";
  value: string;
  href?: string;
}

function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // Regex que matchea **bold**, *italic*, [text](url)
  const pattern = /(\*\*([^*]+)\*\*)|(\*([^*\n]+)\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[2]) {
      tokens.push({ type: "bold", value: match[2] });
    } else if (match[4]) {
      tokens.push({ type: "italic", value: match[4] });
    } else if (match[6]) {
      tokens.push({ type: "link", value: match[6], href: match[7] });
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }
  return tokens;
}

function Inline({ text }: { text: string }) {
  const tokens = parseInline(text);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.type === "bold") {
          return (
            <strong key={i} className="font-semibold text-clementina-900">
              {t.value}
            </strong>
          );
        }
        if (t.type === "italic") {
          return (
            <em key={i} className="italic">
              {t.value}
            </em>
          );
        }
        if (t.type === "link") {
          return (
            <a
              key={i}
              href={t.href}
              target={t.href?.startsWith("http") ? "_blank" : undefined}
              rel={t.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-clementina-700 underline underline-offset-2 hover:text-clementina-900"
            >
              {t.value}
            </a>
          );
        }
        return <Fragment key={i}>{t.value}</Fragment>;
      })}
    </>
  );
}

export function renderMarkdown(body: string) {
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-display text-3xl text-clementina-800 mt-12 mb-5 leading-tight"
        >
          <Inline text={trimmed.slice(3)} />
        </h2>
      );
    }

    if (trimmed.startsWith("### ")) {
      return (
        <h3
          key={i}
          className="font-display text-2xl text-clementina-800 mt-10 mb-4 leading-tight"
        >
          <Inline text={trimmed.slice(4)} />
        </h3>
      );
    }

    // Cita: cada línea empieza con >
    if (trimmed.split("\n").every((line) => line.trim().startsWith(">"))) {
      const content = trimmed
        .split("\n")
        .map((l) => l.replace(/^>\s?/, ""))
        .join(" ");
      return (
        <blockquote
          key={i}
          className="my-6 border-l-4 border-clementina-300 pl-5 italic text-clementina-800/85"
        >
          <Inline text={content} />
        </blockquote>
      );
    }

    // Lista con guiones
    if (trimmed.split("\n").every((line) => line.trim().startsWith("- "))) {
      return (
        <ul
          key={i}
          className="my-5 space-y-2 font-sans text-base text-clementina-900/80 leading-relaxed"
        >
          {trimmed.split("\n").map((line, j) => (
            <li key={j} className="flex gap-2">
              <span className="text-clementina-600">·</span>
              <span>
                <Inline text={line.trim().slice(2)} />
              </span>
            </li>
          ))}
        </ul>
      );
    }

    // Párrafo normal
    return (
      <p
        key={i}
        className="my-5 font-sans text-base text-clementina-900/80 leading-relaxed"
      >
        <Inline text={trimmed} />
      </p>
    );
  });
}
