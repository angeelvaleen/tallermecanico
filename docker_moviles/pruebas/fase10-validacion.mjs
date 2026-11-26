// Fase 10 - Constructor del harness H1/H2/H3.
// Empaqueta pruebas/fase10-entry.js con esbuild y lo ejecuta en Node.
// Usa @angular/core REAL (para inyectar el guard) y stubs de formularios,
// Ionic, router y environment. No usa Directus ni escribe datos.

import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire('/app/package.json');
const esbuild = require('esbuild');

function stubFor(path) {
  if (path === '@angular/forms') {
    return `
      export class FormBuilder {}
      export class FormGroup {}
      export class FormArray {}
      const ok = () => null;
      export const Validators = { required: ok, min: ok, max: ok, maxLength: ok, minLength: ok, pattern: ok, email: ok };
    `;
  }

  if (path === '@ionic/angular') {
    return `
      export class AlertController {}
      export class ModalController {}
      export class LoadingController {}
      export class ToastController {}
    `;
  }

  if (path === '@angular/router') {
    return `export class Router { createUrlTree(commands) { return { redirectTo: commands[0] }; } }`;
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
  name: 'fase10-stubs',
  setup(build) {
    build.onResolve(
      { filter: /^(@angular\/forms|@angular\/router|@ionic\/angular|src\/environments\/environment)$/ },
      (args) => ({ path: args.path, namespace: 'fase10-stub' }),
    );

    build.onLoad({ filter: /.*/, namespace: 'fase10-stub' }, (args) => ({
      contents: stubFor(args.path),
      loader: 'js',
    }));
  },
};

// El proyecto importa con el alias `src/...` (baseUrl de tsconfig).
const aliasPlugin = {
  name: 'fase10-alias',
  setup(build) {
    build.onResolve({ filter: /^src\// }, (args) => ({
      path: '/app/' + args.path + '.ts',
    }));
  },
};

const outfile = '/tmp/fase10-bundle.mjs';

await esbuild.build({
  entryPoints: ['/tmp/fase10-entry.js'],
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
  plugins: [stubPlugin, aliasPlugin],
  logLevel: 'warning',
  banner: {
    js: "import { createRequire as __f10CreateRequire } from 'node:module';\nconst require = __f10CreateRequire(import.meta.url);",
  },
});

await import(pathToFileURL(outfile).href + '?t=' + Date.now());
