export type Token = { text: string; color: string };

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

    // Whitespace
    if (ch === ' ' || ch === '\t') {
      let j = i;
      while (j < n && (line[j] === ' ' || line[j] === '\t')) j++;
      tokens.push(span(line.slice(i, j), COLORS.plain));
      i = j;
      continue;
    }

    // Line comments
    if ((ch === '/' && line[i + 1] === '/') || ch === '#') {
      tokens.push(span(line.slice(i), COLORS.comment));
      break;
    }

    // Strings
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      while (j < n && line[j] !== ch) {
        if (line[j] === '\\') j++;
        j++;
      }
      j = Math.min(j + 1, n);
      tokens.push(span(line.slice(i, j), COLORS.string));
      i = j;
      continue;
    }

    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < n && /[0-9a-fx._]/i.test(line[j])) j++;
      tokens.push(span(line.slice(i, j), COLORS.number));
      i = j;
      continue;
    }

    // Identifiers / keywords
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
      i = j;
      continue;
    }

    // Operators / punctuation
    if (/[{}()[\];,.]/.test(ch)) {
      tokens.push(span(ch, COLORS.punct));
      i++;
      continue;
    }
    if (/[+\-*/%=<>!&|^~?:]/.test(ch)) {
      tokens.push(span(ch, COLORS.operator));
      i++;
      continue;
    }

    tokens.push(span(ch, COLORS.plain));
    i++;
  }

  return tokens;
}

function highlightMarkup(line: string): Token[] {
  const tokens: Token[] = [];
  const regex = /(<\/?[a-zA-Z0-9-]+)|([a-zA-Z-]+)(?==)|(=)|("[^"]*"|'[^']*')|(>)|(<!--.*?-->)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) tokens.push(span(line.slice(last, m.index), COLORS.plain));
    if (m[1]) tokens.push(span(m[1], COLORS.tag));
    else if (m[2]) tokens.push(span(m[2], COLORS.attr));
    else if (m[3]) tokens.push(span(m[3], COLORS.operator));
    else if (m[4]) tokens.push(span(m[4], COLORS.string));
    else if (m[5]) tokens.push(span(m[5], COLORS.tag));
    else if (m[6]) tokens.push(span(m[6], COLORS.comment));
    last = regex.lastIndex;
  }
  if (last < line.length) tokens.push(span(line.slice(last), COLORS.plain));
  return tokens.length ? tokens : [span(line, COLORS.plain)];
}

function highlightJson(line: string): Token[] {
  const tokens: Token[] = [];
  const regex = /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(\b\d+\.?\d*\b)|(\btrue\b|\bfalse\b|\bnull\b)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) tokens.push(span(line.slice(last, m.index), COLORS.punct));
    if (m[1]) tokens.push(span(m[1], COLORS.property));
    else if (m[2]) tokens.push(span(m[2], COLORS.string));
    else if (m[3]) tokens.push(span(m[3], COLORS.number));
    else if (m[4]) tokens.push(span(m[4], COLORS.boolean));
    last = regex.lastIndex;
  }
  if (last < line.length) tokens.push(span(line.slice(last), COLORS.punct));
  return tokens.length ? tokens : [span(line, COLORS.plain)];
}

export function highlightLine(line: string, lang: string): Token[] {
  if (line.length === 0) return [span('', COLORS.plain)];
  if (lang === 'html' || lang === 'xml' || lang === 'markup') return highlightMarkup(line);
  if (lang === 'json') return highlightJson(line);
  if (lang === 'css') return highlightCss(line);
  if (lang === 'markdown' || lang === 'md') return [span(line, COLORS.plain)];
  return highlightCode(line);
}

function highlightCss(line: string): Token[] {
  const tokens: Token[] = [];
  const regex = /([.#][\w-]+)|([\w-]+)(?=\s*:)|(:)|(#[0-9a-fA-F]{3,8}\b)|(\b\d+(?:px|em|rem|%|vh|vw|s|deg)?\b)|("[^"]*")/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) tokens.push(span(line.slice(last, m.index), COLORS.plain));
    if (m[1]) tokens.push(span(m[1], COLORS.func));
    else if (m[2]) tokens.push(span(m[2], COLORS.property));
    else if (m[3]) tokens.push(span(m[3], COLORS.operator));
    else if (m[4]) tokens.push(span(m[4], COLORS.number));
    else if (m[5]) tokens.push(span(m[5], COLORS.number));
    else if (m[6]) tokens.push(span(m[6], COLORS.string));
    last = regex.lastIndex;
  }
  if (last < line.length) tokens.push(span(line.slice(last), COLORS.plain));
  return tokens.length ? tokens : [span(line, COLORS.plain)];
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
