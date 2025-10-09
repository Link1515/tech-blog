---
title: 用資料夾區分不同的 Git 用戶設定
date: 2025-02-14 16:26:02
categories: Others
tags:
  - Git
cover: /images/cover/git.webp
description: 在不同專案中，我們可能需要使用不同的 Git username 和 email。透過設定 .gitconfig，我們可以根據資料夾自動套用對應的用戶設定，而無需每次手動調整。本文章將透過實際範例，示範如何進行這項配置。
---

## 創建用戶專用資料夾

首先，先創建一個專門給某個 Git 用戶的資料夾，我創建 `D:/myProject`，代表在這個資料夾下，我要用特定的 Git 用戶。

在此資料夾中，再新建一個 `.gitconfig` 檔案，並在裡面加入 Git 用戶資訊，也就是你在這個目錄下想要用的 `email` 與 `name`

```
[user]
	email = <your-specific-email>
	name = <your-specific-username>
```

## 設定 includeIf

做好專用資料夾後，我們需要編輯使用者目錄 (家目錄 `~`) 下的 `.gitconfig` 檔案，告訴 Git 在指定條件下去讀專用資料夾的設定

用你習慣的編輯器打開 `~/.gitconfig`，在裡面會看到一些目前已經有的全域設定，到**最下面**加入

```
[includeIf "gitdir:D:/myProject/"]
    path = D:/myProject/.gitconfig
```

這代表，如果當前 Git 的工作目錄在 `D:/myProject` 下，就去引入 `D:/myProject/.gitconfig` 中的設定，採用裡面設定的用戶資訊

> 當然，你也可以針對專用目錄設定除了用戶資訊以外的配置

> 需要注意，`.gitconfig` 文件有後面配置覆蓋前面配置的特性，所以要確保專用資料夾的設定生效，並且不被覆蓋，建議將 `includeIf` 放在文件最後

## 測試是否設定成功

現在，我們可以到專用資料夾 `D:/myProject` 中創建新資料夾並進行 Git 初始化，再透過指令檢查，就可以發現成功設定用戶資訊

```Bash
git config user.name
git config user.email
```
