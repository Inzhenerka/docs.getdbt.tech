---
title: "Использование BigQuery DataFrames с dbt Python-моделями"
id: dbt-python-bigframes
description: "Используйте это руководство, чтобы настроить dbt с BigQuery DataFrames (BigFrames)."
sidebar_label: "BigQuery DataFrames и dbt python"
# time_to_complete: '30 minutes' comment out until test
icon: 'guides'
hide_table_of_contents: true
tags: ['BigQuery', 'Google', 'GCP', 'BigFrames','Quickstart']
keywords: ['BigQuery','dbt platform', 'Google']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом руководстве вы узнаете, как настроить dbt для работы с BigQuery DataFrames (BigFrames):

* Построение масштабируемых пайплайнов трансформации данных с использованием dbt и Google Cloud, на SQL и Python.
* Использование BigFrames из dbt для масштабируемых SQL-запросов BigQuery.

В дополнение к уже существующим методам выполнения Python‑моделей на базе dataproc/pyspark, теперь вы можете использовать метод отправки BigFrames для выполнения Python‑моделей с pandas‑подобными и scikit‑подобными API — без необходимости настраивать Spark или разбираться в нём.

BigQuery DataFrames — это open source Python‑пакет, который транслирует код pandas и scikit‑learn в масштабируемый SQL для BigQuery. Адаптер dbt-bigquery использует сервис BigQuery Studio Notebook Executor Service для выполнения клиентского Python‑кода.

### Предварительные требования {#prerequisites}

