"use client";

import { useRef, useState, useCallback } from "react";
import { renderMarkdown } from "@/lib/markdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  id?: string;
}

type Mode = "edit" | "preview" | "split";

interface ToolbarAction {
  label: string;
  hint: string;
  icon: React.ReactNode;
  /** Función que recibe la selección actual y retorna el texto a insertar */
  apply: (selected: string) => { text: string; cursorOffset?: number };
}

function bold(s: string) {
  return { text: `**${s || "texto"}**`, cursorOffset: s ? 0 : 2 };
}
function italic(s: string) {
  return { text: `*${s || "texto"}*`, cursorOffset: s ? 0 : 1 };
}
function h2(s: string) {
  return { text: `## ${s || "Subtítulo"}\n\n`, cursorOffset: 0 };
}
function h3(s: string) {
  return { text: `### ${s || "Subtítulo"}\n\n`, cursorOffset: 0 };
}
function list(s: string) {
  if (!s) return { text: "- Ítem\n", cursorOffset: 0 };
  return {
    text: s
      .split("\n")
      .map((l) => (l.trim().startsWith("- ") ? l : `- ${l}`))
      .join("\n"),
    cursorOffset: 0,
  };
}
function quote(s: string) {
  if (!s) return { text: "> Cita\n", cursorOffset: 0 };
  return {
    text: s
      .split("\n")
      .map((l) => (l.startsWith("> ") ? l : `> ${l}`))
      .join("\n"),
    cursorOffset: 0,
  };
}
function link(s: string) {
  const url = "https://";
  return {
    text: `[${s || "texto del enlace"}](${url})`,
    cursorOffset: 0,
  };
}

const TOOLBAR: ToolbarAction[] = [
  {
    label: "H2",
    hint: "Subtítulo grande (Cmd+Alt+2)",
    icon: <span className="font-display text-base">H2</span>,
    apply: h2,
  },
  {
    label: "H3",
    hint: "Subtítulo (Cmd+Alt+3)",
    icon: <span className="font-display text-base">H3</span>,
    apply: h3,
  },
  {
    label: "B",
    hint: "Negrita (Cmd+B)",
    icon: <span className="font-bold">B</span>,
    apply: bold,
  },
  {
    label: "I",
    hint: "Cursiva (Cmd+I)",
    icon: <span className="italic font-serif">I</span>,
    apply: italic,
  },
  {
    label: "•",
    hint: "Lista con viñetas",
    icon: <span>•—</span>,
    apply: list,
  },
  {
    label: '"',
    hint: "Cita",
    icon: <span>“ ”</span>,
    apply: quote,
  },
  {
    label: "🔗",
    hint: "Enlace",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    apply: link,
  },
];

export function MarkdownEditor({
  value,
  onChange,
  rows = 18,
  placeholder,
  id,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<Mode>("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyAction = useCallback(
    (action: ToolbarAction) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = value.slice(start, end);
      const { text } = action.apply(selected);
      const newValue = value.slice(0, start) + text + value.slice(end);
      onChange(newValue);
      // restaurar foco y posición
      requestAnimationFrame(() => {
        ta.focus();
        const newPos = start + text.length;
        ta.setSelectionRange(newPos, newPos);
      });
    },
    [value, onChange],
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    if (e.key === "b") {
      e.preventDefault();
      applyAction(TOOLBAR[2]);
    } else if (e.key === "i") {
      e.preventDefault();
      applyAction(TOOLBAR[3]);
    }
  }

  return (
    <div className="border border-clementina-200 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-clementina-50 border-b border-clementina-200 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {TOOLBAR.map((action, i) => (
            <button
              key={i}
              type="button"
              onClick={() => applyAction(action)}
              title={action.hint}
              aria-label={action.hint}
              className="w-9 h-9 rounded-md hover:bg-cream-100 active:bg-cream-200 flex items-center justify-center text-clementina-800 transition-colors"
            >
              {action.icon}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-cream-100 rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setMode("edit")}
            className={`px-3 py-1 rounded font-sans text-xs transition-colors ${
              mode === "edit"
                ? "bg-white text-clementina-800 shadow-sm"
                : "text-clementina-700 hover:text-clementina-900"
            }`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            className={`hidden md:block px-3 py-1 rounded font-sans text-xs transition-colors ${
              mode === "split"
                ? "bg-white text-clementina-800 shadow-sm"
                : "text-clementina-700 hover:text-clementina-900"
            }`}
          >
            Dividido
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`px-3 py-1 rounded font-sans text-xs transition-colors ${
              mode === "preview"
                ? "bg-white text-clementina-800 shadow-sm"
                : "text-clementina-700 hover:text-clementina-900"
            }`}
          >
            Vista previa
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div
        className={`${mode === "split" ? "grid md:grid-cols-2" : ""} divide-x divide-clementina-100`}
      >
        {(mode === "edit" || mode === "split") && (
          <textarea
            id={id}
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 bg-white font-mono text-sm text-clementina-900 focus:outline-none resize-y"
          />
        )}
        {(mode === "preview" || mode === "split") && (
          <div
            className="prose-blog px-5 py-4 overflow-y-auto bg-cream-50/40"
            style={{ minHeight: `${rows * 1.5}rem` }}
          >
            {value.trim() ? (
              renderMarkdown(value)
            ) : (
              <p className="font-sans text-sm text-clementina-900/40 italic">
                Vista previa vacía. Escribe algo en el editor.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cheatsheet */}
      <div className="px-3 py-2 bg-clementina-50/60 border-t border-clementina-100 font-sans text-[11px] text-clementina-900/60">
        <strong>Tip:</strong> usa <code className="bg-white px-1 rounded">## Título</code>,{" "}
        <code className="bg-white px-1 rounded">**negrita**</code>,{" "}
        <code className="bg-white px-1 rounded">*cursiva*</code>,{" "}
        <code className="bg-white px-1 rounded">[texto](url)</code>,{" "}
        <code className="bg-white px-1 rounded">- lista</code>,{" "}
        <code className="bg-white px-1 rounded">&gt; cita</code>. Líneas en blanco separan
        párrafos.
      </div>
    </div>
  );
}
