---
title: tls-server-by-nodejs
date: 2024-03-16 08:00:00
categories: Backend
tags:
    - Node.js
    - TLS
cover: /images/cover/tls.jpg
description: 隨著網路安全的日益重要，使用 TLS 加密資料傳輸已成為必不可少的措施。TLS 是一種安全協議，可確保資料在傳輸過程中不被竊聽或篡改。本文章將以 Node.js 來起一個 TLS Server ，並使用我們自己產生的憑證來進行 demo
---

## 產生 Key 與 Certificate

在使用 `TLS` 協議時，server 需要一個 `key` 進行資料加密，還需要一個 `certificate` (憑證) 確保 server 是被認證的。通常 `certificate` 是由機構認證的，如: Let’s Encrypt、Comodo、DigiCer … 等，在此範例中，我們使用自簽 `certificate` 來進行演示

首先要先確認設備上已經有 [openssl](https://www.openssl.org/)

```
openssl -v
```

### 生成 Key

這個產生出來的 key 實際上是 `private key`

```Bash
openssl genrsa -out server-key.pem 2048
```

透過 `private key` 也可以取得 `public key`，而 `public key` 會一起放在 `certificate` 中，所以我們無需特別去產 `public key` 檔案

```Bash
# 產 public key 的方法，可以不用執行
openssl rsa -pubout -in server-key.pem -out server-key.pub
```

### 自簽 certificate

在 `certificate` 中，會透過 `private key` 產生 `public key` 放到 `certificate` 中，client side 可以從 `certificate` 取得 `public key` 對資料進行加密，後續到 server 後再進行解密

```Bash
openssl req -new -key server-key.pem -x509 -days 365 -out server-cert.pem
```

## Node.js 啟動 TLS Server

```JavaScript
const tls = require('tls');
const fs = require('fs');

// 建立 tls server
const server = tls.createServer({
  // 使用 private key
  key: fs.readFileSync('server-key.pem'),
  // 使用 certificate
  cert: fs.readFileSync('server-cert.pem')
});

server.on('secureConnection', socket => {
  console.log('Client connected');

  socket.on('data', data => {
    console.log('Received data from client:', data.toString());

    socket.write('Hello, client!');

    // 斷開 client 連線
    socket.end();
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server listening on port 8080');
});
```

當有 client 連上此 server 後，server 的終端機會印出 "Client connected"，並在 client 傳資料到 server 時，印出 client 傳來的資料，並返回 "Hello, client!" 到 client side

## Node.js 作為 Client 連上 Server

因為我們用自簽憑證，需要加入 `NODE_TLS_REJECT_UNAUTHORIZED = 0` 環境變數，允許連線到不被信任的 server

```JavaScript
const tls = require('tls');
const fs = require('fs');

// 允許連線到不信任的 server (自簽憑證)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

// 進行 tls 連線
const client = tls.connect({
  host: 'localhost',
  port: 8080,
});

client.on('connect', () => {
  console.log('Client connected to server');

  client.write('Hello, server!');
});

client.on('data', data => {
  console.log('Received data from server:', data.toString());
});

client.on('end', () => {
  console.log('Client disconnected from server');
});
```

當連上 server 後，終端機印出 "Client connected to server"，並在收到 server 傳來的資料時，印出 server 來的資料 (即 "Hello, client!")

## 瀏覽器作為 Client 連上 Server

用瀏覽器連上 `https://localhost:8080`

> 注意這裡是使用 `https` 而不是 `http`

會先看到是否連上不信任的 server，可以按 advance 連上此 server

![browser-connect-warning](/images/posts/tls-server-by-nodejs/browser-connect-warning.jpg)

就可以成功在畫面上看到 Hello, client!