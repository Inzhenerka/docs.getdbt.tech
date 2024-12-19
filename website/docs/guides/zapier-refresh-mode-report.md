---
title: "Обновление панели инструментов Mode при завершении задания"
id: zapier-refresh-mode-report
description: Используйте Zapier для запуска обновления панели инструментов Mode, когда задание dbt Cloud завершено.
hoverSnippet: Узнайте, как использовать Zapier для запуска обновления панели инструментов Mode, когда задание dbt Cloud завершено.
# time_to_complete: '30 минут' закомментировано до тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Этот гид научит вас, как обновить панель инструментов Mode, когда задание dbt Cloud успешно завершено и доступны свежие данные. Интеграция будет:

 - Получать уведомление о вебхуке в Zapier
 - Запускать обновление отчета Mode

Хотя мы используем API Mode в качестве конкретного примера, принципы легко применимы к вашему [инструменту](https://learn.hex.tech/docs/develop-logic/hex-api/api-reference#operation/RunProject) [по](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset) [вашему выбору](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref.htm#update_workbook_now). 

### Предварительные требования

Для настройки интеграции вам следует быть знакомым с:
- [Вебхуками dbt Cloud](/docs/deploy/webhooks)
- Zapier
- [API Mode](https://mode.com/developer/api-reference/introduction/)

## Создание нового Zap в Zapier
Используйте **Webhooks by Zapier** в качестве триггера и **Catch Raw Hook** в качестве события. Если вы не собираетесь [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook) (что не рекомендуется!), вы можете выбрать **Catch Hook** вместо этого. 

Нажмите **Продолжить**, затем скопируйте URL вебхука. 

![Скриншот интерфейса Zapier, показывающий URL вебхука, готовый к копированию](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

## Настройка нового вебхука в dbt Cloud
Смотрите [Создание подписки на вебхук](/docs/deploy/webhooks#create-a-webhook-subscription) для получения полных инструкций. Ваше событие должно быть **Завершение выполнения**, и вам нужно изменить список **Jobs**, чтобы он содержал только те задания, завершение которых должно запускать обновление отчета.

Запишите секретный ключ вебхука для дальнейшего использования.

После того как вы протестируете конечную точку в dbt Cloud, вернитесь в Zapier и нажмите **Test Trigger**, что создаст пример тела вебхука на основе тестового события, отправленного dbt Cloud.

Значения в примере тела закодированы и не отражают ваш проект, но они предоставляют Zapier правильно сформированный объект во время разработки. 

## Хранение секретов 
На следующем шаге вам понадобятся секретный ключ вебхука из предыдущего шага и [персональный токен доступа dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) или [токен сервисной учетной записи](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens), а также [токен и секрет API Mode](https://mode.com/developer/api-reference/authentication/). 

Zapier позволяет вам [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), что предотвращает отображение ваших ключей в открытом виде в коде Zap. Вы сможете получить к ним доступ через [утилиту StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

Этот гид предполагает, что названия секретных ключей следующие: `DBT_WEBHOOK_KEY`, `MODE_API_TOKEN` и `MODE_API_SECRET`. Если вы используете другие названия, убедитесь, что вы обновили все ссылки на них в примере кода.

Этот гид использует краткосрочное действие кода для хранения секретов, но вы также можете использовать инструмент, такой как Postman, для взаимодействия с [REST API](https://store.zapier.com/) или создать отдельный Zap и вызвать [Действие Установить значение](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

### a. Создание подключения Storage by Zapier
Если у вас его еще нет, перейдите на [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) и создайте новое подключение. Запомните сгенерированный вами секрет UUID для дальнейшего использования. 

### b. Добавление временного шага кода
Выберите **Run Python** в качестве события. Запустите следующий код: 
```python 
store = StoreClient('abc123') #замените на ваш секрет UUID
store.set('DBT_WEBHOOK_KEY', 'abc123') #замените на ваш токен API dbt Cloud
store.set('MODE_API_TOKEN', 'abc123') #замените на ваш токен API Mode
store.set('MODE_API_SECRET', 'abc123') #замените на ваш секрет API Mode
```
Протестируйте шаг. Вы можете удалить это действие, когда тест пройдет успешно. Ключ останется сохраненным, пока он будет доступен хотя бы раз каждые три месяца.

## Добавление действия кода
Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события. 

В области **Настройка действия** добавьте два элемента в **Input Data**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из шага **Catch Raw Hook** выше.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` в конструкторе StoreClient на секрет, который вы создали при настройке интеграции Storage by Zapier (не ваш секрет dbt Cloud), и установив переменные `account_username` и `report_token` на фактические значения.

Код ниже проверит подлинность запроса, а затем отправит команду [`run report` в API Mode](https://mode.com/developer/api-reference/analytics/report-runs/#runReport) для данного токена отчета.

```python
import hashlib
import hmac
import json

#замените на токен отчета, который вы хотите запустить
account_username = 'YOUR_MODE_ACCOUNT_USERNAME_HERE'
report_token = 'YOUR_REPORT_TOKEN_HERE'

auth_header = input_data['auth_header']
raw_body = input_data['raw_body']

# Доступ к секретным учетным данным
secret_store = StoreClient('YOUR_SECRET_HERE')
hook_secret = secret_store.get('DBT_WEBHOOK_KEY')
username = secret_store.get('MODE_API_TOKEN')
password = secret_store.get('MODE_API_SECRET')

# Проверка, что вебхук пришел из dbt Cloud
signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
  raise Exception("Вычисленная подпись не совпадает с содержимым заголовка Authorization. Этот вебхук, возможно, не был отправлен из dbt Cloud.")

full_body = json.loads(raw_body)
hook_data = full_body['data'] 

if hook_data['runStatus'] == "Success":

  # Создание запуска отчета с помощью API Mode
  url = f'https://app.mode.com/api/{account_username}/reports/{report_token}/run'

  params = {
    'parameters': {
      "user_id": 123, 
      "location": "San Francisco"
    } 
  }
  headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/hal+json'
  }
  response = requests.post(
    url, 
    json=params, 
    headers=headers, 
    auth=HTTPBasicAuth(username, password)
  )
  response.raise_for_status()

return
```

## Тестирование и развертывание
Вы можете итеративно изменять шаг кода, модифицируя код и затем снова запуская тест. Когда вы будете довольны результатом, вы можете опубликовать свой Zap.

</div>