- Аккаунт [Google Cloud](https://cloud.google.com/free)  
- Аккаунт [<Constant name="cloud" />](https://www.getdbt.com/signup/)  
- Базовые или средние знания SQL и Python.  
- Базовое понимание принципов работы dbt. Рекомендуем курс [dbt Fundamentals](https://learn.getdbt.com).

Во время настройки вам потребуется выбрать адаптер **BigQuery (Legacy)** и указать значения для **Google Cloud Storage Bucket** и **Dataproc Region** в <Constant name="dbt_platform"/>. Подробности см. в разделе [Configure BigQuery in dbt platform](/guides/dbt-python-bigframes?step=2#configure-bigquery-in-dbt-platform).

### Что вы создадите {#what-youll-build}

В этом руководстве вы создадите решение из двух частей:

- Настройка проекта Google Cloud  
  - Одноразовая настройка проекта Google Cloud, с которым вы будете работать.
- Создание и запуск Python‑модели  
  - Создание, конфигурация и выполнение Python‑модели с использованием BigQuery DataFrames и dbt.

Вы настроите окружения, построите масштабируемые пайплайны в dbt и выполните Python‑модель.

<Lightbox src="/img/guides/gcp-guides/gcp-bigframes-architecture.png" title="Реализация метода отправки BigFrames"/>

**Рисунок 1** — Реализация метода отправки BigFrames для Python‑моделей dbt

## Настройте Google Cloud {#configure-google-cloud}

Метод отправки BigFrames в dbt поддерживает как service account, так и OAuth‑аутентификацию. В следующих шагах будет использоваться service account.

1. **Создайте новый проект Google Cloud**

   a. В новом проекте по умолчанию будет включён список API, включая BigQuery, который является обязательным.
      * [Default APIs](https://cloud.google.com/service-usage/docs/enabled-service#default)

   b. Включите BigQuery API, который автоматически активирует дополнительные API:
      * [BigQuery API's](https://cloud.google.com/bigquery/docs/enable-assets#automatic-api-enablement)

   c. Обязательные API:
   - **BigQuery API:** для всех основных операций BigQuery.
   - **Vertex AI API:** для использования сервиса выполнения Colab Enterprise.
   - **Cloud Storage API:** для хранения кода и логов.
   - **IAM API:** для управления правами доступа.
   - **Compute Engine API:** базовая зависимость для среды выполнения ноутбуков.
   - **Dataform API:** для управления кодовыми артефактами ноутбуков внутри BigQuery.

2. **Создайте service account и выдайте IAM‑права**

   Этот service account будет использоваться dbt для чтения и записи данных в BigQuery, а также для работы с BigQuery Studio Notebooks.

   Создайте service account и назначьте IAM‑права:

   ```python
   #Создать Service Account
   gcloud iam service-accounts create dbt-bigframes-sa
   #Выдать роль BigQuery User
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.user
   #Выдать роль BigQuery Data Editor. Её можно ограничить на уровне датасета
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.dataEditor
   #Выдать роль Service Account User
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/iam.serviceAccountUser
   #Выдать роль Colab Enterprise User
   gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/aiplatform.colabEnterpriseUser
   ```
   
   :::info При использовании Shared VPC
   При использовании Colab Enterprise в среде Shared VPC требуются дополнительные роли для следующих service account в хост‑проекте Shared VPC:
   - Vertex AI P4SA (`service-<PROJECT_NUMBER>@gcp-sa-aiplatform.iam.gserviceaccount.com`): этому service account всегда требуется роль Compute Network User (`roles/compute.networkUser`) в хост‑проекте Shared VPC. Замените `<PROJECT_NUMBER>` на номер проекта.
   - Colab Enterprise P6SA (`service-<PROJECT_NUMBER>@gcp-sa-vertex-nb.iam.gserviceaccount.com`): этому service account также требуется роль Compute Network User (`roles/compute.networkUser`) в хост‑проекте Shared VPC. Замените `<PROJECT_NUMBER>` на номер проекта.
   :::

4. *(Необязательно)* **Создайте тестовый датасет BigQuery**

   Если у вас ещё нет датасета BigQuery, создайте новый:

   ```python
   #Create BQ dataset 
   bq mk --location=${REGION} echo "${GOOGLE_CLOUD_PROJECT}" | tr '-' '_'_dataset
   ```

5. **Создайте бакет GCS для staging Python‑кода и хранения логов**

   Для временного хранения кода и логов создайте GCS‑bucket и назначьте необходимые права доступа:

   ```python
   #Создать бакет GCS
   gcloud storage buckets create gs://${GOOGLE_CLOUD_PROJECT}-bucket --location=${REGION}
   #Выдать Storage Admin на бакет вашему SA

   gcloud storage buckets add-iam-policy-binding gs://${GOOGLE_CLOUD_PROJECT}-bucket --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/storage.admin
   ```

### Настройте BigQuery в dbt platform {#configure-bigquery-in-the-dbt-platform}

Чтобы настроить подключение BigQuery DataFrames в <Constant name="dbt_platform"/>, выполните следующие шаги:

1. Перейдите в **Account settings** > **Connections** и нажмите **New connection**.  
2. В разделе **Type** выберите **BigQuery**.  
3. Выберите адаптер **BigQuery (Legacy)**.  
4. В разделе **Optional settings** укажите значения для следующих полей:
   - **Google Cloud Storage Bucket** (например: `dbt_name_bucket`)
   - **Dataproc Region** (например: `us-central1`)
5. Нажмите **Save**.

Это необходимо для корректного выполнения заданий BigFrames.

Дополнительную информацию см. в разделе [Connect to BigQuery](/docs/cloud/connect-data-platform/connect-bigquery).

<Lightbox src="/img/guides/gcp-guides/dbt-platform-bq.png" width="80%" title="Настройте BigQuery в dbt platform"/>

## Создайте, настройте и выполните ваши Python‑модели {#create-configure-and-execute-your-python-models}

1. В вашем dbt‑проекте создайте SQL‑модель в каталоге `models` с расширением `.sql`. Назовите файл `my_sql_model.sql`.
2. Скопируйте в файл следующий SQL‑код:

   ```sql
      select 
      1 as foo,
      2 as bar
   ```

3. Создайте новый файл модели в каталоге `models` с именем `my_first_python_model.py`.

4. В файле `my_first_python_model.py` добавьте следующий код:

   ```python
   def model(dbt, session):
      dbt.config(submission_method="bigframes")
      bdf = dbt.ref("my_sql_model") #loading from prev step
      return bdf
   ```

5. Настройте метод отправки BigFrames одним из способов:

   a. Конфигурация на уровне проекта через `dbt_project.yml`:

   ```python
   models:
   my_dbt_project:
      submission_method: bigframes
      python_models:
         +materialized: view
   ```
   или  

   b. Конфигурация непосредственно в Python‑коде через `dbt.config` в файле `my_first_python_model.py`:

   ```python
   def model(dbt, session):
      dbt.config(submission_method="bigframes")
      # rest of the python code...

   ```

6. Выполните команду `dbt run`.

7. Логи выполнения можно посмотреть в [dbt logs](/reference/events-logging). При необходимости вы также можете просмотреть код и логи (включая предыдущие запуски) на вкладке [Colab Enterprise Executions](https://console.cloud.google.com/vertex-ai/colab/execution-jobs) и в [GCS bucket](https://console.cloud.google.com/storage/browser) в консоли GCP.

8. Поздравляем! Вы только что создали свои первые две Python‑модели, которые выполняются на BigFrames!

</div>
