---
title: Свойства макросов
id: macro-properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';

Свойства макросов могут быть объявлены в любом файле `properties.yml`. <PropsCallout title={frontMatter.title}/> 

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