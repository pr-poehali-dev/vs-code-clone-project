import { FSNode, uid } from './vfs';
import { VSCODE_HTML } from './vscodeHtml';

const f = (name: string, content: string): FSNode => ({ id: uid(), name, type: 'file', content });
const dir = (name: string, children: FSNode[], open = false): FSNode => ({ id: uid(), name, type: 'folder', open, children });

// ─── Реальные исходники проекта ───────────────────────────────────────────────

const SRC_MAIN_TSX = `import * as React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
`;

const SRC_APP_TSX = `
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
`;

const SRC_INDEX_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
`;

const LIB_UTILS_TS = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

const LIB_HIGHLIGHT_TS = `export type Token = { text: string; color: string };

const COLORS = {
  keyword: '#c586c0',
  control: '#c586c0',
  type: '#4ec9b0',
  func: '#dcdcaa',
  string: '#ce9178',
  number: '#b5cea8',
  comment: '#6a9955',
  operator: '#d4d4d4',
  variable: '#9cdcfe',
  tag: '#569cd6',
  attr: '#9cdcfe',
  property: '#9cdcfe',
  punct: '#d4d4d4',
  plain: '#d4d4d4',
  boolean: '#569cd6',
};

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'break', 'continue', 'new', 'class', 'extends',
  'import', 'export', 'from', 'default', 'async', 'await', 'try', 'catch',
  'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'delete', 'void',
  'yield', 'static', 'get', 'set', 'public', 'private', 'protected', 'interface',
  'type', 'enum', 'implements', 'namespace', 'def', 'elif', 'lambda', 'pass',
  'raise', 'with', 'as', 'global', 'nonlocal', 'and', 'or', 'not', 'is', 'None',
  'print', 'self', 'super', 'this', 'then', 'struct', 'fn', 'let', 'mut', 'pub',
  'use', 'impl', 'match', 'package', 'func', 'go', 'defer', 'chan',
]);

const TYPES = new Set([
  'string', 'number', 'boolean', 'any', 'void', 'never', 'unknown', 'object',
  'int', 'float', 'char', 'bool', 'str', 'list', 'dict', 'tuple', 'set',
  'Array', 'Object', 'String', 'Number', 'Boolean', 'Promise', 'Map', 'Set',
  'React', 'Component', 'JSX', 'HTMLElement', 'Date', 'Math', 'JSON', 'console',
]);

const BOOLEANS = new Set(['true', 'false', 'null', 'undefined', 'True', 'False', 'nil']);

function span(text: string, color: string): Token {
  return { text, color };
}

function highlightCode(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = line.length;
  while (i < n) {
    const ch = line[i];
    if (ch === ' ' || ch === '\\t') {
      let j = i;
      while (j < n && (line[j] === ' ' || line[j] === '\\t')) j++;
      tokens.push(span(line.slice(i, j), COLORS.plain));
      i = j; continue;
    }
    if ((ch === '/' && line[i + 1] === '/') || ch === '#') {
      tokens.push(span(line.slice(i), COLORS.comment)); break;
    }
    if (ch === '"' || ch === "'" || ch === '\`') {
      let j = i + 1;
      while (j < n && line[j] !== ch) { if (line[j] === '\\\\') j++; j++; }
      j = Math.min(j + 1, n);
      tokens.push(span(line.slice(i, j), COLORS.string));
      i = j; continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9a-fx._]/i.test(line[j])) j++;
      tokens.push(span(line.slice(i, j), COLORS.number));
      i = j; continue;
    }
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i;
      while (j < n && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      let after = j;
      while (after < n && line[after] === ' ') after++;
      const isCall = line[after] === '(';
      let color = COLORS.variable;
      if (KEYWORDS.has(word)) color = COLORS.keyword;
      else if (BOOLEANS.has(word)) color = COLORS.boolean;
      else if (TYPES.has(word)) color = COLORS.type;
      else if (isCall) color = COLORS.func;
      else if (/^[A-Z]/.test(word)) color = COLORS.type;
      tokens.push(span(word, color));
      i = j; continue;
    }
    if (/[{}()[\\];,.]/.test(ch)) { tokens.push(span(ch, COLORS.punct)); i++; continue; }
    if (/[+\\-*/%=<>!&|^~?:]/.test(ch)) { tokens.push(span(ch, COLORS.operator)); i++; continue; }
    tokens.push(span(ch, COLORS.plain)); i++;
  }
  return tokens;
}

