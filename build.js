const fs = require('fs');
const { join } = require('path');
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);

async function base64_encode(file) {
  var bitmap = await fs.promises.readFile(file);
  return bitmap.toString('base64');
}

let myPlugin = {
  name: 'res-plugin',
  setup(build) {
    build.onResolve({ filter: /^resources\/.*$/ }, (args) => {
      return {
        path: args.path,
        namespace: 'res-ns',
      };
    });

    build.onLoad({ filter: /.*/, namespace: 'res-ns' }, async (args) => {
      switch (args.path) {
        case 'resources/index':
          let text = await fs.promises.readFile(
            'src/resources/index.html',
            'utf8',
          );
          let gif = await base64_encode('src/resources/github.gif');
          text = text.replace('%github_gif%', `data:image/gif;base64,${gif}`);
          return {
            contents: text,
            loader: 'text',
          };
        default:
          let data = await fs.promises.readFile(join('src', args.path), 'utf8');
          return {
            contents: data,
            loader: 'text',
          };
      }
    });
  },
};

require('esbuild')
  .build({
    entryPoints: ['./src'],
    bundle: true,
    outfile: './index.js',
    loader: {
      '.sh': 'text',
      '.html': 'text',
      '.gif': 'dataurl',
    },
    plugins: [myPlugin],
    minify: true,
    color: true,
    watch: argv['watch'],
  })
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    throw e;
  });
