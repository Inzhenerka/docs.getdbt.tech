---
title: "Косвенный выбор"
id: "indirect-selection"
sidebar: "Косвенный выбор"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Используйте флаг `--indirect-selection` для `dbt test` или `dbt build`, чтобы настроить, какие тесты запускать для указанных вами узлов. Вы можете установить это как флаг командной строки или переменную окружения. В dbt Core вы также можете настроить пользовательские конфигурации в [YAML селекторах](/reference/node-selection/yaml-selectors) или в блоке `flags:` файла `dbt_project.yml`, который устанавливает флаги на уровне проекта.

Когда все флаги установлены, порядок приоритета следующий. Обратитесь к [О глобальных конфигурациях](/reference/global-configs/about-global-configs) для получения более подробной информации:

1. Конфигурации командной строки
1. Переменные окружения
1. Пользовательские конфигурации

Вы можете установить флаг на: `empty`, `buildable`, `cautious` или `eager` (по умолчанию). По умолчанию, dbt косвенно выбирает все тесты, если они касаются любого ресурса, который вы выбрали. Узнайте больше об этих опциях в [Косвенный выбор в примерах выбора тестов](/reference/node-selection/test-selection-examples?indirect-selection-mode=eager#indirect-selection).

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

```text

$ export DBT_INDIRECT_SELECTION=cautious
dbt run

```

</File>

Вы также можете запустить тесты, которые относятся только к выбранным узлам, используя флаги на уровне проекта в `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml

flags:
  indirect_selection: cautious

```

</File>