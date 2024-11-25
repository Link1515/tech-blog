---
title: 創建 express 的 typescript 環境
date: 2023-11-11 11:37:08
categories: 後端
tags:
  - Express
  - Node.js
  - Typescript
cover: /images/cover/ts_x_express.jpg
description: 本篇文章將從 Node.js 環境創建，安裝相關套件，並配置 TypeScript，逐步完成一個使用 TypeScript 的 Express 應用。
---

## 基礎 Express 環境

### 建立 Node 環境

```
pnpm init
```

### 安裝 Express 與相關套件

```
pnpm i express
pnpm i -D typescript nodemon ts-node
```

- [express](https://expressjs.com/): Node.js 的 Web Framework
- [nodemon](https://nodemon.io/): 修改代碼後，自動重新啟動的開發工具
- [typescript](https://www.typescriptlang.org/): 編譯套件，將 TypeScript 編譯為 JavaScript
- [ts-node](https://typestrong.org/ts-node/): 可以直接執行 .ts 文件的 Node.js 環境 (開發環境下 nodemon 會使用此套件直接執行 .ts 文件)

### 安裝 Node 與 Express 的型別

```
pnpm i -D @types/node @types/express
```

- @types/node: node 的型別
- @types/express: express 的型別

### 修改 package.json 中 scripts

```json
"scripts": {
  "dev": "nodemon index.ts",
  "build": "tsc",
  "start": "node ./dist/index.js"
},
```

### 完整 package.json

```json
{
  "name": "express-with-ts",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "nodemon index.ts",
    "build": "tsc",
    "start": "node ./dist/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.20",
    "@types/node": "^20.8.10",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.2.2"
  }
}
```

## 基礎 Express 代碼

```typescript
// index.js
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log(`Example app url: http://localhost:${port}`);
});
```

此時，可以先執行 `pnpm dev` 看看能不能成功

```
pnpm dev
```

## 配置 TypeScript

### 創建 TypeScript 環境

執行 `tsc --init` 初始化 TypeScript，此時會自動產生 `tsconfig.json`，裡面已經有預設配置

```
tsc --init
```

### 輸出目錄

在 tsconfig.json 中搜尋 `outDir` 配置項，可以配置輸出目錄，此範例中我們設定為 `dist` (搭配  `package.json` 中 script 的 start)

```json
"outDir": "./dist"
```

## 延伸閱讀

如此一來，我們就成功建構了能以 TypeScript 開發的 Express 環境

在此基礎下，可以去參考我寫的其他文章

- [TypeScript Express 設定路徑別名 (Alias)](/tech-blog/2023/11/18/typescript-express-alias/)
- [Node.js 如何取得圖片的 Mime Types](/tech-blog/2023/11/18/typescript-express-alias/)