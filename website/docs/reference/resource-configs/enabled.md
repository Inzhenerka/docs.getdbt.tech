---
resource_types: all
description: "Включено - Прочтите это подробное руководство, чтобы узнать о конфигурациях в dbt."
datatype: boolean
default_value: true
---

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Tests', value: 'tests', },
    { label: 'Unit tests', value: 'unit tests', },
    { label: 'Sources', value: 'sources', },
    { label: 'Analyses', value: 'analyses', },
    { label: 'Metrics', value: 'metrics', },
    { label: 'Exposures', value: 'exposures', },
    { label: 'Semantic models', value: 'semantic models', },
    { label: 'Saved queries', value: 'saved queries', },
    { label: 'Functions', value: 'functions', },
    { label: 'Skills', value: 'skills', },
  ]
}>
<TabItem value="models">

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
  enabled=true | false
) }}

select ...


```

</File>

</TabItem>


<TabItem value="seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<VersionBlock firstVersion="1.9">

<File name='snapshots/snapshot_name.yml'>

```yaml

snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</VersionBlock>

<File name='snapshots/<filename>.sql'>

```sql
# Configuring in a SQL file is a legacy method and not recommended. Use the property file instead.

{% snapshot [snapshot_name](/reference/resource-configs/snapshot_name) %}

{{ config(
  enabled=true | false
) }}

select ...

{% endsnapshot %}
```
</File>


</TabItem>

<TabItem value="tests">

<File name='dbt_project.yml'>

```yml
data_tests:
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='tests/<filename>.sql'>

```sql
{% test <testname>() %}

{{ config(
  enabled=true | false
) }}

select ...

{% endtest %}

```

</File>

<File name='tests/<filename>.sql'>

```sql
{{ config(
  enabled=true | false
) }}
```

</File>

</TabItem>

<TabItem value="unit tests">

<VersionCallout version="1.8" />

<File name='dbt_project.yml'>

```yml
[unit_tests](/reference/resource-properties/unit-tests):
  [<resource-path>](/reference/resource-configs/resource-path):
    +enabled: true | false

```

</File>

<File name='models/<filename>.yml'>

```yaml
unit_tests:
  - name: [<test-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false

```

</File>

</TabItem>

<TabItem value="sources">

<File name='dbt_project.yml'>

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false

```

</File>


<File name='models/properties.yml'>

```yaml

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          enabled: true | false

```

</File>


</TabItem>

<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yaml
analyses:
  - name: <analysis_name>
    config:
      enabled: true | false
```

</File>

To configure analyses at the project level, set the [`require_corrected_analysis_fqns`](/reference/global-configs/behavior-flags/require_corrected_analysis_fqns) flag to `true` in your `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
flags:
  require_corrected_analysis_fqns: true

analyses:
  +enabled: true | false
```

</File>

</TabItem>

<TabItem value="metrics">

<File name='dbt_project.yml'>

```yaml
metrics:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/metrics.yml'>

```yaml

metrics:
  - name: [<metric-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="exposures">

<File name='dbt_project.yml'>

```yaml
exposures:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/exposures.yml'>

```yaml

exposures:
  - name: [<exposure-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="semantic models">

<File name='dbt_project.yml'>

```yaml
semantic-models:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<VersionBlock lastVersion="1.11">
<File name='models/semantic_models.yml'>

```yaml
semantic_models:
  - name: [<semantic_model_name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.12">
<File name='models/file_name.yml'>

```yaml
models:
  - name: model_name
    semantic_model:
      enabled: true | false # Required under 'semantic_model'
```

</File>
</VersionBlock>

</TabItem>

<TabItem value="saved queries">

<File name='dbt_project.yml'>

```yaml
saved-queries:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='models/semantic_models.yml'>

```yaml
saved_queries:
  - name: [<saved_query_name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="functions">

<File name='dbt_project.yml'>

```yaml
functions:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

<File name='functions/properties.yml'>

```yaml
functions:
  - name: [<function-name>]
    [config](/reference/resource-properties/config):
      enabled: true | false
```

</File>

</TabItem>

<TabItem value="skills">

<VersionBlock firstVersion="2.0">

<File name='dbt_project.yml'>

```yaml
skills:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)enabled: true | false
```

</File>

For [agent skills](/docs/dbt-ai/package-skills), the resource path is the package that ships the skill, followed by the skill's name:

<File name='dbt_project.yml'>

```yaml
skills:
  demo_skills:
    naming-conventions:
      +enabled: false
```

</File>

A package's own `skills` config sets the defaults for the skills it ships, and your root project's `skills` config overrides it. Disabling a skill is how you resolve two packages that ship skills with the same name.

</VersionBlock>

</TabItem>

</Tabs>

## Определение {#definition}

Необязательная конфигурация для включения или отключения ресурса.

* По умолчанию: true

Когда ресурс отключен, dbt не будет учитывать его как часть вашего проекта. Обратите внимание, что это может вызвать ошибки компиляции.

Если вы хотите исключить модель из конкретного запуска, рассмотрите возможность использования параметра `--exclude` как часть [синтаксиса выбора модели](/reference/node-selection/syntax).

Если вы отключаете модели, потому что они больше не используются, но хотите контролировать их версии в SQL, рассмотрите возможность сделать их [анализом](/docs/build/analyses).

## Примеры {#examples}
### Отключение модели в пакете для использования вашей собственной версии модели. {#disable-a-model-in-a-package-in-order-to-use-your-own-version-of-the-model}
Это может быть полезно, если вы хотите изменить логику модели в пакете. Например, если вам нужно изменить логику в `segment_web_page_views` из пакета `segment` ([оригинальная модель](https://github.com/dbt-labs/segment/blob/a8ff2f892b009a69ec36c3061a87e437f0b0ea93/models/base/segment_web_page_views.sql)):
1. Добавьте модель с именем `segment_web_page_views` (то же имя) в ваш собственный проект.
2. Чтобы избежать ошибки компиляции из-за дублирования моделей, отключите версию модели из пакета segment следующим образом:

<File name='dbt_project.yml'>

```yml
models:
  segment:
    base:
      segment_web_page_views:
        +enabled: false
```

</File>

<VersionBlock firstVersion="2.0" >

### Отключение ресурсов Semantic Layer из пакета

Некоторые пакеты могут определять ресурсы <Constant name="semantic_layer" /> (семантические модели, метрики, сохранённые запросы) с использованием устаревшей спецификации, несовместимой с <Constant name="fusion_engine" />. 

Чтобы использовать эти пакеты с <Constant name="fusion" />, сохранив собственные определения семантического слоя, отключите ресурсы семантического слоя пакета в соответствующем YAML-файле.

<File name='dbt_project.yml'>

```yml
# Disable the package's time spine model (if it conflicts with yours)
models:
  ad_reporting:
    semantic_models:
      metricflow_time_spine:
        +enabled: false

# Disable all semantic layer resources from the package
semantic-models:
  ad_reporting:
    +enabled: false

metrics:
  ad_reporting:
    +enabled: false

saved-queries:
  ad_reporting:
    +enabled: false
```

</File>

</VersionBlock>
