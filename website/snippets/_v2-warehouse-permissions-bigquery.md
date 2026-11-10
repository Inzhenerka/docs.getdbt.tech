Удостоверение Google Cloud (сервисный аккаунт или пользователь), которое использует <Constant name="fusion_engine" />, должно иметь разрешения IAM для запуска заданий, чтения и записи данных таблиц, а также чтения метаданных, которые <Constant name="fusion" /> использует для интроспекции и проверки актуальности источников.

### Необходимые объекты Google Cloud {#required-google-cloud-objects}

Перед подключением следующие объекты должны существовать или быть доступны:

| Объект | Термин BigQuery | Назначение |
| --- | --- | --- |
| **Проект** | Проект GCP | Идентификатор вашего проекта Google Cloud |
| **Набор данных** | Набор данных | Целевой набор данных (эквивалент схемы) |
| **Сервисный аккаунт или пользователь** | Удостоверение IAM | Удостоверение для аутентификации |
| **Местоположение или регион** | Местоположение | Местоположение данных (например, `US`, `EU`, `us-east1`) |

### Разрешения IAM {#iam-permissions}

Для основных функций dbt необходимы следующие разрешения:

| Разрешение | Назначение |
| --- | --- |
| `bigquery.datasets.get` | Доступ к метаданным набора данных |
| `bigquery.tables.create` | Создание таблиц |
| `bigquery.tables.delete` | Удаление или замена таблиц |
| `bigquery.tables.get` | Чтение метаданных таблиц |
| `bigquery.tables.getData` | Чтение данных таблиц |
| `bigquery.tables.list` | Получение списка таблиц в наборе данных |
| `bigquery.tables.update` | Обновление схемы таблицы |
| `bigquery.tables.updateData` | Вставка, обновление или удаление строк |
| `bigquery.routines.get` | Чтение метаданных подпрограмм |
| `bigquery.routines.list` | Получение списка подпрограмм в наборе данных |
| `bigquery.jobs.create` | Выполнение запросов |

Следующие разрешения необязательны и нужны для дополнительных функций dbt:

| Разрешение | Когда требуется |
| --- | --- |
| `bigquery.datasets.create` | Автоматическое создание наборов данных |
| `bigquery.routines.create` | Создание UDF или хранимых процедур |
| `bigquery.jobs.get` | Отслеживание статуса заданий |
| `storage.objects.create` | Модели Python (промежуточное хранение в GCS) |
| `dataproc.*` | Модели Python в Dataproc |

#### Предопределённые роли IAM {#predefined-iam-roles}

Следующие роли обычно служат отправной точкой при настройке доступа для dbt:

| Роль | Описание | Сценарий использования |
| --- | --- | --- |
| `roles/bigquery.dataEditor` | Чтение и запись таблиц в наборах данных | Стандартные операции dbt |
| `roles/bigquery.user` | Запуск заданий, создание наборов данных | Выполнение заданий |
| `roles/bigquery.jobUser` | Только запуск заданий | Минимальные права для выполнения запросов |

Для доступа к Storage Read API с помощью <Constant name="fusion" /> также предоставьте роль **BigQuery Read Session User** (`roles/bigquery.readSessionUser`) на уровне проекта, как указано в разделе [Подключение BigQuery](/docs/platform/connect-data-platform/connect-bigquery#required-permissions).

### Операции с метаданными {#metadata-operations}

Для основных функций dbt необходимы следующие операции:

| Тип запроса | Используемый SQL или API | Необходимое разрешение |
| --- | --- | --- |
| Получение схемы таблицы | API `get_table_schema` | `bigquery.tables.get` |
| Получение списка отношений | Запрос к набору данных | `bigquery.tables.list`, `bigquery.routines.list` |
| Проверка актуальности источников | Запрос к метаданным `__TABLES__` | `bigquery.tables.get` |
| Получение статистики таблицы | Запрос к `INFORMATION_SCHEMA` | `bigquery.tables.get` |
| Создание набора данных | `CREATE SCHEMA` | `bigquery.datasets.create` |

### INFORMATION_SCHEMA и представления метаданных {#information_schema-and-metadata-views}

dbt v2 выполняет запросы к следующим системным представлениям BigQuery:

| Представление | Назначение | Область действия |
| --- | --- | --- |
| `INFORMATION_SCHEMA.TABLES` | Получение списка таблиц | Набор данных или регион |
| `INFORMATION_SCHEMA.COLUMNS` | Метаданные столбцов | Набор данных или регион |
| `INFORMATION_SCHEMA.VIEWS` | Определения представлений | Набор данных или регион |
| `INFORMATION_SCHEMA.PARTITIONS` | Информация о секциях | Только набор данных |
| `__TABLES__` (устарело) | Время изменения таблиц | Набор данных |

### BigQuery DataFrames (необязательно) {#bigquery-dataframes}

Для рабочих процессов BigQuery DataFrames пользователям обычно требуются дополнительные роли, такие как `BigQuery Job User`, `BigQuery Read Session User`, `Notebook Runtime User`, `Code Creator` и `colabEnterpriseUser`. Точные названия ролей в вашей организации уточните у администратора Google Cloud.
