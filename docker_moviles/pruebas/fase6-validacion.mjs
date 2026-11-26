// Fase 6 - Constructor del harness de validacion dinamica.
// Empaqueta pruebas/fase6-entry.js con esbuild (stubs de Angular/Ionic y del
// environment) y lo ejecuta en Node. No toca Directus ni la base de datos.

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire('/app/package.json');
const esbuild = require('esbuild');

function stubFor(path) {
  if (path === '@angular/core') {
    return `
      export function Component(metadata) { return (target) => target; }
      export function Input() { return () => {}; }
      export function Injectable(options) { return (target) => target; }
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
        apiUrl: 'http://127.0.0.1:18999/items',
        authUrl: 'http://127.0.0.1:18999',
      };
    `;
  }

  if (path.endsWith('auth/auth')) {
    return `export class AuthService {}`;
  }

  return `export {};`;
}

const stubPlugin = {
  name: 'fase6-stubs',
  setup(build) {
    build.onResolve(
      {
        filter:
          /^(@angular\/(core|forms|router)|@ionic\/angular|src\/environments\/environment|src\/app\/services\/.*|\.\.\/auth\/auth)$/,
      },
      (args) => ({ path: args.path, namespace: 'fase6-stub' }),
    );

    build.onLoad({ filter: /.*/, namespace: 'fase6-stub' }, (args) => ({
      contents: stubFor(args.path),
      loader: 'js',
    }));
  },
};

const outfile = '/tmp/fase6-bundle.mjs';

await esbuild.build({
  entryPoints: ['/tmp/fase6-entry.js'],
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
  // axios arrastra modulos CJS (form-data/combined-stream) que hacen require
  // de builtins; el banner le da un require real al bundle ESM.
  banner: {
    js: "import { createRequire as __f6CreateRequire } from 'node:module';\nconst require = __f6CreateRequire(import.meta.url);",
  },
});

await import(pathToFileURL(outfile).href + '?t=' + Date.now());
