---
title: "Проверки"
description: "Пишите SQL-правила для обеспечения соблюдения стандартов проекта."
id: "checks"
availability:
  engine: v2
---

# Проверки

По мере роста проектов dbt и увеличения числа участников, добавляющих модели, поддерживать единые стандарты становится сложнее: модель выпускается без описания, у публичной модели нет владельца, новая модель не соответствует соглашениям об именовании. Ничто из этого не нарушает работу, поэтому остаётся незамеченным, но качество незаметно снижается.

Проверки — это SQL-запросы, которые проверяют соблюдение правил и стандартов для метаданных вашего проекта. Определите правила (например, у каждой модели должно быть описание, должны быть заданы обязательные теги и так далее), и dbt обеспечит их соблюдение до начала любых операций в хранилище данных. 

Пишите проверки на SQL для DuckDB, используя [макрос `{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) для обращения к [dbt Information Schema](/docs/build/dbt-information-schema) в запросе. Проверки выполняются локально в DuckDB, поэтому им не требуется подключение к хранилищу данных. Если проект нарушает правило, `dbt build` останавливается до компиляции или материализации хотя бы одной модели.

Как и [тесты данных](/docs/build/data-tests), проверка находит в проекте все случаи, которые не соответствуют вашим ожиданиям. Проверка проходит успешно, если запрос возвращает ноль строк, и завершается неудачей, если он возвращает одну или несколько строк.

Проверки выполняются автоматически при каждом запуске `dbt build`; их можно пропустить с помощью `--skip-checks`. Также их можно запускать по требованию командой `dbt check`.

## Рекомендации по написанию SQL-файлов проверок

В этом разделе описаны правила и ограничения для написания SQL-файлов проверок и настройки их поведения.

- Проверка — это SQL-файл в каталоге `checks/`. При необходимости рядом с ним в том же каталоге можно разместить YAML-файл свойств для его настройки. Чтобы использовать другой каталог, задайте [`check-paths`](/reference/project-configs/check-paths) в `dbt_project.yml`.
- Имя файла без расширения `.sql` становится именем проверки (например, `all_models_have_descriptions` — это имя проверки для `checks/all_models_have_descriptions.sql`).
- Jinja в файлах проверок обрабатывается на этапе разбора. Вы можете использовать Jinja, но уже на этом этапе результат должен быть корректным SQL для DuckDB; в отличие от моделей, проверки не проходят отдельный этап компиляции.
- Проверки — это ресурсы dbt; каждая проверка присутствует в `manifest.json`, поддерживает `tags` и `meta` и отображается в выводе `dbt ls`.

### Макрос `info_schema()`

[`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) — это поддерживаемый способ обращения к [dbt Information Schema](/docs/build/dbt-information-schema) в проверке. Передайте имя таблицы, к которой хотите выполнить запрос (например, `{{ info_schema('models') }}` для моделей или `{{ info_schema('edges') }}` для рёбер DAG). Материализованные файлы [Information Schema](/reference/info-schema) не требуются; проверки выполняются на основе промежуточного представления, созданного на этапе разбора.