export function highlightLine(line: string, lang: string): Token[] {
  if (line.length === 0) return [span('', COLORS.plain)];
  return highlightCode(line);
}

export function detectLang(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript',
    py: 'python', json: 'json', html: 'html', htm: 'html', xml: 'xml',
    css: 'css', scss: 'css', md: 'markdown', go: 'go', rs: 'rust',
    java: 'java', c: 'c', cpp: 'cpp', sh: 'bash',
  };
  return map[ext] || 'text';
}
`;

const LIB_VFS_TS = `export type FSNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FSNode[];
  open?: boolean;
};

let idc = 0;
export const uid = () => \`n\${Date.now()}_\${idc++}\`;

export function findNode(tree: FSNode[], id: string): FSNode | null {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const f = findNode(n.children, id);
      if (f) return f;
    }
  }
  return null;
}

export function removeNode(tree: FSNode[], id: string): FSNode[] {
  return tree
    .filter((n) => n.id !== id)
    .map((n) => n.children ? { ...n, children: removeNode(n.children, id) } : n);
}

export function updateNode(tree: FSNode[], id: string, patch: Partial<FSNode>): FSNode[] {
  return tree.map((n) => {
    if (n.id === id) return { ...n, ...patch };
    if (n.children) return { ...n, children: updateNode(n.children, id, patch) };
    return n;
  });
}

export function addNode(tree: FSNode[], parentId: string | null, node: FSNode): FSNode[] {
  if (parentId === null) return [...tree, node];
  return tree.map((n) => {
    if (n.id === parentId && n.type === 'folder') {
      return { ...n, open: true, children: [...(n.children || []), node] };
    }
    if (n.children) return { ...n, children: addNode(n.children, parentId, node) };
    return n;
  });
}
`;

const UI_ICON_TSX = `import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
  fallback?: string;
}

const Icon: React.FC<IconProps> = ({ name, fallback = 'CircleAlert', ...props }) => {
  const IconComponent = (LucideIcons as Record<string, React.FC<LucideProps>>)[name];
  if (!IconComponent) {
    const FallbackIcon = (LucideIcons as Record<string, React.FC<LucideProps>>)[fallback];
    if (!FallbackIcon) return <span className="text-xs text-gray-400">[icon]</span>;
    return <FallbackIcon {...props} />;
  }
  return <IconComponent {...props} />;
};

export default Icon;
`;

