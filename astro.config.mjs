// @ts-check
import { defineConfig, envField } from 'astro/config';
import path from 'node:path';
// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      fs: {
        allow: [
          process.cwd(),
          path.resolve('../..')
        ]
      }
    }
  },
  env: {
    schema: {
      API_URL: envField.string({ context: "client", access: "public"}),
      PORT: envField.number({ context: "client", access: "public", optional: true }),
      API_SECRET: envField.string({ context: "server", access: "secret" }),
    }
  }
});
