---
title: "Добавление экспозиций в ваш DAG"
sidebar_label: "Экспозиции"
id: "exposures"
---

Экспозиции позволяют определить и описать использование вашего dbt проекта на последующих этапах, например, в дашборде, приложении или в конвейере обработки данных. Определив экспозиции, вы можете:
- запускать, тестировать и перечислять ресурсы, которые питают вашу экспозицию
- заполнять специальную страницу на автоматически сгенерированном [сайте документации](/docs/build/documentation) с контекстом, актуальным для потребителей данных

### Объявление экспозиции

Экспозиции определяются в файлах `.yml`, вложенных под ключом `exposures:`.

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
      Кто-то сказал "экспоненциальный рост"?

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
- **type**: одно из `dashboard`, `notebook`, `analysis`, `ml`, `application` (используется для организации на сайте документации)
- **owner**: требуется `name` или `email`; допускаются дополнительные свойства

_Ожидаемые:_
- **depends_on**: список узлов, на которые можно ссылаться, включая `metric`, `ref` и `source`. Хотя это возможно, крайне маловероятно, что вам когда-либо понадобится, чтобы `exposure` зависела непосредственно от `source`.

_Необязательные:_
- **label**: может содержать пробелы, заглавные буквы или специальные символы.
- **url**: активирует и заполняет ссылку на **Просмотр этой экспозиции** в правом верхнем углу сгенерированного сайта документации
- **maturity**: указывает уровень уверенности или стабильности экспозиции. Одно из `high`, `medium` или `low`. Например, вы можете использовать `high` для хорошо зарекомендовавшего себя дашборда, широко используемого и доверенного в вашей организации. Используйте `low` для нового или экспериментального анализа.

_Общие свойства (необязательные)_
- **description**
- **tags**
- **meta**

### Ссылки на экспозиции

После определения экспозиции вы можете выполнять команды, ссылаясь на нее:
```
dbt run -s +exposure:weekly_jaffle_report
dbt test -s +exposure:weekly_jaffle_report

```

Когда мы генерируем [сайт dbt Explorer](/docs/collaborate/explore-projects), вы увидите, что экспозиция появляется:

<Lightbox src="/img/docs/building-a-dbt-project/dbt-explorer-exposures.jpg" title="Экспозиции имеют отдельный раздел под вкладкой 'Resources' в dbt Explorer, где перечислены все экспозиции в вашем проекте."/>
<Lightbox src="/img/docs/building-a-dbt-project/dag-exposures.png" title="Экспозиции отображаются как узлы в DAG dbt Explorer. Внутри узла отображается оранжевый индикатор 'EXP'."/>

## Связанные документы

* [Свойства экспозиции](/reference/exposure-properties)
* [Метод выбора `exposure:`](/reference/node-selection/methods#exposure)
* [Плитки здоровья данных](/docs/collaborate/data-tile)