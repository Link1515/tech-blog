---
title: Laravel-pdfdom 實用筆記
date: 2024-12-25 14:00:48
categories: Backend
tags:
  - Laravel
  - PHP
cover: /images/cover/laravel_pdf.jpg
description: 本文章詳細記錄了使用 laravel-dompdf 套件的一些實用技巧，幫助開發者更輕鬆地生成 PDF 文件。不管是剛接觸這個套件的新手，還是已經有經驗的開發者，都可以從中找到實用的建議，讓處理 PDF 文件變得更輕鬆。
---

> 文章使用 [laravel-dompdf](https://github.com/barryvdh/laravel-dompdf) 套件

## 設定預設樣式

產出 PDF 之前我建議先做一些設定一些預設樣式，能確保產生的 PDF 符合預期

```CSS
/** 確保文字正確換行 */
* {
    word-wrap: break-word;
    white-space: normal;
}

/** 清除預設的 margin 與 padding */
h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
}

/** 設定圖片最大寬度 */
img {
    max-width: 100%;
}

/** 設定 table 樣式 */
table {
    width: 100%;
    border-collapse: collapse;
}
```

## 每頁內容邊界

透過設定 @page 我們可以設定每頁內容邊界

```CSS
@page {
    margin: 60px
}
```

## PDF 頁首與頁尾樣式

頁首與頁尾是 PDF 常見的需求，我們可以額外開兩個元素特別處理頁首與頁尾

```HTML
{{-- ****** pdf header ****** --}}
<header class="pdfHeader">
    <div class="pdfHeader_content">這是頁首</div>
</header>

{{-- ****** pdf footer ****** --}}
<footer class="pdfFooter">
    這是頁尾
</footer>
```

使用 `position: fixed` 會在每一頁產生元素，透過此特性，我們就可以製作頁首與頁尾。`position: fixed` 定位的空間(可想成 DOM 的父層)會在**每頁內容邊界**之中，因此要製作頁首與頁尾，我們可以讓定位剛好貼齊紙張邊界

```CSS
@page {
    margin: 60px;  /** 代表內容與紙張的距離為 60px */
}

.pdfHeader {
    position: fixed;
    top: -60px;   /** 將頁首向上 60px 填補邊界 */
    left: 0;
    right: 0;
    height: 50px; /** 頁首設定高度 50px，底下留 10px 避免內文直接貼齊頁首 */
    font-size: 14px;
    border-bottom: 1px solid black;
}

/** 使頁首文字靠下 */
.pdfHeader_content {
    position: absolute;
    width: 100%;
    bottom: 0;
}

.pdfFooter {
    position: fixed;
    bottom: -60px; /** 將頁首向下 60px 填補邊界 */
    left: 0px;
    right: 0px;
    height: 50px;  /** 頁首設定高度 50px，底上留 10px 避免內文直接貼齊頁尾 */
    text-align: center;
    font-size: 12px;
}
```

下圖為頁首說明圖，而頁尾也是相同概念

![pdf_header](/images/posts/laravel-pdfdom-practical-notes/pdf_header.png)

## 頁碼

頁碼使用 [CSS counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters)，counter's value 為 `page`，並可透過 before 偽元素設定頁碼文字

```CSS
.page-number:before {
    content: "第 " counter(page) " 頁";
}
```

透過 `.page-number` 使用頁碼，常用於頁尾之中

```HTML
<footer class="pdfFooter">
    <div class="page-number"></div>
</footer>
```

## 換頁符號

有時候 PDF 中會需要提前換頁，等同於 Word 中的換頁符號，我們可以加入以下功能類別

```CSS
.break-before {
    page-break-before: always;
}
```

直接用 div 帶上 `.break-before` 就可以從此處直接換頁

```HTML
<div class="break-before"></div>
```

## 避免元素被換頁切割

出現在頁與頁交接處的元素，會被切割成兩頁，為避免元素被切割，可加入以下功能類別。常用於表格、圖文

```CSS
.avoid-break {
    page-break-inside: avoid;
}
```

以下範例不希望表格被分頁切割，因此在 table 元素上加入 `.avoid-break`

```HTML
<table class="avoid-break">
    <thead>
        <tr>
            <th>編號</td>
            <th>名稱</td>
            <th>描述</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>項目 1</td>
            <td>這是項目 1</td>
        </tr>
        <tr>
            <td>2</td>
            <td>項目 2</td>
            <td>這是項目 2</td>
        </tr>
    </tbody>
</table>
```

## 圖片顯示異常

使用 pdfdom 套件，圖片可以直接用 HTML 的 img 標籤引入，但有時候會因請求時間過長等原因造成死圖，此時我們可以將圖片轉換成 base64 後，再放到 img 標籤，就可以避免死圖

先在模板上定義 `imageToBase64()` 函數，協助我們將圖片連結轉為 base64

```PHP
@php
    function imageToBase64($imageUrl)
    {
        $imageData = file_get_contents($imageUrl);

        if ($imageData === false) {
            throw new Exception('Failed to retrieve image data from ' . $imageUrl);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($imageData);

        $base64 = base64_encode($imageData);

        return 'data:' . $mimeType . ';base64,' . $base64;
    }
@endphp
```

使用時就可以在 img 標籤直接帶入 `imageToBase64()`

```HTML
<img src="{{ imageToBase64('https://placehold.co/600x400/png') }}" />
```

## 總結

最後，提供整合以上各項內容的模板

```HTML
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            word-wrap: break-word;
            white-space: normal;
        }

        h1, h2, h3, h4, h5, h6, p {
            margin: 0;
            padding: 0;
        }

        img {
            max-width: 100%;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        @page {
            margin: 60px;
        }

        .pdfHeader {
            position: fixed;
            top: -60px;
            left: 0;
            right: 0;
            height: 50px;
            font-size: 14px;
            border-bottom: 1px solid black;
        }

        .pdfHeader_content {
            position: absolute;
            width: 100%;
            bottom: 0;
        }

        .pdfFooter {
            position: fixed;
            bottom: -60px;
            left: 0px;
            right: 0px;
            height: 50px;
            text-align: center;
            font-size: 12px;
        }

        .page-number:before {
            content: "第 " counter(page) " 頁";
        }

        .break-before {
            page-break-before: always;
        }

        .avoid-break {
            page-break-inside: avoid;
        }
    </style>
</head>


@php
    function imageToBase64($imageUrl)
    {
        $imageData = file_get_contents($imageUrl);

        if ($imageData === false) {
            throw new Exception('Failed to retrieve image data from ' . $imageUrl);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($imageData);

        $base64 = base64_encode($imageData);

        return 'data:' . $mimeType . ';base64,' . $base64;
    }
@endphp

<body>
    {{-- ****** pdf header ****** --}}
    <header class="pdfHeader">
        <div class="pdfHeader_content">這是頁首</div>
    </header>

    {{-- ****** pdf footer ****** --}}
    <footer class="pdfFooter">
        <div class="page-number"></div>
    </footer>
</body>

</html>
```

## 相關文章

如果是遇到 PDF 中文輸出問題，可以另外參考 [Laravel 輸出中文 PDF](/Backend/make-pdf-by-laravel)
