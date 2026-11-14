import type { OgContent } from '../og/core/types'

// Public repository import via the GitHub REST API — no auth, works from a static site.

export interface RepoImport {
  content: Partial<OgContent>
  avatar?: string
  fullName: string
  url: string
}

export class GitHubImportError extends Error {
  kind: 'invalid' | 'not-found' | 'rate-limit' | 'network' | 'unknown'
  constructor(kind: GitHubImportError['kind'], message: string) {
    super(message)
    this.kind = kind
  }
}

export function parseRepo(input: string): { owner: string; repo: string } | null {
  const s = input.trim().replace(/\.git$/, '').replace(/\/+$/, '')
  const m = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)/i.exec(s) ?? /^([\w.-]+)\/([\w.-]+)$/.exec(s)
  if (!m) return null
  return { owner: m[1], repo: m[2] }
}

async function toDataUrl(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('avatar')
  const blob = await res.blob()
  return await new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsDataURL(blob)
  })
}

export async function importRepo(input: string, signal?: AbortSignal): Promise<RepoImport> {
  const parsed = parseRepo(input)
  if (!parsed) throw new GitHubImportError('invalid', 'Paste a repository URL like github.com/owner/repo.')
  let res: Response
  try {
    res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, { headers: { Accept: 'application/vnd.github+json' }, signal })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new GitHubImportError('network', 'Could not reach GitHub. Check your connection and try again.')
  }
  if (res.status === 404) throw new GitHubImportError('not-found', `No public repository found at ${parsed.owner}/${parsed.repo}.`)
  if (res.status === 403 || res.status === 429) {
    const reset = Number(res.headers.get('x-ratelimit-reset'))
    const mins = reset ? Math.max(1, Math.ceil((reset * 1000 - Date.now()) / 60000)) : null
    throw new GitHubImportError('rate-limit', `GitHub's anonymous rate limit (60 requests/hour) was reached.${mins ? ` Try again in about ${mins} minute${mins === 1 ? '' : 's'}.` : ''}`)
  }
  if (!res.ok) throw new GitHubImportError('unknown', `GitHub responded with ${res.status}.`)
  const r = await res.json()
  let host = ''
  if (r.homepage) {
    try {
      host = new URL(/^https?:/.test(r.homepage) ? r.homepage : `https://${r.homepage}`).host.replace(/^www\./, '')
    } catch {
      host = ''
    }
  }
  const topics: string[] = Array.isArray(r.topics) ? r.topics : []
  let avatar: string | undefined
  try {
    if (r.owner?.avatar_url) avatar = await toDataUrl(`${r.owner.avatar_url}${r.owner.avatar_url.includes('?') ? '&' : '?'}s=256`)
  } catch {
    avatar = undefined
  }
  return {
    fullName: r.full_name,
    url: r.html_url,
    avatar,
    content: {
      name: r.name,
      owner: r.owner?.login,
      headline: r.description || r.name,
      description: r.description ? topics.slice(0, 4).join(' · ') || `github.com/${r.full_name}` : `github.com/${r.full_name}`,
      domain: host || `github.com/${r.full_name}`,
      author: r.owner?.login ?? '',
      category: topics[0] ?? r.language ?? '',
      language: r.language ?? undefined,
      stars: typeof r.stargazers_count === 'number' ? r.stargazers_count : null,
      forks: typeof r.forks_count === 'number' ? r.forks_count : null,
    },
  }
}
