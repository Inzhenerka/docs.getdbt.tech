---
title: "Настройка Layer"
description: "Прочтите это руководство, чтобы узнать о настройке хранилища Layer в dbt."
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

Цели Layer Bigquery должны быть настроены с использованием следующих секций в вашем файле `profiles.yml`.

#### Bigquery Authentication
Вы можете использовать любой [метод аутентификации](/docs/core/connect-data-platform/bigquery-setup), поддерживаемый официальным адаптером dbt для BigQuery, поскольку Layer использует адаптер `dbt-bigquery` для подключения к вашему экземпляру BigQuery.

#### Аутентификация Bigquery
Вы можете использовать любой [метод аутентификации](https://docs.getdbt.tech/reference/warehouse-profiles/bigquery-setup), поддерживаемый в официальном адаптере dbt Bigquery, так как Layer использует адаптер `dbt-bigquery` для подключения к вашей инстанции Bigquery.

Пример профиля:

<File name='profiles.yml'>

```yaml
layer-profile:
  target: dev
  outputs:
    dev:
      # Аутентификация Layer
      type: layer_bigquery
      layer_api_key: [API Key для доступа к вашему аккаунту Layer (опционально)]
      # Аутентификация Bigquery
      method: service-account
      project: [ID проекта GCP]
      dataset: [название вашего набора данных dbt]
      threads: [1 или более]
      keyfile: [/путь/к/bigquery/keyfile.json]
```

</File>

#### Описание полей профиля Layer Bigquery

Следующие поля являются обязательными:

Параметр               | По умолчанию | Тип         | Описание
----------------------- | ----------- |--------------| ---
`type`                  |             | строка       | Указывает адаптер, который вы хотите использовать. Должен быть `layer_bigquery`.
`layer_api_key`         |             | строка (опц) | Указывает ваш Layer API key. Если вы хотите делать предсказания с использованием публичных ML моделей из Layer, вам не нужно иметь этот ключ в вашем профиле. Он необходим, если вы загружаете ML модели из вашего аккаунта Layer или обучаете модель AutoML.
`layer_project`         |             | строка (опц) | Указывает ваш целевой проект Layer. Если не указано, Layer будет использовать проект с тем же именем, что и ваш проект dbt.
`method`              |             | строка       | Указывает тип аутентификации для подключения к вашему BigQuery.

Остальные параметры зависят от указанного вами метода аутентификации BigQuery.

## Использование

### AutoML

Вы можете автоматически создавать передовые ML модели, используя ваши собственные dbt модели с помощью простого SQL. Чтобы обучить модель AutoML, все, что вам нужно сделать, это передать тип модели, входные данные (фичи) и целевой столбец, который вы хотите предсказать, в `layer.automl()` в вашем SQL. Layer AutoML выберет модель с наилучшей производительностью и позволит вам вызывать ее по имени модели dbt для предсказаний, как показано выше.

_Синтаксис:_
```
layer.automl("MODEL_TYPE", ARRAY[FEATURES], TARGET)
```

_Параметры:_

| Синтаксис    | Описание                                                                                                                                                                                                                                 |
| --------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MODEL_TYPE`    | Тип модели, которую вы хотите обучить. Есть два варианта: <br/> - `classifier`: Модель для предсказания классов/меток или категорий, таких как обнаружение спама<br/>- `regressor`: Модель для предсказания непрерывных результатов, таких как предсказание CLV. |
| `FEATURES`    | Имена входных столбцов в виде списка для обучения вашей модели AutoML.                                                                                                                                                                                    |
| `TARGET`    | Целевой столбец, который вы хотите предсказать.                                                                                                                                                                                                     |

_Требования:_
- Вам нужно добавить `layer_api_key` в ваш профиль dbt, чтобы AutoML работал.

_Пример:_

Посмотрите [Проект AutoML для обзора заказов](https://github.com/layerai/dbt-layer/tree/mecevit/update-docs/examples/order_review_prediction):

```sql
SELECT order_id,
       layer.automl(
           -- Это задача регрессии
           'regressor',
           -- Данные (входные фичи) для обучения нашей модели
           ARRAY[
           days_between_purchase_and_delivery, order_approved_late,
           actual_delivery_vs_expectation_bucket, total_order_price, total_order_freight, is_multiItems_order,seller_shipped_late],
           -- Целевой столбец, который мы хотим предсказать
           review_score
       )
FROM {{ ref('training_data') }}
```

### Предсказание

Вы можете делать предсказания, используя любую ML модель Layer в ваших dbt моделях. Адаптер Layer dbt помогает вам оценивать ваши данные, находящиеся в вашем хранилище, в рамках вашего dbt DAG с помощью SQL.

_Синтаксис:_
```
layer.predict("LAYER_MODEL_PATH", ARRAY[FEATURES])
```

_Параметры:_

| Синтаксис    | Описание                                                                                                                                                                                        |
| --------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `LAYER_MODEL_PATH`      | Это путь к модели Layer в формате `/[organization_name]/[project_name]/models/[model_name]`. Вы можете использовать только имя модели, если хотите использовать модель AutoML в том же проекте dbt. |
| `FEATURES` | Это столбцы, которые требуются этой модели для предсказания. Вы должны передать столбцы в виде списка, например `ARRAY[column1, column2, column3]`.                                                |

_Пример:_

Посмотрите [Проект по обнаружению одежды](https://github.com/layerai/dbt-layer/tree/mecevit/update-docs/examples/cloth_detector):

```sql
SELECT
    id,
    layer.predict("layer/clothing/models/objectdetection", ARRAY[image])
FROM
    {{ ref("products") }}
```
