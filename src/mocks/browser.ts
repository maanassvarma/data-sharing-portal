import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

export async function startMSW() {
  if (!import.meta.env.DEV) return
  // start only once per page load
  if ((window as any).__mswStarted) return
  await worker.start({ onUnhandledRequest: 'bypass' })
  ;(window as any).__mswStarted = true
}
