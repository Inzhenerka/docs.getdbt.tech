---
title: Конфигурации seed
description: "Прочитайте это руководство, чтобы узнать о использовании конфигураций seed в dbt."
meta:
  resource_type: Seeds
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';

## Доступные конфигурации
### Конфигурации, специфичные для seed

<ConfigResource meta={frontMatter.meta} />

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

```yml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[quote_columns](/reference/resource-configs/quote_columns): true | false
    [+](/reference/resource-configs/plus-prefix)[column_types](/reference/resource-configs/column_types): {column_name: datatype}
    [+](/reference/resource-configs/plus-prefix)[delimiter](/reference/resource-configs/delimiter): <string>

```

</File>

</TabItem>

<TabItem value="property-yaml">

<File name='seeds/properties.yml'>

```yaml
version: 2

seeds:
  - name: [<seed-name>]
    config:
      [quote_columns](/reference/resource-configs/quote_columns): true | false
      [column_types](/reference/resource-configs/column_types): {column_name: datatype}
      [delimiter](/reference/resource-configs/grants): <string>

```

</File>

</TabItem>

</Tabs>

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

<VersionBlock lastVersion="1.8">

```yaml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): <dict>
    [+](/reference/resource-configs/plus-prefix)[full_refresh](/reference/resource-configs/full_refresh): <boolean>
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dictionary>}

```
</VersionBlock>

<VersionBlock firstVersion="1.9">

```yaml
seeds:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[pre-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[post-hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[persist_docs](/reference/resource-configs/persist_docs): <dict>
    [+](/reference/resource-configs/plus-prefix)[full_refresh](/reference/resource-configs/full_refresh): <boolean>
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[grants](/reference/resource-configs/grants): {<dictionary>}
    [+](/reference/resource-configs/plus-prefix)[event_time](/reference/resource-configs/event-time): my_time_field

```
</VersionBlock>
</File>

</TabItem>

<TabItem value="property-yaml">

<File name='seeds/properties.yml'>

<VersionBlock firstVersion="1.9">

```yaml
version: 2

seeds:
  - name: [<seed-name>]
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [persist_docs](/reference/resource-configs/persist_docs): <dict>
      [full_refresh](/reference/resource-configs/full_refresh): <boolean>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
      [event_time](/reference/resource-configs/event-time): my_time_field

```
</VersionBlock>

<VersionBlock lastVersion="1.8">

```yaml
version: 2

seeds:
  - name: [<seed-name>]
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [pre_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [post_hook](/reference/resource-configs/pre-hook-post-hook): <sql-statement> | [<sql-statement>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [persist_docs](/reference/resource-configs/persist_docs): <dict>
      [full_refresh](/reference/resource-configs/full_refresh): <boolean>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [grants](/reference/resource-configs/grants): {<dictionary>}
```

</VersionBlock>
</File>

</TabItem>
</Tabs>

## Конфигурирование seed
Seed можно настраивать только из YAML файлов, либо в `dbt_project.yml`, либо в YAML свойствах отдельного seed. Невозможно настроить seed из его CSV файла.

Конфигурации seed, как и конфигурации моделей, применяются иерархически — конфигурации, примененные к подкаталогу `marketing`, будут иметь приоритет над конфигурациями, примененными ко всему проекту `jaffle_shop`, а конфигурации, определенные в свойствах конкретного seed, переопределят конфигурации, определенные в `dbt_project.yml`.

### Примеры
#### Применение конфигурации `schema` ко всем seed
Чтобы применить конфигурацию ко всем seed, включая те, что находятся в любых установленных [пакетах](/docs/build/packages), вложите конфигурацию непосредственно под ключом `seeds`:

<File name='dbt_project.yml'>

```yml

seeds:
  +schema: seed_data
```

</File>

#### Применение конфигурации `schema` ко всем seed в вашем проекте
Чтобы применить конфигурацию ко всем seed только в вашем проекте (т.е. _исключая_ любые seed в установленных пакетах), укажите ваше [имя проекта](/reference/project-configs/name.md) как часть пути ресурса.

Для проекта с именем `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

seeds:
  jaffle_shop:
    +schema: seed_data
```

</File>

Аналогично, вы можете использовать имя установленного пакета для настройки seed в этом пакете.

#### Применение конфигурации `schema` только к одному seed
Чтобы применить конфигурацию только к одному seed, укажите полный путь ресурса (включая имя проекта и подкаталоги).

<File name='seeds/marketing/properties.yml'>

```yml
version: 2

seeds:
  - name: utm_parameters
    config:
      schema: seed_data
```

</File>

В более ранних версиях dbt вам необходимо было определять конфигурации в `dbt_project.yml` и включать полный путь ресурса (включая имя проекта и подкаталоги). Для проекта с именем `jaffle_shop`, с файлом seed по адресу `seeds/marketing/utm_parameters.csv`, это выглядело бы так:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    marketing:
      utm_parameters:
        +schema: seed_data
```

</File>

## Пример конфигурации seed
Следующая конфигурация seed является действительной для проекта с:
* `name: jaffle_shop`
* Файлом seed по адресу `seeds/country_codes.csv`, и
* Файлом seed по адресу `seeds/marketing/utm_parameters.csv`

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
...
seeds:
  jaffle_shop:
    +enabled: true
    +schema: seed_data
    # Это настраивает seeds/country_codes.csv
    country_codes:
      # Переопределить типы столбцов
      +column_types:
        country_code: varchar(2)
        country_name: varchar(32)
    marketing:
      +schema: marketing # это будет иметь приоритет
```

</File>