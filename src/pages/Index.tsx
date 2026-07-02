import React, { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import CodeEditor from '@/components/ide/CodeEditor';
import FileTree from '@/components/ide/FileTree';
import Terminal from '@/components/ide/Terminal';
import { detectLang } from '@/lib/highlight';
import {
  FSNode, initialTree, findNode, removeNode, updateNode, addNode, uid,
} from '@/lib/vfs';

type Panel = 'files' | 'search' | 'debug' | 'ext';

interface OpenTab { id: string; name: string; }

const ACTIVITY: { key: Panel; icon: string; label: string }[] = [
  { key: 'files', icon: 'Files', label: 'Проводник' },
  { key: 'search', icon: 'Search', label: 'Поиск' },
  { key: 'debug', icon: 'Bug', label: 'Отладка' },
  { key: 'ext', icon: 'Blocks', label: 'Расширения' },
];

const EXTENSIONS = [
  { name: 'Prettier', desc: 'Форматирование кода', icon: 'Sparkles', dl: '38M', installed: true },
  { name: 'ESLint', desc: 'Линтер JavaScript', icon: 'ShieldCheck', dl: '31M', installed: true },
  { name: 'GitLens', desc: 'Суперсила Git', icon: 'GitBranch', dl: '28M', installed: false },
  { name: 'Material Theme', desc: 'Популярная тема', icon: 'Palette', dl: '19M', installed: false },
  { name: 'Python', desc: 'Поддержка Python', icon: 'FileCode2', dl: '112M', installed: false },
  { name: 'Live Server', desc: 'Локальный сервер', icon: 'Radio', dl: '45M', installed: false },
];

export default function Index() {
  const [tree, setTree] = useState<FSNode[]>(initialTree);
  const [tabs, setTabs] = useState<OpenTab[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>('files');
  const [showTerminal, setShowTerminal] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [installed, setInstalled] = useState<Set<string>>(new Set(['Prettier', 'ESLint']));

  const activeNode = activeId ? findNode(tree, activeId) : null;
  const activeLang = activeNode ? detectLang(activeNode.name) : 'text';

  const openFile = (node: FSNode) => {
    if (node.type !== 'file') return;
    setActiveId(node.id);
    setTabs((t) => t.some((x) => x.id === node.id) ? t : [...t, { id: node.id, name: node.name }]);
  };

  const closeTab = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTabs((t) => {
      const next = t.filter((x) => x.id !== id);
      if (activeId === id) setActiveId(next.length ? next[next.length - 1].id : null);
      return next;
    });
    setDirty((d) => { const n = new Set(d); n.delete(id); return n; });
  };

  const setContent = (v: string) => {
    if (!activeId) return;
    setTree((t) => updateNode(t, activeId, { content: v }));
    setDirty((d) => new Set(d).add(activeId));
  };

  const save = () => {
    if (!activeId) return;
    setDirty((d) => { const n = new Set(d); n.delete(activeId); return n; });
  };

  const toggleFolder = (id: string) => {
    const node = findNode(tree, id);
    if (node) setTree((t) => updateNode(t, id, { open: !node.open }));
  };

  const rename = (id: string, name: string) => {
    setTree((t) => updateNode(t, id, { name }));
    setTabs((tb) => tb.map((x) => x.id === id ? { ...x, name } : x));
  };

  const del = (id: string) => {
    setTree((t) => removeNode(t, id));
    closeTab(id);
  };

  const create = (parentId: string, type: 'file' | 'folder') => {
    const name = type === 'file' ? 'новый-файл.ts' : 'новая-папка';
    const node: FSNode = { id: uid(), name, type, content: type === 'file' ? '' : undefined, children: type === 'folder' ? [] : undefined, open: true };
    setTree((t) => addNode(t, parentId, node));
    if (type === 'file') openFile(node);
    setRenamingId(node.id);
  };

  const createRoot = (type: 'file' | 'folder') => {
    const name = type === 'file' ? 'новый-файл.ts' : 'новая-папка';
    const node: FSNode = { id: uid(), name, type, content: type === 'file' ? '' : undefined, children: type === 'folder' ? [] : undefined, open: true };
    setTree((t) => addNode(t, null, node));
    if (type === 'file') openFile(node);
    setRenamingId(node.id);
  };

  // Global search
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    const results: { node: FSNode; line: number; text: string }[] = [];
    const walk = (nodes: FSNode[]) => {
      for (const n of nodes) {
        if (n.type === 'file' && n.content) {
          n.content.split('\n').forEach((line, i) => {
            if (line.toLowerCase().includes(searchQuery.toLowerCase())) {
              results.push({ node: n, line: i + 1, text: line.trim() });
            }
          });
        }
        if (n.children) walk(n.children);
      }
    };
    walk(tree);
    return results;
  }, [searchQuery, tree]);

  const replaceAll = () => {
    if (!searchQuery) return;
    const walk = (nodes: FSNode[]): FSNode[] => nodes.map((n) => {
      let updated = n;
      if (n.type === 'file' && n.content?.includes(searchQuery)) {
        updated = { ...n, content: n.content.split(searchQuery).join(replaceQuery) };
      }
      if (updated.children) updated = { ...updated, children: walk(updated.children) };
      return updated;
    });
    setTree((t) => walk(t));
  };

  const toggleExtension = (name: string) => {
    setInstalled((s) => {
      const n = new Set(s);
      if (n.has(name)) n.delete(name); else n.add(name);
      return n;
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#1e1e1e] font-sans text-[#cccccc] select-none">
      {/* Title bar */}
      <div className="flex h-8 items-center justify-between bg-[#3c3c3c] px-3 text-[12px] shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-3 text-[#cccccc]">
            {['Файл', 'Правка', 'Выделение', 'Вид', 'Переход', 'Запуск', 'Справка'].map((m) => (
              <span key={m} className="mr-3 cursor-default hover:text-white">{m}</span>
            ))}
          </span>
        </div>
        <span className="text-[#858585]">my-project — Editor</span>
        <div className="w-16" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity bar */}
        <div className="flex w-12 flex-col items-center justify-between bg-[#333333] py-2 shrink-0">
          <div className="flex flex-col items-center gap-1">
            {ACTIVITY.map((a) => (
              <button
                key={a.key}
                title={a.label}
                onClick={() => setPanel(a.key)}
                className={`relative flex h-10 w-12 items-center justify-center ${
                  panel === a.key ? 'text-white' : 'text-[#858585] hover:text-white'
                }`}
              >
                {panel === a.key && <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-white" />}
                <Icon name={a.icon} size={22} fallback="Square" />
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <button className="flex h-10 w-12 items-center justify-center text-[#858585] hover:text-white" title="Аккаунт">
              <Icon name="CircleUser" size={22} />
            </button>
            <button className="flex h-10 w-12 items-center justify-center text-[#858585] hover:text-white" title="Настройки">
              <Icon name="Settings" size={22} />
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div className="flex w-64 flex-col bg-[#252526] shrink-0 overflow-hidden">
          {panel === 'files' && (
            <>
              <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
                <span>Проводник</span>
                <div className="flex gap-1">
                  <button title="Новый файл" onClick={() => createRoot('file')} className="hover:text-white text-[#858585]"><Icon name="FilePlus" size={16} /></button>
                  <button title="Новая папка" onClick={() => createRoot('folder')} className="hover:text-white text-[#858585]"><Icon name="FolderPlus" size={16} /></button>
                </div>
              </div>
              <div className="px-4 py-1 text-[11px] font-bold uppercase text-[#cccccc]">MY-PROJECT</div>
              <div className="flex-1 overflow-auto pb-4">
                <FileTree
                  nodes={tree}
                  activeId={activeId}
                  onOpenFile={openFile}
                  onToggleFolder={toggleFolder}
                  onRename={rename}
                  onDelete={del}
                  onCreate={create}
                  renamingId={renamingId}
                  setRenamingId={setRenamingId}
                />
              </div>
            </>
          )}

          {panel === 'search' && (
            <div className="flex flex-col overflow-hidden">
              <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#bbbbbb]">Поиск</div>
              <div className="px-3 space-y-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Найти"
                  className="w-full rounded bg-[#3c3c3c] px-2 py-1.5 text-[13px] outline-none border border-transparent focus:border-[#007acc]"
                />
                <div className="flex gap-2">
                  <input
                    value={replaceQuery}
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    placeholder="Заменить"
                    className="flex-1 rounded bg-[#3c3c3c] px-2 py-1.5 text-[13px] outline-none border border-transparent focus:border-[#007acc]"
                  />
                  <button onClick={replaceAll} title="Заменить всё" className="rounded bg-[#0e639c] px-2 hover:bg-[#1177bb]">
                    <Icon name="Replace" size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex-1 overflow-auto px-1 text-[13px]">
                {searchQuery && (
                  <div className="px-3 py-1 text-[12px] text-[#858585]">{searchResults.length} совпадений</div>
                )}
                {searchResults.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => openFile(r.node)}
                    className="cursor-pointer px-3 py-1 hover:bg-[#2a2d2e]"
                  >
                    <div className="text-[#4ec9b0] text-[12px]">{r.node.name}:{r.line}</div>
                    <div className="truncate text-[#858585] text-[12px]">{r.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panel === 'debug' && (
            <div className="flex flex-col overflow-hidden">
              <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#bbbbbb]">Отладка</div>
              <div className="px-3">
                <button className="flex w-full items-center justify-center gap-2 rounded bg-[#0e639c] py-1.5 text-[13px] hover:bg-[#1177bb]">
                  <Icon name="Play" size={14} /> Запустить и отладить
                </button>
              </div>
              <div className="mt-4 px-4 text-[11px] font-semibold uppercase text-[#bbbbbb]">Точки останова</div>
              <div className="px-4 py-1 space-y-1 text-[13px]">
                {[{ f: 'App.tsx', l: 12 }, { f: 'main.py', l: 8 }].map((b, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#e51400]" />
                    <span>{b.f}</span>
                    <span className="text-[#858585]">строка {b.l}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 px-4 text-[11px] font-semibold uppercase text-[#bbbbbb]">Стек вызовов</div>
              <div className="px-4 py-1 text-[13px] text-[#858585]">Программа не запущена</div>
              <div className="mt-4 flex gap-3 px-4 text-[#858585]">
                <Icon name="StepForward" size={16} className="hover:text-white cursor-pointer" />
                <Icon name="ArrowDownToLine" size={16} className="hover:text-white cursor-pointer" />
                <Icon name="ArrowUpFromLine" size={16} className="hover:text-white cursor-pointer" />
                <Icon name="RotateCcw" size={16} className="hover:text-white cursor-pointer" />
                <Icon name="Square" size={16} className="hover:text-white cursor-pointer" />
              </div>
            </div>
          )}

          {panel === 'ext' && (
            <div className="flex flex-col overflow-hidden">
              <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#bbbbbb]">Расширения</div>
              <input placeholder="Поиск в маркетплейсе" className="mx-3 rounded bg-[#3c3c3c] px-2 py-1.5 text-[13px] outline-none border border-transparent focus:border-[#007acc]" />
              <div className="mt-2 flex-1 overflow-auto">
                {EXTENSIONS.map((ext) => {
                  const on = installed.has(ext.name);
                  return (
                    <div key={ext.name} className="flex gap-2 px-3 py-2 hover:bg-[#2a2d2e]">
                      <div className="flex h-9 w-9 items-center justify-center rounded bg-[#0e639c] shrink-0">
                        <Icon name={ext.icon} size={18} fallback="Package" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="truncate text-[13px] font-semibold text-white">{ext.name}</span>
                          <span className="text-[11px] text-[#858585]">{ext.dl}</span>
                        </div>
                        <div className="truncate text-[12px] text-[#858585]">{ext.desc}</div>
                        <button
                          onClick={() => toggleExtension(ext.name)}
                          className={`mt-1 rounded px-2 py-0.5 text-[11px] ${on ? 'bg-[#3c3c3c] text-[#cccccc]' : 'bg-[#0e639c] text-white hover:bg-[#1177bb]'}`}
                        >
                          {on ? 'Удалить' : 'Установить'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Editor + terminal */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex h-9 items-stretch bg-[#252526] shrink-0 overflow-x-auto">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => setActiveId(tab.id)}
                className={`group flex items-center gap-2 border-r border-[#1e1e1e] px-3 cursor-pointer text-[13px] ${
                  activeId === tab.id ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-[#969696]'
                }`}
              >
                {activeId === tab.id && <span className="absolute -mt-[36px] h-0.5 w-full bg-[#007acc] pointer-events-none" style={{ maxWidth: 120 }} />}
                <Icon name="FileCode2" size={14} className="text-[#4ec9b0]" />
                <span>{tab.name}</span>
                {dirty.has(tab.id) ? (
                  <span onClick={(e) => closeTab(tab.id, e)} className="h-2 w-2 rounded-full bg-[#cccccc] group-hover:hidden" />
                ) : null}
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className={`rounded p-0.5 hover:bg-[#5a5a5a] ${dirty.has(tab.id) ? 'hidden group-hover:block' : ''}`}
                >
                  <Icon name="X" size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Breadcrumb */}
          {activeNode && (
            <div className="flex h-6 items-center gap-1 bg-[#1e1e1e] px-4 text-[12px] text-[#858585] shrink-0">
              <Icon name="Files" size={12} />
              <span>my-project</span>
              <Icon name="ChevronRight" size={12} />
              <span className="text-[#cccccc]">{activeNode.name}</span>
              <button onClick={save} title="Сохранить (Ctrl+S)" className="ml-auto flex items-center gap-1 hover:text-white">
                <Icon name="Save" size={13} /> {dirty.has(activeNode.id) ? 'Сохранить' : 'Сохранено'}
              </button>
            </div>
          )}

          {/* Editor */}
          <div className="flex flex-1 overflow-hidden">
            {activeNode ? (
              <CodeEditor
                key={activeNode.id}
                value={activeNode.content || ''}
                lang={activeLang}
                onChange={setContent}
              />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center bg-[#1e1e1e] text-[#5a5a5a]">
                <Icon name="Code2" size={90} className="mb-6 opacity-40" />
                <div className="text-lg">Выберите файл, чтобы начать</div>
                <div className="mt-2 text-[13px]">Открой проводник слева и кликни на файл</div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="flex h-52 flex-col border-t border-[#333] shrink-0">
              <div className="flex h-8 items-center gap-4 bg-[#181818] px-3 text-[11px] uppercase tracking-wide">
                <span className="border-b-2 border-[#007acc] py-1.5 text-white">Терминал</span>
                <span className="cursor-pointer text-[#858585] hover:text-white">Проблемы</span>
                <span className="cursor-pointer text-[#858585] hover:text-white">Вывод</span>
                <span className="cursor-pointer text-[#858585] hover:text-white">Консоль отладки</span>
                <button onClick={() => setShowTerminal(false)} className="ml-auto text-[#858585] hover:text-white">
                  <Icon name="X" size={15} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Terminal />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-6 items-center justify-between bg-[#007acc] px-3 text-[12px] text-white shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><Icon name="GitBranch" size={13} /> main</span>
          <span className="flex items-center gap-1"><Icon name="RefreshCw" size={12} /> 0↓ 0↑</span>
          <span className="flex items-center gap-1"><Icon name="CircleX" size={12} /> 0 <Icon name="TriangleAlert" size={12} /> 0</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowTerminal((s) => !s)} className="flex items-center gap-1 hover:opacity-80">
            <Icon name="TerminalSquare" size={13} /> Терминал
          </button>
          <span>Строк: {activeNode?.content?.split('\n').length || 0}</span>
          <span>{activeLang.toUpperCase()}</span>
          <span>UTF-8</span>
          <span>Пробелы: 2</span>
          <span className="flex items-center gap-1"><Icon name="Bell" size={13} /></span>
        </div>
      </div>
    </div>
  );
}