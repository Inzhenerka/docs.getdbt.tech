---
title: "Подключение Amazon Athena"
id: connect-amazon-athena
description: "Настройте подключение к платформе данных Amazon Athena в dbt."
sidebar_label: "Подключение Amazon Athena"
availability:
  surface: platform
  access: login_required
---

# Подключение Amazon Athena {#connect-amazon-athena}

Чтобы использовать подключение к Amazon Athena, ваши среды должны использовать поддерживаемый [канал выпуска](/docs/dbt-versions/dbt-release-tracks).

Подключите <Constant name="dbt" /> к сервису интерактивных запросов Amazon Athena для создания проекта dbt. Ниже приведены обязательные и необязательные поля для настройки подключения к Athena:

| Поле | Вариант | Описание | Тип | Обязательное? | Пример |
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

### Учетные данные для разработки {#development-credentials}

Введите ваши учетные данные для _разработки_ (не для развертывания) с использованием следующих полей:

| Поле                  | Параметр              | Описание                                                                   | Тип    | Обязательность | Пример   |
| --------------------- | --------------------- | -------------------------------------------------------------------------- | ------ | -------- | -------- |
| AWS Access Key ID     | aws_access_key_id     | Идентификатор ключа доступа пользователя, выполняющего запросы              | String | Обязательно | AKIAIOSFODNN7EXAMPLE |
| AWS Secret Access Key | aws_secret_access_key | Секретный ключ доступа пользователя, выполняющего запросы                   | String | Обязательно | wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY |
| Схема                 | schema                | Укажите схему (базу данных Athena), в которой будут создаваться модели (только в нижнем регистре) | String | Обязательно | dbt |
| Потоки                | threads               |                                                                            | Integer| Необязательно | 3 |


### Временные учетные данные

Если вы предпочитаете не хранить долгосрочные AWS Access Key ID и AWS Secret Access Key пользователя IAM в <Constant name="dbt_platform" />, вместо этого можно использовать `aws_session_token`, который входит в состав [временных учетных данных AWS Security Token Service (STS)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html). При таком подходе сохраняются долгосрочные разрешения пользователя или роли.

Чтобы использовать временные учетные данные:
1. Введите **AWS Access Key ID** и **AWS Secret Access Key** в интерфейсе <Constant name="dbt_platform" />:
   - Для среды развертывания задайте их в [профиле подключения](/docs/platform/about-profiles).
   - Для среды разработки задайте их в [настройках среды разработки](/docs/dbt-platform-environments#create-a-development-environment).
2. Поскольку в интерфейсе <Constant name="dbt_platform" /> нет поля `aws_session_token`, добавьте его с помощью [расширенных атрибутов](/docs/dbt-platform-environments#extended-attributes). В этом разделе описано, где их настраивать для сред развертывания и разработки.

      При настройке `aws_session_token` в разделе **Extended attributes** учитывайте, что имя ключа чувствительно к регистру и должно быть в точности `aws_session_token`.

      Например, можно использовать [переменную окружения](/docs/build/environment-variables), чтобы не хранить токен в текстовом поле интерфейса:

      ```yaml
      aws_session_token: '{{ env_var(''DBT_ENV_AWS_SESSION_TOKEN'') }}'
      ```

3. [Задайте значение](/docs/build/environment-variables#setting-environment-variables) `DBT_ENV_AWS_SESSION_TOKEN`:
   - Для профиля подключения среды развертывания задайте значение в столбце **Project default**. Для проверки подключения ссылки `env_var()`, используемые в профиле, требуют значения, заданного на уровне проекта.
   - Для среды разработки можно задать переменную для этой среды.

   Поскольку срок действия временных учетных данных ограничен, необходимо обновить учетные данные STS и значение переменной до истечения этого срока.
