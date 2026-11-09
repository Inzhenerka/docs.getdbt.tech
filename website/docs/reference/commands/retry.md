---
title: "О команде dbt retry"
sidebar_label: "retry"
id: "retry"
---

Команда retry повторно выполняет последний вызов с точки сбоя.

- Если до сбоя не был выполнен ни один узел (например, если выполнение завершилось сбоем на раннем этапе из-за ошибок подключения к хранилищу данных или недостаточных прав доступа), retry ничего не выполнит, поскольку нет записанных узлов, с которых можно начать повторное выполнение.
- В таких случаях рекомендуем проверить [файл `run_results.json`](/reference/artifacts/run-results-json) и вручную повторно запустить задание целиком, чтобы узлы были построены. 
- После выполнения хотя бы нескольких узлов можно использовать retry для повторного выполнения с любой новой точки сбоя.
- Если ранее выполненная команда завершилась успешно, retry завершится со статусом `no operation`. 

## Флаги retry {#retry-flags}

Флаги `dbt retry` применяются при использовании самостоятельно размещённой установки dbt или <Constant name="studio_ide" />.

:::note CLI платформы dbt
Если вы используете [CLI <Constant name="dbt_platform" />](/docs/platform/dbt-cli-installation) для работы с облачной средой, `dbt retry` принимает лишь небольшой набор параметров переопределения — обычно `--threads`, `--vars` и связанные параметры. Выполните `dbt retry --help` на своём компьютере, чтобы получить точный список параметров, поддерживаемых вашей сборкой CLI.
:::

<VersionBlock lastVersion="1.99">

При запуске `dbt retry` с движком <Constant name="core" /> поддерживаются следующие флаги:

| Флаг | Входное значение | Описание | Пример |
|------|-------------|-------------|---------|
| <code style={{ whiteSpace: 'nowrap' }}>--threads</code> | int | Переопределить количество потоков, использованных при исходном запуске | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --threads 8</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--vars</code> | YAML | Переопределить переменные исходного запуска | <code style={{ whiteSpace: 'nowrap' }}>{`dbt retry --vars '{"my_var": "new_value"}'`}</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--target</code> | target | Переопределить целевую среду исходного запуска | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --target prod</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profile</code> | profile | Переопределить профиль исходного запуска | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profile jaffle_shop</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profiles-dir</code> | path | Путь к каталогу, содержащему `profiles.yml` | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profiles-dir ~/.dbt</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--project-dir</code> | path | Путь к каталогу, содержащему `dbt_project.yml` | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --project-dir .</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--target-path</code> | path | Переопределить путь к целевому каталогу | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --target-path target</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--state</code> | path | Путь к каталогу, содержащему `run_results.json` предыдущего запуска (по умолчанию используется целевой каталог) | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --state path/to/previous/run</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--full-refresh</code> | — | Переопределить режим выполнения инкрементальных моделей, выполнив их с полным обновлением | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --full-refresh</code> |
<br />
Выполните `dbt retry --help`, чтобы получить полный список доступных флагов.
</VersionBlock>

<VersionBlock firstVersion="2.0">

При запуске `dbt retry` с <Constant name="fusion_engine" /> поддерживаются следующие флаги:

| Флаг | Входное значение | Описание | Пример |
|------|-------------|-------------|---------|
| <code style={{ whiteSpace: 'nowrap' }}>-t, --target</code> | target | Целевая среда для выполнения | <code style={{ whiteSpace: 'nowrap' }}>dbt retry -t prod</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--project-dir</code> | path | Каталог, из которого загружается проект dbt | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --project-dir .</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profile</code> | profile | Используемый профиль | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profile jaffle_shop</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profiles-dir</code> | path | Каталог, из которого загружаются профили | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profiles-dir ~/.dbt</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--packages-install-path</code> | path | Каталог для установки пакетов | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --packages-install-path dbt_packages</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--target-path</code> | path | Выходной каталог для всех создаваемых ресурсов | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --target-path target</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--vars</code> | vars | Переменные проекта (используйте формат, указанный в справке CLI) | <code style={{ whiteSpace: 'nowrap' }}>{`dbt retry --vars '{"my_var": "new_value"}'`}</code> |

<br />
Выполните `dbt retry --help`, чтобы получить полный список доступных флагов.

### Выбор узлов в dbt v2

