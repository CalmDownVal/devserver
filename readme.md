# DevServer

A simple development server with livereload.

## Example Usage

Example usage with [esbuild](https://github.com/evanw/esbuild).

```ts
import { DevServer, FileSystemResolver } from '@calmdownval/devserver';
import { build } from 'esbuild';

try {
  const server = await DevServer.start({
    allowCors: true,
    resolver: new FileSystemResolver({
      allowCache: true,
      contentRoots: [
        './static',
        './build'
      ]
    })
  });

  const hotReloadPlugin = {
    name: 'hot-reload',
    setup(build) {
      build.onEnd(result => {
        const { errors: { length: errors }, warnings: { length: warnings } } = result;
        if (errors > 0) {
          console.error(`build failed with ${errors} errors and ${warnings} warnings.`);
        }
        else {
          console.info(`build succeeded with ${warnings} warnings.`);
          server.notifyReload();
        }
      });
    }
  };

  const context = await esbuild.context({
    entryPoints: [ './src/index.ts' ],
    outdir: './build',
    bundle: true,
    plugins: [ hotReloadPlugin ]
  });

  await context.watch();
}
catch (ex) {
  console.error(ex);
}
```
