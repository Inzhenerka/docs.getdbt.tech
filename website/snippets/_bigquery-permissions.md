Учетным записям пользователей dbt требуются следующие разрешения для чтения данных, а также для создания таблиц и <Term id="view">views</Term> в проекте BigQuery:
- Редактор данных BigQuery
- Пользователь BigQuery

Для BigQuery с <Constant name="fusion_engine" /> пользователям также требуется:
- Пользователь сеансов чтения BigQuery (для доступа к Storage Read API)

Для работы с BigQuery DataFrames пользователям необходимы дополнительные разрешения:
- Пользователь заданий BigQuery
- Пользователь сеансов чтения BigQuery
- Пользователь среды выполнения Notebook
- Создатель кода
- colabEnterpriseUser
