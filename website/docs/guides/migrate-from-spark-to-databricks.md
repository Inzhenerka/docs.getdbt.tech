---
title: "Миграция с dbt-spark на dbt-databricks"
id: "migrate-from-spark-to-databricks"
description: Узнайте, как мигрировать с dbt-spark на dbt-databricks.
displayText: Миграция с Spark на Databricks
hoverSnippet: Узнайте, как мигрировать с dbt-spark на dbt-databricks.
# time_to_complete: '30 минут' временно отключено до тестирования
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration', 'dbt Core','dbt Cloud']
level: 'Средний'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Введение

Вы можете мигрировать свои проекты с адаптера `dbt-spark` на адаптер [dbt-databricks](https://github.com/databricks/dbt-databricks). В сотрудничестве с dbt Labs, Databricks создал этот адаптер, используя dbt-spark в качестве основы, и добавил несколько критически важных улучшений. С его помощью вы получаете более простую настройку — требуется всего три параметра для аутентификации — и больше возможностей, таких как поддержка [Unity Catalog](https://www.databricks.com/product/unity-catalog).

### Предварительные требования

- Ваш проект должен быть совместим с dbt 1.0 или выше. Смотрите [Обновление до v1.0](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.0) для получения подробной информации. Для последней версии dbt смотрите [Обновление до v1.7](/docs/dbt-versions/core-upgrade/upgrading-to-v1.7).
- Для dbt Cloud вам нужны административные (admin) права для миграции проектов dbt.

### Упрощенная аутентификация

Ранее вам нужно было предоставить ID `cluster` или `endpoint`, который было сложно извлечь из `http_path`, который вам предоставляли. Теперь не имеет значения, используете ли вы кластер или SQL-эндпоинт, потому что настройка [dbt-databricks](/docs/core/connect-data-platform/databricks-setup) требует _одинаковых_ параметров для обоих. Все, что вам нужно предоставить:
- имя хоста рабочего пространства Databricks
- HTTP путь SQL-склада или кластера Databricks
- соответствующие учетные данные

### Лучшие значения по умолчанию

Адаптер `dbt-databricks` предоставляет лучшие значения по умолчанию, чем `dbt-spark`. Эти значения помогают оптимизировать ваш рабочий процесс, чтобы вы могли получить быструю производительность и экономичность Databricks. Они следующие:

- Модели dbt используют формат таблиц [Delta](https://docs.databricks.com/delta/index.html). Вы можете удалить любые объявленные конфигурации `file_format = 'delta'`, так как они теперь избыточны.
- Ускорьте свои дорогие запросы с помощью [Photon engine](https://docs.databricks.com/runtime/photon.html).
- Конфигурация `incremental_strategy` установлена на `merge`.

Однако в dbt-spark значение по умолчанию для `incremental_strategy` — `append`. Если вы хотите продолжать использовать `incremental_strategy=append`, вам нужно будет установить эту конфигурацию специально для ваших инкрементальных моделей. Если вы уже указали `incremental_strategy=merge` для своих инкрементальных моделей, вам не нужно ничего менять при переходе на dbt-databricks; но вы можете поддерживать свои модели в чистоте, удалив конфигурацию, так как она избыточна. Читайте [О конфигурации incremental_strategy](/docs/build/incremental-strategy), чтобы узнать больше.

Для получения дополнительной информации о значениях по умолчанию смотрите [Предостережения](/docs/core/connect-data-platform/databricks-setup#caveats).

### Чистый Python

Если вы используете dbt Core, вам больше не нужно загружать независимый драйвер для взаимодействия с Databricks. Информация о подключении полностью встроена в библиотеку на чистом Python под названием `databricks-sql-connector`.


## Миграция ваших проектов dbt в dbt Cloud

Вы можете мигрировать свои проекты на адаптер, специфичный для Databricks, с общего адаптера Apache Spark. Если вы используете dbt Core, переходите к Шагу 4.

Миграция на адаптер `dbt-databricks` с `dbt-spark` не должна вызывать простоя для производственных заданий. dbt Labs рекомендует планировать изменение подключения, когда использование IDE невелико, чтобы избежать нарушения работы вашей команды.

Чтобы обновить ваше подключение Databricks в dbt Cloud:

1. Выберите **Настройки аккаунта** в главной навигационной панели.
2. На вкладке **Проекты** найдите проект, который вы хотите мигрировать на адаптер dbt-databricks.
3. Нажмите на гиперссылку Подключение для проекта.
4. Нажмите **Редактировать** в правом верхнем углу.
5. Выберите **Databricks** для склада.
6. Введите:
    1. `hostname`
    2. `http_path`
    3. (по желанию) имя каталога
7. Нажмите **Сохранить**.

Каждому в вашей организации, кто использует dbt Cloud, необходимо обновить IDE перед началом работы снова. Это должно произойти менее чем за минуту.

## Настройка ваших учетных данных

Когда вы обновляете подключение Databricks в dbt Cloud, ваша команда не потеряет свои учетные данные. Это упрощает миграцию, так как вам нужно только удалить подключение Databricks и заново добавить информацию о кластере или эндпоинте.

Эти учетные данные не будут потеряны, когда будет установлено успешное соединение с Databricks с использованием метода ODBC `dbt-spark`:

- Учетные данные, которые вы предоставили dbt Cloud для подключения к вашему рабочему пространству Databricks.
- Личные токены доступа, которые ваша команда добавила в свой профиль dbt Cloud, чтобы они могли разрабатывать в IDE для данного проекта.
- Токен доступа, который вы добавили для каждой среды развертывания, чтобы dbt Cloud мог подключаться к Databricks во время производственных заданий.

## Миграция проектов dbt в dbt Core

Чтобы мигрировать ваши проекты dbt Core на адаптер `dbt-databricks` с `dbt-spark`, вам нужно:
1. Установить [адаптер dbt-databricks](https://github.com/databricks/dbt-databricks) в вашей среде.
1. Обновить ваше подключение Databricks, изменив ваш `target` в файле `~/.dbt/profiles.yml`.

Каждый, кто использует ваш проект, также должен внести эти изменения в своей среде.


## Попробуйте эти примеры

Вы можете использовать следующие примеры файла `profiles.yml`, чтобы увидеть настройку аутентификации с `dbt-spark` по сравнению с более простой настройкой с `dbt-databricks` при подключении к SQL-эндпоинту. Пример с кластером будет выглядеть аналогично.


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