---
title: "Рекомендации по проекту"
sidebar_label: "Рекомендации по проекту"
description: "dbt Explorer предоставляет рекомендации, которые вы можете использовать для улучшения качества вашего проекта dbt."
---

dbt Explorer предоставляет рекомендации по вашему проекту из пакета `dbt_project_evaluator` [package](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest/) с использованием метаданных из [Discovery API](/docs/dbt-cloud-apis/discovery-api).

- Explorer также предлагает глобальный обзор, показывая все рекомендации по проекту для удобной сортировки и обобщения.
- Эти рекомендации дают представление о том, как вы можете создать лучше документированный, лучше протестированный и лучше построенный проект dbt, что создает больше доверия и меньше путаницы.
- Для бесшовного и последовательного опыта рекомендации используют предопределенные настройки `dbt_project_evaluator` и не импортируют настройки, примененные к вашему пакету или проекту.

import ExplorerCourse from '/snippets/_explorer-course-link.md';

<ExplorerCourse />

## Страница рекомендаций
Страница обзора рекомендаций включает две основные метрики, измеряющие покрытие тестами и документацией моделей в вашем проекте.

- **Покрытие тестами моделей** &mdash; Процент моделей в вашем проекте (модели, не относящиеся к пакету или импортированные через dbt Mesh) с как минимум одним настроенным тестом dbt.
- **Покрытие документацией моделей** &mdash; Процент моделей в вашем проекте (модели, не относящиеся к пакету или импортированные через dbt Mesh) с описанием.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-recommendations-overview.png" width="100%" title="Пример страницы обзора рекомендаций с метриками проекта и рекомендациями для всех ресурсов в проекте"/>

## Список правил
В следующей таблице перечислены правила, в настоящее время определенные в пакете `dbt_project_evaluator` [package](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest/).

| Категория | Название | Описание | Ссылка на документацию пакета |
| --- | --- | --- | --- |
| Моделирование | Прямое соединение с источником | Модель, которая соединяет как модель, так и источник, указывая на отсутствие промежуточной модели | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#direct-join-to-source) |
| Моделирование | Дублирующиеся источники | Более одного узла источника соответствует одной и той же связи в хранилище данных | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#duplicate-sources) |
| Моделирование | Соединенные несколько источников | Модели с более чем одним родительским источником, указывая на отсутствие промежуточных моделей | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#multiple-sources-joined) |
| Моделирование | Корневая модель | Модели без родителей, указывая на потенциальные жестко закодированные ссылки и необходимость в источниках | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#root-models) |
| Моделирование | Распределение источников | Источники с более чем одной дочерней моделью, указывая на необходимость в промежуточных моделях | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#source-fanout) |
| Моделирование | Неиспользуемый источник | Источники, на которые не ссылается ни один ресурс | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#unused-sources) |
| Производительность | Экспозиция, зависящая от представления | Экспозиции с как минимум одной родительской моделью, материализованной как представление, указывая на потенциальные проблемы с производительностью запросов | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/performance/#exposure-parents-materializations) |
| Тестирование | Отсутствие теста первичного ключа | Модели с недостаточным тестированием на уровне модели. | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/testing/#missing-primary-key-tests) |
| Документация | Модели без документации | Модели без описания на уровне модели | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/documentation/#undocumented-models) |
| Документация | Источник без документации | Источники (коллекции таблиц источников) без описаний | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/documentation/#undocumented-sources) |
| Документация | Таблицы источников без документации | Таблицы источников без описаний | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/documentation/#undocumented-source-tables) |
| Управление | Публичная модель без контракта | Модели с публичным доступом, которые не имеют контракта модели для обеспечения типов данных | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/governance/#public-models-without-contracts) |

## Вкладка Рекомендации

Модели, источники и экспозиции также имеют вкладку **Рекомендации** на странице деталей их ресурса, с конкретными рекомендациями, которые соответствуют этому ресурсу:

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-recommendations-tab.png" width="80%" title="Пример вкладки Рекомендации "/>