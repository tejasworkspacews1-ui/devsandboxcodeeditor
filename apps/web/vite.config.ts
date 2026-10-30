/*!
 * Developer: Tejas Kamble
 * Email: tejasksocials@gmail.com
 * Website: https://tejaskambleportfolio.vercel.app/
 * LinkedIn: https://www.linkedin.com/in/tejaskambleportfolio/
 * Instagram: @tejask.co.in
 * GitHub: https://github.com/tejasworkspacews1-ui
 *
 * Project Disclaimer:
 * All project data shown/accessed is completely legal, free and publicly
 * accessible data and not proprietary data.
 */
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

function devSandboxApiPlugin(): Plugin {
  return {
    name: 'devsandbox-local-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        if (req.url === '/api/health') {
          res.statusCode = 200;
          return res.end(JSON.stringify({
            status: 'ok',
            app: 'DevSandbox',
            developer: 'Tejas Kamble',
            timestamp: new Date().toISOString()
          }));
        }

        // Pass-through to next or finish
        return next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), devSandboxApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    allowedHosts: true,
    headers: {
      'Cross-Origin-Opener': 'same-origin',
      'Cross-Origin-Embedder': 'credentialless',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    headers: {
      'Cross-Origin-Opener': 'same-origin',
      'Cross-Origin-Embedder': 'credentialless',
    },
  },
  optimizeDeps: {
    include: ['monaco-editor'],
  },
})
