---
title: "Обзор синтаксиса"
description: "Синтаксис выбора узлов позволяет выполнять команды dbt для конкретных моделей и ресурсов."
---

Синтаксис выбора узлов в dbt позволяет запускать только определенные ресурсы в конкретном вызове dbt. Этот синтаксис выбора используется для следующих подкоманд:

| команда                         | аргумент(ы)                                                          |
| :------------------------------ | -------------------------------------------------------------------- |
| [run](/reference/commands/run)             | `--select`, `--exclude`, `--selector`, `--defer`                     |
| [test](/reference/commands/test)           | `--select`, `--exclude`, `--selector`, `--defer`                     |
| [seed](/reference/commands/seed)           | `--select`, `--exclude`, `--selector`                                |
| [snapshot](/reference/commands/snapshot)   | `--select`, `--exclude`  `--selector`                                |
| [ls (list)](/reference/commands/list)      | `--select`, `--exclude`, `--selector`, `--resource-type`             |
| [compile](/reference/commands/compile)     | `--select`, `--exclude`, `--selector`, `--inline`                    |
| [freshness](/reference/commands/source)    | `--select`, `--exclude`, `--selector`                                |
| [build](/reference/commands/build)         | `--select`, `--exclude`, `--selector`, `--resource-type`, `--defer`  |
| [docs generate](/reference/commands/cmd-docs) | `--select`, `--exclude`, `--selector`                  |

:::info Узлы и ресурсы

Мы используем термины <a href="https://en.wikipedia.org/wiki/Vertex_(graph_theory)">"узлы"</a> и "ресурсы" взаимозаменяемо. Они охватывают все модели, тесты, источники, семена, снимки, экспозиции и анализы в вашем проекте. Это объекты, которые составляют DAG (ориентированный ациклический граф) dbt.
:::

