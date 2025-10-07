---
title: System.Text.Json 轉換 JSON
date: 2025-10-07 09:23:00
categories: Backend
tags:
  - C#
  - .NET
cover: /images/cover/dotnet.webp
description: System.Text.Json 是 .NET 6 之後推薦使用的 JSON 轉換工具。本文介紹如何用 JsonSerializer.Deserialize() 與 JsonSerializer.Serialize() 在 C# 中進行 JSON 與物件的互轉，並示範在 .NET 7 以上使用 JsonPolymorphic 和 JsonDerivedType 處理多型資料。此外，也說明如何建立自訂 JsonConverter，自行控制 JSON 的讀寫行為。
---

## 簡單轉換

在 JSON 有可以直接對應的 C# class 情況下，可以直接用 `JsonSerializer.Deserialize()` 與 `JsonSerializer.Serialize()` 互相轉換

如果我們有以下 JSON 字串:

```JSON
{
    "id": 1,
    "name": "myFile",
    "size": 123456,
    "favorite": false,
    "extension": ".jpg",
    "owner": {
        "id": 666,
        "name": "Terry"
    }
}
```

### class 宣告

要將此 JSON 轉為 C# class，我們就先定義出對應的 class

> 可以透過 [JSON2CSharp](https://json2csharp.com/) 線上工具快速將 JSON 轉換為 C# class

```csharp
public class File
{
    public int id { get; set; }
    public required string name { get; set; }
    public int size { get; set; }
    public bool favorite { get; set; }
    public required string extension { get; set; }
    public required Owner owner { get; set; }
}

public class Owner
{
    public int id { get; set; }
    public required string name { get; set; }
}
```

### 使用

再來就可以直接調用 `JsonSerializer.Deserialize()` 帶入要轉換的類型與 JSON 字串

```csharp
using System.Text.Json;

// 此處直接將範例 JSON 寫成字串，實際情況可能是來自 HTTP 請求，或讀取 JSON 文件
var json = @"
    {
        ""id"": 1,
        ""name"": ""myFile"",
        ""size"": 123456,
        ""favorite"": false,
        ""extension"": "".jpg"",
        ""owner"": {
            ""id"": 666,
            ""name"": ""Terry""
        }
    }
";
var jsonClass = JsonSerializer.Deserialize<File>(json);
```

![deserialize_1](/images/posts/csharp-json-serialization/deserialize_1.png)

如果要再將 class 轉為 JSON 字串，就調用 `JsonSerializer.Serialize()`

```csharp
var jsonStr = JsonSerializer.Serialize<File>(jsonClass);
```

## 使用註釋 (Attributes) 轉換多型

> 需要 .NET 7 以上才支援

JSON 資料有多型，在不同類型有特定屬性情況下，如以下範例

```JSON
{
    "type": "image",
    "target": 9574,
    "url": "https://example.com/sheep.jpg"
},
{
    "type": "text",
    "target": 9574,
    "text": "hello world"
}
```

Message 有 `image` 與 `text` 兩種 type，`image` 有 `url` 屬性，`text` 有 `text` 屬性，這種情境適合使用註釋轉換

### class 宣告

先定義好對應的 class，並加入 `JsonPolymorphic` 和 `JsonDerivedType` 註釋
`JsonPolymorphic` 標示用哪個 JSON 屬性進行多型轉換
`JsonDerivedType` 標示對應的多型 class

```csharp
// 以 type 屬性進行轉換
[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
// 當 type = image 時，轉成 ImageMessage
[JsonDerivedType(typeof(ImageMessage), "image")]
// 當 type = text 時，轉成 TextMessage
[JsonDerivedType(typeof(TextMessage), "text")]
public class Message
{
    public int target { get; set; }
}

public class TextMessage : Message
{
    public string type => "text";
    public required string text { get; set; }
}

public class ImageMessage : Message
{
    public string type => "image";
    public required string url { get; set; }
}
```

### 使用

```csharp
var json = @"
    [
        {
            ""type"": ""image"",
            ""target"": 9574,
            ""url"": ""https://example.com/sheep.jpg""
        },
        {
            ""type"": ""text"",
            ""target"": 9574,
            ""text"": ""hello world""
        }
    ]
";
var jsonClass = JsonSerializer.Deserialize<List<Message>>(json);
var jsonStr = JsonSerializer.Serialize(jsonClass);
```

## 自定義轉換器 (Converter)

用於需要完全自定義讀寫過程，範例一樣使用

```JSON
{
    "type": "image",
    "target": 9574,
    "url": "https://example.com/sheep.jpg"
},
{
    "type": "text",
    "target": 9574,
    "text": "hello world"
}
```

### class 宣告

```csharp
public class Message
{
    public int target { get; set; }
}

public class TextMessage : Message
{
    public string type => "text";
    public required string text { get; set; }
}

public class ImageMessage : Message
{
    public string type => "image";
    public required string url { get; set; }
}
```

再來宣告一個繼承 `JsonConverter` 的 Converter class，需要實踐 `Read()` 與 `Write()` 方法
`Read()` 方法用於 JSON 字串轉 C# class
`Write()` 方法用於 C# class 轉 JSON 字串

```csharp
class MessageConverter : JsonConverter<Message>
{
    public override Message? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var doc = JsonDocument.ParseValue(ref reader);
        var root = doc.RootElement;

        if (!root.TryGetProperty("type", out var typeProp))
        {
            throw new JsonException("Missing 'type' property");
        }

        var type = typeProp.GetString();

        return type switch
        {
            "image" => root.Deserialize<ImageMessage>(options),
            "text" => root.Deserialize<TextMessage>(options),
            _ => throw new JsonException($"Unknown type: {type}")
        };
    }

    public override void Write(Utf8JsonWriter writer, Message value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();

        switch (value)
        {
            case TextMessage textMessage:
                writer.WriteString("type", "text");
                writer.WriteNumber("target", textMessage.target);
                writer.WriteString("text", textMessage.text);
                break;

            case ImageMessage imageMessage:
                writer.WriteString("type", "text");
                writer.WriteNumber("target", imageMessage.target);
                writer.WriteString("url", imageMessage.url);
                break;

            default:
                throw new JsonException($"Unknown message type: {value.GetType().Name}");
        }

        writer.WriteEndObject();
    }
}
```

> 如果 `Write()` 沒有要自定義，想要保持原本的行為，可以寫:
>
> ```csharp
> public override void Write(Utf8JsonWriter writer, Message value, JsonSerializerOptions options)
> {
>     JsonSerializer.Serialize(writer, value, value.GetType(), options);
> }
> ```

### 使用

使用時，設定 `JsonSerializerOptions` 並傳入 `JsonSerializer.Deserialize()` 或 `JsonSerializer.Serialize()` 方法中

```csharp
var json = @"
    [
        {
            ""type"": ""image"",
            ""target"": 9574,
            ""url"": ""https://example.com/sheep.jpg""
        },
        {
            ""type"": ""text"",
            ""target"": 9574,
            ""text"": ""hello world""
        }
    ]
";

var options = new JsonSerializerOptions
{
    Converters = { new MessageConverter() }
};
var jsonClass = JsonSerializer.Deserialize<List<Message>>(json, options);
var jsonStr = JsonSerializer.Serialize(jsonClass, options);
```

## 常見問題: 欄位 Field 沒有被轉換

`System.Text.Json` 預設只會轉換屬性 (property)，不會轉換欄位 (field)

```csharp
public class User
{
    public int id { get; set; }

    // 屬性 (property) 會被轉換
    public required string name { get; set; }
    // 欄位 (field) 不會被轉換
    public required string name2;
}
```

如果要轉換欄位有兩種方法

1. options 中設定 `IncludeFields = true`

```csharp
var options = new JsonSerializerOptions
{
    IncludeFields = true
};
var jsonClass = JsonSerializer.Deserialize<User>(json, options);
var jsonStr = JsonSerializer.Serialize(jsonClass, options);
```

2. 欄位加上 `JsonInclude` 註釋

```csharp
public class User
{
    [JsonInclude]
    public required string name;
}
```
