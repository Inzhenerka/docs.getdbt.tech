---
title: Свойства анализа
---

Мы рекомендуем определять свойства анализа в директории `analyses/`, что иллюстрируется в конфигурации [`analysis-paths`](/reference/project-configs/analysis-paths). <PropsCallout title={frontMatter.title}/>  <br /> 

Вы можете назвать эти файлы `whatever_you_want.yml` и вложить их на произвольную глубину в подпапки внутри директории `analyses/` или `models/`.

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