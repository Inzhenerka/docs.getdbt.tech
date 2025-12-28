---
title: Конфигурации источников
description: "Узнайте, как использовать конфигурации источников в dbt."
id: source-configs
---

import ConfigGeneral from '/snippets/_config-description-general.md';

## Доступные конфигурации

<VersionBlock firstVersion="1.9">

Конфигурации источников поддерживают [`enabled`](/reference/resource-configs/enabled), [`event_time`](/reference/resource-configs/event-time) и [`meta`](/reference/resource-configs/meta)

</VersionBlock>

### Общие конфигурации

<ConfigGeneral />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Project YAML file', value: 'project-yaml', },
    { label: 'Properties YAML file', value: 'property-yaml', },
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
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-properties/freshness):
      warn_after:  
        count: <positive_integer>
        period: minute | hour | day
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

sources:
  - name: [<source-name>]
    [database](/reference/resource-properties/database): <database-name>
    [schema](/reference/resource-properties/schema): <schema-name>
    [config](/reference/resource-properties/config):
      [enabled](/reference/resource-configs/enabled): true | false
      [event_time](/reference/resource-configs/event-time): my_time_field
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [freshness](/reference/resource-properties/freshness):
        warn_after:  
          count: <positive_integer>
          period: minute | hour | day

    tables:
      - name: [<source-table-name>]
        [config](/reference/resource-properties/config):
          [enabled](/reference/resource-configs/enabled): true | false
          [event_time](/reference/resource-configs/event-time): my_time_field
          [meta](/reference/resource-configs/meta): {<dictionary>}

```
</VersionBlock>

</File>

</TabItem>

</Tabs>

## Настройка источников

Источники можно настраивать с помощью блока `config:` в их `.yml`-определениях или через файл `dbt_project.yml` в секции `sources:`. Такая конфигурация особенно полезна для настройки источников, импортированных из [пакета](/docs/build/packages).

Вы можете отключать источники, импортированные из пакета, чтобы они не отображались в документации или чтобы для таблиц источников, импортированных из пакетов, не запускались [проверки свежести источников](/docs/build/sources#source-data-freshness).

- **Примечание**: Чтобы отключить таблицу источника, вложенную в properties YAML-файл в подкаталоге, необходимо указать путь к этому properties YAML-файлу с учетом подкаталогов, а также имя источника и имя таблицы в проектном YAML-файле (`dbt_project.yml`).<br /><br />
  В следующем примере показано, как отключить таблицу источника, вложенную в properties YAML-файл в подкаталоге:

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
  </File>


### Примеры

В следующих примерах показано, как настраивать источники в вашем dbt‑проекте.

&mdash; [Отключить все источники, импортированные из пакета](#disable-all-sources-imported-from-a-package) <br />
&mdash; [Условно включить один источник](#conditionally-enable-a-single-source) <br />
&mdash; [Отключить один источник из пакета](#disable-a-single-source-from-a-package) <br />
&mdash; [Настроить источник с `event_time`](#configure-a-source-with-an-event_time) <br />
&mdash; [Настроить meta для источника](#configure-meta-to-a-source) <br />
&mdash; [Настроить свежесть источника](#configure-source-freshness) <br />

#### Отключить все источники, импортированные из пакета
Чтобы применить конфигурацию ко всем источникам, подключенным из [пакета](/docs/build/packages),
укажите эту конфигурацию под [именем проекта](/reference/project-configs/name.md) в секции
`sources:` как часть пути к ресурсу.

<File name='dbt_project.yml'>

```yml
sources:
  events:
    +enabled: false
```

</File>


#### Условно включить один источник

При определении источника вы можете отключить весь источник или отдельные таблицы источника, используя встроенное свойство `config`. Также можно указать `database` и `schema`, чтобы переопределить целевую базу данных и схему:

<File name='models/sources.yml'>

```yml

