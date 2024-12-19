---
title: "Отправка сообщений в Slack с контекстом ошибки при сбое задания"
id: zapier-slack
description: Используйте вебхук или сообщение Slack для запуска Zapier и отправки контекста ошибки в Slack при сбое задания.
hoverSnippet: Узнайте, как использовать вебхук или сообщение Slack для запуска Zapier и отправки контекста ошибки в Slack при сбое задания.
# time_to_complete: '30 минут' закомментировано до тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Этот гид покажет вам, как настроить интеграцию между заданиями dbt Cloud и Slack с использованием [вебхуков dbt Cloud](/docs/deploy/webhooks) и Zapier. Он основывается на встроенной [интеграции Slack](/docs/deploy/job-notifications#slack-notifications), добавляя детали сообщений об ошибках моделей и тестов в поток.

Примечание: Поскольку для события "Запуск отменен" нет вебхука, вы можете оставить стандартную интеграцию Slack, чтобы получать эти уведомления. Вы также можете использовать [альтернативную интеграцию](#alternate-approach), которая дополняет встроенную интеграцию, не заменяя ее.

Когда задание dbt Cloud завершает выполнение, интеграция будет:

 - Получать уведомление вебхука в Zapier
 - Извлекать результаты из API администратора dbt Cloud
 - Отправлять краткое резюме выполнения в канал Slack
 - Создавать сообщение в потоке, прикрепленное к этому посту, которое содержит любые причины, по которым задание завершилось с ошибкой

![Скриншот сообщения в Slack, показывающего резюме выполнения dbt Cloud, которое завершилось с ошибкой](/img/guides/orchestration/webhooks/zapier-slack/slack-thread-example.png)

### Предварительные требования

Для настройки интеграции вам следует быть знакомым с:
- [вебхуками dbt Cloud](/docs/deploy/webhooks)
- Zapier

## Создание нового Zap в Zapier
1. Используйте **Webhooks by Zapier** в качестве триггера и **Catch Raw Hook** в качестве события. Если вы не собираетесь [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook) (что не рекомендуется!), вы можете выбрать **Catch Hook** вместо этого.
2. Нажмите **Continue**, затем скопируйте URL вебхука.

![Скриншот интерфейса Zapier, показывающий URL вебхука, готовый к копированию](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

## Настройка нового вебхука в dbt Cloud
Смотрите [Создание подписки на вебхук](/docs/deploy/webhooks#create-a-webhook-subscription) для получения полных инструкций. Выберите **Run completed** в качестве события. Вы также можете выбрать **Run errored**, но вам нужно будет учитывать, что необходимые метаданные [могут быть недоступны немедленно](/docs/deploy/webhooks#completed-errored-event-difference).

Запомните секретный ключ вебхука для дальнейшего использования.

После того как вы протестируете конечную точку в dbt Cloud, вернитесь в Zapier и нажмите **Test Trigger**. Это создаст пример тела вебхука на основе тестового события, отправленного dbt Cloud.

Значения в примере тела закодированы и не отражают ваш проект, но они предоставляют Zapier правильно сформированный объект во время разработки.

## Хранение секретов
На следующем шаге вам понадобятся секретный ключ вебхука из предыдущего шага и [персональный токен доступа dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) или [токен сервисной учетной записи](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens).

Zapier позволяет вам [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps). Это предотвращает отображение ваших ключей в виде открытого текста в коде Zap. Вы можете получить к ним доступ с помощью [утилиты StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

<Snippet path="webhook_guide_zapier_secret_store" />

## Добавление действия кода
Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события.

В разделе **Настроить действие** добавьте два элемента в **Input Data**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из предыдущего шага **Catch Raw Hook**.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Помните, что это не ваш секрет dbt Cloud.

Этот пример кода проверяет подлинность запроса, извлекает журналы выполнения завершенного задания из API администратора и затем создает два сообщения: сообщение-резюме, содержащее результат каждого шага и его продолжительность, и сообщение для включения в поток, отображающее любые сообщения об ошибках, извлеченные из журналов завершения вызова, созданных dbt Core.

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

# Проверка, что вебхук пришел из dbt Cloud
signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
  raise Exception("Вычисленная подпись не совпадает с содержимым заголовка Authorization. Этот вебхук, возможно, не был отправлен из dbt Cloud.")

full_body = json.loads(raw_body)
hook_data = full_body['data'] 

# Шаги, полученные из этих команд, не будут иметь свои детали ошибок, так как они неаккуратные
commands_to_skip_logs = ['dbt source', 'dbt docs']

# При тестировании вам нужно будет жестко закодировать run_id и account_id на существующие ID; пример вебхука не сработает. 
run_id = hook_data['runId']
account_id = full_body['accountId']

# Получение информации о запуске из API администратора dbt Cloud
url = f'https://YOUR_ACCESS_URL/api/v2/accounts/{account_id}/runs/{run_id}/?include_related=["run_steps"]'
headers = {'Authorization': f'Token {api_token}'}
run_data_response = requests.get(url, headers=headers)
run_data_response.raise_for_status()
run_data_results = run_data_response.json()['data']

# Общее резюме выполнения
step_summary_post = f"""
*<{run_data_results['href']}|{hook_data['runStatus']} для Запуска #{run_id} по Заданию \"{hook_data['jobName']}\">*

*Среда:* {hook_data['environmentName']} | *Триггер:* {hook_data['runReason']} | *Продолжительность:* {run_data_results['duration_humanized']}

"""

threaded_errors_post = ""

# Резюме по шагам
for step in run_data_results['run_steps']:
  if step['status_humanized'] == 'Success':
    step_summary_post += f"""
✅ {step['name']} ({step['status_humanized']} за {step['duration_humanized']})
"""
  else:
    step_summary_post += f"""
❌ {step['name']} ({step['status_humanized']} за {step['duration_humanized']})
"""

    # Не пытайтесь извлекать информацию из шагов, которые не имеют хорошо оформленных журналов
    show_logs = not any(cmd in step['name'] for cmd in commands_to_skip_logs)
    if show_logs:
      full_log = step['logs']
      # Удалить временные метки и любые цветовые теги
      full_log = re.sub('\x1b?\[[0-9]+m[0-9:]*', '', full_log)
    
      summary_start = re.search('(?:Завершено с \d+ ошибками.* и \d+ предупреждениями?:|Ошибка базы данных|Ошибка компиляции|Ошибка выполнения)', full_log)
    
      line_items = re.findall('(^.*(?:Неудача|Ошибка) в .*\n.*\n.*)', full_log, re.MULTILINE)

      if not summary_start:
        continue
      
      threaded_errors_post += f"""
*{step['name']}*
"""    
      # Если нет элементов строки, значит, сбой не был связан с узлами dbt, и мы хотим всю остальную часть сообщения. 
      # Если есть, то мы просто хотим строку резюме и затем вывести ошибку каждого отдельного узла.
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

В разделе **Действие** выберите, в какой **Канал** отправить сообщение. Установите поле **Текст сообщения** на **2. Step Summary Post** из вывода Run Python в Code by Zapier.

Настройте другие параметры по своему усмотрению (например, **Имя бота** и **Иконка бота**).

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов к сообщению Slack](/img/guides/orchestration/webhooks/zapier-slack/parent-slack-config.png)

Добавьте еще один шаг, **Filter**. В разделе **Настройка и тестирование фильтра** установите **Поле** на **2. Send Error Thread** и **условие** на **(Boolean) Is true**. Это предотвращает сбой Zap, если задание завершилось успешно, и вы пытаетесь отправить пустое сообщение в Slack на следующем шаге.

![Скриншот интерфейса Zapier, показывающий правильно настроенный шаг фильтра](/img/guides/orchestration/webhooks/zapier-slack/filter-config.png)

Добавьте еще одно действие **Send Channel Message in Slack**. В разделе **Действие** выберите тот же канал, что и в прошлый раз, но установите **Текст сообщения** на **2. Threaded Errors Post** из того же шага Run Python. Установите значение **Thread** на **3. Message Ts**, которое является временной меткой сообщения, созданного первым действием Slack. Это говорит Zapier добавить этот пост как ответ в потоке к основному сообщению, что предотвращает загромождение вашего канала полным (возможно, длинным) выводом.

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов к сообщению Slack](/img/guides/orchestration/webhooks/zapier-slack/thread-slack-config.png)

## Тестирование и развертывание

Когда вы закончите тестировать свой Zap, убедитесь, что ваши `run_id` и `account_id` больше не закодированы в шаге кода, затем опубликуйте свой Zap.

## Альтернативный способ: используйте сообщение приложения dbt Cloud в Slack для запуска Zapier

Вместо использования вебхука в качестве триггера вы можете оставить существующее приложение dbt Cloud, установленное в вашем рабочем пространстве Slack, и использовать его сообщения, публикуемые в вашем канале, в качестве триггера. В этом случае вы можете пропустить проверку вебхука и только загрузить контекст из потока.

### 1. Создайте новый Zap в Zapier
Используйте **Slack** в качестве инициирующего приложения и **New Message Posted to Channel** в качестве триггера. В разделе **Триггер** выберите канал, в который отправляются ваши уведомления Slack, и установите **Триггер для сообщений бота?** на **Да**.

![Скриншот интерфейса Zapier, показывающий правильно настроенный шаг триггера сообщения](/img/guides/orchestration/webhooks/zapier-slack/message-trigger-config.png)

Протестируйте свой Zap, чтобы найти пример записи. Возможно, вам придется загрузить дополнительные образцы, пока вы не получите один, относящийся к сбойному заданию, в зависимости от того, отправляете ли вы все события заданий в Slack или нет.

### 2. Добавьте шаг фильтра
Добавьте шаг **Filter** с следующими условиями: 
- **1. Text содержит failed on Job**
- **1. User Is Bot Is true**
- **1. User Name Exactly matches dbt Cloud**

![Скриншот интерфейса Zapier, показывающий правильно настроенный шаг фильтра](/img/guides/orchestration/webhooks/zapier-slack/message-trigger-filter.png)

### 3. Извлеките идентификатор запуска 
Добавьте шаг **Format** с **Событием** **Text** и действием **Extract Number**. Для **Входных данных** выберите **1. Text**. 

![Скриншот интерфейса Zapier, показывающий шаг преобразования, настроенный для извлечения числа из свойства текста сообщения Slack](/img/guides/orchestration/webhooks/zapier-slack/extract-number.png)

Протестируйте свой шаг и убедитесь, что идентификатор запуска был правильно извлечен.

### 4. Добавьте задержку
Иногда dbt Cloud публикует сообщение о сбое выполнения до того, как артефакты выполнения станут доступными через API. По этой причине рекомендуется добавить небольшую задержку, чтобы увеличить вероятность того, что данные будут доступны. На некоторых тарифных планах Zapier автоматически повторит задание, которое завершилось с ошибкой 404, но его период ожидания длиннее, чем обычно необходимо, поэтому контекст будет отсутствовать в вашем потоке дольше.

Задержка в одну минуту обычно достаточна.

### 5. Хранение секретов
На следующем шаге вам понадобится либо [персональный токен доступа dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens), либо [токен сервисной учетной записи](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens).

Zapier позволяет вам [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps). Это предотвращает отображение ваших ключей в виде открытого текста в коде Zap. Вы можете получить к ним доступ с помощью [утилиты StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

Этот гид предполагает, что имя секретного ключа — `DBT_CLOUD_SERVICE_TOKEN`. Если вы используете другое имя, убедитесь, что вы обновили все ссылки на него в примере кода.

Этот гид использует краткосрочное действие кода для хранения секретов, но вы также можете использовать инструмент, такой как Postman, для взаимодействия с [REST API](https://store.zapier.com/) или создать отдельный Zap и вызвать [действие Set Value](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

#### a. Создайте соединение Storage by Zapier
Если у вас его еще нет, перейдите по адресу [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) и создайте новое соединение. Запомните сгенерированный вами UUID секрет для дальнейшего использования.

#### b. Добавьте временный шаг кода
Выберите **Run Python** в качестве события. Запустите следующий код: 
```python 
store = StoreClient('abc123') #замените на ваш UUID секрет
store.set('DBT_CLOUD_SERVICE_TOKEN', 'abc123') #замените на ваш токен API dbt Cloud
```
Протестируйте шаг. Вы можете удалить это действие, когда тест пройдет успешно. Ключ останется сохраненным, пока он не будет доступен хотя бы раз каждые три месяца.

### 6. Добавьте действие кода

Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события. 

Этот шаг очень похож на описанный в основном примере, но вы можете пропустить большую часть начальной проверки.

В разделе **Действие** добавьте два элемента в **Input Data**: `run_id` и `account_id`. Свяжите их с свойством `3. Output` и вашим жестко закодированным идентификатором учетной записи dbt Cloud соответственно.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-slack/code-example-alternate.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Помните, что это не ваш секрет dbt Cloud.

Этот пример кода извлекает журналы выполнения завершенного задания из API администратора и затем создает сообщение, отображающее любые сообщения об ошибках, извлеченные из журналов завершения вызова, созданных dbt Core (которые будут опубликованы в потоке).

```python
import re

# Доступ к секретным учетным данным
secret_store = StoreClient('YOUR_SECRET_HERE')
api_token = secret_store.get('DBT_CLOUD_SERVICE_TOKEN')

# Шаги, полученные из этих команд, не будут иметь свои детали ошибок, так как они неаккуратные
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
    # Удалить временные метки и любые цветовые теги
    full_log = re.sub('\x1b?\[[0-9]+m[0-9:]*', '', full_log)
    
    summary_start = re.search('(?:Завершено с \d+ ошибками.* и \d+ предупреждениями?:|Ошибка базы данных|Ошибка компиляции|Ошибка выполнения)', full_log)
    
    line_items = re.findall('(^.*(?:Неудача|Ошибка) в .*\n.*\n.*)', full_log, re.MULTILINE)
    if not summary_start:
      continue
      
    threaded_errors_post += f"""
*{step['name']}*
"""    
    # Если нет элементов строки, значит, сбой не был связан с узлами dbt, и мы хотим всю остальную часть сообщения. 
    # Если есть, то мы просто хотим строку резюме и затем вывести ошибку каждого отдельного узла.
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
### 7. Добавьте действие Slack в Zapier

Добавьте действие **Send Channel Message in Slack**. В разделе **Действие** установите канал на **1. Channel Id**, который является каналом, в котором было опубликовано триггерное сообщение. 

Установите **Текст сообщения** на **5. Threaded Errors Post** из шага Run Python. Установите значение **Thread** на **1. Ts**, которое является временной меткой триггерного сообщения Slack. Это говорит Zapier добавить этот пост как ответ в потоке к основному сообщению, что предотвращает загромождение вашего канала полным (возможно, длинным) выводом.

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов к сообщению Slack](/img/guides/orchestration/webhooks/zapier-slack/thread-slack-config-alternate.png)

### 8. Тестирование и развертывание

Когда вы закончите тестировать свой Zap, опубликуйте его.

</div>