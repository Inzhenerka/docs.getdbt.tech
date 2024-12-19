---
title: "Использование рабочих процессов Databricks для запуска задач dbt Cloud"
id: how-to-use-databricks-workflows-to-run-dbt-cloud-jobs
description: Узнайте, как использовать рабочие процессы Databricks для запуска задач dbt Cloud
displayText: "Использование рабочих процессов Databricks для запуска задач dbt Cloud"
hoverSnippet: Узнайте, как использовать рабочие процессы Databricks для запуска задач dbt Cloud
# time_to_complete: '30 минут' закомментировано до тестирования
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt Core','dbt Cloud','Orchestration']
level: 'Средний'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Использование рабочих процессов Databricks для вызова API задач dbt Cloud может быть полезным по нескольким причинам:

1. **Интеграция с другими процессами ETL** &mdash; Если вы уже запускаете другие процессы ETL в Databricks, вы можете использовать рабочий процесс Databricks для запуска задачи dbt Cloud после завершения этих процессов.
2. **Использование функций задач dbt Cloud &mdash;** dbt Cloud предоставляет возможность отслеживать прогресс задач, управлять историческими журналами и документацией, оптимизировать время выполнения моделей и многое [другое](/docs/deploy/deploy-jobs).
3. [**Разделение обязанностей &mdash;**](https://en.wikipedia.org/wiki/Separation_of_concerns) Подробные журналы для задач dbt в среде dbt Cloud могут привести к большей модульности и эффективной отладке. Это упрощает быстрое изолирование ошибок, при этом оставаясь в курсе общего статуса в Databricks.
4. **Настройка запуска задач &mdash;** Используйте рабочий процесс Databricks для запуска задач dbt Cloud на основе пользовательских условий или логики, которые не поддерживаются нативно функцией планирования dbt Cloud. Это может дать вам больше гибкости в том, когда и как выполняются ваши задачи dbt Cloud.

### Предварительные требования

- Активная [учетная запись dbt Cloud Teams или Enterprise](https://www.getdbt.com/pricing/)
- У вас должна быть настроенная и существующая [задача развертывания dbt Cloud](/docs/deploy/deploy-jobs)
- Активная учетная запись Databricks с доступом к [рабочему пространству Data Science and Engineering](https://docs.databricks.com/workspace-index.html) и [Управление секретами](https://docs.databricks.com/security/secrets/index.html)
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/index.html)
  - **Примечание**: Вам нужно только настроить аутентификацию. После того как вы настроите свой Host и Token и сможете выполнить `databricks workspace ls /Users/<someone@example.com>`, вы можете продолжить с остальной частью этого руководства.

## Настройка области секретов Databricks

1. Получите **[личный токен доступа](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens)** или **[токен сервисной учетной записи](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens#generating-service-account-tokens)** из dbt Cloud.
2. Настройте **область секретов Databricks**, которая используется для безопасного хранения вашего API-ключа dbt Cloud.

3. Введите **следующие команды** в вашем терминале:

```bash
# В этом примере мы настраиваем область секретов и ключ, названные "dbt-cloud" и "api-key" соответственно.
databricks secrets create-scope --scope <YOUR_SECRET_SCOPE>
databricks secrets put --scope  <YOUR_SECRET_SCOPE> --key  <YOUR_SECRET_KEY> --string-value "<YOUR_DBT_CLOUD_API_KEY>"
```

4. Замените **`<YOUR_SECRET_SCOPE>`** и **`<YOUR_SECRET_KEY>`** на ваши уникальные идентификаторы. Нажмите [здесь](https://docs.databricks.com/security/secrets/index.html) для получения дополнительной информации о секретах.

5. Замените **`<YOUR_DBT_CLOUD_API_KEY>`** на фактическое значение API-ключа, которое вы скопировали из dbt Cloud на шаге 1.


## Создание Python-ноутбука Databricks

1. [Создайте **Python-ноутбук Databricks**](https://docs.databricks.com/notebooks/notebooks-manage.html), который выполняет Python-скрипт, вызывающий API задач dbt Cloud.

2. Напишите **Python-скрипт**, который использует библиотеку `requests` для выполнения HTTP POST-запроса к конечной точке API задач dbt Cloud с использованием необходимых параметров. Вот пример скрипта:

```python
import enum
import os
import time
import json
import requests
from getpass import getpass
     
dbutils.widgets.text("job_id", "Введите ID задачи")
job_id = dbutils.widgets.get("job_id")

account_id = <YOUR_ACCOUNT_ID>
base_url =  "<YOUR_BASE_URL>"
api_key =  dbutils.secrets.get(scope = "<YOUR_SECRET_SCOPE>", key = "<YOUR_SECRET_KEY>")

# Эти значения задокументированы в документации API dbt Cloud
class DbtJobRunStatus(enum.IntEnum):
    QUEUED = 1
    STARTING = 2
    RUNNING = 3
    SUCCESS = 10
    ERROR = 20
    CANCELLED = 30

def _trigger_job() -> int:
    res = requests.post(
        url=f"https://{base_url}/api/v2/accounts/{account_id}/jobs/{job_id}/run/",
        headers={'Authorization': f"Token {api_key}"},
        json={
            # При желании передайте описание, которое можно будет просмотреть в API dbt Cloud.
            # Смотрите документацию API для дополнительных параметров, которые можно передать,
            # включая `schema_override` 
            'cause': f"Запущено рабочими процессами Databricks.",
        }
    )

    try:
        res.raise_for_status()
    except:
        print(f"API токен (последние четыре): ...{api_key[-4:]}")
        raise

    response_payload = res.json()
    return response_payload['data']['id']

def _get_job_run_status(job_run_id):
    res = requests.get(
        url=f"https://{base_url}/api/v2/accounts/{account_id}/runs/{job_run_id}/",
        headers={'Authorization': f"Token {api_key}"},
    )

    res.raise_for_status()
    response_payload = res.json()
    return response_payload['data']['status']

def run():
    job_run_id = _trigger_job()
    print(f"job_run_id = {job_run_id}")   
    while True:
        time.sleep(5)
        status = _get_job_run_status(job_run_id)
        print(DbtJobRunStatus(status))
        if status == DbtJobRunStatus.SUCCESS:
            break
        elif status == DbtJobRunStatus.ERROR or status == DbtJobRunStatus.CANCELLED:
            raise Exception("Ошибка!")

if __name__ == '__main__':
    run()
```

3. Замените **`<YOUR_SECRET_SCOPE>`** и **`<YOUR_SECRET_KEY>`** на значения, которые вы использовали [ранее](#настройка-области-секретов-databricks).

4. Замените **`<YOUR_BASE_URL>`** и **`<YOUR_ACCOUNT_ID>`** на правильные значения вашей среды и [URL-адрес доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.

    * Чтобы найти эти значения, перейдите в **dbt Cloud**, выберите **Deploy -> Jobs**. Выберите задачу, которую хотите запустить, и скопируйте URL. Например: `https://YOUR_ACCESS_URL/deploy/000000/projects/111111/jobs/222222`
    и, следовательно, корректный код будет:

Ваш URL имеет структуру `https://<YOUR_BASE_URL>/deploy/<YOUR_ACCOUNT_ID>/projects/<YOUR_PROJECT_ID>/jobs/<YOUR_JOB_ID>`
    account_id = 000000
    job_id = 222222
    base_url =  "cloud.getdbt.com"


5. Запустите ноутбук. Он завершится с ошибкой, но вы должны увидеть **виджет `job_id`** в верхней части вашего ноутбука.

6. В виджете **введите ваш `job_id`** из шага 4.

7. **Запустите ноутбук снова**, чтобы запустить задачу dbt Cloud. Ваши результаты должны выглядеть примерно так:

```bash
job_run_id = 123456
DbtJobRunStatus.QUEUED
DbtJobRunStatus.QUEUED
DbtJobRunStatus.QUEUED
DbtJobRunStatus.STARTING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.SUCCESS
```

Вы можете отменить задачу из dbt Cloud, если это необходимо.

## Настройка рабочих процессов для запуска задач dbt Cloud

Вы можете настроить рабочие процессы непосредственно из ноутбука ИЛИ добавив этот ноутбук в один из ваших существующих рабочих процессов:

<Tabs>

<TabItem value="createexisting" label="Создать рабочий процесс из существующего ноутбука">

1. Нажмите **Schedule** в верхнем правом углу страницы
2. Нажмите **Add a schedule**
3. Настройте имя задачи, расписание, кластер
4. Добавьте новый параметр с именем: `job_id` и заполните его вашим ID задачи. Обратитесь к [шагу 4 в предыдущем разделе](#создание-python-ноутбука-databricks), чтобы найти ваш ID задачи.
5. Нажмите **Create**
6. Нажмите **Run Now**, чтобы протестировать задачу

</TabItem>

<TabItem value="addexisting" label="Добавить ноутбук в существующий рабочий процесс">

1. Откройте существующий **рабочий процесс**
2. Нажмите **Tasks**
3. Нажмите **иконку “+”**, чтобы добавить новую задачу
4. Введите **следующее**:

| Поле | Значение |
|---|---|
| Имя задачи | `<unique_task_name>` |
| Тип | Ноутбук |
| Источник | Рабочее пространство |
| Путь | `</path/to/notebook>` |
| Кластер | `<your_compute_cluster>` |
| Параметры | `job_id`: `<your_dbt_job_id>` |

5. Выберите **Сохранить задачу**
6. Нажмите **Run Now**, чтобы протестировать рабочий процесс

</TabItem>
</Tabs>

Несколько задач рабочего процесса могут быть настроены с использованием одного и того же ноутбука, настраивая параметр `job_id` для указания на разные задачи dbt Cloud.

Использование рабочих процессов Databricks для доступа к API задач dbt Cloud может улучшить интеграцию ваших процессов обработки данных и позволить планировать более сложные рабочие процессы.

</div>