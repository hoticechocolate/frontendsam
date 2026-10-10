/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_IMAGE_BASE_URL?: string
  readonly VITE_MAP_IMAGE_URL_TEMPLATE?: string
  readonly VITE_MAP_IMAGE_EXTENSION?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_SUPABASE_BUCKET?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
