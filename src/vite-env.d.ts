/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No secret API keys belong here. OpenAI / YouTube keys are server-only.
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
