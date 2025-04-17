# Open source projects

Looking for a good place to get involved contributing code? <Constant name="dbt" /> Labs supports the following OSS repos, organized by the language primarily needed for contribution:

## Python

- [<Constant name="core" />](https://github.com/dbt-labs/dbt-core/discussions) - the primary shared functionality powering dbt
- [hubcap](https://github.com/dbt-labs/hubcap) - the code powering the dbt Package hub
- adapters - [the warehouse specific code that wires core up to various platforms](https://docs.getdbt.com/docs/contributing/adapter-development/1-what-are-adapters), several major platforms’ development is supported by dbt Labs:
  - [dbt-bigquery](https://github.com/dbt-labs/dbt-bigquery)
  - [dbt-snowflake](https://github.com/dbt-labs/dbt-snowflake)
  - [dbt-redshift](https://github.com/dbt-labs/dbt-redshift)
  - [dbt-spark](https://github.com/dbt-labs/dbt-spark)

## dbt

- [<Constant name="dbt" /> Labs' packages](https://hub.getdbt.com/dbt-labs/) - the <Constant name="dbt" /> pacakges created and supported by <Constant name="dbt" /> Labs. Packages are just <Constant name="dbt" /> projects, so if you know the SQL, Jinja, and YAML necessary to work in <Constant name="dbt" />, you can contribute to packages.

## YAML and JSON Config

- [<Constant name="dbt" />-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) - powering completion and linting for YAML configuration in <Constant name="dbt" /> projects.

## Shell

- [<Constant name="dbt" />-completion.bash](https://github.com/dbt-labs/dbt-completion.bash) - provides shell completion of CLI commands and selectors such as models and tests for bash and zsh.
