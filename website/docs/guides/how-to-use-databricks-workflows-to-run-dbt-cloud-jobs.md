---
title: "Использование Databricks workflows для запуска dbt jobs"
id: how-to-use-databricks-workflows-to-run-dbt-cloud-jobs
description: Узнайте, как использовать Databricks workflows для запуска dbt jobs
displayText: "Использование Databricks workflows для запуска dbt jobs"
hoverSnippet: Узнайте, как использовать Databricks workflows для запуска dbt jobs
# time_to_complete: '30 minutes' commenting out until we test
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt Core','dbt platform','Orchestration']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Введение

Использование рабочих процессов Databricks для вызова API заданий <Constant name="cloud" /> может быть полезно по нескольким причинам:

1. **Интеграция с другими ETL‑процессами** &mdash; Если вы уже запускаете другие ETL‑процессы в Databricks, вы можете использовать рабочий процесс Databricks для запуска задания <Constant name="cloud" /> после завершения этих процессов.
2. **Использование возможностей заданий <Constant name="cloud" /> &mdash;** <Constant name="cloud" /> предоставляет возможности мониторинга выполнения заданий, управления историческими логами и документацией, оптимизации времени выполнения моделей и многого [другого](/docs/deploy/deploy-jobs).
3. [**Разделение ответственности &mdash;**](https://en.wikipedia.org/wiki/Separation_of_concerns) Подробные логи заданий dbt в среде <Constant name="cloud" /> позволяют добиться большей модульности и более эффективной отладки. Это упрощает быструю изоляцию ошибок, при этом сохраняя возможность видеть общий статус выполнения в Databricks.
4. **Пользовательский запуск заданий &mdash;** Используйте рабочий процесс Databricks для запуска заданий <Constant name="cloud" /> на основе пользовательских условий или логики, которые не поддерживаются нативно механизмом планирования <Constant name="cloud" />. Это дает больше гибкости в том, когда и как запускаются ваши задания <Constant name="cloud" />.

### Предварительные требования

- Активная учетная запись [Enterprise или Enterprise+ <Constant name="cloud" />](https://www.getdbt.com/pricing/)
- У вас должна быть настроена и существующая [задача деплоя <Constant name="cloud" />](/docs/deploy/deploy-jobs)
- Активная учетная запись Databricks с доступом к рабочему пространству [Data Science and Engineering](https://docs.databricks.com/workspace-index.html) и к разделу [Manage secrets](https://docs.databricks.com/security/secrets/index.html)
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/index.html)
  - **Примечание**: Вам нужно только настроить аутентификацию. Как только вы настроите Host и Token и сможете выполнить `databricks workspace ls /Users/<someone@example.com>`, вы можете продолжить выполнение этого руководства.

## Настройка области секретов Databricks

1. Получите **[personal access token](/docs/dbt-cloud-apis/user-tokens)** или **[Service account token](/docs/dbt-cloud-apis/service-tokens#generating-service-account-tokens)** в <Constant name="cloud" />.
2. Настройте **Databricks secret scope**, который используется для безопасного хранения вашего API‑ключа <Constant name="cloud" />.

3. Введите **следующие команды** в вашем терминале:

```bash
# В этом примере мы настраиваем область секретов и ключ, называемые "dbt-cloud" и "api-key" соответственно.
databricks secrets create-scope --scope <YOUR_SECRET_SCOPE>
databricks secrets put --scope  <YOUR_SECRET_SCOPE> --key  <YOUR_SECRET_KEY> --string-value "<YOUR_DBT_CLOUD_API_KEY>"
```

4. Замените **`<YOUR_SECRET_SCOPE>`** и **`<YOUR_SECRET_KEY>`** на ваши уникальные идентификаторы. Нажмите [здесь](https://docs.databricks.com/security/secrets/index.html) для получения дополнительной информации о секретах.

5. Замените **`<YOUR_DBT_CLOUD_API_KEY>`** на фактическое значение API‑ключа, который вы скопировали из <Constant name="cloud" /> на шаге 1.

## Создание Python-ноутбука в Databricks

1. [Создайте **Python-ноутбук в Databricks**](https://docs.databricks.com/notebooks/notebooks-manage.html), который выполняет Python-скрипт, вызывающий API заданий dbt Cloud.

1. [Создайте **Databricks Python notebook**](https://docs.databricks.com/notebooks/notebooks-manage.html), который выполняет Python‑скрипт, вызывающий API заданий <Constant name="cloud" />.

2. Напишите **Python‑скрипт**, который использует библиотеку `requests` для выполнения HTTP POST‑запроса к endpoint API заданий <Constant name="cloud" /> с использованием необходимых параметров. Ниже приведён пример такого скрипта:

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
```python
# При необходимости можно передать описание, которое будет отображаться в API <Constant name="cloud" />.
# См. документацию по API для информации о дополнительных параметрах, которые можно передать,
# включая `schema_override`
```
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

* Чтобы найти эти значения, перейдите в <Constant name="cloud" />, выберите **Deploy -> Jobs**. Выберите Job, который вы хотите запустить, и скопируйте URL. Например: `https://YOUR_ACCESS_URL/deploy/000000/projects/111111/jobs/222222`
  
  Соответственно, корректный код будет выглядеть так:

Ваш URL структурирован как `https://<YOUR_BASE_URL>/deploy/<YOUR_ACCOUNT_ID>/projects/<YOUR_PROJECT_ID>/jobs/<YOUR_JOB_ID>`
    account_id = 000000
    job_id = 222222
    base_url =  "cloud.getdbt.com"

5. Запустите ноутбук. Он завершится с ошибкой, но вы должны увидеть **виджет `job_id`** в верхней части вашего ноутбука.

6. В виджете **введите ваш `job_id`** из шага 4.

6. В виджете **введите ваш `job_id`** из шага 4.

7. **Запустите Notebook ещё раз**, чтобы инициировать задание <Constant name="cloud" />. Результаты должны выглядеть примерно следующим образом:

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

Вы можете при необходимости отменить задание в <Constant name="cloud" />.

## Настройка рабочих процессов для запуска dbt jobs

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

Несколько задач Workflow можно настроить с использованием одного и того же ноутбука, если сконфигурировать параметр `job_id` так, чтобы он указывал на разные задания <Constant name="cloud" />.

Использование Databricks workflows для доступа к API заданий <Constant name="cloud" /> позволяет улучшить интеграцию процессов вашего конвейера данных и дает возможность планировать более сложные рабочие процессы.

</div>
