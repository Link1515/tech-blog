---
title: 'Vue 3 plugin: 自製 $ 方法'
date: 2024-03-06 15:57:41
categories: Frontend
tags:
    - Vue
    - TypeScript
cover: /images/cover/vue.webp
description: 在 Vue 3 中，自製 plugin 是一種擴充 Vue 功能的方式。透過自製 plugin，我們可以向 Vue 添加新的全局方法、屬性或指令。在本篇文章中，我們將介紹如何自製一個 $ 方法。
---

> 可使用 Vite 創建 Vue 專案，參考 [vite getting started](https://vite.dev/guide/)

## 建立 plugin

新建 `src/plugins/helloPlugin.ts`

```JavaScript
// 從 vue 中取得 App 與 Plugin 的型別
import type { App, Plugin } from 'vue';

// 自訂可傳入的 options
// 這裡允許傳入 emoji
interface Options {
  emoji: string;
}

// plugin 的主體
export const helloPlugin: Plugin = {
  install: (app: App, options: Options) => {
    // 在 app 上放一個全局的 $hello 方法
    // $hello 方法可以傳入一個名字，並進行拼串
    app.config.globalProperties.$hello = (name: string) =>
      `hello, ${name} ${options.emoji}`;
  }
};
```

## 在入口文件中引入並使用 plugin

在 `main.ts` 中

```JavaScript
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// 引入剛剛寫的 plugin
import { helloPlugin } from './plugins/helloPlugin';

createApp(App)
  // use plugin 並傳入 options (即為剛剛設定的 Options interface)
  .use(helloPlugin, { emoji: '👀' })
  .mount('#app');
```

## 自定義型別

新建 `src/type.d.ts`

```JavaScript
import { ComponentCustomProperties } from 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    $hello: (name: string) => string;
  }
}
```

### 在 template 中使用

直接在 `src/App.vue` 中使用看看

```Xml
<template>
  <h2>{{ $hello('Lynk') }}</h2>
</template>
```

渲染的結果為: hello, Lynk 👀