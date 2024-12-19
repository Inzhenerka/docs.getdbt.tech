---
title: Свойства Seed
---

Свойства Seed могут быть объявлены в `.yml` файлах под ключом `seed`.

Рекомендуем помещать их в директорию `seeds/`. Вы можете называть эти файлы `whatever_you_want.yml` и размещать их на произвольной глубине в подпапках внутри этой директории.

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <string>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
    [config](/reference/resource-properties/config):
      [<seed_config>](/reference/seed-configs): <config_value>
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # объявите дополнительные тесты
    columns:
      - name: <column name>
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [tags](/reference/resource-configs/tags): [<string>]
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты

      - name: ... # объявите свойства дополнительных столбцов

  - name: ... # объявите свойства дополнительных seed
```
</File>