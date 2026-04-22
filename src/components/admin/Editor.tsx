"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link as TiptapLink } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo, Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded text-sm transition-colors",
        active ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

export function Editor({ content, onChange, placeholder = "Escribe tu artículo aquí..." }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-indigo max-w-none min-h-[400px] px-6 py-4 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("URL del enlace:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarButton title="Negrita" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Cursiva" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Tachado" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Código" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton title="H1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="H2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="H3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton title="Lista" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Lista numerada" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Cita" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Separador" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Enlace" onClick={addLink} active={editor.isActive("link")}>
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton title="Deshacer" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Rehacer" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="w-4 h-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
