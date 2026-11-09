---
title: "Использование рабочих процессов Databricks для запуска заданий dbt"
id: databricks-workflows
description: Узнайте, как использовать рабочие процессы Databricks для запуска заданий dbt
displayText: "Использование рабочих процессов Databricks для запуска заданий dbt"
hoverSnippet: Узнайте, как использовать рабочие процессы Databricks для запуска заданий dbt
# time_to_complete: '30 minutes' закомментировано до проведения тестирования
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt platform', 'Orchestration']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

Использование рабочих процессов Databricks для вызова API заданий <Constant name="dbt" /> может быть полезно по нескольким причинам:

1. **Интеграция с другими ETL-процессами** &mdash; Если вы уже выполняете другие ETL-процессы в Databricks, вы можете использовать рабочий процесс Databricks для запуска задания <Constant name="dbt" /> после завершения этих процессов.
2. **Использование возможностей заданий <Constant name="dbt" /> &mdash;** <Constant name="dbt" /> позволяет отслеживать ход выполнения заданий, управлять журналами и документацией за предыдущие запуски, оптимизировать время выполнения моделей и [многое другое](/docs/deploy/deploy-jobs).
3. [**Разделение ответственности &mdash;**](https://en.wikipedia.org/wiki/Separation_of_concerns) Подробные журналы заданий dbt в среде <Constant name="dbt" /> помогают повысить модульность и эффективность отладки. Благодаря этому становится проще быстро локализовать ошибки, сохраняя при этом возможность отслеживать общий статус в Databricks.
4. **Запуск заданий по собственным правилам &mdash;** Используйте рабочий процесс Databricks для запуска заданий <Constant name="dbt" /> на основе собственных условий или логики, которые не поддерживаются встроенной функцией планирования <Constant name="dbt" />. Это обеспечивает большую гибкость в выборе того, когда и как запускаются ваши задания <Constant name="dbt" />.

### Предварительные требования {#prerequisites}

- Активная [учетная запись <Constant name="dbt" /> с тарифным планом Enterprise или Enterprise+](https://www.getdbt.com/pricing/)
- У вас должно быть создано и настроено [задание развертывания <Constant name="dbt" />](/docs/deploy/deploy-jobs)
- Активная учетная запись Databricks с доступом к [рабочему пространству Data Science and Engineering](https://docs.databricks.com/workspace-index.html) и [управлению секретами](https://docs.databricks.com/security/secrets/index.html)
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/index.html)
  - **Примечание**: Вам нужно только настроить аутентификацию. Как только вы настроите Host и Token и сможете выполнить `databricks workspace ls /Users/<someone@example.com>`, вы можете продолжить выполнение этого руководства.

## Настройка области секретов Databricks {#set-up-a-databricks-secret-scope}

1. Получите **[персональный токен доступа](/docs/dbt-apis/user-tokens)** или **[токен сервисной учетной записи](/docs/dbt-apis/service-tokens#generate-service-account-tokens)** в <Constant name="dbt" />
2. Настройте **область секретов Databricks**, которая используется для безопасного хранения вашего ключа API <Constant name="dbt" />.

3. Введите **следующие команды** в вашем терминале:

```bash
# В этом примере мы настраиваем область секретов и ключ, называемые "dbt-cloud" и "api-key" соответственно.
databricks secrets create-scope --scope <YOUR_SECRET_SCOPE>
databricks secrets put --scope  <YOUR_SECRET_SCOPE> --key  <YOUR_SECRET_KEY> --string-value "<YOUR_DBT_CLOUD_API_KEY>"
```

4. Замените **`<YOUR_SECRET_SCOPE>`** и **`<YOUR_SECRET_KEY>`** на ваши уникальные идентификаторы. Нажмите [здесь](https://docs.databricks.com/security/secrets/index.html) для получения дополнительной информации о секретах.

5. Замените **`<YOUR_DBT_CLOUD_API_KEY>`** фактическим значением ключа API, скопированным из <Constant name="dbt" /> на шаге 1.

## Создание Python-ноутбука в Databricks {#create-a-databricks-python-notebook}

1. [Создайте **Python-ноутбук в Databricks**](https://docs.databricks.com/notebooks/notebooks-manage.html), который выполняет Python-скрипт, вызывающий API заданий dbt Cloud.

1. [Создайте **Python-ноутбук в Databricks**](https://docs.databricks.com/notebooks/notebooks-manage.html), который выполняет Python-скрипт, вызывающий API заданий <Constant name="dbt" />. 

2. Напишите **Python-скрипт**, который использует библиотеку `requests` для отправки HTTP-запроса POST к конечной точке API заданий <Constant name="dbt" /> с необходимыми параметрами. Вот пример скрипта:

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

# Это задокументировано в документации API dbt
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
# При необходимости передайте описание, которое можно просмотреть через API dbt.
            # Дополнительные параметры, которые можно передать, описаны в документации API,
            # в том числе `schema_override`
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

4. Замените **`<YOUR_BASE_URL>`** и **`<YOUR_ACCOUNT_ID>`** соответствующими значениями для вашей среды и [URL доступа](/docs/platform/about-platform/access-regions-ip-addresses) для вашего региона и тарифного плана.

    * Чтобы найти эти значения, перейдите в <Constant name="dbt" /> и выберите **Deploy -> Jobs**. Выберите задание, которое хотите запустить, и скопируйте URL. Например: `https://YOUR_ACCESS_URL/deploy/000000/projects/111111/jobs/222222`
    Таким образом, корректный код будет следующим:

Ваш URL имеет вид `https://<YOUR_BASE_URL>/deploy/<YOUR_ACCOUNT_ID>/projects/<YOUR_PROJECT_ID>/jobs/<YOUR_JOB_ID>`
    account_id = 000000
    job_id = 222222
    base_url = "cloud.getdbt.com"

5. Запустите ноутбук. Он завершится с ошибкой, но вы должны увидеть **виджет `job_id`** в верхней части вашего ноутбука.

6. В виджете **введите ваш `job_id`** из шага 4.

6. В виджете **введите свой `job_id`** из шага 4.

7. **Запустите Notebook повторно**, чтобы запустить задание <Constant name="dbt" />. Результаты должны выглядеть примерно так:

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

При необходимости вы можете отменить задание в <Constant name="dbt" />.

## Настройка рабочих процессов для запуска dbt jobs {#configure-the-workflows-to-run-the-dbt-jobs}

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

Несколько задач Workflow можно настроить на использование одного и того же ноутбука, указав в параметре `job_id` разные задания <Constant name="dbt" />. 

Использование рабочих процессов Databricks для доступа к API заданий <Constant name="dbt" /> позволяет улучшить интеграцию процессов вашего конвейера данных и настроить запуск более сложных рабочих процессов по расписанию.

</div>
