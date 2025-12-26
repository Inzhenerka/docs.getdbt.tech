---
title: "Другие файлы артефактов"
sidebar_label: "Другие артефакты"
---

### index.html

**Создается с помощью:** [`docs generate`](/reference/commands/cmd-docs)

Этот файл является каркасом [автоматически сгенерированного сайта документации dbt](/docs/explore/build-and-view-your-docs). Содержимое сайта заполняется на основе [manifest](/reference/artifacts/manifest-json) и [catalog](catalog-json).

Примечание: исходный код для `index.json` находится в [репозитории dbt-docs](https://github.com/dbt-labs/dbt-docs). Обратитесь туда, если хотите сообщить об ошибке, предложить улучшение или внести вклад, связанный с сайтом документации.

### partial_parse.msgpack

**Создается с помощью:** [manifest commands](/reference/artifacts/manifest-json) + [`parse`](/reference/commands/parse)

Этот файл используется для хранения сжатого представления файлов, которые dbt уже разобрал. Если у вас включен [частичный разбор](/reference/parsing#partial-parsing), dbt будет использовать этот файл для определения изменившихся файлов и избегать повторного разбора остальных.

### graph.gpickle

**Создается с помощью:** команды, поддерживающие [выбор узлов](/reference/node-selection/syntax)

Хранит сетевое представление DAG ресурсов dbt.

### graph_summary.json

**Создается с помощью:** [manifest commands](/reference/artifacts/manifest-json)

Этот файл полезен для исследования проблем производительности в графовых алгоритмах <Constant name="core" />.

Он более анонимизирован и компактен, чем [`manifest.json`](/reference/artifacts/manifest-json) и [`graph.gpickle`](#graph.gpickle).

Он включает информацию в двух отдельных точках времени:
1. `linked` &mdash; сразу после связывания графа, и
2. `with_test_edges` &mdash; после добавления тестовых связей.

Каждая из этих точек времени содержит `name` и `type` каждого узла, а `succ` содержит ключи его дочерних узлов.

