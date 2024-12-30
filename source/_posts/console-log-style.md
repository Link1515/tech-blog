---
title: console.log() 印出樣式
date: 2024-05-06 15:59:03
categories: Frontend
tags:
    - JavaScript
cover: /images/cover/javascript_console_log_style.webp
description: 在網頁開發中，我們經常會使用 console.log() 來印出訊息，方便我們追蹤程式碼的執行狀況。然而，你知道嗎？console.log() 不僅可以印出一般文字，還可以印出帶有樣式的字串！透過在 console.log() 中加入樣式資訊，可以讓印出的訊息更加醒目易讀，提高除錯效率。例如，你可以將錯誤訊息標記為紅色，或是將重要訊息加粗顯示。
---

## 使用 %c 佔位符來寫 CSS 樣式

我們可以將 `%c` 佔位符放在要加入樣式的地方，隨後依序傳入對應的 CSS 樣式
- 即第一個 `%c` 對應到 `background-color: red`，第二個 `%c` 對應到 `color: red`
- `%c` 會將其之後的字串都套用樣式

```JavaScript
console.log('%c[Error]%c Syntax error!', 'background-color: red', 'color: red');
```

![style_placeholder](/images/posts/console-log-style/style_placeholder.webp)

### 結果

![style_placeholder_result](/images/posts/console-log-style/style_placeholder_result.webp)

## 使用跳脫字符

透過特殊跳脫字符的組合也可以讓 `console.log()` 產生樣式

> 更多可參考 [ANSI Color Codes](https://talyian.github.io/ansicolors/)

- 字體裝飾
    - reset: `\x1b[0m`
    - bold: `\x1b[1m`
    - italic: `\x1b[3m`
    - underscore: `\x1b[4m`
- 字體顏色
    - black: `\x1b[30m`
    - red: `\x1b[31m`
    - green: `\x1b[32m`
    - yellow: `\x1b[33m`
    - blue: `\x1b[34m`
    - magenta: `\x1b[35m`
    - cyan: `\x1b[36m`
    - white: `\x1b[37m`
- 背景顏色
    - black: `\x1b[40m`
    - red: `\x1b[41m`
    - green: `\x1b[42m`
    - yellow: `\x1b[43m`
    - blue: `\x1b[44m`
    - magenta: `\x1b[45m`
    - cyan: `\x1b[46m`
    - white: `\x1b[47m`

```JavaScript
console.log('\x1b[41m[Error]\x1b[0m\x1b[31m Syntax error!');
```


![style_escape](/images/posts/console-log-style/style_escape.webp)

### 結果

![style_escape_result](/images/posts/console-log-style/style_escape_result.webp)