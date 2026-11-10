---
title: "Подключение IBM Db2 к dbt v1"
sidebar_label: "IBM Db2"
description: "В этом руководстве описана настройка IBM Db2 в dbt."
id: "ibm-db2-setup"
meta:
  maintained_by: IBM
  authors: Shubham Kapoor, Amit Kumar
  github_repo: 'IBM/db2-dbt'
  pypi_package: 'ibm-dbt-db2'
  min_core_version: v1.11.0
  cloud_support: 'Not Supported'
  min_supported_version: 'IBM Db2 LUW 9.7+, z/OS 11+, iSeries'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM Db2
  config_page: /reference/resource-configs/ibm-db2-config
---


Адаптер `ibm-dbt-db2` позволяет использовать dbt для преобразования данных и управления ими в IBM Db2, задействуя широкие возможности SQL на платформах LUW (Linux, Unix, Windows), z/OS и iSeries. Прежде чем продолжить, убедитесь, что у вас есть:
- Работающий экземпляр базы данных IBM Db2 (LUW, z/OS или iSeries) и сведения для подключения (хост, порт, база данных, схема и т. д.).
- Учетные данные для аутентификации: имя пользователя и пароль.
- Python 3.10, 3.11 или 3.12 (Python 3.9 не поддерживается из-за требований dbt-core 1.11+).

Примечание: этот адаптер несовместим с <Constant name="core_v2" />.

