---
title: "Обновление до 0.16.0"
id: "upgrading-to-0-16-0"
displayed_sidebar: "docs"
---

dbt v0.16.0 содержит множество новых функций, исправлений ошибок и улучшений. Это руководство охватывает всю важную информацию, которую следует учитывать при обновлении с более ранней версии dbt до 0.16.0.

## Статьи:
 - [Изменения в инкрементальных моделях BigQuery](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982)
 - [Тестирование производительности инкрементальных моделей BigQuery](https://discourse.getdbt.com/t/benchmarking-incremental-strategies-on-bigquery/981)

## Изменения, нарушающие совместимость

Следующие изменения могут потребовать изменения кода в вашем проекте dbt после обновления до v0.16.0.

### Определение типа для seed
В dbt было внесено множество улучшений в логику определения типа. Ранее dbt ошибочно преобразовывал строковые значения в [seed CSV файлах](/docs/build/seeds), такие как `sunday` или `March`, в временные метки даты в году `0001`. Это было очевидно неверно и теперь исправлено, но если вы _полагались_ на эту функциональность, то это представляет собой изменение, нарушающее совместимость. Подробнее об изменении см. в [этом pull request](https://github.com/dbt-labs/dbt-core/pull/1920).

### Устаревание одноаргументного generate_schema_name
Поддержка одноаргументного варианта макросов `generate_schema_name` (устаревшего в предыдущем выпуске) больше не поддерживается. Если вы используете одноаргументный вариант `generate_schema_name`, см. [документацию по пользовательским схемам](/docs/build/custom-schemas) для примера использования двухаргументного варианта `generate_schema_name`.

### Синтаксис partition_by для BigQuery

Конфигурация `partition_by` для моделей BigQuery теперь принимает словарь, содержащий следующие ключи:
- `field`: Имя поля в <Term id="table" />, по которому выполняется разбиение
- `data_type`: Тип данных для поля разбиения (`date`, `timestamp`, `datetime`, `int64`)
- `range`: Требуется только если `data_type` — это `int64` (для разбиения на диапазоны)

Если строка предоставляется в качестве конфигурации `partition_by` для модели в BigQuery, dbt попытается разобрать эту строку в представление поля и типа данных. В будущем выпуске dbt будет удалена возможность настройки конфигураций `partition_by` с использованием строки.

См. документацию по [разбиению BigQuery](/reference/resource-configs/bigquery-configs#partition-clause) для получения дополнительной информации о обновленном синтаксисе `partition_by` для моделей BigQuery. Также см. [это руководство](https://discourse.getdbt.com/t/bigquery-dbt-incremental-changes/982) для получения дополнительной информации о том, как dbt использует этот новый синтаксис для ускорения и удешевления построения инкрементальных моделей.

### Компиляция аргументов тестов источников
Аргументы тестов источников теперь обрабатываются так же, как и аргументы тестов моделей. Если вы предоставляете выражения jinja в тестах схем таблиц источников, то это изменение, нарушающее совместимость для вашего проекта. Подробнее об изменении см. в [этом pull request](https://github.com/dbt-labs/dbt-core/pull/2150).

### Форматирование временных меток в журналах отладки
Формат временных меток в журналах отладки изменился. Ранее запятая (`,`) использовалась для разделения секунд и микросекунд в временных метках журналов отладки. Если вы программно обрабатываете журналы отладки, создаваемые dbt, это может быть изменением, нарушающим совместимость. Подробнее об изменении см. в [этом pull request](https://github.com/dbt-labs/dbt-core/pull/2099).

### Удаление docrefs из manifest
`docrefs` больше не присутствуют в скомпилированном файле `manifest.json`. Если вы программно обрабатываете файл `manifest.json`, создаваемый dbt, и используете поле `docrefs` в манифесте, то это изменение, нарушающее совместимость. Подробнее об изменении см. в [этом pull request](https://github.com/dbt-labs/dbt-core/pull/2096).

### Изменение интерфейса макроса get_catalog
Макросы `get_catalog` теперь должны принимать два аргумента: Relation, указывающий на информационную схему, и список схем для поиска в предоставленной информационной схеме. Если вы переопределяете макрос `get_catalog` в вашем проекте, вы можете найти больше информации об этом изменении в [этом pull request](https://github.com/dbt-labs/dbt-core/pull/2037).

### Изменение интерфейса макроса snowflake__list_schemas
Макрос `snowflake__list_schemas` теперь должен возвращать фрейм данных Agate с колонкой под названием `"name"`. Если вы переопределяете макрос `snowflake__list_schemas` в вашем проекте, вы можете найти больше информации об этом изменении в [этом pull request](https://github.com/dbt-labs/dbt-core/pull/2171).

### Базы данных Snowflake с 10,000 схем
dbt больше не поддерживает работу с базами данных Snowflake, содержащими более 10,000 схем. Это связано с ограничениями запроса `show schemas in database`, который dbt теперь использует для поиска схем в базе данных Snowflake. Если ваш проект dbt работает с базой данных Snowflake, содержащей более 10,000 схем, вам не следует обновляться до dbt v0.16.0.

Если это изменение применимо к вашему проекту dbt, пожалуйста, сообщите нам об этом в issue dbt или в Slack dbt.

## Требования к Python

Если вы устанавливаете dbt в окружение Python вместе с другими модулями Python, обратите внимание на следующие изменения в зависимостях dbt для Python:

- Добавлена зависимость от `'cffi>=1.9,<1.14',` для исправления проблем с `snowflake-connector-python`
- Изменена верхняя граница `'requests<2.23.0',` для исправления проблем с `snowflake-connector-python`
- Добавлена зависимость от `'idna<2.9'` для исправления проблем с `snowflake-connector-python`
- Изменен `snowflake-connector-python` на `2.2.1`
- Увеличена версия `google-cloud-bigquery` до `>=1.22.0` для добавления поддержки разбиения на диапазоны целых чисел
- Изменена верхняя граница для `Jinja2 < 3`

## Новая и измененная документация
- [Конфигурации разбиения BigQuery](/reference/resource-configs/bigquery-configs)
- [Выбор конкретных seeds для запуска с помощью `--select`](/reference/commands/seed)
- [Новый макрос `generate_database_name`](/docs/build/custom-databases#generate_database_name)
- [Новый контекст `dbt_project.yml`](/reference/dbt-jinja-functions/dbt-project-yml-context)
- [Новые конфигурации для файлов schema.yml](/reference/configs-and-properties)
- [Новые конфигурации для объявлений источников](/docs/build/sources)
- [Новые конфигурации подключения Postgres](/docs/core/connect-data-platform/postgres-setup)
- [Новые конфигурации аутентификации Snowflake KeyPair](/docs/core/connect-data-platform/snowflake-setup)
- [Новая переменная контекста `builtins` jinja](/reference/dbt-jinja-functions/builtins)
- [Новый метод контекста `fromyaml`](/reference/dbt-jinja-functions/fromyaml)
- [Новый метод контекста `toyaml`](/reference/dbt-jinja-functions/toyaml)
- [Новая переменная контекста `project_name`](/reference/dbt-jinja-functions/project_name)
- [Новая переменная контекста `dbt_version`](/reference/dbt-jinja-functions/dbt_version)
- [Новая переменная `database_schemas` в контексте `on-run-end`](/reference/dbt-jinja-functions/on-run-end-context)