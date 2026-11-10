---
title: "О подключениях к платформам данных"
id: about-connections
description: "Информация о подключениях к платформе данных"
sidebar_label: "Подключения к платформам данных"
pagination_next: "docs/platform/connect-data-platform/connect-apache-spark"
pagination_prev: null
availability: platform_login
---

<Constant name="dbt_platform" /> может подключаться к платформам данных различных поставщиков. 

<VersionBlock firstVersion="2.0">

Для большинства поддерживаемых платформ данных мы рекомендуем версию v2, которая поддерживает следующие платформы данных:

<SimpleTable>

| Подключение | Доступно в v2  |
|------------|:---------------------:|
| [Snowflake](/docs/platform/connect-data-platform/connect-snowflake) | ✅ |
| [Amazon Redshift](/docs/platform/connect-data-platform/connect-redshift) | ✅ |
| [Databricks](/docs/platform/connect-data-platform/connect-databricks) | ✅ |
| [Google BigQuery](/docs/platform/connect-data-platform/connect-bigquery) | ✅ |
| [ClickHouse](/docs/platform/connect-data-platform/connect-clickhouse) | Закрытая бета-версия |
</SimpleTable>

<small> _Жизненный цикл адаптера может различаться для <Constant name="dbt_platform" /> и локальной разработки &mdash; адаптер может стать общедоступным (GA) на платформе dbt раньше, чем для локального использования._ </small> <br /><br />

Если вашей платформы данных пока нет в списке, со временем будет добавлена поддержка других платформ данных. Пока вы можете продолжать использовать v1 для этого проекта.

</VersionBlock>

<VersionBlock lastVersion="1.99">

Для проектов, которые всё ещё используют v1, dbt поддерживает следующие платформы данных:


| Подключение | Доступно в v1 |
|------------|:---------------------:|
| [AlloyDB](/docs/platform/connect-data-platform/connect-postgresql-alloydb) | ✅ |
| [Amazon Athena](/docs/platform/connect-data-platform/connect-amazon-athena) | ✅ |
| [Amazon Redshift](/docs/platform/connect-data-platform/connect-redshift) | ✅ |
| [Apache Spark](/docs/platform/connect-data-platform/connect-apache-spark) | ✅ |
| [Azure Synapse Analytics](/docs/platform/connect-data-platform/connect-azure-synapse-analytics) | ✅ |
| [Databricks](/docs/platform/connect-data-platform/connect-databricks) | ✅ |
| [Google BigQuery](/docs/platform/connect-data-platform/connect-bigquery) | ✅ |
| [Microsoft Fabric](/docs/platform/connect-data-platform/connect-microsoft-fabric) | ✅ |
| [PostgreSQL](/docs/platform/connect-data-platform/connect-postgresql-alloydb) | ✅ |
| [Snowflake](/docs/platform/connect-data-platform/connect-snowflake) | ✅ |
| [Starburst или Trino](/docs/platform/connect-data-platform/connect-starburst-trino) | ✅ |
| [Teradata](/docs/platform/connect-data-platform/connect-teradata) | ✅ |

</VersionBlock>


## Подключите свою платформу данных в dbt {#connect-your-data-platform-in-dbt}

Чтобы подключиться к вашей базе данных в <Constant name="dbt" />:

1. Нажмите на имя вашей учетной записи внизу левого меню и выберите **Account settings**.
2. Выберите **Connections** в верхней левой части экрана, затем нажмите **New connection**.

<Lightbox src="/img/docs/connect-data-platform/choose-a-connection.png" title="Выберите подключение"/>

Эти инструкции по подключению описывают базовые поля, необходимые для настройки соединения с платформой данных в <Constant name="dbt" />. Более подробные руководства, включающие демонстрационные данные проекта, см. в наших [Quickstart guides](/guides).

### Поддерживаемые методы аутентификации {#supported-authentication-methods}

В следующих таблицах показано, какие типы аутентификации поддерживаются для каждого подключения, доступного в <Constant name="dbt_platform" />:

<VersionBlock firstVersion="2.0">

import AuthTypesFusion from '/snippets/_dbt_connection_support_v2.md';

<AuthTypesFusion />

</VersionBlock>

<VersionBlock lastVersion="1.99">

import AuthTypes from '/snippets/_dbt_connection_support.md';

<AuthTypes />

</VersionBlock>

## Управление подключениями {#connection-management}

Подключения к хранилищам данных — это ресурс уровня аккаунта. Вы можете найти их в разделе **Account settings** > **Connections**.

