const fs = require('fs');
const esbuild = require('esbuild');

hexo.extend.filter.register('before_exit', async () => {
  const jsDir = 'public/js';
  const jsTmpDir = 'public/jsTmp';

  if (fs.existsSync(jsDir)) {
    fs.renameSync(jsDir, jsTmpDir);

    await esbuild.build({
      entryPoints: [`${jsTmpDir}/**/*.js`],
      format: 'iife',
      bundle: true,
      outdir: jsDir,
      minify: true
    });

    fs.rmSync(jsTmpDir, { recursive: true, force: true });
  }

  const cssDir = 'public/css';
  const cssTmpDir = 'public/cssTmp';

  if (fs.existsSync(cssDir)) {
    fs.renameSync(cssDir, cssTmpDir);

    await esbuild.build({
      entryPoints: [`${cssTmpDir}/**/*.css`],
      outdir: cssDir,
      minify: true
    });

    fs.rmSync(cssTmpDir, { recursive: true, force: true });
  }
});
