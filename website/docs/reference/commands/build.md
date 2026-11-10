---
title: "О команде dbt build"
sidebar_label: "build"
id: "build"
---

import SnapshotFullRefresh from '/snippets/_snapshot-full-refresh.md';
import InfoSchemaStaticAnalysis from '/snippets/_info-schema-static-analysis.md';
import InfoSchemaIntro from '/snippets/_info-schema-intro.md';

Команда `dbt build` выполняет следующие действия:
- запускает [модели](/docs/build/models)
- выполняет [тесты](/docs/build/data-tests)
- создаёт [снимки](/docs/build/snapshots)
- загружает [seed-файлы](/docs/build/seeds)
- создаёт [пользовательские функции](/docs/build/udfs) (доступно начиная с <Constant name="dbt" /> v1.11)

В порядке DAG для выбранных ресурсов или всего проекта.

## Подробности {#details}

**Артефакты:** Задача `build` создаст один [manifest](/reference/artifacts/manifest-json) и один [артефакт результатов выполнения](/reference/artifacts/run-results-json). Результаты выполнения будут включать информацию обо всех моделях, тестах, данных и снимках, которые были выбраны для сборки, объединенные в один файл.

<VersionBlock firstVersion="2.0">

<InfoSchemaIntro label="Информационная схема dbt:" />

```shell
dbt build --generate-info-schema
```

<InfoSchemaStaticAnalysis />

```shell
dbt build --generate-info-schema --static-analysis strict
```

</VersionBlock>

