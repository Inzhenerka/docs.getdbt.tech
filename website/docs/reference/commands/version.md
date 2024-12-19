---
title: "О команде dbt --version"
sidebar_label: "версия"
id: "версия"
---

Флаг командной строки `--version` возвращает информацию о текущей установленной версии dbt Core или dbt Cloud CLI. Этот флаг не поддерживается при вызове dbt в других средах выполнения dbt Cloud (например, в IDE или запланированных запусках).

- **dbt Core** &mdash; Возвращает установленную версию dbt-core и версии всех установленных адаптеров.
- **dbt Cloud CLI** &mdash; Возвращает установленную версию [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) и, для других значений `dbt_version`, _последнюю_ версию среды выполнения dbt в dbt Cloud.

## Версионирование
Чтобы узнать больше о версионировании релизов для dbt Core, обратитесь к статье [Как dbt Core использует семантическое версионирование](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning).

Если вы используете [релизный трек dbt Cloud](/docs/dbt-versions/cloud-release-tracks), который предоставляет постоянные обновления для dbt, то `dbt_version` представляет собой версию релиза dbt в dbt Cloud. Это также соответствует рекомендациям по семантическому версионированию, используя формат `YYYY.MM.DD+<суффикс>`. Год, месяц и день представляют собой дату сборки версии (например, `2024.10.28+996c6a8`). Суффикс предоставляет дополнительную уникальную идентификацию для каждой сборки.

## Примеры использования

Пример dbt Core: 
<File name='dbt Core'>

```text
$ dbt --version
Core:
  - installed: 1.7.6
  - latest:    1.7.6 - Up to date!
Plugins:
  - snowflake: 1.7.1 - Up to date!
```

</File>

Пример dbt Cloud CLI:

<File name='dbt Cloud CLI'>

```text
$ dbt --version
dbt Cloud CLI - 0.35.7 (fae78a6f5f6f2d7dff3cab3305fe7f99bd2a36f3 2024-01-18T22:34:52Z)
```

</File>