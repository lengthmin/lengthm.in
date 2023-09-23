import 'dotenv/config';

import { promises } from 'fs';
import { join } from 'path';
import { context } from 'esbuild';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
console.log(argv);

async function base64_encode(file) {
  const bitmap = await promises.readFile(file);
  return bitmap.toString('base64');
}

const resourcesRegex = /^resources\/(.*)$/;

let myPlugin = {
  name: 'res-plugin',
  setup(build) {
    build.onResolve({ filter: resourcesRegex }, (args) => {
      return {
        path: args.path,
        namespace: 'res-ns',
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'res-ns' }, async (args) => {
      const match = resourcesRegex.exec(args.path);
      const resName = match[1];
      const resDir = 'src/resources';
      switch (resName) {
        case 'index':
          let text = (
            await promises.readFile(`${resDir}/index.html`)
          ).toString();
          let gif = await base64_encode('src/resources/github.gif');
          text = text.replace('%github_gif%', `data:image/gif;base64,${gif}`);
          return {
            contents: text,
            loader: 'text',
          };
        default:
          let data = await promises.readFile(join(resDir, resName));
          return {
            contents: data,
            loader: 'text',
          };
      }
    });
  },
};

const watchMode = argv['watch'];

context({
  entryPoints: ['./src'],
  bundle: true,
  outfile: './index.js',
  plugins: [myPlugin],
  platform: 'browser',
  target: 'es2020',
  format: 'esm',
  treeShaking: true,
  color: true,
}).then((ctx) => {
  if (watchMode) {
    ctx.watch();
  } else {
    ctx.rebuild().then((v) => {
      console.log(`build ~ result`, v);
      ctx.dispose();
    });
  }
});
