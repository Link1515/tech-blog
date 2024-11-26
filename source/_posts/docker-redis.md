---
title: 使用 Docker 運行 Redis
date: 2024-02-08 10:21:06
categories: Backend
tags:
    - Docker
    - Redis
cover: /images/cover/docker_redis.jpg
description: 現代軟體開發中，Docker 成為開發者的好夥伴，它可以讓應用程式在各種環境中輕鬆運行。我們將學習如何用簡單的 Docker 指令，下載、啟動並設定 Redis 容器。
---

## Step 1 | 配置 redis.conf

先到 Redis 官網中的 [Redis configuration](https://redis.io/docs/latest/operate/oss_and_stack/management/config/) 下載對應版本的 Redis 配置文件，範例中我們將採用 Redis 6.2 來進行配置

將下載的檔案放到一個資料夾並將檔名取為 `redis.conf`，這裡我們用 `~/.redis/redis.conf`。即在使用者目錄下創建 `.redis ` 資料夾，並將 `redis.conf` 配置檔案放進去

對 `redis.conf` 添加幾項設定

```
vim ~/.redis/redis.conf
```

> 請注意，這些設定只適合用於本地自行開發時使用，到正式環境時，務必要進行修改，以確保資訊安全

### 允許所有 ip 連上 Redis

```
bind 0.0.0.0
```

### 設定預設用戶權限與密碼

```
user default +@all ~* on >myPassword
```

<table>
    <thead>
        <tr>
            <th>選項</th>
            <th>說明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>default</td>
            <td>預設用戶名</td>
        </tr>
        <tr>
            <td>+@all</td>
            <td>允許所有操作</td>
        </tr>
        <tr>
            <td>~*</td>
            <td>允許訪問所有鍵</td>
        </tr>
        <tr>
            <td>on</td>
            <td>啟用用戶</td>
        </tr>
        <tr>
            <td>>myPassword</td>
            <td>設定密碼為 myPassword</td>
        </tr>
    </tbody>
</table>

## Step 2 | 創建容器

運行以下的 docker 指令

```
docker run -d --name redis-playground \
  -v /.redis/redis.conf:/etc/redis/redis.conf \
  -v /.redis/data:/data \
  -p 6379:6379 \
  redis:6.2.13 \
  redis-server /etc/redis/redis.conf
```

<table>
    <thead>
        <tr>
            <th>選項</th>
            <th>說明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>docker run -d</td>
            <td>啟動一個 docker 容器並在背景中運行</td>
        </tr>
        <tr>
            <td>--name redis-playground</td>
            <td>將容器命名為 redis-playground</td>
        </tr>
        <tr>
            <td>-v /.redis/redis.conf:/etc/redis/redis.conf</td>
            <td>將本地的 redis.conf 映射到容器中的 redis.conf</td>
        </tr>
        <tr>
            <td>-v /.redis/data:/data</td>
            <td>將容器中存的資料映射到外部資料夾</td>
        </tr>
        <tr>
            <td>-p 6379:6379</td>
            <td>將外部 port 6379 映射到容器內部 port 6379</td>
        </tr>
        <tr>
            <td>redis:6.2.13</td>
            <td>使用 redis image 版本(標籤)為 6.2.13</td>
        </tr>
        <tr>
            <td>redis-server /etc/redis/redis.conf</td>
            <td>使 redis 使用特定的 redis.conf，即使用我們映射的 redis.conf</td>
        </tr>
    </tbody>
</table>

隨後我們就可以用 `docker ps` 指令看到我們成功啟動了一個 Redis 容器

現在只要用 Redis 的客戶端連上 `127.0.0.1:6379`，並使用前面所設定的密碼 (此範例為 myPassword)，就可以開始使用