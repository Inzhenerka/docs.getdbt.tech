import React from 'react'
import Head from '@docusaurus/Head'
import { useLocation } from '@docusaurus/router'
import { VersionContextProvider } from '../stores/VersionContext'

const NOINDEX_PREFIXES = [
  '/tags/',
  '/blog/tags/',
  '/blog/authors/',
  '/blog/archive/',
]

function shouldNoindex(pathname) {
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`
  return NOINDEX_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix))
}

function Root({children}) {
  const { pathname } = useLocation()
  const noindex = shouldNoindex(pathname)

  return (
    <VersionContextProvider>
      {noindex && (
        <Head>
          <meta name="robots" content="noindex,follow" />
          <meta name="googlebot" content="noindex,follow" />
        </Head>
      )}
      {children}
    </VersionContextProvider>
  )
}

export default Root
