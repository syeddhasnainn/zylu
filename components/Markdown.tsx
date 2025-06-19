import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import { marked } from "marked";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

function PureMarkdownRendererBlock({ content }: { content: string }) {
  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "text";
      return !inline && match ? (
        <div className="my-6">
          <div className="flex justify-between bg-accent text-foreground px-4 py-1.5 rounded-t-md text-sm">
            {language}
            <button
              className="ml-2"
              onClick={() => navigator.clipboard.writeText(children)}
            >
              <Copy width={14} height={14} />
            </button>
          </div>
          <SyntaxHighlighter
            {...props}
            wrapLines
            wrapLongLines
            PreTag="div"
            language={language}
            style={dark}
            className="!bg-sidebar-background shadow-md  rounded-b-lg px-4 py-2 leading-6 !m-0"
          >
            {children}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className={`${className} rounded-md px-1.5 py-0.5 bg-accent`}
          {...props}
        >
          {children}
        </code>
      );
    },
    p: ({ node, children, ...props }: any) => (
      <p className="my-4" {...props}>
        {children}
      </p>
    ),
    hr: ({ node, ...props }: any) => <hr className="hidden my-4" {...props} />,
    h1: ({ node, children, ...props }: any) => (
      <h1 className="font-bold leading-tight text-lg my-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ node, children, ...props }: any) => (
      <h2 className="font-bold leading-tight text-lg my-6" {...props}>
        {children}
      </h2>
    ),
    h3: ({ node, children, ...props }: any) => (
      <h3 className="font-semibold leading-tight text-base my-5" {...props}>
        {children}
      </h3>
    ),
    ol: ({ node, children, ...props }: any) => (
      <ol className="list-decimal list-outside ml-6 my-4 space-y-2" {...props}>
        {children}
      </ol>
    ),
    ul: ({ node, children, ...props }: any) => (
      <ul className="list-disc list-outside ml-6 my-4 space-y-2" {...props}>
        {children}
      </ul>
    ),
    table: ({ node, children, ...props }: any) => (
      <table
        className="w-full border border-white/10 my-6 rounded-md overflow-hidden"
        {...props}
      >
        {children}
      </table>
    ),
    th: ({ node, children, ...props }: any) => (
      <th
        className="border border-white/10 px-3 py-2 text-center text-sm font-medium bg-base-300/30"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ node, children, ...props }: any) => (
      <td
        className="border border-white/10 px-3 py-2 text-center text-sm"
        {...props}
      >
        {children}
      </td>
    ),
    tr: ({ node, children, ...props }: any) => (
      <tr className="border-b border-white/10 text-sm" {...props}>
        {children}
      </tr>
    ),
    a: ({ node, children, ...props }: any) => (
      <a
        className="text-blue-500 hover:underline font-medium"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ node, children, ...props }: any) => (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    ),
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}

const MarkdownRendererBlock = memo(
  PureMarkdownRendererBlock,
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MarkdownRendererBlock.displayName = "MarkdownRendererBlock";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const blocks = useMemo(() => parseMarkdownIntoBlocks(children), [children]);

  return (
    <div>
      {blocks.map((block, index) => (
        <MarkdownRendererBlock
          content={block}
          key={`markdown-block-${index}`}
        />
      ))}
    </div>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