Аргументы `--select` и `--selector` похожи тем, что оба позволяют выбирать ресурсы. Чтобы понять разницу между ними, см. [Differences between `--select` and `--selector`](/reference/node-selection/yaml-selectors#difference-between---select-and---selector).

## Указание ресурсов

По умолчанию, `dbt run` выполняет _все_ модели в графе зависимостей; `dbt seed` создает все семена, `dbt snapshot` выполняет каждый снимок. Флаг `--select` используется для указания подмножества узлов для выполнения.

Чтобы следовать [стандартам POSIX](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html) и упростить понимание, мы рекомендуем пользователям CLI использовать кавычки при передаче аргументов в опции `--select` или `--exclude` (включая один или несколько аргументов, разделенных пробелами или запятыми). Неиспользование кавычек может не работать надежно на всех операционных системах, терминалах и пользовательских интерфейсах. Например, `dbt run --select "my_dbt_project_name"` запускает все модели в вашем проекте.

### Как работает выбор?

1. dbt собирает все ресурсы, которые соответствуют одному или нескольким критериям `--select`, в порядке [методов выбора](/reference/node-selection/methods) (например, `tag:`), затем [операторов графа](/reference/node-selection/graph-operators) (например, `+`), и, наконец, операторов множеств ([объединения](/reference/node-selection/set-operators#unions), [пересечения](/reference/node-selection/set-operators#intersections), [исключения](/reference/node-selection/exclude)).

2. Выбранные ресурсы могут быть моделями, источниками (sources), сид-таблицами (seeds), снапшотами (snapshots), тестами (tests). (Тесты также могут выбираться «косвенно» через их родительские объекты; подробнее см. [примеры выбора тестов](/reference/node-selection/test-selection-examples).)

3. Теперь у dbt есть список все еще выбранных ресурсов различных типов. На последнем этапе он отбрасывает любой ресурс, который не соответствует типу ресурса текущей задачи. (Только семена сохраняются для `dbt seed`, только модели для `dbt run`, только тесты для `dbt test` и так далее.)

## Сокращения

Выберите ресурсы для сборки (запуска, тестирования, семени, снимка) или проверки свежести: `--select`, `-s`

### Примеры

По умолчанию, `dbt run` выполнит _все_ модели в графе зависимостей. Во время разработки (и развертывания) полезно указать только подмножество моделей для запуска. Используйте флаг `--select` с `dbt run`, чтобы выбрать подмножество моделей для запуска. Обратите внимание, что следующие аргументы (`--select`, `--exclude` и `--selector`) также применимы к другим задачам dbt, таким как `test` и `build`.

<Tabs>
<TabItem value="select" label="Примеры флага select">

Флаг `--select` принимает один или несколько аргументов. Каждый аргумент может быть одним из:

1. имя пакета
2. имя модели
3. полностью квалифицированный путь к каталогу моделей
4. метод выбора (`path:`, `tag:`, `config:`, `test_type:`, `test_name:`)

Примеры:

```bash
dbt run --select "my_dbt_project_name"   # запускает все модели в вашем проекте
dbt run --select "my_dbt_model"          # запускает конкретную модель
dbt run --select "path/to/my/models"     # запускает все модели в конкретном каталоге
dbt run --select "my_package.some_model" # запускает конкретную модель в конкретном пакете
dbt run --select "tag:nightly"           # запускает модели с тегом "nightly"
dbt run --select "path/to/models"        # запускает модели, содержащиеся в path/to/models
dbt run --select "path/to/my_model.sql"  # запускает конкретную модель по ее пути
```

</TabItem>

<TabItem value="subset" label="Примеры подмножеств узлов">

dbt поддерживает сокращенный язык для определения подмножеств узлов. Этот язык использует следующие символы:

- оператор плюс [(`+`)](/reference/node-selection/graph-operators#the-plus-operator)
- оператор собака [(`@`)](/reference/node-selection/graph-operators#the-at-operator)
- оператор звездочка (`*`)
- оператор запятая (`,`)

Примеры:

```bash
# несколько аргументов могут быть переданы в --select
dbt run --select "my_first_model my_second_model"

# выбрать my_model и всех его потомков
dbt run --select "my_model+"     

# выбрать my_model, его дочерние модели и родительские модели его дочерних моделей
dbt run --select @my_model

# эти аргументы могут быть проектами, моделями, путями к каталогам, тегами или источниками
dbt run --select "tag:nightly my_model finance.base.*"

# используйте методы и пересечения для более сложных селекторов
dbt run --select "path:marts/finance,tag:nightly,config.materialized:table"
```

</TabItem>

</Tabs>

Когда ваша логика выбора становится более сложной и неудобной для ввода в виде аргументов командной строки, рассмотрите возможность использования [yaml-селектора](/reference/node-selection/yaml-selectors). Вы можете использовать предопределенное определение с флагом `--selector`. Обратите внимание, что при использовании `--selector` большинство других флагов (а именно `--select` и `--exclude`) будут игнорироваться.

Аргументы `--select` и `--selector` похожи тем, что оба позволяют выбирать ресурсы. Чтобы понять разницу между аргументами `--select` и `--selector`, см. [этот раздел](/reference/node-selection/yaml-selectors#difference-between---select-and---selector) с более подробным объяснением.

### Диагностика с помощью команды `ls`

Создание и отладка вашего синтаксиса выбора может быть сложной задачей. Чтобы получить "предварительный просмотр" того, что будет выбрано, мы рекомендуем использовать [команду `list`](/reference/commands/list). Эта команда, в сочетании с вашим синтаксисом выбора, выведет список узлов, которые соответствуют этим критериям выбора. Команда `dbt ls` поддерживает все типы аргументов синтаксиса выбора, например:

```bash
dbt ls --select "path/to/my/models" # Список всех моделей в конкретном каталоге.
dbt ls --select "source_status:fresher+" # Показывает источники, обновленные с момента последнего запуска dbt source freshness.
dbt ls --select state:modified+ # Отображает узлы, измененные по сравнению с предыдущим состоянием.
dbt ls --select "result:<status>+" state:modified+ --state ./<dbt-artifact-path> # Список узлов, которые соответствуют определенным [статусам результата](/reference/node-selection/syntax#the-result-status) и изменены.
```

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="node-selection"/>
