---
title: "Предоставление прав в Enterprise"
id: "enterprise-permissions"
description: "Наборы прав для Enterprise-планов."
hide_table_of_contents: true # Для удобства таблиц на этой странице
pagination_next: null
---

import Permissions from '/snippets/_enterprise-permissions-table.md';
import SetUpPages from '/snippets/_available-enterprise-only.md';

<SetUpPages features={'/snippets/_available-enterprise-only.md'}/>

План dbt Cloud Enterprise поддерживает ряд предустановленных наборов прав, которые помогают управлять контролем доступа в учетной записи dbt Cloud. Дополнительную информацию о контроле доступа на основе ролей (RBAC) можно найти в документации по [контролю доступа](/docs/cloud/manage-access/about-user-access).

## Роли и права

Следующие роли и наборы прав доступны для назначения в учетных записях dbt Cloud Enterprise. Они могут быть предоставлены группам dbt Cloud, которые затем назначаются пользователям. Группа dbt Cloud может быть связана с более чем одной ролью и набором прав. Роли с большим доступом имеют приоритет.

:::tip Лицензии или наборы прав

Тип [лицензии](/docs/cloud/manage-access/about-user-access) пользователя всегда переопределяет назначенный ему набор прав. Это означает, что даже если пользователь принадлежит к группе dbt Cloud с правами 'Администратор учетной записи', наличие лицензии 'Только для чтения' все равно помешает ему выполнять административные действия в учетной записи.
:::

<Permissions feature={'/snippets/_enterprise-permissions-table.md'} />

## Дополнительные ресурсы

- [Предоставление доступа пользователям](/docs/cloud/manage-access/about-user-access#grant-access)
- [Контроль доступа на основе ролей](/docs/cloud/manage-access/about-user-access#role-based-access-control-)
- [Права на уровне окружения](/docs/cloud/manage-access/environment-permissions)