---
title: Конфигурации снимков
description: "Прочитайте это руководство, чтобы узнать о использовании конфигураций снимков в dbt."
meta:
  resource_type: Снимки
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';

## Связанная документация
* [Снимки](/docs/build/snapshots)
* Команда `dbt snapshot` [command](/reference/commands/snapshot)

## Доступные конфигурации
### Конфигурации, специфичные для снимков

<ConfigResource meta={frontMatter.meta} />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'YAML файл', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config-resource', },
  ]
}>

<TabItem value="project-yaml">

<VersionBlock lastVersion="1.8">

<File name='dbt_project.yml'>

```yaml
snapshots:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[target_schema](/reference/resource-configs/target_schema): <string>
    [+](/reference/resource-configs/plus-prefix)[target_database](/reference/resource-configs/target_database): <string>
    [+](/reference/resource-configs/plus-prefix)[unique_key](/reference/resource-configs/unique_key): <column_name_or_expression>
    [+](/reference/resource-configs/plus-prefix)[strategy](/reference/resource-configs/strategy): timestamp | check
    [+](/reference/resource-configs/plus-prefix)[updated_at](/reference/resource-configs/updated_at): <column_name>
    [+](/reference/resource-configs/plus-prefix)[check_cols](/reference/resource-configs/check_cols): [<column_name>] | all
    [+](/reference/resource-configs/plus-prefix)[invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) : true | false
```

</File>

</VersionBlock>

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

<VersionBlock lastVersion="1.8">

**Примечание:** Обязательные свойства снимка _не будут_ работать, если они определены только в блоках YAML конфигурации. Мы рекомендуем определять их в `dbt_project.yml` или в блоке `config()` внутри файла снимка `.sql`, или обновить до версии 1.9.

</VersionBlock>

<VersionBlock firstVersion="1.9">
  
