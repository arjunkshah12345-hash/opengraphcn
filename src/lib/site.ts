export const GITHUB_OWNER = 'arjunkshah12345-hash'
export const REPO_NAME = 'opengraphcn'
export const REPO_URL = `https://github.com/${GITHUB_OWNER}/${REPO_NAME}`
export const SITE_URL = `https://${GITHUB_OWNER}.github.io/${REPO_NAME}`
export const REGISTRY_URL = `${SITE_URL}/r`
export const installCommand = (id: string) => `npx shadcn@latest add ${REGISTRY_URL}/${id}.json`
