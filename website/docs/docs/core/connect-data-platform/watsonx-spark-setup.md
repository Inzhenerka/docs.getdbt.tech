---
title: "Настройка Spark в IBM watsonx.data"
description: "Прочитайте это руководство, чтобы узнать о настройке Spark в IBM watsonx.data для dbt."
id: "watsonx-spark-setup"
meta:
  maintained_by: IBM
  authors: Bayan Albunayan, Reema Alzaid, Manjot Sidhu 
  github_repo: 'IBM/dbt-watsonx-spark'
  pypi_package: 'dbt-watsonx-spark'
  min_core_version: v0.0.8
  cloud_support: 'Not Supported'
  min_supported_version: 'n/a'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM watsonx.data
  config_page: /reference/resource-configs/watsonx-Spark-config
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

Адаптер `dbt-watsonx-spark` позволяет использовать dbt для трансформации и управления данными в IBM watsonx.data Spark, используя возможности его распределённого SQL-движка.

Перед тем как продолжить, убедитесь, что у вас есть следующее:
- Активный экземпляр IBM watsonx.data. Для [IBM Cloud (SaaS)](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-getting-started). Для [Software](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=installing-watsonxdata-developer-version)
- Развёрнутый **Native Spark engine** в watsonx.data. Для [IBM Cloud (SaaS)](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-prov_nspark). Для [Software](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=spark-native-engine)
- Активный **Spark query server** в вашем **Native Spark engine**

Ознакомьтесь с официальной документацией по использованию **watsonx.data** с `dbt-watsonx-spark`:

- [Документация для IBM Cloud и SaaS-версий](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-dbt_watsonx_spark_inst)
- [Документация для IBM watsonx.data (Software)](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=integration-data-build-tool-adapter-spark)

## Установка dbt-watsonx-spark {#installing-dbt-watsonx-spark}
Примечание: установка адаптера не устанавливает `<Constant name="core" />` автоматически. Это связано с тем, что версии адаптеров и `<Constant name="core" />` разделены, чтобы избежать перезаписи существующих установок `<Constant name="core" />`. Используйте следующую команду для установки:

```sh
python -m pip install <Constant name="core" /> dbt-watsonx-spark
```

## Настройка `dbt-watsonx-spark` {#configuring-dbt-watsonx-spark}
Для параметров конфигурации, специфичных для IBM watsonx.data, см. [настройки IBM watsonx.data.](/reference/resource-configs/watsonx-spark-config)

## Подключение к IBM watsonx.data Spark {#connecting-to-ibm-watsonxdata-spark}

Чтобы подключить dbt к watsonx.data Spark, настройте профиль в файле `profiles.yml`, который находится в директории `.dbt/` вашего домашнего каталога. Ниже приведён пример конфигурации для подключения к экземплярам IBM watsonx.data SaaS и Software:

<File name='~/.dbt/profiles.yml'>

```yaml
project_name:
  target: "dev"
  outputs:
    dev:
      type: watsonx_spark
      method: http
      schema: [schema name]
      host: [hostname]
      uri: [uri]
      catalog: [catalog name]
      use_ssl: false
      auth:
        instance: [Watsonx.data Instance ID]
        user: [username]
        apikey: [apikey]
```

</File>

## Параметры host {#host-parameters}

Следующие поля профиля необходимы для настройки подключения к watsonx.data Spark. Для экземпляров IBM watsonx.data SaaS или Software, чтобы получить данные для профиля, нажмите **View connect details**, когда **query server** находится в статусе RUNNING в watsonx.data (как в SaaS, так и в Software). Откроется страница с параметрами подключения и конфигурацией профиля.
Скопируйте и вставьте эти данные подключения в файл `profiles.yml`, расположенный в директории `.dbt` вашего домашнего каталога.

Следующие поля профиля необходимы для настройки подключения к watsonx.data Spark:

| Option     | Required/Optional             |  <div style={{width:'200px'}}>Описание</div>                           | <div style={{width:'300px'}}>Пример</div>         |
| ---------- | ----------------------------- | ------------------------------------------------------------------------- | ----------------- |
| `method`   | Required |    Указывает метод подключения к Spark query server. Используйте `http`.    | `http`            |
| `schema`   | Required|    Выбор существующей схемы в Spark engine или создание новой схемы.  | `spark_schema`    |
| `host`     | Required |    Имя хоста консоли watsonx.data. Подробнее см. [Getting connection information](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=references-getting-connection-information#connection_info__conn_info_).| `https://dataplatform.cloud.ibm.com`       |
| `uri`      | Required| URI вашего query server, запущенного в watsonx.data. Подробнее см. [Getting connection information](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=references-getting-connection-information#connection_info__conn_info_). | `/lakehouse/api/v2/spark_engines/<sparkID>/query_servers/<queryID>/connect/cliservice`|
| `catalog`  | Required                      | Каталог, связанный с Spark engine.                     | `my_catalog`      |
| `use_ssl`  | Optional (default: **false**) | Указывает, следует ли использовать SSL.                                             | `true` или `false` |
| `instance` | Required                      | Для **SaaS** укажите CRN watsonx.data. Для **Software** — instance ID watsonx.data | `1726574045872688`|
| `user`     | Required                      | Имя пользователя для экземпляра watsonx.data. Для **SaaS** используйте email в качестве имени пользователя | `username` или `user@example.com`|
| `apikey`   | Required                      | Ваш API key. Подробнее: для [SaaS](https://www.ibm.com/docs/en/software-hub/5.1.x?topic=started-generating-api-keys), для [Software](https://cloud.ibm.com/docs/account?topic=account-userapikey&interface=ui#manage-user-keys)                                                       | `API key`        |

### Схемы и каталоги {#schemas-and-catalogs}

При выборе каталога убедитесь, что у пользователя есть права на чтение и запись. Этот выбор не ограничивает возможность выполнения запросов к указанной или созданной схеме, а также используется как расположение по умолчанию для материализованных `tables`, `views` и `incremental`.

### Проверка SSL {#ssl-verification}

- Если экземпляр Spark использует незащищённое HTTP-подключение, установите `use_ssl` в `false`.
- Если экземпляр использует `HTTPS`, установите значение `true`.

## Дополнительные параметры {#additional-parameters}

Следующие поля профиля являются необязательными. Вы можете настроить сессию экземпляра и поведение dbt для подключения.

| Profile field            | Описание                                                  | Пример                           |
| ------------------------ | ------------------------------------------------------------ | --------------------------------- |
| `threads`                | Количество потоков, которые должен использовать dbt (по умолчанию `1`)             | `8`                               |
| `retry_all`              | Включает автоматические повторы при временных ошибках подключения. | `true`                            |
| `connect_timeout`        | Таймаут установления соединения (в секундах).          | `5`                               |
| `connect_retries`        | Количество попыток повторного подключения при ошибках.            | `3`                               |

## Ограничения и особенности {#limitations-and-considerations}

- **Поддерживается только HTTP**: нет поддержки ODBC, Thrift или сессионных подключений.
- **Ограниченная поддержка <Constant name="cloud" />**: не полностью совместим с <Constant name="cloud" />.
- **Сохранение метаданных**: некоторые возможности dbt, такие как описания колонок, могут не сохраняться во всех форматах таблиц.
