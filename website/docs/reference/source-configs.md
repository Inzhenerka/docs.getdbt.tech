---
title: Конфигурации источников
description: "Узнайте, как использовать конфигурации источников в dbt."
id: source-configs
---

import ConfigGeneral from '/snippets/_config-description-general.md';

## Доступные конфигурации

<VersionBlock lastVersion="1.8">

Источники поддерживают [`enabled`](/reference/resource-configs/enabled) и [`meta`](/reference/resource-configs/meta).

</VersionBlock>

<VersionBlock firstVersion="1.9">

Конфигурации источников поддерживают [`enabled`](/reference/resource-configs/enabled), [`event_time`](/reference/resource-configs/event-time) и [`meta`](/reference/resource-configs/meta)

</VersionBlock>

### Общие конфигурации

<ConfigGeneral />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
  ]
}>

<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[event_time](/reference/resource-configs/event-time): my_time_field
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta):
      key: value

```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta):
      key: value
```
</VersionBlock>

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='models/properties.yml'>

<VersionBlock firstVersion="1.9">

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      [enabled](/reference/resource-configs/enabled): true | false
      [event_time](/reference/resource-configs/event-time): my_time_field
      [meta](/reference/resource-configs/meta): {<dictionary>}

    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          [enabled](/reference/resource-configs/enabled): true | false
          [event_time](/reference/resource-configs/event-time): my_time_field
          [meta](/reference/resource-configs/meta): {<dictionary>}

```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
version: 2

sources:
  - name: [<source-name>]
    [config](/reference/resource-properties/config):
      [enabled](/reference/resource-configs/enabled): true | false
      [meta](/reference/resource-configs/meta): {<dictionary>}
    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          [enabled](/reference/resource-configs/enabled): true | false
          [meta](/reference/resource-configs/meta): {<dictionary>}

```
</VersionBlock>

</File>

</TabItem>

</Tabs>

## Конфигурирование источников

Источники могут быть настроены через блок `config:` в их определениях `.yml`, или из файла `dbt_project.yml` под ключом `sources:`. Эта конфигурация наиболее полезна для настройки источников, импортированных из [пакета](/docs/build/packages).

