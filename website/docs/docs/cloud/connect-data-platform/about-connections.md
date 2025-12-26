---
title: "О подключениях к платформам данных"
id: about-connections
description: "Information about data platform connections"
sidebar_label: "About data platform connections"
pagination_next: "docs/cloud/connect-data-platform/connect-apache-spark"
pagination_prev: null
---
<Constant name="dbt_platform" /> может подключаться к различным провайдерам платформ данных. Разверните разделы ниже, чтобы узнать, какие платформы данных поддерживаются в <Constant name="core" /> и <Constant name="fusion_engine" />:

| Connection | Available on Latest   | Available on Fusion<Lifecycle status='private_preview' />|
|------------|:---------------------:|:---------------------:|
| [AlloyDB](/docs/cloud/connect-data-platform/connect-postgresql-alloydb) | ✅ | ❌ |
| [Amazon Athena](/docs/cloud/connect-data-platform/connect-amazon-athena) | ✅ | ❌ |
| [Amazon Redshift](/docs/cloud/connect-data-platform/connect-redshift) | ✅ | ✅ |
| [Apache Spark](/docs/cloud/connect-data-platform/connect-apache-spark) | ✅ | ❌ |
| [Azure Synapse Analytics](/docs/cloud/connect-data-platform/connect-azure-synapse-analytics) | ✅ | ❌ |
| [Databricks](/docs/cloud/connect-data-platform/connect-databricks) | ✅ | ✅ |
| [Google BigQuery](/docs/cloud/connect-data-platform/connect-bigquery) | ✅ | ✅ |
| [Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric) | ✅ | ❌ |
| [PostgreSQL](/docs/cloud/connect-data-platform/connect-postgresql-alloydb) | ✅ | ❌ |
| [Snowflake](/docs/cloud/connect-data-platform/connect-snowflake) | ✅ | ✅ |
| [Starburst or Trino](/docs/cloud/connect-data-platform/connect-starburst-trino) | ✅ | ❌ |
| [Teradata](/docs/cloud/connect-data-platform/connect-teradata) <Lifecycle status="preview" /> | ✅ | ❌ |

Чтобы подключиться к вашей базе данных в <Constant name="cloud" />:

1. Нажмите на имя вашей учетной записи внизу левого меню и выберите **Account settings**.
2. Выберите **Connections** в верхней левой части экрана, затем нажмите **New connection**.

<Lightbox src="/img/docs/connect-data-platform/choose-a-connection.png" title="Выберите подключение"/>

Эти инструкции по подключению описывают базовые поля, необходимые для настройки соединения с платформой данных в <Constant name="cloud" />. Более подробные руководства, включающие демонстрационные данные проекта, см. в наших [Quickstart guides](/guides).

### Поддерживаемые методы аутентификации

В следующих таблицах показано, какие типы аутентификации поддерживаются для каждого подключения, доступного в <Constant name="dbt_platform" />:

<Tabs>

<TabItem value="dbt Core">

import AuthTypes from '/snippets/_dbt_connection_support.md';

<AuthTypes />
</TabItem>

<TabItem value="dbt Fusion">
import AuthTypesFusion from '/snippets/_dbt_connection_support_fusion.md';

<AuthTypesFusion />

</TabItem>

</Tabs>

## Управление подключениями

Подключения к хранилищам данных — это ресурс уровня аккаунта. Вы можете найти их в разделе **Account settings** > **Connections**.

Подключения к хранилищам данных могут повторно использоваться в разных проектах. Если несколько проектов подключаются к одному и тому же хранилищу, вы должны повторно использовать одно и то же подключение, чтобы упростить управление. Подключения назначаются проекту через [среду](/docs/dbt-cloud-environments).

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-new-model.png" width="60%" title="Модель подключения"/>

Как показано на изображении, проект с 2 средами может использовать от 1 до 2 различных подключений. Если вы хотите отделить вашу производственную среду от непроизводственной, назначьте несколько подключений одному проекту.

### Миграция с подключений уровня проекта на подключения уровня аккаунта

