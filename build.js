const fs = require('fs');
const { join } = require('path');
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);

async function base64_encode(file) {
  var bitmap = await fs.promises.readFile(file);
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
            await fs.promises.readFile(`${resDir}/index.html`)
          ).toString();
          let gif = await base64_encode('src/resources/github.gif');
          text = text.replace('%github_gif%', `data:image/gif;base64,${gif}`);
          return {
            contents: text,
            loader: 'text',
          };
        default:
          let data = await fs.promises.readFile(join(resDir, resName));
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
    plugins: [myPlugin],
    minify: true,
    color: true,
    define: {
      GITHUB: JSON.stringify('https://github.com/lengthmin'),
    },
    watch: argv['watch'],
  })
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    throw e;
  });
