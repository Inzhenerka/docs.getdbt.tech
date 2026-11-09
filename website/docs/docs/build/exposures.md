---
title: "Добавление экспозиций в ваш DAG"
sidebar_label: "Экспозиции"
id: "exposures"
availability: all_users
---

Экспозиции позволяют определить и описать использование вашего dbt проекта на последующих этапах, например, в дашборде, приложении или в конвейере обработки данных. Определив экспозиции, вы можете:
- запускать, тестировать и перечислять ресурсы, которые питают вашу экспозицию
- заполнять специальную страницу на автоматически сгенерированном [сайте документации](/docs/build/documentation) с контекстом, актуальным для потребителей данных

Экспозиции можно определять двумя способами:
- Вручную &mdash; [Явно объявлять](/docs/build/exposures#declaring-an-exposure) в YAML-файлах вашего проекта.
- Автоматически &mdash;  <Constant name="dbt" /> автоматически [создаёт и визуализирует экспозиции нижестоящих систем](/docs/platform-integrations/downstream-exposures) для поддерживаемых интеграций, избавляя от необходимости вручную определять их в YAML. Эти экспозиции нижестоящих систем хранятся в системе метаданных dbt, отображаются в [<Constant name="catalog" />](/docs/explore/explore-projects) и ведут себя так же, как экспозиции, определённые вручную. Однако в YAML-файлах их нет.

### Объявление exposure {#declaring-an-exposure}

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

### Доступные свойства {#available-properties}

_Обязательные:_
- **name**: уникальное имя экспозиции, написанное в [snake case](https://en.wikipedia.org/wiki/Snake_case)
- **type**: одно из `dashboard`, `notebook`, `analysis`, `ml`, `application` (используется для организации на сайте документации)
- **owner**: требуется `name` или `email`; допускаются дополнительные свойства

_Ожидаемые:_
- **depends_on**: список узлов, на которые можно ссылаться, включая `metric`, `ref` и `source`. Хотя это возможно, крайне маловероятно, что вам когда-либо понадобится, чтобы `exposure` зависела непосредственно от `source`.

:::tip
  Не путайте это YAML-свойство `depends_on` с [`-- depends_on`](/reference/dbt-jinja-functions/statement-blocks#%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8-%D0%B1%D0%B5%D0%B7-%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B5%D0%BD%D0%B8%D1%8F-%D1%80%D0%B5%D0%B7%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%82%D0%BE%D0%B2) — директивой в виде SQL-комментария, заданной в начале SQL-файла модели, которая явно добавляет зависимости в DAG и гарантирует, что указанные ресурсы будут созданы до выполнения модели.
  :::

_Необязательные свойства:_
- **label**:  Может содержать пробелы, заглавные буквы или специальные символы.
- **url**:  Активирует ссылку **Просмотреть эту экспозицию** в правом верхнем углу сгенерированного сайта документации и задаёт её адрес
- **maturity**: Указывает уровень доверия к экспозиции или её стабильности. Допустимые значения: `high`, `medium` или `low`. Например, уровень зрелости `high` можно использовать для устоявшегося дашборда, который широко используется в вашей организации и пользуется доверием. Используйте уровень зрелости `low` для нового или экспериментального анализа.

_Общие свойства (необязательные)_

- [**description**](/reference/resource-properties/description)
- [**tags**](/reference/resource-configs/tags)
- [**meta**](/reference/resource-configs/meta)
- [**enabled**](/reference/resource-configs/enabled) &mdash; Это свойство можно задать на уровне exposure или на уровне проекта в файле [`dbt_project.yml`](/reference/dbt_project.yml).

### Ссылки на экспозиции {#referencing-exposures}

После определения экспозиции вы можете выполнять команды, ссылаясь на нее:
```
dbt run -s +exposure:weekly_jaffle_report
dbt test -s +exposure:weekly_jaffle_report

```

Когда мы сгенерируем [сайт <Constant name="catalog" />](/docs/explore/explore-projects), вы увидите на нём экспозицию:

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/building-a-dbt-project/dbt-explorer-exposures.png" title="Для экспозиций предусмотрен отдельный раздел под названием проекта в dbt Catalog, в котором перечислены все экспозиции вашего проекта."/>

<Lightbox src="/img/docs/building-a-dbt-project/dag-exposures.png" title="Экспозиции отображаются как узлы в DAG dbt Catalog. Внутри каждого такого узла отображается оранжевый индикатор 'EXP'. "/>

</DocCarousel>

## Связанная документация

- [Свойства Exposure](/reference/exposure-properties)
- [Метод выбора `exposure:`](/reference/node-selection/methods#exposure)
- [Плитки состояния данных](/docs/explore/data-tile)
