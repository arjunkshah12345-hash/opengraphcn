import { CopyButton, cn } from './ui'

// A tiny, dependency-free highlighter for the handful of languages the site shows.

const KW = /\b(import|from|export|default|function|return|const|let|async|await|new|type|interface|extends|true|false|null|undefined)\b/

function highlight(code: string, lang: string) {
  if (lang === 'bash') {
    return code.split('\n').map((line, i) => (
      <span key={i} className="block">
        {line.startsWith('#') ? (
          <span className="text-ink-3">{line}</span>
        ) : (
          <>
            <span className="select-none text-ink-3">$ </span>
            {line.split(/(\s+)/).map((tok, j) => (
              <span key={j} className={j === 0 ? 'text-accent' : /^https?:/.test(tok) ? 'text-ink' : 'text-ink-2'}>
                {tok}
              </span>
            ))}
          </>
        )}
      </span>
    ))
  }
  const re = /(\/\/.*$|\/\*[\s\S]*?\*\/|`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|\b\d+(?:\.\d+)?\b|<\/?[A-Za-z][\w.]*|\b[A-Za-z_$][\w$]*\b)/gm
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const tok = m[0]
    let cls = ''
    if (tok.startsWith('//') || tok.startsWith('/*')) cls = 'text-ink-3 italic'
    else if (/^['"`]/.test(tok)) cls = lang === 'json' && code[m.index + tok.length] === ':' ? 'text-ink' : 'text-[#0f8a5f] dark:text-[#7ee2b8]'
    else if (/^\d/.test(tok)) cls = 'text-[#b45309] dark:text-[#ffc27a]'
    else if (tok.startsWith('<')) cls = 'text-[#c026d3] dark:text-[#f0abfc]'
    else if (KW.test(tok) && tok.match(KW)![0] === tok) cls = 'text-[#4353ff] dark:text-[#a3adff]'
    out.push(
      <span key={k++} className={cls}>
        {tok}
      </span>,
    )
    last = m.index + tok.length
  }
  out.push(code.slice(last))
  return out
}

export function CodeBlock({ code, lang = 'tsx', className, title, maxHeight }: { code: string; lang?: 'tsx' | 'bash' | 'json'; className?: string; title?: string; maxHeight?: number }) {
  return (
    <div className={cn('group relative overflow-hidden rounded-xl border border-line bg-paper-2', className)}>
      {title ? (
        <div className="flex h-9 items-center justify-between border-b border-line px-3 font-mono text-[11.5px] text-ink-3">
          <span>{title}</span>
          <CopyButton text={code} />
        </div>
      ) : (
        <CopyButton text={code} className="absolute top-1.5 right-1.5 opacity-60 transition-opacity group-hover:opacity-100" />
      )}
      <pre className="scrollbar-thin overflow-auto p-4 font-mono text-[12.5px] leading-[1.7] text-ink" style={{ maxHeight }}>
        <code>{highlight(code, lang)}</code>
      </pre>
    </div>
  )
}
