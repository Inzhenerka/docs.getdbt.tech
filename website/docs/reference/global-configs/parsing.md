---
title: "Парсинг"
id: "parsing"
sidebar: "Парсинг"
---

### Частичный парсинг

Конфигурация `PARTIAL_PARSE` может включать или отключать частичный парсинг в вашем проекте. См. [документацию по парсингу](/reference/parsing#partial-parsing) для получения дополнительной информации.

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

Конфигурация `STATIC_PARSER` может включать или отключать использование статического парсера. См. [документацию по парсингу](/reference/parsing#static-parser) для получения дополнительной информации.

<File name='profiles.yml'>

```yaml

config:
  static_parser: true

```

</File>

### Экспериментальный парсер

В настоящее время не используется.