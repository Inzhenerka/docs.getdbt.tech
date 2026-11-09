---
title: "Я получаю ошибку 403 'Запрещено: Доступ запрещен' при использовании сервисных токенов"
description: "Весь трафик сервисных токенов теперь подлежит ограничениям по IP. Чтобы устранить ошибки 403, добавьте CIDR (сетевые адреса) вашей сторонней интеграции в список разрешенных."
sidebar_label: 'Ошибка 403 сервисного токена: Запрещено: Доступ запрещен'
---

Весь трафик [сервисных токенов](/docs/dbt-apis/service-tokens) подлежит ограничениям по IP.

На весь трафик с использованием [сервисных токенов](/docs/dbt-apis/service-tokens) распространяются ограничения по IP-адресам.

Ниже приведен пример ошибки 403:

```json
        {
            "status": {
                "code": 403,
                "is_success": False,
                "user_message": ("Forbidden: Access denied"),
                "developer_message": None,
            },
            "data": {
                "account_id": <account_id>,
                "user_id": <user_id>,
                "is_service_token": <boolean describing if it's a service token request>,
                "account_access_denied": True,
            },
        }
```