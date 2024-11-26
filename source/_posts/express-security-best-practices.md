---
title: Express 資安最佳實踐
date: 2024-03-10 14:46:49
categories: Backend
tags:
    - Express
cover: /images/cover/express.jpg
description: '本文章參考 Express 官方文件中的 Production Best Practices: Security，逐項列出官方推薦的最佳實踐，確保我們在開發 Express 應用時，能有效的防範資安漏洞'
---

> 官方原文: [Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html)

## 不使用棄用或有資安問題的 Express 版本

- Express 4 以下的版本已經不再維護，盡量避免使用。要升級到版本 4 可以參考 [Moving to Express 4](https://expressjs.com/en/guide/migrating-4.html)
- 也避免使用有資安問題的版本，可以參考 [Security updates](https://expressjs.com/en/advanced/security-updates.html)

## 使用 TLS

- 使用 `TLS(Transport Layer Security)` 來進行連線與資料傳輸
- 在網頁瀏覽上即為使用 `https` 協議
- 可以防止網路封包被監聽 (packet sniffing) 或 中間人攻擊 (man-in-the-middle attacks)
- 如果本來是使用 `SSL` 建議升級為 `TLS`
- 可以使用由 Internet Security Research Group (ISRG) 提供的 Let’s Encrypt 取的免費的 `TLS` 憑證

## 使用 helmet 套件

- [Helmet](https://helmetjs.github.io/) 套件是由許多 Express middleware 組成，透過設置 HTTP header 來防範一些常見的網頁資安漏洞。如以下範例
- `helmet.contentSecurityPolicy` 設置了 `Content-Security-Policy` 來避免跨站腳本攻擊(XSS)
- `helmet.hsts` 設置了 `Strict-Transport-Security` 來確保使用 HTTPS 連線
- `helmet.frameguard` 設置了 `X-Frame-Options` 防範點擊劫持(clickjacking)

安裝與使用

```JavaScript
// ...

const helmet = require('helmet');
app.use(helmet());

// ...
```

## 禁用 X-Powered-By header

- 盡量避免暴露伺服器資訊
- `helmet` 套件已經幫我們做了，使用後就會直接禁用 `X-Powered-By`

```JavaScript
app.disable('x-powered-by');
```

## 適當的使用 cookie

- 使用 [express-session](https://www.npmjs.com/package/express-session) 或 [cookie-session](https://www.npmjs.com/package/cookie-session)
- `express-session`
    - 取代 Express 3.x 中的 `express.session`
    - 此套件將資料存放於 server，`cookie` 上只會帶 `session ID`
    - 套件預設使用 in-memory storage，此方法並不適合用在正式環境，要在正式環境使用需要設定 `session-store`，可以參考 [compatible session stores](https://github.com/expressjs/session#compatible-session-stores)
- `cookie-session`
    - 取代 Express 3.x 中的 `express.cookieSession`
    - 實踐了 `cookie-backed storage` 將整個資料都存在 `cookie`
    - 僅建議於資料量小且易於加密時使用
    - 資料建議為基本型別 (`string`, `number`, `boolean`, `null`, `undefined`)，避免為物件 (`Object`)
    - 要注意 `cookie` 上的資料是可以被 client side 看到的，如果有不能被 client side 看到資料的考量，可以改用 `express-session`
- 避免使用預設的 `cookie` 名稱。以下為使用 `express-session` 的範例

```JavaScript
const session = require('express-session');
app.set('trust proxy', 1); // trust first proxy
app.use(
  session({
    secret: 's3Cur3',
    name: 'sessionId'
  })
);
```

- 設定 `cookie` 的安全配置
    - `secure`: 只有在 `HTTPS` 連線時才會送 `cookie`
    - `httpOnly`: 只有在 `HTTP(S)` 傳輸時才可以訪問到 `cookie`，用戶端的 JavaScript 無法取得到 `cookie`
    - `domain`: 設定 `cookie` 的 `domain`
    - `path`: 設定 `cookie` 的 `path`
    - `expires`: 設定 `cookie` 的過期時間

## 禁止暴力猜測密碼

- 限制同一個用戶和 IP 連續嘗試登入失敗的次數，ex: 用戶連續登入失敗 5 次就要等 5 分鐘才可以再次嘗試
- 限制 IP 地址在某個長時間內允許失敗的次數，ex: 一個 IP 每天只能登入失敗 100 次
- 可以使用 [rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible) 套件

## 確保安裝的套件都是安全的

- npm 6 以後可以使用 `npm audit` 來分析套件
- 如果需要更好的分析，可以使用 [Snyk](https://snyk.io/)

## 避免其他已知的資安漏洞

- 關注 [Node Security Project](https://github.com/advisories) 與 [Snyk](https://security.snyk.io/) 的資安建議，這些都是很好的資源
- 了解常見的資安漏洞，並避免發生這些資安問題

## 其他

以下來自 Node.js Security Checklist 的建議

- 永遠都要過濾用戶的輸入，避免 `cross-site scripting (XSS)` 與 `command injection attacks`
- 透過參數化查詢 (parameterized queries) 與準備語句 (prepared statements) 來避免 `SQL injection attacks`
- 使用開源工具 `sqlmap` 來檢測 `SQL injection` 的問題
- 使用 `nmap` 與 `sslyze` 工具檢測 `SSL ciphers`, `keys`, and `renegotiation` 與憑證的有效性
- 使用 `safe-regex` 確保正則表達式不會受到 `regular expression denial of service attacks`