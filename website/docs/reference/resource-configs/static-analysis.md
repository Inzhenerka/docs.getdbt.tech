---
resource_types: [models, tests, unit tests, seeds, snapshots]
title: "static_analysis"
description: "Используйте конфигурацию static_analysis, чтобы управлять тем, как dbt v2 выполняет статический анализ SQL для моделей, тестов, seed-файлов и снимков."
intro_text: "static_analysis управляет тем, как dbt v2 анализирует SQL на этапе компиляции для моделей, тестов, seed-файлов и снимков."
datatype: string
default_value: baseline
sidebar_label: "static_analysis"
---

:::info

Конфигурация `static_analysis` доступна только в <Constant name="fusion_engine"/>. Она недоступна в <Constant name="core" /> и будет игнорироваться. Чтобы перейти на <Constant name="fusion"/>, обратитесь к разделу [Начало работы с <Constant name="fusion"/>](/docs/dbt/get-started-dbt).

:::

The `static_analysis` config sets how <Constant name="fusion_engine" /> validates SQL before execution—using `strict` analysis, a `baseline` that balances checks with compatibility, or `off` to skip analysis when needed. You can find supported configuration locations for each resource type.

To check out which Snowflake functions are supported in <Constant name="fusion"/> in `strict` mode, refer to [Snowflake function support](/reference/resource-configs/snowflake-function-support). For BigQuery, refer to [BigQuery function support](/reference/resource-configs/bigquery-function-support).

<Tabs>

<TabItem value="models" label="Модели">

<File name='dbt_project.yml'>

```yml
models:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: strict | baseline | off

```

</File>

<File name='models/filename.yml'>

```yml
models:
  - name: model_name
    [config](/reference/resource-properties/config):
      static_analysis: strict | baseline | off
```

</File>

<File name='models/model_name.sql'>

```sql
{{ config(static_analysis='strict' | 'baseline' | 'off') }}
```

</File>

</TabItem>

<TabItem value="tests" label="Tests">

<File name='dbt_project.yml'>

```yml
data_tests:
  +static_analysis: strict | baseline | off
```

</File>

<File name='models/filename.yml'>

```yml
models:
  - name: model_name
    data_tests:
      - not_null:
          arguments:
            column_name: your_column_name
          config:
            static_analysis: strict | baseline | off
```

</File>

</TabItem>

<TabItem value="seeds" label="Seeds">

<File name='dbt_project.yml'>

```yml
seeds:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: strict | baseline | off
```

</File>

<File name='seeds/filename.yml'>

```yml
seeds:
  - name: seed_name
    [config](/reference/resource-properties/config):
      static_analysis: strict | baseline | off
```

</File>

</TabItem>

<TabItem value="snapshots" label="Snapshots">

<File name='dbt_project.yml'>

```yml
snapshots:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: strict | baseline | off
```

</File>

<File name='snapshots/filename.yml'>

```yml
snapshots:
  - name: snapshot_name
    [config](/reference/resource-properties/config):
      static_analysis: strict | baseline | off
```

</File>

</TabItem>

<TabItem value="unit tests" label="Unit tests">

<File name='dbt_project.yml'>

```yml
unit_tests:
  [resource-path](/reference/resource-configs/resource-path):
    +static_analysis: strict | baseline | off
```

</File>

<File name='models/filename.yml'>

```yml
unit_tests:
  - name: unit_test_name
    model: model_name
    [config](/reference/resource-properties/config):
      static_analysis: strict | baseline | off
```

</File>

</TabItem>

</Tabs>

## Определение {#definition}

Вы можете настроить `static_analysis` для [моделей](/docs/build/sql-models), [тестов данных](/docs/build/data-tests), [модульных тестов](/docs/build/unit-tests), [seed-файлов](/docs/build/seeds) и [снимков](/docs/build/snapshots).

