export type FSNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FSNode[];
  open?: boolean;
};

let idc = 0;
export const uid = () => `n${Date.now()}_${idc++}`;

export const initialTree: FSNode[] = [
  {
    id: uid(), name: 'src', type: 'folder', open: true, children: [
      {
        id: uid(), name: 'components', type: 'folder', open: false, children: [
          {
            id: uid(), name: 'Button.tsx', type: 'file', content:
`import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'ghost';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  const styles = variant === 'primary' ? 'bg-blue-500' : 'bg-transparent';
  return (
    <button className={styles} onClick={onClick}>
      {label}
    </button>
  );
}
`
          },
        ]
      },
      {
        id: uid(), name: 'App.tsx', type: 'file', content:
`import React, { useState } from 'react';
import { Button } from './components/Button';

// Точка входа приложения
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log('Кликнули! Счёт:', count);
  };

  return (
    <div className="app">
      <h1>Привет, мир!</h1>
      <p>Нажатий: {count}</p>
      <Button label="Нажми меня" onClick={handleClick} />
    </div>
  );
}

export default App;
`
      },
      {
        id: uid(), name: 'main.py', type: 'file', content:
`import sys
from typing import List

# Быстрая сортировка
def quicksort(arr: List[int]) -> List[int]:
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

if __name__ == "__main__":
    data = [3, 6, 1, 8, 2, 9, 4]
    print("Отсортировано:", quicksort(data))
`
      },
      {
        id: uid(), name: 'styles.css', type: 'file', content:
`:root {
  --primary: #007acc;
  --bg: #1e1e1e;
}

.app {
  background: var(--bg);
  color: #ffffff;
  padding: 24px;
  font-family: sans-serif;
}

.app h1 {
  font-size: 2rem;
  margin-bottom: 12px;
}
`
      },
    ]
  },
  {
    id: uid(), name: 'package.json', type: 'file', content:
`{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
`
  },
  {
    id: uid(), name: 'index.html', type: 'file', content:
`<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Мой проект</title>
  <link rel="stylesheet" href="src/styles.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="src/main.tsx"></script>
</body>
</html>
`
  },
  {
    id: uid(), name: 'README.md', type: 'file', content:
`# Мой проект

Демо-проект внутри онлайн IDE.

## Возможности
- Подсветка синтаксиса
- Вкладки файлов
- Встроенный терминал
`
  },
];

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
