Учетным записям пользователей dbt требуются следующие разрешения для чтения данных, а также для создания таблиц и <Term id="view">views</Term> в проекте BigQuery:
- Редактор данных BigQuery
- Пользователь BigQuery

<VersionBlock firstVersion="1.12">

При сканировании наборов данных dbt получает список подпрограмм BigQuery (функций и хранимых процедур) и сведения о них. Если вы используете пользовательскую роль IAM вместо предопределённой, также предоставьте следующие разрешения:
- `bigquery.routines.list`: получение списка подпрограмм в наборе данных
- `bigquery.routines.get`: чтение метаданных подпрограмм

Без этих разрешений dbt может не обнаружить существующие таблицы, а некоторые операции поиска могут завершиться ошибкой. Предопределённые роли, такие как BigQuery Data Editor, обычно уже включают эти разрешения.

</VersionBlock>

Для работы с BigQuery при использовании <Constant name="fusion_engine" /> пользователям также нужна роль:
- BigQuery Read Session User (для доступа к Storage Read API)

Чтобы использовать функцию [«История запросов»](/docs/explore/model-query-history#bigquery-model-query-history), добавьте роль:
- BigQuery Resource Viewer

Для работы с BigQuery DataFrames пользователям нужны следующие дополнительные роли:
- BigQuery Job User
- BigQuery Read Session User
- Notebook Runtime User
- Code Creator
- colabEnterpriseUser
