---
title: "Как обучить модель линейной регрессии с помощью dbt и BigFrames"
description: "Как построить масштабируемую модель линейной регрессии, объединив модульную оркестрацию dbt с выполнением Python «внутри базы» через BigFrames в BigQuery."
slug: train-linear-dbt-bigframes
authors: [jialuo_chen]

tags: [analytics craft]
hide_table_of_contents: false

date: 2025-07-11
is_featured: true
---

## Введение в dbt и BigFrames {#introduction-to-dbt-and-bigframes}

**dbt**: Фреймворк для трансформации данных в современных аналитических хранилищах с использованием модульного SQL или Python. dbt позволяет аналитическим командам совместно и эффективно разрабатывать аналитический код, применяя лучшие практики программной инженерии — такие как контроль версий, модульность, переносимость, CI/CD, тестирование и документация. Подробнее см. [What is dbt?](/docs/introduction#dbt)

**BigQuery DataFrames (BigFrames)**: Open-source Python-библиотека от Google. BigFrames масштабирует обработку данных на Python, транслируя распространённые API из мира data science (pandas и scikit-learn) в SQL-запросы BigQuery.  

Подробнее можно узнать в [официальном руководстве BigFrames](https://cloud.google.com/bigquery/docs/bigquery-dataframes-introduction) и в [публичном репозитории BigFrames на GitHub](https://github.com/googleapis/python-bigquery-dataframes).

Комбинируя dbt и BigFrames через адаптер `dbt-bigquery` (далее — _«dbt-BigFrames»_), вы получаете:

- Модульное моделирование на SQL и Python в dbt, управление зависимостями с помощью `dbt.ref()`, конфигурацию окружений и тестирование данных. При использовании облачной платформы dbt также доступны планирование и мониторинг джобов.
- Возможность BigFrames выполнять сложные Python-трансформации (включая машинное обучение) непосредственно в BigQuery.

`dbt-BigFrames` использует **службу выполнения ноутбуков Colab Enterprise** в проекте GCP для запуска Python-моделей. Эти ноутбуки исполняют код BigFrames, который затем переводится в SQL для BigQuery.

<!-- truncate -->

> Дополнительные материалы: [Use BigQuery DataFrames in dbt](https://cloud.google.com/bigquery/docs/dataframes-dbt) или [Using BigQuery DataFrames with dbt Python models](/guides/dbt-python-bigframes?step=1).

Чтобы показать практическую ценность сочетания dbt и BigFrames, далее мы рассмотрим, как эта интеграция упрощает и масштабирует типичную задачу машинного обучения — обучение модели линейной регрессии на больших наборах данных.

## Возможности dbt-BigFrames для линейной регрессии в больших масштабах {#the-power-of-dbt-bigframes-for-large-scale-linear-regression}

Линейная регрессия — базовый инструмент предиктивной аналитики, применяемый в таких задачах, как:

- Прогнозирование продаж  
- Финансовое моделирование  
- Планирование спроса  
- Оценка недвижимости

Во многих подобных сценариях требуется обработка объёмов данных, которые не помещаются в память при использовании классического Python. BigFrames решает эту проблему, а в сочетании с dbt даёт структурированный, поддерживаемый и готовый к продакшену подход к обучению моделей и генерации пакетных предсказаний на больших данных.

## «dbt-BigFrames» и ML: практический пример {#dbt-bigframes-with-ml-a-practical-example}

Ниже мы шаг за шагом разберём процесс обучения модели линейной регрессии с использованием **Python-модели dbt на базе BigFrames**, уделяя внимание структуре и оркестрации, которые предоставляет dbt.

В качестве источника данных используется датасет `epa_historical_air_quality` из BigQuery Public Data (предоставлен Агентством по охране окружающей среды США).

### Постановка задачи {#problem-statement}

Разработать модель машинного обучения для прогнозирования уровня озона в атмосфере на основе исторических данных о качестве воздуха и показаний экологических сенсоров, чтобы повысить точность мониторинга и прогнозирования загрязнения воздуха.

**Ключевые этапы:**

1. **Подготовка данных**: Преобразование сырых исходных таблиц в датасет, готовый для аналитики.
2. **Анализ и машинное обучение**: Обучение модели линейной регрессии на очищенных данных.

## Настройка dbt-проекта для BigFrames {#setting-up-your-dbt-project-for-bigframes}

### Предварительные требования {#prerequisites}

- Аккаунт Google Cloud  
- Установленный dbt (платформа dbt или dbt Core)  
- Базовые или средние знания SQL и Python  
- Знакомство с dbt на уровне [Beginner dbt guides](/guides?level=Beginner)

### Пример `profiles.yml` для BigFrames {#sample-profilesyml-for-bigframes}

```yaml
my_epa_project:
  outputs:
    dev:
      compute_region: us-central1
      dataset: your_bq_dataset
      gcs_bucket: your_gcs_bucket
      location: US
      method: oauth
      priority: interactive
      project: your_gcp_project
      threads: 1
      type: bigquery
  target: dev
```

### Пример `dbt_project.yml` {#sample-dbt_projectyml}

```yaml
name: 'my_epa_project'
version: '1.0.0'
config-version: 2

models:
  my_epa_project:
    submission_method: bigframes
    notebook_template_id: 701881164074529xxxx  # Optional
    timeout: 6000
    example:
      +materialized: view
```

## Python-модели dbt для линейной регрессии {#the-dbt-python-models-for-linear-regression}

В проекте используются **две модульные Python-модели dbt**:

1. `prepare_table.py` — загрузка и подготовка данных  
2. `prediction.py` — обучение модели и генерация предсказаний

### Часть 1: Подготовка таблицы (`prepare_table.py`) {#part-1-preparing-the-table-prepare_tablepy}

```python
def model(dbt, session):
    dbt.config(submission_method="bigframes", timeout=6000)

    dataset = "bigquery-public-data.epa_historical_air_quality"
    index_columns = ["state_name", "county_name", "site_num", "date_local", "time_local"]
    param_column = "parameter_name"
    value_column = "sample_measurement"
    params_dfs = []

    table_param_dict = {
        "co_hourly_summary": "co",
        "no2_hourly_summary": "no2",
        "o3_hourly_summary": "o3",
        "pressure_hourly_summary": "pressure",
        "so2_hourly_summary": "so2",
        "temperature_hourly_summary": "temperature",
    }

    for table, param in table_param_dict.items():
        param_df = bpd.read_gbq(f"{dataset}.{table}", columns=index_columns + [value_column])
        param_df = param_df.sort_values(index_columns).drop_duplicates(index_columns).set_index(index_columns).rename(columns={value_column: param})
        params_dfs.append(param_df)

    wind_table = f"{dataset}.wind_hourly_summary"
    wind_speed_df = bpd.read_gbq(
        wind_table,
        columns=index_columns + [value_column],
        filters=[(param_column, "==", "Wind Speed - Resultant")]
    )
    wind_speed_df = wind_speed_df.sort_values(index_columns).drop_duplicates(index_columns).set_index(index_columns).rename(columns={value_column: "wind_speed"})
    params_dfs.append(wind_speed_df)

    df = bpd.concat(params_dfs, axis=1, join="inner").cache()
    return df.reset_index()
```

### Часть 2: Обучение модели и предсказания (`prediction.py`) {#part-2-training-the-model-and-making-predictions-predictionpy}

```python
def model(dbt, session):
    dbt.config(submission_method="bigframes", timeout=6000)

    df = dbt.ref("prepare_table")

    train_data_filter = (df.date_local.dt.year < 2017)
    test_data_filter = (df.date_local.dt.year >= 2017) & (df.date_local.dt.year < 2020)
    predict_data_filter = (df.date_local.dt.year >= 2020)

    index_columns = ["state_name", "county_name", "site_num", "date_local", "time_local"]
    df_train = df[train_data_filter].set_index(index_columns)
    df_test = df[test_data_filter].set_index(index_columns)
    df_predict = df[predict_data_filter].set_index(index_columns)

    X_train, y_train = df_train.drop(columns="o3"), df_train["o3"]
    X_test, y_test = df_test.drop(columns="o3"), df_test["o3"]
    X_predict = df_predict.drop(columns="o3")

    from bigframes.ml.linear_model import LinearRegression
    model = LinearRegression()
    model.fit(X_train, y_train)
    df_pred = model.predict(X_predict)

    return df_pred
```

## Запуск ML-пайплайна в dbt {#running-your-dbt-ml-pipeline}

```bash
# Run all models
dbt run

# Or run just your new models
dbt run --select prepare_table prediction
```

## Ключевые преимущества dbt и BigFrames для ML {#key-advantages-of-dbt-and-bigframes-for-ml}

- **Масштабируемость и производительность**: Работа с большими датасетами в BigQuery через BigFrames  
- **Упрощённый workflow**: Использование знакомых API, таких как `pandas` и `scikit-learn`  
- **Оркестрация dbt**:
  - Управление зависимостями с помощью `dbt.ref()` и `dbt.source()`
  - Плановое переобучение моделей через `dbt run`
  - Тестирование, документация и воспроизводимость

## Заключение и дальнейшие шаги {#conclusion-and-next-steps}

Интегрируя **BigFrames** в ваши **dbt-процессы**, вы можете создавать масштабируемые, поддерживаемые и готовые к продакшену ML-пайплайны. Хотя в примере использовалась линейная регрессия, те же подходы применимы и к другим ML-сценариям с использованием `bigframes.ml`.

## Обратная связь и поддержка {#feedback-and-support}

- 📚 [dbt Support](/docs/dbt-support)  
- 📨 Обратная связь по BigFrames: [bigframes-feedback@google.com](mailto:bigframes-feedback@google.com)
- 🛠 [Создать issue на GitHub](https://github.com/googleapis/python-bigquery-dataframes)  
- 📬 [Подписаться на обновления BigFrames](https://docs.google.com/forms/d/10EnDyYdYUW9HvelHYuBRC8L3GdGVl3rX0aroinbRZyc/viewform?edit_requested=true)
