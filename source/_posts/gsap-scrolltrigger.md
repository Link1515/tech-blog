---
title: GSAP 教學： ScrollTrigger
date: 2024-01-06 09:39:41
categories: Frontend
tags:
    - GSAP
cover: /images/cover/gsap.webp
description: ScrollTrigger 是 GSAP 的一個擴充套件，用來製作滑鼠滾動觸發動畫。ScrollTrigger 提供強大的滾動控制，讓網頁動畫輕鬆實現。透過簡單的 API，你能精確掌握動畫觸發點、速度和方向，呈現更流暢、自然的視覺效果。
---

## 註冊 ScrollTrigger

GSAP 要使用擴充套件 ([plugins](https://gsap.com/docs/v3/Plugins/)) 都需要註冊後才能使用。註冊以後，[Tween](https://gsap.com/docs/v3/GSAP/Timeline/) 與 [Timeline](https://gsap.com/docs/v3/GSAP/Timeline/) 中就可以配置 [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

## 基本使用

ScrollTrigger 最簡單的用法就是直接在 `scrollTrigger` 配置滾動觸發的元素，當該元素進入可視範圍後，就會開始執行動畫

以下範例執行過程為，當 `.box` 進入可視範圍後，`.box` 會旋轉一圈

```javascript
gsap.to('.box', {
  scrollTrigger: '.box',
  rotation: 360,
});
```

`scrollTrigger` 配置項除了可以直接寫 CSS 選擇器決定觸發元素外，也可以傳入完整的[配置](https://gsap.com/docs/v3/Plugins/ScrollTrigger/?page=1#config-object)，以下先介紹幾個基本的配置

```javascript
gsap.to('.box', {
  scrollTrigger: {
    /**
     * 顯示標記
     * 可以更清楚的看到觸發時機
     */
    markers: true,

    /**
     * 起始標記
     * 可以用字串寫 top / bottom，也可以搭配 += / -= 做偏移調整，第一個代表 trigger 元素，第二個代表滾動條
     */
    start: 'top bottom-=200',

    /**
     * 結束標記
     * 與起始標記的配法相同
     */
    end: 'bottom bottom-=100',

    /**
     * 觸發動作
     * 四個代表:
     * 進入(滾動條起始標記由上往下對應到 trigger 起始標記)
     * 離開(滾動條結束標記由上往下對應到 trigger 結束標記)
     * 反向進入(滾動條結束標記由下往上對應到 trigger 結束標記)
     * 反向離開(滾動條起始標記由下往上對應到 trigger 起始標記)
     *
     * 可填寫的字串: "play", "pause", "resume", "reset", "restart", "complete", "reverse", "none"
     *
     * 預設為 play none none none
     */
    toggleActions: 'play pause play reset',

    /**
     * 吸附效果
     * 產生 position: sticky 效果，會從起始標記對應處吸附到結束標記對應處
     */
    pin: true,
  },
  rotation: 360,
});
```

## 滾動條控制動畫

一般情況下，ScrollTrigger 在起始標記對應到後，就會開始播放動畫，但除了這種模式以外 ScrollTrigger 也可以完全的透過起始與結束標記的距離來控制動畫。當我們慢慢往下滑動滾動條時，動畫就會慢慢播放，當我們由下往上快速滾動時，動畫就會快速的倒轉，當我們停在中間時，動畫就會定格

要達到這種效果，我們可以在原本的 `scrollTrigger` 配置 `scrub: true`，整體動畫就是由標記的進度控制

```javascript
gsap.to('.box', {
  scrollTrigger: {
    trigger: '.box',
    markers: true,
    start: 'top bottom-=200',
    end: 'bottom bottom-=180',
    toggleActions: 'play pause play reset',
    pin: true,
    // 必須加上此配置
    scrub: true,
  },
  rotation: 360,
});
```

`scrub` 開啟後，才可以有這種效果，而這個屬性除了可以傳布林值，也可以傳數字，而這個數字像是控制動畫摩擦力，數字愈大摩擦力愈小，所以在滾動完滾動條後，動畫還會往後再播放一點點，整體會感覺比較沒有這麼僵硬

> 這種透過標記的距離來控制動畫的方法，如果我們 `pin` 住一個全螢幕的容器，就可以透過滾動條來產生很酷炫的動畫

## 自動移到下一個標籤 (label)

在 Timeline 中，我們可以加入標籤 (label) 作為 Timeline 中特別的時間點，而在 ScrollTrigger 中，我們可以指定滾動條自動移到下一個標籤

這時候，我們需要在 `scrollTrigger` 中的參數加上 `snap`

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.box',
    markers: true,
    start: 'top bottom-=200',
    end: 'bottom bottom-=180',
    toggleActions: 'play pause play reset',
    pin: true,
    scrub: true,
    // 滾動條將自動滾到離當前方向最近的標籤
    snap: 'labelsDirectional',
  },
});

// 加入三個 label
tl.addLabel('start')
  .to('.box', { rotation: 360 })
  .addLabel('label-1')
  .to('.box', { x: 200 })
  .addLabel('end');
```

### snap 配置

`snap` 參數可以傳入字串或物件

字串形式:
- `labels` 移動到最近的標籤
- `labelsDirectional` 移動到當前滾動方向最近的標籤

物件形式:

```javascript
{
  snapTo: "labels", // 和字串形式相同，可以填 labels 或 labelsDirectional
  duration: { min: 0.2, max: 3 }, // 自動滾動的動畫長度
  delay: 0.2, // 延遲時間
  ease: "power1.inOut", // timing function
}
```