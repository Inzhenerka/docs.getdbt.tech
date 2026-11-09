---
title: "Обновление до v1.5"
description: Новые возможности и изменения в dbt v1.5
id: "upgrading-to-v1.5"
displayed_sidebar: "docs"
availability:
  engine: v1
  access: free
---

import CoreVersionDeprecation from '/snippets/_core-version-deprecation-callout.md';

<CoreVersionDeprecation />

<Constant name="dbt" /> v1.5 — выпуск с новыми возможностями, включающий два важных дополнения:
1. [**Управление моделями**](/docs/mesh/govern/about-model-governance) — доступ, контракты, версии — первый этап поддержки [развертываний с несколькими проектами](https://github.com/dbt-labs/dbt/discussions/6725)
2. Точка входа на Python для [**программного вызова**](/reference/programmatic-invocations), с теми же возможностями, что и CLI

## Полезные ресурсы

- [Журнал изменений](https://github.com/dbt-labs/dbt/blob/1.5.latest/CHANGELOG.md)
- [Руководство по установке <Constant name="core" /> CLI](/docs/local/install-dbt)
- [Руководство по обновлению Cloud](/docs/dbt-versions/upgrade-dbt-platform-version)
- [График выпусков](https://github.com/dbt-labs/dbt/issues/6715)

## Что нужно знать перед обновлением

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x, за исключением изменений, явно указанных ниже. Если после обновления вы столкнетесь с ошибкой, сообщите нам об этом, [создав issue](https://github.com/dbt-labs/dbt/issues/new).

<a id="behavior-changes" />

### Изменения поведения

:::info Почему меняется прежнее поведение?

Этот выпуск включает важные новые возможности, а также переработку CLI и процесса инициализации `dbt-core`. В рамках рефакторинга внутренних механизмов и перехода с [`argparse`](https://docs.python.org/3/library/argparse.html) на [`click`](https://click.palletsprojects.com) мы внесли ряд изменений в конфигурацию времени выполнения. В результате параметры конфигурации стали более согласованными и практичными, а кодовая база — более понятной.

**_Везде, где это возможно, мы будем сохранять обратную совместимость и выводить предупреждения об устаревании как минимум в течение одной минорной версии, прежде чем удалять старую функциональность._** В таких случаях мы по-прежнему оставляем за собой право полностью удалить обратную совместимость для устаревшей функциональности в одной из будущих минорных версий v1.x `dbt-core`.

:::

Настройка `log-path` и `target-path` в `dbt_project.yml` объявлена устаревшей для согласованности с другими настройками времени выполнения, относящимися к конкретному вызову ([dbt-labs/dbt#6882](https://github.com/dbt-labs/dbt/issues/6882)). Вместо этого рекомендуем задавать их через переменную окружения или флаг CLI.

Команда `dbt list` теперь по умолчанию выводит сообщения журнала уровня `INFO`. Ранее команда `list` (и _только_ команда `list`) выводила в stdout сообщения журнала начиная с уровня `WARN`, чтобы ее результаты можно было передавать через конвейер в [`jq`](https://jqlang.github.io/jq/manual/), файл или другой процесс. Для этого теперь можно использовать любой из следующих параметров:
- `dbt list --log-level warn` (рекомендуется; соответствует прежнему поведению по умолчанию)
- `dbt list --quiet` (подавляет все сообщения журнала ниже уровня ERROR, кроме сообщений, выводимых через "print", и результатов `list`)

Следующие переменные окружения переименованы для согласованности с соглашением, используемым для всех остальных параметров:
- `DBT_DEFER_TO_STATE` → `DBT_DEFER`
- `DBT_FAVOR_STATE_MODE` → `DBT_FAVOR_STATE`
- `DBT_NO_PRINT` → `DBT_PRINT`
- `DBT_ARTIFACT_STATE_PATH` → `DBT_STATE`

Как описано в [dbt-labs/dbt#7169](https://github.com/dbt-labs/dbt/pull/7169), параметры командной строки, которые раньше могли игнорироваться без каких-либо сообщений, больше не будут игнорироваться молча. Дополнительные примеры исправляемого поведения см. в [dbt-labs/dbt#7158](https://github.com/dbt-labs/dbt/issues/7158) и [dbt-labs/dbt#6800](https://github.com/dbt-labs/dbt/issues/6800).

Пустой ключ `tests:` в YAML-файле теперь вызывает ошибку валидации, а не пропускается без уведомления. Чтобы устранить ошибку, удалите пустой ключ `tests:` или явно задайте для него пустой список:
```yml
#  ❌ это вызовет ошибку
models:
  - name: my_model
    tests:
    config: ...

# ✅ так допустимо
models:
  - name: my_model
    tests: [] # todo! добавить тесты позже
    config: ...
```

Некоторые параметры, которые раньше можно было указывать _после_ подкоманды, теперь можно указывать только _перед_ ней. Это также относится к обратным вариантам параметров, например `--write-json` и `--no-write-json`. Список затронутых параметров:

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


Кроме того, некоторые параметры, которые раньше можно было указывать _перед_ подкомандой, теперь можно указывать только _после_ нее. Начиная с v1.5 любой параметр, _не_ включенный в приведенный выше список, должен указываться _после_ подкоманды. Например, `--profiles-dir`.


Встроенный макрос [collect_freshness](https://github.com/dbt-labs/dbt/blob/1.5.latest/core/dbt/include/global_project/macros/adapters/freshness.sql) теперь возвращает весь объект `response`, а не только результат `table`. Если вы используете собственную реализацию `collect_freshness`, убедитесь, что она тоже возвращает объект `response`; иначе некоторые команды dbt никогда не завершатся. Например:

```sql
{{ return(load_result('collect_freshness')) }}
```

И наконец: [встроенный макрос `generate_alias_name`](https://github.com/dbt-labs/dbt/blob/1.5.latest/core/dbt/include/global_project/macros/get_custom_name/get_custom_alias.sql) теперь включает логику обработки версионируемых моделей. Если в вашем проекте макрос `generate_alias_name` переопределен с собственной логикой и вы хотите начать использовать [версии моделей](/docs/mesh/govern/model-versions), вам потребуется обновить логику этого макроса. Обратите внимание: это **не** обязательное условие обновления до v1.5, а лишь требование для использования новой возможности. Тем не менее мы рекомендуем сделать это при обновлении, независимо от того, планируете ли вы использовать версии моделей завтра или в далеком будущем.

Аналогично, если в вашем проекте макрос `ref` переопределен с собственной логикой, вам потребуется обновить ее, как описано [здесь](/reference/dbt-jinja-functions/builtins).

### Для пользователей артефактов dbt (метаданных)

Версия схемы [manifest](/reference/artifacts/manifest-json) будет обновлена до `v9`. Конкретные изменения:
- Добавлен ключ верхнего уровня `groups`
- Добавлены атрибуты узлов верхнего уровня `access`, `constraints`, `version`, `latest_version` для моделей
- Добавлен атрибут уровня столбца `constraints`
- Добавлены настройки узлов `group` и `contract`
- Для поддержки версий моделей тип `refs` изменен с `List[List[str]]` на `List[RefArgs]`, с вложенными ключами `name: str`, `package: Optional[str] = None` и `version: Union[str, float, NoneType] = None)`.

### Для разработчиков и сопровождающих плагинов адаптеров

Чтобы получить более подробную информацию и задать вопросы, ознакомьтесь с обсуждением на GitHub и оставьте комментарий: [dbt-labs/dbt#7213](https://github.com/dbt-labs/dbt/discussions/7213).

## Новая и обновленная документация

### Управление моделями

Первый этап поддержки масштабных развертываний dbt в нескольких проектах с четко определенными зонами ответственности и границами интерфейсов. [Прочитайте об управлении моделями](/docs/mesh/govern/about-model-governance): все эти возможности появились в v1.5.

### Обновленный CLI

Компилируйте и предварительно просматривайте модели dbt и dbt-SQL-запросы с `--inline` в CLI с помощью:
- [`dbt compile`](/reference/commands/compile)
- [`dbt show`](/reference/commands/show) (новинка!)

[Методы выбора узлов](/reference/node-selection/methods) могут использовать подстановочные символы в стиле Unix для выбора узлов, соответствующих шаблону:
```
dbt ls --select "tag:team_*"
```

А еще (!): впервые появилась точка входа для [программного вызова](/reference/programmatic-invocations) с теми же возможностями, что и команды CLI.

Выполните `dbt --help`, чтобы увидеть новую, улучшенную справку :)

<a id="quick-hits" />

### Кратко о других изменениях
- [Ключ верхнего уровня `version: 2`](/reference/project-configs/version) теперь **необязателен** во всех YAML-файлах. Кроме того, ключи верхнего уровня [`config-version: 2`](/reference/project-configs/config-version) и `version:` теперь необязательны в файлах `dbt_project.yml`.
- [События и журналирование](/reference/events-logging): в словарь `node_info`, доступный в событиях, относящихся к конкретным узлам, добавлен `node_relation` (`database`, `schema`, `identifier`)
- Поддерживается задание `--project-dir` через переменную окружения: [`DBT_PROJECT_DIR`](/reference/dbt_project.yml)
- Более детальные настройки журналирования (для задания [формата журнала](/reference/global-configs/logs#log-formatting), [уровней журналирования](/reference/global-configs/logs#log-level) и [цветового оформления](/reference/global-configs/logs#color)) и [заполнения кеша](/reference/global-configs/cache#cache-population)
- [dbt перезаписывает файл `manifest.json`](/reference/node-selection/state-comparison-caveats#overwrites-the-manifestjson) во время разбора, поэтому, если вы ссылаетесь через `--state` на каталог `target/`, может появиться предупреждение о том, что сохраненный манифест не найден.
