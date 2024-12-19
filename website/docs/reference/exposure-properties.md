---
title: Свойства экспозиций
description: "Прочитайте это руководство, чтобы понять свойства экспозиций в dbt."
---

## Связанная документация
- [Использование экспозиций](/docs/build/exposures)
- [Объявление свойств ресурсов](/reference/configs-and-properties)

## Обзор

Экспозиции определяются в файлах `properties.yml`, вложенных под ключом `exposures:`. Вы можете определять `exposures` в YAML-файлах, которые также определяют `sources` или `models`. <PropsCallout title={frontMatter.title}/>  <br /> 

Вы можете называть эти файлы `whatever_you_want.yml` и вложить их на произвольную глубину в подпапки внутри директории `models/`.

Имена экспозиций должны содержать только буквы, цифры и символы подчеркивания (без пробелов и специальных символов). Для короткого удобочитаемого имени с заглавными буквами, пробелами и специальными символами используйте свойство `label`.

<File name='models/<filename>.yml'>

```yml
version: 2

exposures:
  - name: <string_with_underscores>
    [description](/reference/resource-properties/description): <markdown_string>
    type: {dashboard, notebook, analysis, ml, application}
    url: <string>
    maturity: {high, medium, low}  # Указывает уровень уверенности или стабильности в экспозиции
    [tags](/reference/resource-configs/tags): [<string>]
    [meta](/reference/resource-configs/meta): {<dictionary>}
    owner:
      name: <string>
      email: <string>
    
    depends_on:
      - ref('model')
      - ref('seed')
      - source('name', 'table')
      - metric('metric_name')
      
    label: "Удобочитаемое имя для этой экспозиции!"
    [config](/reference/resource-properties/config):
      enabled: true | false

  - name: ... # объявите свойства дополнительных экспозиций
```
</File>

## Пример

<File name='models/jaffle/exposures.yml'>

```yaml
version: 2

exposures:

  - name: weekly_jaffle_metrics
    label: Jaffles по неделям              # необязательно
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
      Глубокое обучение для персонализированного "Открывайте сэндвичи каждую неделю"
    
    depends_on:
      - ref('fct_orders')
      
    owner:
      name: Data Science Drew
      email: data@jaffleshop.com

      
  - name: jaffle_wrapped
    type: application
    description: Сообщите пользователям о их любимых яффлах года
    depends_on: [ ref('fct_orders') ]
    owner: { email: summer-intern@jaffleshop.com }
```

</File>