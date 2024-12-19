---
title: Свойства макросов
id: macro-properties
---

import PropsCallout from '/snippets/_config-prop-callout.md';

Свойства макросов могут быть объявлены в любом файле `properties.yml`. <PropsCallout title={frontMatter.title}/> 

Вы можете назвать эти файлы `что_угодно.yml` и вложить их на произвольную глубину в подпапки.

<File name='macros/<filename>.yml'>

```yml
version: 2

macros:
  - name: <macro name>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
    [meta](/reference/resource-configs/meta): {<dictionary>}
    arguments:
      - name: <arg name>
        [type](/reference/resource-properties/argument-type): <string>
        [description](/reference/resource-properties/description): <markdown_string>
      - ... # объявите свойства дополнительных аргументов

  - name: ... # объявите свойства дополнительных макросов

```

</File>