const IDE_CODE_EDITOR_TSX = `import React, { useRef, useMemo } from 'react';
import { highlightLine } from '@/lib/highlight';

interface CodeEditorProps {
  value: string;
  lang: string;
  onChange: (v: string) => void;
}

const PAIRS: Record<string, string> = {
  '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '\`': '\`',
};
const CLOSERS = new Set([')', ']', '}', '"', "'", '\`']);

const KEYWORDS_ALL = [
  'function', 'return', 'const', 'let', 'import', 'export', 'default',
  'interface', 'console', 'useState', 'useEffect', 'className', 'onClick',
  'def', 'print', 'class', 'async', 'await', 'if', 'else', 'for', 'while',
];

export default function CodeEditor({ value, lang, onChange }: CodeEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const lines = value.split('\\n');
  const lineCount = lines.length;

  const highlighted = useMemo(
    () => lines.map((l) => highlightLine(l, lang)),
    [value, lang]
  );

  const setSelection = (val: string, pos: number) => {
    onChange(val);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) { ta.selectionStart = ta.selectionEnd = pos; }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (start === end) {
        const before = val.slice(0, start);
        const wordMatch = before.match(/([a-zA-Z_$]+)$/);
        if (wordMatch) {
          const word = wordMatch[1];
          const found = KEYWORDS_ALL.find(
            (k) => k.toLowerCase().startsWith(word.toLowerCase()) && k.length > word.length
          );
          if (found) {
            const insert = found.slice(word.length);
            setSelection(val.slice(0, start) + insert + val.slice(end), start + insert.length);
            return;
          }
        }
      }
      setSelection(val.slice(0, start) + '  ' + val.slice(end), start + 2);
      return;
    }

    if (PAIRS[e.key] && start === end) {
      e.preventDefault();
      const close = PAIRS[e.key];
      setSelection(val.slice(0, start) + e.key + close + val.slice(end), start + 1);
      return;
    }

    if (CLOSERS.has(e.key) && val[start] === e.key && start === end) {
      e.preventDefault();
      setSelection(val, start + 1);
      return;
    }

    if (e.key === 'Backspace' && start === end && start > 0) {
      const prev = val[start - 1];
      const next = val[start];
      if (PAIRS[prev] && PAIRS[prev] === next) {
        e.preventDefault();
        setSelection(val.slice(0, start - 1) + val.slice(start + 1), start - 1);
        return;
      }
    }

    if (e.key === 'Enter') {
      const lineStart = val.lastIndexOf('\\n', start - 1) + 1;
      const indentMatch = val.slice(lineStart, start).match(/^[ \\t]*/);
      const indent = indentMatch ? indentMatch[0] : '';
      const prevChar = val[start - 1];
      const nextChar = val[start];
      if (prevChar && '([{'.includes(prevChar)) {
        e.preventDefault();
        const extra = indent + '  ';
        if (nextChar && ')]}'.includes(nextChar)) {
          setSelection(val.slice(0, start) + '\\n' + extra + '\\n' + indent + val.slice(start), start + 1 + extra.length);
        } else {
          setSelection(val.slice(0, start) + '\\n' + extra + val.slice(start), start + 1 + extra.length);
        }
        return;
      }
      if (indent) {
        e.preventDefault();
        setSelection(val.slice(0, start) + '\\n' + indent + val.slice(end), start + 1 + indent.length);
        return;
      }
    }
  };

  return (
    <div className="relative flex-1 overflow-auto bg-[#1e1e1e] font-mono text-[13.5px] leading-[20px]">
      <div className="flex min-h-full">
        <div className="select-none py-3 pl-4 pr-3 text-right text-[#858585] sticky left-0 bg-[#1e1e1e] z-10" style={{ minWidth: 56 }}>
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-[20px]">{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 py-3 pr-6">
          <div className="pointer-events-none absolute inset-0 py-3 pr-6 whitespace-pre" aria-hidden>
            {highlighted.map((tokens, i) => (
              <div key={i} className="h-[20px]">
                {tokens.map((t, j) => <span key={j} style={{ color: t.color }}>{t.text}</span>)}
              </div>
            ))}
          </div>
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            wrap="off"
            className="relative z-10 w-full resize-none bg-transparent text-transparent caret-white outline-none whitespace-pre overflow-hidden"
            style={{ height: lineCount * 20, minHeight: '100%', fontFamily: 'inherit', fontSize: 'inherit', lineHeight: '20px' }}
          />
        </div>
      </div>
    </div>
  );
}
`;

