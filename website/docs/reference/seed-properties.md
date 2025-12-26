---
title: Свойства seed
---

Свойства seed могут быть объявлены в файлах `.yml` под ключом `seed`.

Мы рекомендуем размещать их в директории `seeds/`. Вы можете назвать эти файлы как угодно, например, `whatever_you_want.yml`, и вкладывать их на любую глубину в подкаталоги внутри этой директории.

<File name='seeds/<filename>.yml'>

```yml

seeds:
  - name: <string>
    [description](/reference/resource-properties/description): <markdown_string>
    [config](/reference/resource-properties/config):
      [<seed_config>](/reference/seed-configs): <config_value>
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Используйте название (например, node_color: purple) или hex-код в кавычках (например, node_color: "#cd7f32")
    [data_tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # объявите дополнительные тесты
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

      - name: ... # объявите свойства дополнительных колонок

  - name: ... # объявите свойства дополнительных seed-файлов
```
</File>