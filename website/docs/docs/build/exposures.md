---
title: "Добавление экспозиций в ваш DAG"
sidebar_label: "Экспозиции"
id: "exposures"
---

Экспозиции позволяют определить и описать использование вашего dbt проекта на последующих этапах, например, в дашборде, приложении или в конвейере обработки данных. Определив экспозиции, вы можете:
- запускать, тестировать и перечислять ресурсы, которые питают вашу экспозицию
- заполнять специальную страницу на автоматически сгенерированном [сайте документации](/docs/build/documentation) с контекстом, актуальным для потребителей данных

Exposures можно определить двумя способами:
- **Вручную** — объявляются [явно](/docs/build/exposures#declaring-an-exposure) в YAML-файлах вашего проекта.
- **Автоматически** — <Constant name="cloud" /> автоматически [создаёт и визуализирует downstream exposures](/docs/cloud-integrations/downstream-exposures) для поддерживаемых интеграций, устраняя необходимость в ручном описании YAML. Эти downstream exposures хранятся в системе метаданных dbt, отображаются в [<Constant name="explorer" />](/docs/explore/explore-projects) и ведут себя так же, как и вручную объявленные exposures. Однако они не существуют в виде YAML-файлов.

### Объявление exposure

Экспозиции определяются в файлах `.yml`, вложенных под ключом `exposures:`.

Следующий пример показывает определение exposure в файле `models/<filename>.yml`:

<File name='models/<filename>.yml'>

```yaml

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

- [**description**](/reference/resource-properties/description)
- [**tags**](/reference/resource-configs/tags)
- [**meta**](/reference/resource-configs/meta)
- [**enabled**](/reference/resource-configs/enabled) &mdash; Это свойство можно задать на уровне exposure или на уровне проекта в файле [`dbt_project.yml`](/reference/dbt_project.yml).

### Ссылки на экспозиции

После определения экспозиции вы можете выполнять команды, ссылаясь на нее:
```
dbt run -s +exposure:weekly_jaffle_report
dbt test -s +exposure:weekly_jaffle_report

```

Когда мы генерируем [сайт <Constant name="explorer" />](/docs/explore/explore-projects), вы увидите, что exposure отображается следующим образом:

<Lightbox src="/img/docs/building-a-dbt-project/dbt-explorer-exposures.jpg" title="Exposures имеют отдельный раздел во вкладке 'Resources' в dbt Catalog, где перечислены все exposure в вашем проекте."/>
<Lightbox src="/img/docs/building-a-dbt-project/dag-exposures.png" title="Exposures отображаются как узлы в DAG dbt Catalog. Внутри узла показывается оранжевый индикатор 'EXP'."/>

## Связанные документы

- [Свойства Exposure](/reference/exposure-properties)
- [Метод выбора `exposure:`](/reference/node-selection/methods#exposure)
- [Плитки состояния данных](/docs/explore/data-tile)
