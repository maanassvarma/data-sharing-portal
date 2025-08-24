import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const cache = new InMemoryCache()

export const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql', fetch: (...a) => fetch(...a) }),
  cache,
})

/**
 * Persist Apollo cache in the browser only.
 * Safe for SSR/tests because it uses dynamic import + window guard.
 */
export async function initApolloPersistence() {
  if (typeof window === 'undefined') return
  try {
    const { persistCache, LocalStorageWrapper } = await import('apollo3-cache-persist')
    await persistCache({
      cache,
      storage: new LocalStorageWrapper(window.localStorage),
    })
  } catch (e) {
    // Don’t crash the app if the lib is unavailable in non-browser contexts
    console.warn('Apollo cache persistence skipped:', e)
  }
}
