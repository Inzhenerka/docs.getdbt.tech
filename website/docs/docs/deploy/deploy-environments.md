---
title: "Среды развертывания"
id: "deploy-environments"
description: "Learn about dbt's deployment environment to seamlessly schedule jobs or enable CI."
---

Среды развертывания в <Constant name="cloud" /> являются ключевым элементом для запуска dbt‑джобов в продакшене и использования функций или интеграций, которые зависят от метаданных dbt или результатов его выполнения. При запуске dbt именно среды определяют настройки, используемые во время выполнения джобов, включая:

- версию <Constant name="core" />, которая будет использоваться для запуска вашего проекта;
- параметры подключения к хранилищу данных (включая настройки целевой базы данных и схемы);
- версию вашего кода, которая будет выполняться.

Проект в <Constant name="cloud" /> может иметь несколько сред развертывания, что дает вам гибкость и возможности настройки для адаптации выполнения dbt‑джобов под свои задачи. Среды развертывания можно использовать для [создания и планирования джобов](/docs/deploy/deploy-jobs#create-and-schedule-jobs), [включения непрерывной интеграции](/docs/deploy/continuous-integration) и других сценариев в зависимости от ваших потребностей или требований.

:::tip Узнайте, как управлять средами <Constant name="cloud" />
Чтобы изучить различные подходы к управлению средами <Constant name="cloud" /> и получить рекомендации с учетом уникальных потребностей вашей организации, прочитайте руководство [лучшие практики работы со средами <Constant name="cloud" />](/guides/set-up-ci).
:::

Подробнее о различиях между средами разработки и развертывания читайте в разделе [Среды <Constant name="cloud" />](/docs/dbt-cloud-environments).

Существует три типа сред развертывания:
- **Производственная**: Среда для преобразования данных и построения конвейеров для производственного использования.
- **Промежуточная**: Среда для работы с производственными инструментами с ограничением доступа к производственным данным.
- **Общая**: Среда общего назначения для разработки развертывания.

Мы настоятельно рекомендуем использовать тип среды `Производственная` для окончательных, достоверных данных развертывания. Может быть только одна среда, отмеченная для окончательных производственных рабочих процессов, и мы не рекомендуем использовать `Общую` среду для этой цели.

## Создание среды развертывания

Чтобы создать новое окружение развёртывания <Constant name="cloud" />, перейдите в **Deploy** → **Environments**, а затем нажмите **Create Environment**. В качестве типа окружения выберите **Deployment**. Этот вариант будет недоступен (подсвечен серым), если у вас уже есть окружение разработки.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/create-deploy-env.png" width="85%" title="Перейдите в Deploy -> Environments, чтобы создать среду развертывания" />

### Установить как производственную среду

В <Constant name="cloud" /> каждый проект может иметь одну назначенную среду развертывания, которая служит его production‑средой. Эта production‑среда _критически важна_ для использования таких возможностей, как <Constant name="explorer" /> и межпроектные ссылки. Она выступает в роли источника истины о production‑состоянии проекта в <Constant name="cloud" />.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/prod-settings-1.png" width="100%" title="Установите вашу производственную среду в качестве среды по умолчанию в настройках среды"/>

### Семантический слой

Для клиентов, использующих <Constant name="semantic_layer" />, следующий раздел настроек окружения посвящён конфигурациям <Constant name="semantic_layer" />. В руководстве по настройке [The <Constant name="semantic_layer" /> setup guide](/docs/use-dbt-semantic-layer/setup-sl) приведены самые актуальные инструкции по установке и настройке.

Вы также можете использовать планировщик задач dbt для [проверки ваших семантических узлов в задаче CI](/docs/deploy/ci-jobs#semantic-validations-in-ci), чтобы убедиться, что изменения в коде dbt моделей не нарушают эти метрики.

## Промежуточная среда

Используйте Staging‑окружение, чтобы предоставить разработчикам доступ к workflow развертывания и инструментам, одновременно контролируя доступ к production‑данным. Staging‑окружения позволяют добиться более тонкого управления правами доступа, подключениями к хранилищу данных и изоляцией данных — в рамках одного проекта в <Constant name="cloud" />.

### Git-рабочий процесс

Вы можете подойти к этому несколькими способами, но самый простой — это настроить промежуточную среду с долгоживущей веткой (например, `staging`), аналогичной, но отдельной от основной ветки (например, `main`).

В этом сценарии рабочие процессы будут идеальным образом перемещаться вверх по потоку от среды разработки -> промежуточной среды -> производственной среды, с ветками разработчиков, питающимися в ветку `staging`, а затем в конечном итоге сливающимися в `main`. Во многих случаях ветки `main` и `staging` будут идентичны после слияния и останутся такими до следующей партии изменений из веток `development`, готовых к повышению. Мы рекомендуем устанавливать правила защиты веток на `staging`, аналогичные `main`.

Некоторые клиенты предпочитают подключать разработку и промежуточную среду к своей ветке `main`, а затем регулярно создавать ветки релизов (ежедневно или еженедельно), которые питаются в производственную среду.

### Зачем использовать промежуточную среду

Основные причины использования промежуточной среды:
1. Дополнительный уровень проверки перед развертыванием изменений в производственной среде. Вы можете развертывать, тестировать и исследовать ваши dbt модели в промежуточной среде.
2. Четкая изоляция между рабочими процессами разработки и производственными данными. Это позволяет разработчикам работать с использованием метаданных, используя такие функции, как отложенное выполнение и перекрестные ссылки между проектами, без доступа к данным в производственных развертываниях.
3. Предоставление разработчикам возможности создавать, редактировать и запускать произвольные задачи в промежуточной среде, при этом сохраняя производственную среду заблокированной с использованием [разрешений на уровне среды](/docs/cloud/manage-access/environment-permissions).

**Условная конфигурация источников** позволяет вам указывать на "prod" или "non-prod" исходные данные в зависимости от среды, в которой вы работаете. Например, этот источник будет указывать на `<DATABASE>.sensitive_source.table_with_pii`, где `<DATABASE>` динамически разрешается на основе переменной среды.

<File name="models/sources.yml">

```yaml
sources:
  - name: sensitive_source
    database: "{{ env_var('SENSITIVE_SOURCE_DATABASE') }}"
    tables:
      - name: table_with_pii
```

</File>

Существует ровно один источник (`sensitive_source`), и все downstream dbt модели выбирают из него как `{{ source('sensitive_source', 'table_with_pii') }}`. Код в вашем проекте и форма DAG остаются последовательными во всех средах. Настраивая это таким образом, а не дублируя источники, вы получаете некоторые важные преимущества.

**Перекрестные ссылки между проектами в dbt Mesh:** Предположим, у вас есть `Project B`, который является downstream от `Project A` с настроенными перекрестными ссылками между проектами в моделях. Когда разработчики работают в IDE для `Project B`, перекрестные ссылки будут разрешаться в промежуточную среду `Project A`, а не в производственную. Вы получите те же результаты с этими ссылками, когда задачи выполняются в промежуточной среде. Только производственная среда будет ссылаться на производственные данные, сохраняя данные и доступ изолированными без необходимости в отдельных проектах.

**Быстрая разработка с помощью отложенного выполнения:** Если у `Project B` также есть промежуточное развертывание, то ссылки на не построенные upstream модели в `Project B` будут разрешаться в эту среду, используя [отложенное выполнение](/docs/cloud/about-cloud-develop-defer), а не разрешаться в модели в производственной среде. Это экономит время разработчиков и затраты на хранилище, сохраняя при этом четкое разделение сред.

Наконец, для окружения Staging предусмотрено собственное представление в [<Constant name="explorer" />](/docs/explore/explore-projects), которое дает вам полную картину данных как из prod, так и из pre-prod.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explore-staging-env.png" width="85%" title="Исследуйте в промежуточной среде" />


### Создание staging‑окружения

В <Constant name="cloud" /> перейдите в **Deploy** -> **Environments**, затем нажмите **Create Environment**. Выберите **Deployment** в качестве типа окружения. Эта опция будет неактивна (серой), если у вас уже есть окружение разработки.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/create-staging-environment.png" width="85%" title="Создайте staging‑окружение" />


Следуйте шагам, описанным в разделе [deployment credentials](#deployment-connection), чтобы завершить остальную настройку окружения.

Мы рекомендуем, чтобы учётные данные хранилища данных принадлежали выделенному пользователю или service principal.

## Подключение для развертывания

:::info Подключения к хранилищу данных

Подключения к хранилищам создаются и управляются на уровне аккаунта для аккаунтов <Constant name="cloud" /> и затем назначаются окружению. Чтобы изменить тип хранилища, мы рекомендуем создать новое окружение.

В каждом проекте может быть несколько подключений (аккаунт Snowflake, хост Redshift, проект BigQuery, хост Databricks и т. д.) одного и того же типа хранилища. Некоторые детали этого подключения (databases/schemas и т. п.) можно переопределить в этом разделе настроек окружения <Constant name="cloud" />.
:::

Эта секция определяет точное местоположение в вашем хранилище, на которое dbt должен нацелиться при создании объектов хранилища! Эта секция будет выглядеть немного по-разному в зависимости от вашего поставщика хранилища.

Для всех хранилищ используйте [extended attributes](/docs/dbt-cloud-environments#extended-attributes), чтобы переопределить отсутствующие или неактивные (подсвеченные серым) настройки.

<WHCode>


<div warehouse="Postgres">

Этот раздел не отображается, если вы используете Postgres, так как все значения берутся из подключения проекта. Используйте [extended attributes](/docs/dbt-cloud-environments#extended-attributes), чтобы переопределить эти значения.

</div>

<div warehouse="Redshift">

Этот раздел не отображается, если вы используете Redshift, так как все значения берутся из подключения проекта. Используйте [extended attributes](/docs/dbt-cloud-environments#extended-attributes), чтобы переопределить эти значения.

</div>

<div warehouse="Snowflake">

<Lightbox src="/img/docs/collaborate/snowflake-deploy-env-deploy-connection.png" width="85%" title="Snowflake Deployment Connection Settings"/>

#### Редактируемые поля

- **Role**: роль Snowflake  
- **Database**: целевая база данных  
- **Warehouse**: вычислительный кластер Snowflake  

</div>

<div warehouse="Bigquery">

Этот раздел не отображается, если вы используете Bigquery, так как все значения берутся из подключения проекта. Используйте [extended attributes](/docs/dbt-cloud-environments#extended-attributes), чтобы переопределить эти значения.

</div>

<div warehouse="Spark">

Этот раздел не отображается, если вы используете Spark, так как все значения берутся из подключения проекта. Используйте [extended attributes](/docs/dbt-cloud-environments#extended-attributes), чтобы переопределить эти значения.

</div>

<div warehouse="Databricks">

<Lightbox src="/img/docs/collaborate/databricks-deploy-env-deploy-connection.png" width="85%" title="Databricks Deployment Connection Settings"/>

#### Редактируемые поля

- **Catalog** (необязательно): [пространство имён Unity Catalog](/docs/core/connect-data-platform/databricks-setup)

</div>

</WHCode>


### Учетные данные для развертывания

Этот раздел позволяет определить учётные данные, которые будут использоваться при подключении к вашему хранилищу. Методы аутентификации могут различаться в зависимости от типа хранилища и используемого уровня <Constant name="cloud" />.

Для всех хранилищ используйте [extended attributes](/docs/dbt-cloud-environments#extended-attributes), чтобы переопределить отсутствующие или неактивные (подсвеченные серым) настройки. Для учётных данных мы рекомендуем оборачивать extended attributes в [environment variables](/docs/build/environment-variables) (`password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'`), чтобы секретное значение не отображалось в текстовом поле и логах.

<WHCode>

<div warehouse="Postgres">

<Lightbox src="/img/docs/collaborate/postgres-deploy-env-deploy-credentials.png" width="85%" title="Настройки deployment credentials для Postgres"/>

#### Редактируемые поля

- **Username**: имя пользователя Postgres (скорее всего service account)
- **Password**: пароль Postgres для указанного пользователя
- **Schema**: целевая схема

</div>

<div warehouse="Redshift">

<Lightbox src="/img/docs/collaborate/postgres-deploy-env-deploy-credentials.png" width="85%" title="Настройки deployment credentials для Redshift"/>

#### Редактируемые поля

- **Username**: имя пользователя Redshift (скорее всего service account)
- **Password**: пароль Redshift для указанного пользователя
- **Schema**: целевая схема

</div>

<div warehouse="Snowflake">

<Lightbox src="/img/docs/collaborate/snowflake-deploy-env-deploy-credentials.png" width="85%" title="Настройки deployment credentials для Snowflake"/>

#### Редактируемые поля

- **Auth Method**: определяет способ подключения dbt к вашему warehouse
  - Один из: [**Username & Password**, **Key Pair**]
- Если **Username & Password**:
  - **Username**: имя пользователя (скорее всего service account)
  - **Password**: пароль для указанного пользователя
- Если **Key Pair**:
  - **Username**: имя пользователя (скорее всего service account)
  - **Private Key**: значение Private SSH Key (необязательно в пользовательском интерфейсе, но обязательно для key pair authentication при запуске dbt)
  - **Private Key Passphrase**: значение passphrase для Private SSH Key (необязательно; только если требуется)
- **Schema**: целевая схема для этого окружения

</div>

<div warehouse="Bigquery">

<Lightbox src="/img/docs/collaborate/bigquery-deploy-env-deploy-credentials.png" width="85%" title="Настройки deployment credentials для Bigquery"/>

#### Редактируемые поля

- **Dataset**: целевой датасет

Используйте [extended attributes](/docs/dbt-cloud-environments#extended-attributes), чтобы переопределять отсутствующие или неактивные (серые) настройки. Для учётных данных мы рекомендуем оборачивать extended attributes в [environment variables](/docs/build/environment-variables) (`password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'`), чтобы не отображать значение секрета в текстовом поле и логах.

</div>

<div warehouse="Spark">

<Lightbox src="/img/docs/collaborate/spark-deploy-env-deploy-credentials.png" width="85%" title="Настройки deployment credentials для Spark"/>

#### Редактируемые поля

- **Token**: токен доступа
- **Schema**: целевая схема

</div>

<div warehouse="Databricks">

<Lightbox src="/img/docs/collaborate/spark-deploy-env-deploy-credentials.png" width="85%" title="Настройки deployment credentials для Databricks"/>

#### Редактируемые поля

- **Token**: токен доступа
- **Schema**: целевая схема

</div>

</WHCode>

## Удаление окружения

import DeleteEnvironment from '/snippets/_delete-environment.md';

<DeleteEnvironment />

## Связанные материалы

- [Best practices для окружений <Constant name="cloud" />](/guides/set-up-ci)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [CI jobs](/docs/deploy/continuous-integration)
- [Удаление job или окружения в <Constant name="cloud" />](/faqs/Environments/delete-environment-job)
