---
title: 用 Google Sheets 產生 JSON 格式 API
date: 2024-01-14 10:52:20
categories: 其他
tags:
    - API
    - Apps Script
    - Google Sheets
    - JSON
cover: /images/cover/google-sheets-to-json.jpg
description: 在日常生活和工作中，我們經常使用 Google Sheets 進行資料整理和管理。但是，有沒有想過如何將這些資料變成可以方便地被其他程式或應用程序使用的API呢？ 本文將帶你了解如何利用 Google Sheets，輕鬆又快速地生成一個 API，使得你可以用 JSON 格式獲取你的資料。這樣的做法不僅簡化了資料分享的流程，還為開發者提供了更多應用的可能性。
---

## 建立 Google Sheets

先到 [Google Sheets](https://workspace.google.com/intl/zh-TW/products/sheets/) 的首頁，進行登入，並新建一個空白的試算表

![create-sheet](/images/posts/google-sheets-to-json/create-sheet.png)

範例中我們將試算表的名稱取為 “sheets to json”

![name-sheet](/images/posts/google-sheets-to-json/name-sheet.png)

## Google Sheets 中填寫資料

再來我們放上一些資料到 Google Sheets 中，這裡我們放圖片網址 `imageUrl`、標題 `title` 與描述 `description`

![fill-sheet](/images/posts/google-sheets-to-json/fill-sheet.png)

## 連接 Apps Script

接著，點上方的 `擴充工具 > Apps Script`，它會幫我們開啟一個 Google 專用的腳本，裡面可以用 JavaScript 語法來撰寫我們想要的邏輯

![connect-apps-script](/images/posts/google-sheets-to-json/connect-apps-script.png)

我們可以在 Apps Script 的資訊中看到當前的腳本已經與試算表做了連接

![check-connect-state](/images/posts/google-sheets-to-json/check-connect-state.png)

## 撰寫 Apps Script 腳本

點選左邊的編輯器選項，開始撰寫腳本

![apps-script-editor](/images/posts/google-sheets-to-json/apps-script-editor.png)

腳本內容

```javascript
/**
 * 使腳本能接收 GET 請求
 */
function doGet() {
    // 設定輸出資料與設定返回格式為 JSON
  return ContentService.createTextOutput(getDataAsJson()).setMimeType(ContentService.MimeType.JSON);
}


/**
 * 取得資料並轉為 JSON 格式
 */
function getDataAsJson() {
  // 選擇你的表格，getSheetByName('Sheet1') 中的 Sheet1 代表試算表下方標籤的名字，我們指定當前用的 Sheet1
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');

  // 取得試算表中所有資料
  var data = sheet.getDataRange().getValues();

  // 建立一個陣列
  var jsonData = [];

  // 透過 for 迴圈在 jsonData 中填入資料
  for (var i = 1; i < data.length; i++) {
    // 建立行物件
    var row = {};
    for (var j = 0; j < data[0].length; j++) {
      // 以行數為 id
      row.id = i;
      // 依序填入列名與值
      row[data[0][j]] = data[i][j];
    }
    // push 到 jsonData 中
    jsonData.push(row);
  }

  // 以 json 字串形式返回
  return JSON.stringify(jsonData);
}
```

## 佈署 Apps Script

點擊右上方的佈署，建立新的佈署

![deploy-apps-script](/images/posts/google-sheets-to-json/deploy-apps-script.png)

將類別中的 `Web app` 開啟

![deploy-web-app-option](/images/posts/google-sheets-to-json/deploy-web-app-option.png)

給這次的佈署一個簡單的描述，範例中寫 "my web app"，設定執行者 `Execute as` 為自己 `Me (你的 google 帳戶)`，設定可使用者 `Who has access` 為任何人 `Anyone`，完成後點下方的佈署 `Deploy`

> 注意，此佈署設定的 API 任何人都可以調用，請留意資料安全問題

![delploy-configuration](/images/posts/google-sheets-to-json/delploy-configuration.png)

隨後會產生一段網址，這段網址就可以拿來使用囉

![delploy-success](/images/posts/google-sheets-to-json/delploy-success.png)

實際產生的 JSON

![json-response](/images/posts/google-sheets-to-json/json-response.png)