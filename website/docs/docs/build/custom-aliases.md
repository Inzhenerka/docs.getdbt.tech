---
title: "Пользовательские алиасы"
description: "Настройка пользовательских алиасов для переопределения стандартных соглашений об именовании моделей и других ресурсов в dbt."
id: "custom-aliases"
---

## Обзор {#overview}

Когда dbt выполняет модель, он обычно создает отношение (либо <Term id="table" />, либо <Term id="view" />) в базе данных, за исключением случая [эфемерной модели](/docs/build/materializations), когда он создаст <Term id="cte" /> для использования в другой модели. По умолчанию dbt использует имя файла модели в качестве идентификатора для создаваемого отношения или CTE. Этот идентификатор можно переопределить, используя конфигурацию модели [`alias`](/reference/resource-configs/alias).

### Зачем использовать псевдонимы для имен моделей? {#why-alias-model-names}
Имена схем и таблиц фактически являются "пользовательским интерфейсом" вашего <Term id="data-warehouse" />. Хорошо названные схемы и таблицы могут помочь обеспечить ясность и направление для потребителей этих данных. В сочетании с [пользовательскими схемами](/docs/build/custom-schemas) псевдонимы моделей являются мощным механизмом для проектирования вашего хранилища данных.

Схема именования файлов, которую вы используете для организации своих моделей, также может конфликтовать с требованиями вашей платформы данных к идентификаторам. Например, вы можете захотеть использовать точку (`.`) для пространственного именования ваших файлов, но SQL-диалект вашей платформы данных может интерпретировать точки как разделение между именами схем и таблиц в идентификаторах, или может запретить использование точек в идентификаторах CTE. В таких случаях использование псевдонимов моделей может позволить вам сохранить гибкость в именовании файлов моделей, не нарушая требований к идентификаторам вашей платформы данных.

### Использование {#usage}
Конфигурация `alias` может быть использована для изменения имени идентификатора модели в базе данных. Следующая таблица показывает примеры идентификаторов базы данных для моделей как с указанным `alias`, так и без него, и с различными материализациями.

| Модель | Конфигурация | Тип отношения | Идентификатор базы данных |
| ------ | ------------| --------------| ------------------------- |
| ga_sessions.sql | \{\{ config(materialization='view') \}\} | <Term id="view" /> | "analytics"."ga_sessions" |
| ga_sessions.sql | \{\{ config(materialization='view', alias='sessions') \}\} | <Term id="view" /> | "analytics"."sessions" |
| ga_sessions.sql | \{\{ config(materialization='ephemeral') \}\} | <Term id="cte" /> | "\__dbt\__cte\__ga_sessions" |
| ga_sessions.sql | \{\{ config(materialization='ephemeral', alias='sessions') \}\} | <Term id="cte" /> | "\__dbt\__cte\__sessions" |

Чтобы настроить псевдоним для модели, укажите значение для параметра конфигурации `alias` модели. Например:

<File name='models/google_analytics/ga_sessions.sql'>

```sql

-- Эта модель будет создана в базе данных с идентификатором `sessions`
-- Обратите внимание, что в этом примере `alias` используется вместе с пользовательской схемой
{{ config(alias='sessions', schema='google_analytics') }}

select * from ...
```

</File>

Или в файле `schema.yml`.

<File name='models/google_analytics/schema.yml'>

```yaml
models:
  - name: ga_sessions
    config:
      alias: sessions
```

</File>

При обращении к модели `ga_sessions` из другой модели используйте функцию `ref()` с _именем файла_ модели, как обычно. Например:

<File name='models/combined_sessions.sql'>

```sql

-- Используйте имя файла модели в ref, независимо от любых конфигураций псевдонимов

select * from {{ ref('ga_sessions') }}
union all
select * from {{ ref('snowplow_sessions') }}
```

</File>

### generate_alias_name {#generatealiasname}

