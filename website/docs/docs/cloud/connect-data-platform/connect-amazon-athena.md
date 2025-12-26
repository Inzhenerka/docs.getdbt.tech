---
title: "Подключение Amazon Athena"
id: connect-amazon-athena
description: "Настройка подключения к платформе данных Amazon Athena в dbt."
sidebar_label: "Подключение Amazon Athena"
---

# Подключение Amazon Athena

Ваши окружения должны находиться на поддерживаемой [версии](/docs/dbt-versions/cloud-release-tracks), чтобы использовать подключение Amazon Athena.

Подключите <Constant name="cloud" /> к интерактивному сервису запросов Amazon Athena, чтобы создать свой dbt‑проект. Ниже перечислены обязательные и необязательные поля для настройки подключения к Athena:

| Field                         | Option           | Description                                                                                                   | Type    | Required? | Example |
| ----------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------- | ------- | --------- | ------- |
| AWS region name               | region_name      | Регион AWS, в котором развернут ваш экземпляр Athena                                                           | String  | Required  | eu-west-1 |
| Database (catalog)            | database         | Укажите базу данных (Data Catalog), в которую будут собираться модели (только в нижнем регистре)             | String  | Required  | awsdatacatalog |
| AWS S3 staging directory      | s3_staging_dir   | S3‑расположение для хранения результатов запросов Athena и метаданных                                          | String  | Required  | s3://bucket/dbt/ |
| Athena workgroup              | work_group       | Идентификатор workgroup в Athena                                                                               | String  | Optional  | my-custom-workgroup |
| Athena Spark workgroup        | spark_work_group | Идентификатор Athena Spark workgroup для запуска Python‑моделей                                                 | String  | Optional  | my-spark-workgroup |
| AWS S3 data directory         | s3_data_dir      | Префикс для хранения таблиц, если он отличается от s3_staging_dir подключения                                  | String  | Optional  | s3://bucket2/dbt/ |
| AWS S3 data naming convention | s3_data_naming   | Способ генерации путей к таблицам в s3_data_dir                                                                | String  | Optional  | schema_table_unique |
| AWS S3 temp tables prefix     | s3_tmp_table_dir | Префикс для хранения временных таблиц, если он отличается от s3_data_dir подключения                           | String  | Optional  | s3://bucket3/dbt/ |
| Poll interval                 | poll_interval    | Интервал в секундах для опроса статуса выполнения запросов в Athena                                            | Integer | Optional  | 5 |
| Query retries                 | num_retries      | Количество попыток повторного выполнения запроса в случае ошибки                                               | Integer | Optional  | 3 |
| Boto3 retries                 | num_boto3_retries| Количество повторных попыток для запросов boto3 (например, при удалении файлов S3 для материализованных таблиц)| Integer | Optional  | 5 |
| Iceberg retries               | num_iceberg_retries| Количество повторных попыток выполнения iceberg commit‑запросов для исправления ICEBERG_COMMIT_ERROR        | Integer | Optional  | 0 |

### Учетные данные для разработки

Введите ваши учетные данные для _разработки_ (не для развертывания) с использованием следующих полей:

| Поле                 | Опция                | Описание                                                                | Тип    | Обязательно | Пример  |
| -------------------- | -------------------- | ----------------------------------------------------------------------- | ------ | ----------- | -------- |
| Идентификатор ключа доступа AWS | aws_access_key_id     | Идентификатор ключа доступа пользователя, выполняющего запросы          | Строка | Обязательно | AKIAIOSFODNN7EXAMPLE |
| Секретный ключ доступа AWS | aws_secret_access_key | Секретный ключ доступа пользователя, выполняющего запросы               | Строка | Обязательно | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY |
| Схема                | schema                | Укажите схему (базу данных Athena) для создания моделей (только строчные буквы) | Строка | Обязательно | dbt |
| Потоки               | threads               |                                                                            | Целое число | Необязательно | 3 |