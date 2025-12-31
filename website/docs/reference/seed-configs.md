---
title: Конфигурации seed
description: "Прочтите это руководство, чтобы узнать о конфигурациях seed в dbt."
meta:
  resource_type: Seeds
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';


## Доступные конфигурации {#available-configurations}
### Конфигурации, специфичные для seed {#seed-specific-configurations}

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

seeds:
  - name: [<seed-name>]
    config:
      [quote_columns](/reference/resource-configs/quote_columns): true | false
      [column_types](/reference/resource-configs/column_types): {column_name: datatype}
      [delimiter](/reference/resource-configs/delimiter): <string>

```

</File>

</TabItem>

</Tabs>

### Общие конфигурации {#general-configurations}

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

</File>

</TabItem>
</Tabs>

## Конфигурирование seed {#configuring-seeds}
Seed можно настроить только из YAML-файлов, либо в `dbt_project.yml`, либо в YAML-свойствах отдельного seed. Невозможно настроить seed из его CSV-файла.

Конфигурации seed, как и конфигурации моделей, применяются иерархически — конфигурации, примененные к подкаталогу `marketing`, будут иметь приоритет над конфигурациями, примененными ко всему проекту `jaffle_shop`, а конфигурации, определенные в свойствах конкретного seed, будут переопределять конфигурации, определенные в `dbt_project.yml`.

### Примеры {#examples}
#### Применение конфигурации `schema` ко всем seed {#apply-the-schema-configuration-to-all-seeds}
Чтобы применить конфигурацию ко всем seed, включая те, что находятся в установленных [пакетах](/docs/build/packages), вложите конфигурацию непосредственно под ключ `seeds`:

<File name='dbt_project.yml'>

```yml

seeds:
  +schema: seed_data
```

</File>


#### Применение конфигурации `schema` ко всем seed в вашем проекте {#apply-the-schema-configuration-to-all-seeds-in-your-project}
Чтобы применить конфигурацию ко всем seed только в вашем проекте (т.е. _исключая_ любые seed в установленных пакетах), укажите [имя вашего проекта](/reference/project-configs/name.md) как часть пути к ресурсу.

Для проекта с именем `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

seeds:
  jaffle_shop:
    +schema: seed_data
```

</File>

Аналогично, вы можете использовать имя установленного пакета для настройки seed в этом пакете.

#### Применение конфигурации `schema` только к одному seed {#apply-the-schema-configuration-to-one-seed-only}
Чтобы применить конфигурацию только к одному seed, укажите полный путь к ресурсу (включая имя проекта и подкаталоги).

<File name='seeds/marketing/properties.yml'>

```yml

seeds:
  - name: utm_parameters
    config:
      schema: seed_data
```

</File>

В более старых версиях dbt вы должны определить конфигурации в `dbt_project.yml` и включить полный путь к ресурсу (включая имя проекта и подкаталоги). Для проекта с именем `jaffle_shop`, с файлом seed в `seeds/marketing/utm_parameters.csv`, это будет выглядеть так:

<File name='dbt_project.yml'>

```yml
seeds:
  jaffle_shop:
    marketing:
      utm_parameters:
        +schema: seed_data
```

</File>


## Пример конфигурации seed {#example-seed-configuration}
Ниже приведен пример допустимой конфигурации seed для проекта с:
* `name: jaffle_shop`
* Файлом seed в `seeds/country_codes.csv`, и
* Файлом seed в `seeds/marketing/utm_parameters.csv`


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
      # Переопределение типов столбцов
      +column_types:
        country_code: varchar(2)
        country_name: varchar(32)
    marketing:
      +schema: marketing # это будет иметь приоритет
```

</File>