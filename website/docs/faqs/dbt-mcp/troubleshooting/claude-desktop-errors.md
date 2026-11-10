---
title: "Ошибки Claude Desktop"
sidebar_label: "Ошибки Claude Desktop"
description: "Устранение неполадок: ошибки Claude Desktop"
id: mcp-troubleshoot-claude-desktop-errors
---

Claude Desktop может возвращать такие ошибки, как `Error: spawn uvx ENOENT`, `Error: spawn npx ENOENT`, `Could not connect to MCP server dbt-mcp` или `Server disconnected`. Для установок на собственной инфраструктуре замените значение `command` полным путём к `uvx`: выполните `which uvx` в Unix-системах или `where uvx` в Windows и вставьте полный путь в JSON (например, `"command": "/the/full/path/to/uvx"`). Для удалённых подключений через `mcp-remote` с аутентификацией по токену аналогичным образом укажите полный путь к `npx`.

Если Claude сообщает, что записи в `claude_desktop_config.json` недопустимы и были пропущены, убедитесь, что в этом файле не используется `"type": "http"`. Вместо этого используйте [конфигурацию `mcp-remote` с аутентификацией по токену](/docs/dbt-ai/integrate-mcp-claude#desktop-remote).

Для удалённых подключений ещё раз проверьте, что URL-адрес MCP заканчивается на `/api/ai/v1/mcp/` (включая завершающий слеш), а значение заголовка `Authorization` — `Token YOUR_DBT_ACCESS_TOKEN` или `Bearer YOUR_DBT_ACCESS_TOKEN`.

Логи находятся в `~/Library/Logs/Claude` (macOS) или `%APPDATA%\Claude\logs` (Windows).
