---
title: "Сценарии использования dbt Wizard"
id: "wizard-use-cases"
description: "Практические сценарии аналитической инженерии для dbt Wizard — от создания новых моделей до диагностики сбоев."
sidebar_label: "Сценарии использования и примеры"
tags: [AI, Wizard]
availability: all_users
---

<IntroText>
Типичные сценарии использования <Constant name="wizard" /> с примерами запросов и описанием ожидаемых результатов. <WizardPopcorn>Книга заклинаний</WizardPopcorn> не понадобится.
</IntroText>

<Constant name="wizard" /> работает лучше всего, когда вы чётко задаёте область задачи (модель dbt или часть проекта), цель (что вы хотите изменить или узнать) и ограничения (соглашения об именовании, материализация, тесты). Приведённые ниже примеры следуют этому подходу.

Начинайте новый [чат или сеанс](/best-practices/how-to-use-wizard/wizard-1-intro#use-one-chat-per-task) для каждой отдельной задачи. Например, создание модели и диагностика не связанного с ней сбоя задания должны обсуждаться в двух отдельных диалогах.

<!-- no toc -->
- [Создание новой модели](#build-a-new-model)
- [Переход на инкрементальную материализацию](#refactor-to-incremental)
- [Добавление тестов и документации](#add-tests-and-docs)
- [Диагностика сбоя задания](#debug-a-job-failure)
- [Оценка влияния изменений источника](#assess-source-impact)
- [Переименование столбца во всём проекте](#rename-a-column-project-wide)
- [Изменения в нескольких файлах](#multi-file-changes)
- [Проверка перед выпуском](#validate-before-shipping)
- [Добавление семантической модели](#add-a-semantic-model)

Эти запросы работают одинаково во всех интерфейсах &mdash; в [CLI](/docs/dbt-ai/wizard-cli), в [Wizard Desktop](/docs/dbt-ai/wizard-desktop) и в <Constant name="wizard" /> на [<Constant name="dbt_platform" />](/docs/platform/wizard-platform). Примеры для Studio IDE приведены в [Сборнике запросов](/guides/prompt-cookbook). Для работы с <Constant name="wizard" /> в CLI используйте [справочник команд](/docs/dbt-ai/wizard-cli-reference) `wizard`.


:::tip Рекомендации по использованию dbt Wizard
После настройки ознакомьтесь с руководством [Как использовать dbt Wizard в проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro), где описаны рекомендуемые рабочие процессы для реальных задач проекта.
:::

## Создание новой модели {#build-a-new-model}

У вас есть очищенные исходные данные, и вы хотите создать новую модель витрины данных, не прописывая весь SQL вручную.

**Пример запроса:**

```text
Create a model called `fct_monthly_revenue` that joins `stg_orders` and `stg_payments`,
groups by `month` and `customer_id`, and materializes as a table. Add `not_null` tests
to the primary key and a unique test on the grain.
```

**Что делает <Constant name="wizard" />:**
1. Читает `stg_orders` и `stg_payments` из индекса вашего проекта, чтобы определить доступные столбцы
2. Генерирует `fct_monthly_revenue.sql` с логикой соединения и агрегации
3. Создаёт соответствующий блок YAML с запрошенными тестами
4. Показывает различия для обоих файлов — изменения сохраняются только после вашего одобрения

**Советы:**
- Указывайте имена существующих staging-моделей, чтобы <Constant name="wizard" /> использовал нужные столбцы
- Если в вашем проекте есть командное руководство по стилю в `.agents/skills/`, <Constant name="wizard" /> автоматически находит его и применяет соглашения об именовании и материализации


## Переход на инкрементальную материализацию {#refactor-to-incremental}

Полное обновление витрины данных занимает всё больше времени. Вы хотите перевести её на инкрементальную материализацию, не нарушив работу существующих тестов.

**Пример запроса:**

```
Refactor `fct_orders` to use incremental materialization with a `unique_key` on `order_id`
and an updated_at filter. Keep all existing tests and don't change the output schema.
```

**Что делает <Constant name="wizard" />:**
1. Читает текущий файл `fct_orders.sql` и его YAML
2. Переписывает модель, добавляя фильтр `{% if is_incremental() %}`
3. Добавляет настройки `unique_key` и `materialized = 'incremental'`
4. Отмечает существующие тесты, поведение которых может измениться при инкрементальных запусках

**Советы:**
- Укажите <Constant name="wizard" />, какой столбец использовать для отслеживания последнего обработанного значения: он может выбрать подходящий столбец на основе вашей схемы, но явное указание надёжнее
- Попросите добавить примечание о `full_refresh` в описание модели, чтобы те, кто будет сопровождать её в дальнейшем, понимали замысел


## Добавление тестов и документации {#add-tests-and-docs}

Вам досталась модель без тестов и YAML. Вы хотите обеспечить покрытие тестами, не создавая шаблонный код вручную.

**Пример запроса:**

```
Generate tests and documentation for dim_customers. Add not_null and unique on
customer_id, not_null on email, and accepted_values on customer_status with values
active, churned, and prospect. Write a column description for each.
```

**Что делает <Constant name="wizard" />:**
1. Читает `dim_customers.sql` и существующие файлы YAML, если они есть
2. Генерирует полный файл `dim_customers.yml` с описанием модели, описаниями столбцов и указанными вами тестами
3. Формулирует подходящие описания на основе имён столбцов — вы проверяете и редактируете их перед одобрением

**Советы:**
- Вы можете попросить <Constant name="wizard" /> писать описания в определённом стиле или формате: «Напиши описания простым языком, по одному предложению на каждое»
- Чтобы документировать целый слой сразу: «Создай документацию для всех моделей в `models/staging/`, у которых ещё нет файла YAML»

Рабочий процесс поиска пробелов в покрытии тестами и проверки предполагаемых условий на данных хранилища описан в руководстве [Добавление тестов на основе данных с помощью <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-4-data-informed-tests).


## Диагностика сбоя задания {#debug-a-job-failure}

Ночью произошёл сбой задания в <Constant name="dbt_platform" />. Вы хотите понять причину, не просматривая журналы вручную.

**Пример запроса:**

```
The nightly job failed. What's the root cause and how do I fix it?
```

**Что делает <Constant name="wizard" />:**
1. Использует предоставленные вами данные о запуске или подключённые инструменты dbt MCP, чтобы получить и изучить подробности запуска задания
2. Определяет модель, в которой произошёл сбой, сообщение об ошибке и вероятную причину
3. Предлагает исправление и показывает различия
4. Сообщает, если ваша локальная ветка отличается от ветки задания, чтобы у вас был полный контекст

**Советы:**
- Можно задать более конкретный вопрос: «Что вызвало сбой в `fct_orders` при последнем запуске задания Production?»
- Wizard не применит исправление без вашего одобрения, что особенно полезно, если сбой произошёл в модели рабочей среды

Процедура сбора диагностических данных, поиска причины и проверки описана в руководстве [Диагностика сбоя задания dbt с помощью <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-5-debug-failed-job).


## Оценка влияния изменений источника {#assess-source-impact}

Перед изменением модели stg вы хотите узнать, какие зависимые модели могут быть затронуты.

**Пример запроса:**

```
If I change the grain of stg_payments from one row per payment to one row per
payment attempt, which downstream models break?
```

**Что делает <Constant name="wizard" />:**
1. Выполняет запрос к графу происхождения данных и анализирует влияние изменений в вашем проекте, чтобы найти все ресурсы, зависящие от `stg_payments`
2. Определяет, какие модели выполняют соединение по ключам уровня платежа и будут затронуты изменением уровня детализации
3. Перечисляет модели по степени критичности — сначала витрины данных и exposures, затем промежуточные модели
4. Предлагает, какие модели нужно обновить в рамках изменения

**Советы:**
- Необязательно точно описывать изменение: даже вопрос «Что зависит от stg_payments?» позволяет оценить область его влияния
- Продолжите запросом: «Напиши план миграции для безопасного внесения этого изменения»

## Переименование столбца во всём проекте {#rename-a-column-project-wide}

Столбец в источнике переименован. Вам нужно обновить все ссылки на него, ничего не пропустив.

**Пример запроса:**

```
The source column user_id in raw_customers has been renamed to customer_id.
Update stg_customers and find any downstream models that reference user_id directly.
```

**Что делает <Constant name="wizard" />:**
1. Обновляет псевдоним столбца в `stg_customers.sql`
2. Ищет прямые ссылки на `user_id` в зависимых моделях
3. Предлагает обновления для всех моделей, работа которых будет нарушена
4. Приводит описания столбцов в YAML в соответствие с изменениями

**Советы:**
- Всегда запускайте `dbt compile` после изменений, внесённых <Constant name="wizard" />, чтобы обнаружить ссылки, которые он мог пропустить
- Для более полного охвата попросите Wizard «также проверить наличие user_id в любых строках с SQL-кодом или макросах Jinja»

## Изменения в нескольких файлах {#multi-file-changes}

Вам нужно внести изменение, затрагивающее сразу несколько файлов, — переименовать модель, обновить контракт или изменить схему — и сохранить согласованность всех связанных файлов.

**Пример запроса:**

```
Rename dim_users to dim_customers. Update the model file, its YAML, every
downstream ref(), the tests, the documentation, and any exposures that point to it.
```

**Что делает <Constant name="wizard" />:**
1. Переименовывает `dim_users.sql` в `dim_customers.sql`
2. Обновляет имя модели в соответствующем YAML
3. Ищет в проекте `ref('dim_users')` и переписывает каждое вхождение
4. Обновляет все тесты, блоки docs и exposures, которые ссылаются на старое имя
5. Компилирует проект, чтобы убедиться в корректности всех ссылок, прежде чем показать вам различия
6. Отмечает всё, что не удалось обновить автоматически (например, строки с SQL-кодом или внешние дашборды)

**Советы:**
- Изменения в нескольких файлах согласуются как единый набор различий: проверяйте их вместе, а не по отдельным файлам
- При изменении типа столбца или схемы явно указывайте новый тип: «Измени тип `order_amount` в `fct_orders` с `numeric` на `decimal(18,2)` и обнови зависимые модели и тесты»


## Проверка перед выпуском {#validate-before-shipping}

Для изменений, где корректность важнее скорости, попросите <Constant name="wizard" /> оценить влияние и проверить результат в контексте вашего проекта.

**Пример запроса:**

```
Add not_null and unique tests to the primary key of dim_customers. Use heavy
validation, investigate any failures, and summarize skipped checks.
```

**Что делает <Constant name="wizard" />:**
1. Генерирует YAML для новых тестов
2. Оценивает затронутые ресурсы и предлагает план проверки
3. Выполняет одобренные шаги компиляции, сборки, тестирования и сравнения для выбранного уровня проверки
4. Сообщает о сбоях, различиях, неустранённых рисках и пропущенных проверках
5. Показывает предложенные изменения для вашей проверки

В CLI <Constant name="wizard" /> выбирайте уровень проверки light, medium, heavy или skipped в зависимости от риска и стоимости изменения. Перечень проверок для каждого уровня приведён в [описании процесса проверки](/best-practices/how-to-use-wizard/wizard-3-validate-changes).

**Советы:**
- Указывайте, какое поведение с точки зрения бизнеса должно сохраниться, а не только какие команды нужно выполнить

## Добавление семантической модели {#add-a-semantic-model}

У вас есть модель витрины данных, и вы хотите предоставить к ней доступ через dbt Semantic Layer.

**Пример запроса:**

```
Create a semantic model for fct_orders. Include a revenue metric that sums
order_total, a count of orders, and time dimensions on order_date at day,
week, and month granularity.
```

**Что делает <Constant name="wizard" />:**
1. Читает `fct_orders.sql` и его YAML, чтобы определить доступные столбцы
2. Определяет версию dbt и выбирает совместимую структуру YAML для Semantic Layer
3. Предлагает сущности, измерения и метрики на основе уровня детализации модели и бизнес-запроса
4. Добавляет одобренные вами определения и проверяет их ссылки

**Советы:**
- Если вы не уверены, какие сущности использовать, сначала спросите: «Какие сущности подойдут для семантической модели на основе fct_orders?»
- <Constant name="wizard" /> следует [документации dbt Semantic Layer](/docs/build/semantic-models): вы можете попросить его объяснить любое сгенерированное поле

Примеры для конкретных версий и шаги проверки приведены в руководстве [Создание определений Semantic Layer с помощью <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-7-semantic-layer).

## Связанная документация

- [Начало работы с dbt Wizard](/docs/platform/wizard-overview#get-started)
- [Изучение проекта dbt](/best-practices/how-to-use-wizard/wizard-2-understand-project)
- [Проверка изменений dbt](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
- [Добавление тестов на основе данных](/best-practices/how-to-use-wizard/wizard-4-data-informed-tests)
- [Диагностика сбоя задания](/best-practices/how-to-use-wizard/wizard-5-debug-failed-job)
- [Создание определений Semantic Layer](/best-practices/how-to-use-wizard/wizard-7-semantic-layer)
- [Обзор dbt Wizard](/docs/dbt-ai/wizard-cli)
- [Настройка BYOK](/docs/dbt-ai/wizard-byok)
- [dbt Wizard в Studio IDE](/docs/dbt-ai/wizard-ide): тот же агент на платформе dbt
- [Сборник запросов](/guides/prompt-cookbook): дополнительные шаблоны запросов для dbt Wizard в Studio IDE (многие также подходят для CLI)
