---
title: "Python модели"
id: "python-models"
---

Обратите внимание, что только [определенные платформы данных](#specific-data-platforms) поддерживают модели dbt-py.

Мы рекомендуем вам:
- Прочитать [оригинальное обсуждение](https://github.com/dbt-labs/dbt-core/discussions/5261), в котором была предложена эта функция.
- Внести свой вклад в [лучшие практики разработки Python моделей в dbt](https://discourse.getdbt.com/t/dbt-python-model-dbt-py-best-practices/5204).
- Поделиться своими мыслями и идеями о [следующих шагах для Python моделей](https://github.com/dbt-labs/dbt-core/discussions/5742).
- Присоединиться к каналу **#dbt-core-python-models** в [сообществе dbt Slack](https://www.getdbt.com/community/join-the-community/).

## Обзор

Модели dbt Python (`dbt-py`) могут помочь вам решить задачи, которые нельзя решить с помощью SQL. Вы можете выполнять анализ, используя инструменты, доступные в экосистеме открытого кода Python, включая современные пакеты для науки о данных и статистики. Ранее вам потребовалась бы отдельная инфраструктура и оркестрация для выполнения Python-трансформаций в производственной среде. Python-трансформации, определенные в dbt, являются моделями в вашем проекте с теми же возможностями тестирования, документации и отслеживания.

<File name='models/my_python_model.py'>

```python
import ...

def model(dbt, session):

    my_sql_model_df = dbt.ref("my_sql_model")

    final_df = ...  # вещи, которые вы не можете написать на SQL!

    return final_df
```

</File>

<File name='models/config.yml'>

```yml
version: 2

models:
  - name: my_python_model

    # Документируйте в том же коде
    description: Моя трансформация, написанная на Python

    # Настройте так, чтобы это было интуитивно и знакомо
    config:
      materialized: table
      tags: ['python']

    # Тестируйте результаты моей Python трансформации
    columns:
      - name: id
        # Стандартная проверка для 'grain' результатов Python
        tests:
          - unique
          - not_null
    tests:
      # Напишите свою собственную логику проверки (на SQL) для результатов Python
      - [custom_generic_test](/best-practices/writing-custom-generic-tests)
```

</File>

<!--- TODO: как сделать предварительный просмотр этого изображения больше? --->
<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/python-model-dag.png" title="SQL + Python, наконец-то вместе" style="width:200%"/>

Предварительные условия для моделей dbt Python включают использование адаптера для платформы данных, которая поддерживает полнофункциональную среду выполнения Python. В модели dbt Python весь код Python выполняется удаленно на платформе. Никакой из него не выполняется локально dbt. Мы верим в четкое разделение _определения модели_ и _выполнения модели_. В этом и многих других аспектах вы увидите, что подход dbt к Python моделям отражает его давний подход к моделированию данных в SQL.

Мы написали этот гид, предполагая, что у вас есть некоторый опыт работы с dbt. Если вы никогда не писали модель dbt, мы рекомендуем вам сначала прочитать [Модели dbt](/docs/build/models). На протяжении всего текста мы будем проводить параллели между Python моделями и SQL моделями, а также четко указывать на их различия.

### Что такое Python модель?

Python модель dbt — это функция, которая считывает источники dbt или другие модели, применяет ряд трансформаций и возвращает преобразованный набор данных. <Term id="dataframe">DataFrame</Term> операции определяют начальные точки, конечное состояние и каждый шаг на этом пути.

Это похоже на роль <Term id="cte">CTE</Term> в моделях dbt SQL. Мы используем CTE для извлечения верхних наборов данных, определения (и именования) ряда значимых трансформаций и завершаем финальным оператором `select`. Вы можете запустить скомпилированную версию модели dbt SQL, чтобы увидеть данные, включенные в результирующее представление или таблицу. Когда вы выполняете `dbt run`, dbt оборачивает этот запрос в `create view`, `create table` или более сложный DDL, чтобы сохранить его результаты в базе данных.

Вместо финального оператора `select` каждая Python модель возвращает финальный DataFrame. Каждая операция DataFrame "оценивается лениво". В процессе разработки вы можете предварительно просмотреть его данные, используя методы, такие как `.show()` или `.head()`. Когда вы запускаете Python модель, полный результат финального DataFrame будет сохранен как таблица в вашем хранилище данных.

Модели dbt Python имеют доступ почти ко всем тем же параметрам конфигурации, что и SQL модели. Вы можете тестировать и документировать их, добавлять `tags` и `meta` свойства, а также предоставлять доступ к их результатам другим пользователям. Вы можете выбирать их по имени, пути к файлу, конфигурациям, являются ли они верхними или нижними по отношению к другой модели, или если они были изменены по сравнению с предыдущим состоянием проекта.

### Определение Python модели

Каждая Python модель находится в файле `.py` в вашей папке `models/`. Она определяет функцию с именем **`model()`**, которая принимает два параметра:
- **`dbt`**: Класс, скомпилированный dbt Core, уникальный для каждой модели, который позволяет вам запускать ваш код Python в контексте вашего проекта dbt и DAG.
- **`session`**: Класс, представляющий соединение вашей платформы данных с Python бэкендом. Сессия необходима для считывания таблиц как DataFrames и записи DataFrames обратно в таблицы. В PySpark по соглашению `SparkSession` называется `spark` и доступен глобально. Для согласованности между платформами мы всегда передаем его в функцию `model` как явный аргумент с именем `session`.

Функция `model()` должна возвращать один DataFrame. В Snowpark (Snowflake) это может быть Snowpark или pandas DataFrame. Через PySpark (Databricks + BigQuery) это может быть Spark, pandas или pandas-on-Spark DataFrame. Для получения дополнительной информации о выборе между pandas и нативными DataFrames смотрите [DataFrame API + синтаксис](#dataframe-api-and-syntax).

Когда вы выполняете `dbt run --select python_model`, dbt подготовит и передаст оба аргумента (`dbt` и `session`). Все, что вам нужно сделать, это определить функцию. Вот как должна выглядеть каждая Python модель:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    ...

    return final_df
```

</File>

### Ссылки на другие модели

Python модели полностью участвуют в направленном ациклическом графе (DAG) трансформаций dbt. Используйте метод `dbt.ref()` внутри Python модели, чтобы считывать данные из других моделей (SQL или Python). Если вы хотите считывать данные непосредственно из сырой таблицы источника, используйте `dbt.source()`. Эти методы возвращают DataFrames, указывающие на верхний источник, модель, семя или снимок.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    # DataFrame, представляющий верхнюю модель
    upstream_model = dbt.ref("upstream_model_name")

    # DataFrame, представляющий верхний источник
    upstream_source = dbt.source("upstream_source_name", "table_name")

    ...
```

</File>

Конечно, вы также можете `ref()` вашу Python модель в нижних SQL моделях:

<File name='models/downstream_model.sql'>

```sql
with upstream_python_model as (

    select * from {{ ref('my_python_model') }}

),

...
```

</File>

:::caution

Ссылки на [эпhemeral](/docs/build/materializations#ephemeral) модели в настоящее время не поддерживаются (см. [запрос функции](https://github.com/dbt-labs/dbt-core/issues/7288)) 
:::

<VersionBlock firstVersion="1.8">

С версии dbt 1.8 Python модели также поддерживают динамические конфигурации внутри f-строк Python. Это позволяет более тонким и динамическим конфигурациям моделей непосредственно в вашем коде Python. Например:

<File name='models/my_python_model.py'>

```python
# Ранее попытка получить значение конфигурации таким образом приводила к None
print(f"{dbt.config.get('my_var')}")  # Вывод до изменения: None

# Теперь вы можете получить фактическое значение конфигурации
# Предполагая, что 'my_var' настроен на 5 для текущей модели
print(f"{dbt.config.get('my_var')}")  # Вывод после изменения: 5
```

Это также означает, что вы можете использовать `dbt.config.get()` внутри Python моделей, чтобы гарантировать, что значения конфигурации эффективно извлекаются и используются внутри f-строк Python.

</File>
</VersionBlock>

## Настройка Python моделей

Так же, как и SQL модели, есть три способа настроить Python модели:
1. В `dbt_project.yml`, где вы можете настроить множество моделей сразу
2. В отдельном `.yml` файле в директории `models/`
3. В `.py` файле модели, используя метод `dbt.config()`

Вызов метода `dbt.config()` установит конфигурации для вашей модели внутри вашего `.py` файла, аналогично макросу `{{ config() }}` в `.sql` файлах моделей:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):

    # установка конфигурации
    dbt.config(materialized="table")
```

</File>

Существует ограничение на то, насколько сложными могут быть настройки с помощью метода `dbt.config()`. Он принимает _только_ литеральные значения (строки, булевы и числовые типы) и динамическую конфигурацию. Передача другой функции или более сложной структуры данных невозможна. Причина в том, что dbt статически анализирует аргументы для `config()`, когда парсит вашу модель, не выполняя ваш код Python. Если вам нужно установить более сложную конфигурацию, мы рекомендуем определить ее с помощью [`config` свойства](/reference/resource-properties/config) в YAML файле.

#### Доступ к контексту проекта

Модели dbt Python не используют Jinja для рендеринга скомпилированного кода. Python модели имеют ограниченный доступ к глобальным контекстам проекта по сравнению с SQL моделями. Этот контекст доступен из класса `dbt`, переданного в качестве аргумента функции `model()`.

По умолчанию класс `dbt` поддерживает:
- Возвращение DataFrames, ссылающихся на местоположения других ресурсов: `dbt.ref()` + `dbt.source()`
- Доступ к местоположению базы данных текущей модели: `dbt.this()` (также: `dbt.this.database`, `.schema`, `.identifier`)
- Определение, является ли выполнение текущей модели инкрементальным: `dbt.is_incremental`

Возможно расширить этот контекст, "получая" их с помощью `dbt.config.get()`, после того как они были настроены в [конфигурации модели](/reference/model-configs). Начиная с версии dbt 1.8, метод `dbt.config.get()` поддерживает динамический доступ к конфигурациям внутри Python моделей, что повышает гибкость в логике модели. Это включает такие входные данные, как `var`, `env_var` и `target`. Если вы хотите использовать эти значения для условной логики в вашей модели, мы требуем их настройки через специальный YAML файл конфигурации:

<File name='models/config.yml'>

```yml
version: 2

models:
  - name: my_python_model
    config:
      materialized: table
      target_name: "{{ target.name }}"
      specific_var: "{{ var('SPECIFIC_VAR') }}"
      specific_env_var: "{{ env_var('SPECIFIC_ENV_VAR') }}"
```

</File>

Затем в коде Python модели используйте функцию `dbt.config.get()`, чтобы _получить_ значения конфигураций, которые были установлены:

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    target_name = dbt.config.get("target_name")
    specific_var = dbt.config.get("specific_var")
    specific_env_var = dbt.config.get("specific_env_var")

    orders_df = dbt.ref("fct_orders")

    # ограничить данные в dev
    if target_name == "dev":
        orders_df = orders_df.limit(500)
```

</File>

<VersionBlock firstVersion="1.8">

#### Динамические конфигурации

В дополнение к существующим методам настройки Python моделей, у вас также есть динамический доступ к значениям конфигурации, установленным с помощью `dbt.config()` внутри Python моделей, используя f-строки. Это увеличивает возможности для пользовательской логики и управления конфигурацией.

<File name='models/my_python_model.py'>

```python
def model(dbt, session):
    dbt.config(materialized="table")
    
    # Динамический доступ к конфигурации внутри f-строк Python, 
    # что позволяет в реальном времени извлекать и использовать значения конфигурации.
    # Предполагая, что 'my_var' установлен на 5, это выведет: Динамическое значение конфигурации: 5
    print(f"Динамическое значение конфигурации: {dbt.config.get('my_var')}")
```

</File>
</VersionBlock>

### Материализации

Python модели поддерживают следующие материализации:
- `table` (по умолчанию)
- `incremental`

Инкрементальные Python модели поддерживают все те же [инкрементальные стратегии](/docs/build/incremental-strategy), что и их SQL аналоги. Конкретные поддерживаемые стратегии зависят от вашего адаптера. Например, инкрементальные модели поддерживаются в BigQuery с Dataproc для стратегии `merge`; стратегия `insert_overwrite` пока не поддерживается.

Python модели не могут быть материализованы как `view` или `ephemeral`. Python не поддерживается для не-модельных типов ресурсов (таких как тесты и снимки).

Для инкрементальных моделей, как и для SQL моделей, вам нужно фильтровать входящие таблицы, чтобы оставить только новые строки данных:

<WHCode>

<div warehouse="Snowpark">

<File name='models/my_python_model.py'>

```python
import snowflake.snowpark.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # только новые строки по сравнению с максимальным значением в текущей таблице
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # или только строки за последние 3 дня
        df = df.filter(df.updated_at >= F.dateadd("day", F.lit(-3), F.current_timestamp()))

    ...

    return df
```

</File>

</div>

<div warehouse="PySpark">

<File name='models/my_python_model.py'>

```python
import pyspark.sql.functions as F

def model(dbt, session):
    dbt.config(materialized = "incremental")
    df = dbt.ref("upstream_table")

    if dbt.is_incremental:

        # только новые строки по сравнению с максимальным значением в текущей таблице
        max_from_this = f"select max(updated_at) from {dbt.this}"
        df = df.filter(df.updated_at >= session.sql(max_from_this).collect()[0][0])

        # или только строки за последние 3 дня
        df = df.filter(df.updated_at >= F.date_add(F.current_timestamp(), F.lit(-3)))

    ...

    return df
```

</File>

</div>

</WHCode>

## Специфическая функциональность Python

### Определение функций

В дополнение к определению функции `model`, Python модель может импортировать другие функции или определять свои собственные. Вот пример на Snowpark, определяющий пользовательскую функцию `add_one`:

<File name='models/my_python_model.py'>

```python
def add_one(x):
    return x + 1

def model(dbt, session):
    dbt.config(materialized="table")
    temps_df = dbt.ref("temperatures")

    # немного подогреваем
    df = temps_df.withColumn("degree_plus_one", add_one(temps_df["degree"]))
    return df
```

</File>

В настоящее время функции Python, определенные в одной модели dbt, не могут быть импортированы и повторно использованы в других моделях. Смотрите [Повторное использование кода](#code-reuse) для потенциальных паттернов, которые рассматриваются.

### Использование пакетов PyPI

Вы также можете определять функции, которые зависят от сторонних пакетов, при условии, что эти пакеты установлены и доступны для среды выполнения Python на вашей платформе данных. Смотрите примечания по "Установке пакетов" для [определенных платформ данных](#specific-data-platforms).

В этом примере мы используем пакет `holidays`, чтобы определить, является ли данная дата праздником во Франции. Код ниже использует API pandas для простоты и согласованности между платформами. Точный синтаксис и необходимость рефакторинга для многонодовой обработки все еще могут различаться.

<WHCode>

<div warehouse="Snowpark">

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
    df["ORDER_DATE"].dt.tz_localize('UTC') # конвертируем из Number/Long в tz-aware Datetime

    # возвращаем финальный набор данных (Pandas DataFrame)
    return df
```

</File>

</div>

<div warehouse="PySpark">

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

    # конвертируем обратно в PySpark
    df = df.to_spark()               # Spark 3.2+
    # df = session.createDataFrame(df) в более ранних версиях

    # возвращаем финальный набор данных (PySpark DataFrame)
    return df
```

</File>

</div>

</WHCode>

#### Настройка пакетов

Мы рекомендуем вам настраивать необходимые пакеты и версии, чтобы dbt мог отслеживать их в метаданных проекта. Эта конфигурация обязательна для реализации на некоторых платформах. Если вам нужны конкретные версии пакетов, укажите их.

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
version: 2

models:
  - name: my_python_model
    config:
      packages:
        - "numpy==1.23.1"
        - scikit-learn
```

</File>

#### Пользовательские функции (UDF)

Вы можете использовать декоратор `@udf` или функцию `udf`, чтобы определить "анонимную" функцию и вызвать ее в трансформации DataFrame вашей функции `model`. Это типичный паттерн для применения более сложных функций в качестве операций DataFrame, особенно если эти функции требуют входных данных от сторонних пакетов.
- [Snowpark Python: Создание UDF](https://docs.snowflake.com/en/developer-guide/snowpark/python/creating-udfs.html)
- [Функции PySpark: udf](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.functions.udf.html)

<WHCode>

<div warehouse="Snowpark">

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

    # подогреваем, кто знает на сколько
    df = temps_df.withColumn("degree_plus_random", add_random("degree"))
    return df
```

</File>

**Примечание:** Из-за ограничения Snowpark в настоящее время невозможно зарегистрировать сложные именованные UDF внутри хранимых процедур и, следовательно, в моделях dbt Python. Мы планируем добавить нативную поддержку Python UDF как типа ресурса проекта/DAG в будущем релизе. На данный момент, если вы хотите создать "векторизованный" Python UDF через Batch API, мы рекомендуем либо:
- Написать [`create function`](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-batch.html) внутри SQL макроса, чтобы выполнить его как хук или операцию выполнения
- [Зарегистрировать из подготовленного файла](https://docs.snowflake.com/en/developer-guide/snowpark/python/creating-udfs#creating-a-udf-from-a-python-source-file) внутри кода вашей Python модели

</div>

<div warehouse="PySpark">

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

    # подогреваем, кто знает на сколько
    df = temps_df.withColumn("degree_plus_random", add_random("degree"))
    return df
```

</File>

</div>

</WHCode>

#### Повторное использование кода

В настоящее время функции Python, определенные в одной модели dbt, не могут быть импортированы и повторно использованы в других моделях. Это то, что dbt Labs хотел бы поддерживать, поэтому мы рассматриваем два паттерна:

- Создание и регистрация **"именованных" UDF** &mdash; Этот процесс различается между платформами данных и имеет некоторые ограничения по производительности. Например, Snowpark поддерживает [векторизованные UDF](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-batch.html) для функций, похожих на pandas, которые вы можете выполнять параллельно.
- **Частные пакеты Python** &mdash; В дополнение к импорту повторно используемых функций из публичных пакетов PyPI, многие платформы данных поддерживают загрузку пользовательских активов Python и регистрацию их как пакетов. Процесс загрузки различается между платформами, но фактический `import` вашего кода выглядит одинаково.

:::note ❓ Вопросы dbt

- Должен ли dbt играть роль в абстрагировании UDF? Должен ли dbt поддерживать новый тип узла DAG, `function`? Будет ли основным случаем использования повторное использование кода между Python моделями или определение функций на языке Python, которые могут быть вызваны из SQL моделей?
- Как dbt может помочь пользователям при загрузке или инициализации частных активов Python? Является ли это новой формой `dbt deps`?
- Как dbt может поддерживать пользователей, которые хотят тестировать пользовательские функции? Если они определены как UDF: "модульное тестирование" в базе данных? Если "чистые" функции в пакетах: поощрять использование `pytest`?

💬 Обсуждение: ["Python модели: управление пакетами, артефактами/объектами и UDF в dbt"](https://github.com/dbt-labs/dbt-core/discussions/5741)
:::

### DataFrame API и синтаксис

За последнее десятилетие большинство людей, пишущих [трансформации данных](https://www.getdbt.com/analytics-engineering/transformation/) на Python, приняли <Term id="dataframe">DataFrame</Term> как свою общую абстракцию. dbt следует этой конвенции, возвращая `ref()` и `source()` как DataFrames, и ожидает, что все Python модели будут возвращать DataFrame.

DataFrame — это двумерная структура данных (строки и столбцы). Она поддерживает удобные методы для трансформации этих данных и создания новых столбцов из вычислений, выполненных на существующих столбцах. Она также предлагает удобные способы предварительного просмотра данных во время разработки локально или в блокноте.

На этом согласие заканчивается. Существует множество фреймворков с собственными синтаксисами и API для DataFrames. Библиотека [pandas](https://pandas.pydata.org/docs/) предложила один из оригинальных API DataFrame, и ее синтаксис является наиболее распространенным для изучения новых специалистов по данным. Большинство новых API DataFrame совместимы с синтаксисом pandas, хотя немногие могут предложить идеальную совместимость. Это верно для Snowpark и PySpark, которые имеют свои собственные API DataFrame.

При разработке Python модели вы можете задать себе следующие вопросы:

**Почему pandas?** &mdash; Это самый распространенный API для DataFrames. Он упрощает исследование выборочных данных и разработку трансформаций локально. Вы можете "продвигать" свой код как есть в модели dbt и запускать его в производственной среде для небольших наборов данных.

**Почему _не_ pandas?** &mdash; Производительность. pandas выполняет "один узел" трансформации, которые не могут воспользоваться параллелизмом и распределенными вычислениями, предлагаемыми современными хранилищами данных. Это быстро становится проблемой, когда вы работаете с большими наборами данных. Некоторые платформы данных поддерживают оптимизации для кода, написанного с использованием API DataFrame pandas, что предотвращает необходимость в крупных рефакторингах. Например, [pandas на PySpark](https://spark.apache.org/docs/latest/api/python/getting_started/quickstart_ps.html) предлагает поддержку 95% функциональности pandas, используя тот же API, при этом все еще используя параллельную обработку.

:::note ❓ Вопросы dbt
- При разработке новой модели dbt Python, следует ли нам рекомендовать синтаксис в стиле pandas для быстрого итерационного процесса, а затем рефакторить?
- Какие открытые библиотеки предоставляют убедительные абстракции для различных движков данных и специфичных для поставщиков API?
- Должен ли dbt пытаться сыграть более долгосрочную роль в стандартизации между ними?

💬 Обсуждение: ["Python модели: проблема pandas (и возможное решение)"](https://github.com/dbt-labs/dbt-core/discussions/5738)
:::

## Ограничения

Python модели имеют возможности, которых нет у SQL моделей. У них также есть некоторые недостатки по сравнению с SQL моделями:

- **Время и стоимость.** Python модели медленнее, чем SQL модели, и облачные ресурсы, которые их запускают, могут быть более дорогими. Запуск Python требует более общего вычисления. Это вычисление иногда может находиться на отдельной службе или архитектуре от ваших SQL моделей. **Тем не менее:** Мы считаем, что развертывание Python моделей через dbt — с единым отслеживанием, тестированием и документацией — с человеческой точки зрения **значительно** быстрее и дешевле. В сравнении, создание отдельной инфраструктуры для оркестрации Python трансформаций в производственной среде и использование различных инструментов для интеграции с dbt занимает гораздо больше времени и стоит дороже.
- **Различия в синтаксисе** еще более выражены. На протяжении многих лет dbt сделал много, используя паттерны диспетчеризации и пакеты, такие как `dbt_utils`, чтобы абстрагировать различия в диалектах SQL между популярными хранилищами данных. Python предлагает **намного** более широкое поле для игры. Если в SQL есть пять способов сделать что-то, в Python есть 500 способов это написать, все с различной производительностью и соблюдением стандартов. Эти варианты могут быть подавляющими. Как хранители dbt, мы будем учиться на современных проектах, решающих эту проблему, и делиться рекомендациями по мере их разработки.
- **Эти возможности очень новые.** Поскольку хранилища данных разрабатывают новые функции, мы ожидаем, что они предложат более дешевые, быстрые и интуитивно понятные механизмы для развертывания Python трансформаций. **Мы оставляем за собой право изменять основную реализацию для выполнения Python моделей в будущих релизах.** Наша приверженность вам заключается в коде в ваших файлах модели `.py`, следуя документированным возможностям и рекомендациям, которые мы предоставляем здесь.
- **Отсутствие поддержки `print()`.** Платформа данных запускает и компилирует вашу Python модель без надзора dbt. Это означает, что она не отображает вывод команд, таких как встроенная функция Python [`print()`](https://docs.python.org/3/library/functions.html#print) в журналах dbt.

- <Expandable alt_header="Альтернативы использованию print() в Python моделях">

    Следующее объясняет другие методы, которые вы можете использовать для отладки, такие как запись сообщений в столбец DataFrame:
    
    - Использование журналов платформы: Используйте журналы вашей платформы данных для отладки ваших Python моделей.
    - Возвращение журналов как DataFrame: Создайте DataFrame, содержащий ваши журналы, и постройте его в хранилище.
    - Разработка локально с DuckDB: Тестируйте и отлаживайте ваши модели локально с помощью DuckDB перед развертыванием.
    
    Вот пример отладки в Python модели:

    ```python
    def model(dbt, session):
        dbt.config(
            materialized = "table"
        )
    
        df = dbt.ref("my_source_table").df()
    
        # Один из вариантов для отладки: записать сообщения в столбец временной таблицы
        # Плюсы: видимость
        # Минусы: не сработает, если таблица не строится по какой-то причине
        msg = "что-то"
        df["debugging"] = f"Мое отладочное сообщение здесь: {msg}"
    
        return df
    ```
    </Expandable>

В общем, если есть трансформация, которую вы можете написать одинаково хорошо на SQL или Python, мы считаем, что хорошо написанный SQL предпочтительнее: он более доступен для большего числа коллег и легче писать код, который будет производительным в масштабе. Если есть трансформация, которую вы _не можете_ написать на SQL, или где десять строк элегантного и хорошо аннотированного Python могут сэкономить вам 1000 строк трудночитаемого Jinja-SQL, Python — это правильный выбор.

## Специфические платформы данных {#specific-data-platforms}

При их первоначальном запуске Python модели поддерживаются на трех самых популярных платформах данных: Snowflake, Databricks и BigQuery/GCP (через Dataproc). Как Databricks, так и GCP's Dataproc используют PySpark в качестве фреймворка обработки. Snowflake использует свой собственный фреймворк, Snowpark, который имеет много общего с PySpark.

<WHCode>

<div warehouse="Snowflake">

**Дополнительная настройка:** Вам нужно будет [принять и согласиться с Условиями третьих сторон Snowflake](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages.html#getting-started), чтобы использовать пакеты Anaconda.

**Установка пакетов:** Snowpark поддерживает несколько популярных пакетов через Anaconda. Смотрите [полный список](https://repo.anaconda.com/pkgs/snowflake/) для получения дополнительной информации. Пакеты устанавливаются, когда ваша модель запускается. Разные модели могут иметь разные зависимости пакетов. Если вы используете сторонние пакеты, Snowflake рекомендует использовать выделенный виртуальный склад для лучшей производительности, а не тот, где много одновременных пользователей.

**Версия Python:** Чтобы указать другую версию Python, используйте следующую конфигурацию:

```python
def model(dbt, session):
    dbt.config(
        materialized = "table",
        python_version="3.11"
    )
```

<VersionBlock firstVersion="1.8">

**Интеграции внешнего доступа и секреты:** Чтобы запрашивать внешние API в моделях dbt Python, используйте внешний доступ Snowflake вместе с [секретами](https://docs.snowflake.com/en/developer-guide/external-network-access/secret-api-reference). Вот некоторые дополнительные конфигурации, которые вы можете использовать:

```python
import pandas
import snowflake.snowpark as snowpark

def model(dbt, session: snowpark.Session):
    dbt.config(
        materialized="table",
        secrets={"secret_variable_name": "test_secret"},
        external_access_integrations=["test_external_access_integration"],
    )
    import _snowflake
    return session.create_dataframe(
        pandas.DataFrame(
            [{"secret_value": _snowflake.get_generic_secret_string('secret_variable_name')}]
        )
    )
```

</VersionBlock>

**О "sprocs":** dbt отправляет Python модели для выполнения как _хранимые процедуры_, которые некоторые люди называют _sprocs_ для краткости. По умолчанию dbt будет использовать _временные_ или _анонимные_ хранимые процедуры Snowpark ([документы](https://docs.snowflake.com/en/sql-reference/sql/call-with.html)), которые быстрее и сохраняют историю запросов более чистой, чем именованные sprocs, содержащие скомпилированный код вашей модели Python. Чтобы отключить эту функцию, установите `use_anonymous_sproc: False` в конфигурации вашей модели. 

**Документы:** ["Руководство разработчика: Snowpark Python"](https://docs.snowflake.com/en/developer-guide/snowpark/python/index.html)

#### Пакеты третьих сторон Snowflake

Чтобы использовать сторонний пакет Snowflake, который недоступен в Snowflake Anaconda, загрузите свой пакет, следуя [этому примеру](https://docs.snowflake.com/en/developer-guide/udf/python/udf-python-packages#importing-packages-through-a-snowflake-stage), а затем настройте параметр `imports` в модели dbt Python, чтобы ссылаться на zip-файл в вашем Snowflake staging.

Вот полный пример конфигурации с использованием zip-файла, включая использование `imports` в Python модели:

```python

def model(dbt, session):
    # Настройка модели
    dbt.config(
        materialized="table",
        imports=["@mystage/mycustompackage.zip"],  # Укажите местоположение внешнего пакета
    )
    
    # Пример трансформации данных с использованием импортированного пакета
    # (Предполагая, что `some_external_package` имеет функцию, которую мы можем вызвать)
    data = {
        "name": ["Alice", "Bob", "Charlie"],
        "score": [85, 90, 88]
    }
    df = pd.DataFrame(data)

    # Обработка данных с помощью внешнего пакета
    df["adjusted_score"] = df["score"].apply(lambda x: some_external_package.adjust_score(x))
    
    # Вернуть DataFrame как выход модели
    return df

```

Для получения дополнительной информации о использовании этой конфигурации смотрите [документацию Snowflake](https://community.snowflake.com/s/article/how-to-use-other-python-packages-in-snowpark) о загрузке и использовании других пакетов Python в Snowpark, которые не опубликованы на канале Anaconda Snowflake.


</div>

<div warehouse="Databricks">

**Методы отправки:** Databricks поддерживает несколько различных механизмов для отправки кода PySpark, каждый из которых имеет относительные преимущества. Некоторые лучше подходят для поддержки итеративной разработки, в то время как другие лучше подходят для поддержки более дешевых производственных развертываний. Опции:
- `all_purpose_cluster` (по умолчанию): dbt будет запускать вашу Python модель, используя идентификатор кластера, настроенный как `cluster` в вашем профиле соединения или для этой конкретной модели. Эти кластеры более дорогие, но также гораздо более отзывчивые. Мы рекомендуем использовать интерактивный кластер общего назначения для более быстрой итерации в процессе разработки.
  - `create_notebook: True`: dbt загрузит скомпилированный код PySpark вашей модели в блокнот в пространстве имен `/Shared/dbt_python_model/{schema}`, где `{schema}` — это настроенная схема для модели, и выполнит этот блокнот, чтобы запустить его с помощью кластера общего назначения. Привлекательность этого подхода заключается в том, что вы можете легко открыть блокнот в интерфейсе Databricks для отладки или доработки сразу после выполнения вашей модели. Не забудьте скопировать любые изменения в код вашей модели dbt `.py` перед повторным запуском.
  - `create_notebook: False` (по умолчанию): dbt будет использовать [Command API](https://docs.databricks.com/dev-tools/api/1.2/index.html#run-a-command), который немного быстрее.
- `job_cluster`: dbt загрузит скомпилированный код PySpark вашей модели в блокнот в пространстве имен `/Shared/dbt_python_model/{schema}`, где `{schema}` — это настроенная схема для модели, и выполнит этот блокнот, чтобы запустить его с помощью краткосрочного кластера задач. Для каждой Python модели Databricks необходимо будет развернуть кластер, выполнить трансформацию PySpark модели и затем остановить кластер. Таким образом, кластеры задач требуют больше времени до и после выполнения модели, но они также менее дорогие, поэтому мы рекомендуем их для более длительных Python моделей в производственной среде. Чтобы использовать метод отправки `job_cluster`, ваша модель должна быть настроена с `job_cluster_config`, который определяет ключевые свойства для `new_cluster`, как определено в [JobRunsSubmit API](https://docs.databricks.com/dev-tools/api/latest/jobs.html#operation/JobsRunsSubmit).

Вы можете настроить `submission_method` каждой модели всеми стандартными способами, которыми вы предоставляете конфигурацию:

```python
def model(dbt, session):
    dbt.config(
        submission_method="all_purpose_cluster",
        create_notebook=True,
        cluster_id="abcd-1234-wxyz"
    )
    ...
```
```yml
version: 2
models:
  - name: my_python_model
    config:
      submission_method: job_cluster
      job_cluster_config:
        spark_version: ...
        node_type_id: ...
```
```yml
# dbt_project.yml
models:
  project_name:
    subfolder:
      # установите значения по умолчанию для всех .py моделей, определенных в этой подпапке
      +submission_method: all_purpose_cluster
      +create_notebook: False
      +cluster_id: abcd-1234-wxyz
```

Если не настроено, `dbt-spark` будет использовать встроенные значения по умолчанию: кластер общего назначения (на основе `cluster` в вашем профиле соединения) без создания блокнота. Адаптер `dbt-databricks` будет по умолчанию использовать кластер, настроенный в `http_path`. Мы настоятельно рекомендуем явно настраивать кластеры для Python моделей в проектах Databricks.

**Установка пакетов:** При использовании кластеров общего назначения мы рекомендуем устанавливать пакеты, которые вы будете использовать для запуска ваших Python моделей.

**Документы:**
- [Синтаксис DataFrame PySpark](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)
- [Databricks: Введение в DataFrames - Python](https://docs.databricks.com/spark/latest/dataframes-datasets/introduction-to-dataframes-python.html)

</div>

<div warehouse="BigQuery">

Адаптер `dbt-bigquery` использует службу под названием Dataproc для отправки ваших Python моделей в виде заданий PySpark. Этот код Python/PySpark будет считывать из ваших таблиц и представлений в BigQuery, выполнять все вычисления в Dataproc и записывать окончательный результат обратно в BigQuery.

**Методы отправки.** Dataproc поддерживает два метода отправки: `serverless` и `cluster`. Dataproc Serverless не требует готового кластера, что экономит время и деньги, но он медленнее в запуске и гораздо более ограничен в доступной конфигурации. Например, Dataproc Serverless поддерживает только небольшой набор пакетов Python, хотя он включает `pandas`, `numpy` и `scikit-learn`. (Смотрите полный список [здесь](https://cloud.google.com/dataproc-serverless/docs/guides/custom-containers#example_custom_container_image_build), в разделе "Следующие пакеты установлены в образе по умолчанию"). В то время как, создавая кластер Dataproc заранее, вы можете точно настроить конфигурацию кластера, установить любые пакеты PyPI, которые хотите, и воспользоваться более быстрыми и отзывчивыми временными интервалами.

Используйте метод отправки `cluster` с выделенными кластерами Dataproc, которые вы или ваша организация управляете. Используйте метод отправки `serverless`, чтобы избежать управления кластером Spark. Последний может быть быстрее для начала, но оба варианта подходят для производства.

**Дополнительная настройка:**
- Создайте или используйте существующий [Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- Включите API Dataproc для вашего проекта + региона
- Если вы используете метод отправки `cluster`: создайте или используйте существующий [кластер Dataproc](https://cloud.google.com/dataproc/docs/guides/create-cluster) с [инициализацией соединителя BigQuery Spark](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/connectors#bigquery-connectors). (Google рекомендует копировать действие в ваш собственный Cloud Storage bucket, а не использовать примерную версию, показанную на скриншоте)

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-connector-initialization.png" title="Добавьте соединитель BigQuery Spark в качестве инициализационного действия"/>

Следующие конфигурации необходимы для запуска Python моделей на Dataproc. Вы можете добавить их в ваш [профиль BigQuery](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc) или настроить их для конкретных Python моделей:
- `gcs_bucket`: Хранилище, в которое dbt загрузит скомпилированный код PySpark вашей модели.
- `dataproc_region`: Регион GCP, в котором вы включили Dataproc (например, `us-central1`).
- `dataproc_cluster_name`: Имя кластера Dataproc, который будет использоваться для запуска Python модели (выполнение задания PySpark). Требуется только если `submission_method: cluster`.

```python
def model(dbt, session):
    dbt.config(
        submission_method="cluster",
        dataproc_cluster_name="my-favorite-cluster"
    )
    ...
```
```yml
version: 2
models:
  - name: my_python_model
    config:
      submission_method: serverless
```

Python модели, работающие на Dataproc Serverless, могут быть дополнительно настроены в вашем [профиле BigQuery](/docs/core/connect-data-platform/bigquery-setup#running-python-models-on-dataproc).

Любой пользователь или сервисный аккаунт, который запускает модели dbt Python, должен иметь следующие разрешения (в дополнение к необходимым разрешениям BigQuery) ([документы](https://cloud.google.com/dataproc/docs/concepts/iam/iam)):
```
dataproc.batches.create
dataproc.clusters.use
dataproc.jobs.create
dataproc.jobs.get
dataproc.operations.get
dataproc.operations.list
storage.buckets.get
storage.objects.create
storage.objects.delete
```

**Установка пакетов:** Если вы используете кластер Dataproc (в отличие от Dataproc Serverless), вы можете добавить сторонние пакеты во время создания кластера.

Google рекомендует устанавливать пакеты Python на кластерах Dataproc через инициализационные действия:
- [Как используются инициализационные действия](https://github.com/GoogleCloudDataproc/initialization-actions/blob/master/README.md#how-initialization-actions-are-used)
- [Действия для установки через `pip` или `conda`](https://github.com/GoogleCloudDataproc/initialization-actions/tree/master/python)

Вы также можете установить пакеты во время создания кластера, определив свойства кластера (https://cloud.google.com/dataproc/docs/tutorials/python-configuration#image_version_20): `dataproc:pip.packages` или `dataproc:conda.packages`.

<Lightbox src="/img/docs/building-a-dbt-project/building-models/python-models/dataproc-pip-packages.png" title="Добавление пакетов для установки через pip при запуске кластера"/>

**Документы:**

- [Обзор Dataproc](https://cloud.google.com/dataproc/docs/concepts/overview)
- [Создание кластера Dataproc](https://cloud.google.com/dataproc/docs/guides/create-cluster)
- [Создание Cloud Storage bucket](https://cloud.google.com/storage/docs/creating-buckets)
- [Синтаксис DataFrame PySpark](https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.html)

</div>

</WHCode>