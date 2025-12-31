---
title: "Рекомендации по проекту"
sidebar_label: "Рекомендации по проекту"
description: "dbt Catalog предоставляет рекомендации, которые помогут вам повысить качество вашего dbt‑проекта."
---

# Рекомендации по проекту <Lifecycle status="managed,managed_plus" /> {#project-recommendations}
 
<Constant name="explorer" /> предоставляет рекомендации по вашему проекту на основе пакета `dbt_project_evaluator` из [package](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest/), используя метаданные из [Discovery API](/docs/dbt-cloud-apis/discovery-api). 

- <Constant name="explorer" /> также предлагает глобальное представление, показывая все рекомендации по проекту в одном месте для удобной сортировки и обобщения.
- Эти рекомендации дают представление о том, как создать более хорошо документированный, лучше протестированный и более качественно построенный dbt‑проект, повышая доверие и снижая путаницу.
- Для единообразного и согласованного опыта рекомендации используют преднастроенные параметры `dbt_project_evaluator` и не учитывают кастомизации, применённые в вашем пакете или проекте.

import ExplorerCourse from '/snippets/_explorer-course-link.md';

<ExplorerCourse />

## Страница рекомендаций {#recommendations-page}
Обзорная страница рекомендаций включает два основных показателя, измеряющих покрытие тестами и документацией моделей в вашем проекте.

- **Покрытие моделей тестами** &mdash; Процент моделей в вашем проекте (модели, не входящие в пакеты и не импортированные через <Constant name="mesh" />), для которых настроен хотя бы один dbt‑тест.
- **Покрытие моделей документацией** &mdash; Процент моделей в вашем проекте (модели, не входящие в пакеты и не импортированные через <Constant name="mesh" />), у которых есть описание.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-recommendations-overview.png" width="100%" title="Пример обзорной страницы рекомендаций с метриками проекта и рекомендациями для всех ресурсов в проекте"/>

## Список правил {#list-of-rules}
Следующая таблица перечисляет правила, которые в настоящее время определены в пакете `dbt_project_evaluator` [package](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest/).

| Категория | Название | Описание | Ссылка на документацию пакета |
| --- | --- | --- | --- |
| Моделирование | Прямое соединение с источником | Модель, которая соединяет как модель, так и источник, указывая на отсутствие промежуточной модели | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#direct-join-to-source) |
| Моделирование | Дублирующие источники | Более одного узла источника соответствует одной и той же связи в хранилище данных | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#duplicate-sources) |
| Моделирование | Несколько соединенных источников | Модели с более чем одним родительским источником, указывающие на отсутствие промежуточных моделей | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#multiple-sources-joined) |
| Моделирование | Корневая модель | Модели без родителей, указывающие на потенциальные жестко закодированные ссылки и необходимость в источниках | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#root-models) |
| Моделирование | Разветвление источника | Источники с более чем одним дочерним элементом модели, указывающие на необходимость в промежуточных моделях | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#source-fanout) |
| Моделирование | Неиспользуемый источник | Источники, которые не ссылаются ни на один ресурс | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/modeling/#unused-sources) |
| Производительность | Экспозиция, зависящая от представления | Экспозиции с хотя бы одним родительским элементом модели, материализованным как представление, указывающие на потенциальные проблемы с производительностью запросов | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/performance/#exposure-parents-materializations) |
| Тестирование | Отсутствие теста на первичный ключ | Модели с недостаточным тестированием на уровне зерна модели. | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/testing/#missing-primary-key-tests) |
| Документация | Недокументированные модели | Модели без описания на уровне модели | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/documentation/#undocumented-models) |
| Документация | Недокументированный источник | Источники (коллекции исходных таблиц) без описаний | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/documentation/#undocumented-sources) |
| Документация | Недокументированные исходные таблицы | Исходные таблицы без описаний | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/documentation/#undocumented-source-tables) |
| Управление | Публичная модель без контракта | Модели с публичным доступом, которые не имеют контракта модели для обеспечения типов данных | [GitHub](https://dbt-labs.github.io/dbt-project-evaluator/0.8/rules/governance/#public-models-without-contracts) |

## Вкладка рекомендаций {#the-recommendations-tab}

## Вкладка Recommendations

Модели, источники и exposures также имеют вкладку **Recommendations** на странице с деталями ресурса. На этой вкладке отображаются рекомендации, которые относятся именно к данному ресурсу:

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-recommendations-tab.png" width="80%" title="Example of the Recommendations tab "/>
