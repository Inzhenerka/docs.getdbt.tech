---
title: Создание озера данных с dbt Core и Dremio Cloud
id: build-dremio-lakehouse
description: Узнайте, как создать озеро данных с dbt Core и Dremio Cloud.
displayText: Создание озера данных с dbt Core и Dremio Cloud
hoverSnippet: Узнайте, как создать озеро данных с dbt Core и Dremio Cloud
platform: 'dbt-core'
icon: 'guides'
hide_table_of_contents: true
tags: ['Dremio', 'dbt Core']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Введение

Это руководство покажет, как построить data lakehouse с использованием <Constant name="core" /> версии 1.5 или новее и Dremio Cloud. Вы сможете упростить и оптимизировать свою инфраструктуру данных с помощью надежного фреймворка трансформаций dbt и открытого, простого в использовании lakehouse от Dremio. Интегрированное решение позволяет компаниям создать прочную основу для данных и аналитики, поддерживать self-service аналитику и улучшать бизнес-инсайты, одновременно упрощая операционную деятельность за счёт устранения необходимости писать сложные конвейеры Extract, Transform, and Load (ETL).

### Предварительные требования

* У вас должна быть учетная запись [Dremio Cloud](https://docs.dremio.com/cloud/).
* У вас должен быть установлен Python 3.
* У вас должен быть установлен <Constant name="core" /> версии 1.5 или новее ([инструкция по установке](//docs/core/installation-overview)).
* У вас должен быть установлен и настроен адаптер Dremio версии 1.5.0 или новее для Dremio Cloud ([см. инструкцию](/docs/core/connect-data-platform/dremio-setup)).
* У вас должны быть базовые практические знания <Constant name="git" /> и интерфейса командной строки (CLI).

## Проверка вашей среды

Проверьте вашу среду, запустив следующие команды в вашем CLI и проверив результаты:

```shell

$ python3 --version
Python 3.11.4 # Должен быть Python 3

```

```shell

$ dbt --version
Core:
  - installed: 1.5.0 # Должен быть 1.5 или новее
  - latest:    1.6.3 - Доступно обновление!

  Ваша версия dbt-core устарела!
  Инструкции по обновлению можно найти здесь:
  https://docs.getdbt.tech/docs/installation

Plugins:
  - dremio: 1.5.0 - Актуально! # Должен быть 1.5 или новее

```

## Начало работы

1. Склонируйте пример проекта Dremio <Constant name="core" /> из [репозитория GitHub](https://github.com/dremio-brock/DremioDBTSample/tree/master/dremioSamples).

2. В вашей интегрированной среде разработки (<Constant name="cloud_ide" />) откройте файл `relation.py` в каталоге адаптера Dremio:
  `$HOME/Library/Python/3.9/lib/python/site-packages/dbt/adapters/dremio/relation.py`

3. Найдите и обновите строки 51 и 52, чтобы они соответствовали следующему синтаксису:

```python

PATTERN = re.compile(r"""((?:[^."']|"[^"]*"|'[^']*')+)""")
return ".".join(PATTERN.split(identifier)[1::2])

```

Полный выбор должен выглядеть так:

```python
def quoted_by_component(self, identifier, componentName):
        if componentName == ComponentName.Schema:
            PATTERN = re.compile(r"""((?:[^."']|"[^"]*"|'[^']*')+)""")
            return ".".join(PATTERN.split(identifier)[1::2])
        else:
            return self.quoted(identifier)

```

Вам нужно обновить этот шаблон, потому что плагин не поддерживает имена схем в Dremio, содержащие точки и пробелы.

## Создание вашего конвейера

1. Создайте файл `profiles.yml` в пути `$HOME/.dbt/profiles.yml` и добавьте следующие конфигурации:

```yaml

dremioSamples:
  outputs:
    cloud_dev:
      dremio_space: dev
      dremio_space_folder: no_schema
      object_storage_path: dev
      object_storage_source: $scratch
      pat: <this_is_the_personal_access_token>
      cloud_host: api.dremio.cloud
      cloud_project_id: <id_of_project_you_belong_to>
      threads: 1
      type: dremio
      use_ssl: true
      user: <your_username>
  target: dev

  ```

  2. Выполните конвейер трансформации: 

  ```shell

  $ dbt run -t cloud_dev

  ```

  Если вышеуказанные конфигурации были реализованы, вывод будет выглядеть примерно так:

```shell

17:24:16  Running with dbt=1.5.0
17:24:17  Found 5 models, 0 tests, 0 snapshots, 0 analyses, 348 macros, 0 operations, 0 seed files, 2 sources, 0 exposures, 0 metrics, 0 groups
17:24:17
17:24:29  Concurrency: 1 threads (target='cloud_dev')
17:24:29
17:24:29  1 of 5 START sql view model Preparation.trips .................................. [RUN]
17:24:31  1 of 5 OK created sql view model Preparation. trips ............................. [OK in 2.61s]
17:24:31  2 of 5 START sql view model Preparation.weather ................................ [RUN]
17:24:34  2 of 5 OK created sql view model Preparation.weather ........................... [OK in 2.15s]
17:24:34  3 of 5 START sql view model Business.Transportation.nyc_trips .................. [RUN]
17:24:36  3 of 5 OK created sql view model Business.Transportation.nyc_trips ............. [OK in 2.18s]
17:24:36  4 of 5 START sql view model Business.Weather.nyc_weather ....................... [RUN]
17:24:38  4 of 5 OK created sql view model Business.Weather.nyc_weather .................. [OK in 2.09s]
17:24:38  5 of 5 START sql view model Application.nyc_trips_with_weather ................. [RUN]
17:24:41  5 of 5 OK created sql view model Application.nyc_trips_with_weather ............ [OK in 2.74s]
17:24:41
17:24:41  Finished running 5 view models in 0 hours 0 minutes and 24.03 seconds (24.03s).
17:24:41
17:24:41  Completed successfully
17:24:41
17:24:41  Done. PASS=5 WARN=0 ERROR=0 SKIP=0 TOTAL=5

```

Теперь, когда у вас есть настроенная среда и выполненная задача, вы можете просмотреть данные в Dremio и расширить свой код. Ниже показан снимок структуры проекта в <Constant name="cloud_ide" />:

<Lightbox src="/img/guides/dremio/dremio-cloned-repo.png" title="Клонированный репозиторий в IDE"/>

## О schema.yml

Файл `schema.yml` определяет источники и модели Dremio, которые будут использоваться, и какие модели данных находятся в области действия. В примере проекта этого руководства есть два источника данных:

1. `NYC-weather.csv`, хранящийся в базе данных **Samples**, и
2. `sample_data` из **Samples database**.

Модели соответствуют данным о погоде и поездках соответственно и будут объединены для анализа.

Источники можно найти, перейдя в раздел **Object Storage** в интерфейсе Dremio Cloud.

<Lightbox src="/img/guides/dremio/dremio-nyc-weather.png" title="Расположение NYC-weather.csv в Dremio Cloud"/>

## О моделях

**Preparation** &mdash; `preparation_trips.sql` и `preparation_weather.sql` создают представления на основе данных о поездках и погоде.

**Business** &mdash; `business_transportation_nyc_trips.sql` применяет некоторый уровень трансформации к представлению `preparation_trips.sql`. `Business_weather_nyc.sql` не имеет трансформации на представлении `preparation_weather.sql`.

**Application** &mdash; `application_nyc_trips_with_weather.sql` объединяет вывод из бизнес-модели. Это то, что будут использовать ваши бизнес-пользователи.

## Вывод задачи

Когда вы запускаете задачу dbt, она создаст папку пространства **dev**, в которой будут находиться все созданные данные. Это то, что вы увидите в интерфейсе Dremio Cloud. Пространства в Dremio — это способ организации данных, которые соответствуют бизнес-единицам или продуктам данных.

<Lightbox src="/img/guides/dremio/dremio-dev-space.png" title="Пространство разработки Dremio Cloud"/>

Откройте **папку Application**, и вы увидите результат простой трансформации, которую мы сделали с помощью dbt.

<Lightbox src="/img/guides/dremio/dremio-dev-application.png" title="Вывод трансформации папки Application"/>

## Запрос данных

Теперь, когда вы запустили задачу и завершили трансформацию, пришло время запросить ваши данные. Нажмите на представление `nyc_trips_with_weather`. Это приведет вас на страницу SQL Runner. Нажмите **Show SQL Pane** в верхнем правом углу страницы.

Выполните следующий запрос:

```sql

SELECT vendor_id,
       AVG(tip_amount)
FROM dev.application."nyc_treips_with_weather"
GROUP BY vendor_id

```

<Lightbox src="/img/guides/dremio/dremio-test-results.png" width="70%"  title="Пример вывода из SQL-запроса"/>

Это завершает настройку интеграции, и данные готовы для бизнес-потребления.

</div>
