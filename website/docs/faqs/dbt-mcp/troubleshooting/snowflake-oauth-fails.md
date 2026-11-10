---
title: "Коннектор не проходит авторизацию или процесс OAuth завершается с ошибкой"
sidebar_label: "Коннектор не проходит авторизацию или процесс OAuth завершается с ошибкой"
description: "Устранение неполадок: коннектор не проходит авторизацию или процесс OAuth завершается с ошибкой"
id: mcp-troubleshoot-snowflake-oauth-fails
---

- Убедитесь, что у вашей учетной записи есть [статический поддомен](/docs/platform/about-platform/access-regions-ip-addresses). Он необходим для OAuth с MCP.
- Убедитесь, что хост в `API_ALLOWED_PREFIXES`, `OAUTH_TOKEN_ENDPOINT`, `OAUTH_AUTHORIZATION_ENDPOINT` и `OAUTH_RESOURCE_URL` в точности совпадает с хостом вашего URL MCP, а для интеграции задано `ENABLED = TRUE`.
- Функции ИИ включены по умолчанию, и администраторы могут [отключить или снова включить их в любое время](/docs/platform/manage-dbt-ai).
- Убедитесь, что OAuth для удаленного MCP доступен в тарифном плане вашей учетной записи.
