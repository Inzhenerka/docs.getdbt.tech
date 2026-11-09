---
title: Свойства макросов
id: macro-properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';

Вы можете объявлять свойства и конфигурации макросов в файлах `.yml` вашего проекта. <PropsCallout title={frontMatter.title}/> 

Макросы поддерживают блок `config`. Внутри `config` можно определить `meta` и `docs`.

Вы можете назвать эти файлы как угодно, например, `whatever_you_want.yml`, и размещать их на любой глубине в подкаталогах.

<File name='macros/<filename>.yml'>

```yml

macros:
  - name: <macro name>
    [description](/reference/resource-properties/description): <markdown_string>
    config:
      [docs](/reference/resource-configs/docs):
        show: true | false
      [meta](/reference/resource-configs/meta): {<dictionary>}
    [arguments](/reference/resource-properties/arguments):
      - name: <arg name>
        [type](/reference/resource-properties/arguments#type): <string>
        [description](/reference/resource-properties/description): <markdown_string>
      - ... # объявление свойств дополнительных аргументов

  - name: ... # объявление свойств дополнительных макросов

```

</File>

## Пример

<File name='macros/schema.yml'>

```yaml
macros:
  - name: cents_to_dollars
    description: Преобразует числовой столбец из центов в доллары.
    config:
      docs:
        show: true
      meta:
        owner: analytics
    arguments:
      - name: column_name
        type: column
        description: Столбец для преобразования
      - name: precision
        type: integer
        description: Количество знаков после запятой. По умолчанию — 2.
```
</File>