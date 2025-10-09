---
title: '前端檔案上傳: 圖片預覽'
date: 2024-02-03 11:39:15
categories: Frontend
tags:
  - JavaScript
cover: /images/cover/file_upload.webp
description: 網頁前端上傳圖片預覽是提升使用者體驗的重要功能之一，在檔案上傳的情境中，很常是要上傳圖片檔案，本篇文章將實作圖片上傳後產生該圖片的預覽圖。使用者上傳圖片，透過 File API 讀取該檔案，並轉換成 DataURL，接著將該 URL 設定為圖片元素的 src 屬性，即可實現即時預覽。
---

> 此文章由上一篇文章 [前端檔案上傳: 選擇檔案與拖曳檔案](/Frontend/upload-file/) 繼續做延伸，並且以單一檔案進行實作，讀者熟悉後可延伸為多檔案上傳

## 加入預覽區域

以[上一篇文章](/Frontend/upload-file/)的架構，我們加入一個顯示預覽圖的區域

```HTML
<div id="uploadArea" class="uploadArea">
  <input id="fileInput" class="fileInput" type="file" />
</div>

<!-- 預覽區域 -->
<div id="previewArea"></div>
```

## 取得預覽圖片的 DataURL

接續上一篇文章，我們已經可以取得檔案 (file 物件)，便可以使用 `URL.createObjectURL()` 產生 DataURL (即 base64 圖片)，就可以預覽上傳的圖片，之後再操作 DOM 在預覽區域中插入 `img` 元素顯示該圖片

```JavaScript
const previewAreaEl = document.querySelector('#previewArea');

// 將圖片預覽封裝為 function
function imagePreview(file) {
  // 先清空 previewArea 內部元素
  previewAreaEl.innerHTML = '';
  // 取得 dataUrl
  const dataUrl = URL.createObjectURL(file);
  // 創建 img 元素
  const imgEl = document.createElement('img');
  // 將 img 元素的 src 填入 dataUrl
  imgEl.src = dataUrl;
  // 將 img 元素放到 previewArea 中
  previewAreaEl.append(imgEl);
}
```

## 整體 HTML 檔案

將檔案上傳與圖片預覽整合後，可以得到以下

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

    <!-- 預覽區域 -->
    <div id="previewArea"></div>

    <script>
      /**
       * 點擊選擇上傳檔案
       */
      const fileInputEl = document.querySelector('#fileInput');

      fileInputEl.addEventListener('change', e => {
        const file = e.currentTarget.files[0];
        // 調用圖片預覽
        imagePreview(file);
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
        // 調用圖片預覽
        imagePreview(file);
      });

      /**
       * 圖片上傳預覽
       */
      const previewAreaEl = document.querySelector('#previewArea');

      function imagePreview(file) {
        previewAreaEl.innerHTML = '';
        const dataUrl = URL.createObjectURL(file);
        const imgEl = document.createElement('img');
        imgEl.src = dataUrl;
        previewAreaEl.append(imgEl);
      }
    </script>
  </body>
</html>
```
