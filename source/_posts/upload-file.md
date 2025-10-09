---
title: '前端檔案上傳: 選擇檔案與拖曳檔案'
date: 2024-01-27 20:36:47
categories: Frontend
tags:
    - JavaScript
cover: /images/cover/file_upload.webp
description: 製作網頁上傳區域，結合拖曳及點擊選擇檔案功能，提升使用者體驗。透過直覺的拖曳動作或傳統的點擊方式，輕鬆選取檔案，使整個上傳流程更為靈活且方便，凸顯網頁互動設計的創新與便利性。
---

> 本文以上傳單一檔案上傳進行實作，讀者可以在熟悉以後延伸為多檔案上傳

## 建立簡易畫面

本文著重於檔案上傳，畫面採用以下簡易的 HTML 與 CSS，畫面看起來會是粉紅色區域加上黑色虛線框

```HTML
<div id="uploadArea" class="uploadArea"></div>
```

```CSS
.uploadArea {
  width: 800px;
  height: 400px;
  border: 4px dashed black;
  background-color: #faa;
}
```

## 點擊選擇上傳檔案

首先，我們先實作點擊上傳區域選擇檔案的方式

在原本 `.uploadArea` 元素中加入 `file` 類型的 `input` 標籤

```HTML
<div id="uploadArea" class="uploadArea">
  <input id="fileInput" class="fileInput" type="file" />
</div>
```

透過 CSS 把 `.fileInput` 元素的透明度設為 0，寬高都與父層 `.uploadArea` 相同

```CSS
.fileInput {
  opacity: 0;
  width: 100%;
  height: 100%;
}
```

如此一來，現在點擊上傳區域，就會出現選擇檔案的畫面

再來撰寫 JavaScript，我們需要在 `#fileInput` 元素上綁定 `change` 事件。之後選擇檔案，就可以觸發 `change` 事件，再從事件物件上取得要上傳的檔案

```JavaScript
const fileInputEl = document.querySelector('#fileInput');

fileInputEl.addEventListener('change', e => {
  const file = e.currentTarget.files[0];

  // 可以輸出看看 file，可以看到檔案相關資訊
  console.log(file);
});
```

完整的 HTML 檔案如下

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>File Upload</title>
    <style>
      .uploadArea {
        width: 800px;
        height: 400px;
        border: 4px dashed black;
        background-color: #faa;
      }

      .fileInput {
        opacity: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="uploadArea" class="uploadArea">
      <input id="fileInput" class="fileInput" type="file" />
    </div>

    <script>
      /**
       * 點擊選擇上傳檔案 
       */
      const fileInputEl = document.querySelector('#fileInput');

      fileInputEl.addEventListener('change', e => {
        const file = e.currentTarget.files[0];
        console.log(file);
      });
    </script>
  </body>
</html>
```

## 拖曳上傳檔案

接下來實作拖曳上傳檔案

我們先阻止 `#uploadArea` 上 `drop` 與 `dragover` 事件的預設行為

```JavaScript
const uploadAreaEl = document.querySelector('#uploadArea');

['dragover', 'drop'].forEach(eventType => {
  uploadAreaEl.addEventListener(eventType, e => e.preventDefault());
});
```

而在 `drop` 事件上，我們可以取得到檔案

```JavaScript
uploadAreaEl.addEventListener('drop', e => {
  const file = e.dataTransfer.files[0];

  // 可以打印看看 file，會可以看到檔案相關資訊
  console.log(file);
});
```

完整的 HTML 檔案如下

```HTML
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>File Upload</title>
    <style>
      .uploadArea {
        width: 800px;
        height: 400px;
        border: 4px dashed black;
        background-color: #faa;
      }

      .fileInput {
        opacity: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="uploadArea" class="uploadArea">
      <input id="fileInput" class="fileInput" type="file" />
    </div>

    <script>
      /**
       * 點擊選擇上傳檔案
       */
      const fileInputEl = document.querySelector('#fileInput');

      fileInputEl.addEventListener('change', e => {
        const file = e.currentTarget.files[0];
        console.log(file);
      });

      /**
       * 拖曳上傳檔案
       */
      const uploadAreaEl = document.querySelector('#uploadArea');

      ['dragover', 'drop'].forEach(eventType => {
        uploadAreaEl.addEventListener(eventType, e => e.preventDefault());
      });

      uploadAreaEl.addEventListener('drop', e => {
        const file = e.dataTransfer.files[0];
        console.log(file);
      });
    </script>
  </body>
</html>
```

檔案上傳區域的製作就完成了，隨後可以透過 `FormData` 傳送檔案到後端進行後續處理