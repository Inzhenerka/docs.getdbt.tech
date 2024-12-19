---
title: "Настройка слоя"
description: "Прочитайте это руководство, чтобы узнать о настройке хранилища Layer в dbt."
id: "layer-setup"
meta:
  maintained_by: Layer
  authors: 'Mehmet Ecevit'
  github_repo: 'layerai/dbt-layer'
  pypi_package: 'dbt-layer-bigquery'
  min_core_version: 'v1.0.0'
  cloud_support: Не поддерживается
  min_supported_version: 'n/a'
  slack_channel_name: '#tools-layer'
  slack_channel_link: 'https://getdbt.slack.com/archives/C03STA39TFE'
  platform_name: 'Layer'
  config_page: '/reference/resource-configs/no-configs'
---


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Конфигурация профиля

Цели Layer Bigquery должны быть настроены с использованием следующих разделов в вашем файле `profiles.yml`.
#### Аутентификация Layer
Добавьте ваш `layer_api_key` в ваш `profiles.yaml` для аутентификации с Layer. Чтобы получить ваш API-ключ Layer:
- Сначала [создайте свою бесплатную учетную запись Layer](https://app.layer.ai/login?returnTo=%2Fgetting-started).
- Перейдите в [app.layer.ai](https://app.layer.ai) > **Настройки** (значок шестеренки рядом с вашей фотографией профиля) > **Разработчик** > **Создать API-ключ**, чтобы получить ваш API-ключ Layer.

#### Аутентификация Bigquery
Вы можете использовать любой [метод аутентификации](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-setup), поддерживаемый официальным адаптером dbt Bigquery, так как Layer использует адаптер `dbt-bigquery` для подключения к вашему экземпляру Bigquery. 


Пример профиля:

<File name='profiles.yml'>

```yaml
layer-profile:
  target: dev
  outputs:
    dev:
      # Аутентификация Layer
      type: layer_bigquery
      layer_api_key: [API-ключ для доступа к вашей учетной записи Layer (опционально)]
      # Аутентификация Bigquery
      method: service-account
      project: [идентификатор проекта GCP]
      dataset: [название вашего набора данных dbt]
      threads: [1 или более]
      keyfile: [/path/to/bigquery/keyfile.json]
```

</File>

#### Описание полей профиля Layer Bigquery

Следующие поля являются обязательными:

Параметр               | Значение по умолчанию | Тип         | Описание
----------------------- | --------------------- |--------------| ---
`type`                  |                       | строка      | Указывает адаптер, который вы хотите использовать. Должен быть `layer_bigquery`.
`layer_api_key`         |                       | строка (опц.) | Указывает ваш API-ключ Layer. Если вы хотите делать прогнозы с помощью публичных ML моделей от Layer, вам не нужно указывать этот ключ в вашем профиле. Он необходим, если вы загружаете ML модели из вашей учетной записи Layer или обучаете модель AutoML.
`layer_project`         |                       | строка (опц.) | Указывает вашу целевую проект Layer. Если вы не укажете, Layer будет использовать проект с тем же именем, что и ваш проект dbt.
`method`                |                       | строка      | Указывает тип аутентификации для подключения к вашему BigQuery.

Остальные параметры зависят от метода аутентификации BigQuery, который вы указали.

## Использование

### AutoML

Вы можете автоматически создавать современные ML модели, используя свои собственные модели dbt с помощью простого SQL. Чтобы обучить модель AutoML, вам нужно просто передать тип модели, входные данные (признаки) и целевой столбец, который вы хотите предсказать, в `layer.automl()` в вашем SQL. AutoML Layer выберет наиболее эффективную модель и позволит вам вызывать ее по имени модели dbt для выполнения прогнозов, как показано выше. 

_Синтаксис:_
```
layer.automl("MODEL_TYPE", ARRAY[FEATURES], TARGET)
```

_Параметры:_

| Синтаксис    | Описание                                                                                                                                                                                                                                 |
| ------------ |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MODEL_TYPE` | Тип модели, которую вы хотите обучить. Есть два варианта: <br/> - `classifier`: Модель для предсказания классов/меток или категорий, таких как обнаружение спама<br/>- `regressor`: Модель для предсказания непрерывных результатов, таких как предсказание CLV. |
| `FEATURES`   | Имена входных столбцов в виде списка для обучения вашей модели AutoML.                                                                                                                                                                    |
| `TARGET`     | Целевой столбец, который вы хотите предсказать.                                                                                                                                                                                         |


_Требования:_
- Вам нужно указать `layer_api_key` в вашем профиле dbt, чтобы AutoML работал.

_Пример:_

Посмотрите [Проект AutoML по обзору заказов](https://github.com/layerai/dbt-layer/tree/mecevit/update-docs/examples/order_review_prediction):

```sql
SELECT order_id,
       layer.automl(
           -- Это задача регрессии
           'regressor',
           -- Данные (входные признаки) для обучения нашей модели
           ARRAY[
           days_between_purchase_and_delivery, order_approved_late,
           actual_delivery_vs_expectation_bucket, total_order_price, total_order_freight, is_multiItems_order,seller_shipped_late],
           -- Целевой столбец, который мы хотим предсказать
           review_score
       )
FROM {{ ref('training_data') }}
```

### Прогнозирование

Вы можете делать прогнозы, используя любую ML модель Layer в ваших моделях dbt. Адаптер dbt Layer помогает вам оценивать ваши данные, находящиеся в вашем хранилище, в рамках вашего DAG dbt с помощью SQL.

_Синтаксис:_
```
layer.predict("LAYER_MODEL_PATH", ARRAY[FEATURES])
```

_Параметры:_

| Синтаксис           | Описание                                                                                                                                                                                        |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `LAYER_MODEL_PATH`  | Это путь к модели Layer в формате `/[organization_name]/[project_name]/models/[model_name]`. Вы можете использовать только имя модели, если хотите использовать модель AutoML в рамках того же проекта dbt. |
| `FEATURES`          | Это столбцы, которые эта модель требует для выполнения прогноза. Вы должны передать столбцы в виде списка, например `ARRAY[column1, column2, column3]`.                                                |

_Пример:_

Посмотрите [Проект по обнаружению одежды](https://github.com/layerai/dbt-layer/tree/mecevit/update-docs/examples/cloth_detector):

```sql
SELECT
    id,
    layer.predict("layer/clothing/models/objectdetection", ARRAY[image])
FROM
    {{ ref("products") }}
```