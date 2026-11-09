---
title: Свойства анализа
---

import PropsCallout from '/snippets/_config-prop-callout.md';
import AnalysesProjectLevelConfig from '/snippets/_analyses-project-level-config.md';

<VersionBlock lastVersion="1.11">

Мы рекомендуем определять свойства анализа в вашем каталоге `analyses/`, как это показано в конфигурации [`analysis-paths`](/reference/project-configs/analysis-paths). <PropsCallout title={frontMatter.title}/>  <br />

Вы можете назвать эти файлы `whatever_you_want.yml` и размещать их в подпапках любой глубины вложенности в каталоге `analyses/` или `models/`.
</VersionBlock>

<VersionBlock firstVersion="1.12">

Мы рекомендуем определять свойства анализов в каталоге `analyses/`, как показано в описании конфигурации [`analysis-paths`](/reference/project-configs/analysis-paths). Вы можете назвать эти файлы `whatever_you_want.yml` и размещать их в подпапках любой глубины вложенности в каталоге `analyses/` или `models/`.

</VersionBlock>

<File name='analyses/<filename>.yml'>

```yml

analyses:
  - name: <analysis_name> # обязательно
    [description](/reference/resource-properties/description): <markdown_string>
    config:
      [enabled](/reference/resource-configs/enabled): true | false
      [docs](/reference/resource-configs/docs): # changed to config in v1.10
        show: true | false
        node_color: <color_id> # Use name (such as node_color: purple) or hex code with quotes (such as node_color: "#cd7f32")
      [tags](/reference/resource-configs/tags): <string> | [<string>]
    columns:
      - name: <column_name>
        [description](/reference/resource-properties/description): <markdown_string>
      - name: ... # объявите свойства дополнительных столбцов

  - name: ... # объявите свойства дополнительных анализов

```

</File>

<VersionBlock firstVersion="1.12">

<AnalysesProjectLevelConfig />

<File name='dbt_project.yml'>

```yaml
flags:
  require_corrected_analysis_fqns: true

analyses:
  +[enabled](/reference/resource-configs/enabled): true | false
```

</File>

</VersionBlock>
