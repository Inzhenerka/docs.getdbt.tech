---
title: "Подключение Hologres к dbt v1"
sidebar_label: "Hologres"
description: "Прочитайте это руководство, чтобы узнать о настройке Alibaba Cloud Hologres в dbt."
meta:
  maintained_by: Alibaba Cloud Hologres Team
  authors: "Alibaba Cloud Hologres Team"
  github_repo: "aliyun/dbt-hologres"
  pypi_package: "dbt-alibaba-cloud-hologres"
  min_core_version: "v1.8.0"
  cloud_support: Not Supported
  platform_name: "Hologres"
  config_page: "/reference/resource-configs/no-configs"
availability: local_free
---


import SetUpPages from '/snippets/\_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Подключение к Hologres с помощью **dbt-alibaba-cloud-hologres**

`dbt-alibaba-cloud-hologres` позволяет dbt работать с Alibaba Cloud Hologres — хранилищем данных реального времени, совместимым с PostgreSQL.

Подробности приведены ниже в конфигурации профиля dbt.

<File name='~/.dbt/profiles.yml'>

```yaml
dbt-alibaba-cloud-hologres: # это имя должно совпадать с именем профиля в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: hologres
      host: HOST_NAME
      port: 80
      user: USER_NAME
      password: PASSWORD
      database: DATABASE_NAME
      schema: SCHEMA_NAME
      threads: 4
```

</File>

### Параметры подключения

В настоящее время поддерживаются следующие параметры:

| **Поле**           | **Описание**                                                                                       | Обязательный? | **По умолчанию**           | **Пример**                                      |
| ------------------ | -------------------------------------------------------------------------------------------------- | --------- | -------------------------- | ----------------------------------------------- |
| `type`             | Тип подключения к базе данных; для подключения к Hologres необходимо задать "hologres".             | Да        | -                          | `hologres`                                      |
| `host`             | Имя хоста конечной точки для подключения к экземпляру Hologres.                                     | Да        | -                          | `hgxxx-xxx.hologres.aliyuncs.com`            |
| `port`             | Номер порта для подключения к Hologres.                                                             | Нет       | `80`                       | `80`                                            |
| `user`             | Имя пользователя для аутентификации в Hologres (с учётом регистра).                                  | Да        | -                          | `AccessKey ID`                           |
| `password`         | Пароль для аутентификации в Hologres (с учётом регистра).                                            | Да        | -                          | `AccessKey Secret`                                 |
| `database`         | Имя вашей базы данных Hologres.                                                                    | Да        | -                          | `my_database`                                   |
| `schema`           | Схема по умолчанию, которую модели будут использовать в Hologres (укажите пустую строку "", если схема не нужна). | Да | -                          | `public`                                        |
| `threads`          | Количество потоков для параллельного выполнения.                                                   | Нет       | `1`                        | `4`                                             |
| `connect_timeout`  | Время ожидания подключения в секундах.                                                             | Нет       | `10`                       | `10`                                            |
| `sslmode`          | Режим SSL для подключения.                                                                        | Нет       | `disable`                  | `disable`                                       |
| `application_name` | Идентификатор приложения для отслеживания подключений.                                             | Нет       | `dbt_hologres_{version}`   | `my_dbt_app`                                    |
| `retries`          | Количество повторных попыток подключения.                                                          | Нет       | `1`                        | `3`                                             |

## Настройка аутентификации

`dbt-alibaba-cloud-hologres` использует стандартный механизм аутентификации, совместимый с PostgreSQL, с именем пользователя и паролем (Access Key). Hologres поддерживает аутентификацию с помощью Alibaba Cloud AccessKey или учётных данных пользователя RAM.

### Ключ доступа

Вы можете пройти аутентификацию с помощью учётных данных вашей учётной записи Alibaba Cloud. В целях безопасности рекомендуется создать дочернюю учётную запись RAM с соответствующими разрешениями, а не использовать AccessKey основной учётной записи.