const IDE_FILE_TREE_TSX = `import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { FSNode } from '@/lib/vfs';

interface FileTreeProps {
  nodes: FSNode[];
  activeId: string | null;
  depth?: number;
  onOpenFile: (node: FSNode) => void;
  onToggleFolder: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onCreate: (parentId: string, type: 'file' | 'folder') => void;
  renamingId: string | null;
  setRenamingId: (id: string | null) => void;
}

function fileIcon(name: string): { name: string; color: string } {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'tsx': case 'jsx': return { name: 'FileCode2', color: '#4ec9b0' };
    case 'ts': return { name: 'FileCode2', color: '#3178c6' };
    case 'js': return { name: 'FileCode2', color: '#f0db4f' };
    case 'py': return { name: 'FileCode2', color: '#4b8bbe' };
    case 'json': return { name: 'FileJson', color: '#f0db4f' };
    case 'html': return { name: 'FileCode', color: '#e34c26' };
    case 'css': return { name: 'FileType', color: '#563d7c' };
    case 'md': return { name: 'FileText', color: '#9cdcfe' };
    default: return { name: 'File', color: '#858585' };
  }
}

export default function FileTree(props: FileTreeProps) {
  const { nodes, activeId, depth = 0, onOpenFile, onToggleFolder, onRename, onDelete, onCreate, renamingId, setRenamingId } = props;
  const [menu, setMenu] = useState<{ id: string; type: 'file' | 'folder'; x: number; y: number } | null>(null);
  const sorted = [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return (
    <div className="text-[13px] text-[#cccccc]" onClick={() => menu && setMenu(null)}>
      {sorted.map((node) => (
        <div key={node.id}>
          <div
            className={\`group flex items-center gap-1 pr-2 py-[3px] cursor-pointer hover:bg-[#2a2d2e] \${activeId === node.id ? 'bg-[#37373d]' : ''}\`}
            style={{ paddingLeft: 8 + depth * 12 }}
            onClick={() => node.type === 'folder' ? onToggleFolder(node.id) : onOpenFile(node)}
            onContextMenu={(e) => { e.preventDefault(); setMenu({ id: node.id, type: node.type, x: e.clientX, y: e.clientY }); }}
          >
            {node.type === 'folder'
              ? <Icon name={node.open ? 'ChevronDown' : 'ChevronRight'} size={14} className="text-[#858585] shrink-0" />
              : <span className="w-[14px] shrink-0" />}
            {node.type === 'folder'
              ? <Icon name={node.open ? 'FolderOpen' : 'Folder'} size={15} className="text-[#dcb67a] shrink-0" />
              : <Icon name={fileIcon(node.name).name} size={15} style={{ color: fileIcon(node.name).color }} className="shrink-0" fallback="File" />}
            {renamingId === node.id
              ? <input autoFocus defaultValue={node.name} className="ml-1 bg-[#3c3c3c] border border-[#007acc] text-[#cccccc] px-1 outline-none text-[13px] w-full"
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => { onRename(node.id, e.target.value.trim() || node.name); setRenamingId(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { onRename(node.id, (e.target as HTMLInputElement).value.trim() || node.name); setRenamingId(null); } if (e.key === 'Escape') setRenamingId(null); }} />
              : <span className="ml-1 truncate">{node.name}</span>}
          </div>
          {node.type === 'folder' && node.open && node.children && (
            <FileTree {...props} nodes={node.children} depth={depth + 1} />
          )}
        </div>
      ))}
      {menu && (
        <div className="fixed z-50 min-w-[180px] rounded bg-[#252526] border border-[#454545] py-1 text-[13px] shadow-2xl" style={{ left: menu.x, top: menu.y }} onClick={(e) => e.stopPropagation()}>
          {menu.type === 'folder' && (<>
            <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e]" onClick={() => { onCreate(menu.id, 'file'); setMenu(null); }}><Icon name="FilePlus" size={14} /> Новый файл</button>
            <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e]" onClick={() => { onCreate(menu.id, 'folder'); setMenu(null); }}><Icon name="FolderPlus" size={14} /> Новая папка</button>
            <div className="my-1 h-px bg-[#454545]" />
          </>)}
          <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e]" onClick={() => { setRenamingId(menu.id); setMenu(null); }}><Icon name="Pencil" size={14} /> Переименовать</button>
          <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e] text-[#f48771]" onClick={() => { onDelete(menu.id); setMenu(null); }}><Icon name="Trash2" size={14} /> Удалить</button>
        </div>
      )}
    </div>
  );
}
`;

