---
title: "Добавление экспозиций в ваш DAG"
sidebar_label: "Экспозиции"
id: "exposures"
---

Экспозиции позволяют определить и описать использование вашего проекта dbt downstream, например, в панели мониторинга, приложении или в процессе работы с данными. Определив экспозиции, вы сможете:
- запускать, тестировать и перечислять ресурсы, которые питают вашу экспозицию
- заполнять специальную страницу на автоматически сгенерированном [документационном](/docs/build/documentation) сайте контекстом, актуальным для потребителей данных

### Объявление экспозиции

Экспозиции определяются в `.yml` файлах, вложенных под ключом `exposures:`.

<File name='models/<filename>.yml'>

```yaml
version: 2

exposures:

  - name: weekly_jaffle_metrics
    label: Jaffles by the Week
    type: dashboard
    maturity: high
    url: https://bi.tool/dashboards/1
    description: >
      Did someone say "exponential growth"?

    depends_on:
      - ref('fct_orders')
      - ref('dim_customers')
      - source('gsheets', 'goals')
      - metric('count_orders')

    owner:
      name: Callum McData
      email: data@jaffleshop.com
```

</File>

### Доступные свойства

_Обязательные:_
- **name**: уникальное имя экспозиции, написанное в [snake case](https://en.wikipedia.org/wiki/Snake_case)
- **type**: одно из значений `dashboard`, `notebook`, `analysis`, `ml`, `application` (используется для организации на сайте документации)
- **owner**: требуется `name` или `email`; допускаются дополнительные свойства

_Ожидаемые:_
- **depends_on**: список ссылочных узлов, включая `metric`, `ref` и `source`. Хотя это возможно, маловероятно, что вам когда-либо потребуется, чтобы экспозиция зависела от источника напрямую.

_Необязательные:_
- **label**: может содержать пробелы, заглавные буквы или специальные символы.
- **url**: активирует и заполняет ссылку на **Просмотреть эту экспозицию** в правом верхнем углу сгенерированного сайта документации
- **maturity**: указывает уровень уверенности или стабильности в экспозиции. Одно из значений `high`, `medium` или `low`. Например, вы можете использовать `high` для хорошо зарекомендовавшей себя панели мониторинга, широко используемой и доверяемой в вашей организации. Используйте `low` для нового или экспериментального анализа.

_Общие свойства (необязательные)_
- **description**
- **tags**
- **meta**

### Ссылки на экспозиции

После определения экспозиции вы можете выполнять команды, которые ссылаются на нее:
```
dbt run -s +exposure:weekly_jaffle_report
dbt test -s +exposure:weekly_jaffle_report

```

Когда мы сгенерируем [сайт dbt Explorer](/docs/collaborate/explore-projects), вы увидите экспозицию в списке:

<Lightbox src="/img/docs/building-a-dbt-project/dbt-explorer-exposures.jpg" title="Экспозиции имеют специальный раздел на вкладке 'Ресурсы' в dbt Explorer, который перечисляет каждую экспозицию в вашем проекте."/>
<Lightbox src="/img/docs/building-a-dbt-project/dag-exposures.png" title="Экспозиции отображаются как узлы в DAG dbt Explorer. Внутри узла отображается оранжевый индикатор 'EXP'."/>

## Связанные документы

* [Свойства экспозиции](/reference/exposure-properties)
* [`exposure:` метод выбора](/reference/node-selection/methods#exposure)
* [Плитки состояния данных](/docs/collaborate/data-tile)