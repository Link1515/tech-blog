---
title: PHP GD 套件使用教學
date: 2024-11-27 15:29:42
categories: Backend
tags:
  - PHP
cover: /images/cover/php.jpg
description: PHP GD 是一個功能強大的圖像處理套件，適合用於動態生成、修改和處理圖像。在這篇教學中，我們將介紹如何使用 GD 套件，並展示其基本功能。
---

> 確認是否已經啟用 GD 套件
> 開啟 PHP 設定檔 `php.ini` 檢查套件是否已經啟用。如果前面有用 ; 註解，就把 ; 去除掉
>
> ```
> extension=gd
> ```

## 創建繪圖區域

首先要先決定繪製的大小範圍，並調用 `imagecreatetruecolor()` 創建繪圖區域，也就是我們的圖紙大小

`imagecreatetruecolor(width, height)`

```PHP
$width = 400;
$height = 300;

$image = imagecreatetruecolor($width, $height);
```

## 定義顏色

GD 套件繪圖時，每個需要用的顏色都需要定義。舉例來說，如果我要用到白色、黑色、紅色、藍色，那就要將這幾的顏色先用 `imagecolorallocate()` 定義好，像是我們在畫畫前，先把要用的顏料準備好，後續才可以使用

`imagecolorallocate(image, red, green, blue)`

```PHP
$white = imagecolorallocate($image, 255, 255, 255);
$black = imagecolorallocate($image, 0, 0, 0);
$red   = imagecolorallocate($image, 255, 0, 0);
$blue  = imagecolorallocate($image, 0, 0, 255);
```

## 繪製

GD 提供許多函數來繪製圖形，以下舉幾個例子

### 填充背景

`imagefill(image, x, y, color)`

```PHP
imagefill($image, 0, 0, $white);
```

### 繪製矩形

左上角座標 `(x1, y1)`，右下角座標 `(x2, y2)`

`imagerectangle(image, x1, y1, x2, y2, color)`

```PHP
imagerectangle($image, 50, 50, 350, 250, $red);
```

### 繪製橢圓

圓心座標 `(x, y)`

`imageellipse(image, x, y, width, height, color)`

```PHP
imageellipse($image, 200, 150, 200, 100, $blue);
```

### 寫文字

- 文字左上角為 `(x, y)`
- `font` 內建可以使用 `1`, `2`, `3`, `4`, `5` 五種拉丁字母字型

`imagestring(image, font, x, y, string, color)`

```PHP
imagestring($image, 5, 200, 150, 'Hello GD!', $black);
```

## 輸出

將結果輸出為圖片檔，常用的方法有

- `imagepng(image, path, quality, filters)`
- `imagejpeg(image, path, quality)`

```PHP
imagepng($image, './my-pic.png');
```

## 釋放資源

圖片資源使用完後，使用 `imagedestroy()` 釋放資源

```PHP
imagedestroy($image);
```
