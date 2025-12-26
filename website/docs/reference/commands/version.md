---
title: "О dbt --version"
sidebar_label: "version"
id: "version"
---

Флаг командной строки `--version` возвращает информацию о текущей установленной версии <Constant name="core" /> или <Constant name="cloud_cli" />. Этот флаг не поддерживается при запуске dbt в других средах выполнения <Constant name="cloud" /> (например, в IDE или при запланированных запусках).

- **<Constant name="core" />** &mdash; Возвращает установленную версию <Constant name="core" /> и версии всех установленных адаптеров.
- **<Constant name="cloud_cli" />** &mdash; Возвращает установленную версию [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) и, для других значений `dbt_version`, — _последнюю_ версию среды выполнения dbt в <Constant name="cloud" />.

## Версионирование
Чтобы узнать больше о версионировании релизов для dbt Core, обратитесь к [Как dbt Core использует семантическое версионирование](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning).

## Versioning
Чтобы узнать больше о версионировании релизов <Constant name="core" />, см. [How <Constant name="core" /> uses semantic versioning](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning).

Если вы используете [release track <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks), который предоставляет непрерывные обновления dbt, то `dbt_version` представляет версию релиза dbt в <Constant name="cloud" />. Она также следует правилам семантического версионирования и использует формат `YYYY.M.D+<suffix>`. Год, месяц и день обозначают дату сборки версии (например, `2024.10.8+996c6a8`). Суффикс предоставляет дополнительный уникальный идентификатор для каждой сборки.

## Example usages

Пример для <Constant name="core" />:
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

Пример CLI для <Constant name="cloud" />:

<File name='dbt CLI'>

```text
$ dbt --version
Cloud CLI - 0.35.7 (fae78a6f5f6f2d7dff3cab3305fe7f99bd2a36f3 2024-01-18T22:34:52Z)
```

</File>