В отличие от `dbt retry` с <Constant name="core" />, <Constant name="fusion" /> позволяет сузить набор повторно выполняемых узлов с помощью [`--select`](/reference/node-selection/syntax), [`--exclude`](/reference/node-selection/syntax) и [`--selector`](/reference/node-selection/yaml-selectors). При повторном запуске эти аргументы переопределяют набор узлов, выбранных при предыдущем вызове, а не просто наследуют его.

#### Примеры

```shell
dbt retry --select my_model+
```

```shell
dbt retry --exclude package:analytics --selector nightly_models
```

</VersionBlock>

## Поддерживаемые команды

- Если до момента ошибки не было выполнено ни одного узла (например, запуск завершился неудачей на раннем этапе из‑за проблем с подключением к хранилищу данных или с правами доступа), `dbt retry` ничего не выполнит, так как нет записанных узлов, с которых можно продолжить.
- В таких случаях мы рекомендуем проверить файл [`run_results.json`](/reference/artifacts/run-results-json) и вручную перезапустить полный job, чтобы узлы были построены.
- После того как хотя бы часть узлов была выполнена, вы можете использовать `dbt retry` для повторного запуска, начиная с любой новой точки сбоя.
- Если ранее выполненная команда завершилась успешно, `dbt retry` завершится как `no operation` (без выполнения каких‑либо действий).

Команда retry работает со следующими командами:

- [`build`](/reference/commands/build)
- [`check`](/reference/commands/check)
- [`compile`](/reference/commands/compile)
- [`clone`](/reference/commands/clone)
- [`docs generate`](/reference/commands/cmd-docs?version=1.12#dbt-docs-generate)
- [`seed`](/reference/commands/seed)
- [`snapshot`](/reference/commands/snapshot)
- [`test`](/reference/commands/test)
- [`run`](/reference/commands/run)
- [`run-operation`](/reference/commands/run-operation)

Retry обращается к [run_results.json](/reference/artifacts/run-results-json), чтобы определить, с какого места начать. Выполнение retry без исправления предыдущих ошибок дает <Term id="idempotent" /> результаты.

<VersionBlock lastVersion="1.99">

`dbt retry` повторно использует параметры выбора предыдущей команды, включая аргументы [`--select`](/reference/node-selection/syntax), [`--exclude`](/reference/node-selection/syntax) и [`--selector`](/reference/node-selection/yaml-selectors). Переопределить эти селекторы при повторном выполнении через CLI <Constant name="core" /> или <Constant name="dbt_platform" /> нельзя.

</VersionBlock>

<VersionBlock firstVersion="2.0">

При выполнении `dbt retry` можно передать новые аргументы [`--select`](/reference/node-selection/syntax), [`--exclude`](/reference/node-selection/syntax) или [`--selector`](/reference/node-selection/yaml-selectors), чтобы сузить набор повторно выполняемых узлов, как описано в разделе [Флаги retry](#retry-flags).

</VersionBlock>

Пример результатов выполнения `dbt retry` после успешного выполнения `dbt run`:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Nothing to do. Try checking your model configs and model specification args
```

Пример ситуации, когда при выполнении `dbt run` обнаруживается синтаксическая ошибка в модели:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')
 
1 of 5 START sql view model main.stg_customers ................................. [RUN]
2 of 5 START sql view model main.stg_orders .................................... [RUN]
3 of 5 START sql view model main.stg_payments .................................. [RUN]
1 of 5 OK created sql view model main.stg_customers ............................ [OK in 0.06s]
2 of 5 OK created sql view model main.stg_orders ............................... [OK in 0.06s]
3 of 5 OK created sql view model main.stg_payments ............................. [OK in 0.07s]
4 of 5 START sql table model main.customers .................................... [RUN]
5 of 5 START sql table model main.orders ....................................... [RUN]
4 of 5 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]
5 of 5 OK created sql table model main.orders .................................. [OK in 0.04s]
 
Finished running 3 view models, 2 table models in 0 hours 0 minutes and 0.15 seconds (0.15s).
  
Completed with 1 error and 0 warnings:
  
Runtime Error in model customers (models/customers.sql)
 Parser Error: syntax error at or near "selct"

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```

Пример последующего неудачного выполнения `dbt retry` без исправления ошибок:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```

Пример успешного выполнения `dbt retry` после исправления ошибок:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 OK created sql table model main.customers ............................... [OK in 0.05s]

Finished running 1 table model in 0 hours 0 minutes and 0.09 seconds (0.09s).
 
Completed successfully
  
Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

В каждом сценарии `dbt retry` возобновляет выполнение с места ошибки, а не запускает повторно все вышестоящие зависимости.
