---
title: "Не удаётся найти исполняемый файл uvx"
sidebar_label: "Не удаётся найти исполняемый файл uvx"
description: "Устранение неполадок: не удаётся найти исполняемый файл uvx"
id: mcp-troubleshoot-uvx
---

**Симптомы:** В вашем MCP-клиенте появляются сообщения об ошибках, такие как `Could not connect to MCP server dbt-mcp`, `Error: spawn uvx ENOENT` или `spawn uvx ENOENT`.

**Причина:** Ваш MCP-клиент (например, настольное приложение Claude) не может найти `uvx` в переменной PATH, поскольку запускается с ограниченным набором переменных окружения.

**Решение:** Укажите полный путь к `uvx` в конфигурации.

1. Найдите полный путь:
   - macOS/Linux: Выполните `which uvx` в терминале.
   - Windows: Выполните `where uvx` в командной строке или PowerShell.

2. Замените `"command": "uvx"` на вариант с полным путём:

```json
{
  "mcpServers": {
    "dbt": {
      "command": "/full/path/to/uvx",
      "args": ["dbt-mcp"],
      "env": { }
    }
  }
}
```

Пример для macOS с Homebrew: `"command": "/opt/homebrew/bin/uvx"`

Для VS Code (`mcp.json`) применяется то же решение — замените `uvx` полным путём к нему в поле `command`.
