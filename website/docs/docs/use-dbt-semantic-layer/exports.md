---
title: "Написание запросов с экспортами"
description: "Используйте экспорты для записи таблиц на платформу данных по расписанию."
sidebar_label: "Написание запросов с экспортами"
keywords: [DBT_INCLUDE_SAVED_QUERY, экспорты, DBT_EXPORTS_SAVED_QUERY, dbt Cloud, Семантический слой]
---

Экспорты улучшают [сохраненные запросы](/docs/build/saved-queries), выполняя ваши сохраненные запросы и записывая результат в таблицу или представление в вашей платформе данных. Сохраненные запросы позволяют сохранять и повторно использовать часто используемые запросы в MetricFlow, а экспорты расширяют эту функциональность, позволяя:

- Записывать эти запросы в вашей платформе данных с использованием планировщика заданий dbt Cloud.
- Обеспечивать путь интеграции для инструментов, которые не поддерживают семантический слой dbt, предоставляя таблицы метрик и измерений.

По сути, экспорты подобны любым другим таблицам в вашей платформе данных &mdash; они позволяют вам запрашивать определения метрик через любой SQL-интерфейс или подключаться к инструментам нижнего уровня без полноценной [интеграции семантического слоя](/docs/cloud-integrations/avail-sl-integrations). Запуск экспорта учитывается в использовании [запрашиваемых метрик](/docs/cloud/billing#what-counts-as-a-queried-metric). Запрос результирующей таблицы или представления из экспорта не учитывается в использовании запрашиваемых метрик.

## Предварительные условия

- У вас есть учетная запись dbt Cloud на плане [Team или Enterprise](https://www.getdbt.com/pricing/).
- Вы используете одну из следующих платформ данных: Snowflake, BigQuery, Databricks или Redshift.
- Вы используете [версию dbt](/docs/dbt-versions/upgrade-dbt-version-in-cloud) 1.7 или новее.
- У вас настроен [семантический слой dbt](/docs/use-dbt-semantic-layer/setup-sl) в вашем проекте dbt.
- У вас есть среда dbt Cloud с включенным [планировщиком заданий](/docs/deploy/job-scheduler).
- У вас есть [сохраненный запрос](/docs/build/saved-queries) и [настроенный экспорт](/docs/build/saved-queries#configure-exports) в вашем проекте dbt. В вашей конфигурации используйте [кэширование](/docs/use-dbt-semantic-layer/sl-cache) для кэширования общих запросов, ускорения производительности и снижения затрат на вычисления.
- У вас установлен [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). Обратите внимание, что экспорты пока не поддерживаются в dbt Cloud IDE.

## Преимущества экспортов

Следующий раздел объясняет основные преимущества использования экспортов, включая:
- [DRY представление](#dry-представление)
- [Упрощенные изменения](#упрощенные-изменения)
- [Кэширование](#кэширование)

#### DRY представление

В настоящее время создание таблиц часто включает генерацию десятков, сотен или даже тысяч таблиц, которые денормализуют данные в сводные или метриковые таблицы. Основное преимущество экспортов заключается в создании представления "Don't Repeat Yourself (DRY)" логики для построения каждой метрики, измерения, соединения, фильтра и т.д. Это позволяет повторно использовать эти компоненты для долгосрочной масштабируемости, даже если вы заменяете вручную написанные SQL-модели ссылками на метрики или измерения в сохраненных запросах.

#### Упрощенные изменения

Экспорты гарантируют, что изменения в метриках и измерениях вносятся в одном месте и затем каскадно распространяются на различные назначения. Это предотвращает проблему необходимости обновления метрики во всех моделях, которые ссылаются на эту же концепцию.

#### Кэширование 
Используйте экспорты для предварительного заполнения кэша, чтобы предварительно вычислить то, что вам нужно для обслуживания пользователей через динамические API семантического слоя.

#### Соображения

Экспорты предлагают множество преимуществ, и важно отметить некоторые случаи использования, которые выходят за рамки этих преимуществ:
- Бизнес-пользователи все еще могут испытывать трудности с потреблением из десятков, сотен или тысяч таблиц, и выбор правильной может быть сложной задачей.
- Бизнес-пользователи также могут совершать ошибки при агрегации и фильтрации из предварительно построенных таблиц.

Для этих случаев используйте динамические [API семантического слоя dbt](/docs/dbt-cloud-apis/sl-api-overview) вместо экспортов.

## Запуск экспортов

Прежде чем вы сможете запускать экспорты в разработке или производстве, вам нужно убедиться, что вы [настроили сохраненные запросы и экспорты](/docs/build/saved-queries) в вашем проекте dbt. В вашей конфигурации сохраненного запроса вы также можете использовать [кэширование](/docs/use-dbt-semantic-layer/sl-cache) с планировщиком заданий dbt Cloud для кэширования общих запросов, ускорения производительности и снижения затрат на вычисления.

Существует два способа запуска экспорта:
  
- [Запуск экспортов в разработке](#экспорты-в-разработке) с использованием [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) для тестирования результата перед производством (Вы можете настроить экспорты в dbt Cloud IDE, однако их запуск непосредственно в IDE пока не поддерживается). Если вы используете dbt Cloud IDE, используйте `dbt build` для запуска экспортов. Убедитесь, что у вас включена [переменная окружения](#установка-переменной-окружения). 
- [Запуск экспортов в производстве](#экспорты-в-производстве) с использованием [планировщика заданий dbt Cloud](/docs/deploy/job-scheduler) для записи этих запросов в вашей платформе данных.

## Экспорты в разработке

Вы можете запустить экспорт в вашей среде разработки, используя ваши учетные данные разработки, если вы хотите протестировать результат экспорта перед производством. 

Этот раздел объясняет различные команды и опции, доступные для запуска экспортов в разработке.

- Используйте команду [`dbt sl export`](#экспорты-для-одного-сохраненного-запроса) для тестирования и генерации экспортов в вашей среде разработки для одного сохраненного запроса. Вы также можете использовать флаг `--select`, чтобы указать конкретные экспорты из сохраненного запроса.

- Используйте команду [`dbt sl export-all`](#экспорты-для-нескольких-сохраненных-запросов), чтобы запускать экспорты для нескольких сохраненных запросов одновременно. Эта команда предоставляет удобный способ управления и выполнения экспортов для нескольких запросов одновременно, экономя время и усилия. 

### Экспорты для одного сохраненного запроса

Используйте следующую команду для запуска экспортов в dbt Cloud CLI:

```bash
dbt sl export
```

Следующая таблица перечисляет параметры команды `dbt sl export`, используя префикс флага `--` для указания параметров:  

| Параметры | Тип    | Обязательный | Описание    |
| ------- | --------- | ---------- | ---------------- |
| `name` | Строка    | Обязательный     | Имя объекта `export`.    |
| `saved-query` | Строка    | Обязательный     | Имя сохраненного запроса, который может быть использован.    |
| `select` | Список или строка   | Необязательный    | Укажите имена экспортов для выбора из сохраненного запроса. |
| `exclude` | Строка  | Необязательный    | Укажите имена экспортов для исключения из сохраненного запроса. |
| `export_as` | Строка  | Необязательный    | Тип экспорта для создания из доступных типов `export_as` в конфигурации. Доступные опции: `table` или `view`. |
| `schema` | Строка  | Необязательный    | Схема для использования при создании таблицы или представления. |
| `alias` | Строка  | Необязательный    | Псевдоним таблицы для использования при записи таблицы или представления. |

Вы также можете запустить любой экспорт, определенный для сохраненного запроса, и записать таблицу или представление в вашей среде разработки. Обратитесь к следующему примеру команды и выводу:

```bash
dbt sl export --saved-query sq_name
```

Вывод будет выглядеть примерно так: 

```bash
Polling for export status - query_id: 2c1W6M6qGklo1LR4QqzsH7ASGFs..
Export completed.
```

### Использование флага select

Вы можете иметь несколько экспортов для сохраненного запроса, и по умолчанию все экспорты выполняются для сохраненного запроса. Вы можете использовать флаг `select` в [разработке](#экспорты-в-разработке), чтобы выбрать конкретные или несколько экспортов. Обратите внимание, что вы не можете выбирать метрики или измерения из сохраненного запроса, это только для изменения конфигурации экспорта, т.е. формата таблицы или схемы.

Например, следующая команда запускает `export_1` и `export_2` и не работает с флагами `--alias` или `--export_as`:

```bash
dbt sl export --saved-query sq_name --select export_1,export2
```

<details>
<summary>Переопределение конфигураций экспорта</summary>

Флаг `--select` в основном используется для включения или исключения конкретных экспортов. Если вам нужно изменить эти настройки, вы можете использовать следующие флаги для переопределения конфигураций экспорта:

- `--export-as` &mdash; Определяет тип материализации (таблица или представление) для экспорта. Это создает новый экспорт с собственными настройками и полезно для тестирования в разработке.
- `--schema` &mdash; Указывает схему для использования при записи таблицы или представления.
- `--alias` &mdash; Назначает пользовательский псевдоним для записываемой таблицы или представления. Это переопределяет имя экспорта по умолчанию.

Будьте осторожны. Флаг `--select` _не может_ использоваться с `alias` или `schema`.

Например, вы можете использовать следующую команду для создания нового экспорта с именем `new_export` в виде таблицы:

```bash
dbt sl export --saved-query sq_number1 --export-as table --alias new_export
```
</details>

### Экспорты для нескольких сохраненных запросов

Используйте команду `dbt sl export-all`, чтобы запускать экспорты для нескольких сохраненных запросов одновременно. Это отличается от команды `dbt sl export`, которая запускает экспорты только для одного сохраненного запроса. Например, чтобы запустить экспорты для нескольких сохраненных запросов, вы можете использовать:

```bash
dbt sl export-all
```

Вывод будет выглядеть примерно так: 

```bash
Exports completed:
- Created TABLE at `DBT_SL_TEST.new_customer_orders`
- Created VIEW at `DBT_SL_TEST.new_customer_orders_export_alias`
- Created TABLE at `DBT_SL_TEST.order_data_key_metrics`
- Created TABLE at `DBT_SL_TEST.weekly_revenue`

Polling completed
```

Команда `dbt sl export-all` предоставляет гибкость для управления несколькими экспортами в одной команде.


## Экспорты в производстве

Включение и выполнение экспортов в dbt Cloud оптимизирует рабочие процессы данных и обеспечивает доступ к данным в реальном времени. Это повышает эффективность и управление для более умных решений.  

Экспорты используют учетные данные по умолчанию для производственной среды. Чтобы включить экспорты для выполнения сохраненных запросов и записи их в вашей платформе данных, выполните следующие шаги:

1. [Установите переменную окружения](#установка-переменной-окружения) в dbt Cloud.
2. [Создайте и выполните экспорт](#создание-и-выполнение-экспортов).

### Установка переменной окружения
<!-- для версии 1.7 -->
<VersionBlock firstVersion lastVersion="1.7">

1. Нажмите **Deploy** в верхней навигационной панели и выберите **Environments**.
2. Выберите **Environment variables**.
3. [Установите ключ переменной окружения](/docs/build/environment-variables#setting-and-overriding-environment-variables) на `DBT_INCLUDE_SAVED_QUERY` и значение переменной окружения на `TRUE` (`DBT_INCLUDE_SAVED_QUERY=TRUE`).

Это гарантирует, что сохраненные запросы и экспорты включены в ваше задание сборки dbt. Например, выполнение `dbt build --select sq_name` выполняет эквивалент `dbt sl export --saved-query sq_name` в планировщике заданий dbt Cloud. 

Если экспорты не нужны, вы можете установить значение(я) на `FALSE` (`DBT_INCLUDE_SAVED_QUERY=FALSE`).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Добавьте переменную окружения для запуска экспортов в вашем производственном запуске." />

</VersionBlock>

<!-- для Release Tracks -->
<VersionBlock firstVersion="1.8">

1. Нажмите **Deploy** в верхней навигационной панели и выберите **Environments**.
2. Выберите **Environment variables**.
3. [Установите ключ переменной окружения](/docs/build/environment-variables#setting-and-overriding-environment-variables) на `DBT_EXPORT_SAVED_QUERIES` и значение переменной окружения на `TRUE` (`DBT_EXPORT_SAVED_QUERIES=TRUE`).
*Примечание: если вы используете dbt v1.7, установите ключ переменной окружения на `DBT_INCLUDE_SAVED_QUERY`. Используйте переключатель документации, чтобы выбрать версию "1.7" для получения более подробной информации.

Это гарантирует, что сохраненные запросы и экспорты включены в ваше задание сборки dbt. Например, выполнение `dbt build -s sq_name` выполняет эквивалент `dbt sl export --saved-query sq_name` в планировщике заданий dbt Cloud.

Если экспорты не нужны, вы можете установить значение(я) на `FALSE` (`DBT_EXPORT_SAVED_QUERIES=FALSE`).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/env-var-dbt-exports.jpg" width="90%" title="Добавьте переменную окружения для запуска экспортов в вашем производственном запуске." />

</VersionBlock>

Когда вы запускаете задание сборки, любые сохраненные запросы, зависящие от моделей dbt в этом задании, также будут выполнены. Чтобы убедиться, что ваши данные экспорта актуальны, выполните экспорт как шаг нижнего уровня (после модели).

### Создание и выполнение экспортов
<VersionBlock firstVersion lastVersion="1.7">

1. Создайте [задание развертывания](/docs/deploy/deploy-jobs) и убедитесь, что переменная окружения `DBT_INCLUDE_SAVED_QUERY=TRUE` установлена, как описано в разделе [Установка переменной окружения](#установка-переменной-окружения).
   - Это позволяет вам выполнять любой экспорт, который нужно обновить после сборки модели.
   - Используйте [синтаксис селектора](/reference/node-selection/syntax) опцию `--select` или `-s` в вашей команде сборки, чтобы указать конкретную модель dbt или сохраненный запрос для выполнения. Например, чтобы выполнить все сохраненные запросы, зависящие от семантической модели `orders`, используйте следующую команду:
    ```bash
      dbt build --select orders+
      ```

</VersionBlock>

<VersionBlock firstVersion="1.8">

1. Создайте [задание развертывания](/docs/deploy/deploy-jobs) и убедитесь, что переменная окружения `DBT_EXPORT_SAVED_QUERIES=TRUE` установлена, как описано в разделе [Установка переменной окружения](#установка-переменной-окружения).
   - Это позволяет вам выполнять любой экспорт, который нужно обновить после сборки модели.
   - Используйте [синтаксис селектора](/reference/node-selection/syntax) опцию `--select` или `-s` в вашей команде сборки, чтобы указать конкретную модель dbt или сохраненный запрос для выполнения. Например, чтобы выполнить все сохраненные запросы, зависящие от семантической модели `orders`, используйте следующую команду:
    ```bash
      dbt build --select orders+
      ```

</VersionBlock>

2. После того как dbt завершит сборку моделей, сервер MetricFlow обрабатывает экспорты, компилирует необходимый SQL и выполняет этот SQL на вашей платформе данных. Он напрямую выполняет оператор "create table", чтобы данные оставались в вашей платформе данных.
3. Просмотрите детали выполнения экспортов в журналах заданий и убедитесь, что экспорт был выполнен успешно. Это помогает устранить неполадки и обеспечить точность. Поскольку сохраненные запросы интегрированы в DAG dbt, все выходные данные, связанные с экспортами, доступны в журналах заданий.
4. Ваши данные теперь доступны на платформе данных для запросов! 🎉

## Часто задаваемые вопросы

<DetailsToggle alt_header="Могу ли я иметь несколько экспортов в одном сохраненном запросе?">

Да, это возможно. Однако разница будет в имени, схеме и стратегии материализации экспорта.
</DetailsToggle>

<DetailsToggle alt_header="Как я могу запустить все экспорты для сохраненного запроса?">

- В производственных запусках вы можете собрать сохраненный запрос, вызвав его напрямую в команде сборки, или собрать модель и любые экспорты, зависящие от этой модели.
- В разработке вы можете запустить все экспорты, выполнив `dbt sl export --saved-query sq_name`.

</DetailsToggle>

<DetailsToggle alt_header="Буду ли я запускать дублирующие экспорты, если несколько моделей зависят от моего сохраненного запроса?">

dbt выполнит каждый экспорт только один раз, даже если он собирает несколько моделей, зависящих от сохраненного запроса. Например, у вас может быть сохраненный запрос под названием `order_metrics`, который содержит метрики как из моделей `orders`, так и `order_items`.

Вы можете запустить задание, включающее обе модели, используя `dbt build`. Это выполнит как модели `orders`, так и `order_items`, однако экспорт `order_metrics` будет выполнен только один раз.
</DetailsToggle>

<DetailsToggle alt_header="Могу ли я ссылаться на экспорт как на модель dbt, используя ref()">

Нет, вы не сможете ссылаться на экспорт, используя `ref`. Экспорты рассматриваются как конечные узлы в вашем DAG. Изменение экспорта может привести к несоответствиям с оригинальными метриками из семантического слоя.
</DetailsToggle>

<DetailsToggle alt_header="Как экспорты помогают мне использовать семантический слой dbt в инструментах, которые его не поддерживают, таких как PowerBI?">

Экспорты предоставляют путь интеграции для инструментов, которые не подключаются к семантическому слою dbt, предоставляя таблицы метрик и измерений на платформе данных.

Вы можете использовать экспорты для создания пользовательской интеграции с такими инструментами, как PowerBI, и другими.

</DetailsToggle>

<DetailsToggle alt_header="Как я могу выбрать saved_queries по их типу ресурса?">

Чтобы включить все сохраненные запросы в запуск сборки dbt, используйте флаг [`--resource-type`](/reference/global-configs/resource-type) и выполните команду `dbt build --resource-type saved_query`.

</DetailsToggle>

## Связанные документы
- [Проверка семантических узлов в CI-задании](/docs/deploy/ci-jobs#semantic-validations-in-ci)
- Настройка [кэширования](/docs/use-dbt-semantic-layer/sl-cache)
- [Часто задаваемые вопросы о семантическом слое dbt](/docs/use-dbt-semantic-layer/sl-faqs)