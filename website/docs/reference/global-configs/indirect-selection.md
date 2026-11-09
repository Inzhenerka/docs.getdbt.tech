---
title: "Косвенный выбор"
id: "indirect-selection"
sidebar: "Косвенный выбор"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Косвенный выбор определяет, какие тесты запускать при выборе моделей или других ресурсов. Он применяется к тестам, связанным с выбранными ресурсами через зависимости в вашем DAG &mdash; например, к тестам для вышестоящих или нижестоящих моделей, а также к тестам, которые ссылаются на несколько моделей.

Используйте флаг `--indirect-selection` с `dbt test` или `dbt build`, чтобы настроить это поведение. Вы можете задать его как флаг CLI или переменную окружения. В <Constant name="core"/> также можно задать пользовательские настройки в [YAML-селекторах](/reference/node-selection/yaml-selectors) или в блоке `flags:` файла `dbt_project.yml`, который задаёт флаги на уровне проекта.

:::tip Косвенный выбор применяется по умолчанию
Даже если вы явно не используете [флаг `--indirect-selection`](/reference/node-selection/test-selection-examples?indirect-selection-mode=eager#indirect-selection), dbt применяет косвенный выбор при выполнении таких команд, как `dbt test --select "stg_model_a+"`. По умолчанию используется режим `eager`, который запускает все тесты, ссылающиеся на выбранные модели. Например, `dbt test --select model_b` запустит тесты, определённые для `model_b`, а также тесты, определённые для вышестоящих моделей, если эти тесты ссылаются на `model_b`.
:::

Когда все флаги установлены, порядок приоритета следующий. Обратитесь к [О глобальных конфигурациях](/reference/global-configs/about-global-configs) для получения более подробной информации:

1. Конфигурации командной строки
1. Переменные окружения
1. Пользовательские конфигурации

Вы можете задать для флага одно из значений: `empty`, `buildable`, `cautious` или `eager` (по умолчанию). Подробнее об этих вариантах см. в разделе [«Косвенный выбор» в примерах выбора тестов](/reference/node-selection/test-selection-examples?indirect-selection-mode=eager#indirect-selection).

<IndirSelect features={'/snippets/indirect-selection-definitions.md'}/>

Ниже представлена визуализация влияния `--indirect-selection` и различных флагов с использованием трех моделей, трех тестов и `dbt build` в качестве примера:

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/reference/indirect-selection-dbt-build.png" width="85%" title="dbt build" />

<Lightbox src src="/img/docs/reference/indirect-selection-eager.png" width="85%" title="Eager (по умолчанию)"/>

<Lightbox src src="/img/docs/reference/indirect-selection-buildable.png" width="85%" title="Buildable"/>

<Lightbox src src="/img/docs/reference/indirect-selection-cautious.png" width="85%" title="Cautious"/>

<Lightbox src src="/img/docs/reference/indirect-selection-empty.png" width="85%" title="Empty"/>

</DocCarousel>

Например, вы можете запустить тесты, которые относятся только к выбранным узлам, используя конфигурацию командной строки:

<File name='Usage'>

```shell
dbt test --indirect-selection cautious
```

</File>

Или вы можете запустить тесты, которые относятся только к выбранным узлам, используя переменную окружения:

<File name='Env var'>

<VersionBlock lastVersion="1.10">

```text

$ export DBT_INDIRECT_SELECTION=cautious
dbt test

```

</VersionBlock>

<VersionBlock firstVersion="1.11">

```text

$ export DBT_ENGINE_INDIRECT_SELECTION=cautious
dbt run

```

</VersionBlock>

</File>

Вы также можете запустить тесты, которые относятся только к выбранным узлам, используя флаги на уровне проекта в `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml

flags:
  indirect_selection: cautious

```

</File>