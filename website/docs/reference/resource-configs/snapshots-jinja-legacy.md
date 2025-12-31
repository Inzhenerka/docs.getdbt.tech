---
title: Устаревшие конфигурации snapshots
description: Узнайте, как настраивать snapshots с помощью устаревших Jinja-блоков
sidebar: "Устаревшая конфигурация"
---

# Устаревшая конфигурация snapshot <Lifecycle status='legacy' /> {#legacy-snapshot-configuration}

<IntroText>

Используйте устаревшие SQL‑конфигурации снапшотов на основе Jinja‑блоков в любой версии dbt. В dbt v1.9 были представлены YAML‑конфигурации, которые обеспечивают лучшую читаемость и учитывают окружение.

</IntroText>

В некоторых ситуациях вам может понадобиться использовать устаревший синтаксис для [snapshots](/docs/build/snapshots) в любой версии или ветке релизов dbt. На этой странице описано, как при необходимости использовать устаревшие SQL‑конфигурации.

В dbt v1.9 этот синтаксис был заменён на [YAML‑конфигурацию](/reference/snapshot-configs#configuring-snapshots) в ветке релизов <Constant name="cloud" /> "Latest" (/docs/dbt-versions/cloud-release-tracks). Преимущество YAML‑конфигураций заключается в том, что снапшоты становятся чувствительными к окружению: вам не нужно указывать `schema` или `database`, а сам синтаксис становится более лаконичным.

Для новых снапшотов мы рекомендуем использовать актуальные YAML‑конфигурации. Если вы хотите перейти на YAML‑конфигурацию для существующих снапшотов, вы можете [выполнить миграцию](/reference/snapshot-configs#snapshot-configuration-migration).

Когда стоит использовать SQL‑синтаксис, а когда — YAML‑синтаксис?

- SQL‑синтаксис:
  - Определяется в файлах `.sql` внутри snapshot Jinja‑блока, обычно расположенных в директории `snapshots`. Доступен во всех версиях.
  - Подходит для существующих снапшотов, которые уже используют этот синтаксис.
  - Подходит для выполнения очень лёгких трансформаций (однако для лучшей поддерживаемости рекомендуется выносить трансформации в отдельную ephemeral‑модель).

- YAML‑синтаксис:
  - Определяется в файлах `whatever_name.yml` или в директориях `snapshots` или `models` — на ваш выбор. Доступен в ветке релизов <Constant name="cloud" /> "Latest" и в dbt v1.9 и выше.
  - Идеален для новых снапшотов или существующих снапшотов, которые нужно [мигрировать](/reference/snapshot-configs#snapshot-configuration-migration).
  - Трансформации выносятся за пределы файла снапшота путём создания ephemeral‑модели и ссылки на неё в снапшоте с помощью поля `relation`.

## Конфигурации снапшотов {#snapshot-configurations}

Хотя вы можете использовать более производительную YAML‑конфигурацию, в некоторых случаях вам всё же может подойти устаревшая конфигурация для определения снапшотов.

Снапшоты можно настраивать двумя основными способами:
- с помощью [специфичных для снапшотов конфигураций](#snapshot-specific-configurations)
- либо с помощью [общих конфигураций](#general-configuration)

Эти конфигурации позволяют управлять тем, как dbt обнаруживает изменения в данных и где хранятся снапшоты. Оба типа конфигураций могут сосуществовать в одном проекте и даже в одном `config`‑блоке (либо задаваться через файл `dbt_project.yml` или `properties.yaml`).

Одной из самых важных настроек является выбор [стратегии](#snapshot-strategies), которая определяет, каким образом dbt обнаруживает изменённые строки.

### Специфичные для снапшотов конфигурации {#snapshot-specific-configurations}

Специфичные для снапшотов конфигурации применяются только к одному типу ресурсов dbt, а не к нескольким сразу. Эти настройки можно определить непосредственно в файле ресурса с помощью макроса `{{ config() }}` (а также в файле проекта `dbt_project.yml` или в property‑файле, например `models/properties.yml` для моделей — аналогично и для других ресурсов).

<File name='snapshots/orders_snapshot.sql'>

```sql
{ % snapshot orders_snapshot %}

{{ config(
    [target_schema](/reference/resource-configs/target_schema)="<string>",
    [target_database](/reference/resource-configs/target_database)="<string>",
    [unique_key](/reference/resource-configs/unique_key)="<column_name_or_expression>",
    [strategy](/reference/resource-configs/strategy)="timestamp" | "check",
    [updated_at](/reference/resource-configs/updated_at)="<column_name>",
    [check_cols](/reference/resource-configs/check_cols)=["<column_name>"] | "all"
    [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) : true | false
) 
}}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

### Общие конфигурации {#general-configuration}

Используйте общие конфигурации для более широких операционных настроек, применимых к нескольким типам ресурсов. Как и конфигурации, специфичные для ресурсов, их можно задавать в проектном YAML‑файле, в property‑файлах YAML или непосредственно в файлах ресурсов с помощью `config`‑блока.

<File name='snapshots/snapshot.sql'>

```sql
{{ config(
    [enabled](/reference/resource-configs/enabled)=true | false,
    [tags](/reference/resource-configs/tags)="<string>" | ["<string>"],
    [alias](/reference/resource-configs/alias)="<string>", 
    [pre_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"],
    [post_hook](/reference/resource-configs/pre-hook-post-hook)="<sql-statement>" | ["<sql-statement>"]
    [persist_docs](/reference/resource-configs/persist_docs)={<dict>}
    [grants](/reference/resource-configs/grants)={<dict>}
) }}
```
</File>

### Стратегии снапшотов {#snapshot-strategies}

«Стратегии» снапшотов определяют, каким образом dbt понимает, что строка изменилась. В dbt встроены две стратегии, для которых требуется параметр `strategy`:

- [Timestamp](/reference/resource-configs/snapshots-jinja-legacy?strategy=timestamp#snapshot-strategies) — использует колонку `updated_at`, чтобы определить, изменилась ли строка.
- [Check](/reference/resource-configs/snapshots-jinja-legacy?strategy=check#snapshot-strategies) — сравнивает список колонок между текущими и историческими значениями, чтобы определить изменения. Использует параметр `check_cols`.

<Tabs queryString="strategy">
<TabItem value="timestamp" label="Timestamp" id="timestamp">

Стратегия timestamp использует поле `updated_at` для определения изменений строки. Если значение `updated_at` для строки новее, чем время последнего запуска снапшота, dbt помечает старую запись как неактуальную и сохраняет новую. Если временные метки не изменились, dbt не предпринимает никаких действий.

#### Пример {#example}

<File name='snapshots/timestamp_example.sql'>

```sql
{% snapshot orders_snapshot_timestamp %}

    {{
        config(
          target_schema='snapshots',
          strategy='timestamp',
          unique_key='id',
          updated_at='updated_at',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>
</TabItem>

<TabItem value="check" label="Check" id="check">

Стратегия check полезна для таблиц, в которых нет надёжной колонки `updated_at`. Она требует параметр `check_cols`, который представляет собой список колонок из результата запроса снапшота, по которым проверяются изменения. В качестве альтернативы можно указать значение `all`, чтобы использовать все колонки (однако это может быть менее производительно).

#### Пример {#example-1}

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>

#### Примеры {#examples}
<Expandable alt_header="Проверка списка колонок на изменения">

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols=['status', 'is_cancelled'],
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>
</Expandable>

<Expandable alt_header="Проверка всех колонок на изменения">

<File name='snapshots/check_example.sql'>

```sql
{% snapshot orders_snapshot_check %}

    {{
        config(
          strategy='check',
          unique_key='id',
          check_cols='all',
        )
    }}

    select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```
</File>
</Expandable>
</TabItem>
</Tabs>

## Справочник конфигураций {#configuration-reference}

Настройте снапшот, чтобы указать dbt, как определять изменения записей. Снапшоты — это `select`‑запросы, определённые внутри snapshot‑блока в `.sql`‑файле (обычно в директории `snapshots` или любой другой).

В таблице ниже перечислены конфигурации, доступные для снапшотов:

<VersionBlock firstVersion="1.9">

| Config | Описание | Обязательно? | Пример |
| ------ | -------- | ------------ | ------ |
| [database](/reference/resource-configs/database) | Указать пользовательскую базу данных для снапшота | Нет | analytics |
| [schema](/reference/resource-configs/schema) | Указать пользовательскую схему для снапшота | Нет | snapshots |
| [strategy](/reference/resource-configs/strategy) | Стратегия снапшота: `timestamp` или `check` | Да | timestamp |
| [unique_key](/reference/resource-configs/unique_key) | Колонка или выражение <Term id="primary-key" />, идентифицирующее запись | Да | id |
| [check_cols](/reference/resource-configs/check_cols) | Колонки для проверки при использовании стратегии `check` | Только при стратегии `check` | ["status"] |
| [updated_at](/reference/resource-configs/updated_at) | Колонка с временной меткой при использовании стратегии `timestamp` | Только при стратегии `timestamp` | updated_at |
| [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) | Находить физически удалённые записи в источнике и устанавливать `dbt_valid_to` в текущее время, если запись больше не существует | Нет | True |

- Также поддерживается ряд других конфигураций (например, `tags` и `post-hook`) — полный список смотрите [здесь](/reference/snapshot-configs).
- Снапшоты можно настраивать как через файл `dbt_project.yml`, так и через `config`‑блок — подробнее см. [документацию по конфигурации](/reference/snapshot-configs).
- Примечание: пользователи BigQuery могут использовать `target_project` и `target_dataset` как алиасы для `target_database` и `target_schema` соответственно.
- До версии v1.9 параметры `target_schema` (обязательный) и `target_database` (необязательный) задавали фиксированную схему или базу данных для снапшотов, что затрудняло разделение dev‑ и prod‑окружений. Начиная с v1.9 `target_schema` стал необязательным, что позволило использовать снапшоты с учётом окружения. По умолчанию снапшоты теперь используют `generate_schema_name` или `generate_database_name`, однако разработчики по‑прежнему могут указать пользовательское расположение с помощью [schema](/reference/resource-configs/schema) и [database](/reference/resource-configs/database), аналогично другим типам ресурсов.

</VersionBlock>

## Добавление снапшота в проект {#add-snapshot-to-a-project}

Чтобы добавить снапшот в проект:

1. Создайте файл в директории `snapshots` с расширением `.sql`. Например, `snapshots/orders.sql`.
2. Используйте блок `snapshot`, чтобы определить начало и конец снапшота:

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{% endsnapshot %}
```

</File>

3. Напишите `select`‑запрос внутри snapshot‑блока. Этот запрос определяет результат, который вы хотите отслеживать во времени. Здесь можно использовать `sources` или `refs`.

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>

4. Проверьте, содержит ли результат запроса надёжную колонку с временной меткой, указывающую, когда запись была обновлена в последний раз. В нашем примере колонка `updated_at` надёжно отражает изменения, поэтому можно использовать стратегию `timestamp`. Если такой колонки нет, потребуется использовать стратегию `check`.

5. Добавьте конфигурации к снапшоту с помощью `config`‑блока. Также вы можете [настроить снапшот через файл `dbt_project.yml`](/reference/snapshot-configs).

<VersionBlock firstVersion="1.9">

<File name='snapshots/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}

{{
    config(
      database='analytics',
      schema='snapshots',
      unique_key='id',

      strategy='timestamp',
      updated_at='updated_at',
    )
The following table outlines the configurations available for snapshots:

select * from {{ source('jaffle_shop', 'orders') }}

{% endsnapshot %}
```

</File>
</VersionBlock>

6. Запустите [команду](/reference/commands/snapshot) `dbt snapshot`. В нашем примере будет создана новая таблица `analytics.snapshots.orders_snapshot`. Изменяя конфигурации `target_database`, `target_schema` и имя снапшота (заданное в `{% snapshot .. %}`), вы управляете тем, как dbt именует эту таблицу.

```dbt snapshot
Running with dbt=1.8.0

15:07:36 | Concurrency: 8 threads (target='dev')
15:07:36 |
15:07:36 | 1 of 1 START snapshot snapshots.orders_snapshot...... [RUN]
15:07:36 | 1 of 1 OK snapshot snapshots.orders_snapshot..........[SELECT 3 in 1.82s]
15:07:36 |
15:07:36 | Finished running 1 snapshots in 0.68s.

Completed successfully

Done. PASS=2 ERROR=0 SKIP=0 TOTAL=1
```

7. Проверьте результаты, выполнив `select` из таблицы, созданной dbt. После первого запуска вы увидите результат запроса, а также [метаполя снапшота](/docs/build/snapshots#snapshot-meta-fields).
8. Запустите `dbt snapshot` ещё раз и снова проверьте результаты. Если какие‑либо записи были обновлены, снапшот должен это отразить.
9. Используйте снапшот в downstream‑моделях с помощью функции `ref`.

<File name='models/changed_orders.sql'>

```sql
select * from {{ ref('orders_snapshot') }}
```

</File>

10. Снапшоты полезны только при регулярном запуске — настройте выполнение команды `snapshot` по расписанию.

## Примеры {#examples-1}

В этом разделе приведены примеры применения конфигураций к снапшотам с использованием устаревшего метода.

<Expandable alt_header="Применение конфигураций только к одному снапшоту">

Используйте `config`‑блоки, если нужно применить конфигурацию только к одному снапшоту.

<File name='snapshots/postgres_app/orders_snapshot.sql'>

```sql
{% snapshot orders_snapshot %}
    {{
        config(
          unique_key='id',
          strategy='timestamp',
          updated_at='updated_at'
        )
    }}
    -- Pro-Tip: Use sources in snapshots!
    select * from {{ source('jaffle_shop', 'orders') }}
{% endsnapshot %}
```
</File>
</Expandable>

<Expandable alt_header="Использование параметра updated_at">

Параметр `updated_at` обязателен при использовании стратегии timestamp. Это колонка в результате запроса снапшота, которая указывает, когда запись была обновлена в последний раз.

<File name='snapshots/orders.sql'>

```sql
{{ config(
  strategy="timestamp",
  updated_at="column_name"
) }}
```
</File>

#### Примеры {#examples-2}

- #### Использование колонки `updated_at`:

  <VersionBlock firstVersion="1.9">
  <File name='snapshots/orders.sql'>

  ```sql
  {% snapshot orders_snapshot %}

  {{
      config(
        schema='snapshots',
        unique_key='id',

        strategy='timestamp',
        updated_at='updated_at'
      )
  }}

  select * from {{ source('jaffle_shop', 'orders') }}

  {% endsnapshot %}
  ```
  </File>
  </VersionBlock>

- #### Объединение двух колонок для создания надёжного `updated_at`:

  Рассмотрим источник данных, в котором колонка `updated_at` заполняется только при обновлении записи (то есть значение `null` означает, что запись не обновлялась после создания).

  Поскольку параметр `updated_at` принимает только имя колонки, а не выражение, необходимо изменить запрос снапшота, добавив колонку с объединённым значением.

  <VersionBlock firstVersion="1.9">
  <File name='snapshots/orders.sql'>

  ```sql
  {% snapshot orders_snapshot %}

  {{
      config(
        schema='snapshots',
        unique_key='id',

        strategy='timestamp',
        updated_at='updated_at_for_snapshot'
      )
  }}

  select
      *,
      coalesce(updated_at, created_at) as updated_at_for_snapshot

  from {{ source('jaffle_shop', 'orders') }}

  {% endsnapshot %}
  ```
  </File>
  </VersionBlock>

</Expandable>

<Expandable alt_header="Использование параметра unique_key">

Параметр `unique_key` — это имя колонки или выражение, уникальное для входных данных снапшота. dbt использует [`unique_key`](/reference/resource-configs/unique_key) для сопоставления записей между текущим результатом и существующим снапшотом, чтобы корректно фиксировать изменения.

<File name='snapshots/orders.sql'>

```sql
{{ config(
  unique_key="column_name"
) }}
```
</File>

#### Примеры {#examples-3}

- Использование колонки `id` в качестве уникального ключа

  <File name='snapshots/orders.sql'>

  ```sql
  {{
      config(
        unique_key="id"
      )
  }}
  ```
  </File>

  Это также можно задать в YAML. Это может быть удобно, если несколько снапшотов используют один и тот же `unique_key` (хотя мы предпочитаем задавать эту конфигурацию в `config`‑блоке, как показано выше).

- #### Использование комбинации двух колонок в качестве уникального ключа

  Эта конфигурация принимает допустимое колонковое выражение. Поэтому при необходимости можно объединить две колонки в один уникальный ключ. Рекомендуется использовать разделитель (например, `'-'`), чтобы обеспечить уникальность.

  <File name='snapshots/transaction_items_snapshot.sql'>

  ```sql
  {% snapshot transaction_items_snapshot %}

      {{
          config(
            unique_key="transaction_id||'-'||line_item_id",
            ...
          )
      }}

  select
      transaction_id||'-'||line_item_id as id,
      *
  from {{ source('erp', 'transactions') }}

  {% endsnapshot %}
  ```

  </File>

  Однако, как правило, лучше сформировать эту колонку непосредственно в запросе и использовать её как `unique_key`:

  <File name='snapshots/transaction_items_snapshot.sql'>

  ```sql
  {% snapshot transaction_items_snapshot %}

      {{
          config(
            unique_key="id",
            ...
          )
      }}

  select
      transaction_id || '-' || line_item_id as id,
      *
  from {{ source('erp', 'transactions') }}

  {% endsnapshot %}
  ```
  </File>
</Expandable>
