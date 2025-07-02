import React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const TextEditorMenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const headingOptions = [
    {
      icon: Heading1,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      value: "heading1",
    },
    {
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      value: "heading2",
    },
    {
      icon: Heading3,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      value: "heading3",
    },
  ];

  const styleOptions = [
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      value: "bold",
    },
    {
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      value: "italic",
    },
    {
      icon: Highlighter,
      onClick: () => editor.commands.toggleHighlight({ color: "#ffcc00" }),
      active: editor.isActive("highlight", { color: "#ffcc00" }),
      value: "highlight",
    },
    {
      icon: Strikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      value: "strike",
    },
    {
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      value: "bulletList",
    },
    {
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      value: "orderedList",
    },
  ];

  const textAlignOptions = [
    {
      icon: AlignLeft,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      active: editor.isActive({ textAlign: "left" }),
      value: "left",
    },
    {
      icon: AlignCenter,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
      value: "center",
    },
    {
      icon: AlignRight,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      active: editor.isActive({ textAlign: "right" }),
      value: "right",
    },
    {
      icon: AlignJustify,
      onClick: () => editor.chain().focus().setTextAlign("justify").run(),
      active: editor.isActive({ textAlign: "justify" }),
      value: "justify",
    },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {/* Headings - only one can be active at a time */}
      <ToggleGroup type="single" variant="outline" defaultValue="">
        {headingOptions.map(({ icon: Icon, onClick, value, active }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-pressed={active}
            onClick={onClick}
            aria-label={`Toggle ${value}`}
          >
            <Icon className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Styles - multiple can be active */}
      <ToggleGroup type="multiple" variant="outline" defaultValue={[]}>
        {styleOptions.map(({ icon: Icon, onClick, value, active }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-pressed={active}
            onClick={onClick}
            aria-label={`Toggle ${value}`}
          >
            <Icon className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Text Alignment - single select */}
      <ToggleGroup type="single" variant="outline" defaultValue="">
        {textAlignOptions.map(({ icon: Icon, onClick, value, active }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-pressed={active}
            onClick={onClick}
            aria-label={`Set text align ${value}`}
          >
            <Icon className="h-4 w-4" />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default TextEditorMenuBar;