const IDE_TERMINAL_TSX = `import React, { useState, useRef, useEffect } from 'react';

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
    const out: Line[] = [{ text: \`➜  project $ \${cmd}\`, type: 'cmd' }];
    const trimmed = cmd.trim();
    const [name, ...args] = trimmed.split(/\\s+/);
    if (!trimmed) { setLines((l) => [...l, ...out]); return; }
    setHistory((h) => [...h, cmd]);
    setHIdx(-1);
    const extra = onCommand?.(trimmed);
    if (extra && extra.length) { out.push(...extra.map((t) => ({ text: t, type: 'out' as const }))); setLines((l) => [...l, ...out]); return; }
    switch (name) {
      case 'help': out.push({ text: 'Команды: help, clear, echo, ls, npm, python, node, date, whoami', type: 'out' }); break;
      case 'clear': setLines([]); return;
      case 'echo': out.push({ text: args.join(' '), type: 'out' }); break;
      case 'ls': out.push({ text: 'src/  package.json  index.html  README.md  tailwind.config.ts  tsconfig.json  vite.config.ts', type: 'out' }); break;
      case 'npm':
        if (args[0] === 'run' && args[1] === 'dev') { out.push({ text: 'VITE v5.0  ready in 312 ms', type: 'out' }); out.push({ text: '➜  Local:   http://localhost:5173/', type: 'out' }); }
        else if (args[0] === 'install' || args[0] === 'i') { out.push({ text: 'added 214 packages in 3s', type: 'out' }); }
        else { out.push({ text: \`npm \${args.join(' ')}: ok\`, type: 'out' }); }
        break;
      case 'python': case 'python3': out.push({ text: 'Python 3.11.4 — выполнено успешно', type: 'out' }); break;
      case 'node': out.push({ text: 'v20.10.0', type: 'out' }); break;
      case 'date': out.push({ text: new Date().toString(), type: 'out' }); break;
      case 'whoami': out.push({ text: 'developer', type: 'out' }); break;
      default: out.push({ text: \`command not found: \${name}\`, type: 'err' });
    }
    setLines((l) => [...l, ...out]);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { run(input); setInput(''); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const idx = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1); if (history[idx] !== undefined) { setInput(history[idx]); setHIdx(idx); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIdx < 0) return; const idx = hIdx + 1; if (idx >= history.length) { setInput(''); setHIdx(-1); } else { setInput(history[idx]); setHIdx(idx); } }
  };

  return (
    <div className="flex h-full flex-col bg-[#181818] font-mono text-[12.5px] leading-[18px] text-[#cccccc]" onClick={() => inputRef.current?.focus()}>
      <div className="flex-1 overflow-auto px-3 py-2">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap" style={{ color: l.type === 'cmd' ? '#4ec9b0' : l.type === 'err' ? '#f48771' : l.type === 'sys' ? '#858585' : '#cccccc' }}>{l.text}</div>
        ))}
        <div className="flex items-center">
          <span className="text-[#4ec9b0] shrink-0">➜  project $ </span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} className="flex-1 bg-transparent outline-none text-[#cccccc]" spellCheck={false} autoFocus />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}
`;

const PAGES_INDEX_TSX = `import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import CodeEditor from '@/components/ide/CodeEditor';
import FileTree from '@/components/ide/FileTree';
import Terminal from '@/components/ide/Terminal';
import { detectLang } from '@/lib/highlight';
import { FSNode, findNode, removeNode, updateNode, addNode, uid } from '@/lib/vfs';
import { projectTree } from '@/lib/projectSource';

type Panel = 'files' | 'search' | 'debug' | 'ext';
interface OpenTab { id: string; name: string; }

const ACTIVITY = [
  { key: 'files' as Panel, icon: 'Files', label: 'Проводник' },
  { key: 'search' as Panel, icon: 'Search', label: 'Поиск' },
  { key: 'debug' as Panel, icon: 'Bug', label: 'Отладка' },
  { key: 'ext' as Panel, icon: 'Blocks', label: 'Расширения' },
];

export default function Index() {
  const [tree, setTree] = useState<FSNode[]>(projectTree);
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>('files');
  const [showTerminal, setShowTerminal] = useState(true);

  const activeNode = activeId ? findNode(tree, activeId) : null;
  const activeLang = activeNode ? detectLang(activeNode.name) : 'text';

  // ... остальная логика IDE
  return <div className="flex h-screen bg-[#1e1e1e]">{/* IDE layout */}</div>;
}
`;

