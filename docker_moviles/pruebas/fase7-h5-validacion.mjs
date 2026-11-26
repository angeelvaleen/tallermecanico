// Fase 7 - Constructor del harness H5.
// Empaqueta pruebas/fase7-h5-entry.js con esbuild y lo ejecuta en Node.
// A diferencia de la Fase 6, NO sustituye AuthService: se usa el servicio real
// con axios contra el servidor local, que despacha al endpoint real.
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
        apiUrl: 'http://127.0.0.1:18998/items',
        authUrl: 'http://127.0.0.1:18998',
      };
    `;
  }

  return `export {};`;
}

const stubPlugin = {
  name: 'fase7-stubs',
  setup(build) {
    // El servicio de autenticacion se resuelve al archivo real de la app.
    build.onResolve({ filter: /^src\/app\/services\/auth\/auth$/ }, () => ({
      path: '/app/src/app/services/auth/auth.ts',
    }));

    build.onResolve(
      { filter: /^(@angular\/(core|forms|router)|@ionic\/angular|src\/environments\/environment)$/ },
      (args) => ({ path: args.path, namespace: 'fase7-stub' }),
    );

    build.onLoad({ filter: /.*/, namespace: 'fase7-stub' }, (args) => ({
      contents: stubFor(args.path),
      loader: 'js',
    }));
  },
};

const outfile = '/tmp/fase7-h5-bundle.mjs';

await esbuild.build({
  entryPoints: ['/tmp/fase7-h5-entry.js'],
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
    js: "import { createRequire as __f7CreateRequire } from 'node:module';\nconst require = __f7CreateRequire(import.meta.url);",
  },
});

await import(pathToFileURL(outfile).href + '?t=' + Date.now());
