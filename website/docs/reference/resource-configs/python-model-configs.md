---
title: Настройки моделей Python
sidebar_label: Настройки моделей Python
description: "Справочник по параметрам, которые можно передавать в dbt.config() в моделях Python, включая параметры для платформ BigQuery, Databricks и Snowflake."
meta:
  resource_type: Models
---

import SnowflakePythonParams from '/snippets/_snowflake-python-config-params.md';

Используйте `dbt.config()` для задания настроек модели Python. На этой странице перечислены необходимые параметры. О том, как написать модель Python, читайте в разделе [Модели Python](/docs/build/python-models).

:::note Только литеральные значения
`dbt.config()` принимает только литеральные значения (строки, логические значения и числа). Для более сложных значений задавайте настройки в [YAML-файле свойств](/reference/resource-properties/config). Подробнее см. в разделе [Настройка моделей Python](/docs/build/python-models#configuring-python-models).
:::

## Общие параметры

Следующие параметры работают на всех платформах, поддерживающих модели Python.

<SimpleTable>
  
| Параметр | Тип | Описание |
| :-------- | :--- | :---------- |
| [`materialized`](/reference/resource-configs/materialized) | `<string>` | Способ, которым dbt создает модель, например `table` или `incremental`. Модели Python не поддерживают `view`. |
| [`tags`](/reference/resource-configs/tags) | `<list>` | Теги, применяемые к модели. |
| [`meta`](/reference/resource-configs/meta) | `<dictionary>` | Пользовательские метаданные. Для чтения используйте `dbt.config.meta_get()`. |
| `packages` | `<list>` | Пакеты для установки с возможностью фиксации версий, например `numpy==1.23.1`. Обязателен на некоторых платформах. См. раздел [Настройка пакетов](/docs/build/python-models#configuring-packages). |

</SimpleTable>

Чтобы прочитать значение любой настройки внутри модели, используйте `dbt.config.get()`.

## Параметры для отдельных платформ

<Tabs>

<TabItem value="snowflake" label="Snowflake">

<SnowflakePythonParams />

Дополнительные сведения и более полный список см. в разделе [Настройки Snowflake](/reference/resource-configs/snowflake-configs#additional-parameters).

</TabItem>

<TabItem value="databricks" label="Databricks">

<SimpleTable>

| Параметр | Тип | Значение по умолчанию | Описание |
| :-------- | :--- | :------ | :---------- |
| `submission_method` | `<string>` | `all_purpose_cluster` | Способ отправки задания в dbt: `all_purpose_cluster`, `job_cluster`, `serverless_cluster` или `workflow_job`. |
| `create_notebook` | `<boolean>` | `false` | При использовании `all_purpose_cluster` загружать блокнот и запускать его как задание вместо использования Command API. |
| `cluster_id` | `<string>` | `None` | Идентификатор существующего универсального кластера для выполнения. |
| `http_path` | `<string>` | `None` | Путь к существующему универсальному кластеру для выполнения. |
| `job_cluster_config` | `<dictionary>` | `{}` | Настройки нового кластера, используемого методами `job_cluster` и `workflow_job`. |
| `timeout` | `<integer>` | `0` (без ограничения времени) | Максимальное время ожидания выполнения команды или задания. |
| `packages` | `<list>` | `[]` | Пакеты для установки на кластер. |
| `index_url` | `<string>` | `None` (используется PyPI) | URL-адрес источника для установки `packages`. |
| `additional_libs` | `<list>` | `[]` | Библиотеки, подключаемые к заданию. |
| `access_control_list` | `<list>` | `[]` | Пользователи и другие субъекты, которым разрешено просматривать задание Databricks, выполняющее эту модель Python, или управлять им. |
| `notebook_access_control_list` | `<list>` | `[]` | Разрешения для блокнота Databricks, который dbt создает из этой модели Python при каждом запуске. Каждая запись предоставляет пользователю, группе или субъекту-службе уровень разрешений: `CAN_READ`, `CAN_RUN`, `CAN_EDIT` или `CAN_MANAGE`. |
| `python_job_config` | `<dictionary>` | `{}` | Дополнительные настройки задания и рабочего процесса. |

</SimpleTable>


Не все параметры работают с каждым способом отправки задания. Дополнительные сведения и более полный список см. в разделе [Настройки Databricks](/reference/resource-configs/databricks-configs#python-submission-methods).

</TabItem>

<TabItem value="bigquery" label="BigQuery">

<SimpleTable>

| Параметр | Тип | Значение по умолчанию | Описание |
| :-------- | :--- | :------ | :---------- |
| `submission_method` | `<string>` | отсутствует | Где выполняется задание: `serverless`, `bigframes` или `cluster`. |
| `dataproc_cluster_name` | `<string>` | отсутствует | Кластер Dataproc для выполнения. Обязателен для `cluster`. |
| `dataproc_region` | `<string>` | отсутствует | Регион Google Cloud, в котором включен Dataproc. |
| `gcs_bucket` | `<string>` | отсутствует | Бакет Cloud Storage для артефактов задания. |
| `compute_region` | `<string>` | отсутствует | Регион выполнения задания. |
| `notebook_template_id` | `<integer>` | отсутствует | Шаблон среды выполнения Colab Enterprise. |
| `packages` | `<list>` | отсутствует | Пакеты для установки с помощью `pip install`. Только для `bigframes`. |
| `timeout` | `<integer>` | отсутствует | Максимальное время выполнения в секундах. |
| `enable_list_inference` | `<boolean>` | `True` | Разрешить PySpark читать несколько записей за одну операцию. |
| `intermediate_format` | `<string>` | `parquet` | Формат файлов для промежуточной записи: `parquet` или `orc`. |

</SimpleTable>


Дополнительные сведения и более полный список см. в разделе [Настройки BigQuery](/reference/resource-configs/bigquery-configs#additional-parameters).

</TabItem>

</Tabs>
