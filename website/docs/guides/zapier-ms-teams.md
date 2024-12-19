---
title: "Отправка сообщения в Microsoft Teams по завершении задания"
id: zapier-ms-teams
description: Используйте Zapier и вебхуки dbt Cloud для отправки сообщений в Microsoft Teams по завершении выполнения задания.
hoverSnippet: Узнайте, как использовать Zapier с вебхуками dbt Cloud для отправки сообщений в Microsoft Teams по завершении выполнения задания.
# time_to_complete: '30 минут' закомментировано до тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Продвинутый'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение 

Этот гид покажет вам, как настроить интеграцию между заданиями dbt Cloud и Microsoft Teams с использованием [вебхуков dbt Cloud](/docs/deploy/webhooks) и Zapier, аналогично [родной интеграции с Slack](/docs/deploy/job-notifications#slack-notifications). 

Когда задание dbt Cloud завершает выполнение, интеграция будет:

 - Получать уведомление вебхука в Zapier,
 - Извлекать результаты из API администратора dbt Cloud, и
 - Отправлять сводку в канал Microsoft Teams.

![Скриншот сообщения в MS Teams, показывающего сводку выполнения dbt Cloud, которое завершилось с ошибкой](/img/guides/orchestration/webhooks/zapier-ms-teams/ms-teams-ui.png)

### Предварительные требования

Для настройки интеграции вам следует быть знакомым с:
- [вебхуками dbt Cloud](/docs/deploy/webhooks)
- Zapier

## Настройка соединения между Zapier и Microsoft Teams 

* Установите [приложение Zapier в Microsoft Teams](https://appsource.microsoft.com/en-us/product/office/WA200002044) и [предоставьте Zapier доступ к вашему аккаунту](https://zapier.com/blog/how-to-automate-microsoft-teams/). 

**Примечание**: Чтобы получить сообщение, добавьте приложение Zapier в канал команды во время установки.

## Создание нового Zap в Zapier
Используйте **Webhooks by Zapier** в качестве триггера и **Catch Raw Hook** в качестве события. Если вы не собираетесь [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook) (что не рекомендуется!), вы можете выбрать **Catch Hook** вместо этого. 

Нажмите **Продолжить**, затем скопируйте URL вебхука. 

![Скриншот интерфейса Zapier, показывающий URL вебхука, готовый к копированию](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

### 3. Настройка нового вебхука в dbt Cloud

Смотрите [Создание подписки на вебхук](/docs/deploy/webhooks#create-a-webhook-subscription) для получения полных инструкций. Выберите либо **Run completed**, либо **Run errored**, но не оба, иначе вы получите дублирующие сообщения при ошибке выполнения.

Запомните секретный ключ вебхука для дальнейшего использования.

После того как вы протестируете конечную точку в dbt Cloud, вернитесь в Zapier и нажмите **Test Trigger**, что создаст пример тела вебхука на основе тестового события, отправленного dbt Cloud.

Значения в примере тела закодированы и не отражают ваш проект, но они предоставляют Zapier корректно сформированный объект во время разработки. 

## Хранение секретов 

На следующем шаге вам понадобятся секретный ключ вебхука из предыдущего шага и [персональный токен доступа](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) или [токен сервисного аккаунта](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens) dbt Cloud. 

Zapier позволяет вам [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), что предотвращает отображение ваших ключей в открытом виде в коде Zap. Вы сможете получить к ним доступ через [утилиту StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

<Snippet path="webhook_guide_zapier_secret_store" />

## Добавление действия кода
Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события. 

В области **Настройка действия** добавьте два элемента в **Входные данные**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из шага **Catch Raw Hook** выше.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

В поле **Код** вставьте следующий код, заменив `YOUR_SECRET_HERE` на секрет, который вы создали при настройке интеграции Storage by Zapier. Помните, что это не ваш секрет dbt Cloud.

Код ниже будет проверять подлинность запроса, извлекать журналы выполнения завершенного задания из API администратора и затем формировать сводное сообщение, которое извлекает любые сообщения об ошибках из журналов завершения вызова, созданных dbt Core.

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

# Общая сводка выполнения
outcome_message = f"""
**\[{hook_data['runStatus']} для выполнения #{run_id} на задании \"{hook_data['jobName']}\"]({run_data_results['href']})**


**Среда:** {hook_data['environmentName']} | **Причина запуска:** {hook_data['runReason']} | **Длительность:** {run_data_results['duration_humanized']}

"""

# Сводки по конкретным шагам
for step in run_data_results['run_steps']:
  if step['status_humanized'] == 'Success':
    outcome_message += f"""
✅ {step['name']} ({step['status_humanized']} за {step['duration_humanized']})
"""
  else:
    outcome_message += f"""
❌ {step['name']} ({step['status_humanized']} за {step['duration_humanized']})
"""
    show_logs = not any(cmd in step['name'] for cmd in commands_to_skip_logs)
    if show_logs:
      full_log = step['logs']
      # Удаление временных меток и любых цветовых тегов
      full_log = re.sub('\x1b?\[[0-9]+m[0-9:]*', '', full_log)
    
      summary_start = re.search('(?:Завершено с \d+ ошибками.* и \d+ предупреждениями:|Ошибка базы данных|Ошибка компиляции|Ошибка выполнения)', full_log)
    
      line_items = re.findall('(^.*(?:Неудача|Ошибка) в .*\n.*\n.*)', full_log, re.MULTILINE)
    
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

Выберите **Microsoft Teams** в качестве приложения и **Отправить сообщение в канал** в качестве действия.

В области **Настройка действия** выберите команду и канал. Установите **Формат текста сообщения** на **markdown**, затем вставьте **2. Сообщение о результате** из Run Python в Code by Zapier в поле **Текст сообщения**. 

![Скриншот интерфейса Zapier, показывающий сопоставления предыдущих шагов с сообщением в MS Teams](/img/guides/orchestration/webhooks/zapier-ms-teams/ms-teams-zap-config.png)

## Тестирование и развертывание

Поскольку вы прошли через каждый шаг, вы должны были протестировать выходные данные, поэтому теперь вы можете попробовать отправить сообщение в ваш канал Teams. 

Когда вы будете довольны результатом, не забудьте убедиться, что ваши `run_id` и `account_id` больше не закодированы, а затем опубликуйте ваш Zap.

### Другие примечания
- Если вы отправляете сообщение в чат вместо канала команды, вам не нужно добавлять приложение Zapier в Microsoft Teams.
- Если вы отправляете сообщение в чат вместо канала команды, имейте в виду, что markdown не поддерживается, и вам нужно будет удалить форматирование markdown. 
- Если вы выбрали триггер **Catch Hook** вместо **Catch Raw Hook**, вам нужно будет передать каждое необходимое свойство из вебхука в качестве входных данных вместо выполнения `json.loads()` над сырым телом. Вам также нужно будет удалить код проверки. 

</div>