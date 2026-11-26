// Fase 8 - Constructor del harness H3.
// Empaqueta pruebas/fase8-h3-entry.js con esbuild y lo ejecuta en Node.
// Solo sustituye Angular e Ionic: el servicio de evidencias, el de
// autenticacion y el formulario se ejecutan tal como estan en la app.
// No toca Directus ni la base de datos.

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire('/app/package.json');
const esbuild = require('esbuild');

function stubFor(path) {
  if (path === '@angular/core') {
    return `
      export function Component(metadata) { return (target) => target; }
      export function Input() { return () => {}; }
      export function ViewChild() { return () => {}; }
      export function Injectable(options) { return (target) => target; }
      export class ElementRef {}
    `;
  }

  if (path === '@ionic/angular') {
    return `
      export class AlertController {}
      export class ModalController {}
      export class LoadingController {}
    `;
  }

  if (path === 'src/environments/environment') {
    return `
      export const environment = {
        production: false,
        apiUrl: 'http://127.0.0.1:18997/items',
        authUrl: 'http://127.0.0.1:18997',
      };
    `;
  }

  return `export {};`;
}

const stubPlugin = {
  name: 'fase8-stubs',
  setup(build) {
    // El formulario importa el servicio con la ruta absoluta de la app.
    build.onResolve({ filter: /^src\/app\/services\/evidences\/evidences$/ }, () => ({
      path: '/app/src/app/services/evidences/evidences.ts',
    }));

    build.onResolve(
      { filter: /^(@angular\/core|@ionic\/angular|src\/environments\/environment)$/ },
      (args) => ({ path: args.path, namespace: 'fase8-stub' }),
    );

    build.onLoad({ filter: /.*/, namespace: 'fase8-stub' }, (args) => ({
      contents: stubFor(args.path),
      loader: 'js',
    }));
  },
};

const outfile = '/tmp/fase8-h3-bundle.mjs';

await esbuild.build({
  entryPoints: ['/tmp/fase8-h3-entry.js'],
  outfile,
  bundle: true,
  platform: 'node',
  nodePaths: ['/app/node_modules'],
  format: 'esm',
  target: 'node22',
  tsconfigRaw: {
    compilerOptions: {
      experimentalDecorators: true,
      useDefineForClassFields: false,
      target: 'es2022',
    },
  },
  plugins: [stubPlugin],
  logLevel: 'warning',
  // axios arrastra modulos CJS que hacen require de builtins; el banner le da
  // un require real al bundle ESM.
  banner: {
    js: "import { createRequire as __f8CreateRequire } from 'node:module';\nconst require = __f8CreateRequire(import.meta.url);",
  },
});

await import(pathToFileURL(outfile).href + '?t=' + Date.now());
