---
title: 前端使用 VSCode Debug
date: 2025-06-20 09:45:36
categories: Frontend
tags:
  - JavaScript
  - TypeScript
  - VSCode
cover: /images/cover/frontend-debug.webp
description: 本篇文章介紹如何在 JavaScript 或 TypeScript 專案中，使用 VSCode 進行前端 Debug 除錯。透過這些設定與方法，能有效提升開發效率，讓你在 VSCode 中更快速地定位錯誤與問題。
---

## 基本的 HTML + JavaScript Debug

首先先介紹基本的 HTML + JavaScript 在 VSCode 上 Debug 的方法，這裡說的基本是代表沒有透過 webpack、vite 等打包工具進行加工，而是直接自己在 HTML 中透過 `<script>` 標籤引入 JavaScript 原始碼，例如以下形式:

```HTML
<html>
  <body>
    <h1>範例</h1>
    <script src="main.js"></script>
  </body>
</html>
```

```JavaScript
// main.js

const el = document.querySelector('h1');
el.innerText = '標題被修改了';
console.log('成功!');
```

我們將這兩個檔案放在當前 VSCode 的工作目錄下

![setup-project](/images/posts/debug-frontend-code-by-vscode/setup-project.png)

選擇到 Run and Debug 頁籤，點擊 create a launch.json file，創建一個 Debug 的配置文件 `.vscode/launch.json`

![create-launch-file](/images/posts/debug-frontend-code-by-vscode/create-launch-file.png)

此處選擇 Web App (Chrome)，會產生 Chrome 的配置

![select-chrome](/images/posts/debug-frontend-code-by-vscode/select-chrome.png)

產生的配置中，會看到 `file` 欄位對應到我們的 HTML 檔案

![default-launch-file](/images/posts/debug-frontend-code-by-vscode/default-launch-file.png)

這時候就可以到 JavaScript 檔案中打斷點，接著點擊 Debug 頁籤中，上方的綠色開始按鈕，開始 Debug

![add-breakpoint](/images/posts/debug-frontend-code-by-vscode/add-breakpoint.png)

看到自動開啟瀏覽器，並且程式停在斷點，就代表成功囉

![start-debug](/images/posts/debug-frontend-code-by-vscode/start-debug.png)

## 已啟動 Local Server 的網站 Debug

先前展示的方式，主要針對單個 HTML 檔案的 Debug，但有時候我們已經透過其他工具開啟了本地 server，例如透過 Apache server、nodejs server 等，此時我們也可以修改配置，針對特定的網站根目錄與網址進行 Debug

先啟動 local server，這裡使用 [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 套件，起一個 `localhost:5500`

![open-with-live-server](/images/posts/debug-frontend-code-by-vscode/open-with-live-server.png)

修改原本的配置，將 `file` 去除，加上 `url` 與 `webRoot`，`url` 對應到 local server 的網址，`webRoot` 為網站的根目錄，此處設定 `${workspaceFolder}` 代表 VSCode 當前的工作目錄

```JSON
{
    "type": "chrome",
    "request": "launch",
    "name": "Launch Chrome",
    "url": "http://localhost:5500",
    "webRoot": "${workspaceFolder}",
},
```

再來一樣點擊 Debug 頁籤中，上方的綠色開始按鈕，開始 Debug

![add-breakpoint](/images/posts/debug-frontend-code-by-vscode/add-breakpoint.png)

## TypeScript Debug

如果專案所有的 JavaScript 都是從 TypeScript 產出來的，那在 Debug 時，就要將 `.js.map` 檔案一起產出來。如果是使用 [typescript](https://www.npmjs.com/package/typescript) 套件，可以在 `tsconfig.json` 中開啟 `sourceMap`，這樣一來在執行中的 `tsc` 指令時，就會一併產生出 `.js.map` 檔案，後續就可以用上述的方式進行 Debug

```JSON
{
  "compilerOptions": {
    "sourceMap": true
  }
}
```

> 如果是使用不同的 TypeScript 打包工具，通常也會有類似的配置，產生出 `.js.map` 檔案

## 使用其他 Chromium 瀏覽器 Debug

如果你和我一樣是使用 Brave 或其他的 Chromium 瀏覽器，在 `launch.json` 中可以加入 `runtimeExecutable` 直接指定瀏覽器執行檔位置

```JSON
"configurations": [
    {
        "type": "chrome",
        "request": "launch",
        "name": "launch brave",
        "url": "http://localhost:5500",
        "webRoot": "${workspaceFolder}",
        "runtimeExecutable": "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
    }
]
```
