Учетным записям пользователей dbt требуются следующие разрешения для чтения данных, а также для создания таблиц и <Term id="view">views</Term> в проекте BigQuery:
- BigQuery Data Editor
- BigQuery User

Для BigQuery с <Constant name="fusion_engine" /> пользователям также требуется:
- BigQuery Read Session User (для доступа к Storage Read API)

Для работы с BigQuery DataFrames пользователям необходимы дополнительные разрешения:
- BigQuery Job User
- BigQuery Read Session User
- Notebook Runtime User
- Code Creator
- colabEnterpriseUser
