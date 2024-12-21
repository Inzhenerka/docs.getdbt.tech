# Проекты с открытым исходным кодом

Ищете хорошее место, чтобы начать вносить вклад в код? dbt Labs поддерживает следующие репозитории с открытым исходным кодом, организованные по языкам, которые в основном нужны для вклада:

## Python

- [dbt-core](https://github.com/dbt-labs/dbt-core/discussions) - основная общая функциональность, обеспечивающая работу dbt
- [hubcap](https://github.com/dbt-labs/hubcap) - код, обеспечивающий работу dbt Package hub
- адаптеры - [код, специфичный для хранилищ данных, который связывает ядро с различными платформами](https://docs.getdbt.com/docs/contributing/adapter-development/1-what-are-adapters), разработка для нескольких крупных платформ поддерживается dbt Labs:
  - [dbt-bigquery](https://github.com/dbt-labs/dbt-bigquery)
  - [dbt-snowflake](https://github.com/dbt-labs/dbt-snowflake)
  - [dbt-redshift](https://github.com/dbt-labs/dbt-redshift)
  - [dbt-spark](https://github.com/dbt-labs/dbt-spark)

## dbt

- [Пакеты dbt Labs](https://hub.getdbt.com/dbt-labs/) - пакеты dbt, созданные и поддерживаемые dbt Labs. Пакеты — это просто проекты dbt, поэтому если вы знаете SQL, Jinja и YAML, необходимые для работы в dbt, вы можете вносить вклад в пакеты.

## YAML и JSON Конфигурация

- [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) - обеспечивает автозаполнение и проверку YAML конфигурации в проектах dbt.

## Shell

- [dbt-completion.bash](https://github.com/dbt-labs/dbt-completion.bash) - предоставляет автозаполнение команд CLI и селекторов, таких как модели и тесты, для bash и zsh.