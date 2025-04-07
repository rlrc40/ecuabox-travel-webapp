interface ImportMetaEnv {
  readonly STRAPI_TOKEN: string;
  readonly PUBLIC_STRAPI_URL: string;
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
