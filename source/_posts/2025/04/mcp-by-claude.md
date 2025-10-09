---
title: 使用 Claude 搭配 MCP 強化你的 AI Agent
date: 2025-04-23 09:33:41
categories: Others
tags:
    - AI
    - MCP
cover: /images/cover/claude_with_mcp.webp
description: 探索如何在 Claude Desktop 中配置 MCP Servers，打造更高效、更聰明的 AI Agent。從環境設定到實際整合步驟，手把手帶你完成整合，協助你全面提升 AI 工作流程。
---

## 安裝 Claude 桌面應用程式

前往 [Claude 官網下載桌面應用程式](https://claude.ai/download)

![claude-official-download](/images/posts/mcp-by-claude/claude-official-download.png)

## 安裝 Node.js

大部分的 MCP Server 都需要使用到 Node.js 或者 Python，此範例會使用到 Node.js，我們可以先[安裝 Node.js](https://nodejs.org/en)，如果讀者想要使用的 MCP Server 是使用 Python 則需要另外[安裝 Python](https://www.python.org/downloads/)

## 選擇你想使用的 MCP Server

目前有許多應用都有對應的 MCP Server，例如: GitHub、Google 雲端、Gmail 等，我們可以到 [MCP Servers](https://github.com/modelcontextprotocol/servers) 找尋自己想要使用的服務，此處我們以最簡單的系統檔案 (File System) 為例

![select-filesystem-mcp](/images/posts/mcp-by-claude/select-filesystem-mcp.png)

可以在他的頁面看到 MCP Server 提供的功能，File System 為對檔案與目錄的增改查

-   Read/write files
-   Create/list/delete directories
-   Move files/directories
-   Search files
-   Get file metadata

滾到下面會看到使用 npx 的 JSON 設定，代表要使用這個 MCP Server，就要安裝 Node.js，並使用 npx 的指令啟動服務。

> 要使用不同 MCP 服務時，也是一樣找出帶有指令的 JSON

我們將這段 JSON 複製下來

```JSON
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/path/to/other/allowed/dir"
      ]
    }
  }
}
```

> npx 是 Node.js 套件管理工具 npm 中的指令，我們在安裝 Node.js 時，會同時安裝 npm

## Claude Desktop 中設定 MCP

開啟 Claude Desktop，點左上角的選單進入設定

![claude-go-setting](/images/posts/mcp-by-claude/claude-go-setting.png)

選擇左方 Developer 頁籤，並點擊 Edit Config 開啟設定文件所在的資料夾

![claude-setting-panel](/images/posts/mcp-by-claude/claude-setting-panel.png)

開啟其中的 `claude_desktop_config.json` 進行編輯

![claude-setting-directory](/images/posts/mcp-by-claude/claude-setting-directory.png)

將剛剛複製的 JSON 貼上，並且將最後的參數改成要操作的資料夾，以我為例，我希望能在 `D:\tmp` 資料夾下進行增改查，就設定為此資料夾

![claude-setting-json](/images/posts/mcp-by-claude/claude-setting-json.png)

接著，**重新啟動** Claude Desktop，從左上角的選單進行關閉，接著再重開 Claude Desktop

![claude-exit](/images/posts/mcp-by-claude/claude-exit.png)

> 不要用右上角的 x 關閉，因為此時 Claude Desktop 仍會持續運行，無法更新 MCP 設定

重開 Claude Desktop 後，去到設定的 Developer 頁籤會看到出現我們設定的 MCP Server 名稱，即 filesystem，就代表設定成功

![claude-setting-success](/images/posts/mcp-by-claude/claude-setting-success.png)

在 Claude 的輸入框下也會看到出現一個工具的圖標，代表已經有 MCP tools 正在使用中

![claude-chat](/images/posts/mcp-by-claude/claude-chat.png)

## 使用 MCP Server

成功設定並啟用 MCP Server 後，就可以直接透過聊天的方式操作對應的服務，我用以下 prompt 為例，進行資料夾與檔案的操作

```
在 D:\tmp 下創建一個資料夾，名稱為 test，並在此資料夾中創建一個 README.md 檔案，內容為:

# 測試 MCP 成功!
```

開始後，Claude 會去檢查有沒有對應的 MCP tools 可以使用，如果有，就會向你請求對應的權限。這裡他會詢問

-   是否可以查看目錄內有什麼
-   是否可以創建資料夾
-   是否可以寫入檔案

都沒問題就可以同意他的請求

![mcp-permission](/images/posts/mcp-by-claude/mcp-permission.png)

完整的內容如下

![mcp-chat](/images/posts/mcp-by-claude/mcp-chat.png)

> 你可以點開使用 MCP tools 的節點，會看到他們傳遞了什麼參數

最後，查看 D:\tmp 目錄下確實產生了，`test` 資料夾，內部也有 `README.md` 檔案，內容也正確的寫入

![result](/images/posts/mcp-by-claude/result.png)
