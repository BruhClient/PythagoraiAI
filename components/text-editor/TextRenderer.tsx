import { FunctionComponent } from "react";
interface TextRendererProps {
  html: string;
}

const TextRenderer: FunctionComponent<TextRendererProps> = ({ html }) => {
  return (
    <div
      className="font-serif  min-h-[100px] max-h-[400px] break-words break-anywhere"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default TextRenderer;
