---
title: "Конфигурации MindsDB"
id: "mindsdb-configs"
---

## Аутентификация

Чтобы успешно подключить dbt к MindsDB, вам необходимо предоставить следующую конфигурацию из экземпляра MindsDB.

| Ключ      | Обязательно | Описание                                           | Самостоятельный хостинг | MindsDB Cloud          |
|-----------|-------------|----------------------------------------------------|-------------------------|-------------------------|
| type      |    ✔️      | Конкретный адаптер для использования               | `mindsdb`               | `mindsdb`               |
| host      |    ✔️      | Хост (hostname) MindsDB, к которому нужно подключиться | По умолчанию `172.0.0.1` | По умолчанию `cloud.mindsdb.com` |
| port      |    ✔️      | Порт для использования                              | По умолчанию `47335`     | По умолчанию `3306`     |
| schema    |    ✔️      | Укажите схему (базу данных), в которую будут создаваться модели | Имя [интеграции MindsDB](https://docs.mindsdb.com/sql/create/databases/) | Имя [интеграции MindsDB](https://docs.mindsdb.com/sql/create/databases/) |
| username  |    ✔️      | Имя пользователя для подключения к серверу        | По умолчанию `mindsdb`   | Ваше имя пользователя MindsDB Cloud |
| password  |    ✔️      | Пароль для аутентификации на сервере              | По умолчанию нет пароля  | Ваш пароль MindsDB Cloud |

## Использование

Создайте проект dbt, выберите mindsdb в качестве базы данных и настройте подключение. Проверьте, что ваше подключение работает с помощью `dbt debug`.

`dbt init <project_name>`

Чтобы создать предсказатель, создайте модель dbt с материализацией "predictor". Имя модели будет именем предсказателя.

#### Параметры:
- `integration` - имя используемой интеграции для получения данных и сохранения результатов. Должно быть создано в mindsdb заранее с использованием синтаксиса [`CREATE DATABASE`](https://docs.mindsdb.com/sql/create/databases/).
- `predict` - поле для предсказания
- `predict_alias` [опционально] - псевдоним для предсказанного поля
- `using` [опционально] - параметры для настройки обученной модели

```sql
-- my_first_model.sql    
    {{
        config(
            materialized='predictor',
            integration='photorep',
            predict='name',
            predict_alias='name',
            using={
                'encoders.location.module': 'CategoricalAutoEncoder',
                'encoders.rental_price.module': 'NumericEncoder'
            }
        )
    }}
      select * from stores
```

Чтобы применить предсказатель, добавьте модель dbt с материализацией "table". Это создаст или заменит таблицу в выбранной интеграции с результатами предсказателя. Имя модели используется как имя таблицы для хранения результатов предсказания. Если вам нужно указать схему, вы можете сделать это с помощью разделителя точка: schema_name.table_name.sql  

#### Параметры
- `predictor_name` - имя предсказателя. Он должен быть создан в mindsdb.
- `integration` - имя используемой интеграции для получения данных и сохранения результатов. Должно быть создано в mindsdb заранее с использованием синтаксиса [`CREATE DATABASE`](https://docs.mindsdb.com/sql/create/databases/).

```    
    {{ config(materialized='table', predictor_name='TEST_PREDICTOR_NAME', integration='photorep') }}
        select a, bc from ddd where name > latest
```