---
title: Конфигурации снимков
description: "Прочтите это руководство, чтобы узнать о конфигурациях снимков в dbt."
meta:
  resource_type: Snapshots
intro_text: "Узнайте об использовании конфигураций снимков в dbt, включая конфигурации, специфичные для снимков, и общие конфигурации."
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';
import CourseCallout from '/snippets/_materialization-video-callout.md';


## Связанная документация {#related-documentation}
* [Снимки](/docs/build/snapshots)
* Команда `dbt snapshot` [command](/reference/commands/snapshot)


<CourseCallout resource="Snapshots" 
url="https://learn.getdbt.com/courses/snapshots"
course="Snapshots"
/>

## Доступные конфигурации {#available-configurations}
### Конфигурации, специфичные для snapshot’ов {#snapshot-specific-configurations}

<ConfigResource meta={frontMatter.meta} />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация SQL-файла', value: 'config-resource', },
  ]
}>

<TabItem value="project-yaml">


<VersionBlock firstVersion="1.9">

<File name='dbt_project.yml'>

```yaml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-configs/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
    [+](/reference/resource-configs/plus-prefix)[strategy](/reference/resource-configs/strategy): timestamp | check
    [+](/reference/resource-configs/plus-prefix)[updated_at](/reference/resource-configs/updated_at): <column_name>
    [+](/reference/resource-configs/plus-prefix)[check_cols](/reference/resource-configs/check_cols): [<column_name>] | all
    [+](/reference/resource-configs/plus-prefix)[snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[dbt_valid_to_current](/reference/resource-configs/dbt_valid_to_current): <string> 
    [+](/reference/resource-configs/plus-prefix)[hard_deletes](/reference/resource-configs/hard-deletes): string
```

</File>

</VersionBlock>

</TabItem>

<TabItem value="property-yaml">

<VersionBlock firstVersion="1.9">
  
Обратитесь к [настройке снимков](/docs/build/snapshots#configuring-snapshots) для доступных конфигураций.

<File name='snapshots/schema.yml'>

```yml
snapshots:
  - name: <string>
    relation: ref() | source()
    config:
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-configs/schema): <string>
      [unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
      [strategy](/reference/resource-configs/strategy): timestamp | check
      [updated_at](/reference/resource-configs/updated_at): <column_name>
      [check_cols](/reference/resource-configs/check_cols): [<column_name>] | all
      [snapshot_meta_column_names](/reference/resource-configs/snapshot_meta_column_names): {<dictionary>}
      [hard_deletes](/reference/resource-configs/hard-deletes): string
      [dbt_valid_to_current](/reference/resource-configs/dbt_valid_to_current): <string>
```
</File>

</VersionBlock>

</TabItem>

<TabItem value="config-resource">

import LegacySnapshotConfig from '/snippets/_legacy-snapshot-config.md';

<LegacySnapshotConfig />

</TabItem>

</Tabs>

### Миграция конфигурации снимков {#snapshot-configuration-migration}

Последние конфигурации снапшотов, представленные в dbt Core v1.9 (такие как [`snapshot_meta_column_names`](/reference/resource-configs/snapshot_meta_column_names), [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current) и `hard_deletes`), лучше всего подходят для новых снапшотов. Однако вы также можете внедрить их в уже существующие снапшоты, аккуратно выполнив миграцию схемы таблицы и конфигураций, чтобы избежать несогласованностей в данных снапшота.

Ниже описан рекомендуемый порядок действий:

1. В вашей платформе данных создайте резервную копию таблицы снапшота. Например, вы можете скопировать её в новую таблицу:

    ```sql
    create table my_snapshot_table_backup as
    select * from my_snapshot_table;
    ```

    Это позволит восстановить снапшот, если во время миграции что-то пойдёт не так.

2. Если вы планируете использовать новые конфигурации, добавьте необходимые колонки в существующую таблицу снапшота с помощью `alter`‑запросов. Ниже приведён пример того, какие колонки нужно добавить при использовании `dbt_valid_to_current` и `snapshot_meta_column_names`:

    ```sql
    alter table my_snapshot_table
    add column dbt_valid_from timestamp,
    add column dbt_valid_to timestamp;
    ```

3. Затем обновите конфигурацию снапшота:

    ```yaml
    snapshots:
      - name: orders_snapshot
        relation: source('something','orders')
        config:
          strategy: timestamp
          updated_at: updated_at
          unique_key: id
          dbt_valid_to_current: "to_date('9999-12-31')"
          snapshot_meta_column_names:
            dbt_valid_from: start_date
            dbt_valid_to: end_date
    ```

4. Перед тем как внедрять сразу несколько новых конфигураций, тестируйте каждое изменение отдельно, запуская `dbt snapshot` в среде разработки или staging.
5. Убедитесь, что выполнение снапшота завершается без ошибок, новые колонки создаются, а логика хранения истории работает так, как вы ожидаете. В результате таблица должна выглядеть примерно так:

    | `id` | `start_date` | `end_date` | `updated_at` |
    | --- | --- | --- | --- | 
    | 1 | 2024-10-01 09:00:00 | 2024-10-03 08:00:00 | 2024-10-01 09:00:00 |
    | 2 | 2024-10-03 08:00:00 | 9999-12-31 00:00:00 | 2024-10-03 08:00:00 |
    | 3 | 2024-10-02 11:15:00 | 9999-12-31 00:00:00 | 2024-10-02 11:15:00 |

   Примечание: колонка `end_date` (заданная через `snapshot_meta_column_names`) использует значение, указанное в `dbt_valid_to_current` (9999-12-31), для новых вставляемых записей вместо значения по умолчанию `NULL`. Для существующих записей значение `end_date` останется `NULL`.

:::warning
Если вы используете одну из последних конфигураций, таких как `dbt_valid_to_current`, без миграции ваших данных, у вас могут быть смешанные старые и новые данные, что приведет к некорректному результату.
:::

### Общие конфигурации {#general-configurations}

<ConfigGeneral />


<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'Файл свойств', value: 'property-yaml', },
    { label: 'Конфигурация в SQL-файле', value: 'config', },
  ]
}>
<TabItem value="project-yaml">

