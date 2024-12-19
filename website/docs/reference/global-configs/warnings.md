---
title: "Предупреждения"
id: "warnings"
sidebar: "Предупреждения"
---

Включение конфигурации `WARN_ERROR` преобразует предупреждения dbt в ошибки. В любое время, когда dbt обычно выдает предупреждение, вместо этого будет сгенерирована ошибка. Примеры включают критерии `--select`, которые не выбирают ресурсы, устаревания, конфигурации без связанных моделей, недействительные конфигурации тестов или тесты и проверки свежести, которые настроены на возврат предупреждений.

<File name='Usage'>

```text
dbt --warn-error run
...
```

</File>

Преобразование любых предупреждений в ошибки может идеально соответствовать вашим потребностям, но могут быть предупреждения, которые вам не важны, и некоторые, которые имеют для вас большое значение. Конфигурация `WARN_ERROR_OPTIONS` предоставляет более детальный контроль над _точно теми типами предупреждений_, которые рассматриваются как ошибки.

<VersionBlock lastVersion="1.7">

Предупреждения, которые должны рассматриваться как ошибки, могут быть указаны через параметры `include` и/или `exclude`. Имена предупреждений можно найти в [файле types.py dbt-core](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), где каждое имя класса, унаследованного от `WarnLevel`, соответствует имени предупреждения (например, `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

Параметр `include` может быть установлен на `"all"` или `"*"` для обработки всех предупреждений как исключений, или на список конкретных имен предупреждений, которые следует рассматривать как исключения. Когда `include` установлен на `"all"` или `"*"`, необязательный параметр `exclude` может быть установлен для исключения конкретных предупреждений из обработки как исключений.

</VersionBlock>

<VersionBlock firstVersion="1.8">

- Предупреждения, которые должны рассматриваться как ошибки, могут быть указаны через параметры `error` и/или `warn`. Имена предупреждений можно найти в [файле types.py dbt-core](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/events/types.py), где каждое имя класса, унаследованного от `WarnLevel`, соответствует имени предупреждения (например, `AdapterDeprecationWarning`, `NoNodesForSelectionCriteria`).

- Параметр `error` может быть установлен на `"all"` или `"*"` для обработки всех предупреждений как исключений, или на список конкретных имен предупреждений, которые следует рассматривать как исключения. Когда `error` установлен на `"all"` или `"*"`, необязательный параметр `warn` может быть установлен для исключения конкретных предупреждений из обработки как исключений.

- Используйте параметр `silence`, чтобы игнорировать предупреждения через флаги проекта, не указывая список игнорируемых предупреждений каждый раз. Например, чтобы подавить предупреждения об устаревании или определенные предупреждения, которые вы хотите игнорировать в вашем проекте, вы можете указать их в параметре `silence`. Это полезно в крупных проектах, где определенные предупреждения не критичны и могут быть проигнорированы, чтобы снизить уровень шума и очистить логи.

<File name='dbt_project.yml'>

```yaml
name: "my_dbt_project"
tests:
  +enabled: True
flags:
  warn_error_options:
    error: # Ранее назывался "include"
    warn: # Ранее назывался "exclude"
    silence: # Для подавления или игнорирования предупреждений
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>

:::info `WARN_ERROR` и `WARN_ERROR_OPTIONS` взаимно исключают друг друга
`WARN_ERROR` и `WARN_ERROR_OPTIONS` взаимно исключают друг друга. Вы можете указать только одно, даже если вы указываете конфигурацию в нескольких местах (например, переменная окружения + флаг CLI), в противном случае вы увидите ошибку использования.
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

Значения для `error`, `warn` и/или `silence` должны передаваться в виде массивов. Например, `dbt --warn-error-options '{"error": "all", "warn": ["NoNodesForSelectionCriteria"]}' run`, а не `dbt --warn-error-options '{"error": "all", "warn": "NoNodesForSelectionCriteria"}' run`.

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
    silence: # Подавить или игнорировать предупреждения
      - NoNodesForSelectionCriteria
```

</File>

</VersionBlock>