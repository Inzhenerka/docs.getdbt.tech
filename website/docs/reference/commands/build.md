---
title: "О команде dbt build"
sidebar_label: "build"
id: "build"
---

Команда `dbt build` выполняет следующие действия:
- запускает [models](/docs/build/models)
- выполняет проверки [tests](/docs/build/data-tests)
- создает [snapshots](/docs/build/snapshots)
- загружает [seeds](/docs/build/seeds)
- собирает [user-defined functions](/docs/build/udfs) (доступно начиная с dbt Core v1.11 и в <Constant name="fusion_engine" />)

В порядке DAG для выбранных ресурсов или всего проекта.

## Подробности {#details}

**Артефакты:** Задача `build` создаст один [manifest](/reference/artifacts/manifest-json) и один [артефакт результатов выполнения](/reference/artifacts/run-results-json). Результаты выполнения будут включать информацию обо всех моделях, тестах, данных и снимках, которые были выбраны для сборки, объединенные в один файл.

**Пропуск при сбоях:** Тесты на вышестоящих ресурсах будут блокировать выполнение нижестоящих ресурсов, а сбой теста приведёт к тому, что эти нижестоящие ресурсы будут полностью пропущены. Например, если `model_b` зависит от `model_a`, и тест `unique` на `model_a` завершается с ошибкой, то `model_b` будет иметь статус `SKIP`.
- Не хотите, чтобы тест приводил к пропуску? Измените его [severity или thresholds](/reference/resource-configs/severity) на `warn` вместо `error`
- В случае теста с несколькими родительскими ресурсами, где один родитель зависит от другого (например, тест `relationships` между `model_a` и `model_b`), этот тест будет блокировать и пропускать только потомков наиболее «нижестоящего» родителя (`model_b`)
- Если у вас есть тест с несколькими родителями, которые не зависят друг от друга, dbt [пропускает](https://github.com/dbt-labs/dbt-core/blob/d5071fa13502be273596a0b7c8b13d14b6c68655/core/dbt/compilation.py#L224-L257) нижестоящий узел только в том случае, если этот узел зависит от всех этих родителей

**Выбор ресурсов:** Задача `build` поддерживает стандартный синтаксис выбора (`--select`, `--exclude`, `--selector`), а также флаг `--resource-type`, который предлагает окончательный фильтр (как и `list`). Какие бы ресурсы ни были выбраны, именно они будут запускаться/тестироваться/создаваться/загружаться с помощью `build`.
- Помните, что тесты поддерживают косвенный выбор, поэтому `dbt build -s model_a` будет как запускать, так и тестировать `model_a`. Что это значит? Любые тесты, которые напрямую зависят от `model_a`, будут включены, если только эти тесты не зависят также от других невыбранных родителей. См. [выбор тестов](/reference/node-selection/test-selection-examples) для подробностей и примеров.

**Флаги:** Задача `build` поддерживает все те же флаги, что и `run`, `test`, `snapshot` и `seed`. Для флагов, которые используются в нескольких задачах (например, `--full-refresh`), `build` будет использовать одно и то же значение для всех выбранных типов ресурсов (например, как для моделей, так и для данных будет выполнено полное обновление).


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
## Functions {#functions}
_Доступно начиная с dbt Core v1.11 и в <Constant name="fusion_engine" />_

Команда `build` собирает [пользовательские функции](/docs/build/udfs) как часть выполнения DAG. Чтобы собрать или пересобрать **только** `functions` в вашем проекте, выполните `dbt build --select "resource_type:function"`. Например:

```bash
dbt build --select "resource_type:function"
dbt-fusion 2.0.0-preview.45
 Succeeded [  0.98s] function dbt_schema.whoami (function)
 Succeeded [  1.12s] function dbt_schema.area_of_circle (function)
```
