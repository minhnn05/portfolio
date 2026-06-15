import ReactMarkdown from 'react-markdown';
import { cn } from '../../utils/cn';

/**
 * Render Markdown content với dark-theme styling.
 * Dùng cho blog content, project description, và MarkdownEditor preview.
 */
export default function MarkdownRenderer({ content, className }) {
  if (!content) return null;

  return (
    <div className={cn('markdown-body', className)}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mt-8 mb-4 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-white mt-8 mb-3 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-white mt-6 mb-2">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-zinc-200 mt-4 mb-2">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-zinc-300 leading-7 mb-4">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-300">{children}</em>
          ),
          code: ({ inline, children, className: cls }) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded text-xs font-mono bg-zinc-800 text-violet-300 border border-zinc-700">
                  {children}
                </code>
              );
            }
            const lang = cls?.replace('language-', '') ?? '';
            return (
              <div className="relative my-4">
                {lang && (
                  <span className="absolute top-3 right-3 text-xs text-zinc-500 font-mono">
                    {lang}
                  </span>
                )}
                <pre className="overflow-x-auto rounded-xl bg-zinc-900 border border-zinc-700/80 p-4 text-sm font-mono text-zinc-200 leading-relaxed">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          pre: ({ children }) => <>{children}</>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 mb-4 text-zinc-300 pl-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-4 text-zinc-300 pl-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-violet-500 pl-4 py-1 my-4 text-zinc-400 italic bg-zinc-800/40 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-zinc-700 my-8" />,
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="rounded-xl max-w-full my-6 border border-zinc-700/50"
              loading="lazy"
            />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-800">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-zinc-300 uppercase tracking-wider border border-zinc-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-zinc-300 border border-zinc-700/60">{children}</td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-zinc-800/30">{children}</tr>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
