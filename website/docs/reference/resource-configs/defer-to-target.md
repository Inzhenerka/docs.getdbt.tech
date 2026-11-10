---
title: defer_to_target
description: "Настройте целевое окружение, на которое dbt State ссылается при отложенном разрешении ссылок в самостоятельно управляемых развертываниях."
id: "defer-to-target"
tags: ['dbt State']
---

# defer_to_target

:::note Только для самостоятельно управляемых развертываний
Эта настройка применяется к самостоятельно управляемым развертываниям dbt. Если вы используете <Constant name="dbt_platform" />, отложенное разрешение ссылок настраивается в параметрах окружения в пользовательском интерфейсе.
:::

`defer_to_target` — часть [dbt State](/docs/deploy/dbt-state-setup), который управляет кешированием моделей и отложенным разрешением ссылок между окружениями.

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    dev:
      type: snowflake
      # ... dev connection settings
    staging:
      type: snowflake
      # ... staging connection settings
    uat:
      type: snowflake
      # ... uat connection settings
      defer_to_target: staging
    prod:
      type: snowflake
      # ... prod connection settings
  target: prod
```

</File>

## Определение

`defer_to_target` указывает, какое целевое окружение dbt State должен использовать при разрешении ссылок на невыбранные вышестоящие узлы и определении необходимости пересборки моделей.

В самостоятельно управляемых развертываниях с несколькими окружениями можно настроить каждое целевое окружение так, чтобы оно ссылалось на другое вышестоящее окружение. Например, окружение `uat` может ссылаться на `staging`, а `prod` — управлять своим состоянием независимо.

## Значение по умолчанию

`prod`. Если параметр не указан, все целевые окружения ссылаются на целевое окружение с именем `prod`. Используйте эту настройку, если хотите ссылаться на другое целевое окружение (например, `staging`) или если ваше производственное целевое окружение называется иначе, чем `prod` (например, `production`).

## Пример

### Цепочка отложенного разрешения ссылок между окружениями

Настройте конвейер, в котором `uat` ссылается на `staging`:

<File name="profiles.yml">

```yaml
my_project:
  outputs:
    dev:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_DEV
    staging:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_STAGING
    uat:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_UAT
      defer_to_target: staging
    prod:
      type: snowflake
      account: abc12345
      database: ANALYTICS
      schema: DBT_PROD
  target: prod
```

</File>

## Особенности работы dbt State без манифеста {#caveats-to-dbt-state-without-a-manifest}

Когда dbt State пытается определить, где была создана производственная версия объекта базы данных, он повторно формирует имена базы данных и схемы, используя целевое окружение, заданное в `defer_to_target`.

Если любое из сформированных имен зависит от динамических данных, изменившихся с момента запуска в производственном окружении, или псевдоним узла зависит от логики, специфичной для целевого окружения, то:

- Предполагаемое расположение может не существовать, что приведет к ненужной пересборке с нуля.
- Предполагаемое расположение может указывать на неверный объект, что приведет к некорректным данным.

Следующие примеры показывают сценарии, которые вызывают проблемы с узлом `orders`. Предположим, что в профиле dev задано `schema: dbt_developer`, а в профиле prod — `schema: analytics`.

### Переменные окружения и переменные CLI

Если имя схемы зависит от переменной окружения или переменной CLI, dbt State может неверно определить расположение, поскольку значения этих переменных различаются при производственных и локальных запусках.

```sql
{% macro generate_schema_name(custom_schema_name, node) %}
    {{ target.schema }}_{{ env_var('DBT_BRANCH', 'main') | replace('/', '_') }}
{% endmacro %}
```

- В производственном окружении запуск выполняется с `DBT_BRANCH=main`, поэтому объект создается в `analytics_main.orders`.
- Когда разработчик выполняет запуск с `DBT_BRANCH=feature/x`, dbt State подставляет в `target.schema` значение из производственного окружения (`analytics`), но считывает `DBT_BRANCH` из оболочки разработчика, получая предполагаемое расположение `analytics_feature_x.orders`.
- Этот объект не существует в производственном окружении, поэтому клонирование не выполняется и узел пересобирается с нуля.

Та же проблема возникает с переменными CLI:

```sql
{% macro generate_schema_name(custom_schema_name, node) %}
    {{ target.schema }}_{{ var('environment', 'dev') }}
{% endmacro %}
```

- В производственном окружении выполняется `dbt run --vars '{environment: prod}'`, поэтому объект создается в `analytics_prod.orders`.
- Когда разработчик выполняет `dbt run` без `--vars`, `var('environment')` возвращает значение по умолчанию (`dev`), поэтому dbt State определяет предполагаемое расположение как `analytics_dev.orders`.
- Этот объект не существует в производственном окружении. Переменные, переданные при исходном запуске в prod, нигде не сохраняются в доступном для dbt State виде.

### Имена на основе пути при перемещении файлов

Распространенный подход — использовать каталог узла для формирования имени его схемы:

```sql
{% macro generate_schema_name(custom_schema_name, node) %}
    {{ target.schema }}_{{ node.fqn[-2] }}
{% endmacro %}
```

- В производственном окружении `models/finance/orders.sql` собирается в `analytics_finance.orders`.
- Если разработчик реорганизует проект и переименует каталог в `models/accounting/`, а затем выполнит `dbt run -s orders`, в его локальном манифесте родительский каталог узла будет указан как `accounting`. Тогда dbt State определит предполагаемое расположение как `analytics_accounting.orders`.
- В производственном окружении объект по-прежнему находится в `analytics_finance.orders`, объект для клонирования не находится, и узел пересобирается с нуля.

### Логика `generate_alias_name`, зависящая от целевого окружения

В отличие от имен базы данных и схемы, dbt State в настоящее время не формирует псевдонимы повторно. Переопределение `generate_alias_name`, результат которого зависит от целевого окружения или окружения выполнения, нарушает определение предполагаемого расположения.

```sql
{% macro generate_alias_name(custom_alias_name=none, node=none) %}
    {%- if custom_alias_name -%}
        {{ custom_alias_name | trim }}_{{ target.name }}
    {%- else -%}
        {{ node.name }}_{{ target.name }}
    {%- endif -%}
{% endmacro %}
```

- При `target.name == 'prod'` в производственном окружении создается `analytics.orders_prod`.
- Когда разработчик выполняет запуск с `target.name == 'dev'`, dbt State заменяет компонент схемы на `analytics`, но оставляет псевдоним без изменений, получая предполагаемое расположение `analytics.orders_dev`.

:::caution
Этот сценарий с наибольшей вероятностью может привести к повреждению данных. Если вы используете собственную логику `generate_alias_name`, предоставьте `manifest.json`, чтобы гарантировать корректные результаты.
:::

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
