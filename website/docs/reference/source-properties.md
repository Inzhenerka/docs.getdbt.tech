---
title: "Свойства источников"
description: "Узнайте, как использовать свойства источников в dbt."
---

## Связанная документация
- [Использование источников](/docs/build/sources)
- [Объявление свойств ресурсов](/reference/configs-and-properties)

## Обзор

import PropsCallout from '/snippets/_config-prop-callout.md';

Свойства источников могут быть объявлены в любом файле `properties.yml` в вашем каталоге `models/` (как определено в конфигурации [`model-paths`](/reference/project-configs/model-paths)). <PropsCallout title={frontMatter.title}/>  <br /> 

Вы можете назвать эти файлы `whatever_you_want.yml` и вложить их на произвольную глубину в подпапки внутри каталога `models/`:

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <string> # обязательный
    [description](/reference/resource-properties/description): <markdown_string>
    [database](/reference/resource-properties/database): <database_name>
    [schema](/reference/resource-properties/schema): <schema_name>
    [loader](/reference/resource-properties/loader): <string>
    [loaded_at_field](/reference/resource-properties/freshness#loaded_at_field): <column_name>
    [meta](/reference/resource-configs/meta): {<dictionary>}
    [tags](/reference/resource-configs/tags): [<string>]
    
    # требуется v1.1+
    [config](/reference/resource-properties/config):
      [<source_config>](source-configs): <config_value>

    [overrides](/reference/resource-properties/overrides): <string>

    [freshness](/reference/resource-properties/freshness):
      warn_after:
        [count](/reference/resource-properties/freshness#count): <positive_integer>
        [period](/reference/resource-properties/freshness#period): минута | час | день
      error_after:
        [count](/reference/resource-properties/freshness#count): <positive_integer>
        [period](/reference/resource-properties/freshness#period): минута | час | день
      [filter](/reference/resource-properties/freshness#filter): <where-condition>

    [quoting](/reference/resource-properties/quoting):
      database: true | false
      schema: true | false
      identifier: true | false

    tables:
      - name: <string> # обязательный
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [identifier](/reference/resource-properties/identifier): <table_name>
        [loaded_at_field](/reference/resource-properties/freshness#loaded_at_field): <column_name>
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты
        [tags](/reference/resource-configs/tags): [<string>]
        [freshness](/reference/resource-properties/freshness):
          warn_after:
            [count](/reference/resource-properties/freshness#count): <positive_integer>
            [period](/reference/resource-properties/freshness#period): минута | час | день
          error_after:
            [count](/reference/resource-properties/freshness#count): <positive_integer>
            [period](/reference/resource-properties/freshness#period): минута | час | день
          [filter](/reference/resource-properties/freshness#filter): <where-condition>

        [quoting](/reference/resource-properties/quoting):
          database: true | false
          schema: true | false
          identifier: true | false
        [external](/reference/resource-properties/external): {<dictionary>}
        columns:
          - name: <column_name> # обязательный
            [description](/reference/resource-properties/description): <markdown_string>
            [meta](/reference/resource-configs/meta): {<dictionary>}
            [quote](/reference/resource-properties/quote): true | false
            [tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # объявите дополнительные тесты
            [tags](/reference/resource-configs/tags): [<string>]
          - name: ... # объявите свойства дополнительных столбцов

      - name: ... # объявите свойства дополнительных таблиц источников

  - name: ... # объявите свойства дополнительных источников

```

</File>


## Пример

<File name='models/<filename>.yml'>

```yaml
version: 2

sources:
  - name: jaffle_shop
    database: raw
    schema: public
    loader: emr # только для информации (свободный текст)
    loaded_at_field: _loaded_at # настройка для всех источников

    # поля meta отображаются в автоматически сгенерированной документации
    meta:
      contains_pii: true
      owner: "@alice"

    # Добавьте теги к этому источнику
    tags:
      - ecom
      - pii

    quoting:
      database: false
      schema: false
      identifier: false

    tables:
      - name: orders
        identifier: Orders_
        loaded_at_field: updated_at # переопределение значений по умолчанию источника
        columns:
          - name: id
            tests:
              - unique

          - name: price_in_usd
            tests:
              - not_null

      - name: customers
        quoting:
          identifier: true # переопределение значений по умолчанию источника
        columns:
            tests:
              - unique
```

</File>