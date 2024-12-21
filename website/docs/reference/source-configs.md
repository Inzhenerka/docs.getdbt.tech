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

Конфигурации источников поддерживают [`enabled`](/reference/resource-configs/enabled), [`event_time`](/reference/resource-configs/event-time) и [`meta`](/reference/resource-configs/meta).

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

Источники могут быть настроены через блок `config:` в их `.yml` определениях или из файла `dbt_project.yml` под ключом `sources:`. Эта конфигурация наиболее полезна для настройки источников, импортированных из [пакета](/docs/build/packages).

Вы можете отключить источники, импортированные из пакета, чтобы предотвратить их отображение в документации или предотвратить выполнение [проверок свежести данных источника](/docs/build/sources#source-data-freshness) на таблицах источников, импортированных из пакетов.

- **Примечание**: Чтобы отключить таблицу источника, вложенную в YAML-файл в подпапке, вам нужно указать подпапку(и) в пути к этому YAML-файлу, а также имя источника и имя таблицы в файле `dbt_project.yml`.<br /><br />
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

Чтобы применить конфигурацию ко всем источникам, включенным из [пакета](/docs/build/packages), укажите вашу конфигурацию под [именем проекта](/reference/project-configs/name.md) в конфигурации `sources:` как часть пути к ресурсу.

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
      - name: my_source_table  # включено
      - name: ignore_this_one  # не включено
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

Чтобы отключить конкретный источник из другого пакета, укажите путь к ресурсу для вашей конфигурации с именем пакета и именем источника. В этом случае мы отключаем источник `clickstream` из пакета `events`.

<File name='dbt_project.yml'>

```yml
sources:
  events:
    clickstream:
      +enabled: false
```

</File>

Аналогично, вы можете отключить конкретную таблицу из источника, указав путь к ресурсу с именем пакета, именем источника и именем таблицы:

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

Настройка [`event_time`](/reference/resource-configs/event-time) для источника доступна только в [треке "Latest" релизов dbt Cloud](/docs/dbt-versions/cloud-release-tracks) или в версиях dbt Core 1.9 и выше.

</VersionBlock>

<VersionBlock firstVersion="1.9">

Чтобы настроить источник с `event_time`, укажите поле `event_time` в конфигурации источника. Это поле используется для представления фактического времени события, а не, например, даты загрузки.

Например, если у вас есть таблица источника под названием `clickstream` в источнике `events`, вы можете использовать временную метку для каждого события в столбце `event_timestamp` следующим образом:

<File name='dbt_project.yml'>

```yaml
sources:
  events:
    clickstream:
      +event_time: event_timestamp
```
</File>

В этом примере `event_time` установлено в `event_timestamp`, который содержит точное время каждого события clickstream.
Это не только необходимо для [стратегии инкрементального микропакетирования](/docs/build/incremental-microbatch), но и при сравнении данных между [CI и производственными](/docs/deploy/advanced-ci#speeding-up-comparisons) средами dbt будет использовать `event_timestamp` для фильтрации и сопоставления данных по этому временным рамкам на основе событий, обеспечивая сравнение только перекрывающихся временных рамок.

</VersionBlock>

#### Настроить метаданные для источника

Используйте поле `meta` для назначения метаданных источникам. Это полезно для отслеживания дополнительного контекста, документации, логирования и многого другого.

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

Следующая конфигурация источника является допустимой для проекта с:
* `name: jaffle_shop`
* Пакетом под названием `events`, содержащим несколько таблиц источников

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