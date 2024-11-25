---
title: Astro 專案中使用 TailwindCSS 並配置 class 自動排版
date: 2023-12-02 09:10:11
categories: 前端
tags:
    - Astro
    - Prettier
    - TailwindCSS
cover: /images/cover/astro_x_tailwindcss.jpg
description: 本文章講解如何在 Astro 專案中安裝 TailwindCSS 套件，以及使用 Prettier 來做 class 的自動排版。
---

## Astro 中安裝 TailwindCSS

[官方文件](https://docs.astro.build/en/guides/integrations-guide/tailwind/)

這一步非常簡單，因為 Astro 團隊已經封裝好指令，只需要輸入指令，接著一直按 `y` 就行了

```
pnpm astro add tailwind
```

但我們還是來了解一下這個指令幫我們做了什麼
(以下為 `astro add tailwind` 指令幫我們做好的，可以不用照著做)

### 安裝套件

```
pnpm i @astrojs/tailwind tailwindcss
```

### Astro 配置文件中加入 @astrojs/tailwind

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
```

### 初始化 TailwindCSS

```
pnpm exec tailwindcss init
```

### 創建 TailwindCSS 配置文件 (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 使用 Prettier 做 Astro 的自動排版

在 Astro 上裝完 TailwindCSS 後，來設定自動排版，我們採用官方提供的套件 [prettier-plugin-astro](https://github.com/withastro/prettier-plugin-astro) 來整合 Astro 與 Prettier

### 安裝套件

```
pnpm i -D prettier prettier-plugin-astro
```

### 配置 .prettierrc

在專案根路徑下創建 `.prettierrc` 檔案，並進行以下配置

```json
{
  "plugins": [
    "prettier-plugin-astro"
  ],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

## TailwindCSS class 的自動排版

Prettier 生效以後，再來我們來讓 TailwindCSS class 的自動排版生效，此處使用 TailwindCSS 官方提供的 [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)

### 安裝套件

```
pnpm i -D prettier-plugin-tailwindcss
```

### 配置 .prettierrc

在 `plugins` 的地方加入 `prettier-plugin-tailwindcss`，官方建議最後引入，即配置於 `prettier-plugin-astro` 之後

```json
{
  "plugins": [
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss"
  ],
  "overrides": [
    {
      "files": "*.astro",
      "options": {
        "parser": "astro"
      }
    }
  ]
}
```

### 注意事項

`prettier-plugin-tailwindcss` 預設會以根目錄下的 `tailwind.config.js` (檔名與副檔名必須一樣) 來檢查有使用 TailwindCSS 的文件，如果沒有或者找不到，自動排版就不會生效

我在創建專案時，透過 `pnpm astro add tailwind` 自動幫我創建的 TailwindCSS 配置文件為 `tailwind.config.mjs`，記得要將副檔名更正，即改名為 `tailwind.config.js`

`prettier-plugin-tailwindcss` 也提供自定義 TailwindCSS 配置文件位置，可以參考[此處](https://github.com/tailwindlabs/prettier-plugin-tailwindcss#customizing-your-tailwind-config-path)