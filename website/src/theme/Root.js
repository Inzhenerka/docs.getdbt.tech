import React from 'react'
import Head from '@docusaurus/Head'
import { useLocation } from '@docusaurus/router'
import { VersionContextProvider } from '../stores/VersionContext'
import { useVersionUrlSync } from '../utils/useVersionUrlSync'

/**
 * Inner component that syncs version to URL on route changes.
 * Must be inside VersionContextProvider to access the version context.
 */
function VersionUrlSyncHandler({ children }) {
  useVersionUrlSync();
  return children;
}

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
      <VersionUrlSyncHandler>{children}</VersionUrlSyncHandler>
    </VersionContextProvider>
  )
}

export default Root