Внедрение подключений уровня аккаунта не потребует никаких перерывов в работе ваших текущих сценариев использования (<Constant name="cloud_ide" />, CLI, jobs и так далее).

:::info Почему меня просят настроить среду разработки?
Если в вашем проекте ранее не было среды разработки, вы можете быть перенаправлены на страницу настройки проекта. Ваш проект все еще в целости. Выберите подключение для вашей новой среды разработки, и вы сможете снова просмотреть все ваши среды.
:::

Однако, чтобы полностью использовать преимущества подключений на уровне учетной записи, вам, возможно, придется пересмотреть, как вы назначаете и используете подключения в проектах и средах.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout.png" width="60%" title="Типичная настройка подключения после развертывания"/>

Пожалуйста, рассмотрите следующие действия, так как шаги, которые вы предпримете, будут зависеть от желаемого результата.

- Первоначальная очистка списка подключений
  - Удалите неиспользуемые подключения с 0 средами.
  - Переименуйте подключения с временной, описательной схемой именования, чтобы лучше понять, где каждое используется

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-2.png" width="60%" title="После первоначальной очистки"/>

- Детализация подключений
  - Определите намерение для каждого подключения, обычно это комбинация экземпляра хранилища/базы данных, предполагаемого использования (разработка, производство и т.д.) и административной поверхности (какие команды/проекты будут нуждаться в совместной работе над подключением)
  - Стремитесь минимизировать необходимость локальных переопределений (например, расширенных атрибутов)
  - Придите к консенсусу по поводу соглашения об именах. Мы рекомендуем называть подключения по имени хоста сервера и отличительным намерением/доменом/конфигурацией. Так будет легче повторно использовать подключения в разных проектах

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-3.png" width="60%" title="Определена детализация"/>

- Дедупликация (список подключений + детали среды &mdash; пока не касаясь расширенных атрибутов)
  - На основе детализации ваших подключений определите, какие подключения должны остаться среди групп дубликатов, и обновите каждую соответствующую среду, чтобы использовать это подключение
  - Удаляйте неиспользуемые подключения с 0 средами по мере продвижения
  - Дедуплицируйте вдумчиво. Если вы хотите, чтобы подключения поддерживались двумя разными группами пользователей, вы можете сохранить два идентичных подключения к одному и тому же хранилищу, чтобы каждое могло развиваться так, как считает нужным, без влияния на другую группу
  - Не обновляйте расширенные атрибуты на этом этапе

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-4.png" width="60%" title="Подключения дедуплицированы"/>

- Нормализация
  - Разберитесь, как следует создавать новые подключения, чтобы избежать локальных переопределений. Если в настоящее время вы используете extended attributes для переопределения экземпляра хранилища данных в production‑окружении, вместо этого следует создать новое подключение для этого экземпляра и привязать к нему production‑окружение, устранив необходимость в локальных переопределениях.
  - Создайте новые подключения, обновите соответствующие окружения так, чтобы они указывали на эти подключения, и удалите ставшие ненужными локальные переопределения (возможно, не все из них).
  - Протестируйте новую связку, запустив jobs или начав сессии в <Constant name="cloud_ide" />

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-5.png" width="60%" title="Подключения нормализованы"/>

## Ограничения по IP

<Constant name="cloud" /> всегда будет подключаться к вашей платформе данных с IP-адресов, указанных на странице [Regions & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).

Убедитесь, что вы разрешили трафик с этих IP-адресов в вашем файрволе и включили их в любые предоставления базы данных.

Разрешение только этих IP-адресов обеспечивает подключение к вашему <Term id="data-warehouse" />. Однако вам может понадобиться отправлять API‑запросы из вашей ограниченной сети в API <Constant name="cloud" />. Использование API <Constant name="cloud" /> требует разрешения поддомена `cloud.getdbt.com`. Подробнее об архитектуре <Constant name="cloud" /> см. в разделе [Deployment architecture](/docs/cloud/about-cloud/architecture).
