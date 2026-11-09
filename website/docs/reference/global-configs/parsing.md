---
title: "Разбор"
id: "parsing"
sidebar: "Parsing"
---

import FusionPartialParseCliFlags from '/snippets/_v2-partial-parse-cli-flags.md';

### Частичный парсинг {#partial-parsing}

<VersionBlock firstVersion="2.0">

:::note <Constant name="fusion" /> и частичный парсинг

<FusionPartialParseCliFlags />

:::

</VersionBlock>

Флаг `PARTIAL_PARSE` позволяет включать и отключать частичный парсинг в вашем проекте. Подробнее см. в [документации по парсингу](/reference/parsing#partial-parsing).

<File name='dbt_project.yml'>

```yaml

flags:
  partial_parse: true

```

</File>

<File name='Usage'>

```text
dbt run --no-partial-parse
```

</File>

### Статический парсер {#static-parser}

Конфигурация `STATIC_PARSER` может включать или отключать использование статического парсера. Подробнее см. в [документации по разбору](/reference/parsing#static-parser).

<File name='profiles.yml'>

```yaml

config:
  static_parser: true

```

</File>

### Включение парсера v2 {#opt-in-v2-parser}

<VersionBlock firstVersion="1.12">

:::note Флаг <Constant name="core" />

Флаг парсера v2 применяется только к dbt v1.12 и более поздним версиям ветки 1.x. Если вы уже используете v2, этот флаг ни на что не влияет.

:::

Флаг `use_v2_parser` передаёт обработку проекта парсеру v2. Этот флаг нужно включать явно.

Парсер v2 — это парсер на Rust из <Constant name="fusion_engine" />. Он значительно быстрее парсера v1 на Python, особенно на крупных проектах, где ускорение может достигать 5–10 раз. Его включение может ускорить процесс разработки и сократить время запуска заданий. Поскольку флаг передаёт обработку парсеру, используемому в v2.0, это также способ проверить совместимость с v2 из <Constant name="dbt" /> v1.12 с минимальным риском.

Включить парсер v2 можно тремя способами:

- Флаг CLI: `--use-v2-parser`
- Переменная окружения: `DBT_ENGINE_USE_V2_PARSER=true`
- В файле `dbt_project.yml` в разделе `flags:`:

<File name="dbt_project.yml">

```yaml
flags:
  use_v2_parser: true
```

</File>

Примечание: при включённом флаге `--use-v2-parser` частичный разбор отключён. Любой устаревший файл `partial_parse.msgpack`, оставшийся от предыдущего запуска, автоматически удаляется.

Поскольку флаг влияет только на разбор проекта, самый быстрый способ проверить совместимость с парсером v2 — выполнить `dbt parse`. Вы также можете использовать `--use-v2-parser` с любой другой командой.

<File name="Пример использования">

```bash
# Проверка совместимости с парсером v2 без запуска моделей (рекомендуется)
dbt parse --use-v2-parser

# Или использование с любой командой
dbt run --use-v2-parser
```

</File>

:::note Для авторов плагинов

Хуки плагинов `get_nodes` не поддерживаются при включённом флаге `--use-v2-parser`.

:::

</VersionBlock>
