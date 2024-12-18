---
title: 在 VSCode 中使用 Xdebug 為 PHP 除錯
date: 2024-12-18 09:33:10
categories: Others
tags: 
    - PHP
    - Xdebug
    - VSCode
cover: /images/cover/vscode_xdebug.jpg
description: 文詳細介紹了如何安裝和配置 Xdebug，並將其與 VSCode 整合以實現高效的除錯流程，無論是初學者還是有經驗的開發者，都能因此提升開發效率。
---

## 安裝 Xdebug

### Linux

Linux 作業系統中，可以使用各自發行版中的套件管理工具進行安裝，如 `apt`、`yum` 等，以 Ubuntu 為例

```Bash
sudo apt-get install php-xdebug
```

不同的發行版，使用不同的套件管理工具，Xdebug 的套件名稱也會有些許不同，詳細可查看[官方文件](https://xdebug.org/docs/install#linux)

### MacOS

MacOS 系統中，可以使用 PECL 安裝 Xdebug

> 此方法要求 PHP 透過 Homebrew 安裝

```
pecl install xdebug
```

如果遇到安裝問題可以參考[官方文件 macos-issues](https://xdebug.org/docs/install#macos-issues)

### Windows

Windows 用戶建議可以使用，Xdebug 提供的 [Installation Wizard](https://xdebug.org/wizard) 進行安裝，步驟如下

1. 在 Powershell 中輸入 `php -ini | clip`，這行指令會複製你當前 PHP 的相關資訊

```Bash
php -ini | clip
```

2. 開啟 [Installation Wizard](https://xdebug.org/wizard)，在文字區域中貼上 PHP 資訊 (此時可直接按 `Ctrl + v`)

![wizard_textarea](/images/posts/xdebug-in-vscode/wizard_textarea.png)

3. 滾到最下面按 `Analyse my phpinfo() output` 按鈕，它就會幫我們分析當前 PHP 適合的 Xdebug 版本

![wizard_analyse_btn](/images/posts/xdebug-in-vscode/wizard_analyse_btn.png)

4. 頁面跳轉後，找到 Instructions 按照步驟進行配置，先點第一點的連接安裝 Xdebug

![wizard_download_link](/images/posts/xdebug-in-vscode/wizard_download_link.png)

5. 將下載的檔案重新命名為 `php_xdebug.dll`，並放入 PHP 安裝目錄下的 `ext` 資料夾中

> 如果不知道 PHP 安裝目錄，可以參考第三點的路徑，去掉 `php.ini` 就是 PHP 的安裝目錄了，在此目錄中，就可以找到 `ext` 資料夾
> (以圖為範例就是 `D:\php\8.3.10\ext`)

![wizard_php_dir](/images/posts/xdebug-in-vscode/wizard_php_dir.png)

6. 再來開啟 `php.ini` (直接使用第三點提供的路徑)，滾到文件中最下面加入以下內容

```
[Xdebug]
zend_extension = xdebug
```

如此一來，便完成了 Xdebug 的安裝，在終端機輸入

```Bash
php -v
```

檢查是否成功使用 Xdebug，如果成功就會顯示

![xdebug_installed](/images/posts/xdebug-in-vscode/xdebug_installed.png)

## 在 VSCode 中使用

- 先安裝 VSCode 中的套件 [PHP Debug](https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug)

### 當前腳本的除錯

在 VSCode 中開啟 PHP 腳本後，就可以直接對此腳本進行除錯，選擇 `Debug current Script in Console`

![debug_current_file](/images/posts/xdebug-in-vscode/debug_current_file.png)

### 監聽任意腳本除錯

如果想讓 Xdebug 監聽任意的 PHP 腳本，需要進行額外配置

再次開啟 `php.ini`，並修改 Xdebug 配置為

```
[Xdebug]
zend_extension = xdebug
xdebug.mode=debug
xdebug.idekey=VSCODE
xdebug.start_with_request=yes
xdebug.client_host="127.0.0.1"
xdebug.client_port=9003
```

存檔後，選擇 `Listen For Xdebug` 進入 debug 監聽

![debug_from_request](/images/posts/xdebug-in-vscode/debug_from_request.png)

在監聽期間，只要執行 PHP 腳本，就會開始 debug

舉例來說，在終端機中輸入

```Bash
php index.php
```

來執行 `index.php`，此時就會直接進入該檔案中的斷點

> 沒有 debug 監聽下，執行 php 腳本會出現警告
> ![xdebug_timeout_warning](/images/posts/xdebug-in-vscode/xdebug_timeout_warning.png)

> 平時沒有使用 debug 監聽時，可以註解掉 `php.ini` 中的 `xdebug.mode` (最前面加入 `;`)
> ```
> ;xdebug.mode=debug
> ```
