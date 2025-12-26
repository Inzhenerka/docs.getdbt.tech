---
resource_types: sources
datatype: string
---

:::warning Deprecation
The `overrides` property is deprecated in v1.10.
:::

<File name='models/<filename>.yml'>

```yml

sources:
  - name: <source_name>
    overrides: <package name> # deprecated in v1.10

    database: ...
    schema: ...
```

</File>

## Определение
Переопределите источник, определенный в подключенном пакете. Свойства, определенные в переопределенном источнике, будут применены поверх базовых свойств переопределяемого источника.

Следующие свойства источника могут быть переопределены:
 - [description](/reference/resource-properties/description)
 - [meta](/reference/resource-configs/meta)
 - [database](/reference/resource-properties/database)
 - [schema](/reference/resource-properties/schema)
 - [loader](/reference/resource-properties/loader)
 - [quoting](/reference/resource-properties/quoting)
 - [freshness](/reference/resource-properties/freshness)
 - [loaded_at_field](/reference/resource-properties/freshness#loaded_at_field)
 - [tags](/reference/resource-configs/tags)

## Примеры
### Укажите имя вашей базы данных и схемы для источника, определенного в пакете

Этот пример основан на [пакете источника Fivetran GitHub](https://github.com/fivetran/dbt_github_source/blob/830ba43ac2948e4853a3c167ab7ee88b8b425fa0/models/src_github.yml#L3-L29).
Здесь база данных и схема переопределяются в родительском проекте dbt, который включает пакет `github_source`.

<File name='models/src_github.yml'>

```yml

sources:
  - name: github
    overrides: github_source # deprecated in v1.10

    database: RAW
    schema: github_data

```

</File>

### Настройте свою собственную свежесть источника для таблицы источника в пакете

Вы можете переопределить настройки как на уровне источника, так и на уровне <Term id="table" />.

<File name='models/src_github.yml'>

```yml

sources:
  - name: github
    overrides: github_source # deprecated in v1.10
    config:
      freshness: # changed to config in v1.9
        warn_after:
          count: 1
          period: day
        error_after:
          count: 2
          period: day

    tables:
      - name: issue_assignee
        config:
          freshness:
            warn_after:
              count: 2
              period: day
            error_after:
              count: 4
              period: day

```

</File>