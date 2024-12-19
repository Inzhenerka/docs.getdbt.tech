# Проекты с открытым исходным кодом

Ищете хорошее место для участия в разработке кода? dbt Labs поддерживает следующие репозитории с открытым исходным кодом, организованные по языку, который в первую очередь необходим для внесения вклада:

## Python

- [dbt-core](https://github.com/dbt-labs/dbt-core/discussions) - основная общая функциональность, обеспечивающая работу dbt
- [hubcap](https://github.com/dbt-labs/hubcap) - код, обеспечивающий работу хаба пакетов dbt
- адаптеры - [код, специфичный для хранилищ, который связывает core с различными платформами](https://docs.getdbt.com/docs/contributing/adapter-development/1-what-are-adapters), разработка для нескольких основных платформ поддерживается dbt Labs:
  - [dbt-bigquery](https://github.com/dbt-labs/dbt-bigquery)
  - [dbt-snowflake](https://github.com/dbt-labs/dbt-snowflake)
  - [dbt-redshift](https://github.com/dbt-labs/dbt-redshift)
  - [dbt-spark](https://github.com/dbt-labs/dbt-spark)

## dbt

- [пакеты dbt Labs](https://hub.getdbt.com/dbt-labs/) - пакеты dbt, созданные и поддерживаемые dbt Labs. Пакеты представляют собой просто проекты dbt, поэтому если вы знаете SQL, Jinja и YAML, необходимые для работы в dbt, вы можете внести вклад в пакеты.

## Конфигурация YAML и JSON

- [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) - обеспечивает автозаполнение и линтинг для конфигурации YAML в проектах dbt.

## Shell

- [dbt-completion.bash](https://github.com/dbt-labs/dbt-completion.bash) - предоставляет автозаполнение команд CLI и селекторов, таких как модели и тесты, для bash и zsh.