import { build, type BuildOptions } from 'esbuild';
import publicDirectory from 'esbuild-plugin-public-directory';

(async () => {
  const options: BuildOptions = {
    entryPoints: ['src/main/background.ts', 'src/main/content.tsx'],
    bundle: true,
    target: 'es2022',
    charset: 'utf8',
    platform: 'browser',
    outdir: 'dist',
    legalComments: 'inline',
    plugins: [publicDirectory()]
  };

  await build(options).catch(err => {
    process.stderr.write(err.stderr);
    process.exit(1);
  });
})();
