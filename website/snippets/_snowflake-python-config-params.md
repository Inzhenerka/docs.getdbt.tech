| Параметр | Тип | По умолчанию | Описание |
| :-------- | :--- | :------ | :---------- |
| `python_version` | `<string>` | `3.10` | Версия Python, на которой выполняется модель Snowpark. |
| `packages` | `<list>` | `[]` | Пакеты Anaconda, устанавливаемые при выполнении модели. dbt всегда добавляет `snowflake-snowpark-python`. |
| `imports` | `<list>` | `[]` | Файлы в области промежуточного хранения (stage), например zip-файлы, которые нужно сделать доступными для модели. См. раздел [Сторонние пакеты Snowflake](/reference/resource-configs/snowflake-configs#third-party-snowflake-packages). |
| `external_access_integrations` | `<list>` | `[]` | Интеграции внешнего доступа Snowflake, позволяющие модели обращаться к внешним API. |
| `secrets` | `<dictionary>` | `{}` | Сопоставляет имя переменной в коде с секретом Snowflake. Используйте вместе с `external_access_integrations`. |
| `use_anonymous_sproc` | `<boolean>` | `True` | Если задано `True`, dbt выполняет модель как анонимную хранимую процедуру. Если задано `False`, dbt создаёт именованную процедуру (`<model_name>__dbt_sp`), вызывает её, а затем удаляет. |
