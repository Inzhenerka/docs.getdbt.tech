---
title: "Изучение проекта dbt с помощью dbt Wizard"
id: "wizard-2-understand-project"
description: "Используйте dbt Wizard CLI, чтобы разобраться в структуре незнакомого проекта dbt, исследовать поведение моделей и определить влияние на зависимые ресурсы."
sidebar_label: "Изучение проекта dbt"
tags: [AI, Wizard]
---


<IntroText>

Используйте <Constant name="wizard" / >, чтобы перейти от общего обзора проекта к подтвержденным фактам о логике моделей, связях между ресурсами, тестах и данных.
</IntroText>

Этот рабочий процесс полезен, когда вы присоединяетесь к проекту, изучаете незнакомую часть DAG, готовитесь к рефакторингу или выясняете, для чего существует модель.

## Предварительные требования

Запустите <Constant name="wizard" /> из корневого каталога проекта dbt и убедитесь, что в проекте есть актуальный файл `target/manifest.json`. Инструкции по настройке см. в разделе [Установка CLI <Constant name="wizard" />](/docs/dbt-ai/wizard-cli).

Если вы хотите, чтобы <Constant name="wizard" /> исследовал результаты запросов к хранилищу данных, вам также понадобятся работающее подключение к среде разработки и разрешение на выполнение запросов к соответствующим отношениям.

Промпты на этой странице работают точно так же и в <Constant name="dbt_platform" />.

## Начните с обзора проекта

Прежде чем сужать область исследования, запросите обзор ресурсов проекта без внесения изменений:

```text
Map this dbt project for a new analytics engineer. Identify the main model
layers, important sources, high fan-out models, test coverage gaps, and the
three areas that deserve careful review. Cite the files and metadata you used.
Do not edit anything.
```

Это даст вам исходную гипотезу, а не полную спецификацию проекта. Задавайте уточняющие вопросы о любых обозначениях или утверждениях об архитектуре, которые не подтверждаются кодом, конфигурацией или метаданными.

## Исследуйте отдельную модель

Укажите название модели и попросите <Constant name="wizard" /> связать ее определение с ее местом в DAG:

```text
Explain fct_orders to me. Describe its grain, inputs, important transformations,
tests, materialization, and direct downstream consumers. Point out anything the
code does not make clear.
```

Для тщательного исследования <Constant name="wizard" /> может:

1. Найти модель и связанные с ней YAML-файлы, тесты, макросы и конфигурацию.
2. Описать выбранные столбцы, SQL, материализацию и зависимости.
3. Проследить входные данные и зависимые ресурсы по графу зависимостей проекта.
4. Запросить структурированные метаданные проекта, чтобы проверить покрытие тестами и свойства ресурсов.
5. Просмотреть данные в хранилище или подготовить сводку по ним, если доступны подключение и соответствующее отношение.

Попросите <Constant name="wizard" /> отделять наблюдаемые факты от предположений. Например:

```text
For each conclusion, label it as code, metadata, warehouse evidence, or an
inference. List the business questions I still need to ask the model owner.
```

## Проследите реализацию бизнес-понятия

Для начала необязательно знать название модели. Опишите понятие и позвольте <Constant name="wizard" /> найти подходящие ресурсы:

```text
Trace how recurring revenue is calculated from source to final mart. Include
the models, columns, macros, tests, and metrics involved. Call out where the
definition changes or where multiple definitions exist.
```

Если найдено несколько подходящих вариантов, попросите <Constant name="wizard" /> показать их и объяснить, почему каждый из них может быть релевантен, прежде чем продолжать.

## Оцените влияние изменений

Разобравшись в текущем поведении, проверьте предлагаемое изменение без редактирования файлов:

```text
What would be affected if stg_payments changed from one row per payment to one
row per payment attempt? Identify direct and indirect downstream resources,
grain-dependent joins, tests, metrics, and exposures. Do not make changes.
```

Используйте результат, чтобы определить охват плана изменений. Модели с большим числом зависимых ресурсов, контракты, метрики, exposures и соединения, зависящие от изменяемого уровня детализации, требуют более тщательного рассмотрения.

## Проверьте предположения с помощью данных

SQL и метаданные показывают предполагаемое поведение. Данные в хранилище помогут проверить, соответствует ли оно текущим результатам:

```text
Check whether fct_orders is currently one row per order_id and summarize nulls
or duplicates in its key columns. Use the smallest reasonable query and show
me the query before running it.
```

Рассматривайте текущие данные как свидетельство о настоящем состоянии, а не как постоянную гарантию. Выборка, фильтры, неактуальные отношения и различия между средами могут повлиять на результат.

## Превратите выводы в план

Завершите исследование сводкой для передачи другому инженеру, которую он сможет проверить:

```text
Summarize what we learned, unresolved business questions, affected resources,
and a safe implementation and validation plan. Keep facts separate from
recommendations. Do not edit files yet.
```

Сводка должна включать соответствующие пути к файлам, названия моделей, охват графа зависимостей, подтверждающие сведения и явно обозначенные неизвестные.

## Учитывайте, каких сведений может не хватать

<Constant name="wizard" /> может делать выводы на основе проекта и инструментов, подключенных к сеансу. Он не может надежно восстановить контекст, который в них не представлен, в том числе:

- Недокументированные бизнес-определения и решения о том, кто отвечает за ресурсы.
- Зависимости дашбордов или приложений, которые не представлены в виде exposures или подключенных метаданных.
- Поведение хранилища данных, которое нельзя проверить запросами через текущее подключение.
- Причину принятого ранее проектного решения, если она не зафиксирована в коде, документации или истории версий.
- Гарантии качества данных, для которых нет соответствующих тестов или контрактов.

Чтобы восполнить эти пробелы, обращайтесь к владельцам моделей, истории pull request и бизнес-документации.

## Связанная документация

- [Проверка изменений dbt с помощью <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
- [Сценарии использования <Constant name="wizard" />](/docs/dbt-ai/wizard-use-cases)
- [Как работает <Constant name="wizard" />](/docs/dbt-ai/wizard-how-it-works)
- [Об управлении моделями](/docs/mesh/govern/about-model-governance)
