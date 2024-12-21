---
title: Свойства seed
---

Свойства seed могут быть объявлены в файлах `.yml` под ключом `seed`.

Мы рекомендуем размещать их в директории `seeds/`. Вы можете назвать эти файлы как угодно, например, `whatever_you_want.yml`, и вкладывать их на любую глубину в подкаталоги внутри этой директории.

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

      - name: ... # объявите свойства дополнительных колонок

  - name: ... # объявите свойства дополнительных seeds
```
</File>