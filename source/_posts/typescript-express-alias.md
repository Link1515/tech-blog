---
title: TypeScript Express 設定路徑別名 (Alias)
date: 2023-11-18 09:41:37
categories: Backend
tags:
  - Express
  - Node.js
  - TypeScript
cover: /images/cover/ts_x_express.webp
description: 本文章將逐步帶領讀者完成 TypeScript Express 的路徑別名配置，其中包含了開發環境下的配置，與正式環境下的配置。此處提到的路徑別名為 import 時的路徑別名。
---

> 本文章是直接以應用 Express 為主，但做其他開發，也可以採用相同方法。
> 基礎專案可參考 [創建 Express 的 TypeScript 環境](/Backend/develop-express-with-typescript/)

## 使路徑別名在開發環境生效

開發環境下，我們使用 `nodemon`，而 `nodemon` 又使用 `ts-node`，所以我們的目標便是讓 `ts-node` 套件可以解析路徑別名

### 安裝 tsconfig-paths

```
pnpm i -D tsconfig-paths
```

### 配置 tsconfig.json

- 引入 `tsconfig-paths/register`
- 配置需要的路徑別名
  - 注意: 配置 `paths` 就一定要配置 `baseUrl`
  - 我們將 `baseUrl` 設為 `.`，即當前專案的根目錄
  - `paths` 配置一個映射到 `middeware` 目錄的路徑別名 `@middleware`

```json
{
  // 引入 tsconfig-paths/register
  // 注意 ts-node 的層級與 compilerOptions 相同
  "ts-node": {
    "require": ["tsconfig-paths/register"]
  },
  "compilerOptions": {
    // ...
    // 配置需要的 alias
    "baseUrl": ".",
    "paths": {
      "@middleware/*": ["middleware/*"]
    }
    // ...
  }
}
```

### 測試

接著，來創建一個簡單的 `middleware` 來測試看看路徑別名是否生效

```typescript
// middleware/testMiddleware.ts

import { Request, Response, NextFunction } from 'express';

export const testMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('alias enabled!');

  next();
};
```

在入口文件 (`index.ts`) 中，引入 `testMiddleware` 並應用到 `/` 路由下

```typescript
// index.ts

import express from 'express';
import { testMiddleware } from '@middleware/testMiddleware';

const app = express();
const port = 3000;

app.get('/', testMiddleware, (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Example app url: http://localhost:${port}`);
});
```

執行 `pnpm dev` 啟用開發模式，開起 `http://localhost:3000` 看看終端機有沒有印出 alias enabled!

至此，我們完成了開發環境下的路徑別名

但當我們嘗試 `pnpm build` 正式環境並啟動

```
pnpm build
pnpm start
```

會出現 `MODULE_NOT_FOUND` 的錯誤

因為在正式環境下，我們是使用 `node` (而不是 `ts-node`)，所以剛剛的設定都會無效，`node` 解析 `@middleware/testMiddleware` 會認為是在 `node_module` 中的套件，並報出找不到套件的錯誤，對此，我們還要進行其他設定

## 使路徑別名在正式環境生效

> 此配置也可以用於沒有使用 TypeScript 的專案

### 安裝 module-alias

```
pnpm i module-alias
```

### 配置 package.json

此處需要自行配置 `build` 出來後的資料夾目錄。當前案例，我的 `middleware` 資料夾 `build` 完以後會放到 `dist/middleware`

```json
"_moduleAliases": {
  "@middleware": "dist/middleware",
}
```

### 在入口文件 (index.ts) 中引入 module-alias/register

引入位置需要在所有路徑別名之前，建議放在最上面

```typescript
// index.ts

import 'module-alias/register';
import express from 'express';
import { testMiddleware } from '@middleware/testMiddleware';

const app = express();
const port = 3000;

app.get('/', testMiddleware, (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Example app url: http://localhost:${port}`);
});
```

再來 `build` 一次正式環境

```
pnpm build
pnpm start
```

就會看到這次可以正常啟動！
