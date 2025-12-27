---
title: Конфигурации функций
description: "Прочитайте это руководство, чтобы узнать, как использовать конфигурации функций в dbt."
meta:
  resource_type: Functions
---

import ConfigResource from '/snippets/_config-description-resource.md';
import ConfigGeneral from '/snippets/_config-description-general.md';

<VersionCallout version="1.11" /> 

## Доступные конфигурации
### Конфигурации, специфичные для функций

<ConfigResource meta={frontMatter.meta} />

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

```yml
functions:
  [<resource-path>](/reference/resource-configs/resource-path):
    # Конфигурации, специфичные для функций, задаются в properties YAML файле
    # См. примеры functions/schema.yml ниже

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='functions/schema.yml'>

```yaml

functions:
  - name: [<function-name>]
    config:
      [type](/reference/resource-configs/type): scalar  # необязательно, по умолчанию scalar. В будущем появятся aggregate | table
      [volatility](/reference/resource-configs/volatility): deterministic | stable | non-deterministic # необязательно
      [runtime_version](/reference/resource-configs/runtime-version): <string> # обязательно для Python UDF
      [entry_point](/reference/resource-configs/entry-point): <string> # обязательно для Python UDF
      # Стандартные конфигурации, применимые к функциям
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [meta](/reference/resource-configs/meta): {<dictionary>}

```

</File>

</TabItem>

</Tabs>

### Общие конфигурации

<ConfigGeneral />

:::note Конфигурации database, schema и alias
Функции поддерживают конфигурации `database`, `schema` и `alias` так же, как и модели. Они определяют, где именно функция будет создана в вашем хранилище данных. Для функций применяется стандартный приоритет конфигураций dbt (более специфичная конфигурация > конфигурация проекта > значения по умолчанию из target-профиля).
:::

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

```yaml
functions:
  [<resource-path>](/reference/resource-configs/resource-path):
    [+](/reference/resource-configs/plus-prefix)[enabled](/reference/resource-configs/enabled): true | false
    [+](/reference/resource-configs/plus-prefix)[tags](/reference/resource-configs/tags): <string> | [<string>]
    [+](/reference/resource-configs/plus-prefix)[database](/reference/resource-configs/database): <string>
    [+](/reference/resource-configs/plus-prefix)[schema](/reference/resource-properties/schema): <string>
    [+](/reference/resource-configs/plus-prefix)[alias](/reference/resource-configs/alias): <string>
    [+](/reference/resource-configs/plus-prefix)[meta](/reference/resource-configs/meta): {<dictionary>}

```

</File>

</TabItem>


<TabItem value="property-yaml">

<File name='functions/schema.yml'>

```yaml

functions:
  - name: [<function-name>]
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [tags](/reference/resource-configs/tags): <string> | [<string>]
      [database](/reference/resource-configs/database): <string>
      [schema](/reference/resource-properties/schema): <string>
      [alias](/reference/resource-configs/alias): <string>
      [meta](/reference/resource-configs/meta): {<dictionary>}

```

</File>

</TabItem>
</Tabs>


## Настройка функций
Функции настраиваются в YAML-файлах — либо в `dbt_project.yml`, либо в индивидуальном properties YAML файле конкретной функции. Тело функции при этом определяется в SQL-файле, расположенном в директории `functions/`.

Конфигурации функций, как и конфигурации моделей, применяются иерархически. Подробнее см. в разделе [наследование конфигураций](/reference/define-configs#config-inheritance). 

Функции используют те же макросы генерации имён, что и модели: [`generate_database_name`](/docs/build/custom-databases), [`generate_schema_name`](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name) и [`generate_alias_name`](/docs/build/custom-aliases).

### Примеры
#### Применение конфигурации `schema` ко всем функциям
Чтобы применить конфигурацию ко всем функциям, включая функции из любых установленных [пакетов](/docs/build/packages), вложите конфигурацию непосредственно под ключ `functions`:

<File name='dbt_project.yml'>

```yml

functions:
  +schema: udf_schema
```

</File>


#### Применение конфигурации `schema` ко всем функциям в вашем проекте
Чтобы применить конфигурацию только к функциям вашего проекта (то есть _исключая_ функции из установленных пакетов), укажите [имя проекта](/reference/project-configs/name.md) как часть пути ресурса.

Для проекта с именем `jaffle_shop`:

<File name='dbt_project.yml'>

```yml

functions:
  jaffle_shop:
    +schema: udf_schema
```

</File>

Аналогичным образом можно использовать имя установленного пакета, чтобы настраивать функции в этом пакете.

#### Применение конфигурации `schema` только к одной функции

Чтобы применить конфигурацию только к одной функции в properties файле, укажите её в блоке `config` этой функции:

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    config:
      schema: udf_schema
```

</File>

Чтобы применить конфигурацию только к одной функции в `dbt_project.yml`, укажите полный путь ресурса (включая имя проекта и поддиректории). Для проекта с именем `jaffle_shop` и файлом функции `functions/is_positive_int.sql`:

<File name='dbt_project.yml'>

```yml
functions:
  jaffle_shop:
    is_positive_int:
      +schema: udf_schema
```

</File>


## Пример конфигурации функций

Следующий пример показывает, как настроить функции в проекте с именем `jaffle_shop`, в котором есть два файла функций:
- `functions/is_positive_int.sql`
- `functions/marketing/clean_url.sql`


<File name='dbt_project.yml'>

```yml
name: jaffle_shop
...
functions:
  jaffle_shop:
    +enabled: true
    +schema: udf_schema
    # Эта конфигурация применяется к functions/is_positive_int.sql
    is_positive_int:
      +tags: ['validation']
    marketing:
      +schema: marketing_udfs # это значение будет иметь приоритет
```

</File>

<File name='functions/schema.yml'>

```yml

functions:
  - name: is_positive_int
    description: Определяет, представляет ли строка положительное целое число
    config:
      type: scalar
      volatility: deterministic
      database: analytics
      schema: udf_schema
    arguments:
      - name: a_string
        data_type: string
        description: Строка для проверки
    returns:
      data_type: boolean
      description: Возвращает true, если строка представляет положительное целое число
```

</File>