Подключения к хранилищу данных можно повторно использовать в разных проектах. Если несколько проектов подключаются к одному и тому же хранилищу данных, следует повторно использовать одно и то же подключение, чтобы упростить управление. Подключения назначаются проекту через [окружение](/docs/dbt-platform-environments). 

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connections-new-model.png" width="60%" title="Модель подключений"/>

Как показано на изображении, проект с 2 средами может использовать от 1 до 2 различных подключений. Если вы хотите отделить вашу производственную среду от непроизводственной, назначьте несколько подключений одному проекту.

### Миграция с подключений уровня проекта на подключения уровня аккаунта {#migration-from-project-level-connections-to-account-level-connections}

Внедрение подключений уровня аккаунта не потребует никаких перерывов в работе ваших текущих сценариев использования (<Constant name="studio_ide" />, CLI, jobs и так далее).

:::info Почему меня просят настроить среду разработки?
Если в вашем проекте ранее не было среды разработки, вы можете быть перенаправлены на страницу настройки проекта. Ваш проект все еще в целости. Выберите подключение для вашей новой среды разработки, и вы сможете снова просмотреть все ваши среды.
:::

Однако, чтобы полностью использовать преимущества подключений на уровне учетной записи, вам, возможно, придется пересмотреть, как вы назначаете и используете подключения в проектах и средах.

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connections-post-rollout.png" width="60%" title="Типичная конфигурация подключений после внедрения"/>

Пожалуйста, рассмотрите следующие действия, так как шаги, которые вы предпримете, будут зависеть от желаемого результата.

- Первоначальная очистка списка подключений
  - Удалите неиспользуемые подключения с 0 средами.
  - Переименуйте подключения с временной, описательной схемой именования, чтобы лучше понять, где каждое используется

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connections-post-rollout-2.png" width="60%" title="После первоначальной очистки"/>

- Детализация подключений
  - Определите намерение для каждого подключения, обычно это комбинация экземпляра хранилища/базы данных, предполагаемого использования (разработка, производство и т.д.) и административной поверхности (какие команды/проекты будут нуждаться в совместной работе над подключением)
  - Стремитесь минимизировать необходимость локальных переопределений (например, расширенных атрибутов)
  - Придите к консенсусу по поводу соглашения об именах. Мы рекомендуем называть подключения по имени хоста сервера и отличительным намерением/доменом/конфигурацией. Так будет легче повторно использовать подключения в разных проектах

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connections-post-rollout-3.png" width="60%" title="Детализация определена"/>

- Дедупликация (список подключений + детали среды &mdash; пока не касаясь расширенных атрибутов)
  - На основе детализации ваших подключений определите, какие подключения должны остаться среди групп дубликатов, и обновите каждую соответствующую среду, чтобы использовать это подключение
  - Удаляйте неиспользуемые подключения с 0 средами по мере продвижения
  - Дедуплицируйте вдумчиво. Если вы хотите, чтобы подключения поддерживались двумя разными группами пользователей, вы можете сохранить два идентичных подключения к одному и тому же хранилищу, чтобы каждое могло развиваться так, как считает нужным, без влияния на другую группу
  - Не обновляйте расширенные атрибуты на этом этапе

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connections-post-rollout-4.png" width="60%"title="Дубликаты подключений удалены"/>

- Нормализация
  - Разберитесь, как следует создавать новые подключения, чтобы избежать локальных переопределений. Если в настоящее время вы используете extended attributes для переопределения экземпляра хранилища данных в production‑окружении, вместо этого следует создать новое подключение для этого экземпляра и привязать к нему production‑окружение, устранив необходимость в локальных переопределениях.
  - Создайте новые подключения, обновите соответствующие окружения для использования этих подключений, удалив ставшие ненужными локальные переопределения (возможно, не все!)
  - Протестируйте новую связку, запустив jobs или начав сессии в <Constant name="studio_ide" />

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/connections-post-rollout-5.png" width="60%" title="Подключения нормализованы"/>

## Ограничения по IP {#ip-restrictions}

<Constant name="dbt" /> всегда будет подключаться к вашей платформе данных с IP-адресов, указанных на странице [Регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses).

Убедитесь, что вы разрешили трафик с этих IP-адресов в вашем файрволе и включили их в любые предоставления базы данных.

Разрешение этих IP-адресов обеспечивает только подключение к вашему <Term id="data-warehouse" />. Однако вам может потребоваться отправлять API-запросы из вашей сети с ограниченным доступом к API <Constant name="dbt" />. Для использования API <Constant name="dbt" /> необходимо разрешить доступ к поддомену `cloud.getdbt.com`. Подробнее об архитектуре <Constant name="dbt" /> см. в разделе [Архитектура развёртывания](/docs/platform/about-platform/architecture).
