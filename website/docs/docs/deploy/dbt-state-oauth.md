---
title: "Учетные данные клиента OAuth для dbt State"
description: "Узнайте, как настроить аутентификацию dbt State с помощью учетных данных клиента OAuth для отдельного приложения dbt State."
id: "dbt-state-oauth"
tags: ['dbt State']
availability: everywhere_usage
pagination_next: null
pagination_prev: null
unlisted: true
---

import DbtStateAppRetirement from '/snippets/_dbt-state-app-retirement.md';

# Учетные данные клиента OAuth для dbt State <Lifecycle status="Deprecated" />

<DbtStateAppRetirement />

Если вы используете отдельное [веб-приложение dbt State](https://app.state.dbt.com/), выполняйте аутентификацию в dbt State с помощью учетных данных клиента OAuth.

## Предварительные требования

- Установленный и настроенный dbt State. Подробнее см. в разделе [Настройка dbt State](/docs/deploy/dbt-state-setup).
- Учетная запись в отдельном приложении dbt State на [app.state.dbt.com](https://app.state.dbt.com/).
- Роль **Admin** или **Owner** в вашей организации dbt State. Подробнее см. в разделе [Роли и доступ к вкладкам](#roles-and-tab-access).

## Роли и доступ к вкладкам {#roles-and-tab-access}

В веб-приложении dbt State в разделе **Organization** есть четыре вкладки:

<SimpleTable>
| Вкладка | Описание |
|-----|-------------|
| **Usage** | Просмотр данных о повторном использовании результатов в проекте и сэкономленном времени вычислений после включения dbt State. |
| **Users** | Приглашение участников команды, предоставление и отзыв доступа. |
| **Billing** | Просмотр целевых таблиц, активных в течение дня (DATT), за текущий расчетный период. |
| **Clients** | Создание клиентов OAuth и управление ими для CI/CD и других неинтерактивных сред. |
</SimpleTable>
<br />
Ваша роль определяет, к каким вкладкам у вас есть доступ.

<SimpleTable>
| Роль | Доступ | Примечания |
|------|-----------|-------|
| **Owner** | Usage, Users, Billing, Clients | Пользователь, создавший организацию, по умолчанию получает роль Owner. Пользователь с ролью Owner может передать свою роль другому пользователю; при этом роль исходного владельца изменяется на Admin. |
| **Admin** | Usage, Users, Billing, Clients | — |
| **Developer** | Usage | Роль по умолчанию при добавлении пользователей. |
</SimpleTable>

Пользователь с ролью **Owner** или **Admin** может предоставлять или отзывать права администратора на вкладке **Users**.

## Создание клиента OAuth

1. В [веб-приложении dbt State](https://app.state.dbt.com/) перейдите на вкладку **Clients**.
2. Нажмите **Add OAuth Client**.
3. Введите имя и описание нового клиента и нажмите **Create**.
4. Скопируйте идентификатор и секрет клиента для использования в конфигурации вашей среды.

## Настройка аутентификации OAuth

Получив идентификатор и секрет клиента, задайте в своей среде следующие переменные окружения. Рекомендуется использовать переменные окружения, поскольку это позволяет не хранить конфиденциальные учетные данные в репозитории кода.

```bash
DBT_ENGINE_STATE_OAUTH_CLIENT_ID=YOUR_CLIENT_ID
DBT_ENV_SECRET_STATE_OAUTH_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

Замените `YOUR_CLIENT_ID` и `YOUR_CLIENT_SECRET` значениями вашего клиента OAuth.

После настройки [проверьте, что dbt State активен](/docs/deploy/dbt-state-cicd#verifying-dbt-state-is-active).

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
- [Настройка аутентификации для неинтерактивных сред](/docs/deploy/dbt-state-cicd)
