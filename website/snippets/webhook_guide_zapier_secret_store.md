Это руководство предполагает, что имена секретных ключей: `DBT_CLOUD_SERVICE_TOKEN` и `DBT_WEBHOOK_KEY`. Если вы используете другие имена, убедитесь, что обновили все ссылки на них в примерах кода.

В этом руководстве используется краткосрочное действие для хранения секретов, но вы также можете использовать такие инструменты, как Postman, для взаимодействия с [REST API](https://store.zapier.com/) или создать отдельный Zap и вызвать [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

#### a. Создайте подключение Storage by Zapier
Если у вас его еще нет, перейдите на [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) и создайте новое подключение. Запомните сгенерированный секретный UUID для дальнейшего использования.

#### b. Добавьте временный шаг с кодом
Выберите **Run Python** в качестве Event. Выполните следующий код:
```python 
store = StoreClient('abc123') #replace with your UUID secret
store.set('DBT_WEBHOOK_KEY', 'abc123') #replace with webhook secret
store.set('DBT_CLOUD_SERVICE_TOKEN', 'abc123') #replace with your dbt API token
```
```
Протестируйте шаг. Вы можете удалить это действие, когда тест пройдет успешно. Ключ будет оставаться сохраненным, если к нему обращаются хотя бы раз в три месяца.