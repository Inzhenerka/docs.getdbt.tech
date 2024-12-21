---
title: "Другие файлы артефактов"
sidebar_label: "Другие артефакты"
---

### index.html

**Создается с помощью:** [`docs generate`](/reference/commands/cmd-docs)

Этот файл является основой для [автоматически генерируемого сайта документации dbt](/docs/collaborate/build-and-view-your-docs). Содержимое сайта заполняется с помощью [manifest](/reference/artifacts/manifest-json) и [catalog](catalog-json).

Примечание: исходный код для `index.json` находится в [репозитории dbt-docs](https://github.com/dbt-labs/dbt-docs). Обратитесь туда, если хотите сообщить об ошибке, предложить улучшение или внести вклад, связанный с сайтом документации.

### partial_parse.msgpack

**Создается с помощью:** [manifest commands](/reference/artifacts/manifest-json) + [`parse`](/reference/commands/parse)

Этот файл используется для хранения сжатого представления файлов, которые dbt уже разобрал. Если у вас включен [частичный разбор](/reference/parsing#partial-parsing), dbt будет использовать этот файл для определения изменившихся файлов и избегать повторного разбора остальных.

### graph.gpickle

**Создается с помощью:** команды, поддерживающие [выбор узлов](/reference/node-selection/syntax)

Хранит сетевое представление DAG ресурсов dbt.

### graph_summary.json

**Создается с помощью:** [manifest commands](/reference/artifacts/manifest-json)

Этот файл полезен для исследования проблем с производительностью в алгоритмах графов dbt Core.

Он более анонимизирован и компактен, чем [`manifest.json`](/reference/artifacts/manifest-json) и [`graph.gpickle`](#graph.gpickle).

Он включает информацию в двух отдельных точках времени:
1. `linked` &mdash; сразу после связывания графа, и
2. `with_test_edges` &mdash; после добавления тестовых связей.

Каждая из этих точек времени содержит `name` и `type` каждого узла, а `succ` содержит ключи его дочерних узлов.

### semantic_manifest.json

Файл [`semantic_manifest.json`](/reference/artifacts/sl-manifest) полезен как внутренний интерфейс между `dbt-core` и MetricFlow. Таким образом, он функционирует как закулисный мост для взаимодействия между двумя системами. Вы можете найти всю информацию о `semantic_manifest.json` в [`semantic_manifest.json`](/reference/artifacts/sl-manifest).

Существуют две причины, почему `semantic_manifest.json` существует наряду с `manifest.json`:

- Десериализация: `dbt-core` и MetricFlow используют разные библиотеки для обработки сериализации данных.
- Эффективность и производительность: MetricFlow и семантический слой dbt нуждаются в специфических семантических деталях из манифеста. Уменьшая объем информации, выводимой в `semantic_manifest.json`, процесс становится более эффективным и позволяет быстрее обрабатывать данные между `dbt-core` и MetricFlow.