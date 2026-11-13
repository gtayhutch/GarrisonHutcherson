// Astro build configuration. Static output only (ACF-01): no adapter, no
// on-demand routes. Stylesheets are always emitted as files so the static
// CSP in public/_headers can keep `style-src 'self'` (OVR-003).
import {defineConfig} from 'astro/config';

export default defineConfig({
  site: 'https://garrisonhutcherson.com',
  output: 'static',
  build: {
    inlineStylesheets: 'never',
  },
  devToolbar: {
    enabled: false,
  },
});
