---
title: Свойства функций
---

<VersionCallout version="1.11" /> 

Свойства функций можно объявлять в `.yml`‑файлах под ключом `functions`.

Мы рекомендуем размещать их в директории `functions/`. Эти файлы можно называть `schema.yml` или как угодно (`whatever_you_want.yml`), а также вкладывать их в поддиректории внутри этой директории.

<File name='functions/<filename>.yml'>

```yml

functions:
  - name: <string> # обязательно
    [description](/reference/resource-properties/description): <markdown_string> # необязательно
    [config](/reference/resource-properties/config): # необязательно
      [<function_config>](/reference/function-configs): <config_value>
[type](/reference/resource-configs/type): scalar | aggregate # необязательно, по умолчанию scalar.
      [volatility](/reference/resource-configs/volatility): deterministic | stable | non-deterministic # необязательно
      [runtime_version](/reference/resource-configs/runtime-version): <string> # обязательно для UDF на Python
      [entry_point](/reference/resource-configs/entry-point): <string> # обязательно для UDF на Python
      [packages](/reference/resource-configs/packages): [<string>] # необязательно, только для UDF на Python
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Используйте название цвета (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
    [arguments](/reference/resource-properties/function-arguments): # необязательно
      - name: <string> # обязательно, если указан arguments
        data_type: <string> # обязательно, если указан arguments; зависит от хранилища данных
        description: <markdown_string> # необязательно
        default_value: <string | boolean | integer> # необязательно, доступно в Snowflake и Postgres
      - name: ... # объявите дополнительные аргументы
    [returns](/reference/resource-properties/returns): # обязательно
      data_type: <string> # обязательно; зависит от хранилища данных
      description: <markdown_string> # необязательно
    [overloads](/reference/resource-properties/overloads): # необязательно, для UDF на SQL (Snowflake и Postgres) и UDF на Python (Snowflake), доступно в v1.12+
      - defined_in: <string> # обязательно, имя SQL-файла или Python-файла, содержащего тело этой перегрузки
        arguments: # необязательно
          - name: <string> # обязательно, если указан arguments
            data_type: <string> # обязательно, если указан arguments; зависит от хранилища данных
            description: <markdown_string> # необязательно
            default_value: <string | boolean | integer> # необязательно, доступно в Snowflake и Postgres
          - name: ... # объявите дополнительные аргументы
        returns: # необязательно, если не указано, наследуется от корневой функции
          data_type: <string> # обязательно, если указан returns; зависит от хранилища данных
          description: <markdown_string> # необязательно
      - defined_in: ... # объявите дополнительные перегрузки

  - name: ... # объявите свойства дополнительных функций
```
</File>

## Пример {#example}

<File name='functions/schema.yml'>

```yml
functions:
  - name: is_positive_int
    description: Определяет, представляет ли строка положительное (+) целое число
    config:
      type: scalar
      volatility: deterministic
      database: analytics
      schema: udf_schema
    arguments:
      - name: a_string
        data_type: string
        description: Строка, которую нужно проверить, представляет ли она положительное целое число (например, "10")
    returns:
      data_type: boolean
description: Возвращает true, если входная строка представляет собой положительное целое число, и false в противном случае
    overloads:
      - defined_in: is_positive_int_numeric
        arguments:
          - name: a_num
            data_type: numeric
            description: Число, которое нужно проверить на то, является ли оно положительным целым числом
        returns:
          data_type: boolean
```
</File>
