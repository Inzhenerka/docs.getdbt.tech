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

## Введение

Это руководство покажет, как настроить интеграцию между заданиями <Constant name="cloud" /> и Slack с использованием [вебхуков <Constant name="cloud" />](/docs/deploy/webhooks) и Zapier. Оно дополняет нативную [интеграцию со Slack](/docs/deploy/job-notifications#slack-notifications), добавляя в тред подробные сообщения об ошибках для моделей и тестов.

Примечание: Поскольку вебхука для отмены выполнения нет, вы можете оставить стандартную интеграцию Slack для получения этих уведомлений. Вы также можете использовать [альтернативную интеграцию](#alternate-approach), которая дополняет встроенную интеграцию, не заменяя её.

Когда выполнение задания <Constant name="cloud" /> завершается, интеграция выполняет следующие действия:

 - Получает уведомление вебхука в Zapier
 - Извлекает результаты из административного API <Constant name="cloud" />
 - Публикует краткое резюме выполнения в канал Slack
 - Создаёт тред, прикреплённый к этому сообщению, который содержит причины, по которым задание завершилось с ошибкой

![Скриншот сообщения в Slack с кратким резюме выполнения задания <Constant name="cloud" />, завершившегося с ошибкой](/img/guides/orchestration/webhooks/zapier-slack/slack-thread-example.png)

### Предварительные требования

Чтобы настроить интеграцию, у вас должен быть опыт работы с:
- [<Constant name="cloud" /> webhooks](/docs/deploy/webhooks)
- Zapier

## Создание нового Zap в Zapier
1. Используйте **Webhooks by Zapier** в качестве триггера и **Catch Raw Hook** в качестве события. Если вы не собираетесь [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook) (не рекомендуется!), вы можете выбрать **Catch Hook** вместо этого.
2. Нажмите **Continue**, затем скопируйте URL вебхука.

![Скриншот интерфейса Zapier, показывающий URL вебхука, готовый к копированию](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

## Настройка нового вебхука в dbt

Полные инструкции см. в разделе [Create a webhook subscription](/docs/deploy/webhooks#create-a-webhook-subscription). В качестве события выберите **Run completed**. В качестве альтернативы можно выбрать **Run errored**, но в этом случае нужно учитывать, что необходимые метаданные [могут быть недоступны сразу](/docs/deploy/webhooks#completed-errored-event-difference).

Запомните секретный ключ вебхука для дальнейшего использования.

После того как вы протестировали endpoint в <Constant name="cloud" />, вернитесь в Zapier и нажмите **Test Trigger**. Это создаст пример тела webhook на основе тестового события, отправленного из <Constant name="cloud" />.

Значения в образце тела жестко закодированы и не отражают ваш проект, но они дают Zapier правильно сформированный объект во время разработки.

## Хранение секретов  
На следующем шаге вам понадобится Webhook Secret Key из предыдущего шага, а также <Constant name="cloud" /> [personal access token](/docs/dbt-cloud-apis/user-tokens) или [service account token](/docs/dbt-cloud-apis/service-tokens).

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps). Это предотвращает отображение ваших ключей в виде открытого текста в коде Zap. Вы можете получать к ним доступ с помощью утилиты [StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps). Это предотвращает отображение ваших ключей в виде открытого текста в коде Zap. Вы можете получить к ним доступ с помощью [утилиты StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

<Snippet path="webhook_guide_zapier_secret_store" />

## Добавление действия кода
Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события.

В разделе **Set up action** добавьте два элемента в **Input Data**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из предыдущего шага **Catch Raw Hook**.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Помните, что это **не** секрет <Constant name="cloud" />.

Этот пример кода проверяет подлинность запроса, извлекает логи запуска для завершённого задания из Admin API, а затем формирует два сообщения: сводное сообщение с результатом каждого шага и временем его выполнения, а также сообщение для включения в тред, в котором отображаются любые сообщения об ошибках, извлечённые из логов конца выполнения, созданных <Constant name="core" />.

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
  raise Exception("Calculated signature doesn't match contents of the Authorization header. This webhook may not have been sent from <Constant name="cloud" />.")

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

## Добавление действий Slack в Zapier
Выберите **Slack** в качестве приложения и **Send Channel Message** в качестве действия.

В разделе **Action** выберите, в какой **Channel** отправить сообщение. Установите поле **Message Text** на **2. Step Summary Post** из вывода Run Python в Code by Zapier.

Настройте другие параметры по своему усмотрению (например, **Bot Name** и **Bot Icon**).

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов с сообщением Slack](/img/guides/orchestration/webhooks/zapier-slack/parent-slack-config.png)

Добавьте еще один шаг, **Filter**. В разделе **Filter setup and testing** установите **Field** на **2. Send Error Thread** и **condition** на **(Boolean) Is true**. Это предотвращает сбой Zap, если задание выполнено успешно и вы пытаетесь отправить пустое сообщение Slack на следующем шаге.

![Скриншот интерфейса Zapier, показывающий правильно настроенный шаг Filter](/img/guides/orchestration/webhooks/zapier-slack/filter-config.png)

Добавьте еще одно действие **Send Channel Message in Slack**. В разделе **Action** выберите тот же канал, что и в прошлый раз, но установите **Message Text** на **2. Threaded Errors Post** из того же шага Run Python. Установите значение **Thread** на **3. Message Ts**, что является временной меткой сообщения, созданного первым действием Slack. Это указывает Zapier добавить этот пост как ответ в потоке к основному сообщению, что предотвращает засорение вашего канала полным (возможно, длинным) выводом.

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов с сообщением Slack](/img/guides/orchestration/webhooks/zapier-slack/thread-slack-config.png)

## Тестирование и развертывание

Когда вы закончите тестирование вашего Zap, убедитесь, что ваши `run_id` и `account_id` больше не жестко закодированы в шаге кода, затем опубликуйте ваш Zap.

## В качестве альтернативы используйте сообщение Slack от приложения dbt для запуска Zapier

Вместо использования вебхука в качестве триггера вы можете оставить установленное приложение <Constant name="cloud" /> в вашем рабочем пространстве Slack и использовать сообщения, которые оно публикует в вашем канале, как триггер. В этом случае можно пропустить проверку вебхука, и вам потребуется только загрузить контекст из треда.

### 1. Создание нового Zap в Zapier
Используйте **Slack** в качестве инициирующего приложения и **New Message Posted to Channel** в качестве триггера. В разделе **Trigger** выберите канал, в который отправляются ваши оповещения Slack, и установите **Trigger for Bot Messages?** на **Yes**.

![Скриншот интерфейса Zapier, показывающий правильно настроенный шаг триггера сообщения](/img/guides/orchestration/webhooks/zapier-slack/message-trigger-config.png)

Протестируйте ваш Zap, чтобы найти пример записи. Возможно, вам придется загрузить дополнительные образцы, пока вы не получите тот, который относится к сбойному заданию, в зависимости от того, публикуете ли вы все события заданий в Slack или нет.

### 2. Добавление шага фильтрации
Добавьте шаг **Filter** с следующими условиями:
- **1. Text contains failed on Job**
- **1. User Is Bot Is true**
- **1. User Name Exactly matches <Constant name="cloud" />**

![Скриншот интерфейса Zapier, показывающий правильно настроенный шаг фильтрации](/img/guides/orchestration/webhooks/zapier-slack/message-trigger-filter.png)

### 3. Извлечение ID выполнения
Добавьте шаг **Format** с **Event** **Text** и действием **Extract Number**. Для **Input** выберите **1. Text**.

![Скриншот интерфейса Zapier, показывающий шаг преобразования, настроенный для извлечения числа из свойства Text сообщения Slack](/img/guides/orchestration/webhooks/zapier-slack/extract-number.png)

Протестируйте ваш шаг и убедитесь, что ID выполнения был правильно извлечен.

### 4. Добавьте задержку
Иногда <Constant name="cloud" /> отправляет сообщение о неудачном запуске раньше, чем артефакты этого запуска становятся доступными через API. По этой причине рекомендуется добавить небольшую задержку, чтобы повысить вероятность того, что данные уже будут доступны. На некоторых тарифах Zapier автоматически повторяет задание, завершившееся с ошибкой 404, однако период ожидания перед повтором у него больше, чем обычно требуется, поэтому контекст будет отсутствовать в вашем треде дольше.

Обычно достаточно задержки в одну минуту.

### 5. Хранение секретов
На следующем шаге вам понадобится либо <Constant name="cloud" /> [персональный токен доступа](/docs/dbt-cloud-apis/user-tokens), либо [токен сервисного аккаунта](/docs/dbt-cloud-apis/service-tokens).

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps). Это предотвращает отображение ваших ключей в виде открытого текста в коде Zap. Вы можете получить к ним доступ с помощью [утилиты StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

Это руководство предполагает, что имя для секретного ключа - `DBT_CLOUD_SERVICE_TOKEN`. Если вы используете другое имя, убедитесь, что вы обновили все ссылки на него в примере кода.

Это руководство использует краткосрочное действие кода для хранения секретов, но вы также можете использовать инструмент, такой как Postman, для взаимодействия с [REST API](https://store.zapier.com/) или создать отдельный Zap и вызвать [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

#### a. Создание подключения Storage by Zapier
Если у вас его еще нет, перейдите на [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) и создайте новое подключение. Запомните сгенерированный UUID секрет для дальнейшего использования.

#### b. Добавление временного шага кода
Выберите **Run Python** в качестве события. Запустите следующий код:
```python 
```python
store = StoreClient('abc123') #replace with your UUID secret
store.set('DBT_CLOUD_SERVICE_TOKEN', 'abc123') #replace with your <Constant name="cloud" /> API token
```

Этот фрагмент является техническим примером кода, поэтому он не переводится и приведён без изменений.
```
Протестируйте шаг. Вы можете удалить это действие, когда тест пройдет успешно. Ключ останется сохраненным, пока к нему обращаются хотя бы раз в три месяца.

### 6. Добавление действия кода

Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события.

Этот шаг очень похож на описанный в основном примере, но вы можете пропустить много начальной работы по проверке.

В разделе **Action** добавьте два элемента в **Input Data**: `run_id` и `account_id`. Свяжите их с свойством `3. Output` и вашим захардкоженным Account ID `<Constant name="cloud" />` соответственно.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-slack/code-example-alternate.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Помните, что это не ваш секрет dbt Cloud.

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Обратите внимание, что это **не** секрет вашего <Constant name="cloud" />.

В этом примере кода извлекаются логи запуска для завершённого задания через Admin API, после чего формируется сообщение, в котором отображаются все сообщения об ошибках, извлечённые из логов конца выполнения (end-of-invocation), созданных <Constant name="core" /> (они будут опубликованы в виде треда).

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
### 7. Добавление действия Slack в Zapier

Добавьте действие **Send Channel Message in Slack**. В разделе **Action** установите канал на **1. Channel Id**, который является каналом, в который было отправлено инициирующее сообщение.

Установите **Message Text** на **5. Threaded Errors Post** из шага Run Python. Установите значение **Thread** на **1. Ts**, что является временной меткой инициирующего сообщения Slack. Это указывает Zapier добавить этот пост как ответ в потоке к основному сообщению, что предотвращает засорение вашего канала полным (возможно, длинным) выводом.

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов с сообщением Slack](/img/guides/orchestration/webhooks/zapier-slack/thread-slack-config-alternate.png)

### 8. Тестирование и развертывание

Когда вы закончите тестирование вашего Zap, опубликуйте его.

</div>