const PACKAGE_JSON = `{
  "name": "vite_react_shadcn_ts",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@tanstack/react-query": "^5.56.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.462.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.3",
    "vite": "npm:rolldown-vite@7.1.13"
  }
}
`;

const TAILWIND_CONFIG_TS = `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
`;

const TSCONFIG_JSON = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;

const VITE_CONFIG_TS = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    hmr: { overlay: false, timeout: 7000 }
  },
}));
`;

const INDEX_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>VS Code Clone</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
`;

const README_MD = `# VS Code Clone

Точная копия редактора VS Code, собранная на React + Vite + Tailwind CSS.

## Возможности
- Подсветка синтаксиса (TS, JS, Python, HTML, CSS, JSON и другие)
- Вкладки открытых файлов с индикатором несохранённых изменений
- Дерево файлов: создание, переименование, удаление (правый клик)
- Автодополнение по Tab, автозакрытие скобок и кавычек
- Умные отступы при Enter
- Встроенный терминал (help, clear, ls, npm, python, node...)
- Глобальный поиск и замена по всем файлам
- Панель отладки с точками останова
- Маркетплейс расширений

## Структура
\`\`\`
src/
  components/
    ide/
      CodeEditor.tsx   — редактор с подсветкой синтаксиса
      FileTree.tsx     — дерево файлов
      Terminal.tsx     — встроенный терминал
    ui/
      icon.tsx         — обёртка над lucide-react
  lib/
    highlight.ts       — движок подсветки синтаксиса
    vfs.ts             — виртуальная файловая система
    projectSource.ts   — исходники проекта для IDE
  pages/
    Index.tsx          — главный экран IDE
  main.tsx
  App.tsx
  index.css
package.json
tailwind.config.ts
tsconfig.json
vite.config.ts
index.html
\`\`\`

## Запуск
\`\`\`bash
npm install
npm run dev
\`\`\`
`;

// ─── Дерево, точно повторяющее реальную структуру проекта ─────────────────────
export const projectTree: FSNode[] = [
  dir('src', [
    dir('components', [
      dir('ide', [
        f('CodeEditor.tsx', IDE_CODE_EDITOR_TSX),
        f('FileTree.tsx', IDE_FILE_TREE_TSX),
        f('Terminal.tsx', IDE_TERMINAL_TSX),
      ], true),
      dir('ui', [
        f('icon.tsx', UI_ICON_TSX),
      ]),
    ], true),
    dir('lib', [
      f('highlight.ts', LIB_HIGHLIGHT_TS),
      f('projectSource.ts', '// Этот файл содержит исходники проекта для отображения внутри IDE.\n// Смотри src/lib/projectSource.ts в реальном проекте.\n'),
      f('utils.ts', LIB_UTILS_TS),
      f('vfs.ts', LIB_VFS_TS),
    ], true),
    dir('pages', [
      f('Index.tsx', PAGES_INDEX_TSX),
      f('NotFound.tsx', "import { Link } from 'react-router-dom';\n\nexport default function NotFound() {\n  return (\n    <div className=\"min-h-screen flex items-center justify-center bg-[#1e1e1e] text-white\">\n      <div className=\"text-center\">\n        <h1 className=\"text-6xl font-bold text-[#858585]\">404</h1>\n        <p className=\"mt-4 text-xl\">Страница не найдена</p>\n        <Link to=\"/\" className=\"mt-6 inline-block text-[#007acc] hover:underline\">← На главную</Link>\n      </div>\n    </div>\n  );\n}\n"),
    ], true),
    f('App.tsx', SRC_APP_TSX),
    f('index.css', SRC_INDEX_CSS),
    f('main.tsx', SRC_MAIN_TSX),
    f('vite-env.d.ts', '/// <reference types="vite/client" />\n'),
  ], true),
  f('index.html', INDEX_HTML),
  f('package.json', PACKAGE_JSON),
  f('README.md', README_MD),
  f('tailwind.config.ts', TAILWIND_CONFIG_TS),
  f('tsconfig.json', TSCONFIG_JSON),
  f('vite.config.ts', VITE_CONFIG_TS),
  f('vscode.html', VSCODE_HTML),
];
