---
title: Node.js 如何取得圖片的 Mime Types
date: 2023-11-25 09:55:22
categories: Backend
tags:
  - Express
  - Node.js
  - TypeScript
cover: /images/cover/image.webp
description: 最近工作上有個需求要取得圖片的 mime types，這篇文章簡單紀錄在 Node.js 環境下使用 file-type 套件來取得圖片的 mime types。
---

> 基礎專案可參考 [創建 Express 的 TypeScript 環境](/Backend/develop-express-with-typescript/)

### 安裝套件

先安裝 `file-type` 以及會用到的 `axios`

```
pnpm i file-type axios
```

### 功能實作

```typescript
import express from 'express';
import axios from 'axios';
import { fileTypeFromBuffer } from 'file-type';

const app = express();
const port = 3001;

// /images 路徑去 fetch 隨便一張圖片
app.get('/images', async (req, res) => {
  const { data } = await axios.get(
    'https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_3/v1645721429/rdaleorg/qblyqgwortzxvb3q4wct/testing.webp',
    {
      // 用 axios  取得圖片時，記得將 responseType 改為 arraybuffer
      responseType: 'arraybuffer'
    }
  );

  const buffer = Buffer.from(data);
  // fileTypeFromBuffer 方法中傳入圖片的 buffer 就能得到 fileType
  const fileType = await fileTypeFromBuffer(buffer); // { ext: 'jpg', mime: 'image/jpeg' }

  // fileType.mime 就是我們要的 mime types
  res.contentType(fileType.mime);
  return res.send(Buffer.from(data));
});

app.listen(port, () => {
  console.log(`Example app: http://localhost:${port}`);
});
```
