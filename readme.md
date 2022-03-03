# DevServer

A simple HTTP dev server library with live-reload.

## Example Usage

Example usage with [esbuild](https://github.com/evanw/esbuild).

```ts
import { DevServer, FileSystemResolver } from '@calmdownval/devserver';
import { build } from 'esbuild';

(async () => {
  try {
    const server = await DevServer.start({
      allowCors: true,
      openBrowser: true,
      resolver: new FileSystemResolver({
        contentRoots: [
          './static',
          './build'
        ]
      })
    });

    await build({
      entryPoints: [ './src/index.ts' ],
      outdir: './build',
      bundle: true,
      incremental: true,
      watch: {
        onRebuild(error) {
          server.notifyReload();
        }
      }
    });
  }
  catch (ex) {
    console.error(ex);
  }
})();
```
