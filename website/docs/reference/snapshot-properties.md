---
title: Свойства snapshot  
description: "Прочитайте это руководство, чтобы узнать, как использовать свойства источников в dbt."  
intro_text: "Определяйте свойства snapshot в YAML, чтобы документировать snapshot, настраивать параметры, добавлять тесты и описывать столбцы."
---

import CourseCallout from '/snippets/_materialization-video-callout.md';

<VersionBlock firstVersion="1.9">

В dbt версии 1.9 и позже снимки определяются и настраиваются в YAML-файлах в вашем каталоге `snapshots/` (как определено в конфигурации [`snapshot-paths`](/reference/project-configs/snapshot-paths)). Свойства снимков объявляются в этих YAML-файлах, что позволяет вам определять как конфигурации снимков, так и их свойства в одном месте.

</VersionBlock>

Мы рекомендуем размещать их в директории `snapshots/`. Вы можете называть эти файлы как угодно, например `whatever_you_want.yml`, и произвольно вкладывать их в подкаталоги любой глубины внутри директорий `snapshots/` или `models/`.

<CourseCallout resource="Snapshots" 
url="https://learn.getdbt.com/courses/snapshots"
course="Snapshots"
/>

<VersionBlock firstVersion="1.9">

<File name='snapshots/<filename>.yml'>

```yml

snapshots:
  - name: <snapshot name>
    [description](/reference/resource-properties/description): <markdown_string>
    [config](/reference/resource-properties/config):
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
      [meta](/reference/resource-configs/meta): {<dictionary>}
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Используйте название (например, node_color: purple) или hex-код в кавычках (например, node_color: "#cd7f32")
    [data_tests](/reference/resource-properties/data-tests):
      - <test>
      - ...
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты
        [config](/reference/resource-properties/config):
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]
      - ... # объявите свойства дополнительных колонок

    - name: ... # объявите свойства дополнительных snapshot-ов

```
</File>
</VersionBlock>

