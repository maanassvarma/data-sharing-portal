import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// MSW before render (dev only), but don’t block if it fails
if (import.meta.env.DEV) {
  try {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      serviceWorker: { url: '/mockServiceWorker.js' },
      onUnhandledRequest: 'bypass',
    })
  } catch (e) {
    console.warn('MSW failed to start; continuing without mocks', e)
  }
}

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql', fetch: (...a) => fetch(...a) }),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)

// createRoot(document.getElementById('root')!).render(
//   <div style={{ padding: 16, fontFamily: 'system-ui' }}>
//     hello
//   </div>
// )
