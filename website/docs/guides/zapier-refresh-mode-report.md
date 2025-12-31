---
title: "Обновление дашборда Mode при завершении задания"
id: zapier-refresh-mode-report
description: Используйте Zapier, чтобы запускать обновление дашборда Mode после завершения задания dbt.  
hoverSnippet: Узнайте, как использовать Zapier для запуска обновления дашборда Mode после завершения задания dbt.
# time_to_complete: '30 минут' комментируем до тех пор, пока не протестируем
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

Это руководство научит вас обновлять дашборд Mode после того, как задание <Constant name="cloud" /> успешно завершилось и появились свежие данные. Интеграция будет:

 - Получать уведомление вебхука в Zapier
 - Запускать обновление отчета в Mode

Хотя мы используем API Mode для конкретного примера, принципы легко применимы к вашему [инструменту](https://learn.hex.tech/docs/develop-logic/hex-api/api-reference#operation/RunProject) [на](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset) [выбор](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref.htm#update_workbook_now).

### Предварительные требования {#prerequisites}

Для настройки интеграции вам необходимо быть знакомым со следующим:

- [<Constant name="cloud" /> Webhooks](/docs/deploy/webhooks)
- Zapier
- [API Mode](https://mode.com/developer/api-reference/introduction/)

## Создание нового Zap в Zapier {#create-a-new-zap-in-zapier}
Используйте **Webhooks by Zapier** в качестве триггера и **Catch Raw Hook** в качестве события. Если вы не собираетесь [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook) (не рекомендуется!), то можете выбрать **Catch Hook** вместо этого.

Нажмите **Continue**, затем скопируйте URL вебхука.

![Скриншот интерфейса Zapier, показывающий URL вебхука, готовый для копирования](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

## Настройка нового вебхука в dbt {#configure-a-new-webhook-in-dbt}
Подробные инструкции см. в разделе [Create a webhook subscription](/docs/deploy/webhooks#create-a-webhook-subscription). В качестве события необходимо выбрать **Run completed**, а также изменить список **Jobs** так, чтобы он содержал только те задания, завершение которых должно запускать обновление отчёта.

Запомните секретный ключ вебхука для дальнейшего использования.

После того как вы протестировали эндпоинт в <Constant name="cloud" />, вернитесь в Zapier и нажмите **Test Trigger** — это создаст пример тела webhook на основе тестового события, отправленного из <Constant name="cloud" />.

Значения в примере тела жестко закодированы и не отражают ваш проект, но они дают Zapier правильно сформированный объект во время разработки.

## Хранение секретов {#store-secrets}
На следующем шаге вам понадобятся **Webhook Secret Key** из предыдущего шага, а также <Constant name="cloud" /> [personal access token](/docs/dbt-cloud-apis/user-tokens) или [service account token](/docs/dbt-cloud-apis/service-tokens), а также [Mode API token and secret](https://mode.com/developer/api-reference/authentication/).

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), что предотвращает отображение ваших ключей в открытом виде в коде Zap. Вы сможете получить к ним доступ через [утилиту StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

Это руководство предполагает, что имена секретных ключей: `DBT_WEBHOOK_KEY`, `MODE_API_TOKEN` и `MODE_API_SECRET`. Если вы используете другие имена, убедитесь, что вы обновили все ссылки на них в примере кода.

Это руководство использует краткосрочное действие кода для хранения секретов, но вы также можете использовать инструмент, такой как Postman, для взаимодействия с [REST API](https://store.zapier.com/) или создать отдельный Zap и вызвать [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

### a. Создание подключения Storage by Zapier {#a-create-a-storage-by-zapier-connection}
Если у вас его еще нет, перейдите на [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) и создайте новое подключение. Запомните сгенерированный UUID секрет для дальнейшего использования.

### b. Добавьте временный шаг с кодом {#b-add-a-temporary-code-step}

Выберите **Run Python** в качестве события. Выполните следующий код:
```python
store = StoreClient('abc123')  # замените на ваш UUID secret
store.set('DBT_WEBHOOK_KEY', 'abc123')  # замените на ваш API token <Constant name="cloud" />
store.set('MODE_API_TOKEN', 'abc123')  # замените на ваш Mode API Token
store.set('MODE_API_SECRET', 'abc123')  # замените на ваш Mode API Secret
```

Протестируйте шаг. Вы можете удалить это действие, когда тест пройдет успешно. Ключ будет оставаться сохраненным, пока к нему обращаются хотя бы раз в три месяца.

## Добавление действия кода {#add-a-code-action}
Выберите **Code by Zapier** в качестве приложения и **Run Python** в качестве события.

В области **Set up action** добавьте два элемента в **Input Data**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из шага **Catch Raw Hook** выше.

![Скриншот интерфейса Zapier, показывающий сопоставления raw_body и auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

В поле **Code** вставьте следующий код, заменив `YOUR_SECRET_HERE` в конструкторе `StoreClient` на секрет, который вы создали при настройке интеграции **Storage by Zapier** (а не ваш секрет `<Constant name="cloud" />`), а также установив переменные `account_username` и `report_token` в реальные значения.

Код ниже проверит подлинность запроса, затем отправит команду [`run report` в API Mode](https://mode.com/developer/api-reference/analytics/report-runs/#runReport) для данного токена отчета.

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

# Убедитесь, что вебхук пришёл от dbt
signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
  raise Exception("Calculated signature doesn't match contents of the Authorization header. This webhook may not have been sent from <Constant name="cloud" />.")

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

## Тестирование и развертывание {#test-and-deploy}
Вы можете повторять шаг кода, изменяя код и затем снова запуская тест. Когда вы будете довольны результатом, вы можете опубликовать ваш Zap.

</div>
