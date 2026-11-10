---
title: "Подключение к ClickHouse"
id: connect-clickhouse
description: "Настройте подключение к платформе ClickHouse в dbt."
sidebar_label: "Подключение к ClickHouse"
availability:
  surface: platform
  access: login_required
  engine: v2
---

# Подключение к ClickHouse <Lifecycle status="private_beta" /> <ProductCard text="Совместимо с dbt v2" />

<Constant name="fusion_engine" /> в <Constant name="dbt_platform" /> поддерживает подключение к [ClickHouse Cloud](https://clickhouse.com/cloud) и к самостоятельно управляемым одноузловым экземплярам ClickHouse. Для среды, использующей это подключение, выберите канал выпуска <Constant name="fusion" />.

:::caution Закрытое бета-тестирование ClickHouse
Подключения к ClickHouse в v2 находятся на этапе закрытого бета-тестирования и не готовы к использованию в производственных средах. Чтобы запросить доступ, свяжитесь с представителем, который ведёт вашу учётную запись. Возможны небольшие ошибки, поэтому пока не используйте эти подключения в производственных средах. Перед подключением ознакомьтесь с разделом [Ограничения](#limitations).
:::

## Права доступа к хранилищу для <Constant name="fusion" />

import FusionClickHouseWarehousePerms from '/snippets/_v2-warehouse-permissions-clickhouse.md';

<FusionClickHouseWarehousePerms />

Полное описание модели привилегий см. в разделе [Управление доступом в документации ClickHouse](https://clickhouse.com/docs/operations/access-rights).

## Поля подключения

При создании подключения к ClickHouse настройте следующие поля.

<SimpleTable>

| Поле            | Описание                                                                                         | Тип    | Обязательное? | Пример |
| --------------- | ------------------------------------------------------------------------------------------------ | ------ | --------- | ------- |
| Server Hostname | URL конечной точки ClickHouse Cloud. Не указывайте `https://` и порт. Скопируйте адрес из раздела **Connect** в [консоли ClickHouse Cloud](https://clickhouse.com/docs/get-started/quickstarts/obtain-your-cloud-connection-details#find-your-connection-details). | Строка | Да        | `abc123.us-east-1.aws.clickhouse.cloud` |
| Port            | Порт для подключения. Адаптер dbt для ClickHouse подключается по HTTPS. Используйте порт `8443`. Порт `9440` (нативный протокол) не поддерживается адаптером. | Строка | Нет       | `8443` |
| Database        | Имя базы данных для подключения.                                                                 | Строка | Нет       | `default` |

</SimpleTable>

<Lightbox src="/img/docs/dbt-platform/clickhouse-connection.png" title="Пример полей подключения к ClickHouse." />

После сохранения подключения настройте среду разработки:

1. Создайте новый проект или откройте существующий.
2. В настройках проекта выберите **Environments** в меню слева и откройте свою среду разработки.
3. В разделе **Connection** выберите только что созданное подключение к ClickHouse.
4. Сохраните среду.

<Lightbox src="/img/docs/dbt-platform/clickhouse-environment.png" title="Выбор подключения к ClickHouse для среды разработки." />

## Учётные данные для разработки и развёртывания

Каждый разработчик вводит личные учётные данные для разработки в разделе **Your profile** → **Credentials**. Для ClickHouse Cloud скопируйте имя пользователя и пароль из диалогового окна **Connect** в [консоли ClickHouse Cloud](https://clickhouse.com/docs/get-started/quickstarts/obtain-your-cloud-connection-details#find-your-connection-details). Обычно используется имя пользователя `default`.

<SimpleTable>

| Поле         | Описание                                                                                     | Тип    | Обязательное? | Пример              |
| ------------ | -------------------------------------------------------------------------------------------- | ------ | --------- | ------------------- |
| Username     | Имя пользователя базы данных.                                                                | Строка | Да        | `default`           |
| Password     | Пароль базы данных.                                                                          | Строка | Нет       | DatabasePassword123 |
| Schema       | При разработке dbt создаёт ваши модели в схеме с этим именем. Используйте схему, уникальную для вашей личной среды разработки. | Строка | Да        | dbtlabsdocstest     |
| Target name  | Имя целевой конфигурации для этих учётных данных.                                             | Строка | Нет       | `default`           |
| Threads      | Количество потоков для выполнения операций dbt.                                              | Целое число | Нет  | `4`                 |

</SimpleTable>

<Lightbox src="/img/docs/dbt-platform/clickhouse-credentials.png" title="Пример полей учётных данных пользователя ClickHouse." />

## Настройка

О том, как оптимизировать производительность с помощью настроек <Constant name="dbt" />, специфичных для платформы данных, см. в разделе [Настройки ClickHouse](/reference/resource-configs/clickhouse-configs).

Описание полей профиля ClickHouse, которым соответствуют поля подключения, см. в разделе [Настройка ClickHouse](/docs/local/connect-data-platform/clickhouse-setup).

## Ограничения {#limitations}

Подключение к ClickHouse находится на этапе закрытого бета-тестирования. В частности, в <Constant name="dbt_platform" />:

- <Constant name="semantic_layer" /> dbt пока не поддерживается для подключений к ClickHouse.
- Доступна только аутентификация по имени пользователя и паролю. OAuth, аутентификация с помощью пары ключей, SSH-туннелирование и подключение по частной сети пока не поддерживаются для ClickHouse.

Здесь также действуют ограничения адаптера ClickHouse для <Constant name="fusion" />, включая ограничения в поддержке кластеров, предоставления прав доступа, `dbt clone`, `dbt source freshness` и анализа SQL. Полную информацию см. в разделе [Ограничения ClickHouse](/docs/local/connect-data-platform/clickhouse-setup#limitations).
