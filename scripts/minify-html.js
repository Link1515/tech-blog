const fs = require('fs/promises');
const { glob } = require('glob');
const { minify } = require('html-minifier-terser');

hexo.extend.filter.register('before_exit', async () => {
  const htmlFiles = await glob('public/**/*.html');

  htmlFiles.forEach(async file => {
    const html = await fs.readFile(file, 'utf8');
    const minifiedHTML = await minify(html, {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      minifyCSS: true,
      minifyJS: true
    });
    await fs.writeFile(file, minifiedHTML);
  });
});