Псевдоним, создаваемый для модели, контролируется макросом под названием `generate_alias_name`. Этот макрос можно переопределить в проекте dbt, чтобы изменить способ, которым dbt присваивает псевдонимы моделям. Этот макрос работает аналогично макросу [generate_schema_name](/docs/build/custom-schemas#advanced-custom-schema-configuration).

Чтобы переопределить генерацию псевдонимов в dbt, создайте макрос с именем `generate_alias_name` в вашем проекте dbt. Макрос `generate_alias_name` принимает два аргумента:

1. Пользовательский псевдоним, указанный в конфигурации модели
2. Узел, для которого генерируется пользовательский псевдоним

Стандартная реализация `generate_alias_name` просто использует указанный `alias` (если он присутствует) в качестве псевдонима модели, в противном случае возвращаясь к имени модели. Эта реализация выглядит следующим образом:

<File name='get_custom_alias.sql'>

```jinja2
{% macro generate_alias_name(custom_alias_name=none, node=none) -%}

    {%- if custom_alias_name -%}

        {{ custom_alias_name | trim }}

    {%- elif node.version -%}

        {{ return(node.name ~ "_v" ~ (node.version | replace(".", "_"))) }}

    {%- else -%}

        {{ node.name }}

    {%- endif -%}

{%- endmacro %}

```

</File>

import WhitespaceControl from '/snippets/_whitespace-control.md';

<WhitespaceControl/>

### Макрос Dispatch - управление SQL псевдонимами для баз данных и пакетов dbt {#dispatch-macro-sql-alias-management-for-databases-and-dbt-packages}

См. документацию по макросу `dispatch`: ["Управление различными глобальными переопределениями в пакетах"](/reference/dbt-jinja-functions/dispatch#managing-different-global-overrides-across-packages)

### Предостережения {#caveats}

#### Неоднозначные идентификаторы базы данных {#ambiguous-database-identifiers}

Используя псевдонимы, можно случайно создать модели с неоднозначными идентификаторами. Учитывая следующие две модели, dbt попытается создать два <Term id="view">представления</Term> с _точно_ такими же именами в базе данных (т.е. `sessions`):

<File name='models/snowplow_sessions.sql'>

```sql
{{ config(alias='sessions') }}

select * from ...
```
</File>

<File name='models/sessions.sql'>

```sql
select * from ...
```

</File>

Та из этих моделей, которая будет выполнена второй, "победит", и, как правило, результат работы dbt не будет тем, что вы ожидали. Чтобы избежать этого режима сбоя, dbt проверит, являются ли ваши имена моделей и псевдонимы неоднозначными по своей природе. Если это так, вы получите сообщение об ошибке, подобное этому:

```
$ dbt compile
Encountered an error:
Compilation Error
  dbt нашел два ресурса с представлением базы данных "analytics.sessions".
  dbt не может создать два ресурса с идентичными представлениями базы данных. Чтобы исправить это,
  измените конфигурацию "schema" или "alias" одного из этих ресурсов:
  - model.my_project.snowplow_sessions (models/snowplow_sessions.sql)
  - model.my_project.sessions (models/sessions.sql)
```

Если эти модели действительно должны иметь один и тот же идентификатор базы данных, вы можете обойти эту ошибку, настроив [пользовательскую схему](/docs/build/custom-schemas) для одной из моделей.

#### Версии моделей {#model-versions}

**Связанная документация:**
- [Версии моделей](/docs/mesh/govern/model-versions)
- [`versions`](/reference/resource-properties/versions#alias)

По умолчанию dbt создаёт версионированные модели с алиасом `<model_name>_v<v>`, где `<v>` — это уникальный идентификатор соответствующей версии. Вы можете настроить это поведение так же, как и для неверсированных моделей, задав пользовательский `alias` или переопределив макрос `generate_alias_name`.

## Связанные материалы {#related-docs}

- [Настройка базы данных, схемы и алиаса моделей dbt](/guides/customize-schema-alias?step=1) — о том, как настраивать базу данных, схему и алиас моделей dbt
- [Пользовательские схемы](/docs/build/custom-schemas) — о том, как настраивать схему dbt
- [Пользовательские базы данных](/docs/build/custom-databases) — о том, как настраивать базу данных dbt
