---
title: Свойства снимков
description: "Прочтите это руководство, чтобы узнать о использовании свойств источников в dbt."
---

<VersionBlock firstVersion="1.9">

В dbt версии 1.9 и позже снимки определяются и настраиваются в YAML-файлах в вашем каталоге `snapshots/` (как определено в конфигурации [`snapshot-paths`](/reference/project-configs/snapshot-paths)). Свойства снимков объявляются в этих YAML-файлах, что позволяет вам определять как конфигурации снимков, так и их свойства в одном месте.

</VersionBlock>

<VersionBlock lastVersion="1.8">

Свойства снимков могут быть объявлены в `.yml` файлах в:
- вашем каталоге `snapshots/` (как определено в конфигурации [`snapshot-paths`](/reference/project-configs/snapshot-paths)).
- вашем каталоге `models/` (как определено в конфигурации [`model-paths`](/reference/project-configs/model-paths))

Обратите внимание, что в dbt версии 1.9 и позже снимки определяются в обновленном синтаксисе с использованием YAML-файла в вашем каталоге `snapshots/` (как определено в конфигурации [`snapshot-paths`](/reference/project-configs/snapshot-paths)). Для более быстрого и эффективного управления рассмотрите обновленный синтаксис YAML для снимков, который уже доступен в [последней версии dbt Cloud](/docs/dbt-versions/cloud-release-tracks) и вскоре будет доступен в [dbt Core v1.9](/docs/dbt-versions/core-upgrade/upgrading-to-v1.9).

</VersionBlock>

Мы рекомендуем размещать их в каталоге `snapshots/`. Вы можете назвать эти файлы как угодно, например, `whatever_you_want.yml`, и вложить их на любую глубину в подкаталоги внутри каталога `snapshots/` или `models/`.

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](/reference/resource-properties/description): <markdown_string>
    [meta](/reference/resource-configs/meta): {<dictionary>}
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
    [config](/reference/resource-properties/config):
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [tags](/reference/resource-configs/tags): [<string>]
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты
      - ... # объявите свойства дополнительных столбцов

    - name: ... # объявите свойства дополнительных снимков

```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.8">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot name>
    [description](/reference/resource-properties/description): <markdown_string>
    [meta](/reference/resource-configs/meta): {<dictionary>}
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
    [config](/reference/resource-properties/config):
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [tags](/reference/resource-configs/tags): [<string>]
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты
      - ... # объявите свойства дополнительных столбцов

    - name: ... # объявите свойства дополнительных снимков

```
</File>
</VersionBlock>