sources:
  - name: my_source
    database: raw
    schema: my_schema
    config:
      enabled: true
    tables:
      - name: my_source_table  # enabled
      - name: ignore_this_one  # not enabled
        config:
          enabled: false
```

</File>

Вы также можете настраивать отдельные таблицы источников и использовать [переменные](/reference/dbt-jinja-functions/var) в качестве входных значений для этих конфигураций:
 
<File name='models/sources.yml'>

```yml

sources:
  - name: my_source
    tables:
      - name: my_source_table
        config:
          enabled: "{{ var('my_source_table_enabled', false) }}"
```

</File>

#### Отключить один источник из пакета

Чтобы отключить конкретный источник из другого пакета, укажите путь к ресурсу в конфигурации, включив в него имя пакета и имя источника. В этом примере мы отключаем источник `clickstream` из пакета `events`.

<File name='dbt_project.yml'>

```yml
sources:
  events:
    clickstream:
      +enabled: false
```

</File>

Аналогично, вы можете отключить конкретную таблицу источника, указав путь к ресурсу с именем пакета, именем источника и именем таблицы:

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

<VersionBlock firstVersion="1.9">

Чтобы настроить источник с `event_time`, укажите поле `event_time` в конфигурации источника. Это поле используется для представления фактического временного момента события, а не, например, даты загрузки данных.

Например, если у вас есть таблица источника `clickstream` в источнике `events`, вы можете использовать временную метку каждого события из колонки `event_timestamp` следующим образом:

<File name='dbt_project.yml'>

```yaml
sources:
  events:
    clickstream:
      +event_time: event_timestamp
```
</File>

В этом примере `event_time` установлен в `event_timestamp`, который содержит точное время, когда произошло каждое событие clickstream.
Это требуется не только для [инкрементальной стратегии microbatching](/docs/build/incremental-microbatch), но и при сравнении данных между окружениями [CI и production](/docs/deploy/advanced-ci#speeding-up-comparisons): dbt будет использовать `event_timestamp` для фильтрации и сопоставления данных по этому событийно-ориентированному временному интервалу, гарантируя, что сравниваются только пересекающиеся временные диапазоны.

</VersionBlock>

#### Настроить meta для источника

Используйте поле `meta` для назначения метаданных источникам. Это полезно для хранения дополнительного контекста, документации, логирования и других целей.

Например, вы можете добавить `meta`‑информацию к источнику `clickstream`, чтобы указать сведения о системе-источнике данных:

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

#### Настроить свежесть источника

Используйте блок `freshness`, чтобы задать ожидания по тому, как часто таблица обновляется новыми данными, и чтобы генерировать предупреждения и ошибки, если эти ожидания не выполняются.

dbt сравнивает наиболее свежую временную метку обновления, рассчитанную на основе колонки, метаданных хранилища или пользовательского запроса, с текущим временем в момент запуска проверки свежести.

Вы можете указать один или оба параметра `warn_after` и `error_after`. Если ни один из них не задан, dbt не будет рассчитывать снимки свежести для таблиц в этом источнике. Подробнее см. в разделе [freshness](/reference/resource-properties/freshness).

Ниже приведен пример файла `dbt_project.yml`, использующего конфигурацию `freshness`:

<File name="dbt_project.yml">
  
```yml
sources:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[freshness](/reference/resource-properties/freshness):
      warn_after:  
        count: 4
        period: hour
```

</File>

## Пример конфигурации источника

Ниже приведен корректный пример конфигурации источников для проекта со следующими характеристиками:
* `name: jaffle_shop`
* Пакет `events`, содержащий несколько таблиц источников


<File name='dbt_project.yml'>

```yml
name: jaffle_shop
config-version: 2
...
sources:
  # project names
  jaffle_shop:
    +enabled: true

  events:
    # source names
    clickstream:
      # table names
      pageviews:
        +enabled: false
      link_clicks:
        +enabled: true
```

</File>
