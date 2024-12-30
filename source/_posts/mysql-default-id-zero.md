---
title: MySQL primary key 使用 default 關鍵字產生 0
date: 2024-06-24 16:55:42
categories: Backend
tags:
    - MySQL
cover: /images/cover/mysql-id-0.webp
description: '最近在工作中，同事操作資料庫進行 INSERT 操作時，每次新增的 id 都會被設為 0。起初我們以為這是 ORM 的 Bug，因此決定更換另一款 ORM；然而，即使更換後問題依舊存在。這時我們開始懷疑並非 ORM 的問題。後來我在本地端進行測試時，一切都運行正常，但在使用遠端資料庫時，id 仍然被設置為 0。顯然，這是由於遠端資料庫的某些設定所導致的。本文將記錄我們如何解決這個問題。'
---

## 問題重現

簡單創建一個 `users` 表，其中有 `id` 與 `full_name` 欄位，且 `id` 為 `primary key` 與 `AUTO_INCREMENT`

```SQL
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `full_name` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

使用 ORM 執行 `INSERT` 時，產生以下 SQL 語句，可以注意這邊有將 `id` 設定成 `default`，這是這次問題產生的主要原因。此時會創建一個 `id` 為 `0` 的 `user`，如果再執行一次就會嘗試再次產生一個 `id` 為 `0` 的 `user`，而報出錯誤 `Duplicate entry '0' for key 'PRIMARY'`

```SQL
INSERT INTO `users` (`id`, `full_name`) VALUES (default, 'Terry');
```

## 解決辦法

經過研究發現遠端的資料庫有一項設定 `NO_AUTO_VALUE_ON_ZERO`，它會將我們的 `AUTO_INCREMENT` 的 `default` 改成 `0`

```SQL
SELECT @@sql_mode;
-- ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_AUTO_VALUE_ON_ZERO,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

要取消此設定，有兩種方法，一種是到遠端機器上設定並重新啟動資料庫，另一種就是在每次連線時進行設定，這裡演示後者。方法也比較簡單，就是在建立連線後，直接設定 `sql_mode`，將 `NO_AUTO_VALUE_ON_ZERO` 去除

```SQL
SET @@sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
```

後續就可以正常的進行 `INSERT` 操作