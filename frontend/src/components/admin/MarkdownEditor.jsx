import { useState, useCallback } from 'react';
import { Eye, PenLine, Columns2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import MarkdownRenderer from '../common/MarkdownRenderer';

/**
 * MarkdownEditor — 3 modes: write | preview | split
 * - split: editor trái + live preview phải (dùng trong full-page form)
 * - write/preview: tabs (dùng trong modal nhỏ nếu cần)
 * size: 'normal' | 'full' — full chiếm toàn bộ chiều cao còn lại
 */
export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 16,
  size = 'normal',
}) {
  const [mode, setMode] = useState(size === 'full' ? 'split' : 'write');

  const handleChange = useCallback(
    (e) => onChange(e.target.value),
    [onChange],
  );

  const editorMinH = size === 'full' ? 'min-h-[calc(100vh-280px)]' : '';
  const textareaRows = size === 'full' ? undefined : rows;

  const tabBtn = (m, icon, label) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors',
        mode === m ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white',
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      className={cn(
        'border border-zinc-700 rounded-xl overflow-hidden',
        'focus-within:border-violet-500/60 transition-colors',
        size === 'full' && 'flex flex-col flex-1',
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center border-b border-zinc-700 bg-zinc-800/60 px-3 py-1.5 gap-1 flex-shrink-0">
        {tabBtn('write',   <PenLine size={12} />,  'Write'  )}
        {tabBtn('preview', <Eye size={12} />,       'Preview')}
        {tabBtn('split',   <Columns2 size={12} />,  'Split'  )}
        <span className="ml-auto text-[10px] font-mono text-zinc-600">
          {value?.length ?? 0} chars
        </span>
      </div>

      {/* Body */}
      {mode === 'split' ? (
        /* ── Split mode: editor + live preview side by side ── */
        <div className={cn('grid grid-cols-2 divide-x divide-zinc-700/70', size === 'full' && 'flex-1 min-h-0')}>
          <textarea
            value={value}
            onChange={handleChange}
            rows={textareaRows}
            placeholder={placeholder ?? 'Viết Markdown ở đây...'}
            className={cn(
              'w-full px-4 py-3 bg-zinc-900 text-white text-sm font-mono',
              'placeholder-zinc-600 resize-none focus:outline-none',
              size === 'full' ? 'h-full' : '',
              editorMinH,
            )}
          />
          <div
            className={cn(
              'px-4 py-3 bg-zinc-950 overflow-y-auto',
              size === 'full' ? 'h-full' : '',
              editorMinH,
            )}
          >
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <p className="text-zinc-600 italic text-sm">Preview sẽ hiện ở đây...</p>
            )}
          </div>
        </div>
      ) : mode === 'preview' ? (
        /* ── Preview only ── */
        <div
          className={cn('px-4 py-3 bg-zinc-900 overflow-auto', editorMinH)}
          style={size !== 'full' ? { minHeight: `${rows * 1.5}rem` } : undefined}
        >
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-zinc-600 italic text-sm">Không có nội dung để preview.</p>
          )}
        </div>
      ) : (
        /* ── Write only ── */
        <textarea
          value={value}
          onChange={handleChange}
          rows={textareaRows}
          placeholder={placeholder ?? 'Viết Markdown ở đây...'}
          className={cn(
            'w-full px-4 py-3 bg-zinc-900 text-white text-sm font-mono',
            'placeholder-zinc-600 resize-y focus:outline-none',
            size === 'full' ? 'flex-1 min-h-0 h-full resize-none' : '',
            editorMinH,
          )}
        />
      )}
    </div>
  );
}
