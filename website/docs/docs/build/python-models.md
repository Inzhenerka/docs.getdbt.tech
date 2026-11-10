---
title: "Python-модели"
description: "Настройка Python-моделей для расширения возможностей вашего проекта dbt."
id: "python-models"
availability: all_users
---

Обратите внимание, что только некоторые платформы данных поддерживают модели `dbt-py`. Проверьте [страницы конфигурации платформ](/reference/resource-configs), чтобы убедиться, что модели Python поддерживаются. 

Модели Python для Snowflake, BigQuery и Databricks поддерживаются в [<Constant name="fusion" />](/docs/introduction). Подробнее о <Constant name="fusion" /> см. на странице [поддерживаемых возможностей](/docs/dbt/supported-features).

Предлагаем вам:
- Прочитать [исходное обсуждение](https://github.com/dbt-labs/dbt/discussions/5261), в котором была предложена эта возможность.
- Поделиться своими мыслями и идеями о [дальнейшем развитии моделей Python](https://github.com/dbt-labs/dbt/discussions/5742).
- Присоединиться к каналу **#dbt-python-models** в [Slack-сообществе dbt](https://www.getdbt.com/community/join-the-community/).

## Обзор {#overview}

Python модели dbt (`dbt-py`) могут помочь вам решить задачи, которые невозможно решить с помощью SQL. Вы можете выполнять анализы, используя инструменты, доступные в экосистеме Python с открытым исходным кодом, включая передовые пакеты для науки о данных и статистики. Ранее вам требовалась бы отдельная инфраструктура и оркестрация для выполнения Python трансформаций в производственной среде. Python трансформации, определенные в dbt, являются моделями в вашем проекте с теми же возможностями тестирования, документации и отслеживания.

<File name='models/my_python_model.py'>

```python
import ...

def model(dbt, session):

    my_sql_model_df = dbt.ref("my_sql_model")

    final_df = ...  # то, что нельзя написать на SQL!

    return final_df
```

</File>

<File name='models/config.yml'>

```yml

models:
  - name: my_python_model

    # Документируйте в том же коде
    description: Моя трансформация, написанная на Python

    # Настройте интуитивно и привычно
    config:
      materialized: table
      tags: ['python']

    # Тестируйте результаты моей Python трансформации
    columns:
      - name: id
        # Стандартная валидация для «зерна» (grain) результатов Python
        data_tests:
          - unique
          - not_null
    data_tests:
      # Напишите собственную логику валидации (на SQL) для результатов Python
      - [custom_generic_test](/best-practices/writing-custom-generic-tests)
```

</File>

<!--- TODO: как сделать это изображение больше? --->
<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/python-model-dag.png" title="SQL + Python, вместе наконец" style="width:200%"/>

Для использования Python-моделей dbt с движком <Constant name="core" /> или <Constant name="fusion" /> необходим адаптер для платформы данных, поддерживающей полнофункциональную среду выполнения Python. В Python-модели dbt весь код Python выполняется удалённо на платформе. Никакая его часть не выполняется локально средствами dbt. Мы считаем важным чётко разделять _определение модели_ и _выполнение модели_. В этом и во многих других отношениях подход dbt к Python-моделям повторяет его давно сложившийся подход к моделированию данных на SQL.

Мы написали это руководство, предполагая, что вы знакомы с dbt. Если вы никогда раньше не писали модель dbt, мы рекомендуем начать с чтения [dbt Models](/docs/build/models). На протяжении всего текста мы будем проводить параллели между Python моделями и SQL моделями, а также четко указывать их различия.

### Что такое Python модель? {#what-is-a-python-model}

Python модель dbt — это функция, которая читает источники dbt или другие модели, применяет серию трансформаций и возвращает преобразованный набор данных. Операции <Term id="dataframe">DataFrame</Term> определяют начальные точки, конечное состояние и каждый шаг на пути.

Это похоже на роль <Term id="cte">CTE</Term> в SQL моделях dbt. Мы используем CTE для извлечения данных из вышестоящих наборов данных, определения (и именования) серии значимых трансформаций и завершения с помощью финального оператора `select`. Вы можете запустить скомпилированную версию SQL модели dbt, чтобы увидеть данные, включенные в результирующее представление или таблицу. Когда вы выполняете `dbt run`, dbt оборачивает этот запрос в `create view`, `create table` или более сложные DDL, чтобы сохранить его результаты в базе данных.

Вместо финального оператора `select` каждая Python модель возвращает финальный DataFrame. Каждая операция DataFrame "лениво оценивается". В процессе разработки вы можете предварительно просмотреть его данные, используя методы, такие как `.show()` или `.head()`. Когда вы запускаете Python модель, полный результат финального DataFrame будет сохранен как таблица в вашем хранилище данных.

Python модели dbt имеют доступ почти ко всем тем же параметрам конфигурации, что и SQL модели. Вы можете тестировать и документировать их, добавлять свойства `tags` и `meta`, а также предоставлять доступ к их результатам другим пользователям. Вы можете выбирать их по имени, пути к файлу, конфигурациям, в зависимости от того, являются ли они вышестоящими или нижестоящими по отношению к другой модели, или если они были изменены по сравнению с предыдущим состоянием проекта.

### Определение Python модели {#defining-a-python-model}

Каждая модель Python находится в файле `.py` в папке `models/`. В ней определяется функция **`model()`**, которая принимает два параметра:
- **`dbt`**: Класс, скомпилированный dbt и уникальный для каждой модели, который позволяет выполнять код Python в контексте вашего проекта dbt и DAG.
- **`session`**: Класс, представляющий подключение вашей платформы данных к среде выполнения Python. Сессия необходима для чтения таблиц в виде DataFrame и записи DataFrame обратно в таблицы. В PySpark по соглашению объект `SparkSession` называется `spark` и доступен глобально. Для единообразия между платформами мы всегда передаём его в функцию `model` как явный аргумент с именем `session`.

Функция `model()` должна возвращать один DataFrame. В Snowpark (Snowflake) это может быть Snowpark или pandas DataFrame. В BigQuery это может быть BigFrames, pandas или Spark DataFrame. При использовании PySpark (Databricks) это может быть Spark, pandas или pandas-on-Spark DataFrame. Подробнее о выборе между pandas и нативными DataFrame см. в разделе [DataFrame API + syntax](#dataframe-api-and-syntax).

Когда вы выполняете `dbt run --select python_model`, dbt подготовит и передаст оба аргумента (`dbt` и `session`). Все, что вам нужно сделать, это определить функцию. Вот как должна выглядеть каждая Python модель:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    ...

    return final_df
```

</File>

### Ссылки на другие модели {#referencing-other-models}

Python модели полностью участвуют в направленном ациклическом графе (DAG) трансформаций dbt. Используйте метод `dbt.ref()` в Python модели, чтобы читать данные из других моделей (SQL или Python). Если вы хотите читать напрямую из исходной таблицы, используйте `dbt.source()`. Эти методы возвращают DataFrame, указывающие на вышестоящий источник, модель, seed или snapshot.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    # DataFrame, представляющий вышестоящую модель
    upstream_model = dbt.ref("upstream_model_name")

    # DataFrame, представляющий вышестоящий источник
    upstream_source = dbt.source("upstream_source_name", "table_name")

    ...
```

</File>

Конечно, вы можете использовать `ref()` для вашей Python модели в нижестоящих SQL моделях:

<File name='models/downstream_model.sql'>

```sql
with upstream_python_model as (

    select * from {{ ref('my_python_model') }}

),

...
```

</File>

:::caution

Ссылки на [эфемерные](/docs/build/materializations#ephemeral) модели в настоящее время не поддерживаются (см. [запрос на добавление функциональности](https://github.com/dbt-labs/dbt/issues/7288))
:::

Начиная с версии dbt 1.8, Python-модели также поддерживают динамические конфигурации внутри Python f-строк. Это позволяет задавать более гибкие и динамические настройки моделей непосредственно в вашем Python-коде. Например:

<File name='models/my_python_model.py'>

```python
# Ранее попытка доступа к значению конфигурации таким образом приводила к None
print(f"{dbt.config.get('my_var')}")  # Вывод до изменения: None

# Теперь вы можете получить доступ к фактическому значению конфигурации
# Предполагая, что 'my_var' настроен на 5 для текущей модели
print(f"{dbt.config.get('my_var')}")  # Вывод после изменения: 5
```

Это также означает, что вы можете использовать `dbt.config.get()` в Python моделях, чтобы гарантировать, что значения конфигурации эффективно доступны и могут быть использованы в Python f-строках.

</File>

## Настройка Python моделей {#configuring-python-models}

Как и SQL модели, Python модели можно настроить тремя способами:
1. В `dbt_project.yml`, где вы можете настроить множество моделей одновременно
2. В отдельном `.yml` файле в каталоге `models/`
3. Внутри файла `.py` модели, используя метод `dbt.config()`

Вызов метода `dbt.config()` установит конфигурации для вашей модели в вашем `.py` файле, аналогично макросу `{{ config() }}` в файлах `.sql` моделей:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    # установка конфигурации
    dbt.config(materialized="table")
```

</File>

Существует ограничение на сложность конфигурации, которую можно задать с помощью метода `dbt.config()`. Он принимает **только** литеральные значения (строки, булевы значения и числовые типы), а также динамическую конфигурацию. Передача другой функции или более сложной структуры данных невозможна.  

Параметры, специфичные для каждой платформы, описаны на странице соответствующего адаптера:

- [BigQuery](/reference/resource-configs/bigquery-configs#additional-parameters)
- [Databricks](/reference/resource-configs/databricks-configs#python-submission-methods)
- [Snowflake](/reference/resource-configs/snowflake-configs#additional-parameters)

#### Доступ к контексту проекта {#accessing-project-context}

По умолчанию класс `dbt` поддерживает:
- Возврат DataFrame, ссылающихся на расположение других ресурсов: `dbt.ref()` + `dbt.source()`
- Доступ к расположению текущей модели в базе данных: `dbt.this()` (также: `dbt.this.database`, `.schema`, `.identifier`)
- Определение того, выполняется ли текущая модель в инкрементальном режиме: `dbt.is_incremental`
- Доступ к пользовательским значениям, хранящимся в `meta`: `dbt.config.meta_get()`

Этот контекст можно расширить, «получив» необходимые значения с помощью `dbt.config.get()` после того, как они будут настроены в [конфигурации модели](/reference/model-configs). Метод `dbt.config.get()` поддерживает динамический доступ к конфигурациям внутри Python‑моделей, что повышает гибкость логики модели. Это включает такие входные параметры, как `var`, `env_var` и `target`. Если вы хотите использовать эти значения для условной логики в вашей модели, необходимо задать их через специальную конфигурацию в properties YAML‑файле:

<File name='models/config.yml'>

```yml

models:
  - name: my_python_model
    config:
      materialized: table
      target_name: "{{ target.name }}"
      specific_var: "{{ var('SPECIFIC_VAR') }}"
      specific_env_var: "{{ env_var('SPECIFIC_ENV_VAR') }}"
```

</File>

Затем, в Python коде модели, используйте функцию `dbt.config.get()`, чтобы _получить доступ_ к значениям конфигураций, которые были установлены:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    target_name = dbt.config.get("target_name")
    specific_var = dbt.config.get("specific_var")
    specific_env_var = dbt.config.get("specific_env_var")

    orders_df = dbt.ref("fct_orders")

    # ограничение данных в dev
    if target_name == "dev":
        orders_df = orders_df.limit(500)
```

</File>

#### Доступ к пользовательским значениям meta {#accessing-custom-meta-values}

Чтобы хранить пользовательские значения, используйте [конфигурацию `meta`](/reference/resource-configs/meta). Например, если у вас есть модель с именем `my_python_model` и вы хотите хранить пользовательские значения, вы можете сделать следующее:

<File name='models/schema.yml'>

```yml

models:
  - name: my_python_model
    config:
      meta:
        custom_value: "111"
        another_value: "abc"
```

</File>

Затем получите к ним доступ в своей Python-модели с помощью метода `dbt.config.meta_get()`:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    # Access custom values stored in meta directly
    custom_value = dbt.config.meta_get("custom_value")
    another_value = dbt.config.meta_get("another_value")
    
    # Use your custom values in your model logic
    orders_df = dbt.ref("fct_orders")
    ...
```

</File>

:::tip Альтернативный подход

Вы также можете получить значения meta с помощью `dbt.config.get("meta")`, который возвращает весь словарь meta. При использовании этого подхода предусмотрите случай, когда `meta` не настроен:

```python
custom_value = dbt.config.get("meta", {}).get("custom_value")
```

:::

#### Динамические конфигурации

В дополнение к существующим методам настройки Python моделей, вы также имеете динамический доступ к значениям конфигурации, установленным с помощью `dbt.config()` в Python моделях, используя f-строки. Это увеличивает возможности для пользовательской логики и управления конфигурацией.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    dbt.config(materialized="table")
    
    # Динамический доступ к конфигурации в Python f-строках, 
    # что позволяет в реальном времени получать и использовать значения конфигурации.
    # Предполагая, что 'my_var' установлен на 5, это выведет: Dynamic config value: 5
    print(f"Dynamic config value: {dbt.config.get('my_var')}")
```

</File>

### Материализации {#materializations}

Python модели поддерживают следующие материализации:
- `table` (по умолчанию)
- `incremental`

Инкрементные Python модели поддерживают все те же [инкрементные стратегии](/docs/build/incremental-strategy), что и их SQL аналоги. Конкретные поддерживаемые стратегии зависят от вашего адаптера. Например, инкрементные модели поддерживаются на BigQuery с Dataproc для стратегии `merge`; стратегия `insert_overwrite` пока не поддерживается.

Python модели не могут быть материализованы как `view` или `ephemeral`. Python не поддерживается для ресурсов, отличных от моделей (например, тестов и снимков).

Для инкрементных моделей, как и для SQL моделей, вам нужно фильтровать входящие таблицы только на новые строки данных:

<Tabs>

<TabItem value="Snowpark">

<File name='models/my_python_model.py'>

```python
import snowflake.snowpark.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # только новые строки по сравнению с максимумом в текущей таблице
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # или только строки за последние 3 дня
        df = df.filter(df.updated_at >= F.dateadd("day", F.lit(-3), F.current_timestamp()))

    ...

    return df
```

</File>

</TabItem>

<TabItem value="BigQuery DataFrames"> 

<File name='models/my_python_model.py'>

```python
import datetime

def model(dbt, session):
  dbt.config(materialized = "incremental")
  bdf = dbt.ref("upstream_table")

  if dbt.is_incremental:

    # only new rows compared to max in current table
    max_from_this = f"select max(updated_at) from {dbt.this}"

    bdf = bdf[bdf['updated_at'] >= bpd.read_gbq(max_from_this).values[0][0]]
    # or only rows from the past 3 days
    bdf = bdf[bdf['updated_at'] >= datetime.date.today() - datetime.timedelta(days=3)]

    ...

  return bdf
```

</File>

</TabItem>

<TabItem value="PySpark">

<File name='models/my_python_model.py'>

```python
import pyspark.sql.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # только новые строки по сравнению с максимумом в текущей таблице
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # или только строки за последние 3 дня
        df = df.filter(df.updated_at >= F.date_add(F.current_timestamp(), F.lit(-3)))

    ...

    return df
```

</File>

</TabItem>

</Tabs>

## Специфическая функциональность Python {#python-specific-functionality}

### Определение функций {#defining-functions}

В дополнение к определению функции `model`, Python модель может импортировать другие функции или определять свои собственные. Вот пример на Snowpark, определяющий пользовательскую функцию `add_one`:

<File name='models/my_python_model.py'>

```python
def add_one(x):
    return x + 1

def model(dbt, session):
    dbt.config(materialized="table")
    temps_df = dbt.ref("temperatures")

    # немного согреем
    df = temps_df.withColumn("degree_plus_one", add_one(temps_df["degree"]))
    return df
```

</File>

В настоящее время функции Python, определенные в одной модели dbt, не могут быть импортированы и повторно использованы в других моделях. Обратитесь к [Повторное использование кода](#code-reuse) для потенциальных рассматриваемых шаблонов.

### Использование пакетов PyPI {#using-pypi-packages}

Вы также можете определять функции, которые зависят от сторонних пакетов, при условии, что эти пакеты установлены и доступны для Python runtime на вашей платформе данных.

В этом примере мы используем пакет `holidays`, чтобы определить, является ли заданная дата праздничным днём во Франции. В приведённом ниже коде для простоты и единообразия между платформами используется API pandas. Точный синтаксис, а также необходимость рефакторинга для многонодовой обработки, всё ещё могут различаться.
<Tabs>

<TabItem value="Snowpark">

<File name='models/my_python_model.py'>

```python
import holidays

def is_holiday(date_col):
    # Chez Jaffle
    french_holidays = holidays.France()
    is_holiday = (date_col in french_holidays)
    return is_holiday

def model(dbt, session):
    dbt.config(
        materialized = "table",
        packages = ["holidays"]
    )

    orders_df = dbt.ref("stg_orders")

    df = orders_df.to_pandas()

    # применяем нашу функцию
    # (столбцы должны быть в верхнем регистре на Snowpark)
    df["IS_HOLIDAY"] = df["ORDER_DATE"].apply(is_holiday)
    df["ORDER_DATE"].dt.tz_localize('UTC') # преобразование из Number/Long в tz-aware Datetime

    # возвращаем финальный набор данных (Pandas DataFrame)
    return df
```

</File>

</TabItem>

<TabItem value="BigQuery DataFrames">

<File name='models/my_python_model.py'>

```python
import holidays

def model(dbt, session):
    dbt.config(submission_method="bigframes")

    data = {
    'id': [0, 1, 2],
    'name': ['Brian Davis', 'Isaac Smith', 'Marie White'],
    'birthday': ['2024-03-14', '2024-01-01', '2024-11-07']
    }
    bdf = bpd.DataFrame(data)
    bdf['birthday'] = bpd.to_datetime(bdf['birthday'])
    bdf['birthday'] = bdf['birthday'].dt.date

    us_holidays = holidays.US(years=2024)

    return bdf[bdf['birthday'].isin(us_holidays)]
```

</File>

</TabItem>

<TabItem value="PySpark">

<File name='models/my_python_model.py'>

```python
import holidays

def is_holiday(date_col):
    # Chez Jaffle
    french_holidays = holidays.France()
    is_holiday = (date_col in french_holidays)
    return is_holiday

def model(dbt, session):
    dbt.config(
        materialized = "table",
        packages = ["holidays"]
    )

    orders_df = dbt.ref("stg_orders")

    df = orders_df.to_pandas_on_spark()  # Spark 3.2+
    # df = orders_df.toPandas() в более ранних версиях

    # применяем нашу функцию
    df["is_holiday"] = df["order_date"].apply(is_holiday)

    # преобразование обратно в PySpark
    df = df.to_spark()               # Spark 3.2+
    # df = session.createDataFrame(df) в более ранних версиях

    # возвращаем финальный набор данных (PySpark DataFrame)
    return df
```

</File>

</TabItem>

</Tabs>

#### Настройка пакетов {#configuring-packages}

Мы рекомендуем вам настраивать необходимые пакеты и версии, чтобы dbt мог отслеживать их в метаданных проекта. Эта конфигурация требуется для реализации на некоторых платформах. Если вам нужны конкретные версии пакетов, укажите их.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    dbt.config(
        packages = ["numpy==1.23.1", "scikit-learn"]
    )
```

</File>

<File name='models/config.yml'>

```yml

models:
  - name: my_python_model
    config:
      packages:
        - "numpy==1.23.1"
        - scikit-learn
```

</File>

#### Пользовательские функции (UDF) {#user-defined-functions-udfs}

Вы можете использовать декоратор `@udf` или функцию `udf`, чтобы определить «анонимную» функцию и вызвать её внутри преобразований DataFrame в вашей функции `model`. Это типичный паттерн для применения более сложных функций в виде операций над DataFrame, особенно в тех случаях, когда этим функциям требуются зависимости из сторонних пакетов.

- [Snowpark Python: Creating UDFs](https://docs.snowflake.com/en/developer-guide/snowpark/python/creating-udfs.html)
- [BigQuery DataFrames UDFs](https://cloud.google.com/bigquery/docs/use-bigquery-dataframes#custom-python-functions)
- [PySpark functions: udf](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.udf.html)

:::tip
Вы также можете определять [SQL- или Python-UDF](/docs/build/udfs) как ресурсы первого класса в каталоге `/functions` с соответствующим файлом `YAML`. dbt собирает их как часть DAG, и вы ссылаетесь на них из SQL, используя `{{ function('my_udf') }}`. Эти UDF являются переиспользуемыми в разных инструментах (BI, ноутбуки, SQL-клиенты), поскольку они находятся в вашем хранилище данных.
:::

<Tabs>

<TabItem value="Snowpark">

<File name='models/my_python_model.py'>

```python
import snowflake.snowpark.types as T
import snowflake.snowpark.functions as F
import numpy

def register_udf_add_random():
    add_random = F.udf(
        # используйте синтаксис 'lambda' для простого функционального поведения
        lambda x: x + numpy.random.normal(),
        return_type=T.FloatType(),
        input_types=[T.FloatType()]
    )
    return add_random

def model(dbt, session):

    dbt.config(
        materialized = "table",
        packages = ["numpy"]
    )

    temps_df = dbt.ref("temperatures")

    add_random = register_udf_add_random()

    # согреем, кто знает на сколько
    df = temps_df.withColumn("degree_plus_random", add_random("degree"))
    return df
```

</File>

**Примечание:** Из-за ограничения Snowpark в настоящее время невозможно зарегистрировать сложные именованные UDF в хранимых процедурах и, следовательно, в Python моделях dbt. Мы планируем добавить нативную поддержку Python UDF в качестве ресурса проекта/DAG в будущих выпусках. На данный момент, если вы хотите создать "векторизованную" Python UDF через Batch API, мы рекомендуем либо:
- Написать [`create function`](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-batch.html) внутри SQL макроса, чтобы запустить как hook или run-operation
- [Регистрация из загруженного файла](https://docs.snowflake.com/en/developer-guide/snowpark/python/creating-udfs#creating-a-udf-from-a-python-source-file) в вашем Python коде модели

</TabItem>

<TabItem value="BigQuery DataFrames"> 

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    dbt.config(submission_method="bigframes")

    # You can also use @bpd.udf
    @bpd.remote_function(dataset='jialuo_test_us')
    def my_func(x: int) -> int:
        return x * 1100

    data = {"int": [1, 2], "str": ['a', 'b']}
    bdf = bpd.DataFrame(data=data)
    bdf['int'] = bdf['int'].apply(my_func)

    return bdf
```

</File>

</TabItem>

<TabItem value="PySpark">

<File name='models/my_python_model.py'>

```python
import pyspark.sql.types as T
import pyspark.sql.functions as F
import numpy

# используйте 'декоратор' для более читаемого кода
@F.udf(returnType=T.DoubleType())
def add_random(x):
    random_number = numpy.random.normal()
    return x + random_number

def model(dbt, session):
    dbt.config(
        materialized = "table",
        packages = ["numpy"]
    )

    temps_df = dbt.ref("temperatures")

    # согреем, кто знает на сколько
    df = temps_df.withColumn("degree_plus_random", add_random("degree"))
    return df
```

</File>

</TabItem>

</Tabs>

#### Повторное использование кода {#code-reuse}

Чтобы повторно использовать Python‑функцию в нескольких моделях dbt, вы можете определить [Python UDF](/docs/build/udfs) в каталоге `/functions` вместе с соответствующим YAML‑файлом. Эти UDF разворачиваются в вашем хранилище данных и могут переиспользоваться разными инструментами (BI‑системами, ноутбуками, SQL‑клиентами).

В будущем мы также рассматриваем возможность добавления поддержки **Private Python packages**. Помимо импорта переиспользуемых функций из публичных пакетов PyPI, многие платформы данных поддерживают загрузку пользовательских Python‑артефактов и их регистрацию в виде пакетов. Процесс загрузки отличается от платформы к платформе, но сам `import` вашего кода выглядит одинаково.

:::note ❓ Вопросы dbt

- Как dbt может помочь пользователям при загрузке или инициализации приватных ресурсов Python? Будет ли это новой формой `dbt deps`?
- Как dbt может поддержать пользователей, которые хотят тестировать собственные функции? Если они определены как UDF: «модульное тестирование» в базе данных? Если это «чистые» функции в пакетах: поощрять использование `pytest`?

💬 Обсуждение: ["Модели Python: управление пакетами, хранилищами артефактов/объектов и UDF в dbt"](https://github.com/dbt-labs/dbt/discussions/5741)
:::

### API и синтаксис DataFrame {#dataframe-api-and-syntax}

За последнее десятилетие большинство людей, пишущих [трансформации данных](https://www.getdbt.com/analytics-engineering/transformation/) на Python, приняли <Term id="dataframe">DataFrame</Term> в качестве своей общей абстракции. dbt следует этой конвенции, возвращая `ref()` и `source()` как DataFrame, и ожидает, что все Python модели будут возвращать DataFrame.

DataFrame — это двумерная структура данных (строки и столбцы). Он поддерживает удобные методы для преобразования этих данных и создания новых столбцов из вычислений, выполненных на существующих столбцах. Он также предлагает удобные способы предварительного просмотра данных при локальной разработке или в ноутбуке.

Примерно на этом согласие и заканчивается. Существует множество фреймворков с собственными синтаксисами и API для работы с DataFrame. Библиотека [pandas](https://pandas.pydata.org/docs/) предложила один из самых первых API для DataFrame, и её синтаксис является самым распространённым для изучения среди начинающих специалистов по данным. Большинство более новых API DataFrame совместимы с синтаксисом в стиле pandas, хотя немногие могут обеспечить полную взаимную совместимость. Это справедливо и для BigQuery DataFrames, Snowpark и PySpark, у которых есть собственные API DataFrame.

При разработке Python модели вы будете задаваться следующими вопросами:

**Почему pandas?** &mdash; Это самый распространенный API для DataFrame. Он упрощает исследование выборочных данных и разработку трансформаций локально. Вы можете "продвигать" свой код как есть в модели dbt и запускать его в производственной среде для небольших наборов данных.

**Почему _не_ pandas?** &mdash; Производительность. pandas выполняет "одноузловые" трансформации, которые не могут воспользоваться параллелизмом и распределенными вычислениями, предлагаемыми современными хранилищами данных. Это быстро становится проблемой, когда вы работаете с большими наборами данных. Некоторые платформы данных поддерживают оптимизации для кода, написанного с использованием API DataFrame pandas, предотвращая необходимость в значительных рефакторингах. Например, [pandas на PySpark](https://spark.apache.org/docs/latest/api/python/getting_started/quickstart_ps.html) предлагает поддержку 95% функциональности pandas, используя тот же API, при этом все еще используя параллельную обработку.

:::note ❓ Вопросы dbt
- При разработке новой Python модели dbt, следует ли рекомендовать синтаксис в стиле pandas для быстрой итерации, а затем рефакторинг?
- Какие библиотеки с открытым исходным кодом предоставляют убедительные абстракции для различных движков данных и специфических для поставщиков API?
- Должен ли dbt пытаться играть долгосрочную роль в стандартизации среди них?

💬 Обсуждение: ["Модели на Python: проблема pandas (и возможное решение)"](https://github.com/dbt-labs/dbt/discussions/5738)
:::

## Ограничения {#limitations}

Python модели имеют возможности, которых нет у SQL моделей. У них также есть некоторые недостатки по сравнению с SQL моделями:

- **Время и стоимость.** Python модели работают медленнее, чем SQL модели, и облачные ресурсы, которые их запускают, могут быть дороже. Запуск Python требует более общих вычислительных ресурсов. Эти вычислительные ресурсы могут иногда находиться на отдельной службе или архитектуре от ваших SQL моделей. **Однако:** Мы считаем, что развертывание Python моделей через dbt — с единой линией, тестированием и документацией — с человеческой точки зрения, **значительно** быстрее и дешевле. По сравнению с этим, развертывание отдельной инфраструктуры для оркестрации Python трансформаций в производственной среде и использование различных инструментов для интеграции с dbt занимает гораздо больше времени и дороже.
- **Различия в синтаксисе** еще более выражены. За эти годы dbt сделал многое, используя шаблоны диспетчеризации и пакеты, такие как `dbt_utils`, чтобы абстрагировать различия в SQL диалектах среди популярных хранилищ данных. Python предлагает **гораздо** более широкое поле для игры. Если есть пять способов сделать что-то в SQL, то в Python их 500, все с различной производительностью и соответствием стандартам. Эти варианты могут быть ошеломляющими. Как поддерживающие dbt, мы будем учиться у передовых проектов, решающих эту проблему, и делиться рекомендациями по мере их разработки.
- **Эти возможности очень новые.** По мере того, как хранилища данных разрабатывают новые функции, мы ожидаем, что они предложат более дешевые, быстрые и интуитивно понятные механизмы для развертывания Python трансформаций. **Мы оставляем за собой право изменить основную реализацию для выполнения Python моделей в будущих выпусках.** Наша приверженность вам заключается в коде в ваших файлах модели `.py`, следуя документированным возможностям и рекомендациям, которые мы предоставляем здесь.
- **Отсутствие поддержки `print()`.** Платформа данных запускает и компилирует вашу Python модель без надзора dbt. Это означает, что она не отображает вывод команд, таких как встроенная функция Python [`print()`](https://docs.python.org/3/library/functions.html#print) в логах dbt.

- <Expandable alt_header="Альтернативы использованию print() в Python моделях">

    Следующее объясняет другие методы, которые вы можете использовать для отладки, такие как запись сообщений в столбец dataframe:
    
    - Использование логов платформы: Используйте логи вашей платформы данных для отладки ваших Python моделей.
    - Возврат логов как dataframe: Создайте dataframe, содержащий ваши логи, и постройте его в хранилище.
    - Разработка локально с DuckDB: Тестируйте и отлаживайте ваши модели локально, используя DuckDB, перед их развертыванием.
    
    Вот пример отладки в Python модели:

    ```python
    def model(dbt, session):
        dbt.config(
            materialized = "table"
        )
    
        df = dbt.ref("my_source_table").df()
    
        # Один из вариантов отладки: запись сообщений во временный столбец таблицы
        # Плюсы: видимость
        # Минусы: не сработает, если таблица не строится по какой-то причине
        msg = "что-то"
        df["debugging"] = f"Мое отладочное сообщение здесь: {msg}"
    
        return df
    ```
    </Expandable>

В качестве общего правила: если преобразование можно одинаково хорошо написать как на SQL, так и на Python, мы считаем, что хорошо написанный SQL предпочтительнее. Он более доступен для большего числа коллег, и на нём проще писать код, который будет производительным при работе с большими объёмами данных. Если же преобразование _нельзя_ написать на SQL, или в ситуации, когда десять строк элегантного и хорошо прокомментированного Python могут заменить тысячу строк трудночитаемого Jinja-SQL, стоит выбрать Python.
