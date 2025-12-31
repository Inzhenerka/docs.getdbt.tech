В этом гайде предполагается, что имена secret key: `DBT_CLOUD_SERVICE_TOKEN` и `DBT_WEBHOOK_KEY`. Если вы используете другие имена, убедитесь, что обновили все ссылки на них в примере кода.

В этом гайде используется временный шаг Code action для сохранения секретов, но вы также можете использовать инструмент вроде Postman, чтобы взаимодействовать с [REST API](https://store.zapier.com/), или создать отдельный Zap и вызвать [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

#### a. Создайте подключение Storage by Zapier {#a-create-a-storage-by-zapier-connection}
Если у вас его ещё нет, перейдите на [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) и создайте новое подключение. Запомните UUID‑секрет, который вы сгенерируете — он понадобится позже.

#### b. Добавьте временный шаг с кодом {#b-add-a-temporary-code-step}
В качестве Event выберите **Run Python**. Запустите следующий код:
```python 
store = StoreClient('abc123') #замените на ваш UUID‑секрет
store.set('DBT_WEBHOOK_KEY', 'abc123') #замените на webhook‑секрет
store.set('DBT_CLOUD_SERVICE_TOKEN', 'abc123') #замените на ваш dbt API token
```
Протестируйте шаг. Когда тест пройдёт успешно, вы можете удалить этот Action. Значение ключа останется сохранённым, пока к нему обращаются хотя бы один раз в три месяца.
