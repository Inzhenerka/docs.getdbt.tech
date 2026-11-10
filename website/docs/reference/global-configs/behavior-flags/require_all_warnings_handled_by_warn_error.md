---
title: "Обработка всех предупреждений через warn-error"
id: "require_all_warnings_handled_by_warn_error"
sidebar_label: "Обработка всех предупреждений через warn-error"
---



| require_all_warnings_handled_by_warn_error | <Constant name="dbt" /> **v1 Latest** | <Constant name="core" /> |
|---|---|---|
| Введён | 2025.06 | 1.10.0 |
| Стабилизирован (по умолчанию → `true`) | 2026.09 | 1.12.0 |
| Удалён | — | — |

<br />

Начиная с <Constant name="dbt" /> v1.12, флаг `require_all_warnings_handled_by_warn_error` по умолчанию имеет значение `true`.

Когда этот флаг включён, все предупреждения, возникающие во время выполнения, направляются в обработчик `--warn-error` / `--warn-error-options`. Это обеспечивает единообразное поведение при преобразовании предупреждений в ошибки или их подавлении. Когда флаг имеет значение `false`, обработчик обрабатывает лишь некоторые предупреждения, а остальные могут его обходить.

В проектах, использующих `--warn-error` (или `--warn-error-options='{"error":"all"}'`), сборки могут завершаться с ошибкой из-за предупреждений, которые ранее игнорировались.

## Влияние

Это затрагивает только проекты, использующие `warn_error: true` или `--warn-error`, — такие настройки часто применяются в CI или в производственных заданиях <Constant name="dbt_platform" />, настроенных на строгий режим. Проекты без `--warn-error` не затрагиваются.

Примеры предупреждений, которые для пользователей с `warn_error: true` теперь приводят к ошибке, а не просто записываются в журнал:

- `JinjaLogWarning` — возникает, когда типы столбцов объявлены для несуществующих столбцов seed
- `WarnStateTargetEqual` — возникает, когда для каталогов `--state` и `--target` указан один и тот же путь
- `SelectExcludeIgnoredWithSelectorWarning` — возникает, когда устаревший флаг `--selector` используется вместе с `--select` или `--exclude`
- `RunResultWarningMessage` — возникает, когда тест или модель возвращает статус `WARN`
- Различные предупреждения на уровне адаптеров, которые ранее не обрабатывались через `--warn-error`

<Expandable alt_header="Рекомендуемые действия">

Если задание, использующее `warn_error: true` или `--warn-error`, завершается с ошибкой `EventCompilationError` на этапе разбора или выполнения из-за класса событий, который ранее появлялся только в виде строки журнала, вы можете подавить отдельные предупреждения с помощью `warn_error_options`:

<File name='dbt_project.yml'>

```yaml
flags:
  warn_error_options:
    silence:
      - JinjaLogWarning
      - WarnStateTargetEqual
      - RunResultWarningMessage
      - SelectExcludeIgnoredWithSelectorWarning
```

</File>

Также можно использовать список `warn`, чтобы оставить определённые события предупреждениями, даже если `--warn-error` в противном случае преобразовал бы их в ошибки.

Чтобы отключить это поведение, установите для флага значение `false`:

<File name='dbt_project.yml'>

```yaml
flags:
  require_all_warnings_handled_by_warn_error: false
```

</File>

</Expandable>
