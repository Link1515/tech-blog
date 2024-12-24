---
title: Laravel 輸出中文 PDF
date: 2024-12-24 17:06:58
categories: Backend
tags:
  - Laravel
  - PHP
cover: /images/cover/laravel_pdf.jpg
description: 在使用 laravel-dompdf 產生 PDF 時，會遇到中文字顯示亂碼的問題，本篇文章提供解決辦法，幫助開發者順利生成完整且正確的中文 PDF。
---

## 安裝 laravel-dompdf 套件

首先先安裝 [laravel-dompdf](https://github.com/barryvdh/laravel-dompdf) 套件

```Bash
composer require barryvdh/laravel-dompdf
```

產出配置文件 `config/dompdf.php`

```Bash
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
```

laravel-dompdf 套件可以直接透過 Laravel 的模板(View)，直接產生出 PDF，使用起來非常方便

```PHP
use Barryvdh\DomPDF\Facade\Pdf;

// 在瀏覽器上下載
$pdf = Pdf::loadView('pdf.invoice', $data);
return $pdf->download('invoice.pdf');

// 直接在輸出在本地
$pdf = Pdf::loadView('pdf.invoice', $data);
return $pdf->save('invoice.pdf');
```

## 使用中文字體

預設 laravel-dompdf 並不能使用中文字體，直接在模板上使用中文，在輸出 PDF 時，會變成亂碼。為解決此問題，我們必須另外配置中文字體讓 laravel-dompdf 使用

我參考 laravel-dompdf issues #79 中 [chaiwei 的回覆](https://github.com/barryvdh/laravel-dompdf/issues/79#issuecomment-257003345)，採用裡面提到的步驟

1. 下載你要用的字體 (檔名建議使用英文，例如: NotoSansTC-Regular.ttf)

> 僅可使用 .ttf 或 .otf 字體檔案

2. 下載 [load_font.php](https://github.com/dompdf/utils/blob/master/load_font.php) 腳本
3. 將下載的字體與 `load_font.php` 放到 Laravel 專案的**根目錄**
4. 創建目錄 `storage/fonts`
5. 編輯 `load_font.php` 設定 `autoload.php` 位置與輸出字體位置

```PHP
// ...

require_once "vendor/autoload.php";

//...

$fontDir = "storage/fonts"; // 改成第四點的創建的目錄
```

6. 在 Laravel 專案**根目錄**下開啟終端機執行 `load_font.php` 腳本

> 此腳本提供載入同個字體的不同樣式 `php load_font.php [下載的一般字體 [下載的粗字體] [下載的斜字體] [下載的粗斜字體]]`
> 下載的粗字體、下載的斜字體、下載的粗斜字體為可選，不傳入就會直接使用一般字體

```Bash
php load_font.php "專案中使用的 font 名稱" 下載的字體.ttf
```

例如:

```Bash
php load_font.php "notosanstc" NotoSansTC-Regular.ttf
```

這就代表我載入了 `NotoSansTC-Regular.ttf` 字體，後續在專案中用 `notosanstc` 名稱使用此字體

> 之後若忘記當初取的字體名稱，可以到 `storage\fonts\installed-fonts.json` 中查看

在模板中，我們就可以直接透過 `font-family` 來設定字體

```HTML
<style>
    body {
        font-family: notosanstc
    }
</style>
```

7. 確認載入字體成功後，就可以把根目錄的字體與 `load_font.php` 刪除

## 使用多種中文字體

以上載入字體的方式只能載入一種字體，假如我們在執行一次，就會把先前的字體覆蓋，因此我修改了一下腳本，改成可以載入多字體，發佈到我的 github 上 [dompdf-load-multiple-fonts](https://github.com/Link1515/dompdf-load-multiple-fonts)

使用步驟與上一種方法相似，差別在於配置載入字體的方式:

1. 下載你要用的字體 (檔名建議使用英文，例如: NotoSansTC-Regular.ttf)

> 僅可使用 .ttf 或 .otf 字體檔案

2. 下載 [load_fonts.php](https://github.com/Link1515/dompdf-load-multiple-fonts/blob/master/load_fonts.php) 腳本
3. 將下載的字體與 `load_font.php` 放到 Laravel 專案的**根目錄**
4. 創建目錄 `storage/fonts`
5. 編輯 `load_font.php` 設定 `autoload.php` 位置、輸出字體位置與要載入的字體

載入字體的配置方式如下，其中 `normal` 字體樣式為必填，`bold`、`italic`、`bold_italic` 為選填

```PHP
$fonts = [
    'font_name' => [
        'normal'      => 'font_path (the font file you want to load)', // required
        'bold'        => 'font_path (the font file you want to load)', // optional
        'italic'      => 'font_path (the font file you want to load)', // optional
        'bold_italic' => 'font_path (the font file you want to load)', // optional
    ]
];
```

實際範例:

```PHP
$fonts = [
    'msjh' => [
        'normal'      => './Microsoft JhengHei Regular.ttf',
        'bold'        => './Microsoft JhengHei Bold.ttf',
        'italic'      => './Microsoft JhengHei Italic.ttf',
        'bold_italic' => './Microsoft JhengHei Bold Italic.ttf'
    ],
    'notosanstc' => [
        'normal'      => './NotoSansTC-Regular.ttf',
        'bold'        => './NotoSansTC-Bold.ttf',
        'italic'      => './NotoSansTC-Italic.ttf',
        'bold_italic' => './NotoSansTC-Bold-Italic.ttf'
    ]
];
```

6. 在 Laravel 專案**根目錄**下開啟終端機執行 `load_fonts.php` 腳本

```Bash
php load_fonts.php
```

7. 確認載入字體成功後，就可以把根目錄的字體與 `load_fonts.php` 刪除
