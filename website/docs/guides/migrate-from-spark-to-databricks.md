---
title: "Миграция с dbt-spark на dbt-databricks"
id: "migrate-from-spark-to-databricks"
description: Узнайте, как перейти с dbt-spark на dbt-databricks.
displayText: Миграция с Spark на Databricks
hoverSnippet: Узнайте, как перейти с dbt-spark на dbt-databricks.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration', 'dbt platform']
level: 'Intermediate'
---

<div style={{maxWidth: '900px'}}>

## Введение {#introduction}

Вы можете перенести свои проекты с использованием адаптера `dbt-spark` на использование [адаптера dbt-databricks](https://github.com/databricks/dbt-databricks). В сотрудничестве с dbt Labs, Databricks создали этот адаптер, используя dbt-spark в качестве основы и добавив некоторые важные улучшения. С ним вы получаете более простую настройку &mdash; требуется всего три параметра для аутентификации &mdash; и больше функций, таких как поддержка [Unity Catalog](https://www.databricks.com/product/unity-catalog).

### Предварительные требования {#prerequisite}

- Для миграции проектов dbt в <Constant name="dbt" /> необходимы права администратора (admin).

### Упрощенная аутентификация {#simpler-authentication}

Раньше требовалось указать идентификатор `cluster` или `endpoint`, который было сложно извлечь из предоставленного вам `http_path`. Теперь неважно, используете ли вы кластер или SQL-эндпоинт, поскольку [настройка dbt-databricks](/docs/local/connect-data-platform/databricks-setup) требует _одинаковых_ входных данных для обоих вариантов. Достаточно указать:
- имя хоста рабочей области Databricks
- HTTP-путь SQL-хранилища или кластера Databricks
- соответствующие учетные данные

### Улучшенные значения по умолчанию {#better-defaults}

Адаптер `dbt-databricks` предоставляет более оптимальные значения по умолчанию, чем `dbt-spark`. Эти значения помогают оптимизировать ваш рабочий процесс, чтобы вы могли получить быструю производительность и экономичность Databricks. Они следующие:

- Модели dbt используют формат таблиц [Delta](https://docs.databricks.com/delta/index.html). Вы можете удалить любые объявленные конфигурации `file_format = 'delta'`, так как они теперь избыточны.
- Ускорьте ваши дорогие запросы с помощью [Photon engine](https://docs.databricks.com/runtime/photon.html).
- Конфигурация `incremental_strategy` установлена на `merge`.

Однако в dbt-spark значение по умолчанию для `incremental_strategy` — это `append`. Если вы хотите продолжать использовать `incremental_strategy=append`, вам нужно будет явно установить эту конфигурацию на ваших инкрементальных моделях. Если вы уже указали `incremental_strategy=merge` на ваших инкрементальных моделях, вам не нужно ничего менять при переходе на dbt-databricks; но вы можете сохранить ваши модели чистыми, удалив конфигурацию, так как она избыточна. Прочтите [О стратегии инкрементального обновления](/docs/build/incremental-strategy), чтобы узнать больше.

Подробнее о значениях по умолчанию см. в разделе [Особенности](/docs/local/connect-data-platform/databricks-setup).

### Чистый Python {#pure-python}

Если вы используете <Constant name="core" />, вам больше не нужно скачивать отдельный драйвер для взаимодействия с Databricks. Вся информация о подключении включена в библиотеку `databricks-sql-connector`, написанную целиком на Python.

## Миграция ваших dbt проектов в dbt Cloud {#migrate-your-dbt-projects-in-dbt}

## Миграция ваших dbt‑проектов в dbt {#configure-your-credentials}

Вы можете перенести свои проекты с универсального адаптера Apache Spark на адаптер, специфичный для Databricks. Если вы используете <Constant name="core" />, переходите сразу к шагу 4.

Чтобы обновить подключение к Databricks в dbt Cloud:

Чтобы обновить подключение к Databricks в <Constant name="dbt" />:

1. В главной панели навигации выберите **Account Settings**.
2. На вкладке **Projects** найдите проект, который вы хотите мигрировать на адаптер dbt-databricks.
3. Нажмите на гиперссылку **Connection** для этого проекта.
4. Нажмите **Edit** в правом верхнем углу.
5. Выберите **Databricks** в качестве warehouse.
6. Введите:
    1. `hostname`
    2. `http_path`
    3. (опционально) имя каталога
7. Нажмите **Сохранить**.

Всем сотрудникам вашей организации, которые используют <Constant name="dbt" />, необходимо обновить <Constant name="studio_ide" />, прежде чем возобновить работу. Обновление должно занять менее минуты.

## Настройка ваших учетных данных {#migrate-dbt-projects-in-dbt-core}

При обновлении подключения к Databricks в <Constant name="dbt" /> ваша команда не потеряет свои учетные данные. Это упрощает миграцию, поскольку вам нужно лишь удалить подключение к Databricks и заново добавить информацию о кластере или конечной точке.

Эти учетные данные не будут потеряны при успешном подключении к Databricks с использованием метода `dbt-spark` ODBC:

- Учетные данные, которые вы предоставили <Constant name="dbt" /> для подключения к рабочей области Databricks.
- Персональные токены доступа, которые участники вашей команды добавили в свои профили <Constant name="dbt" />, чтобы разрабатывать в <Constant name="studio_ide" /> в рамках конкретного проекта.
- Токен доступа, который вы добавили для каждой среды развертывания, чтобы <Constant name="dbt" /> мог подключаться к Databricks при выполнении заданий в промышленной среде.

## Перенос проектов dbt в <Constant name="dbt" />

Чтобы перевести проекты <Constant name="core" /> с адаптера `dbt-spark` на `dbt-databricks`:
1. Установите [адаптер dbt-databricks](https://github.com/databricks/dbt-databricks) в своей среде
1. Обновите подключение к Databricks, изменив `target` в файле `~/.dbt/profiles.yml`

Любой, кто использует ваш проект, также должен внести эти изменения в своей среде.

## Попробуйте эти примеры

Вы можете использовать следующие примеры файла `profiles.yml`, чтобы увидеть настройку аутентификации с `dbt-spark` по сравнению с более простой настройкой с `dbt-databricks` при подключении к SQL endpoint. Пример для кластера будет выглядеть аналогично.

Пример того, как выглядит аутентификация с `dbt-spark`:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: odbc
      driver: '/opt/simba/spark/lib/64/libsparkodbc_sb64.so'
      schema: my_schema
      host: dbc-l33t-nwb.cloud.databricks.com
      endpoint: 8657cad335ae63e3
      token: [my_secret_token]

```

</File>

Пример того, насколько проще аутентификация с `dbt-databricks`:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      schema: my_schema
      host:  dbc-l33t-nwb.cloud.databricks.com
      http_path: /sql/1.0/endpoints/8657cad335ae63e3
      token: [my_secret_token]
```

</File>

</div>