Полный список доступных представлений и столбцов приведён в разделе [Столбцы, доступные для проверок](/reference/info-schema#columns-available-for-checks).

## Создание первой проверки

Следующие шаги помогут вам создать первую проверку.

1. Объявите версию `info_schema` в `dbt_project.yml`:

    Параметр `info_schema.version` фиксирует версию info schema, которую использует [макрос `{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro). В настоящее время доступна только версия `1`.

    <File name='dbt_project.yml'>

    ```yaml
    info_schema:
      version: 1
    ```

    </File>

2. Создайте проверку в каталоге `checks/`:

    Используйте [`{{ info_schema() }}`](/reference/dbt-jinja-functions/info-schema-macro) для запросов к метаданным проекта. Проверка проходит успешно, если запрос возвращает ноль строк. Доступные представления и столбцы перечислены в разделе [Столбцы, доступные для проверок](/reference/info-schema#columns-available-for-checks).

    <File name='checks/all_models_have_descriptions.sql'>

    ```sql
    select unique_id
    from {{ info_schema('models') }}
    where description = ''
    ```

    </File>


3. Настройте проверку в YAML-файле свойств в каталоге `checks/`. 

    <File name='checks/_checks.yml'>

    ```yaml
    version: 2
    checks:
      - name: all_models_have_descriptions
        description: "Завершается неудачей, если у какой-либо модели отсутствует описание."
        config:
          severity: warn   # по умолчанию используется error; 'warn' регистрирует проблемы, но не прерывает выполнение
    ```

    </File>

4. Запустите проверки:

    ```shell
    dbt check
    ```

## Примеры проверок

В следующих примерах показаны распространённые правила качества проекта: каждое из них определено как SQL-запрос с использованием макросов `info_schema` и сохранено в файле `.sql` в каталоге `checks/`.

- Требовать наличия описания у всех моделей с доступом `public`:

  <File name='checks/public_models_have_descriptions.sql'>

  ```sql
  select unique_id
  from {{ info_schema('models') }}
  where access = 'public'
    and description = ''
  ```

  </File>

- Выявлять источники, на которые не ссылаются модели. У такого источника нет зависимых моделей: он либо не используется, либо отсутствует модель, которая должна на него ссылаться:

  <File name='checks/unused_sources.sql'>

  ```sql
  select s.unique_id, s.name
  from {{ info_schema('sources') }} as s
  left join {{ info_schema('edges') }} as e on e.parent_unique_id = s.unique_id
  where e.child_unique_id is null
  ```

  </File>

- Выявлять модели с доступом `public`, у группы которых не указан владелец:

  <File name='checks/public_models_have_owners.sql'>

  ```sql
  select m.unique_id
  from {{ info_schema('models') }} as m
  left join {{ info_schema('groups') }} as g on g.name = m."group"
  where m.access = 'public'
    and (
      g.unique_id is null
      or (
        (g.owner_name is null or trim(g.owner_name) = '')
        and (g.owner_email is null or trim(g.owner_email) = '')
      )
    )
  ```

  </File>

## Команды

Проверки запускаются командами `dbt check` и `dbt build`.

<SimpleTable>
| Команда | Поведение |
|---------|----------|
| `dbt check` | Запускает все проверки. |
| `dbt check <name1> <name2> …` | Запускает только указанные проверки. Неизвестное имя проверки вызывает ошибку; имя отключённой проверки принимается, но сама проверка пропускается. |
| `dbt build` | Запускает все включённые проверки до компиляции моделей. Неудачная проверка останавливает запуск до компиляции или выполнения любой модели. Нарушения с уровнем warn выводятся в отчёте, и сборка продолжается. Для пропуска проверок используйте `--skip-checks`. |
</SimpleTable>

## Пропуск проверок при сборке

Чтобы пропустить все проверки, передайте команде `dbt build` [флаг `--skip-checks`](/reference/commands/build?version=2#the---skip-checks-flag).

```shell
dbt build --skip-checks
```

Чтобы пропустить определённую проверку, задайте `enabled: false` в её блоке config в YAML-файле. Проверка по-прежнему будет присутствовать в манифесте, но не будет выполняться.

```yaml
checks:
  - name: all_models_have_descriptions
    config:
      enabled: false
```

:::note Отключение на уровне проекта
Настройка `+enabled: false` в `dbt_project.yml` отключает проверку без уведомления &mdash; в выводе ничто не указывает на то, что проверки были пропущены. Успешное выполнение `dbt build` в CI не позволяет определить, отсутствуют ли проверки в проекте или все они отключены. Запуск `dbt check <name>` для отключённой проверки также завершается успешно, не выполняя проверку и не возвращая ошибку.
:::


## Использование селекторов с проверками {#using-selectors-with-checks}

При работе с проверками [`--select` и другие методы выбора](/reference/node-selection/syntax) определяют, какие ресурсы проекта проверять, а не какие проверки запускать.

Почему проверки работают именно так:

- Как правило, нет необходимости исключать проверки или запускать только часть из них. Проверки выполняются быстро. Проверки с уровнем error должны блокировать выполнение при нарушении правила; если правило носит информационный характер, задайте для него `warn`. Если проверка больше не актуальна, отключите или удалите её.
- Вам может потребоваться ограничить набор проверяемых ресурсов. Это позволяет постепенно внедрять проверки в существующий проект. Во время разработки запускайте `dbt build --select <the part of your DAG you're working on>`, чтобы проверять только соответствующие ресурсы. В CI проверки выполняются только для изменённых ресурсов.
- При разработке новой проверки можно запускать по одной проверке за раз и при необходимости выбирать ресурсы:
  - `dbt check name_of_check`
  - `dbt check name_of_check --select <resources to check>`  

Также можно напрямую просмотреть результат любого запроса к `info_schema`: `dbt show --inline "select * from {{ info_schema('...') }}"`. Например, чтобы изучить метаданные самих проверок, выполните `dbt show --inline "select * from {{ info_schema('checks') }}"`.


### Как работает `selection_filter_on`

По умолчанию dbt фильтрует результаты проверок по выбранным ресурсам, сопоставляя значения столбца `unique_id` в выводе. Если проверка не возвращает столбец `unique_id`, она выполняется для всего проекта.

Используйте [`selection_filter_on`](/reference/resource-configs/selection-filter-on), если проверка возвращает строки с другими столбцами идентификаторов, по которым требуется фильтрация. Параметр принимает следующие значения:

import SelectionFilterOnValues from '/snippets/_selection-filter-on-values.md';

<SelectionFilterOnValues />

Например, следующая проверка возвращает `child_unique_id` вместо `unique_id`, поэтому необходимо задать `selection_filter_on`:

<File name='checks/multiple_sources_joined.sql'>

```sql
select child_unique_id, count(*) as source_parents
from {{ info_schema('edges') }}
where parent_unique_id like 'source.%'
group by child_unique_id
having count(*) > 1
```

</File>

<File name='checks/_checks.yml'>

```yaml
checks:
  - name: multiple_sources_joined
    description: "Завершается неудачей, если какая-либо модель читает данные напрямую из нескольких источников."
    config:
      selection_filter_on: child_unique_id
```

</File>


## Связанная документация

- [Свойства проверок](/reference/check-properties)
- [Конфигурации проверок](/reference/check-configs)
- [Команда `dbt check`](/reference/commands/check)
- [`info_schema`](/reference/dbt-jinja-functions/info-schema-macro/)
- [Настройка проекта `check-paths`](/reference/project-configs/check-paths)
