---
title: "Другие файлы артефактов"
sidebar_label: "Другие артефакты"
---

### index.html

**Создано с помощью:** [`docs generate`](/reference/commands/cmd-docs)

Этот файл является основой [автоматически сгенерированного веб-сайта документации dbt](/docs/collaborate/build-and-view-your-docs). Содержимое сайта заполняется с помощью [манифеста](/reference/artifacts/manifest-json) и [каталога](catalog-json).

Примечание: исходный код для `index.json` доступен в репозитории [dbt-docs](https://github.com/dbt-labs/dbt-docs). Загляните туда, если хотите сообщить об ошибке, сделать предложение или внести вклад в документацию сайта.

### partial_parse.msgpack

**Создано с помощью:** [команды манифеста](/reference/artifacts/manifest-json) + [`parse`](/reference/commands/parse)

Этот файл используется для хранения сжатого представления файлов, которые dbt разобрал. Если у вас включен [частичный парсинг](/reference/parsing#partial-parsing), dbt будет использовать этот файл для определения изменившихся файлов и избегания повторного парсинга остальных.

### graph.gpickle

**Создано с помощью:** команд, поддерживающих [выбор узлов](/reference/node-selection/syntax)

Хранит сетевое представление DAG ресурсов dbt.

### graph_summary.json

**Создано с помощью:** [команды манифеста](/reference/artifacts/manifest-json)

Этот файл полезен для расследования проблем с производительностью в графовых алгоритмах dbt Core.

Он более анонимизирован и компактнее, чем [`manifest.json`](/reference/artifacts/manifest-json) и [`graph.gpickle`](#graph.gpickle).

Он включает информацию в два отдельных момента времени:
1. `linked` &mdash; сразу после связывания графа, и
2. `with_test_edges` &mdash; после добавления тестовых рёбер.

Каждый из этих моментов времени содержит `name` и `type` каждого узла, а `succ` содержит ключи его дочерних узлов.

### semantic_manifest.json

Файл [`semantic_manifest.json`](/reference/artifacts/sl-manifest) полезен как внутренний интерфейс между `dbt-core` и MetricFlow. Таким образом, он функционирует как скрытый мост для взаимодействия между двумя системами. Вы можете найти всю информацию о `semantic_manifest.json` в [`semantic_manifest.json`](/reference/artifacts/sl-manifest).

Существуют две причины, по которым `semantic_manifest.json` существует наряду с `manifest.json`:

- Десериализация: `dbt-core` и MetricFlow используют разные библиотеки для обработки сериализации данных.
- Эффективность и производительность: MetricFlow и семантический уровень dbt нуждаются в специфических семантических деталях из манифеста. Упрощая информацию, выводимую в `semantic_manifest.json`, процесс становится более эффективным и позволяет быстрее обрабатывать данные между `dbt-core` и MetricFlow.