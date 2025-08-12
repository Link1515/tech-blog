---
title: Laravel Sanctum 快速搭建登入功能
date: 2025-08-12 09:31:47
categories: Backend
tags:
  - Laravel
  - PHP
cover: /images/cover/laravel.webp
description: 透過 Laravel Sanctum，快速實作安全、輕量的登入功能！本文詳細教你從安裝、設定到 API 驗證流程，一步步完成 Laravel 基本登入系統，適合新手開發者快速上手。
---

> 本文使用 laravel 12 進行示範

## 安裝 Sanctum

```bash
php artisan install:api
```

途中會問你要不要執行 DB migrations，此處選擇是 (y)

```
One new database migration has been published.
Would you like to run all pending database migrations? (yes/no)
```

> 如果想知道 migrations 做了什麼修改，可以到 `database\migrations` 目錄中查看自動產生的檔案

完成後，會請你到 User 類中加入 `HasApiTokens` trait

```
INFO  API scaffolding installed.
Please add the [Laravel\Sanctum\HasApiTokens] trait to your User model.
```

開啟 `app\Models\User.php` 檔案，加入 trait

```php
<?php

namespace App\Models;

// ...
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    // ...
}
```

## 創建 AuthController

```bash
php artisan make:controller AuthController
```

建立基礎的註冊 (register) 與登入 (login) 方法，並在登入方法中發送 auth token 給 client

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create($validated);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!auth()->attempt($validated)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 422);
        }

        $user = auth()->user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
        ]);
    }
}
```

## 創建路由

開啟 `routes\api.php` 加入 auth 相關路由

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 註冊路由
Route::post('/register', [AuthController::class, 'register']);
// 登入路由
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // 受驗證保護的路由，需要帶入 auth token 才可以訪問
    Route::get('test', function () {
        return 'Auth passed!';
    });
});
```

## 操作 API

啟動 Laravel 應用

```bash
php artisan serve
```

> 常見問題: 如果在打註冊與登入 API，都是返回 html 頁面，記得檢查在 reqeust header 是否有帶上 `Accept: application/json`

### /api/register 註冊用戶

```bash
curl --location 'http://127.0.0.1:8000/api/register' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "test",
    "email": "hello@test.com",
    "password": "123456789",
    "password_confirmation": "123456789"
}'
```

### /api/login 登入

使用剛剛註冊的 email 與 password 進行登入

```bash
curl --location 'http://127.0.0.1:8000/api/login' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "hello@test.com",
    "password": "123456789"
}'
```

成功登入後會返回一個 auth token

```json
{
    "token": "1|yz6rKhQjGXxkD6GomvM8pZn93kpIz65LBExhzgMmaaccc161"
}
```

### 帶上 auth token

剛剛在 `/api/login` 中取到的 auth token 帶入 request header 中的 `Authorization`，並在前面加入 `Bearer` 字串

```bash
curl --location 'http://127.0.0.1:8000/api/test' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer 1|yz6rKhQjGXxkD6GomvM8pZn93kpIz65LBExhzgMmaaccc161'
```

成功打通就會看到我們設定的字串

```
Auth passed!
```