---
title: GSAP 教學： Timeline
date: 2024-01-02 19:59:06
categories: Frontend
tags:
    - GSAP
cover: /images/cover/gsap.webp
description: Timeline 是 Tween 或者其他 Timeline 的容器，讓我們可以更簡單的製作複雜的動畫。舉例來說，如果沒有 Timeline 我們就只能用 Tween 上的 delay 屬性來決定動畫的先後，但透過 Timeline，我們就可以直接指定動畫的先後順序
---

## Timeline v.s. Tween

首先，我們先來做一個 [Timeline](https://gsap.com/docs/v3/GSAP/Timeline/) 與 [Tween](https://gsap.com/docs/v3/GSAP/Tween/) 的比較

我們有一個 `.box` 的元素，需要做一個動畫先往右移動 `200px`，隨後再往下移動 `200px`

如果只使用 Tween，那完成這個動畫需要去指定 `delay`

```javascript
gsap.to('.box', { x: 200, duration: 1 });
gsap.to('.box', { y: 200, duration: 1, delay: 1 });
```

但如果使用 Timeline，我們就可以直接像是串接動畫般，一個動畫一個動畫的播放。

```javascript
const tl = gsap.timeline();

tl
  .to('.box', { x: 200, duration: 1 })
  .to('.box', { y: 200, duration: 1 });
```

## 創建 Timeline

要使用 Timeline ，我們要取得 Timeline 的實例

```javascript
const tl = gsap.timeline();
```

此外，我們還可以在創建 Timeline 時傳入參數，可參考 [Special Properties and Callbacks](https://gsap.com/docs/v3/GSAP/Timeline/#special-properties-and-callbacks)

```javascript
const tl = gsap.timeline({
  paused: true,
  repeat: -1,
});
```

值得一提的參數 `defaults`，他可以傳入 Tween 的屬性，作為內部所有 Tween 的預設屬性

```javascript
const tl = gsap.timeline({
  defaults: {
    duration: 1,
    ease: 'elastic',
  },
});
```

## Timeline 中加入 Tween

正如引言說的，透過 Timeline 來包裹 Tween 會讓我們更容易地製作動畫，我們只需要串接我們的動畫，就可以讓動畫按照順序播放。這裡我們可以用 Tween 的方法

- `to()`
- `from()`
- `fromTo()`

在 Timeline 中加入 Tween

```javascript
// 創建一個 timeline，且內部每個 tween 的播放時間都是 3 秒
const tl = gsap.timeline({
  defaults: {
    duration: 3,
  },
});

// .box 先往右移 200，隨後往下移 200
tl
  .to('.box', { x: 200 })
  .to('.box', { y: 200 });
```

### Tween 在 Timeline 中的播放位置

在 Timeline 中 Tween 除了可以做本來的操作外，還可以指定在 Timeline 中播放的位置

我們可以直接指定 Timeline 中確切的秒數來作為播放的起始位置

```javascript
const tl = gsap.timeline({
  duration: 3,
});

// 在 timeline 的時間跑到 1 秒時，就開始做 y 方向的移動
tl
  .to('.box', { x: 200 })
  .to('.box', { y: 200 }, 1);
```

也可以透過 `>` 或 `<` 搭配 `+=` 來向前或向後指定相對秒數的起始位置

```javascript
const tl = gsap.timeline({
  duration: 3,
});

// 直接使用 < 代表與前一段動畫同時播放
tl
  .to('.box', { x: 200 })
  .to('.box', { y: 200 }, '<');

// y 方向移動的動畫向前偏移一秒，除了可以寫成 <+=1，也可以簡寫為 <1
tl
  .to('.box', { x: 400 })
  .to('.box', { y: 400 }, '<+=1');
```

## 操作 Timeline

就像 Tween 一樣，Timeline 也可以做到像是影片的播放行為(播放、停止、倒帶等)

- `play()` 播放
- `pause()` 暫停
- `reverse()` 倒帶
- `restart()` 重頭播放
- `seek()` 跳到指定秒數