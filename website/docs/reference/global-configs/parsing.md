---
title: "Разбор"
id: "parsing"
sidebar: "Parsing"
---

### Частичный разбор

Конфигурация `PARTIAL_PARSE` может включать или отключать частичный разбор в вашем проекте. Подробнее см. в [документации по разбору](/reference/parsing#partial-parsing).

<File name='profiles.yml'>

```yaml

config:
  partial_parse: true

```

</File>

<File name='Usage'>

```text
dbt --no-partial-parse run
```

</File>

### Статический парсер

Конфигурация `STATIC_PARSER` может включать или отключать использование статического парсера. Подробнее см. в [документации по разбору](/reference/parsing#static-parser).

<File name='profiles.yml'>

```yaml

config:
  static_parser: true

```

</File>

### Экспериментальный парсер

В настоящее время не используется.