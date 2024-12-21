---
title: "Предупреждения"
id: "warnings"
sidebar: "Warnings"
---

Включение конфигурации `WARN_ERROR` преобразует предупреждения dbt в ошибки. В любой момент, когда dbt обычно выдает предупреждение, оно вместо этого вызовет ошибку. Примеры включают критерии `--select`, которые не выбирают ресурсы, устаревшие функции, конфигурации без связанных моделей, недопустимые конфигурации тестов или тесты и проверки свежести, настроенные на возврат предупреждений.

<File name='Usage'>

```text
dbt --warn-error run
...
```

</File>

Преобразование любых предупреждений в ошибки может идеально соответствовать вашим потребностям, но могут быть некоторые предупреждения, которые вас не волнуют, и некоторые, которые вас очень волнуют. Конфигурация `WARN_ERROR_OPTIONS` дает вам более детальный контроль над _точно теми типами предупреждений_, которые рассматриваются как ошибки.

<VersionBlock lastVersion="1.7">

Предупреждения, которые должны рассматриваться как ошибки, могут быть указаны через параметры `include` и/или `exclude`. Названия предупреждений можно найти в [файле types.py dbt-core](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), где каждое имя класса, наследуемое от `WarnLevel`, соответствует названию предупреждения (например, `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

Параметр `include` может быть установлен в `"all"` или `"*"`, чтобы рассматривать все предупреждения как исключения, или в список конкретных названий предупреждений, чтобы рассматривать их как исключения. Когда `include` установлен в `"all"` или `"*"`, необязательный параметр `exclude` может быть установлен для исключения конкретных предупреждений из рассмотрения их как исключений.

</VersionBlock>

<VersionBlock firstVersion="1.8">

- Предупреждения, которые должны рассматриваться как ошибки, могут быть указаны через параметры `error` и/или `warn`. Названия предупреждений можно найти в [файле types.py dbt-core](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), где каждое имя класса, наследуемое от `WarnLevel`, соответствует названию предупреждения (например, `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

- Параметр `error` может быть установлен в `"all"` или `"*"`, чтобы рассматривать все предупреждения как исключения, или в список конкретных названий предупреждений, чтобы рассматривать их как исключения. Когда `error` установлен в `"all"` или `"*"`, необязательный параметр `warn` может быть установлен для исключения конкретных предупреждений из рассмотрения их как исключений.

- Используйте параметр `silence`, чтобы игнорировать предупреждения через флаги проекта, без необходимости повторного указания списка игнорирования каждый раз. Например, чтобы игнорировать устаревшие предупреждения или определенные предупреждения, которые вы хотите игнорировать в вашем проекте, вы можете указать их в параметре `silence`. Это полезно в больших проектах, где определенные предупреждения не являются критичными и могут быть проигнорированы, чтобы уменьшить шум и очистить логи.

<File name='dbt_project.yml'>

```yaml
name: "my_dbt_project"
tests:
  +enabled: True
flags:
  warn_error_options:
    error: # Ранее назывался "include"
    warn: # Ранее назывался "exclude"
    silence: # Чтобы игнорировать или пропускать предупреждения
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>

:::info `WARN_ERROR` и `WARN_ERROR_OPTIONS` взаимоисключающие
`WARN_ERROR` и `WARN_ERROR_OPTIONS` взаимоисключающие. Вы можете указать только один, даже если вы указываете конфигурацию в нескольких местах (например, переменная окружения + флаг CLI), в противном случае вы увидите ошибку использования.
:::

<VersionBlock lastVersion="1.7">

```text
dbt --warn-error-options '{"include": "all"}' run
...
```

```text
dbt --warn-error-options '{"include": "all", "exclude": ["NoNodesForSelectionCriteria"]}' run
...
```

```text
dbt --warn-error-options '{"include": ["NoNodesForSelectionCriteria"]}' run
...
```

```text
DBT_WARN_ERROR_OPTIONS='{"include": ["NoNodesForSelectionCriteria"]}' dbt run
...
```

Значения для `error`, `warn` и/или `silence` должны передаваться как массивы. Например, `dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run`, а не `dbt --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}' run`.

<File name='profiles.yml'>

```yaml
config:
  warn_error_options:
    include: all
    exclude: 
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.8">

```text
dbt --warn-error-options '{"error": "all"}' run
...
```

```text
dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run
...
```

```text
dbt --warn-error-options '{"error": ["NoNodesForSelectionCriteria"]}' run
...
```

```text
DBT_WARN_ERROR_OPTIONS='{"error": ["NoNodesForSelectionCriteria"]}' dbt run
...
```

<File name='profiles.yml'>

```yaml
config:
  warn_error_options:
    error: # Ранее назывался "include"
    warn: # Ранее назывался "exclude"
      - NoNodesForSelectionCriteria
    silence: # Игнорировать или пропускать предупреждения
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>