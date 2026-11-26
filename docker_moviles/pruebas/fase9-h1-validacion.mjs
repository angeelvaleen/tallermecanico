// Fase 9 - Constructor del harness H1.
// Empaqueta pruebas/fase9-h1-entry.js con esbuild y lo ejecuta en Node.
// Solo sustituye Angular y el environment: el perfil y el servicio de
// autenticacion se ejecutan tal como estan en la app.
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

  if (path === '@angular/forms') {
    return `
      export class FormBuilder {}
      export class FormGroup {}
      export class FormArray {}
      const ok = () => null;
      export const Validators = { required: ok, min: ok, max: ok, maxLength: ok, pattern: ok };
    `;
  }

  if (path === '@angular/router') {
    return `export class Router { async navigateByUrl() {} }`;
  }

  if (path === 'src/environments/environment') {
    return `
      export const environment = {
        production: false,
        apiUrl: 'http://127.0.0.1:18996/items',
        authUrl: 'http://127.0.0.1:18996',
      };
    `;
  }

  return `export {};`;
}

const stubPlugin = {
  name: 'fase9-stubs',
  setup(build) {
    build.onResolve({ filter: /^src\/app\/services\/auth\/auth$/ }, () => ({
      path: '/app/src/app/services/auth/auth.ts',
    }));

    build.onResolve(
      { filter: /^(@angular\/core|@angular\/forms|@angular\/router|src\/environments\/environment)$/ },
      (args) => ({ path: args.path, namespace: 'fase9-stub' }),
    );

    build.onLoad({ filter: /.*/, namespace: 'fase9-stub' }, (args) => ({
      contents: stubFor(args.path),
      loader: 'js',
    }));
  },
};

const outfile = '/tmp/fase9-h1-bundle.mjs';

await esbuild.build({
  entryPoints: ['/tmp/fase9-h1-entry.js'],
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
  banner: {
    js: "import { createRequire as __f9CreateRequire } from 'node:module';\nconst require = __f9CreateRequire(import.meta.url);",
  },
});

await import(pathToFileURL(outfile).href + '?t=' + Date.now());
