---
title: "Разбор"
id: "parsing"
sidebar: "Parsing"
---

### Частичный разбор {#partial-parsing}

Флаг `PARTIAL_PARSE` позволяет включать или отключать частичный парсинг в вашем проекте. Подробнее см. [документацию по парсингу](/reference/parsing#partial-parsing).

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

### Экспериментальный парсер {#experimental-parser}

В настоящее время не используется.