---
title: 簡單的壓縮 HTML、CSS、JavaScript
date: 2024-12-02 14:54:20
categories: Frontend
tags:
  - JavaScript
  - Node.js
cover: /images/cover/compress.webp
description: 在網站開發中，壓縮 HTML、CSS 和 JavaScript 是提升性能的關鍵步驟之一。這篇文章介紹了幾個實用的套件，能有效減少檔案大小，縮短載入時間。
---

假設今天前端工程師對於框架較不熟悉，採用**原生寫法**，**不套用任何框架**，**沒有用任何打包工具**，HTML、CSS、JavaScript 都是用最原生的寫法，目錄結構大致如下

![file-structure](/images/posts/minify-web-files/file-structure.webp)

我們在拿到這包檔案後，可以協助前端工程師用一些簡單快速的方法來壓縮 HTML、CSS、JavaScript，節省檔案在網路傳輸時的流量

## 壓縮 HTML

我們使用 `glob` 套件來取得所有 HTML 檔案的路徑，然後使用 `html-minifier-terser` 套件來壓縮 HTML 檔案。

```Bash
pnpm i html-minifier-terser glob
```

```JavaScript
import fs from 'fs/promises';
import { glob } from 'glob';
import { minify } from 'html-minifier-terser';

// 取得所有在 public 目錄下的 HTML 檔案
const htmlFiles = await glob('public/**/*.html');

htmlFiles.forEach(async file => {
  // 讀取 HTML 檔案
  const html = await fs.readFile(file, 'utf8');
  // 壓縮 HTML 檔案
  const minifiedHTML = await minify(html, {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    minifyCSS: true,
    minifyJS: true
  });
  // 寫入壓縮後的 HTML 檔案
  await fs.writeFile(file, minifiedHTML);
});
```

## 壓縮 CSS 與 JavaScript

CSS 與 JavaScript 的壓縮我們使用 `esbuild` 套件處理。

```Bash
pnpm i esbuild
```

先將原始目錄 `css` 與 `js` 重新命名為 `cssTmp` 與 `jsTmp`，再以此目錄中的所有檔案為入口，並將輸出目錄設定為原始目錄，最後刪除 `cssTmp` 與 `jsTmp`

```JavaScript
import fs from 'fs';
import * as esbuild from 'esbuild';

// css 原始目錄
const cssDir = 'public/css';
// js 原始目錄
const jsDir = 'public/js';

// 處理 CSS 壓縮
if (fs.existsSync(cssDir)) {
  // 重新命名 css 原始目錄為 public/cssTmp
  const cssTmpDir = cssDir + 'Tmp';
  fs.renameSync(cssDir, cssTmpDir);

  // 壓縮 CSS
  await esbuild.build({
    entryPoints: [`${cssTmpDir}/**/*.css`],
    outdir: cssDir,
    minify: true
  });

  // 刪除 public/cssTmp
  fs.rmSync(cssTmpDir, { recursive: true, force: true });
}

// 處理 JavaScript 壓縮
if (fs.existsSync(jsDir)) {
  // 重新命名 js 原始目錄為 public/jsTmp
  const jsTmpDir = jsDir + 'Tmp';
  fs.renameSync(jsDir, jsTmpDir);

  // 壓縮 JavaScript
  await esbuild.build({
    entryPoints: [`${jsTmpDir}/**/*.js`],
    format: 'iife',
    bundle: true,
    outdir: jsDir,
    minify: true
  });

  // 刪除 public/jsTmp
  fs.rmSync(jsTmpDir, { recursive: true, force: true });
}
```

### 注意 window 上的全域函數

如果 js 檔案中有直接透過 `function` 關鍵字定義函數，並需要在其他檔案中使用的情況，例如

```JavaScript
// utils.js

function add(a, b) {
  return a + b
}
```

這樣的情況下，`esbuild` 會認為該函數未被使用，預設會去除這些函數 (`tree shake`)。解決辦法是把這些要在全域使用的函數，手動放到 `window` 上，最終使用上結果是一樣的，但不會被 `esbuild` 去除

```JavaScript
// utils.js

window.add = function(a, b) {
  return a + b
}
```
