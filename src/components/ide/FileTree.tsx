import React, { useState } from 'react';
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
  const {
    nodes, activeId, depth = 0, onOpenFile, onToggleFolder,
    onRename, onDelete, onCreate, renamingId, setRenamingId,
  } = props;
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
            className={`group flex items-center gap-1 pr-2 py-[3px] cursor-pointer hover:bg-[#2a2d2e] ${
              activeId === node.id ? 'bg-[#37373d]' : ''
            }`}
            style={{ paddingLeft: 8 + depth * 12 }}
            onClick={() => node.type === 'folder' ? onToggleFolder(node.id) : onOpenFile(node)}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenu({ id: node.id, type: node.type, x: e.clientX, y: e.clientY });
            }}
          >
            {node.type === 'folder' ? (
              <Icon name={node.open ? 'ChevronDown' : 'ChevronRight'} size={14} className="text-[#858585] shrink-0" />
            ) : (
              <span className="w-[14px] shrink-0" />
            )}
            {node.type === 'folder' ? (
              <Icon name={node.open ? 'FolderOpen' : 'Folder'} size={15} className="text-[#dcb67a] shrink-0" />
            ) : (
              <Icon name={fileIcon(node.name).name} size={15} style={{ color: fileIcon(node.name).color }} className="shrink-0" fallback="File" />
            )}
            {renamingId === node.id ? (
              <input
                autoFocus
                defaultValue={node.name}
                className="ml-1 bg-[#3c3c3c] border border-[#007acc] text-[#cccccc] px-1 outline-none text-[13px] w-full"
                onClick={(e) => e.stopPropagation()}
                onBlur={(e) => { onRename(node.id, e.target.value.trim() || node.name); setRenamingId(null); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { onRename(node.id, (e.target as HTMLInputElement).value.trim() || node.name); setRenamingId(null); }
                  if (e.key === 'Escape') setRenamingId(null);
                }}
              />
            ) : (
              <span className="ml-1 truncate">{node.name}</span>
            )}
          </div>
          {node.type === 'folder' && node.open && node.children && (
            <FileTree {...props} nodes={node.children} depth={depth + 1} />
          )}
        </div>
      ))}

      {menu && (
        <div
          className="fixed z-50 min-w-[180px] rounded bg-[#252526] border border-[#454545] py-1 text-[13px] shadow-2xl"
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {menu.type === 'folder' && (
            <>
              <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e]" onClick={() => { onCreate(menu.id, 'file'); setMenu(null); }}>
                <Icon name="FilePlus" size={14} /> Новый файл
              </button>
              <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e]" onClick={() => { onCreate(menu.id, 'folder'); setMenu(null); }}>
                <Icon name="FolderPlus" size={14} /> Новая папка
              </button>
              <div className="my-1 h-px bg-[#454545]" />
            </>
          )}
          <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e]" onClick={() => { setRenamingId(menu.id); setMenu(null); }}>
            <Icon name="Pencil" size={14} /> Переименовать
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-1.5 hover:bg-[#04395e] text-[#f48771]" onClick={() => { onDelete(menu.id); setMenu(null); }}>
            <Icon name="Trash2" size={14} /> Удалить
          </button>
        </div>
      )}
    </div>
  );
}
