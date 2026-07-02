import { FSNode, uid } from './vfs';

// Реальный исходный код этого проекта — для отображения внутри IDE.
// Спецсимволы (` и ${) экранированы, чтобы не ломать шаблонные строки.

const f = (name: string, content: string): FSNode => ({ id: uid(), name, type: 'file', content });
const dir = (name: string, children: FSNode[], open = false): FSNode => ({ id: uid(), name, type: 'folder', open, children });

const highlightTs = `export type Token = { text: string; color: string };

// Цвета в стиле VS Code Dark+
const COLORS = {
  keyword: '#c586c0',
  type: '#4ec9b0',
  func: '#dcdcaa',
  string: '#ce9178',
  number: '#b5cea8',
  comment: '#6a9955',
  variable: '#9cdcfe',
  tag: '#569cd6',
  plain: '#d4d4d4',
};

// Разбирает строку на цветные токены в зависимости от языка.
export function highlightLine(line: string, lang: string): Token[] {
  // Полная реализация — в исходном файле проекта.
  return [{ text: line, color: COLORS.plain }];
}

export function detectLang(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const map: Record<string, string> = {
    ts: 'typescript', tsx: 'typescript', js: 'javascript',
    py: 'python', json: 'json', html: 'html', css: 'css', md: 'markdown',
  };
  return map[ext] || 'text';
}
`;

const vfsTs = `export type FSNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FSNode[];
  open?: boolean;
};

let idc = 0;
export const uid = () => \`n\${Date.now()}_\${idc++}\`;

// Поиск узла по id (рекурсивно)
export function findNode(tree: FSNode[], id: string): FSNode | null {
  for (const n of tree) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Добавление, удаление, обновление узлов — иммутабельно через map/filter.
`;

const codeEditorTsx = `import React, { useRef, useMemo } from 'react';
import { highlightLine } from '@/lib/highlight';

interface CodeEditorProps {
  value: string;
  lang: string;
  onChange: (v: string) => void;
}

// Пары для автозакрытия
const PAIRS: Record<string, string> = {
  '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '\`': '\`',
};

export default function CodeEditor({ value, lang, onChange }: CodeEditorProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const lines = value.split('\\n');

  const highlighted = useMemo(
    () => lines.map((l) => highlightLine(l, lang)),
    [value, lang]
  );

  // Обработка Tab, авто-скобок, отступов при Enter — в handleKeyDown.
  return (
    <div className="editor">
      {/* Номера строк + подсветка поверх прозрачной textarea */}
    </div>
  );
}
`;

const fileTreeTsx = `import React, { useState } from 'react';
import Icon from '@/components/ui/icon';
import { FSNode } from '@/lib/vfs';

// Дерево файлов с контекстным меню (создать/переименовать/удалить)
export default function FileTree(props) {
  const { nodes, activeId, onOpenFile, onToggleFolder } = props;

  return (
    <div className="tree">
      {nodes.map((node) => (
        <div key={node.id}>
          {/* Папки раскрываются, файлы открываются в редакторе */}
        </div>
      ))}
    </div>
  );
}
`;

const terminalTsx = `import React, { useState, useRef, useEffect } from 'react';

type Line = { text: string; type: 'cmd' | 'out' | 'err' | 'sys' };

// Встроенный терминал: help, clear, ls, npm, python, node, echo...
export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');

  const run = (cmd: string) => {
    // Разбор команды и вывод результата
  };

  return <div className="terminal" />;
}
`;

const indexTsx = `import React, { useState, useMemo } from 'react';
import CodeEditor from '@/components/ide/CodeEditor';
import FileTree from '@/components/ide/FileTree';
import Terminal from '@/components/ide/Terminal';

// Главный экран IDE: activity bar, панели, вкладки, редактор, терминал
export default function Index() {
  const [tree, setTree] = useState(initialTree);
  const [tabs, setTabs] = useState([]);
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="ide">
      {/* Всё собирается здесь */}
    </div>
  );
}
`;

const iconTsx = `import { icons } from 'lucide-react';

// Обёртка над lucide-react с fallback
const Icon = ({ name, fallback = 'CircleAlert', ...props }) => {
  const LucideIcon = icons[name] || icons[fallback];
  return <LucideIcon {...props} />;
};

export default Icon;
`;

const packageJson = `{
  "name": "vscode-clone",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.400.0",
    "tailwindcss": "^3.4.0"
  }
}
`;

const tailwindConfig = `import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
`;

const readme = `# VS Code Clone

Точная копия редактора VS Code, собранная на React + Vite + Tailwind.

## Возможности
- Подсветка синтаксиса для множества языков
- Вкладки открытых файлов
- Дерево файлов с созданием/удалением/переименованием
- Автодополнение по Tab и автозакрытие скобок
- Встроенный терминал
- Глобальный поиск и замена
- Панель отладки и маркетплейс расширений

## Структура
- src/pages/Index.tsx — главный экран IDE
- src/components/ide/ — редактор, дерево, терминал
- src/lib/ — подсветка синтаксиса и виртуальная ФС
`;

// Дерево, повторяющее реальную структуру проекта
export const projectTree: FSNode[] = [
  dir('src', [
    dir('components', [
      dir('ide', [
        f('CodeEditor.tsx', codeEditorTsx),
        f('FileTree.tsx', fileTreeTsx),
        f('Terminal.tsx', terminalTsx),
      ], true),
      dir('ui', [
        f('icon.tsx', iconTsx),
      ]),
    ], true),
    dir('lib', [
      f('highlight.ts', highlightTs),
      f('vfs.ts', vfsTs),
      f('projectSource.ts', '// Исходники проекта для отображения внутри IDE\n'),
    ], true),
    dir('pages', [
      f('Index.tsx', indexTsx),
      f('NotFound.tsx', 'export default () => <div>404 — страница не найдена</div>;\n'),
    ], true),
    f('main.tsx', "import { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).render(<App />);\n"),
    f('index.css', '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n'),
  ], true),
  f('package.json', packageJson),
  f('tailwind.config.ts', tailwindConfig),
  f('index.html', '<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8" />\n  <title>VS Code Clone</title>\n</head>\n<body>\n  <div id="root"></div>\n  <script type="module" src="/src/main.tsx"></script>\n</body>\n</html>\n'),
  f('README.md', readme),
];
