---
title: "Ошибки прав доступа при создании интеграции или MCP-сервера"
sidebar_label: "Ошибки прав доступа при создании интеграции или MCP-сервера"
description: "Устранение неполадок: ошибки прав доступа при создании интеграции или MCP-сервера"
id: mcp-troubleshoot-snowflake-permission-errors
---

Для выполнения `CREATE API INTEGRATION` и `CREATE EXTERNAL MCP SERVER` требуется роль `ACCOUNTADMIN` (или роль с привилегией `CREATE INTEGRATION` на уровне аккаунта). Выполните шаги 1–2 с ролью `ACCOUNTADMIN`, затем предоставьте привилегию `USAGE` на MCP-сервер и интеграцию роли, от имени которой запускается агент (шаг 3).