Подробнее о получении и организации этих сведений см. в разделе [Настройка ibm-dbt-db2](https://github.com/IBM/db2-dbt).


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Подключение к IBM Db2

Чтобы подключить dbt к IBM Db2, необходимо настроить профиль в файле `profiles.yml`, расположенном в каталоге `.dbt/` вашей домашней папки. Ниже приведен пример конфигурации для подключения к экземплярам IBM Db2:

<File name='~/.dbt/profiles.yml'>

```yaml
my_db2_project:
  outputs:
    dev:
      type: db2
      host: [hostname]
      port: 50000
      database: [database name]
      schema: [schema name]
      username: [username]
      password: [password]
      threads: [1 or more]

  target: dev

```

</File>


### Подключение с использованием SSL/TLS

Для защищенного подключения можно настроить параметры SSL/TLS:

<File name='~/.dbt/profiles.yml'>

```yaml
my_db2_project:
  outputs:
    prod:
      type: db2
      host: [hostname]
      port: 50001
      database: [database name]
      schema: [schema name]
      username: [username]
      password: [password]
      threads: [1 or more]
      # Настройки SSL/TLS
      security: SSL
      ssl_server_certificate: /path/to/server-ca.crt
      ssl_client_hostname_validation: true
      retries: 3

  target: prod

```

</File>


### Подключение с использованием DSN

В качестве альтернативы можно использовать имя источника данных (DSN), настроенное в клиенте Db2:

<File name='~/.dbt/profiles.yml'>

```yaml
my_db2_project:
  outputs:
    dev:
      type: db2
      dsn: MY_DB2_DSN
      schema: [schema name]
      threads: [1 or more]

  target: dev

```

</File>


## Параметры хоста

Используйте следующие обязательные и необязательные поля профиля для настройки подключений к IBM Db2.

| Параметр    | Обязательный/необязательный | Описание | Пример  |
| --------- | ------- | ------- | ----------- |
|   `type`  | Обязательный | Тип адаптера. Должен быть `db2`. | `db2` |
|   `host`  | Обязательный* | Имя хоста для подключения к Db2. | `localhost` |
|   `port`  | Необязательный | Порт для подключения к Db2. | `50000` |
| `database`| Обязательный | Имя базы данных в вашем экземпляре Db2. | `SAMPLE` |
|  `schema` | Обязательный | Имя схемы в базе данных вашего экземпляра Db2. | `ADMIN`  |
| `username`| Обязательный | Имя пользователя для аутентификации. | `db2user` |
| `password`| Обязательный | Пароль для аутентификации. | `password` |
| `threads` | Необязательный | Количество потоков для параллельного выполнения. | `8` |
|   `dsn`   | Необязательный | Имя источника данных (альтернатива host/port/database). | `MY_DB2_DSN` |

*Не требуется при использовании `dsn`

### Необязательные параметры SSL/TLS

| Параметр    | Обязательный/необязательный | Описание | Пример  |
| --------- | ------- | ------- | ----------- |
| `security` | Необязательный | Протокол безопасности. Используйте `SSL` для включения SSL/TLS. | `SSL` |
| `ssl_server_certificate` | Необязательный | Путь к файлу сертификата центра сертификации сервера для проверки SSL. | `/path/to/server-ca.crt` |
| `ssl_client_keystore` | Необязательный | Путь к базе данных хранилища ключей клиента (файл .kdb) для взаимной аутентификации TLS. | `/path/to/client.kdb` |
| `ssl_client_keystash` | Необязательный | Путь к файлу keystash клиента (файл .sth). | `/path/to/client.sth` |
| `ssl_client_hostname_validation` | Необязательный | Включение проверки имени хоста (true/false). | `true` |
| `retries` | Необязательный | Количество повторных попыток подключения. | `3` |


## Схемы и базы данных
При выборе базы данных и схемы убедитесь, что у вас есть доступ на чтение и запись к обеим. Этот выбор не ограничивает ваши возможности выполнять запросы к базе данных. Вместо этого они задают расположение по умолчанию, в котором материализуются таблицы и представления.


## Поддерживаемые возможности

| Возможность | Поддерживается | Примечания |
|---------|-----------|-------|
| Материализация в таблицу | ✅ Да | |
| Материализация в представление | ✅ Да | |
| Инкрементальная материализация | ✅ Да | Поддерживает стратегии `merge` и `delete+insert` |
| Эфемерная материализация | ✅ Да | |
| Seeds | ✅ Да | Требуется явная настройка типов данных |
| Снимки | ✅ Да | |
| Тесты | ✅ Да | |
| Документация | ✅ Да | |
| Источники | ✅ Да | |
| Пользовательские схемы | ✅ Да | |
| Предоставление прав доступа | ✅ Да | |
| Ограничения | ⚠️ Частично | Соблюдение NOT NULL обеспечивается, остальных ограничений — нет |


## Типы данных

Адаптер сопоставляет типы данных dbt с типами Db2:

| Тип dbt | Тип Db2 |
|----------|----------|
| string | VARCHAR |
| text | VARCHAR(max_length) |
| integer | INTEGER |
| bigint | BIGINT |
| float | FLOAT |
| numeric | DECIMAL |
| boolean | BOOLEAN |
| timestamp | TIMESTAMP |
| date | DATE |
| time | TIME |


## Инкрементальные модели

Адаптер `ibm-dbt-db2` поддерживает две инкрементальные стратегии:

1. **merge** (по умолчанию) — использует оператор MERGE в Db2 для эффективного обновления существующих и вставки новых записей
2. **delete+insert** — удаляет совпадающие записи, а затем вставляет новые

Пример инкрементальной модели:

```sql
{{
  config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='merge'
  )
}}

SELECT * FROM source_table
{% if is_incremental() %}
WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
```


## Чувствительность к регистру

По умолчанию Db2 приводит идентификаторы без кавычек к верхнему регистру. Адаптер обрабатывает это автоматически, но учитывайте следующее:

- Имена таблиц и столбцов без кавычек будут приведены к верхнему регистру
- Используйте кавычки в SQL, чтобы сохранить регистр: `"MyTable"` в отличие от `MYTABLE`


## Примечания

- Адаптер `ibm-dbt-db2` основан на драйвере Python `ibm_db` (версия 3.2.8), который автоматически устанавливается вместе с адаптером.
- **Требования к версии Python**: требуется Python 3.10, 3.11 или 3.12. Python 3.9 не поддерживается из-за требований к зависимостям <Constant name="dbt" /> v1.11+. Python 3.13+ пока не тестировался.
- **Ограничения**: ограничения CHECK, UNIQUE, PRIMARY KEY и FOREIGN KEY определяются, но их соблюдение не обеспечивается Db2 в контексте dbt. Обеспечивается соблюдение только ограничений NOT NULL.
- **Ограничение LISTAGG**: функция LISTAGG в Db2 не поддерживает ограничение количества агрегируемых значений.
