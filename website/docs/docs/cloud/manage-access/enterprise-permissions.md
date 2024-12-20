---
title: "Разрешения для корпоративных клиентов"
id: "enterprise-permissions"
description: "Наборы разрешений для корпоративных планов."
hide_table_of_contents: true #Для таблиц на этой странице
pagination_next: null
---

import Permissions from '/snippets/_enterprise-permissions-table.md';
import SetUpPages from '/snippets/_available-enterprise-only.md';

<SetUpPages features={'/snippets/_available-enterprise-only.md'}/>

План dbt Cloud Enterprise поддерживает ряд предустановленных наборов разрешений для управления контролем доступа в учетной записи dbt Cloud. См. документацию по [контролю доступа](/docs/cloud/manage-access/about-user-access) для получения дополнительной информации о ролевом контроле доступа (RBAC).

## Роли и разрешения

Следующие роли и наборы разрешений доступны для назначения в учетных записях dbt Cloud Enterprise. Они могут быть предоставлены группам dbt Cloud, которые затем предоставляются пользователям. Группа dbt Cloud может быть связана с более чем одной ролью и набором разрешений. Роли с большим доступом имеют приоритет. 

:::tip Лицензии или наборы разрешений

Тип [лицензии](/docs/cloud/manage-access/about-user-access) пользователя всегда имеет приоритет над назначенным набором разрешений. Это означает, что даже если пользователь принадлежит к группе dbt Cloud с разрешениями "Администратор учетной записи", наличие лицензии "Только для чтения" все равно не позволит ему выполнять административные действия в учетной записи.
:::

<Permissions feature={'/snippets/_enterprise-permissions-table.md'} />

## Дополнительные ресурсы

- [Предоставление доступа пользователям](/docs/cloud/manage-access/about-user-access#grant-access)
- [Ролевой контроль доступа](/docs/cloud/manage-access/about-user-access#role-based-access-control-)
- [Разрешения на уровне окружения](/docs/cloud/manage-access/environment-permissions)