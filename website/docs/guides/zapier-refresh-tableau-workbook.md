---
title: "Обновление рабочей книги Tableau с извлечениями после завершения задания"
id: zapier-refresh-tableau-workbook
description: Используйте Zapier, чтобы запускать обновление рабочей книги Tableau после успешного завершения задания dbt.
hoverSnippet: Узнайте, как с помощью Zapier запускать обновление рабочей книги Tableau после успешного завершения задания dbt.
# time_to_complete: '30 minutes' закомментировано до проведения тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

В этом руководстве вы узнаете, как обновить рабочую книгу Tableau, использующую [экстракты](https://help.tableau.com/current/pro/desktop/en-us/extracting_data.htm), после успешного завершения задания <Constant name="dbt" />, когда доступны свежие данные. Интеграция позволит:

 - Получать уведомление вебхука в Zapier
 - Запускать обновление рабочей книги Tableau

### Предварительные условия {#prerequisites}

Для настройки интеграции вам необходимо быть знакомым с:

- [Вебхуки <Constant name="dbt" />](/docs/deploy/webhooks)
- Zapier
- [API Tableau](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api.htm)
- [Версией](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_concepts_versions.htm#rest_api_versioning) REST API Tableau, совместимой с вашим сервером


## Получение учетных данных для аутентификации от Tableau {#obtain-authentication-credentials-from-tableau}
Чтобы аутентифицироваться с помощью API Tableau, получите [Персональный токен доступа](https://help.tableau.com/current/server/en-us/security_personal_access_tokens.htm) от вашего экземпляра Tableau Server/Cloud. Кроме того, убедитесь, что ваша рабочая книга Tableau использует источники данных, которые позволяют доступ для обновления, что обычно устанавливается при публикации.

## Создание нового Zap в Zapier {#create-a-new-zap-in-zapier}
Чтобы запустить действие при доставке вебхука в Zapier, вам нужно создать новый Zap с **Webhooks by Zapier** в качестве Триггера и **Catch Raw Hook** в качестве События. Однако, если вы решите не [проверять подлинность вашего вебхука](/docs/deploy/webhooks#validate-a-webhook), что не рекомендуется, вы можете выбрать **Catch Hook** вместо этого.

Нажмите **Continue**, затем скопируйте URL вебхука.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png" title="Снимок экрана интерфейса Zapier с URL вебхука, готовым к копированию" />

## Настройка нового вебхука в dbt
Чтобы настроить подписку на вебхук для <Constant name="dbt" />, следуйте инструкциям в разделе [Создание подписки на вебхук](/docs/deploy/webhooks#create-a-webhook-subscription). В качестве события выберите **Run completed** и измените список **Jobs**, включив в него только те задания, которые должны запускать обновление отчёта.

Не забудьте сохранить Webhook Secret Key — он понадобится позже. Вставьте webhook URL, полученный из Zapier на шаге 2, в поле **Endpoint** и протестируйте endpoint.

После того как вы протестируете эндпоинт в <Constant name="dbt" />, вернитесь в Zapier и нажмите **Test Trigger**. Это создаст пример тела вебхука на основе тестового события, отправленного <Constant name="dbt" />.

Значения в примере тела захардкожены и не отражают ваш проект, но они дают Zapier объект корректной структуры (shape) во время разработки.

## Хранение секретов {#store-secrets}
На следующем шаге вам понадобятся секретный ключ вебхука из предыдущего шага и ваши учетные данные для аутентификации Tableau. В частности, вам понадобятся URL вашего сервера/сайта Tableau, имя сервера/сайта, имя PAT и секрет PAT.

Zapier позволяет [хранить секреты](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), что предотвращает отображение ваших ключей в открытом виде в коде Zap. Вы сможете получить к ним доступ через [утилиту StoreClient](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

Это руководство предполагает, что имена для секретных ключей: `DBT_WEBHOOK_KEY`, `TABLEAU_SITE_URL`, `TABLEAU_SITE_NAME`, `TABLEAU_API_TOKEN_NAME` и `TABLEAU_API_TOKEN_SECRET`. Если вы используете другие имена, убедитесь, что вы обновили все ссылки на них в примере кода.

Это руководство использует краткосрочное действие кода для хранения секретов, но вы также можете использовать инструмент, такой как Postman, для взаимодействия с [REST API](https://store.zapier.com/) или создать отдельный Zap и вызвать [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

### a. Создание подключения Storage by Zapier {#a-create-a-storage-by-zapier-connection}

Создайте новое подключение на https://zapier.com/app/connections/storage, если у вас его еще нет, и запомните сгенерированный секрет UUID для последующего использования.

### b. Добавление временного шага кода {#b-add-a-temporary-code-step}

Выберите **Run Python** в качестве События и введите следующий код:

```python 
store = StoreClient('abc123') #replace with your UUID secret
store.set('DBT_WEBHOOK_KEY', 'abc123') #replace with your dbt Webhook key
store.set('TABLEAU_SITE_URL', 'abc123') #replace with your Tableau Site URL, inclusive of https:// and .com
store.set('TABLEAU_SITE_NAME', 'abc123') #replace with your Tableau Site/Server Name
store.set('TABLEAU_API_TOKEN_NAME', 'abc123') #replace with your Tableau API Token Name
store.set('TABLEAU_API_TOKEN_SECRET', 'abc123') #replace with your Tableau API Secret
```

Протестируйте шаг, чтобы выполнить код. Вы можете удалить это действие, когда тест пройдет успешно. Ключи останутся сохраненными, если к ним будет доступ хотя бы раз в три месяца.

## Добавление действия кода {#add-a-code-action}
Выберите **Code by Zapier** в качестве Приложения и **Run Python** в качестве События.

В области **Set up action** добавьте два элемента в **Input Data**: `raw_body` и `auth_header`. Свяжите их с полями `1. Raw Body` и `1. Headers Http Authorization` из шага **Catch Raw Hook** выше.

<Lightbox src="/img/guides/orchestration/webhooks/zapier-common/run-python.png" title="Скриншот интерфейса Zapier с сопоставлениями raw_body и auth_header" />

В поле **Code** вставьте следующий код, заменив `YOUR_STORAGE_SECRET_HERE` в конструкторе StoreClient на секрет UUID, который вы создали при настройке интеграции Storage by Zapier, и заменив переменные `workbook_name` и `api_version` на фактические значения.

Следующий код проверяет подлинность запроса и получает ID рабочей книги для указанного имени рабочей книги. Затем код отправит [команду обновления рабочей книги в API Tableau](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref_workbooks_and_views.htm#update_workbook_now) для данного ID рабочей книги.

```python
import requests
import hashlib
import json
import hmac

# Доступ к секретным учетным данным
secret_store = StoreClient('YOUR_STORAGE_SECRET_HERE')
hook_secret = secret_store.get('DBT_WEBHOOK_KEY')
server_url = secret_store.get('TABLEAU_SITE_URL')
server_name = secret_store.get('TABLEAU_SITE_NAME')
pat_name = secret_store.get('TABLEAU_API_TOKEN_NAME')
pat_secret = secret_store.get('TABLEAU_API_TOKEN_SECRET')

# Введите имя рабочей книги для обновления
workbook_name = "YOUR_WORKBOOK_NAME"
api_version = "ENTER_COMPATIBLE_VERSION"

#Проверка подлинности вебхука, поступающего от dbt
auth_header = input_data['auth_header']
raw_body = input_data['raw_body']

signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
raise Exception("Calculated signature doesn't match contents of the Authorization header. This webhook may not have been sent from dbt.")

full_body = json.loads(raw_body)
hook_data = full_body['data'] 

if hook_data['runStatus'] == "Success":

    # Аутентификация с сервером Tableau для получения токена аутентификации
    auth_url = f"{server_url}/api/{api_version}/auth/signin"
    auth_data = {
        "credentials": {
            "personalAccessTokenName": pat_name,
            "personalAccessTokenSecret": pat_secret,
            "site": {
                "contentUrl": server_name
            }
        }
    }
    auth_headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    auth_response = requests.post(auth_url, data=json.dumps(auth_data), headers=auth_headers)

    # Извлечение токена для использования в последующих вызовах
    auth_token = auth_response.json()["credentials"]["token"]
    site_id = auth_response.json()["credentials"]["site"]["id"]

    # Извлечение ID рабочей книги
    workbooks_url = f"{server_url}/api/{api_version}/sites/{site_id}/workbooks"
    workbooks_headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Tableau-Auth": auth_token
    }
    workbooks_params = {
        "filter": f"name:eq:{workbook_name}"
    }
    workbooks_response = requests.get(workbooks_url, headers=workbooks_headers, params=workbooks_params)

    # Назначение ID рабочей книги
    workbooks_data = workbooks_response.json()
    workbook_id = workbooks_data["workbooks"]["workbook"][0]["id"]

    # Обновление рабочей книги
    refresh_url = f"{server_url}/api/{api_version}/sites/{site_id}/workbooks/{workbook_id}/refresh"
    refresh_data = {}
    refresh_headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Tableau-Auth": auth_token
    }

    refresh_trigger = requests.post(refresh_url, data=json.dumps(refresh_data), headers=refresh_headers)
    return {"message": "Обновление рабочей книги поставлено в очередь"}
```

## Тестирование и развертывание {#test-and-deploy}
Чтобы внести изменения в ваш код, вы можете изменить его и протестировать снова. Когда вы будете довольны результатом, вы можете опубликовать ваш Zap.

</div>
