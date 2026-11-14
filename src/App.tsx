import { useEffect } from 'react'
import { Footer, Nav } from './components/Nav'
import { ToastProvider } from './components/ui'
import { useRoute } from './lib/router'
import { Demo } from './pages/Demo'
import { Docs } from './pages/Docs'
import { Home } from './pages/Home'
import { Studio } from './pages/studio/Studio'
import { TemplateDetail, TemplatesPage } from './pages/Templates'

const TITLES: Record<string, string> = {
  '/': 'opengraphcn — Make every link look incredible',
  '/templates': 'Templates — opengraphcn',
  '/studio': 'Studio — opengraphcn',
  '/docs': 'Docs — opengraphcn',
  '/demo': 'Demo — opengraphcn',
}

export function App() {
  const route = useRoute()
  const { path } = route
  const seg = path.split('/').filter(Boolean)

  useEffect(() => {
    document.title = TITLES[`/${seg[0] ?? ''}`.replace(/\/$/, '') || '/'] ?? TITLES['/']
    if (!path.startsWith('/studio')) window.scrollTo({ top: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  let page: React.ReactNode
  let chrome: 'full' | 'app' | 'none' = 'full'
  if (seg[0] === 'studio') {
    page = <Studio route={route} />
    chrome = 'app'
  } else if (seg[0] === 'demo') {
    page = <Demo />
    chrome = 'none'
  } else if (seg[0] === 'templates' && seg[1]) page = <TemplateDetail key={seg[1]} id={seg[1]} />
  else if (seg[0] === 'templates') page = <TemplatesPage />
  else if (seg[0] === 'docs') page = <Docs page={seg[1] ?? ''} />
  else page = <Home />

  return (
    <ToastProvider>
      {chrome !== 'none' ? <Nav path={path} wide={chrome === 'app'} /> : null}
      {page}
      {chrome === 'full' ? <Footer /> : null}
    </ToastProvider>
  )
}
