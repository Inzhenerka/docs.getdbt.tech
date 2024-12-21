---
title: Свойства анализа
---

import PropsCallout from '/snippets/_config-prop-callout.md';

Мы рекомендуем определять свойства анализа в вашем каталоге `analyses/`, как это показано в конфигурации [`analysis-paths`](/reference/project-configs/analysis-paths). <PropsCallout title={frontMatter.title}/>  <br />

Вы можете назвать эти файлы как угодно, например, `whatever_you_want.yml`, и размещать их на любой глубине в подпапках внутри каталогов `analyses/` или `models/`.

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: <analysis_name> # обязательно
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
    config:
      [tags](/reference/resource-configs/tags): <string> | [<string>]
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
      - name: ... # объявите свойства дополнительных столбцов

  - name: ... # объявите свойства дополнительных анализов

```

</File>