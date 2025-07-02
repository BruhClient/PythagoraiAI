"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import { useEffect } from "react";
import TextEditorMenuBar from "./TextEditorMenuBar";

type TextEditorProps = {
  content: string;
  placeholder: string;
  onChange: (value: string) => void;
};

const TextEditor = ({ content, placeholder, onChange }: TextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: {
          HTMLAttributes: { class: "list-disc ml-5" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal ml-5" },
        },
      }),
      Heading.configure().extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level;
          const tag = `h${level}`;
          return [tag, { ...HTMLAttributes, class: `editor__h${level}` }, 0];
        },
      }),
      Placeholder.configure({ placeholder }),
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "", // Init with blank, set real content below
    onUpdate({ editor }) {
      const html = editor.getHTML().trim();

      const isEmpty =
        editor.isEmpty ||
        html === "<p></p>" ||
        html === "<p><br></p>" ||
        html === "<p><strong></strong></p>";

      onChange(isEmpty ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] max-h-[400px] overflow-auto outline-none w-full p-2 break-all",
      },
    },
  });

  // Sync prop `content` to editor when changed externally
  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML().trim();
    const incoming = content.trim();

    if (incoming && current !== incoming) {
      editor.commands.setContent(incoming);
    }

    if (!incoming && !editor.isEmpty) {
      editor.commands.clearContent();
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="w-full font-serif space-y-2">
      <TextEditorMenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="bg-muted border  rounded-md shadow-sm p-4 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all min-h-[200px]"
      />
    </div>
  );
};

export default TextEditor;
