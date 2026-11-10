---
title: "О команде dbt --version"
sidebar_label: "version"
id: "version"
---

Флаг командной строки `--version` возвращает информацию о текущей установленной версии <Constant name="core" />, <Constant name="platform_cli" /> или <Constant name="fusion_engine" />. Этот флаг не поддерживается при вызове dbt в других средах выполнения <Constant name="dbt" /> (например, в IDE или при запусках по расписанию).

- **<Constant name="core" />** &mdash; Возвращает установленную версию <Constant name="core" /> и версии всех установленных адаптеров.
- **<Constant name="platform_cli" />** &mdash; Возвращает установленную версию [<Constant name="platform_cli" />](/docs/platform/dbt-cli-installation), а для остальных значений `dbt_version` — _последнюю_ версию среды выполнения dbt в <Constant name="dbt" />.
- **<Constant name="fusion_engine" />** &mdash; Возвращает установленную версию <Constant name="fusion" />. Поскольку CLI и языковой сервер поставляются в одном исполняемом файле, они всегда сообщают одну и ту же версию. О том, как эта версия соотносится с версией расширения dbt для VS Code, см. в разделе [Совместимость версий](/docs/dbt-versions/dbt-version-compatibility).

## Версионирование {#versioning}
Чтобы узнать больше о версионировании релизов <Constant name="core" />, см. [Как <Constant name="core" /> использует семантическое версионирование](/docs/dbt-versions#how-dbt-v1-uses-semantic-versioning).

## Версионирование
Подробнее о версионировании выпусков <Constant name="core" /> см. в разделе [Как <Constant name="core" /> использует семантическое версионирование](/docs/dbt-versions#how-dbt-v1-uses-semantic-versioning). 

Если вы используете [канал выпусков <Constant name="dbt" />](/docs/dbt-versions/dbt-release-tracks), обеспечивающий регулярные обновления dbt, то `dbt_version` обозначает версию выпуска dbt в <Constant name="dbt" />. Она также соответствует правилам семантического версионирования и имеет формат `YYYY.M.D+<suffix>`. Год, месяц и день обозначают дату создания сборки этой версии (например, `2024.10.8+996c6a8`). Суффикс служит дополнительным уникальным идентификатором каждой сборки.

## Примеры использования

Пример для <Constant name="core" />: 
<File name='dbt v1'>

```text
$ dbt --version
Core:
  - installed: 1.7.6
  - latest:    1.7.6 - Up to date!
Plugins:
  - snowflake: 1.7.1 - Up to date!
```

</File>

Пример использования CLI <Constant name="dbt" />:

<File name='dbt platform CLI'>

```text
$ dbt --version
Cloud CLI - 0.35.7 (fae78a6f5f6f2d7dff3cab3305fe7f99bd2a36f3 2024-01-18T22:34:52Z)
```

</File>

Пример для <Constant name="fusion_engine" />:

```shell
$ dbt --version
dbt 2.0.1
```

Чтобы получить версию в машиночитаемом формате, добавьте флаг `--format json`. Это удобно для отчёта об ошибке или для инструмента, который считывает установленную версию:

```shell
dbt --version --format json
```

```json
{
  "version": "2.0.1"
}
```

