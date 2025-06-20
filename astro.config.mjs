// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public"}),
      PORT: envField.number({ context: "client", access: "public", optional: true }),
      API_SECRET: envField.string({ context: "server", access: "secret" }),
    }
  }
});
