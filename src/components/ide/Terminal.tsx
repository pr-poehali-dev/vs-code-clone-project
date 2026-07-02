import React, { useState, useRef, useEffect } from 'react';

type Line = { text: string; type: 'cmd' | 'out' | 'err' | 'sys' };

interface TerminalProps {
  onCommand?: (cmd: string) => string[];
}

export default function Terminal({ onCommand }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { text: 'IDE Terminal — bash 5.2', type: 'sys' },
    { text: 'Наберите "help" для списка команд.', type: 'sys' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView(); }, [lines]);

  const run = (cmd: string) => {
    const out: Line[] = [{ text: `➜  project $ ${cmd}`, type: 'cmd' }];
    const trimmed = cmd.trim();
    const [name, ...args] = trimmed.split(/\s+/);

    if (!trimmed) {
      setLines((l) => [...l, ...out]);
      return;
    }
    setHistory((h) => [...h, cmd]);
    setHIdx(-1);

    const extra = onCommand?.(trimmed);
    if (extra && extra.length) {
      out.push(...extra.map((t) => ({ text: t, type: 'out' as const })));
      setLines((l) => [...l, ...out]);
      return;
    }

    switch (name) {
      case 'help':
        out.push({ text: 'Команды: help, clear, echo, ls, npm, python, node, date, whoami', type: 'out' });
        break;
      case 'clear':
        setLines([]);
        return;
      case 'echo':
        out.push({ text: args.join(' '), type: 'out' });
        break;
      case 'ls':
        out.push({ text: 'src/  package.json  index.html  README.md', type: 'out' });
        break;
      case 'npm':
        if (args[0] === 'run' && args[1] === 'dev') {
          out.push({ text: 'VITE v5.0  ready in 312 ms', type: 'out' });
          out.push({ text: '➜  Local:   http://localhost:5173/', type: 'out' });
        } else if (args[0] === 'install' || args[0] === 'i') {
          out.push({ text: 'added 214 packages in 3s', type: 'out' });
        } else {
          out.push({ text: `npm ${args.join(' ')}: ok`, type: 'out' });
        }
        break;
      case 'python': case 'python3':
        out.push({ text: 'Python 3.11.4 — выполнено успешно', type: 'out' });
        break;
      case 'node':
        out.push({ text: 'v20.10.0', type: 'out' });
        break;
      case 'date':
        out.push({ text: new Date().toString(), type: 'out' });
        break;
      case 'whoami':
        out.push({ text: 'developer', type: 'out' });
        break;
      default:
        out.push({ text: `command not found: ${name}`, type: 'err' });
    }
    setLines((l) => [...l, ...out]);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { run(input); setInput(''); }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      if (history[idx] !== undefined) { setInput(history[idx]); setHIdx(idx); }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < 0) return;
      const idx = hIdx + 1;
      if (idx >= history.length) { setInput(''); setHIdx(-1); }
      else { setInput(history[idx]); setHIdx(idx); }
    }
  };

  return (
    <div
      className="flex h-full flex-col bg-[#181818] font-mono text-[12.5px] leading-[18px] text-[#cccccc]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-auto px-3 py-2">
        {lines.map((l, i) => (
          <div
            key={i}
            className="whitespace-pre-wrap"
            style={{
              color: l.type === 'cmd' ? '#4ec9b0' : l.type === 'err' ? '#f48771' : l.type === 'sys' ? '#858585' : '#cccccc',
            }}
          >
            {l.text}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-[#4ec9b0] shrink-0">➜&nbsp;&nbsp;project $&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="flex-1 bg-transparent outline-none text-[#cccccc]"
            spellCheck={false}
            autoFocus
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