<File name='dbt_project.yml'>

<VersionBlock firstVersion="1.9">


```yaml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): {<dict>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dict>}
    [+](/reference/resource-configs/plus-prefix)[event_time](/reference/resource-configs/event-time): my_time_field
```
</VersionBlock>

</File>

</TabItem>

<TabItem value="property-yaml">

<VersionBlock firstVersion="1.9">

<File name='snapshots/properties.yml'>

```yaml

snapshots:
  - name: [<snapshot-name>]
    relation: source('my_source', 'my_table')
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [alias](/reference/resource-configs/alias): <string>
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [persist_docs](/reference/resource-configs/persist_docs): {<dict>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
      [event_time](/reference/resource-configs/event-time): my_time_field
```

</File>
</VersionBlock>

</TabItem>

<TabItem value="config">

<LegacySnapshotConfig />

</TabItem>

</Tabs>

## Настройка снимков {#configuring-snapshots}
Снимки могут быть настроены несколькими способами:

<VersionBlock firstVersion="1.9">

1. Определяются в YAML-файлах с использованием свойства ресурса `config` ([resource property](/reference/model-properties)), как правило, в вашем [каталоге snapshots](/reference/project-configs/snapshot-paths) или в любой другой папке, которую вы предпочитаете. Доступно в [релизном треке <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks), начиная с dbt v1.9 и выше.
2. Из файла `dbt_project.yml`, в разделе `snapshots:`. Чтобы применить конфигурацию к снапшоту или каталогу со снапшотами, укажите путь к ресурсу в виде вложенных ключей словаря.

</VersionBlock>

Конфигурации снапшотов применяются иерархически в указанном выше порядке, при этом более высокие уровни имеют приоритет. Вы также можете применять [data tests](/reference/snapshot-properties) к снапшотам с помощью свойства [`tests`](/reference/resource-properties/data-tests).

### Примеры {#examples}

<VersionBlock firstVersion="1.9">
Следующие примеры демонстрируют, как настроить снимки с использованием файла `dbt_project.yml` и файла `.yml`.
</VersionBlock>


- #### Применение конфигураций ко всем снимкам
  Чтобы применить конфигурацию ко всем снимкам, включая те, что в установленных [пакетах](/docs/build/packages), вложите конфигурацию непосредственно под ключ `snapshots`:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      +unique_key: id
    ```

    </File>

- #### Применение конфигураций ко всем снимкам в вашем проекте
  Чтобы применить конфигурацию ко всем снимкам только в вашем проекте (например, _исключая_ любые снимки в установленных пакетах), укажите имя вашего проекта как часть пути к ресурсу.

  Для проекта с именем `jaffle_shop`:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      jaffle_shop:
        +unique_key: id
    ```

    </File>

  Аналогично, вы можете использовать имя установленного пакета для настройки снимков в этом пакете.

- #### Применение конфигураций только к одному snapshot

    <VersionBlock firstVersion="1.9">
     <File name='snapshots/postgres_app/order_snapshot.yml'>

    ```yaml
    snapshots:
     - name: orders_snapshot
       relation: source('jaffle_shop', 'orders')
       config:
         unique_key: id
         strategy: timestamp
         updated_at: updated_at
         persist_docs:
           relation: true
           columns: true
    ```
    </File>
   Pro-tip: Используйте источники в снимках: `select * from {{ source('jaffle_shop', 'orders') }}`
    </VersionBlock>

  Вы также можете использовать полный путь к ресурсу (включая имя проекта и подкаталоги) для настройки отдельного снимка из вашего файла `dbt_project.yml`.

  Для проекта с именем `jaffle_shop`, с файлом снимка в каталоге `snapshots/postgres_app/`, где снимок называется `orders_snapshot` (как выше), это будет выглядеть так:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      jaffle_shop:
        postgres_app:
          orders_snapshot:
            +unique_key: id
            +strategy: timestamp
            +updated_at: updated_at
    ```

    </File>

  Вы также можете определить некоторые общие конфигурации в блоке `config` снимка. Однако мы не рекомендуем это для обязательной конфигурации снимка.

    <File name='dbt_project.yml'>

    ```yml

    snapshots:
      - name: orders_snapshot
        +persist_docs:
          relation: true
          columns: true
    ```

    </File>
