---
title: "Настройка Cost Insights"
sidebar_label: "Настройка Cost Insights"
description: "Узнайте, как настроить Cost Insights для отслеживания затрат на вычисления в хранилище данных и просмотра фактической экономии благодаря оркестрации с учетом состояния в ваших проектах и моделях dbt."
id: "set-up-cost-insights"
tags: ['SAO', 'cost savings', 'models built', 'cost insights', 'cost reduction', 'cost optimization']
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

import SaoDeprecated from '/snippets/_sao-deprecated.md';

# Настройка Cost Insights

В этом руководстве описана настройка Cost Insights для отслеживания затрат на вычисления в хранилище данных и их сокращения благодаря dbt State и оркестрации с учетом состояния в ваших проектах и моделях dbt.

## Предварительные требования

Перед настройкой Cost Insights убедитесь, что у вас есть:

- Роль администратора.
- Поддерживаемое хранилище данных: 
    - Snowflake
    - BigQuery
    - Databricks
    - Amazon Redshift <Lifecycle status="preview" />

Чтобы настроить Cost Insights, выполните следующие действия:

1. [Назначьте необходимые разрешения.](#assign-required-permissions)
2. [Настройте учетные данные для метаданных платформы.](#configure-platform-metadata-credentials)
3. [(Необязательно) Настройте параметры Cost Insights.](#configure-cost-insights-settings-optional)
4. [(Необязательно, только для Snowflake) Настройте пользовательские переопределения отношений.](#custom-relation-overrides)
5. [(Необязательно) Включите dbt State или оркестрацию с учетом состояния в настройках задания.](#enable-dbt-state-or-state-aware-orchestration-optional)

После выполнения этих шагов вы сможете просматривать данные о затратах и оптимизации в различных разделах <Constant name="dbt_platform" />. Подробнее о разделе Cost Insights и его использовании см. в [Обзоре данных о затратах](/docs/explore/explore-cost-data).

## Назначение необходимых разрешений {#assign-required-permissions}

Пользователи со следующими [наборами разрешений](/docs/platform/manage-access/enterprise-permissions) по умолчанию могут просматривать данные о затратах:

- Account Admin
- Account Viewer
- Cost Insights Admin
- Cost Insights Viewer
- Database Admin
- Git Admin
- Job Admin
- Project Creator
- Team Admin

Подробнее о назначении разрешений пользователям см. в разделе [О доступе пользователей](/docs/platform/manage-access/about-user-access).

## Настройка учетных данных для метаданных платформы {#configure-platform-metadata-credentials}

1. Нажмите на имя своей учетной записи в нижней части левого меню и выберите **Account settings**.
2. В разделе **Settings** перейдите в **Connections**.
3. Выберите существующее подключение или создайте новое для проекта, в котором вы хотите включить Cost Insights.
4. Настройте учетные данные для метаданных платформы для вашего подключения.
    1. Перейдите в раздел **Platform metadata credentials**. В зависимости от текущей конфигурации вы можете увидеть один из следующих вариантов:
        - Если учетные данные для метаданных платформы еще не настроены, форма учетных данных сразу открывается в режиме редактирования.
        - Если вы ранее закрыли форму и видите **Add credentials**, нажмите эту кнопку, чтобы снова открыть форму.
        - Если у вас несколько подключений с одним и тем же идентификатором учетной записи, вам будет предложено добавить учетные данные для метаданных платформы только для одного из них. В остальных подключениях с тем же идентификатором учетной записи появится сообщение о том, что учетные данные для метаданных платформы уже настроены.
    2. Добавьте учетные данные с разрешениями на доступ к таблицам хранилища данных. Разверните раздел каждого подключения, чтобы увидеть необходимые разрешения.

        <Expandable alt_header="Snowflake">
        - Разрешения `read` для схем [`ORGANIZATION_USAGE`](https://docs.snowflake.com/en/sql-reference/organization-usage) и [`ACCOUNT_USAGE`](https://docs.snowflake.com/en/sql-reference/account-usage)
        - Роль базы данных Snowflake, которой предоставлен доступ к следующим объектам:
            - `ACCOUNT_USAGE.QUERY_HISTORY`
            - `ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY`
            - `ORGANIZATION_USAGE.USAGE_IN_CURRENCY_DAILY` (необязательно)
            - `ACCOUNT_USAGE.QUERY_METERING_HISTORY` (необязательно; требуется для отнесения затрат к запросам [Adaptive Warehouse](https://docs.snowflake.com/en/user-guide/warehouses-adaptive))

                Если доступ к `QUERY_METERING_HISTORY` не предоставлен, стоимость запросов Adaptive Warehouse отображается в Cost Insights как $0, а при проверке подключения появляется предупреждение. Подробнее см. в [документации Snowflake](https://docs.snowflake.com/en/sql-reference/account-usage/query_metering_history).
        
        :::note
        Если у вас нет доступа к системной базе данных `SNOWFLAKE`, вы можете [настроить пользовательские переопределения отношений](#custom-relation-overrides), чтобы Cost Insights использовал ваши собственные таблицы или представления.
        :::
        </Expandable>

        <Expandable alt_header="BigQuery">
        - `bigquery.datasets.get`
        - `bigquery.jobs.create`
        - `bigquery.jobs.listAll`
        </Expandable>

        <Expandable alt_header="Databricks">
        - Доступ к [рабочей области Unity Catalog](https://docs.databricks.com/aws/en/admin/system-tables/#requirements)
        - Разрешения `USE` для каталога и схемы
        - Разрешения `SELECT` для следующих системных таблиц:
            - [`system.billing.usage`](https://docs.databricks.com/aws/en/admin/system-tables/billing)
            - [`system.billing.list_prices`](https://docs.databricks.com/aws/en/admin/system-tables/pricing)
            - [`system.query.history`](https://docs.databricks.com/aws/en/admin/system-tables/query-history)

        Подробнее см. в документации Databricks о [предоставлении доступа к системным таблицам](https://docs.databricks.com/aws/en/admin/system-tables/#grant-access-to-system-tables).
        </Expandable>

        <Expandable alt_header="Amazon Redshift" lifecycle="preview" lifecycle_size="75">
        По умолчанию пользователи Redshift могут просматривать только собственные запросы. Чтобы относить затраты к вашим запускам dbt, dbt должен иметь возможность получать из `SYS_QUERY_HISTORY` запросы всех пользователей. Предоставьте пользователю, указанному в учетных данных для метаданных платформы, одно из следующих разрешений:

        - **Роль `sys:monitor`** (рекомендуется):
            ```sql
            GRANT ROLE sys:monitor TO <user>;
            ```
        - **Неограниченный доступ к syslog**:
            ```sql
            ALTER USER <user> SYSLOG ACCESS UNRESTRICTED;
            ```

        Подробнее см. в [документации Amazon Redshift о разрешениях для расширенного мониторинга запросов](https://docs.aws.amazon.com/redshift/latest/mgmt/metrics-enhanced-query-monitoring.html#metrics-enhanced-query-monitoring-permissions).

        При проверке подключения dbt проверяет видимость запросов других пользователей. Если учетные данные позволяют видеть только собственные запросы, проверка завершается неудачей и данные о затратах для этой среды не обрабатываются.

        </Expandable>

5. Убедитесь, что в разделе **Features** включена опция **Cost insights**. Эта функция включается по умолчанию при настройке учетных данных для метаданных платформы.
6. Нажмите **Save**.

## Настройка параметров Cost Insights (необязательно) {#configure-cost-insights-settings-optional}

**Примечание:** Этот шаг обязателен для пользователей Amazon Redshift. Если цена не настроена, затраты будут отображаться как $0.

По умолчанию dbt использует стандартные тарифы хранилища данных, которые можно переопределить, если у вас есть индивидуальные ценовые соглашения. Для Databricks и Amazon Redshift значений по умолчанию нет. Значения по умолчанию зависят от хранилища данных:

| Хранилище данных | Значения по умолчанию |
|-----------|----------------|
| [Snowflake](https://www.snowflake.com/en/pricing-options/) | `price_per_credit` = $3 |
| [BigQuery](https://cloud.google.com/bigquery/pricing) | `price_per_slot_hour` = $0.04, `price_per_tib` = $6.25 |
| [Databricks](https://docs.databricks.com/aws/en/admin/system-tables/pricing) | dbt напрямую запрашивает системную таблицу `list_prices`, поэтому значения по умолчанию нет. |
| [Amazon Redshift Serverless](https://aws.amazon.com/redshift/pricing/) | `rpu_price_per_hour` — значения по умолчанию нет; до настройки затраты отображаются как $0. |
| [Amazon Redshift Provisioned](https://aws.amazon.com/redshift/pricing/) | `node_price_per_hour` — значения по умолчанию нет; до настройки затраты отображаются как $0. |

<br></br>

Чтобы изменить значение по умолчанию:

1. Нажмите на имя своей учетной записи в нижней части левого меню и выберите **Account settings**.
2. В разделе **Settings** перейдите в **Connections**.
3. Выберите подключение, для которого вы хотите настроить параметры Cost Insights.
4. Перейдите в раздел **Cost Insights settings**.
5. Введите свое значение в поле **Price per credit**.
6. Нажмите **Save**.

Эти пользовательские значения будут применяться ко всем последующим расчетам затрат для этого подключения. Если вы удалите эти значения, будут восстановлены стандартные тарифы хранилища данных.

## Настройка пользовательских переопределений отношений (необязательно) <Lifecycle status="private_beta" /> {#custom-relation-overrides}

:::info Функция в закрытом бета-тестировании
Эта функция доступна только для подключений Snowflake с включенным Cost Insights. Чтобы присоединиться к закрытому бета-тестированию, свяжитесь с представителем, обслуживающим вашу учетную запись.
:::

Если вы используете Snowflake и ваши учетные данные не дают доступа к системной базе данных `SNOWFLAKE`, вы можете использовать собственные таблицы или представления вместо стандартных [системных таблиц Snowflake](/docs/explore/set-up-cost-insights#snowflake), к которым обращается Cost Insights. Необязательно переопределять все три таблицы &mdash; для любой таблицы, которую вы не настроите, будет использоваться стандартная системная таблица Snowflake.

Чтобы настроить пользовательские переопределения отношений:

1. Нажмите на имя своей учетной записи в нижней части левого меню и выберите **Account settings**.
2. В разделе **Settings** перейдите в **Connections**.
3. Выберите подключение Snowflake, для которого вы хотите настроить пользовательские переопределения отношений.
4. Перейдите в раздел **Cost Insights settings** и прокрутите до **Custom relation overrides**.
5. Введите полное имя в одно или несколько следующих полей. Каждое значение должно быть полным идентификатором вида `database.schema.table` (без кавычек или в двойных кавычках).
    - **Custom query history relation**: заменяет `SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY`.
    - **Custom query attribution history relation**: заменяет `SNOWFLAKE.ACCOUNT_USAGE.QUERY_ATTRIBUTION_HISTORY`.
    - **Custom usage in currency daily relation**: заменяет `SNOWFLAKE.ORGANIZATION_USAGE.USAGE_IN_CURRENCY_DAILY`.
6. Нажмите **Save**.

## Включение dbt State (необязательно) {#enable-dbt-state-or-state-aware-orchestration-optional}

<SaoDeprecated />

Cost Insights отображает данные о затратах для ваших моделей и заданий dbt и без dbt State. Однако, чтобы оценить влияние оптимизаций и увидеть сокращение затрат благодаря повторному использованию моделей и тестов, необходимо включить dbt State в ваших заданиях. Инструкции по включению см. в разделе [Настройка dbt State](/docs/deploy/dbt-state-setup).

Cost Insights также отражает сокращение затрат и повышение эффективности благодаря оркестрации с учетом состояния, если она включена.

import CostInsights from '/snippets/_cost-insights-sao.md';

<CostInsights />

## Отключение Cost Insights

Чтобы отключить Cost Insights, необходимо иметь роль администратора.

1. Нажмите на имя своей учетной записи в нижней части левого меню и выберите **Account settings**.
2. В разделе **Settings** перейдите в **Connections**.
3. Выберите подключение, для которого вы хотите отключить Cost Insights.
4. Перейдите в **Platform metadata credentials** и нажмите **Edit**.
5. Перейдите в раздел **Features** и снимите флажок **Cost Insights**.
6. Нажмите **Save**.
