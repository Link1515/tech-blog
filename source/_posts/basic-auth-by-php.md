---
title: 透過 PHP 來了解 Basic Auth
date: 2024-03-23 08:00:00
categories: Backend
tags:
    - PHP
    - Basic Auth
cover: /images/cover/basic-auth.jpg
description: Basic Auth 是 HTTP 協定的一種認證機制，允許伺服器要求使用者提供使用者名稱和密碼才能存取受保護的資源。本文章將先講解 Basic Auth 整體流程，再透過 PHP 進行實作。
---

## Basic Auth 流程

1. 伺服器端 Response Header 帶上 `WWW-Authenticate: Basic realm="My Realm"`
2. 瀏覽器端就會看到一個彈窗要求使用者輸入帳號密碼
3. 瀏覽器將使用者的帳號與密碼以 `帳號:密碼` 的格式編碼為 `Base64`，並在 Request Header 上帶 `Authorization: Basic [編碼後的用戶帳密]`
4. 這組帳密會保存於瀏覽器中，之後請求自動帶上
5. 伺服器驗證帳號密碼，成功即返回 200，失敗則返回 401

> 需要注意，用戶的帳號密碼在傳輸時為明碼，可以直接解譯 Base64

## Basic Auth 實作

### 產生帳密彈窗

直接在 header 上加入 `WWW-Authenticate: Basic realm="My Realm"`，也加入 401 的 Http Status Code

![auth-challenge](/images/posts/basic-auth-by-php/auth-challenge.jpg)

```PHP
header('WWW-Authenticate: Basic realm="My Realm"');
http_response_code(401);
```

### 用戶輸入帳密

假設正確的帳號密碼為:

帳號: user1234
密碼: pass1234

我們在瀏覽器上輸入此帳密進行登入，並透過 `F12` 開發者工具的 `Network` 標籤查看請求

![auth-challenge](/images/posts/basic-auth-by-php/request.jpg)

在 Response Headers 發現我們帶的 `Www-Authenticate`，以及在 Request Headers 瀏覽器帶上的 `Authorization: Basic dXNlcjEyMzQ6cGFzczEyMzQ=`

我們可以對 `dXNlcjEyMzQ6cGFzczEyMzQ=` 進行 `base64` 解譯，可以看到這段字串實際上是 `user1234:pass1234`。由此可知，使用 Basic Auth 驗證時為明碼傳遞，需要小心資安問題

[Base64 Decode](https://emn178.github.io/online-tools/base64_decode.html)

![base64-decode](/images/posts/basic-auth-by-php/base64-decode.jpg)

## 完整伺服器驗證帳密 

### 1. 自行解析

```PHP
// 定義正確的帳號與密碼
define('USERNAME', 'user1234');
define('PASSWORD', 'pass1234');

$headers = getallheaders(); // request headers
$pass = false; // 是否通過 basic auth，預設為 false

// 檢查 request headers 上是否有 Authorization，並且此 Authorization 必須以 'Basic ' 開頭
if (isset ($headers['Authorization']) || preg_match('/Basic /', $headers['Authorization'])) {
  // 去除 Authorization 上的 'Basic ' 字串取得 base64 編碼後的帳密
  $base64Auth = preg_replace('/Basic /', '', $headers['Authorization']);
  // 解譯帳密，並用 : 隔成陣列，即變成 ['user1234', 'pass1234']
  $auth = explode(':', base64_decode($base64Auth));
  // 分別取出帳號密碼
  $username = $auth[0];
  $password = $auth[1];

  // 比對帳號密碼是否正確
  $pass = $username === USERNAME && $password === PASSWORD;
}

// 如果沒有通過 Basic Auth 就還是響應 WWW-Authenticate
if (!$pass) {
  header('WWW-Authenticate: Basic realm="My Realm"');
  http_response_code(401);
  exit;
}
```

### 2. 透過 PHP 全域變數

使用 PHP 時，其全域變數 `$_SERVER` 上就會自動幫我們解析 Basic Auth 的帳密，帳號為 `$_SERVER["PHP_AUTH_USER"]`，密碼為 `$_SERVER["PHP_AUTH_PW"]`，因此可以改寫為

```PHP
define('USERNAME', 'user1234');
define('PASSWORD', 'pass1234');


$pass = false;

if (isset ($_SERVER['PHP_AUTH_USER']) && isset ($_SERVER['PHP_AUTH_PW'])) {
  $pass = 
    $_SERVER['PHP_AUTH_USER'] === USERNAME && 
    $_SERVER['PHP_AUTH_PW'] === PASSWORD;
}

if (!$pass) {
  header('WWW-Authenticate: Basic realm="My Realm"');
  http_response_code(401);
  exit;
}
```