```yaml
jaffle_shop: # это имя должно совпадать с именем профиля в файле dbt_project.yml
  target: dev
  outputs:
    dev:
      type: hologres
      host: hgxxx-cn-shanghai.hologres.aliyuncs.com  # Замените на конечную точку вашего экземпляра Hologres
      port: 80
      user: your_access_key_id  # Замените на ваш AccessKeyId
      password: your_access_key_secret  # Замените на ваш AccessKeySecret
      database: my_database  # Замените на имя вашей базы данных
      schema: public  # Замените на имя вашей схемы
      threads: 4
      connect_timeout: 10
      sslmode: disable
```

### Важные замечания

1. **Чувствительность к регистру**: имена пользователей и пароли Hologres чувствительны к регистру. Убедитесь, что вы вводите их в точности так, как они заданы.

2. **Порт по умолчанию**: порт по умолчанию для Hologres — `80`, что отличается от стандартного порта PostgreSQL `5432`.

3. **Режим SSL**: по умолчанию SSL для подключений к Hologres отключён. При необходимости его можно включить, задав подходящее значение параметра `sslmode`.

## Проверка подключения

После настройки `profiles.yml` вы можете проверить подключение, выполнив:

```bash
dbt debug
```

Эта [команда](/reference/commands/debug) проверит подключение к вашему экземпляру Hologres и сообщит о проблемах с конфигурацией.

## Особенности Hologres

### Динамические таблицы в Hologres

Динамические таблицы — это реализация материализованных представлений с автоматическим обновлением в Hologres. 
При обновлении данных поддерживается несколько режимов, включая "full" (полный режим) и "incremental" (инкрементальный режим). Дополнительные сведения см. в [справочном руководстве](https://www.alibabacloud.com/help/en/hologres/user-guide/introduction-to-dynamic-table).
Вы можете настроить их в своих моделях dbt:

```yaml
models:
  my_model:
    materialized: dynamic_table
    freshness: "30 minutes"
    auto_refresh_mode: auto
    computing_resource: serverless
```

Поддерживаемые параметры настройки динамических таблиц:

| **Параметр**          | **Описание**                                                       | **Примеры значений**                  |
| --------------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `freshness`           | Требование к актуальности данных.                                  | `"30 minutes"`, `"1 hours"`           |
| `auto_refresh_mode`   | Режим обновления динамической таблицы.                              | `auto`, `incremental`, `full`         |
| `computing_resource`  | Вычислительный ресурс для обновления.                               | `serverless`, `local`, имя вычислительного хранилища |

### Инкрементальные модели в dbt

`dbt-alibaba-cloud-hologres` поддерживает несколько инкрементальных стратегий:

- `append`: добавление новых записей
- `delete+insert`: удаление совпадающих записей и вставка новых
- `merge`: использование оператора MERGE для операций вставки или обновления (upsert)
- `microbatch`: обработка данных небольшими пакетами

### Ограничения

Полная поддержка ограничений базы данных, включая:

- Первичные ключи
- Ограничения NOT NULL

### Свойства таблиц

Hologres поддерживает следующие свойства таблиц. Подробные сведения см. в
[справочной документации для разработчиков](https://www.alibabacloud.com/help/en/hologres/developer-reference/create-tables).

| Свойство | Рекомендации |
|--------|----------------|
| `orientation` | Используйте `column` для нагрузок OLAP и `row` для запросов типа «ключ — значение» |
| `distribution_key` | Выбирайте столбцы, часто используемые при соединении или группировке; предпочтительно использовать один столбец |
| `clustering_key` | Используйте для столбцов с фильтрацией по диапазону; не более 3 столбцов; соблюдайте принцип совпадения по левому префиксу |
| `event_time_column` | Задавайте для данных временных рядов (столбцов с временными метками) |
| `bitmap_columns` | Используйте для фильтров на равенство |
| `dictionary_encoding_columns` | Используйте для строковых столбцов с небольшим числом уникальных значений |

## Справочные материалы

- [Репозиторий dbt-alibaba-cloud-hologres на GitHub](https://github.com/aliyun/dbt-hologres)
- [Документация Hologres](https://www.alibabacloud.com/help/en/hologres/)
- [Руководство по динамическим таблицам Hologres](https://www.alibabacloud.com/help/en/hologres/user-guide/introduction-to-dynamic-table)
