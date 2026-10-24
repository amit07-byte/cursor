/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No secret API keys belong here. Gemini / YouTube keys are server-only.
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
