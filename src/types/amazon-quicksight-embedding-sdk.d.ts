declare module 'amazon-quicksight-embedding-sdk' {
    // Minimal surface we use; expand as needed
    export type EmbedDashboardOptions = {
      url: string
      container: HTMLElement
      width?: string | number
      height?: string | number
      scrolling?: 'yes' | 'no' | 'auto'
      loadingHeight?: string | number
    }
    export type EmbeddedDashboard = {
      on(event: 'load' | 'error', cb: (e?: any) => void): void
      setParameters(params: Record<string, string[] | string>): Promise<void>
    }
  
    export function embedDashboard(opts: EmbedDashboardOptions): EmbeddedDashboard
  }
  