Смотрите [конфигурирование снимков](/docs/build/snapshots#configuring-snapshots) для доступных конфигураций.

<File name='snapshots/schema.yml'>

```yml
snapshots:
  - name: <string>
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

<VersionBlock lastVersion="1.8">

```jinja

{{ config(
    [target_schema](/reference/resource-configs/target_schema)="<string>",
    [target_database](/reference/resource-configs/target_database)="<string>",
    [unique_key](/reference/resource-configs/unique_key)="<column_name_or_expression>",
    [strategy](/reference/resource-configs/strategy)="timestamp" | "check",
    [updated_at](/reference/resource-configs/updated_at)="<column_name>",
    [check_cols](/reference/resource-configs/check_cols)=["<column_name>"] | "all"
    [invalidate_hard_deletes](/reference/resource-configs/invalidate_hard_deletes) : true | false
) }}

```
</VersionBlock>

</TabItem>

</Tabs>

### Миграция конфигураций снимков

Последние конфигурации снимков, введенные в dbt Core v1.9 (такие как [`snapshot_meta_column_names`](/reference/resource-configs/snapshot_meta_column_names), [`dbt_valid_to_current`](/reference/resource-configs/dbt_valid_to_current) и `hard_deletes`), лучше всего подходят для новых снимков. Для существующих снимков мы рекомендуем следующее, чтобы избежать любых несоответствий в ваших снимках:

#### Для существующих снимков
- Миграция таблиц — Мигрируйте предыдущий снимок в новую схему таблицы и значения:
  - Создайте резервную копию ваших снимков.
  - Используйте операторы `alter` по мере необходимости (или скрипт для применения операторов `alter`), чтобы обеспечить согласованность таблицы.
- Новые конфигурации — Конвертируйте конфигурации по одной, тестируя по ходу.

:::warning
Если вы используете одну из последних конфигураций, таких как `dbt_valid_to_current`, не мигрируя ваши данные, вы можете получить смешанные старые и новые данные, что приведет к неправильному результату на downstream.
:::

### Общие конфигурации

<ConfigGeneral />

<Tabs
  groupId="config-languages"
  defaultValue="project-yaml"
  values={[
    { label: 'Файл проекта', value: 'project-yaml', },
    { label: 'YAML файл', value: 'property-yaml', },
    { label: 'Блок конфигурации', value: 'config', },
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

<VersionBlock lastVersion="1.8">

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
```
</VersionBlock>
</File>

</TabItem>

<TabItem value="property-yaml">

<VersionBlock lastVersion="1.8">

<File name='snapshots/properties.yml'>

```yaml
version: 2

snapshots:
  - name: [<snapshot-name>]
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [alias](/reference/resource-configs/alias): <string>
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [persist_docs](/reference/resource-configs/persist_docs): {<dict>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.9">

<File name='snapshots/properties.yml'>

```yaml
version: 2

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

<VersionBlock lastVersion="1.8">

```jinja

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

</VersionBlock>

</TabItem>

</Tabs>

## Конфигурирование снимков
Снимки можно конфигурировать несколькими способами:

<VersionBlock firstVersion="1.9">

1. Определены в YAML файлах с использованием свойства `config` [ресурса](/reference/model-properties), обычно в вашем [каталоге снимков](/reference/project-configs/snapshot-paths) (доступно в [релизной ветке dbt Cloud](/docs/dbt-versions/cloud-release-tracks) и dbt v1.9 и выше).
2. Из файла `dbt_project.yml`, под ключом `snapshots:`. Чтобы применить конфигурацию к снимку или каталогу снимков, определите путь к ресурсу в виде вложенных ключей словаря.
</VersionBlock>

<VersionBlock lastVersion="1.8">

1. Определены в YAML файле с использованием свойства `config` [ресурса](/reference/model-properties), обычно в вашем [каталоге снимков](/reference/project-configs/snapshot-paths) (доступно в  [релизной ветке dbt Cloud "Latest"](/docs/dbt-versions/cloud-release-tracks) и dbt v1.9 и выше). Последний синтаксис YAML для снимков обеспечивает более быструю и эффективную работу.
2. С использованием блока `config` внутри снимка, определенного в Jinja SQL.
3. Из файла `dbt_project.yml`, под ключом `snapshots:`. Чтобы применить конфигурацию к снимку или каталогу снимков, определите путь к ресурсу в виде вложенных ключей словаря.

</VersionBlock>

Конфигурации снимков применяются иерархически в указанном выше порядке, при этом более высокие имеют приоритет.

### Примеры

<VersionBlock firstVersion="1.9">
Следующие примеры демонстрируют, как конфигурировать снимки с использованием файла `dbt_project.yml` и файла `.yml`.
</VersionBlock>

<VersionBlock lastVersion="1.8">
Следующие примеры демонстрируют, как конфигурировать снимки с использованием файла `dbt_project.yml`, блока `config` внутри снимка (устаревший метод) и файла `.yml`.
</VersionBlock>

- #### Применение конфигураций ко всем снимкам
  Чтобы применить конфигурацию ко всем снимкам, включая те, которые находятся в любых установленных [пакетах](/docs/build/packages), вложите конфигурацию непосредственно под ключом `snapshots`:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      +unique_key: id
    ```

    </File>

- #### Применение конфигураций ко всем снимкам в вашем проекте
  Чтобы применить конфигурацию только ко всем снимкам в вашем проекте (например, _исключая_ любые снимки в установленных пакетах), укажите имя вашего проекта как часть пути к ресурсу.

  Для проекта с именем `jaffle_shop`:

    <File name='dbt_project.yml'>

    ```yml
    snapshots:
      jaffle_shop:
        +unique_key: id
    ```

    </File>

  Аналогично, вы можете использовать имя установленного пакета для конфигурирования снимков в этом пакете.

- #### Применение конфигураций только к одному снимку
  
  <VersionBlock lastVersion="1.8">
  Используйте блоки `config`, если вам нужно применить конфигурацию только к одному снимку. 

    <File name='snapshots/postgres_app/orders_snapshot.sql'>

    ```sql
    {% snapshot orders_snapshot %}
        {{
            config(
              unique_key='id',
              target_schema='snapshots',
              strategy='timestamp',
              updated_at='updated_at'
            )
        }}
        -- Советы от профессионалов: используйте источники в снимках!
        select * from {{ source('jaffle_shop', 'orders') }}
    {% endsnapshot %}
    ```

    </File>
    </VersionBlock>

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
   Советы от профессионалов: используйте источники в снимках: `select * from {{ source('jaffle_shop', 'orders') }}`
    </VersionBlock>

  Вы также можете использовать полный путь к ресурсу (включая имя проекта и подкаталоги), чтобы настроить отдельный снимок из вашего файла `dbt_project.yml`.

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
    version: 2

    snapshots:
      - name: orders_snapshot
        +persist_docs:
          relation: true
          columns: true
    ```

    </File>