Вы можете настроить, будет ли <Constant name="fusion_engine" /> выполнять статический анализ SQL для модели и когда именно. Задайте конфигурацию `static_analysis` в YAML-файле проекта (`dbt_project.yml`), YAML-файле свойств модели или в блоке конфигурации SQL в файле модели. Подробнее о различных режимах статического анализа см. в разделе [Принципы статического анализа](/docs/build/about-static-analysis?version=1.12#principles-of-static-analysis).

Установка режима `strict` для модели не устанавливает `strict` автоматически для нижестоящих моделей; они сохраняют настройку проекта по умолчанию, если вы не настроите их явно. Дополнительные сведения и примеры см. в разделе [Наследование строгого режима](/docs/build/about-static-analysis#strict-mode-inheritance).

Для `static_analysis` доступны следующие значения:

- `baseline` (по умолчанию): статический анализ SQL. Это рекомендуемый начальный режим для пользователей, переходящих с <Constant name="core" />: он обеспечивает плавную миграцию и при этом выявляет большинство ошибок SQL. Со временем вы можете постепенно переходить к более строгому анализу.
- `strict`: статический анализ всего SQL до начала выполнения. Используйте этот режим для максимально полной проверки &mdash; выполнение не начнётся, пока не будет подтверждена корректность всего проекта.
- `off`: отключение анализа SQL для этой модели и всех её потомков.

### Пользовательские функции (UDF) в режиме `strict` {#user-defined-functions-udfs-in-strict-mode}

При настройке `static_analysis: strict` <Constant name="fusion_engine" /> разбирает операторы `CREATE FUNCTION` из [`sql_header`](/reference/resource-configs/sql_header) и хуков проекта [`on-run-start`](/reference/project-configs/on-run-start-on-run-end), регистрирует эти UDF в реестре компилятора и делает их доступными при строгой статической компиляции. В режимах `baseline` и `off` такая регистрация UDF для статического анализа не выполняется.

Параметр `sql_header` модели может содержать несколько операторов. <Constant name="fusion" /> регистрирует UDF из операторов `CREATE FUNCTION` и на этом этапе игнорирует остальные операторы.

Если строгий анализ по-прежнему не может разрешить ссылку на UDF, задайте [`static_analysis: off`](/reference/resource-configs/static-analysis#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf) для затронутых моделей.

### Как каскадно распространяются режимы статического анализа {#how-static-analysis-modes-cascade}

Применение режимов `static_analysis` в графе зависимостей определяется двумя правилами:
- Правило допустимости: статический анализ модели возможен только в том случае, если он возможен для всех её «родителей» (под родителями понимаются модели, расположенные выше текущей модели в графе зависимостей).
- Правило строгости: режим «дочерней» модели не может быть строже режима родительской (под дочерними понимаются модели, расположенные ниже текущей модели в графе зависимостей).

Настройка статического анализа каскадно распространяется от наиболее строгого режима к наименее строгому. Иерархия строгости выглядит так:
`strict` → `baseline` → `off`

**Допустимые режимы для зависимых моделей в зависимости от режима родительской модели**<br /> 
При движении вниз по графу зависимостей можно сохранить тот же режим или ослабить его, но нельзя сделать режим дочерней модели строже родительского. В следующей таблице показаны допустимые режимы для зависимых моделей в зависимости от режима родительской модели:

<SimpleTable>
| Режим родительской модели | Допустимый режим дочерней модели |
|-------------|--------------|
| `strict`    | `strict`, `baseline` или `off` |
| `baseline`  | `baseline` или `off` (но не `strict`) |
| `off`       | только `off` |
</SimpleTable>

Например, для цепочки зависимостей «Модель A → Модель B → Модель C»:

- Если для модели A задан режим `baseline`, вы _не можете_ задать для модели B режим `strict`
- Если для модели A задан режим `strict`, вы _можете_ задать для модели B режим `baseline`

Это гарантирует, что более строгие требования к проверке не будут применяться к зависимым моделям, если родительские модели не соответствуют этим требованиям. Режим `baseline` не формирует полную проанализированную схему, которая нужна режиму `strict` от вышестоящих моделей, поэтому модель, зависящая от модели с режимом `baseline`, не может выполнять проверку типов на уровне `strict`.

Более подробное обсуждение и иллюстрации см. на странице концепций v2: [Новые концепции](/docs/build/about-static-analysis). Дополнительные сведения о схеме JSON см. в [файле dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema/blob/1e2c1536fbdd421e49c8b65c51de619e3cd313ff/schemas/latest_fusion/dbt_project-latest-fusion.json#L4689).

### Пользовательские материализации {#custom-materializations}

К моделям, использующим [пользовательскую материализацию](/guides/create-new-materializations), применяются те же правила `static_analysis`, что и к любой другой модели, независимо от того, даёте ли вы материализации новое имя или используете имя встроенной материализации, например `table` или `incremental`. Зависимые модели подчиняются обычным [правилам каскадного распространения](#how-static-analysis-modes-cascade).

Если пользовательская материализация добавляет или переименовывает столбцы либо меняет их типы, <Constant name="fusion" /> не может предсказать эти изменения на основе SQL модели. В первую очередь это влияет на режим `strict`, которому нужны точные схемы вышестоящих моделей. Если вы используете `strict`, задайте `static_analysis: off` для моделей, использующих такую материализацию.

Поскольку режим `off` распространяется каскадно, все зависимые модели также теряют возможность статического анализа и использования связанных с ним функций, таких как отслеживание зависимостей на уровне столбцов и проверка типов. Чтобы сохранить охват статическим анализом в вашем DAG, используйте материализации, изменяющие схему, для моделей, от которых не зависят другие модели.

Дополнительные сведения см. в разделе [Пользовательские материализации](/docs/build/about-static-analysis#custom-materializations).

## Переопределение в CLI {#cli-override}

Вы можете переопределить конфигурацию уровня модели для отдельного запуска с помощью флага [`--static-analysis`](/reference/global-configs/static-analysis-flag). Например, чтобы отключить статический анализ для запуска:

```bash
dbt run --static-analysis off # disable static analysis for all models
dbt run --static-analysis baseline # use baseline analysis for all models
```

## Примеры

Следующие примеры показывают, как отключить или настроить `static_analysis` для различных сценариев:

<!-- no toc -->
- [Включение строгого анализа для всех моделей](#enable-strict-analysis-for-all-your-models)
- [Отключение статического анализа для всех моделей в пакете](#disable-static-analysis-for-all-models-in-a-package)
- [Отключение статического анализа в YAML для отдельной модели](#disable-static-analysis-in-yaml-for-a-single-model)
- [Отключение статического анализа в SQL для модели, использующей пользовательскую UDF](#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf)
- [Настройка статического анализа для тестов данных](#configure-static-analysis-for-data-tests)
- [Настройка статического анализа для модульных тестов](#configure-static-analysis-for-unit-tests)
- [Настройка статического анализа для seed-файлов](#configure-static-analysis-for-seeds)
- [Настройка статического анализа для снимков](#configure-static-analysis-for-snapshots)

### Включение строгого анализа для всех моделей {#enable-strict-analysis-for-all-your-models}

Рекомендуемый способ обеспечить максимально полную проверку SQL во всём проекте — задать значение `strict` в конфигурации `models` верхнего уровня в файле `dbt_project.yml`. Эта конфигурация включает строгий анализ для каждой модели в проекте, поэтому настраивать каждую модель отдельно не требуется:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    +static_analysis: strict
    staging:
      +materialized: view
    marts:
      +materialized: table
```

</File>

При необходимости для отдельных подкаталогов или моделей можно задать значение `baseline` или `off` (например, для моделей, использующих неподдерживаемые UDF). Для отдельных моделей можно использовать менее строгие настройки, чем в конфигурации уровня проекта, но нельзя задать более строгие. Значение по умолчанию для проекта — `baseline`.

В этом примере строгий статический анализ применяется только к моделям Jaffle Shop. Установленные пакеты сохраняют настройку по умолчанию `baseline`, если вы явно не настроите их иначе.

### Отключение статического анализа для всех моделей в пакете {#disable-static-analysis-for-all-models-in-a-package}

В этом примере показано, как отключить статический анализ для всех моделей в пакете. [Префикс `+`](/reference/resource-configs/plus-prefix) применяет конфигурацию ко всем моделям в пакете.

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    marts:
      +materialized: table

  a_package_with_introspective_queries:
    +static_analysis: off
```

</File>

### Отключение статического анализа в YAML для отдельной модели {#disable-static-analysis-in-yaml-for-a-single-model}

В этом примере показано, как отключить статический анализ для одной модели в YAML.

<File name='models/my_udf_using_model.yml'>

```yml
models:
  - name: model_with_static_analysis_off
    config:
      static_analysis: off
```

</File>

### Отключение статического анализа SQL для модели, использующей пользовательскую UDF {#disable-static-analysis-in-sql-for-a-model-using-a-custom-udf}

В этом примере показано, как отключить статический анализ для модели, использующей пользовательскую [user-defined function (UDF)](/docs/build/udfs), в SQL-файле.

<File name='models/my_udf_using_model.sql'>

```sql
{{ config(static_analysis='off') }}

select
  user_id,
  my_cool_udf(ip_address) as cleaned_ip
from {{ ref('my_model') }}
```

</File>

### Настройка статического анализа для тестов данных {#configure-static-analysis-for-data-tests}

В этом примере показано, как настроить статический анализ для всех тестов в проекте с помощью `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
# dbt_project.yml
data_tests:
  +static_analysis: baseline
```

</File>

Чтобы настроить статический анализ для конкретного теста данных модели:

<File name='models/filename.yml'>

```yaml
# models/filename.yml
models:
  - name: my_model
    data_tests:
      - not_null:
          arguments:
            column_name: order_id
          config:
            static_analysis: off
```

</File>

<VersionBlock firstVersion="2.0">

### Настройка статического анализа для модульных тестов {#configure-static-analysis-for-unit-tests}

Вы можете задать `static_analysis` для [модульных тестов](/docs/build/unit-tests), которые проверяют логику вашего SQL на статических тестовых данных перед построением модели.

В этом примере показано, как настроить статический анализ для всех модульных тестов в проекте с помощью `dbt_project.yml`.

<File name='dbt_project.yml'>

```yaml
# dbt_project.yml
unit_tests:
  my_project:
    +static_analysis: baseline
```

</File>

Чтобы настроить отдельный модульный тест в файле свойств:

<File name='models/filename.yml'>

```yaml
# models/filename.yml
unit_tests:
  - name: test_is_valid_email_address
    model: dim_customers
    config:
      static_analysis: off
```

</File>

Если для модульного теста задать [`compute: local`](/reference/resource-configs/compute) (при этом тест выполняется с помощью DuckDB, а не вашей платформы данных), его режим `static_analysis` повышается до `strict`, поскольку для локального выполнения требуется строгий анализ, позволяющий преобразовать ваш SQL в диалект DuckDB. Это происходит, даже если вы сами задали для теста `baseline`.

Если задать `static_analysis: off` для модульного теста, настроенного на локальное выполнение, тест не сможет выполниться и завершится с ошибкой `ExecutorFailed (dbt1401)`. Вместо этого используйте для такого теста `compute: remote`.

`compute: local` — экспериментальная возможность, для которой требуется установить переменную окружения `DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS` в значение `true`, поэтому описанное взаимодействие действует только после её явного включения.

</VersionBlock>

### Настройка статического анализа для seed-файлов {#configure-static-analysis-for-seeds}

В этом примере показано, как настроить статический анализ для всех seed-файлов в проекте.

<File name='dbt_project.yml'>

```yaml
# dbt_project.yml
seeds:
  your_project:
    +static_analysis: baseline
```

</File>

Чтобы настроить отдельный seed-файл в файле свойств:

<File name='seeds/filename.yml'>

```yaml
# seeds/filename.yml
seeds:
  - name: my_seed
    config:
      static_analysis: off
```

</File>

### Настройка статического анализа для снимков {#configure-static-analysis-for-snapshots}

В этом примере показано, как настроить статический анализ для всех снимков в проекте.

<File name='dbt_project.yml'>

```yaml
# dbt_project.yml
snapshots:
  your_project:
    +static_analysis: baseline
```

</File>

Чтобы настроить отдельный снимок в файле свойств:

<File name='snapshots/filename.yml'>

```yaml
# snapshots/filename.yml
snapshots:
  - name: my_snapshot
    config:
      static_analysis: off
```

</File>

## Особенности использования

- Для моделей отключение статического анализа означает, что функции расширения VS Code, зависящие от понимания SQL, будут недоступны.
- Для моделей статический анализ в некоторых случаях может завершаться ошибкой (например, при использовании динамических SQL-конструкций или нераспознанных UDF), и вам может потребоваться задать `static_analysis: off`. Дополнительные примеры приведены в разделе [Когда следует отключать статический анализ?](/docs/build/about-static-analysis#when-should-i-turn-static-analysis-off).
- Поскольку режимы применяются каскадно, заданный вами режим не всегда совпадает с фактически действующим. Чтобы проверить действующий режим для модели, используйте CodeLens в расширении dbt для VS Code или в <Constant name="studio_ide" />: он показывает, для каких моделей статический анализ отключён и почему.

## Связанная документация

- [О статическом анализе](/docs/build/about-static-analysis)
- [Флаг `--static-analysis`](/reference/global-configs/static-analysis-flag)
- [Оптимизация статического анализа для разработки и развёртывания](/best-practices/optimize-static-analysis-for-development-and-deployment)
