---
resource_types: [models]
title: "static_analysis"
description: "Используйте конфигурацию static_analysis, чтобы управлять тем, как движок Fusion выполняет статический анализ SQL для моделей."
datatype: string
default_value: on
sidebar_label: "static_analysis"
---

:::info

Конфигурация `static_analysis` доступна **только** в <Constant name="fusion_engine"/>. В <Constant name="core" /> она недоступна и будет проигнорирована. Чтобы перейти на <Constant name="fusion"/>, см. [начало работы <Constant name="fusion"/>](/docs/fusion/get-started-fusion).

:::

<Tabs>

<TabItem value="dbt_project.yml" label="YAML-файл проекта">

<File name='dbt_project.yml'>

```yml
models:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: on | unsafe | off

```

</File>

</TabItem>

<TabItem value="Properties YAML file">

<File name='models/filename.yml'>

```yml
models:
  - name: model_name
    [config](/reference/resource-properties/config):
      static_analysis: on | unsafe | off
```

</File>
</TabItem>

<TabItem value="SQL file config">

<File name='models/model_name.sql'>

```sql
{{ config(static_analysis='on' | 'unsafe' | 'off') }}

select 
  user_id,
  my_cool_udf(ip_address) as cleaned_ip
from {{ ref('my_model') }}
```

</File>

</TabItem>

</Tabs>

## Определение

Вы можете настроить, **будет ли и когда** <Constant name="fusion_engine" /> выполнять статический анализ SQL для модели. Конфигурацию `static_analysis` можно задать в YAML-файле проекта (`dbt_project.yml`), в YAML-файле свойств модели или в SQL-блоке `config` внутри файла модели. Подробнее о том, как <Constant name="fusion_engine" /> рендерит модели, см. [rendering strategies](/docs/fusion/new-concepts#rendering-strategies).

Для `static_analysis` доступны следующие значения:

- `on`: Выполнять статический анализ SQL заранее (AOT, ahead-of-time). Значение по умолчанию для неинтроспективных моделей; зависит от AOT-рендеринга.
- `unsafe`: Выполнять статический анализ SQL непосредственно перед выполнением (JIT, just-in-time). Значение по умолчанию, если модель (или любой из её родителей) использует интроспективные запросы. JIT-анализ по‑прежнему выявляет большинство SQL-ошибок, однако [анализ выполняется](/docs/fusion/new-concepts#static-analysis-and-introspective-queries) после выполнения части вышестоящих шагов.
- `off`: Пропустить SQL-анализ для этой модели и всех её потомков.

Модель **может участвовать** в статическом анализе только в том случае, если все её родительские модели также ему подлежат.

Более подробное обсуждение и визуальные схемы см. на странице концепций Fusion: [New concepts](/docs/fusion/new-concepts). Дополнительную информацию о JSON-схеме см. в файле [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema/blob/1e2c1536fbdd421e49c8b65c51de619e3cd313ff/schemas/latest_fusion/dbt_project-latest-fusion.json#L4689).

## Переопределение в CLI

Вы можете переопределить конфигурацию на уровне модели при запуске, используя следующие CLI-флаги. Например, чтобы отключить статический анализ для одного запуска:

```bash
dbt run --static-analysis off # отключить статический анализ для всех моделей
dbt run --static-analysis unsafe # использовать JIT-анализ для всех моделей
```

См. также: [static analysis CLI flag](/reference/global-configs/static-analysis-flag).

## Примеры

Следующие примеры показывают, как отключить статический анализ для всех моделей в пакете, для одной модели, а также для модели, использующей пользовательскую UDF.

<!-- no toc -->
- [Отключить статический анализ для всех моделей в пакете](#disable-static-analysis-for-all-models-in-a-package)
- [Отключить статический анализ в YAML для одной модели](#disable-static-analysis-in-yaml-for-a-single-model)
- [Отключить статический анализ в SQL для модели, использующей пользовательскую UDF](#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf)  

#### Отключить статический анализ для всех моделей в пакете {#disable-static-analysis-for-all-models-in-a-package}

В этом примере показано, как отключить статический анализ для всех моделей в пакете. [Префикс `+`](/reference/resource-configs/plus-prefix) применяет конфигурацию ко всем моделям в пакете.

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    marts:
      +materialized: table

  a_package_with_introspective_queries:
    +static_analysis: off
```

</File>

#### Отключить статический анализ в YAML для одной модели {#disable-static-analysis-in-yaml-for-a-single-model}

В этом примере показано, как отключить статический анализ для одной модели в YAML.

<File name='models/my_udf_using_model.yml'>

```yml
models:
  - name: model_with_static_analysis_off
    config:
      static_analysis: off
```

</File>

#### Отключить статический анализ в SQL для модели, использующей пользовательскую UDF {#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf}

В этом примере показано, как отключить статический анализ для модели, использующей пользовательскую [user-defined function (UDF)](/docs/build/udfs), в SQL-файле.

<File name='models/my_udf_using_model.sql'>

```sql
{{ config(static_analysis='off') }}

select
  user_id,
  my_cool_udf(ip_address) as cleaned_ip
from {{ ref('my_model') }}
```

</File>

## Соображения

- При отключении статического анализа функции расширения VS Code, зависящие от понимания SQL, будут недоступны.
- В некоторых случаях статический анализ может завершаться неудачей (например, при использовании динамического SQL или нераспознанных UDF) и может потребоваться установка `static_analysis: off`. Дополнительные примеры см. в разделе [Когда следует отключать статический анализ?](/docs/fusion/new-concepts#when-should-i-turn-static-analysis-off).
