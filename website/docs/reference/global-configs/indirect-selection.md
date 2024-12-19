---
title: "Косвенный отбор"
id: "indirect-selection"
sidebar: "Косвенный отбор"
---

import IndirSelect from '/snippets/_indirect-selection-definitions.md';

Используйте флаг `--indirect-selection` для команд `dbt test` или `dbt build`, чтобы настроить, какие тесты запускать для указанных вами узлов. Вы можете установить это как флаг командной строки или как переменную окружения. В dbt Core вы также можете настроить пользовательские конфигурации в [YAML селекторах](/reference/node-selection/yaml-selectors) или в блоке `flags:` файла `dbt_project.yml`, который устанавливает флаги на уровне проекта.

Когда все флаги установлены, порядок приоритета следующий. Дополнительные сведения смотрите в разделе [О глобальных конфигурациях](/reference/global-configs/about-global-configs):

1. Конфигурации CLI
1. Переменные окружения
1. Пользовательские конфигурации

Вы можете установить флаг на: `empty`, `buildable`, `cautious` или `eager` (по умолчанию). По умолчанию dbt косвенно выбирает все тесты, если они затрагивают любой ресурс, который вы выбрали. Узнайте больше об этих опциях в разделе [Косвенный отбор в примерах выбора тестов](/reference/node-selection/test-selection-examples?indirect-selection-mode=eager#indirect-selection).

<IndirSelect features={'/snippets/indirect-selection-definitions.md'}/>

Ниже представлена визуализация влияния `--indirect-selection` и различных флагов с использованием трех моделей, трех тестов и `dbt build` в качестве примера:

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/reference/indirect-selection-dbt-build.png" width="85%" title="dbt build" />

<Lightbox src src="/img/docs/reference/indirect-selection-eager.png" width="85%" title="Eager (по умолчанию)"/>

<Lightbox src src="/img/docs/reference/indirect-selection-buildable.png" width="85%" title="Buildable"/>

<Lightbox src src="/img/docs/reference/indirect-selection-cautious.png" width="85%" title="Cautious"/>

<Lightbox src src="/img/docs/reference/indirect-selection-empty.png" width="85%" title="Empty"/>

</DocCarousel>

Например, вы можете запустить тесты, которые ссылаются только на выбранные узлы, используя конфигурацию CLI:

<File name='Использование'>

```shell
dbt test --indirect-selection cautious
```

</File>

Или вы можете запустить тесты, которые ссылаются только на выбранные узлы, используя переменную окружения:

<File name='Переменная окружения'>

```text

$ export DBT_INDIRECT_SELECTION=cautious
dbt run

```

</File>

Вы также можете запустить тесты, которые ссылаются только на выбранные узлы, используя флаги на уровне проекта в `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml

flags:
  indirect_selection: cautious

```

</File>