**Пропуск при сбоях:** Тесты вышестоящих ресурсов блокируют выполнение нижестоящих ресурсов, а сбой теста приводит к полному пропуску этих нижестоящих ресурсов. Например, если `model_b` зависит от `model_a` и тест `unique` для `model_a` завершается с ошибкой, то `model_b` получает статус `SKIP`.
- Не хотите, чтобы тест приводил к пропуску ресурсов? Измените его [уровень серьёзности или пороговые значения](/reference/resource-configs/severity), чтобы использовать `warn` вместо `error`.
- Если у теста несколько родительских ресурсов и один из них зависит от другого (например, тест `relationships` между `model_a` и `model_b`), этот тест блокирует и пропускает только дочерние ресурсы самого нижестоящего родительского ресурса (`model_b`).
- Если у теста несколько родительских ресурсов, независимых друг от друга, dbt [пропускает](https://github.com/dbt-labs/dbt/blob/d5071fa13502be273596a0b7c8b13d14b6c68655/core/dbt/compilation.py#L224-L257) нижестоящий узел, только если этот узел зависит от всех этих родительских ресурсов.

<VersionBlock firstVersion="2.0">

**Проверки:** `dbt build` выполняет [проверки](/docs/build/checks) перед компиляцией или выполнением любых моделей. Проверки — это SQL-запросы, которые вы пишете к [информационной схеме dbt](/docs/build/dbt-information-schema), чтобы обеспечить соблюдение стандартов проекта вашей команды. Например, проверка может требовать, чтобы у каждой модели было описание. Проверка считается пройденной, если её запрос не возвращает строк. Непройденная проверка останавливает сборку до материализации любых ресурсов, если только для параметра `severity` этой проверки не задано значение `warn`.

</VersionBlock>

<VersionBlock firstVersion="1.12">

**Пропуск при ошибках моделей:** По умолчанию, если модель завершается с ошибкой, все нижестоящие модели пропускаются. Задайте для модели [`on_error: continue`](/reference/resource-configs/on_error), чтобы разрешить выполнение нижестоящих моделей, даже если эта модель завершается с ошибкой.

</VersionBlock>

<VersionBlock lastVersion="1.11">

**Выбор ресурсов:** Задача `build` поддерживает стандартный синтаксис выбора (`--select`, `--exclude`, `--selector`), а также флаг `--resource-type`, который позволяет применить заключительный фильтр (как и в `list`). Именно выбранные ресурсы будут выполнены, протестированы, обработаны как snapshot или загружены как seed с помощью `build`.
</VersionBlock>

<VersionBlock firstVersion="1.12">

**Выбор ресурсов:** Задача `build` поддерживает стандартный синтаксис выбора (`--select`, `--exclude`), а также флаг `--resource-type`, который позволяет применить заключительный фильтр (как и в `list`). Именно выбранные ресурсы будут выполнены, протестированы, обработаны как snapshot или загружены как seed с помощью `build`.
</VersionBlock>

- Помните, что тесты поддерживают косвенный выбор, поэтому `dbt build -s model_a` и выполнит, _и_ протестирует `model_a`. Что это означает? Будут включены все тесты, напрямую зависящие от `model_a`, при условии, что эти тесты не зависят также от других, невыбранных родительских ресурсов. Подробности и примеры см. в разделе [Выбор тестов](/reference/node-selection/test-selection-examples).

**Флаги:** Задача `build` поддерживает те же флаги, что и `run`, `test`, `snapshot` и `seed`. Для флагов, общих для нескольких задач (например, `--full-refresh`), `build` использует одно и то же значение для всех выбранных типов ресурсов, которые его поддерживают (например, и модели, и seed-ресурсы будут полностью обновлены).

<SnapshotFullRefresh />

<VersionBlock firstVersion="2.0">

### Флаг `--skip-checks` {#the---skip-checks-flag}

Флаг `--skip-checks` позволяет команде `build` пропустить обязательный этап [проверок](/docs/build/checks).

```shell
dbt build --skip-checks
```

Чтобы отключить одну проверку, не пропуская весь этап, задайте в её конфигурации `enabled: false`:

```yaml
checks:
  - name: all_models_have_descriptions
    config:
      enabled: false
```

</VersionBlock>

### Флаг `--empty` {#the-empty-flag}

Команда `build` поддерживает флаг `--empty` для выполнения сухих запусков только со схемой. Флаг `--empty` ограничивает ссылки и источники до нуля строк. dbt все равно выполнит SQL модели в целевом хранилище данных, но избежит дорогостоящих чтений входных данных. Это проверяет зависимости и гарантирует, что ваши модели будут правильно собраны.

import SQLCompilationError from '/snippets/_render-method.md';

<SQLCompilationError />

## Тесты {#tests}

Когда `dbt build` выполняется с применением модульных тестов, модели обрабатываются в соответствии с их родословной и зависимостями. Тесты выполняются следующим образом:

- [Модульные тесты](/docs/build/unit-tests) выполняются на SQL модели.
- Модель материализуется.
- [Тесты данных](/docs/build/data-tests) выполняются на модели.

Это экономит расходы на хранилище, так как модель будет материализована только в случае успешного прохождения модульных тестов.

Модульные тесты и тесты данных можно выбрать с помощью `--select test_type:unit` или `--select test_type:data` для `dbt build` (то же самое для флага `--exclude`).

### Примеры {#examples}

```
$ dbt build
Running with dbt=1.9.0-b2
Found 1 model, 4 tests, 1 snapshot, 1 analysis, 341 macros, 0 operations, 1 seed file, 2 sources, 2 exposures

18:49:43 | Concurrency: 1 threads (target='dev')
18:49:43 |
18:49:43 | 1 of 7 START seed file dbt_jcohen.my_seed............................ [RUN]
18:49:43 | 1 of 7 OK loaded seed file dbt_jcohen.my_seed........................ [INSERT 2 in 0.09s]
18:49:43 | 2 of 7 START view model dbt_jcohen.my_model.......................... [RUN]
18:49:43 | 2 of 7 OK created view model dbt_jcohen.my_model..................... [CREATE VIEW in 0.12s]
18:49:43 | 3 of 7 START test not_null_my_seed_id................................ [RUN]
18:49:43 | 3 of 7 PASS not_null_my_seed_id...................................... [PASS in 0.05s]
18:49:43 | 4 of 7 START test unique_my_seed_id.................................. [RUN]
18:49:43 | 4 of 7 PASS unique_my_seed_id........................................ [PASS in 0.03s]
18:49:43 | 5 of 7 START snapshot snapshots.my_snapshot.......................... [RUN]
18:49:43 | 5 of 7 OK snapshotted snapshots.my_snapshot.......................... [INSERT 0 5 in 0.27s]
18:49:43 | 6 of 7 START test not_null_my_model_id............................... [RUN]
18:49:43 | 6 of 7 PASS not_null_my_model_id..................................... [PASS in 0.03s]
18:49:43 | 7 of 7 START test unique_my_model_id................................. [RUN]
18:49:43 | 7 of 7 PASS unique_my_model_id....................................... [PASS in 0.02s]
18:49:43 |
18:49:43 | Finished running 1 seed, 1 view model, 4 tests, 1 snapshot in 1.01s.

Completed successfully

Done. PASS=7 WARN=0 ERROR=0 SKIP=0 TOTAL=7
```
## Функции {#functions}
_Доступно начиная с dbt Core v1.11 и в <Constant name="fusion_engine" />_

## Функции
_Доступно начиная с <Constant name="dbt" /> v1.11_

Команда `build` создает [пользовательские функции](/docs/build/udfs) в рамках выполнения DAG. Чтобы создать или пересоздать только ресурсы типа `functions` в вашем проекте, выполните `dbt build --select "resource_type:function"`. Например:

```bash
dbt build --select "resource_type:function"
dbt-fusion 2.0.1
 Succeeded [  0.98s] function dbt_schema.whoami (function)
 Succeeded [  1.12s] function dbt_schema.area_of_circle (function)
```
