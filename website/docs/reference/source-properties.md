---
title: "Свойства источников"
description: "Узнайте, как использовать свойства источников в dbt."
---

## Связанная документация {#related-documentation}
- [Использование источников](/docs/build/sources)
- [Объявление свойств ресурсов](/reference/configs-and-properties)

## Обзор {#overview}

import PropsCallout from '/snippets/_config-prop-callout.md';

Свойства источников могут быть объявлены в любом файле `properties.yml` в вашем каталоге `models/` (как определено в [конфигурации `model-paths`](/reference/project-configs/model-paths)). <PropsCallout title={frontMatter.title}/>  <br />

Вы можете назвать эти файлы как угодно, и вложить их на любую глубину в подкаталоги внутри каталога `models/`:

<File name='models/<filename>.yml'>

```yml
sources:
  - name: <string> # обязательно
    [description](/reference/resource-properties/description): <markdown_string>
    [database](/reference/resource-properties/database): <database_name>
    [schema](/reference/resource-properties/schema): <schema_name>
    [loader](/reference/resource-properties/loader): <string>

    # требуется v1.1+
    [config](/reference/resource-properties/config):
      [<source_config>](/reference/source-configs): <config_value>
      [freshness](/reference/resource-properties/freshness):
      # перенесено в config в v1.10
      [loaded_at_field](/reference/resource-properties/freshness#loaded_at_field): <column_name>
        warn_after:
          [count](/reference/resource-properties/freshness#count): <positive_integer>
          [period](/reference/resource-properties/freshness#period): minute | hour | day
        error_after:
          [count](/reference/resource-properties/freshness#count): <positive_integer>
          [period](/reference/resource-properties/freshness#period): minute | hour | day
        [filter](/reference/resource-properties/freshness#filter): <where-condition>
      [meta](/reference/resource-configs/meta): {<dictionary>} # перенесено в config в v1.10
      [tags](/reference/resource-configs/tags): [<string>] # перенесено в config в v1.10

    # объявлено устаревшим в v1.10
    [overrides](/reference/resource-properties/overrides): <string>

    [quoting](/reference/resource-properties/quoting):
      database: true | false
      schema: true | false
      identifier: true | false

    tables:
      - name: <string> # обязательно
        [description](/reference/resource-properties/description): <markdown_string>
        [identifier](/reference/resource-properties/identifier): <table_name>
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты
        [config](/reference/resource-properties/config):
          [loaded_at_field](/reference/resource-properties/freshness#loaded_at_field): <column_name>
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]
          [freshness](/reference/resource-properties/freshness):
            warn_after:
              [count](/reference/resource-properties/freshness#count): <positive_integer>
              [period](/reference/resource-properties/freshness#period): minute | hour | day
            error_after:
              [count](/reference/resource-properties/freshness#count): <positive_integer>
              [period](/reference/resource-properties/freshness#period): minute | hour | day
            [filter](/reference/resource-properties/freshness#filter): <where-condition>

        [quoting](/reference/resource-properties/quoting):
          database: true | false
          schema: true | false
          identifier: true | false
        [external](/reference/resource-properties/external): {<dictionary>}
        columns:
          - name: <column_name> # обязательно
            [description](/reference/resource-properties/description): <markdown_string>
            [quote](/reference/resource-properties/columns#quote): true | false
            [data_tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # объявите дополнительные тесты
            [config](/reference/resource-properties/config):
              [meta](/reference/resource-configs/meta): {<dictionary>}
              [tags](/reference/resource-configs/tags): [<string>]
          - name: ... # объявите свойства дополнительных колонок

      - name: ... # объявите свойства дополнительных таблиц источников

  - name: ... # объявите свойства дополнительных источников

```

</File>

## Пример {#example}

<File name='models/<filename>.yml'>

```yaml

sources:
  - name: jaffle_shop
    database: raw
    schema: public
    loader: emr # только для информации (произвольный текст)

    config:
      # перенесено в config в v1.10
      loaded_at_field: _loaded_at # настраивается для всех источников
      # поля meta отображаются в автоматически сгенерированной документации
      meta: # перенесено в config в v1.10
        contains_pii: true
        owner: "@alice"

      # Добавьте теги для этого источника
      tags: # перенесено в config в v1.10
        - ecom
        - pii

    quoting:
      database: false
      schema: false
      identifier: false

    tables:
      - name: orders
        identifier: Orders_
        config:
          # перенесено в config в v1.10
          loaded_at_field: updated_at # переопределяет настройки источника по умолчанию
        columns:
          - name: id
            data_tests:
              - unique

          - name: price_in_usd
            data_tests:
              - not_null

      - name: customers
        quoting:
          identifier: true # переопределяет настройки источника по умолчанию
        columns:
            data_tests:
              - unique

```

</File>