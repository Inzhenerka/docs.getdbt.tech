---
title: "Обновление до версии v1.5"
description: Новые функции и изменения в dbt Core v1.5
id: "upgrading-to-v1.5"
displayed_sidebar: "docs"
---

dbt Core v1.5 — это релиз с новыми функциями, с двумя значительными дополнениями:
1. [**Управление моделями**](/docs/collaborate/govern/about-model-governance) — доступ, контракты, версии — первая фаза [много-проектных развертываний](https://github.com/dbt-labs/dbt-core/discussions/6725)
2. Точка входа для Python для [**программных вызовов**](/reference/programmatic-invocations), наравне с CLI

## Ресурсы

- [Список изменений](https://github.com/dbt-labs/dbt-core/blob/1.5.latest/CHANGELOG.md)
- [Руководство по установке dbt Core CLI](/docs/core/installation-overview)
- [Руководство по обновлению в облаке](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
- [График релизов](https://github.com/dbt-labs/dbt-core/issues/6715)

## Что нужно знать перед обновлением

dbt Labs стремится обеспечить обратную совместимость для всех версий 1.x, за исключением изменений, явно упомянутых ниже. Если вы столкнетесь с ошибкой при обновлении, пожалуйста, сообщите нам, [создав проблему](https://github.com/dbt-labs/dbt-core/issues/new).

### Изменения в поведении

:::info Почему изменения в предыдущем поведении?

Этот релиз включает значительные новые функции и переработку CLI и процесса инициализации `dbt-core`. В рамках рефакторинга его внутренней структуры с [`argparse`](https://docs.python.org/3/library/argparse.html) на [`click`](https://click.palletsprojects.com) мы внесли несколько изменений в конфигурацию времени выполнения. Итогом этих изменений стали более согласованные и практичные варианты конфигурации и более читаемая кодовая база.

**_Где это возможно, мы предоставим обратную совместимость и предупреждения о депрекации как минимум на одну минорную версию до фактического удаления старой функциональности._** В этих случаях мы все же оставляем за собой право полностью удалить обратную совместимость для устаревшей функциональности в будущей минорной версии v1.x `dbt-core`.

:::

Установка `log-path` и `target-path` в `dbt_project.yml` устарела для согласованности с другими конфигурациями времени выполнения, специфичными для вызова ([dbt-core#6882](https://github.com/dbt-labs/dbt-core/issues/6882)). Мы рекомендуем устанавливать через переменные окружения или флаг CLI.

Команда `dbt list` теперь будет включать логи уровня `INFO` по умолчанию. Ранее команда `list` (и _только_ команда `list`) имела логирование уровня `WARN` в stdout, чтобы поддерживать передачу ее результатов в [`jq`](https://jqlang.github.io/jq/manual/), файл или другой процесс. Для достижения этой цели вы можете использовать любой из следующих параметров:
- `dbt --log-level warn list` (рекомендуется; эквивалентно предыдущему значению по умолчанию)
- `dbt --quiet list` (подавляет все логи ниже уровня ERROR, за исключением "напечатанных" сообщений и вывода `list`)

Следующие переменные окружения были переименованы для согласованности с конвенцией, принятой для всех других параметров:
- `DBT_DEFER_TO_STATE` → `DBT_DEFER`
- `DBT_FAVOR_STATE_MODE` → `DBT_FAVOR_STATE`
- `DBT_NO_PRINT` → `DBT_PRINT`
- `DBT_ARTIFACT_STATE_PATH` → `DBT_STATE`

Как описано в [dbt-core#7169](https://github.com/dbt-labs/dbt-core/pull/7169), параметры командной строки, которые могли быть тихими ранее, больше не будут тихими. См. [dbt-labs/dbt-core#7158](https://github.com/dbt-labs/dbt-core/issues/7158) и [dbt-labs/dbt-core#6800](https://github.com/dbt-labs/dbt-core/issues/6800) для получения дополнительных примеров поведения, которое мы исправляем.

Пустой ключ `tests:` в yaml-файле теперь будет вызывать ошибку валидации, вместо того чтобы быть тихо пропущенным. Вы можете решить эту проблему, удалив пустой ключ `tests:`, или явно установив его в пустой список:
```yml
#  ❌ это вызовет ошибку
models:
  - name: my_model
    tests:
    config: ...

# ✅ это нормально
models:
  - name: my_model
    tests: [] # todo! добавить тесты позже
    config: ...
```

Некоторые параметры, которые ранее могли быть указаны _после_ подкоманды, теперь могут быть указаны только _до_. Это включает в себя инверсии параметров, например, `--write-json` и `--no-write-json`. Список затронутых параметров:

<details>
<summary>Список затронутых параметров</summary>

```bash
--cache-selected-only | --no-cache-selected-only
--debug, -d | --no-debug
--deprecated-print | --deprecated-no-print
--enable-legacy-logger | --no-enable-legacy-logger
--fail-fast, -x | --no-fail-fast
--log-cache-events | --no-log-cache-events
--log-format
--log-format-file
--log-level
--log-level-file
--log-path
--macro-debugging | --no-macro-debugging
--partial-parse | --no-partial-parse
--partial-parse-file-path
--populate-cache | --no-populate-cache
--print | --no-print
--printer-width
--quiet, -q | --no-quiet
--record-timing-info, -r
--send-anonymous-usage-stats | --no-send-anonymous-usage-stats
--single-threaded | --no-single-threaded
--static-parser | --no-static-parser
--use-colors | --no-use-colors
--use-colors-file | --no-use-colors-file
--use-experimental-parser | --no-use-experimental-parser
--version, -V, -v
--version-check | --no-version-check
--warn-error
--warn-error-options
--write-json | --no-write-json

```

</details>

Кроме того, некоторые параметры, которые ранее могли быть указаны _до_ подкоманды, теперь могут быть указаны только _после_. Любой параметр, _не_ входящий в приведенный выше список, должен появляться _после_ подкоманды, начиная с версии v1.5 и позже. Например, `--profiles-dir`.

Встроенный макрос [collect_freshness](https://github.com/dbt-labs/dbt-core/blob/1.5.latest/core/dbt/include/global_project/macros/adapters/freshness.sql) теперь возвращает весь объект `response`, а не только результат `table`. Если вы используете пользовательскую переопределение для `collect_freshness`, убедитесь, что вы также возвращаете объект `response`; в противном случае некоторые из ваших команд dbt никогда не завершатся. Например:

```sql
{{ return(load_result('collect_freshness')) }}
```

Наконец: Встроенный макрос [`generate_alias_name`](https://github.com/dbt-labs/dbt-core/blob/1.5.latest/core/dbt/include/global_project/macros/get_custom_name/get_custom_alias.sql) теперь включает логику для обработки версионных моделей. Если ваш проект переопределил макрос `generate_alias_name` с пользовательской логикой, и вы хотите начать использовать [версии моделей](/docs/collaborate/govern/model-versions), вам нужно будет обновить логику в вашем макросе. Обратите внимание, что, хотя это **не** является обязательным для обновления до версии v1.5 — только для использования новой функции — мы рекомендуем сделать это во время обновления, независимо от того, планируете ли вы использовать версии моделей завтра или в далеком будущем.

Аналогично, если ваш проект переопределил макрос `ref` с пользовательской логикой, вам нужно будет обновить логику в вашем макросе, как описано [здесь](https://docs.getdbt.com/reference/dbt-jinja-functions/builtins).

### Для потребителей артефактов dbt (метаданные)

Версия схемы [manifest](/reference/artifacts/manifest-json) будет обновлена до `v9`. Конкретные изменения:
- Добавление `groups` в качестве ключа верхнего уровня
- Добавление `access`, `constraints`, `version`, `latest_version` в качестве атрибутов узла верхнего уровня для моделей
- Добавление `constraints` в качестве атрибута уровня столбца
- Добавление `group` и `contract` в качестве конфигураций узла
- Для поддержки версий моделей тип `refs` изменен с `List[List[str]]` на `List[RefArgs]`, с вложенными ключами `name: str`, `package: Optional[str] = None`, и `version: Union[str, float, NoneType] = None)`.

### Для разработчиков адаптеров плагинов

Для получения более подробной информации и для вопросов, пожалуйста, прочитайте и прокомментируйте обсуждение на GitHub: [dbt-labs/dbt-core#7213](https://github.com/dbt-labs/dbt-core/discussions/7213).

## Новая и измененная документация

### Управление моделями

Первая фаза поддержки развертываний dbt в масштабе, через несколько проектов с четко определенными границами владения и интерфейса. [Прочитайте об управлении моделями](/docs/collaborate/govern/about-model-governance), все это ново в версии v1.5.

### Обновленный CLI

Компилируйте и просматривайте модели dbt и `--inline` dbt-SQL запросы в CLI, используя:
- [`dbt compile`](/reference/commands/compile)
- [`dbt show`](/reference/commands/show) (новое!)

[Методы выбора узлов](/reference/node-selection/methods) могут использовать подстановочные знаки в стиле Unix для выбора узлов, соответствующих шаблону:
```
dbt ls --select "tag:team_*"
```

И (!): первая точка входа для [программных вызовов](/reference/programmatic-invocations), наравне с командами CLI.

Запустите `dbt --help`, чтобы увидеть новую и улучшенную справочную документацию :)

### Быстрые изменения
- [`version: 2` ключ верхнего уровня](/reference/project-configs/version) теперь **необязателен** во всех YAML-файлах. Также, [`config-version: 2`](/reference/project-configs/config-version) и `version:` ключи верхнего уровня теперь необязательны в файлах `dbt_project.yml`.
- [События и логирование](/reference/events-logging): Добавлен `node_relation` (`database`, `schema`, `identifier`) в словарь `node_info`, доступный на событиях, специфичных для узлов
- Поддержка установки `--project-dir` через переменную окружения: [`DBT_PROJECT_DIR`](/reference/dbt_project.yml)
- Более детализированные конфигурации для логирования (для установки [формата логов](/reference/global-configs/logs#log-formatting), [уровней логов](/reference/global-configs/logs#log-level) и [цветовой схемы](/reference/global-configs/logs#color)) и [заполнения кеша](/reference/global-configs/cache#cache-population)