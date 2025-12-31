---
title: Свойства экспозиций
description: "Прочтите это руководство, чтобы понять свойства экспозиций в dbt."
---

## Связанная документация {#related-documentation}
- [Использование экспозиций](/docs/build/exposures)
- [Объявление свойств ресурсов](/reference/configs-and-properties)

## Обзор {#overview}

import PropsCallout from '/snippets/_config-prop-callout.md';

Экспозиции определяются в файлах `properties.yml`, вложенных под ключом `exposures:`. Вы можете определять `exposures` в YAML-файлах, которые также определяют `sources` или `models`. <PropsCallout title={frontMatter.title}/>  <br />

Обратите внимание, что хотя большинство свойств exposure необходимо настраивать непосредственно в этих YAML-файлах, вы можете задать конфигурацию [`enabled`](/reference/resource-configs/enabled) на [уровне проекта](#project-level-configs) в файле `dbt_project.yml`.

Имена экспозиций должны содержать только буквы, цифры и подчеркивания (без пробелов или специальных символов). Для короткого, удобного для чтения имени с заглавными буквами, пробелами и специальными символами используйте свойство `label`.

<File name='models/<filename>.yml'>

```yml

exposures:
  - name: <string_with_underscores>
    [description](/reference/resource-properties/description): <markdown_string>
    type: {dashboard, notebook, analysis, ml, application}
    url: <string>
    maturity: {high, medium, low}  # Указывает уровень уверенности или стабильности exposure
    [enabled](/reference/resource-configs/enabled): true | false
    [config](/reference/resource-properties/config): # 'tags' и 'meta' были перенесены в config в версии v1.10
      [tags](/reference/resource-configs/tags): [<string>] 
      [meta](/reference/resource-configs/meta): {<dictionary>}
      enabled: true | false
    owner: # поддерживаются только поля 'name' и 'email'
      name: <string>
      email: <string>
    
    depends_on:
      - ref('model')
      - ref('seed')
      - source('name', 'table')
      - metric('metric_name')
      
    label: "Понятное человеку имя для этого exposure!"

  - name: ... # объявление свойств дополнительных экспозиций
```
</File>

## Пример {#example}

<File name='models/jaffle/exposures.yml'>

```yaml

exposures:

  - name: weekly_jaffle_metrics
    label: Jaffles by the Week              # необязательно
    type: dashboard                         # обязательно
    maturity: high                          # необязательно
    url: https://bi.tool/dashboards/1       # необязательно
    description: >                          # необязательно
      Кто-то сказал "экспоненциальный рост"?

    depends_on:                             # ожидается
      - ref('fct_orders')
      - ref('dim_customers')
      - source('gsheets', 'goals')
      - metric('count_orders')

    owner:
      name: Callum McData
      email: data@jaffleshop.com


      
  - name: jaffle_recommender
    maturity: medium
    type: ml
    url: https://jupyter.org/mycoolalg
    description: >
      Глубокое обучение для персонализированного "Откройте для себя бутерброды еженедельно"
    
    depends_on:
      - ref('fct_orders')
      
    owner:
      name: Data Science Drew
      email: data@jaffleshop.com

      
  - name: jaffle_wrapped
    type: application
    description: Сообщите пользователям об их любимых jaffles за год
    depends_on: [ ref('fct_orders') ]
    owner: { email: summer-intern@jaffleshop.com }
```

</File>

#### Конфигурации на уровне проекта {#project-level-configs}

Вы можете задать конфигурации на уровне проекта для exposures в файле `dbt_project.yml` в секции `exposures:` с использованием префикса `+`. В настоящее время поддерживается только [конфигурация `enabled`](/reference/resource-configs/enabled):

<File name="dbt_project.yml">

```yml
name: 'project_name'

# rest of dbt_project.yml

exposures:
  +enabled: true
```

</File>
