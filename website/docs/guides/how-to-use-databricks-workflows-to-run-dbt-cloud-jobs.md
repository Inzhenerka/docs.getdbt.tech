---
title: "Использование рабочих процессов Databricks для запуска заданий dbt Cloud"
id: how-to-use-databricks-workflows-to-run-dbt-cloud-jobs
description: Узнайте, как использовать рабочие процессы Databricks для запуска заданий dbt Cloud
displayText: "Использование рабочих процессов Databricks для запуска заданий dbt Cloud"
hoverSnippet: Узнайте, как использовать рабочие процессы Databricks для запуска заданий dbt Cloud
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt Core','dbt Cloud','Orchestration']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Использование рабочих процессов Databricks для вызова API заданий dbt Cloud может быть полезным по нескольким причинам:

1. **Интеграция с другими ETL-процессами** &mdash; Если вы уже запускаете другие ETL-процессы в Databricks, вы можете использовать рабочий процесс Databricks для запуска задания dbt Cloud после завершения этих процессов.
2. **Использование функций заданий dbt Cloud** &mdash; dbt Cloud предоставляет возможность мониторинга прогресса заданий, управления историческими логами и документацией, оптимизации времени выполнения моделей и многого [другого](/docs/deploy/deploy-jobs).
3. [**Разделение ответственности** &mdash;](https://en.wikipedia.org/wiki/Separation_of_concerns) Подробные логи для заданий dbt в среде dbt Cloud могут привести к большей модульности и эффективной отладке. Это упрощает изоляцию ошибок, сохраняя возможность видеть общий статус в Databricks.
4. **Пользовательская активация заданий** &mdash; Используйте рабочий процесс Databricks для запуска заданий dbt Cloud на основе пользовательских условий или логики, которые не поддерживаются нативно функцией планирования dbt Cloud. Это может дать вам больше гибкости в отношении времени и способа запуска ваших заданий dbt Cloud.

### Предварительные требования

- Активная [учетная запись Teams или Enterprise dbt Cloud](https://www.getdbt.com/pricing/)
- У вас должно быть настроенное и существующее [задание развертывания dbt Cloud](/docs/deploy/deploy-jobs)
- Активная учетная запись Databricks с доступом к [рабочему пространству Data Science и Engineering](https://docs.databricks.com/workspace-index.html) и [управлению секретами](https://docs.databricks.com/security/secrets/index.html)
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/index.html)
  - **Примечание**: Вам нужно только настроить аутентификацию. Как только вы настроите Host и Token и сможете выполнить `databricks workspace ls /Users/<someone@example.com>`, вы можете продолжить выполнение этого руководства.

## Настройка области секретов Databricks

1. Получите **[персональный токен доступа](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens)** или **[токен учетной записи службы](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens#generating-service-account-tokens)** из dbt Cloud.
2. Настройте **область секретов Databricks**, которая используется для безопасного хранения вашего API-ключа dbt Cloud.

3. Введите **следующие команды** в вашем терминале:

```bash
# В этом примере мы настраиваем область секретов и ключ, называемые "dbt-cloud" и "api-key" соответственно.
databricks secrets create-scope --scope <YOUR_SECRET_SCOPE>
databricks secrets put --scope  <YOUR_SECRET_SCOPE> --key  <YOUR_SECRET_KEY> --string-value "<YOUR_DBT_CLOUD_API_KEY>"
```

4. Замените **`<YOUR_SECRET_SCOPE>`** и **`<YOUR_SECRET_KEY>`** на ваши уникальные идентификаторы. Нажмите [здесь](https://docs.databricks.com/security/secrets/index.html) для получения дополнительной информации о секретах.

5. Замените **`<YOUR_DBT_CLOUD_API_KEY>`** на фактическое значение API-ключа, который вы скопировали из dbt Cloud на шаге 1.

## Создание Python-ноутбука в Databricks

1. [Создайте **Python-ноутбук в Databricks**](https://docs.databricks.com/notebooks/notebooks-manage.html), который выполняет Python-скрипт, вызывающий API заданий dbt Cloud.

2. Напишите **Python-скрипт**, который использует библиотеку `requests` для выполнения HTTP POST-запроса к конечной точке API заданий dbt Cloud с использованием необходимых параметров. Вот пример скрипта:

```python
import enum
import os
import time
import json
import requests
from getpass import getpass
     
dbutils.widgets.text("job_id", "Enter the Job ID")
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
            # Опционально передайте описание, которое можно просмотреть в API dbt Cloud.
            # См. документацию API для дополнительных параметров, которые можно передать,
            # включая `schema_override`
            'cause': f"Triggered by Databricks Workflows.",
        }
    )

    try:
        res.raise_for_status()
    except:
        print(f"API token (last four): ...{api_key[-4:]}")
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
            raise Exception("Failure!")

if __name__ == '__main__':
    run()
```

3. Замените **`<YOUR_SECRET_SCOPE>`** и **`<YOUR_SECRET_KEY>`** на значения, которые вы использовали [ранее](#set-up-a-databricks-secret-scope).

4. Замените **`<YOUR_BASE_URL>`** и **`<YOUR_ACCOUNT_ID>`** на правильные значения вашей среды и [URL доступа](/docs/cloud/about-cloud/access-regions-ip-addresses) для вашего региона и плана.

    * Чтобы найти эти значения, перейдите в **dbt Cloud**, выберите **Deploy -> Jobs**. Выберите задание, которое вы хотите запустить, и скопируйте URL. Например: `https://YOUR_ACCESS_URL/deploy/000000/projects/111111/jobs/222222`
    и, следовательно, корректный код будет:

Ваш URL структурирован как `https://<YOUR_BASE_URL>/deploy/<YOUR_ACCOUNT_ID>/projects/<YOUR_PROJECT_ID>/jobs/<YOUR_JOB_ID>`
    account_id = 000000
    job_id = 222222
    base_url =  "cloud.getdbt.com"

5. Запустите ноутбук. Он завершится с ошибкой, но вы должны увидеть **виджет `job_id`** в верхней части вашего ноутбука.

6. В виджете **введите ваш `job_id`** из шага 4.

7. **Запустите ноутбук снова**, чтобы активировать задание dbt Cloud. Ваши результаты должны выглядеть примерно так:

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

Вы можете отменить задание из dbt Cloud, если это необходимо.

## Настройка рабочих процессов для запуска заданий dbt Cloud

Вы можете настроить рабочие процессы непосредственно из ноутбука ИЛИ добавив этот ноутбук в один из ваших существующих рабочих процессов:

<Tabs>

<TabItem value="createexisting" label="Создать рабочий процесс из существующего ноутбука">

1. Нажмите **Schedule** в правой верхней части страницы
2. Нажмите **Add a schedule**
3. Настройте имя задания, расписание, кластер
4. Добавьте новый параметр с именем: `job_id` и заполните ваш ID задания. Обратитесь к [шагу 4 в предыдущем разделе](#create-a-databricks-python-notebook), чтобы найти ваш ID задания.
5. Нажмите **Create**
6. Нажмите **Run Now**, чтобы протестировать задание

</TabItem>

<TabItem value="addexisting" label="Добавить ноутбук в существующий рабочий процесс">

1. Откройте существующий **Workflow**
2. Нажмите **Tasks**
3. Нажмите **значок “+”**, чтобы добавить новую задачу
4. Введите **следующее**:

| Поле | Значение |
|---|---|
| Имя задачи | `<unique_task_name>` |
| Тип | Notebook |
| Источник | Workspace |
| Путь | `</path/to/notebook>` |
| Кластер | `<your_compute_cluster>` |
| Параметры | `job_id`: `<your_dbt_job_id>` |

5. Выберите **Save Task**
6. Нажмите **Run Now**, чтобы протестировать рабочий процесс

</TabItem>
</Tabs>

Несколько задач Workflow могут быть настроены с использованием одного и того же ноутбука путем настройки параметра `job_id` для указания на разные задания dbt Cloud.

Использование рабочих процессов Databricks для доступа к API заданий dbt Cloud может улучшить интеграцию ваших процессов обработки данных и позволить планировать более сложные рабочие процессы.

</div>