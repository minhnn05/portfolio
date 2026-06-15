import { useState } from 'react';
import { Eye, PenLine } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function MarkdownEditor({ value, onChange, placeholder, rows = 16 }) {
  const [mode, setMode] = useState('write'); // write | preview

  return (
    <div className="border border-zinc-700 rounded-lg overflow-hidden focus-within:border-violet-500 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center border-b border-zinc-700 bg-zinc-800/50 px-2 py-1.5 gap-1">
        <button
          type="button"
          onClick={() => setMode('write')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors',
            mode === 'write' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white',
          )}
        >
          <PenLine size={12} /> Write
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors',
            mode === 'preview' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white',
          )}
        >
          <Eye size={12} /> Preview
        </button>
        <span className="ml-auto text-xs text-zinc-600">{value?.length ?? 0} ký tự</span>
      </div>

      {mode === 'write' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder ?? 'Viết nội dung Markdown ở đây...'}
          className="w-full px-4 py-3 bg-zinc-900 text-white text-sm font-mono placeholder-zinc-600 resize-y focus:outline-none"
        />
      ) : (
        <div
          className="min-h-[200px] px-4 py-3 bg-zinc-900 text-zinc-200 text-sm prose prose-invert prose-zinc max-w-none overflow-auto"
          style={{ minHeight: `${rows * 1.5}rem` }}
        >
          {value ? (
            /* Render markdown as preformatted for now — swap for react-markdown if added */
            <pre className="whitespace-pre-wrap font-sans text-zinc-300 leading-relaxed">{value}</pre>
          ) : (
            <p className="text-zinc-600 italic">Không có nội dung để preview.</p>
          )}
        </div>
      )}
    </div>
  );
}
