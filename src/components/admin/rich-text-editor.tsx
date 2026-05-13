"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/**
 * Editor WYSIWYG basado en Tiptap.
 * Soporta paste con formato (Word, Google Docs, web, etc.) y conserva
 * negritas, cursivas, listas, links y headings al pegar.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Escribe o pega tu contenido...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-clementina-700 underline underline-offset-2",
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-blog px-5 py-4 min-h-[300px] focus:outline-none bg-white",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="border border-clementina-200 rounded-lg overflow-hidden bg-white">
        <div className="px-5 py-4 min-h-[300px] text-clementina-900/40 font-sans text-sm">
          Cargando editor…
        </div>
      </div>
    );
  }

  return (
    <div className="border border-clementina-200 rounded-lg overflow-hidden bg-white">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="px-3 py-2 bg-clementina-50/60 border-t border-clementina-100 font-sans text-[11px] text-clementina-900/60">
        <strong>Tip:</strong> puedes copiar desde Word, Google Docs o
        cualquier página web — se conserva el formato.
      </div>
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  function applyLink() {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkUrl("");
    setShowLinkInput(false);
  }

  const btn = (
    onClick: () => void,
    isActive: boolean,
    hint: string,
    children: React.ReactNode,
  ) => (
    <button
      type="button"
      onClick={onClick}
      title={hint}
      aria-label={hint}
      aria-pressed={isActive}
      className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
        isActive
          ? "bg-clementina-800 text-cream-50"
          : "text-clementina-800 hover:bg-cream-100 active:bg-cream-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-clementina-50 border-b border-clementina-200">
      {btn(
        () => editor.chain().focus().toggleBold().run(),
        editor.isActive("bold"),
        "Negrita (Cmd+B)",
        <span className="font-bold text-sm">B</span>,
      )}
      {btn(
        () => editor.chain().focus().toggleItalic().run(),
        editor.isActive("italic"),
        "Cursiva (Cmd+I)",
        <span className="italic font-serif text-sm">I</span>,
      )}
      {btn(
        () => editor.chain().focus().toggleStrike().run(),
        editor.isActive("strike"),
        "Tachado",
        <span className="line-through text-sm">S</span>,
      )}

      <span className="w-px h-6 bg-clementina-200 mx-1" />

      {btn(
        () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        editor.isActive("heading", { level: 2 }),
        "Subtítulo grande",
        <span className="font-display text-sm">H2</span>,
      )}
      {btn(
        () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        editor.isActive("heading", { level: 3 }),
        "Subtítulo",
        <span className="font-display text-sm">H3</span>,
      )}

      <span className="w-px h-6 bg-clementina-200 mx-1" />

      {btn(
        () => editor.chain().focus().toggleBulletList().run(),
        editor.isActive("bulletList"),
        "Lista con viñetas",
        <BulletIcon />,
      )}
      {btn(
        () => editor.chain().focus().toggleOrderedList().run(),
        editor.isActive("orderedList"),
        "Lista numerada",
        <OrderedIcon />,
      )}
      {btn(
        () => editor.chain().focus().toggleBlockquote().run(),
        editor.isActive("blockquote"),
        "Cita",
        <QuoteIcon />,
      )}

      <span className="w-px h-6 bg-clementina-200 mx-1" />

      {showLinkInput ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setShowLinkInput(false);
            }}
            placeholder="https://..."
            className="px-3 py-1.5 border border-clementina-300 rounded font-sans text-xs w-48 focus:outline-none focus:border-clementina-600"
          />
          <button
            type="button"
            onClick={applyLink}
            className="px-3 py-1.5 bg-clementina-800 text-cream-50 rounded font-sans text-xs"
          >
            OK
          </button>
        </div>
      ) : (
        btn(
          () => {
            const existing = editor.getAttributes("link").href as
              | string
              | undefined;
            setLinkUrl(existing ?? "");
            setShowLinkInput(true);
          },
          editor.isActive("link"),
          "Enlace",
          <LinkIcon />,
        )
      )}

      <span className="w-px h-6 bg-clementina-200 mx-1" />

      {btn(
        () => editor.chain().focus().undo().run(),
        false,
        "Deshacer (Cmd+Z)",
        <span>↶</span>,
      )}
      {btn(
        () => editor.chain().focus().redo().run(),
        false,
        "Rehacer (Cmd+Shift+Z)",
        <span>↷</span>,
      )}
    </div>
  );
}

function BulletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3.5" cy="6" r="1.5" fill="currentColor" />
      <circle cx="3.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="3.5" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}
function OrderedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="10" y1="6" x2="21" y2="6" />
      <line x1="10" y1="12" x2="21" y2="12" />
      <line x1="10" y1="18" x2="21" y2="18" />
      <text x="2" y="9" fontSize="6" fill="currentColor" stroke="none">1.</text>
      <text x="2" y="15" fontSize="6" fill="currentColor" stroke="none">2.</text>
      <text x="2" y="21" fontSize="6" fill="currentColor" stroke="none">3.</text>
    </svg>
  );
}
function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M3 21c0-4 2-7 6-8l-1-2c-3 1-6 4-6 9v3h7v-7H3v5zm12 0c0-4 2-7 6-8l-1-2c-3 1-6 4-6 9v3h7v-7h-6v5z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
