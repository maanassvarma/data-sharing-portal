/// <reference types="vite/client" />

// (Optional) extra fields if you want to be explicit
interface ImportMetaEnv {
    readonly DEV: boolean
    readonly PROD: boolean
    readonly MODE: string
    readonly BASE_URL: string
    // add your custom VITE_* vars here, e.g.:
    // readonly VITE_API_BASE?: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  