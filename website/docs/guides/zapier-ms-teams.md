---
title: "Отправка сообщения в Microsoft Teams при завершении задания"
id: zapier-ms-teams
description: Используйте Zapier и вебхуки dbt, чтобы отправлять сообщения в Microsoft Teams после завершения выполнения задания.
hoverSnippet: Узнайте, как использовать Zapier вместе с вебхуками dbt для отправки сообщений в Microsoft Teams после завершения выполнения задания.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

## Введение

Это руководство покажет, как настроить интеграцию между заданиями <Constant name="cloud" /> и Microsoft Teams с использованием [вебхуков <Constant name="cloud" />](/docs/deploy/webhooks) и Zapier — аналогично [встроенной интеграции со Slack](/docs/deploy/job-notifications#slack-notifications).

Когда задание <Constant name="cloud" /> завершает выполнение, интеграция будет:

- получать уведомление вебхука в Zapier,
- извлекать результаты из admin API <Constant name="cloud" />, и
- публиковать сводку в канал Microsoft Teams.

![Скриншот сообщения в MS Teams, показывающего сводку выполнения <Constant name="cloud" />, которое завершилось с ошибкой](/img/guides/orchestration/webhooks/zapier-ms-teams/ms-teams-ui.png)

### Предварительные требования

Для настройки интеграции вам потребуется знакомство со следующим:

- [<Constant name="cloud" /> Webhooks](/docs/deploy/webhooks)
- Zapier

## Настройка соединения между Zapier и Microsoft Teams

* Установите [приложение Zapier в Microsoft Teams](https://appsource.microsoft.com/en-us/product/office/WA200002044) и [предоставьте Zapier доступ к вашему аккаунту](https://zapier.com/blog/how-to-automate-microsoft-teams/).

**Примечание**: Чтобы получать сообщения, добавьте приложение Zapier в канал команды во время установки.

## Создание нового Zap в Zapier
Используйте **Webhooks by Zapier** в качестве триггера и **Catch Raw Hook** в качестве события. Если вы не собираетесь [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook) (не рекомендуется!), то можете выбрать **Catch Hook** вместо этого.

Нажмите **Continue**, затем скопируйте URL вебхука.

![Скриншот интерфейса Zapier, показывающий URL вебхука, готовый к копированию](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

### 3. Настройте новый вебхук в dbt

См. [Создание подписки на вебхук](/docs/deploy/webhooks#create-a-webhook-subscription) для получения полных инструкций. Выберите либо **Run completed**, либо **Run errored**, но не оба, иначе вы получите двойные сообщения, когда выполнение завершится с ошибкой.

Запомните секретный ключ вебхука для дальнейшего использования.

После того как вы протестируете endpoint в <Constant name="cloud" />, вернитесь в Zapier и нажмите **Test Trigger** — это создаст пример тела вебхука на основе тестового события, отправленного из <Constant name="cloud" />.

Значения в примере тела жестко закодированы и не отражают ваш проект, но они дают Zapier правильно сформированный объект во время разработки.

## Хранение секретов

На следующем шаге вам понадобится **Webhook Secret Key** с предыдущего шага, а также <Constant name="cloud" /> [personal access token](/docs/dbt-cloud-apis/user-tokens) или [service account token](/docs/dbt-cloud-apis/service-tokens).

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), что предотвращает отображение ваших ключей в открытом виде в коде Zap. Вы сможете получить к ним доступ через [утилиту StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

<Snippet path="webhook_guide_zapier_secret_store" />

## Добавление действия кода
Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события.

В области **Set up action** добавьте два элемента в **Input Data**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из шага **Catch Raw Hook** выше.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Обратите внимание, что это **не** секрет <Constant name="cloud" />.

Приведённый ниже код проверит подлинность запроса, извлечёт логи запуска для завершённой задачи из Admin API, а затем сформирует сводное сообщение, в котором будут выделены все сообщения об ошибках из логов завершения выполнения, созданных <Constant name="core" />.

```python
import hashlib
import hmac
import json
import re


auth_header = input_data['auth_header']
raw_body = input_data['raw_body']

# Доступ к секретным учетным данным
secret_store = StoreClient('YOUR_SECRET_HERE')
hook_secret = secret_store.get('DBT_WEBHOOK_KEY')
api_token = secret_store.get('DBT_CLOUD_SERVICE_TOKEN')

# Проверьте, что вебхук пришёл от dbt
signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
  raise Exception("Calculated signature doesn't match contents of the Authorization header. This webhook may not have been sent from <Constant name="cloud" />.")

full_body = json.loads(raw_body)
hook_data = full_body['data'] 

# Шаги, полученные из этих команд, не будут иметь своих деталей ошибок, показанных в строке, так как они неаккуратны
commands_to_skip_logs = ['dbt source', 'dbt docs']

# При тестировании вы захотите жестко закодировать run_id и account_id в существующие ID; пример вебхука не сработает. 
run_id = hook_data['runId']
account_id = full_body['accountId']

# Получение информации о запуске из dbt Admin API
url = f'https://YOUR_ACCESS_URL/api/v2/accounts/{account_id}/runs/{run_id}/?include_related=["run_steps"]'
headers = {'Authorization': f'Token {api_token}'}
run_data_response = requests.get(url, headers=headers)
run_data_response.raise_for_status()
run_data_results = run_data_response.json()['data']

# Общая сводка выполнения
outcome_message = f"""
**\[{hook_data['runStatus']} for Run #{run_id} on Job \"{hook_data['jobName']}\"]({run_data_results['href']})**


**Environment:** {hook_data['environmentName']} | **Trigger:** {hook_data['runReason']} | **Duration:** {run_data_results['duration_humanized']}

"""

# Сводки по конкретным шагам
for step in run_data_results['run_steps']:
  if step['status_humanized'] == 'Success':
    outcome_message += f"""
✅ {step['name']} ({step['status_humanized']} in {step['duration_humanized']})
"""
  else:
    outcome_message += f"""
❌ {step['name']} ({step['status_humanized']} in {step['duration_humanized']})
"""
    show_logs = not any(cmd in step['name'] for cmd in commands_to_skip_logs)
    if show_logs:
      full_log = step['logs']
      # Удаление временной метки и любых цветовых тегов
      full_log = re.sub('\x1b?\[[0-9]+m[0-9:]*', '', full_log)
    
      summary_start = re.search('(?:Completed with \d+ error.* and \d+ warnings?:|Database Error|Compilation Error|Runtime Error)', full_log)
    
      line_items = re.findall('(^.*(?:Failure|Error) in .*\n.*\n.*)', full_log, re.MULTILINE)
    
      if len(line_items) == 0:
        relevant_log = f'```{full_log[summary_start.start() if summary_start else 0:]}```'
      else:
        relevant_log = summary_start[0]
        for item in line_items:
          relevant_log += f'\n```\n{item.strip()}\n```\n'
      outcome_message += f"""
{relevant_log}
"""

# Zapier ищет словарь `output` для использования в последующих шагах
output = {'outcome_message': outcome_message}
```

## Добавление действия Microsoft Teams

Выберите **Microsoft Teams** в качестве приложения и **Send Channel Message** в качестве действия.

В области **Set up action** выберите команду и канал. Установите **Message Text Format** в **markdown**, затем поместите **2. Outcome Message** из Run Python в Code by Zapier в поле **Message Text**.

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов с сообщением MS Teams](/img/guides/orchestration/webhooks/zapier-ms-teams/ms-teams-zap-config.png)

## Тестирование и развертывание

Поскольку вы прошли каждый шаг, вы должны были протестировать выводы, так что теперь вы можете попробовать отправить сообщение в ваш канал Teams.

Когда вы будете довольны результатом, не забудьте убедиться, что ваши `run_id` и `account_id` больше не жестко закодированы, затем опубликуйте ваш Zap.

### Другие заметки
- Если вы отправляете сообщение в чат, а не в канал команды, вам не нужно добавлять приложение Zapier в Microsoft Teams.
- Если вы отправляете сообщение в чат, а не в канал команды, обратите внимание, что markdown не поддерживается, и вам нужно будет удалить форматирование markdown.
- Если вы выбрали триггер **Catch Hook** вместо **Catch Raw Hook**, вам нужно будет передать каждое необходимое свойство из вебхука в качестве входных данных вместо выполнения `json.loads()` для необработанного тела. Вам также нужно будет удалить код проверки.

</div>
