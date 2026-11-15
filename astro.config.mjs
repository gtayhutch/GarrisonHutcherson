// Astro build configuration. Static output only (ACF-01): no adapter, no
// on-demand routes. Stylesheets are always emitted as files so the static
// CSP in public/_headers can keep `style-src 'self'` (OVR-003).
import {defineConfig, envField} from 'astro/config';

export default defineConfig({
  site: 'https://garrisonhutcherson.com',
  output: 'static',
  build: {
    inlineStylesheets: 'never',
  },
  devToolbar: {
    enabled: false,
  },
  env: {
    schema: {
      // Build-time switch for the Cloudflare Web Analytics beacon. On by
      // default; the staging Worker's build sets it to `false` so owner
      // visits to staging aren't counted.
      PUBLIC_WEB_ANALYTICS: envField.boolean({
        context: 'server',
        access: 'public',
        default: true,
      }),
    },
  },
});
