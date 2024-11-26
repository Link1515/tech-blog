---
title: GSAP 教學： Tween
date: 2023-12-23 20:40:55
categories: Frontend
tags:
    - GSAP
cover: /images/cover/gsap.jpg
description: 在 GSAP 中，可以將 Tween 視為一個 CSS 屬性設定器，我們可以在指定元素上，賦予起始屬性或終止屬性，隨後 GSAP 就會幫我們把動畫產生出來。
---

## 創建 GSAP Tween

可以用來創建 [Tween](https://gsap.com/docs/v3/GSAP/Tween/) 的方法如下 (他們的返回值都是 Tween)

- `gsap.to()` 指定終止屬性
- `gsap.from()` 指定起始屬性
- `gsap.fromTo()` 指定起始與終止屬性

透過這些方法，我們就可以開始做一些動畫

```javascript
gsap.to('.box', { rotation: 360, duration: 5 });
```

我們使用了 `gsap.to()`，代表我們希望指定動畫終止時的屬性，如同在一開始說的，我們傳入了要操作的元素 `.box`，以及我們希望的最終屬性 `{ rotation: 360, duration: 5 }`，也就是我們希望 `.box` 元素，在 5 秒內旋轉一圈

## GSAP Tween 的參數

`gsap.to(<CSS 選擇器>, <動畫配置>);`

### CSS 選擇器

透過傳入 CSS 選擇器去找到要操作的元素

### 動畫配置

也就是範例裡的 `{ rotation: 360, duration: 5 }`，可以使用

- CSS 樣式
    - 大部分的 CSS 樣式都是直接用小駝峰的形式(ex: `backgroundColor`)，使用在此參數的物件內
    - `transfrom` 相關的樣式會有一些比較簡單的寫法，如: `translateX` 可以直接用 `x`，`translateY` 可以直接用 `y`
    - 如果要做淡入淡出的動畫，可以使用 GSAP 提供的 `autoAlpha` 屬性，可以避免掉直接使用 `opacity` 與 `visibility` 產生的動畫缺陷
- 動畫相關設定 (以下舉例幾個常用到的設定)
    - `duration` 動畫時間長度 (單位為秒)
    - `delay` 動畫延遲時間長度 (單位為秒)
    - `ease` 動畫的 timing function，GSAP 另外提供了許多種參數，可參考 [Ease Visualizer](https://gsap.com/docs/v3/Eases/)
    - `paused` 動畫暫停 (動畫將不會自動撥放)
    - `repeat` 動畫重複次數，-1 代表無限多次
    - `yoyo` 動畫重複時，會再由結束屬性回到起始屬性
- 事件回調函數
    - onStart 開始時調用
    - onRepeat 重播時調用
    - onComplete 結束時調用

## 操作 GSAP Tween

我們除了直接使 Tween 的動畫撥放，也可以像是影片那樣來操作動畫

```javascript
// gsap.to() 會返回一個 Tween 的實例，透過這個實例就可以做各種操作
// 先透過 paused: true 不自動撥放 tween
const tween = gsap.to('.box', { rotation: 360, duration: 5, paused: true });

// 將 tween 的時間移動到 2 秒
tween.seek(2);
// 播放 tween
tween.play();
```

常用的操作方法

- `play()` 播放
- `pause()` 暫停
- `reverse()` 倒帶
- `restart()` 重頭撥放
- `seek()` 跳到指定秒數