---
title: "Отправка в Slack с контекстом ошибки при сбое задания"
id: zapier-slack
description: Используйте вебхук или сообщение Slack для запуска Zapier и отправки контекста ошибки в Slack при сбое задания.
hoverSnippet: Узнайте, как использовать вебхук или сообщение Slack для запуска Zapier и отправки контекста ошибки в Slack при сбое задания.
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом руководстве вы узнаете, как настроить интеграцию между заданиями <Constant name="dbt" /> и Slack с помощью [вебхуков <Constant name="dbt" />](/docs/deploy/webhooks) и Zapier. Она расширяет возможности [встроенной интеграции со Slack](/docs/deploy/job-notifications#slack-notifications), добавляя в ветку обсуждения подробные сообщения об ошибках моделей и тестов.

Примечание: Поскольку вебхука для отмены выполнения нет, вы можете оставить стандартную интеграцию Slack для получения этих уведомлений. Вы также можете использовать [альтернативную интеграцию](#alternately-use-a-dbt-app-slack-message-to-trigger-zapier), которая дополняет встроенную интеграцию, не заменяя её.

Когда выполнение задания <Constant name="dbt" /> завершится, интеграция выполнит следующие действия:

 - Получит уведомление вебхука в Zapier
 - Извлечёт результаты из API администрирования <Constant name="dbt" />
 - Опубликует краткую сводку о запуске в канале Slack
 - Создаст в ветке обсуждения этой публикации сообщение с причинами сбоя задания, если они есть

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/slack-thread-example.png" title="Снимок экрана с сообщением в Slack, содержащим сводку о неудачном запуске dbt" />

### Предварительные требования {#prerequisites}

Для настройки интеграции вам следует ознакомиться с:
- [Вебхуками <Constant name="dbt" />](/docs/deploy/webhooks)
- Zapier

## Создание нового Zap в Zapier {#create-a-new-zap-in-zapier}
1. Используйте **Webhooks by Zapier** в качестве триггера и **Catch Raw Hook** в качестве события. Если вы не собираетесь [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook) (не рекомендуется!), вы можете выбрать **Catch Hook** вместо этого.
2. Нажмите **Continue**, затем скопируйте URL вебхука.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png" title="Скриншот интерфейса Zapier с URL-адресом вебхука, готовым к копированию" />

## Настройка нового вебхука в dbt {#configure-a-new-webhook-in-dbt}

Полные инструкции см. в разделе [Create a webhook subscription](/docs/deploy/webhooks#create-a-webhook-subscription). В качестве события выберите **Run completed**. В качестве альтернативы можно выбрать **Run errored**, но в этом случае нужно учитывать, что необходимые метаданные [могут быть недоступны сразу](/docs/deploy/webhooks#completed-errored-event-difference).

Сохраните секретный ключ вебхука для следующего шага.

После того как вы протестируете эндпоинт в <Constant name="dbt" />, вернитесь в Zapier и нажмите **Test Trigger**. Это создаст пример тела вебхука на основе тестового события, отправленного <Constant name="dbt" />.

Поля в примере содержат фиксированные значения и не отражают данные вашего проекта. Пример показывает структуру объекта, с которым Zapier будет работать во время настройки.

## Хранение секретов {#store-secrets}
На следующем шаге вам понадобится секретный ключ вебхука (Webhook Secret Key) и [персональный токен доступа](/docs/dbt-apis/user-tokens) или [токен сервисной учётной записи](/docs/dbt-apis/service-tokens) <Constant name="dbt" />.

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps). Ключи не будут отображаться открытым текстом в коде Zap. Для доступа к ним используйте [утилиту StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

<Snippet path="webhook_guide_zapier_secret_store" />

## Добавление действия кода {#add-a-code-action}
Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события.

В разделе **Set up action** добавьте два элемента в **Input Data**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из предыдущего шага **Catch Raw Hook**.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-common/run-python.png" title="Снимок интерфейса Zapier с сопоставлениями raw_body и auth_header" />

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Помните, что это не ваш секрет <Constant name="dbt" />.

Этот пример кода проверяет подлинность запроса, получает через Admin API журналы запуска завершённого задания, а затем формирует два сообщения: сводное сообщение с результатом каждого шага и его длительностью, а также сообщение для размещения в ветке обсуждения, содержащее все сообщения об ошибках, извлечённые из журналов, которые dbt создаёт в конце вызова.

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

# Проверка того, что webhook был отправлен dbt
signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
  raise Exception("Calculated signature doesn't match contents of the Authorization header. This webhook may not have been sent from dbt.")

full_body = json.loads(raw_body)
hook_data = full_body['data'] 

# Шаги, полученные из этих команд, не будут иметь своих деталей ошибок, показанных в строке, так как они неаккуратны
commands_to_skip_logs = ['dbt source', 'dbt docs']

# При тестировании вы захотите жестко закодировать run_id и account_id в существующие ID; образец вебхука не будет работать. 
run_id = hook_data['runId']
account_id = full_body['accountId']

# Получение информации о запуске из dbt Admin API
url = f'https://YOUR_ACCESS_URL/api/v2/accounts/{account_id}/runs/{run_id}/?include_related=["run_steps"]'
headers = {'Authorization': f'Token {api_token}'}
run_data_response = requests.get(url, headers=headers)
run_data_response.raise_for_status()
run_data_results = run_data_response.json()['data']

# Общее резюме выполнения
step_summary_post = f"""
*<{run_data_results['href']}|{hook_data['runStatus']} for Run #{run_id} on Job \"{hook_data['jobName']}\">*

*Environment:* {hook_data['environmentName']} | *Trigger:* {hook_data['runReason']} | *Duration:* {run_data_results['duration_humanized']}

"""

threaded_errors_post = ""

# Резюме по конкретным шагам
for step in run_data_results['run_steps']:
  if step['status_humanized'] == 'Success':
    step_summary_post += f"""
✅ {step['name']} ({step['status_humanized']} in {step['duration_humanized']})
"""
  else:
    step_summary_post += f"""
❌ {step['name']} ({step['status_humanized']} in {step['duration_humanized']})
"""

    # Не пытайтесь извлекать информацию из шагов, у которых нет хорошо сформированных журналов
    show_logs = not any(cmd in step['name'] for cmd in commands_to_skip_logs)
    if show_logs:
      full_log = step['logs']
      # Удаление временной метки и любых цветовых тегов
      full_log = re.sub('\x1b?\[[0-9]+m[0-9:]*', '', full_log)
    
      summary_start = re.search('(?:Completed with \d+ error.* and \d+ warnings?:|Database Error|Compilation Error|Runtime Error)', full_log)
    
      line_items = re.findall('(^.*(?:Failure|Error) in .*\n.*\n.*)', full_log, re.MULTILINE)

      if not summary_start:
        continue
      
      threaded_errors_post += f"""
*{step['name']}*
"""    
      # Если нет элементов строки, сбой не связан с узлами dbt, и мы хотим получить все оставшееся сообщение. 
      # Если есть, то мы просто хотим строку резюме, а затем записать каждую ошибку узла.
      if len(line_items) == 0:
        relevant_log = f'```{full_log[summary_start.start():]}```'
      else:
        relevant_log = summary_start[0]
        for item in line_items:
          relevant_log += f'\n```\n{item.strip()}\n```\n'
      threaded_errors_post += f"""
{relevant_log}
"""

send_error_thread = len(threaded_errors_post) > 0

# Zapier ищет словарь `output` для использования в последующих шагах
output = {'step_summary_post': step_summary_post, 'send_error_thread': send_error_thread, 'threaded_errors_post': threaded_errors_post}
```

## Добавление действий Slack в Zapier {#add-slack-actions-in-zapier}
Выберите **Slack** в качестве приложения и **Send Channel Message** в качестве действия.

В разделе **Action** выберите, в какой **Channel** отправить сообщение. Установите поле **Message Text** на **2. Step Summary Post** из вывода Run Python в Code by Zapier.

Настройте другие параметры по своему усмотрению (например, **Bot Name** и **Bot Icon**).

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/parent-slack-config.png" title="Снимок экрана интерфейса Zapier, показывающий сопоставление данных из предыдущих шагов с сообщением Slack" />

Добавьте еще один шаг, **Filter**. В разделе **Filter setup and testing** установите **Field** на **2. Send Error Thread** и **condition** на **(Boolean) Is true**. Это предотвращает сбой Zap, если задание выполнено успешно и вы пытаетесь отправить пустое сообщение Slack на следующем шаге.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/filter-config.png" title="Скриншот интерфейса Zapier с правильно настроенным шагом Filter" />

Добавьте еще одно действие **Send Channel Message in Slack**. В разделе **Action** выберите тот же канал, что и в прошлый раз, но установите **Message Text** на **2. Threaded Errors Post** из того же шага Run Python. Установите значение **Thread** на **3. Message Ts**, что является временной меткой сообщения, созданного первым действием Slack. Это указывает Zapier добавить этот пост как ответ в потоке к основному сообщению, что предотвращает засорение вашего канала полным (возможно, длинным) выводом.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/thread-slack-config.png" title="Снимок экрана интерфейса Zapier, показывающий сопоставление данных из предыдущих шагов с сообщением Slack" />

## Тестирование и развертывание {#test-and-deploy}

Когда вы закончите тестирование вашего Zap, убедитесь, что ваши `run_id` и `account_id` больше не жестко закодированы в шаге кода, затем опубликуйте ваш Zap.

## В качестве альтернативы используйте сообщение Slack от приложения dbt для запуска Zapier {#alternately-use-a-dbt-app-slack-message-to-trigger-zapier}

Вместо использования вебхука в качестве триггера вы можете оставить существующее приложение <Constant name="dbt" /> установленным в вашем рабочем пространстве Slack и использовать сообщения, которые оно публикует в вашем канале, в качестве триггера. В этом случае можно пропустить проверку вебхука и загрузить только контекст из ветки обсуждения.

### 1. Создание нового Zap в Zapier {#1-create-a-new-zap-in-zapier}
Используйте **Slack** в качестве инициирующего приложения и **New Message Posted to Channel** в качестве триггера. В разделе **Trigger** выберите канал, в который отправляются ваши оповещения Slack, и установите **Trigger for Bot Messages?** на **Yes**.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/message-trigger-config.png" title="Скриншот интерфейса Zapier с правильно настроенным шагом триггера Message" />

Протестируйте ваш Zap, чтобы найти пример записи. Возможно, вам придется загрузить дополнительные образцы, пока вы не получите тот, который относится к сбойному заданию, в зависимости от того, публикуете ли вы все события заданий в Slack или нет.

### 2. Добавьте шаг Filter
Добавьте шаг **Filter** со следующими условиями: 
- **1. Text contains failed on Job**
- **1. User Is Bot Is true**
- **1. User Name Exactly matches <Constant name="dbt" />**

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/message-trigger-filter.png" title="Скриншот интерфейса Zapier с правильно настроенным шагом Filter" />

### 3. Извлечение ID выполнения {#3-extract-the-run-id}
Добавьте шаг **Format** с **Event** **Text** и действием **Extract Number**. Для **Input** выберите **1. Text**.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/extract-number.png" title="Скриншот интерфейса Zapier: шаг Transform настроен на извлечение числа из свойства Text сообщения Slack" />

Протестируйте ваш шаг и убедитесь, что ID выполнения был правильно извлечен.

### 4. Добавьте задержку
Иногда <Constant name="dbt" /> публикует сообщение о сбое запуска до того, как артефакты этого запуска становятся доступны через API. Поэтому рекомендуется добавить небольшую задержку, чтобы повысить вероятность того, что данные уже будут доступны. На некоторых тарифных планах Zapier автоматически повторяет выполнение задания, завершившегося с ошибкой 404, но период ожидания перед повторной попыткой дольше, чем обычно требуется, поэтому контекст будет отсутствовать в вашей ветке обсуждения дольше.

Обычно достаточно задержки в одну минуту.

### 5. Сохраните секреты
На следующем шаге вам понадобится либо [персональный токен доступа](/docs/dbt-apis/user-tokens), либо [токен сервисной учётной записи](/docs/dbt-apis/service-tokens) <Constant name="dbt" />.

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps). Это предотвращает отображение ваших ключей в виде открытого текста в коде Zap. Вы можете получить к ним доступ с помощью [утилиты StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

Это руководство предполагает, что имя для секретного ключа - `DBT_CLOUD_SERVICE_TOKEN`. Если вы используете другое имя, убедитесь, что вы обновили все ссылки на него в примере кода.

Это руководство использует краткосрочное действие кода для хранения секретов, но вы также можете использовать инструмент, такой как Postman, для взаимодействия с [REST API](https://store.zapier.com/) или создать отдельный Zap и вызвать [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

#### a. Создание подключения Storage by Zapier {#create-storage-connection-for-slack-trigger}
Если у вас его еще нет, перейдите на [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) и создайте новое подключение. Запомните сгенерированный UUID секрет для дальнейшего использования.

#### b. Добавьте временный шаг с кодом
Выберите **Run Python** в качестве события (Event). Выполните следующий код: 
```python 
store = StoreClient('abc123') #replace with your UUID secret
store.set('DBT_CLOUD_SERVICE_TOKEN', 'abc123') #replace with your dbt API token
```

Протестируйте шаг. Вы можете удалить это действие, когда тест пройдет успешно. Ключ останется сохраненным, пока к нему обращаются хотя бы раз в три месяца.

### 6. Добавление действия кода {#6-add-a-code-action}

Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события.

В разделе **Action** добавьте два элемента в **Input Data**: `run_id` и `account_id`. Сопоставьте их со свойством `3. Output` и заданным вручную идентификатором аккаунта <Constant name="dbt" /> соответственно.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/code-example-alternate.png" title="Снимок экрана интерфейса Zapier с сопоставлениями raw_body и auth_header" />

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-slack/code-example-alternate.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` секретом, который вы создали при настройке интеграции Storage by Zapier. Помните, что это не ваш секрет <Constant name="dbt" />.

Этот пример кода получает логи запуска завершённого задания через Admin API, а затем формирует сообщение со всеми сообщениями об ошибках, извлечёнными из логов, которые dbt создаёт в конце вызова (это сообщение будет опубликовано в ветке обсуждения).

```python
import re

# Доступ к секретным учетным данным
secret_store = StoreClient('YOUR_SECRET_HERE')
api_token = secret_store.get('DBT_CLOUD_SERVICE_TOKEN')

# Шаги, полученные из этих команд, не будут иметь своих деталей ошибок, показанных в строке, так как они неаккуратны
commands_to_skip_logs = ['dbt source', 'dbt docs']
run_id = input_data['run_id']
account_id = input_data['account_id']
url = f'https://YOUR_ACCESS_URL/api/v2/accounts/{account_id}/runs/{run_id}/?include_related=["run_steps"]'
headers = {'Authorization': f'Token {api_token}'}

response = requests.get(url, headers=headers)
response.raise_for_status()
results = response.json()['data']

threaded_errors_post = ""
for step in results['run_steps']:
  show_logs = not any(cmd in step['name'] for cmd in commands_to_skip_logs)
  if not show_logs:
    continue
  if step['status_humanized'] != 'Success':
    full_log = step['logs']
    # Удаление временной метки и любых цветовых тегов
    full_log = re.sub('\x1b?\[[0-9]+m[0-9:]*', '', full_log)
    
    summary_start = re.search('(?:Completed with \d+ error.* and \d+ warnings?:|Database Error|Compilation Error|Runtime Error)', full_log)
    
    line_items = re.findall('(^.*(?:Failure|Error) in .*\n.*\n.*)', full_log, re.MULTILINE)
    if not summary_start:
      continue
      
    threaded_errors_post += f"""
*{step['name']}*
"""    
    # Если нет элементов строки, сбой не связан с узлами dbt, и мы хотим получить все оставшееся сообщение. 
    # Если есть, то мы просто хотим строку резюме, а затем записать каждую ошибку узла.
    if len(line_items) == 0:
      relevant_log = f'```{full_log[summary_start.start():]}```'
    else:
      relevant_log = summary_start[0]
      for item in line_items:
        relevant_log += f'\n```\n{item.strip()}\n```\n'
    threaded_errors_post += f"""
{relevant_log}
"""

output = {'threaded_errors_post': threaded_errors_post}
```
### 7. Добавление действия Slack в Zapier {#7-add-slack-action-in-zapier}

Добавьте действие **Send Channel Message in Slack**. В разделе **Action** установите канал на **1. Channel Id**, который является каналом, в который было отправлено инициирующее сообщение.

Установите **Message Text** на **5. Threaded Errors Post** из шага Run Python. Установите значение **Thread** на **1. Ts**, что является временной меткой инициирующего сообщения Slack. Это указывает Zapier добавить этот пост как ответ в потоке к основному сообщению, что предотвращает засорение вашего канала полным (возможно, длинным) выводом.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-slack/thread-slack-config-alternate.png" title="Скриншот интерфейса Zapier, показывающий сопоставление данных из предыдущих шагов с сообщением в Slack" />

### 8. Тестирование и развертывание {#8-test-and-deploy}

Когда вы закончите тестирование вашего Zap, опубликуйте его.

</div>
