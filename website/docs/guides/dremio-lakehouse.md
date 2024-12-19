---
title: Построение дата-лейкхауса с помощью dbt Core и Dremio Cloud
id: build-dremio-lakehouse
description: Узнайте, как построить дата-лейкхаус с помощью dbt Core и Dremio Cloud.
displayText: Построение дата-лейкхауса с помощью dbt Core и Dremio Cloud
hoverSnippet: Узнайте, как построить дата-лейкхаус с помощью dbt Core и Dremio Cloud
# time_to_complete: '30 минут' закомментировано до тестирования
platform: 'dbt-core'
icon: 'guides'
hide_table_of_contents: true
tags: ['Dremio', 'dbt Core']
level: 'Средний'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Этот гид продемонстрирует, как построить дата-лейкхаус с помощью dbt Core 1.5 или новее и Dremio Cloud. Вы можете упростить и оптимизировать свою инфраструктуру данных с помощью мощной трансформационной платформы dbt и открытого, простого в использовании дата-лейкхауса Dremio. Интегрированное решение позволяет компаниям создать надежную основу для данных и аналитики, способствуя аналитике самообслуживания и улучшая бизнес-инсайты, одновременно упрощая операции за счет устранения необходимости в написании сложных процессов извлечения, трансформации и загрузки (ETL).

### Предварительные требования

* У вас должна быть учетная запись [Dremio Cloud](https://docs.dremio.com/cloud/).
* У вас должен быть установлен Python 3.
* У вас должна быть установлена версия dbt Core v1.5 или новее [установленная](//docs/core/installation-overview).
* У вас должен быть установлен и настроен адаптер Dremio 1.5.0 или новее [для Dremio Cloud](/docs/core/connect-data-platform/dremio-setup).
* У вас должны быть базовые знания Git и интерфейса командной строки (CLI).

## Проверка вашей среды

Проверьте вашу среду, выполнив следующие команды в вашем CLI и проверив результаты:

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
  https://docs.getdbt.com/docs/installation

Plugins:
  - dremio: 1.5.0 - Актуально! # Должен быть 1.5 или новее

```

## Начало работы

1. Клонируйте пример проекта Dremio dbt Core из [репозитория GitHub](https://github.com/dremio-brock/DremioDBTSample/tree/master/dremioSamples).

2. В вашей интегрированной среде разработки (IDE) откройте файл relation.py в директории адаптера Dremio:
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

## Построение вашего пайплайна

1. Создайте файл `profiles.yml` по пути `$HOME/.dbt/profiles.yml` и добавьте следующие конфигурации:

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

2. Выполните трансформационный пайплайн:

```shell

$ dbt run -t cloud_dev

```

Если вышеуказанные конфигурации были реализованы, вывод будет выглядеть примерно так:

```shell

17:24:16  Запуск с dbt=1.5.0
17:24:17  Найдено 5 моделей, 0 тестов, 0 снимков, 0 анализов, 348 макросов, 0 операций, 0 seed файлов, 2 источника, 0 экспозиций, 0 метрик, 0 групп
17:24:17
17:24:29  Параллелизм: 1 поток (target='cloud_dev')
17:24:29
17:24:29  1 из 5 НАЧАЛО sql view model Preparation.trips .................................. [RUN]
17:24:31  1 из 5 ОК создан sql view model Preparation.trips ............................. [OK за 2.61с]
17:24:31  2 из 5 НАЧАЛО sql view model Preparation.weather ................................ [RUN]
17:24:34  2 из 5 ОК создан sql view model Preparation.weather ........................... [OK за 2.15с]
17:24:34  3 из 5 НАЧАЛО sql view model Business.Transportation.nyc_trips .................. [RUN]
17:24:36  3 из 5 ОК создан sql view model Business.Transportation.nyc_trips ............. [OK за 2.18с]
17:24:36  4 из 5 НАЧАЛО sql view model Business.Weather.nyc_weather ....................... [RUN]
17:24:38  4 из 5 ОК создан sql view model Business.Weather.nyc_weather .................. [OK за 2.09с]
17:24:38  5 из 5 НАЧАЛО sql view model Application.nyc_trips_with_weather ................. [RUN]
17:24:41  5 из 5 ОК создан sql view model Application.nyc_trips_with_weather ............ [OK за 2.74с]
17:24:41
17:24:41  Завершено выполнение 5 view моделей за 0 часов 0 минут и 24.03 секунды (24.03с).
17:24:41
17:24:41  Завершено успешно
17:24:41
17:24:41  Готово. PASS=5 WARN=0 ERROR=0 SKIP=0 TOTAL=5

```

Теперь, когда у вас есть рабочая среда и завершенная задача, вы можете просмотреть данные в Dremio и расширить свой код. Это снимок структуры проекта в IDE:

<Lightbox src="/img/guides/dremio/dremio-cloned-repo.png" title="Клонированный репозиторий в IDE"/>

## О файле schema.yml

Файл `schema.yml` определяет источники и модели Dremio, которые будут использоваться, и какие модели данных находятся в области действия. В примере проекта в этом руководстве есть два источника данных:

1. `NYC-weather.csv`, хранящийся в базе данных **Samples**, и
2. `sample_data` из **Samples database**.

Модели соответствуют данным о погоде и поездках соответственно и будут объединены для анализа.

Источники можно найти, перейдя в раздел **Object Storage** интерфейса Dremio Cloud.

<Lightbox src="/img/guides/dremio/dremio-nyc-weather.png" title="Расположение NYC-weather.csv в Dremio Cloud"/>

## О моделях

**Preparation** &mdash; `preparation_trips.sql` и `preparation_weather.sql` создают представления на основе данных о поездках и погоде.

**Business** &mdash; `business_transportation_nyc_trips.sql` применяет некоторый уровень трансформации к представлению `preparation_trips.sql`. `Business_weather_nyc.sql` не имеет трансформации на представлении `preparation_weather.sql`.

**Application** &mdash; `application_nyc_trips_with_weather.sql` объединяет вывод из бизнес-модели. Это то, что будут использовать ваши бизнес-пользователи.

## Вывод работы

Когда вы запускаете задачу dbt, она создаст папку **dev**, в которой будут находиться все созданные активы данных. Это то, что вы увидите в интерфейсе Dremio Cloud. Пространства в Dremio — это способ организации активов данных, которые соответствуют бизнес-единицам или продуктам данных.

<Lightbox src="/img/guides/dremio/dremio-dev-space.png" title="Dev пространство Dremio Cloud"/>

Откройте папку **Application**, и вы увидите вывод простой трансформации, которую мы сделали с помощью dbt.

<Lightbox src="/img/guides/dremio/dremio-dev-application.png" title="Вывод трансформации в папке Application"/>

## Запрос данных

Теперь, когда вы запустили задачу и завершили трансформацию, пришло время запросить ваши данные. Нажмите на представление `nyc_trips_with_weather`. Это перенесет вас на страницу SQL Runner. Нажмите **Показать SQL панель** в правом верхнем углу страницы.

Выполните следующий запрос:

```sql

SELECT vendor_id,
       AVG(tip_amount)
FROM dev.application."nyc_treips_with_weather"
GROUP BY vendor_id

```

<Lightbox src="/img/guides/dremio/dremio-test-results.png" width="70%"  title="Пример вывода из SQL запроса"/>

Это завершает настройку интеграции, и данные готовы к использованию в бизнесе.

</div>