<Expandable alt_header="Ключевые слова для указания волатильности, зависящие от хранилища данных">

Разные хранилища данных поддерживают управление волатильностью с помощью разных ключевых слов и значений по умолчанию:

| Warehouse | `deterministic` | `stable` | `non-deterministic` |
| --- | --- | --- | --- |
| [Snowflake](https://docs.snowflake.com/en/sql-reference/sql/create-function#sql-handler) | `IMMUTABLE` | Не поддерживается | `VOLATILE` (по умолчанию) |
| [Redshift](https://docs.aws.amazon.com/redshift/latest/dg/r_CREATE_FUNCTION.html#r_CREATE_FUNCTION-synopsis) | `IMMUTABLE` | `STABLE` | `VOLATILE` (по умолчанию) |
| [Databricks](https://docs.databricks.com/aws/en/udf/unity-catalog#set-deterministic-if-your-function-produces-consistent-results) | `DETERMINISTIC` | Не поддерживается | Считается `non-deterministic`, если не указано явно |
| [Postgres](https://www.postgresql.org/docs/current/xfunc-volatility.html) | `IMMUTABLE` | `STABLE` | `VOLATILE` (по умолчанию) |

BigQuery не поддерживает явную установку волатильности. Вместо этого BigQuery определяет волатильность на основе функций и выражений, используемых внутри UDF.

</Expandable>
