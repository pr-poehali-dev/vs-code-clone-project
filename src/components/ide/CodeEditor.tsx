import React, { useRef, useMemo } from 'react';
import { highlightLine } from '@/lib/highlight';

interface CodeEditorProps {
  value: string;
  lang: string;
  onChange: (v: string) => void;
}

const PAIRS: Record<string, string> = {
  '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`',
};
const CLOSERS = new Set([')', ']', '}', '"', "'", '`']);

const KEYWORDS_ALL = [
  'function', 'return', 'const', 'let', 'import', 'export', 'default',
  'interface', 'console', 'useState', 'useEffect', 'className', 'onClick',
  'def', 'print', 'class', 'async', 'await', 'if', 'else', 'for', 'while',
];

export default function CodeEditor({ value, lang, onChange }: CodeEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const lines = value.split('\n');
  const lineCount = lines.length;

  const highlighted = useMemo(
    () => lines.map((l) => highlightLine(l, lang)),
    [value, lang]
  );

  const setSelection = (val: string, pos: number) => {
    onChange(val);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) {
        ta.selectionStart = ta.selectionEnd = pos;
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;

    // Tab: indent or autocomplete keyword
    if (e.key === 'Tab') {
      e.preventDefault();
      if (start === end) {
        // Try autocomplete on the word before the cursor
        const before = val.slice(0, start);
        const wordMatch = before.match(/([a-zA-Z_$]+)$/);
        if (wordMatch) {
          const word = wordMatch[1];
          const found = KEYWORDS_ALL.find(
            (k) => k.toLowerCase().startsWith(word.toLowerCase()) && k.length > word.length
          );
          if (found) {
            const insert = found.slice(word.length);
            const nv = val.slice(0, start) + insert + val.slice(end);
            setSelection(nv, start + insert.length);
            return;
          }
        }
      }
      // Default: insert 2 spaces
      const nv = val.slice(0, start) + '  ' + val.slice(end);
      setSelection(nv, start + 2);
      return;
    }

    // Auto-close brackets/quotes
    if (PAIRS[e.key] && start === end) {
      e.preventDefault();
      const close = PAIRS[e.key];
      const nv = val.slice(0, start) + e.key + close + val.slice(end);
      setSelection(nv, start + 1);
      return;
    }

    // Skip over closing char
    if (CLOSERS.has(e.key) && val[start] === e.key && start === end) {
      e.preventDefault();
      setSelection(val, start + 1);
      return;
    }

    // Backspace: remove matching pair
    if (e.key === 'Backspace' && start === end && start > 0) {
      const prev = val[start - 1];
      const next = val[start];
      if (PAIRS[prev] && PAIRS[prev] === next) {
        e.preventDefault();
        const nv = val.slice(0, start - 1) + val.slice(start + 1);
        setSelection(nv, start - 1);
        return;
      }
    }

    // Enter: keep indentation
    if (e.key === 'Enter') {
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const indentMatch = val.slice(lineStart, start).match(/^[ \t]*/);
      const indent = indentMatch ? indentMatch[0] : '';
      const prevChar = val[start - 1];
      const nextChar = val[start];
      if (prevChar && '([{'.includes(prevChar)) {
        e.preventDefault();
        const extra = indent + '  ';
        if (nextChar && ')]}'.includes(nextChar)) {
          const nv = val.slice(0, start) + '\n' + extra + '\n' + indent + val.slice(start);
          setSelection(nv, start + 1 + extra.length);
        } else {
          const nv = val.slice(0, start) + '\n' + extra + val.slice(start);
          setSelection(nv, start + 1 + extra.length);
        }
        return;
      }
      if (indent) {
        e.preventDefault();
        const nv = val.slice(0, start) + '\n' + indent + val.slice(end);
        setSelection(nv, start + 1 + indent.length);
        return;
      }
    }
  };

  return (
    <div className="relative flex-1 overflow-auto bg-[#1e1e1e] font-mono text-[13.5px] leading-[20px]">
      <div className="flex min-h-full">
        {/* Line numbers */}
        <div
          className="select-none py-3 pl-4 pr-3 text-right text-[#858585] sticky left-0 bg-[#1e1e1e] z-10"
          style={{ minWidth: 56 }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-[20px]">{i + 1}</div>
          ))}
        </div>

        {/* Editor area */}
        <div className="relative flex-1 py-3 pr-6">
          {/* Highlighted layer */}
          <div
            className="pointer-events-none absolute inset-0 py-3 pr-6 whitespace-pre"
            aria-hidden
          >
            {highlighted.map((tokens, i) => (
              <div key={i} className="h-[20px]">
                {tokens.length === 0 || (tokens.length === 1 && tokens[0].text === '')
                  ? '\u200b'
                  : tokens.map((t, j) => (
                      <span key={j} style={{ color: t.color }}>{t.text}</span>
                    ))}
              </div>
            ))}
          </div>

          {/* Transparent textarea */}
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            wrap="off"
            className="relative z-10 w-full resize-none bg-transparent text-transparent caret-white outline-none whitespace-pre overflow-hidden"
            style={{
              height: lineCount * 20,
              minHeight: '100%',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              lineHeight: '20px',
            }}
          />
        </div>
      </div>
    </div>
  );
}