Вы можете отключить источники, импортированные из пакета, чтобы предотвратить их отображение в документации или чтобы предотвратить выполнение [проверок свежести источников](/docs/build/sources#source-data-freshness) для таблиц источников, импортированных из пакетов.

- **Примечание**: Чтобы отключить таблицу источника, вложенную в YAML-файл в подпапке, вам нужно будет указать подпапку(ы) в пути к этому YAML-файлу, а также имя источника и имя таблицы в файле `dbt_project.yml`.<br /><br />
  Следующий пример показывает, как отключить таблицу источника, вложенную в YAML-файл в подпапке:

  <File name='dbt_project.yml'>

  <VersionBlock firstVersion="1.9">

  ```yaml
  sources:
    your_project_name:
      subdirectory_name:
        source_name:
          source_table_name:
            +enabled: false
            +event_time: my_time_field
  ```

  </VersionBlock>

  <VersionBlock lastVersion="1.8">
    ```yaml
  sources:
    your_project_name:
      subdirectory_name:
        source_name:
          source_table_name:
            +enabled: false
  ```
  </VersionBlock>
  </File>


### Примеры

Следующие примеры показывают, как настроить источники в вашем проекте dbt.

&mdash; [Отключить все источники, импортированные из пакета](#disable-all-sources-imported-from-a-package) <br />
&mdash; [Условно включить один источник](#conditionally-enable-a-single-source) <br />
&mdash; [Отключить один источник из пакета](#disable-a-single-source-from-a-package) <br />
&mdash; [Настроить источник с `event_time`](#configure-a-source-with-an-event_time) <br />
&mdash; [Настроить метаданные для источника](#configure-meta-to-a-source) <br />

#### Отключить все источники, импортированные из пакета
Чтобы применить конфигурацию ко всем источникам, включенным из [пакета](/docs/build/packages),
укажите вашу конфигурацию под [именем проекта](/reference/project-configs/name.md) в
конфигурации `sources:` как часть пути ресурса.

<File name='dbt_project.yml'>

```yml
sources:
  events:
    +enabled: false
```

</File>


#### Условно включить один источник

При определении источника вы можете отключить весь источник или конкретные таблицы источников, используя встроенное свойство `config`:

<File name='models/sources.yml'>

```yml
version: 2

sources:
  - name: my_source
    config:
      enabled: true
    tables:
      - name: my_source_table  # включен
      - name: ignore_this_one  # не включен
        config:
          enabled: false
```

</File>

Вы можете настроить конкретные таблицы источников и использовать [переменные](/reference/dbt-jinja-functions/var) в качестве входных данных для этой конфигурации:

<File name='models/sources.yml'>

```yml
version: 2

sources:
  - name: my_source
    tables:
      - name: my_source_table
        config:
          enabled: "{{ var('my_source_table_enabled', false) }}"
```

</File>

#### Отключить один источник из пакета

Чтобы отключить конкретный источник из другого пакета, уточните путь ресурса для вашей конфигурации, указав как имя пакета, так и имя источника. В этом случае мы отключаем источник `clickstream` из пакета `events`.

<File name='dbt_project.yml'>

```yml
sources:
  events:
    clickstream:
      +enabled: false
```

</File>

Аналогично, вы можете отключить конкретную таблицу из источника, уточнив путь ресурса с именем пакета, именем источника и именем таблицы:

<File name='dbt_project.yml'>

```yml
sources:
  events:
    clickstream:
      pageviews:
        +enabled: false
```

</File>


#### Настроить источник с `event_time`

<VersionBlock lastVersion="1.8">

Настройка [`event_time`](/reference/resource-configs/event-time) для источника доступна только в [последнем релизе dbt Cloud "Latest"](/docs/dbt-versions/cloud-release-tracks) или в версиях dbt Core 1.9 и выше.

</VersionBlock>

<VersionBlock firstVersion="1.9">

Чтобы настроить источник с `event_time`, укажите поле `event_time` в конфигурации источника. Это поле используется для представления фактической метки времени события, а не, например, даты загрузки.

Например, если у вас есть таблица источника с названием `clickstream` в источнике `events`, вы можете использовать метку времени для каждого события в столбце `event_timestamp` следующим образом:

<File name='dbt_project.yml'>

```yaml
sources:
  events:
    clickstream:
      +event_time: event_timestamp
```
</File>

В этом примере `event_time` установлен на `event_timestamp`, который содержит точное время, когда произошло каждое событие clickstream.
Это не только требуется для [стратегии инкрементной микропартии](/docs/build/incremental-microbatch), но и при сравнении данных между [CI и производственными](/docs/deploy/advanced-ci#speeding-up-comparisons) окружениями dbt будет использовать `event_timestamp` для фильтрации и сопоставления данных по этому временным интервалам, основанным на событиях, что гарантирует, что сравниваются только перекрывающиеся временные интервалы.

</VersionBlock>

#### Настроить метаданные для источника

Используйте поле `meta`, чтобы назначить метаданные источникам. Это полезно для отслеживания дополнительного контекста, документации, ведения журналов и многого другого.

Например, вы можете добавить информацию `meta` к источнику `clickstream`, чтобы включить информацию о системе источника данных:

<File name='dbt_project.yml'>

```yaml
sources:
  events:
    clickstream:
      +meta:
        source_system: "Google analytics"
        data_owner: "marketing_team"
```
</File>

## Пример конфигурации источника
Следующая конфигурация источника является действительной для проекта с:
* `name: jaffle_shop`
* Пакетом с названием `events`, содержащим несколько таблиц источников

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
config-version: 2
...
sources:
  # имена проектов
  jaffle_shop:
    +enabled: true

  events:
    # имена источников
    clickstream:
      # имена таблиц
      pageviews:
        +enabled: false
      link_clicks:
        +enabled: true
```

</File>