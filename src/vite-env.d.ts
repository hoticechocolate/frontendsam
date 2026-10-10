/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAP_IMAGE_BASE_URL?: string
  readonly VITE_MAP_IMAGE_URL_TEMPLATE?: string
  readonly VITE_MAP_IMAGE_EXTENSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
