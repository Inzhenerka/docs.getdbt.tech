To determine if a package is compatible with the <Constant name="fusion_engine" />, visit the [dbt package hub](https://hub.getdbt.com/) and review the package's `require-dbt-version` configuration. Packages with a `require-dbt-version` that equals or contains `2.0` are compatible with <Constant name="fusion"/>.

Additionally, the Fivetran `source` and `transformation` packages have been combined into a single package. If you manually installed source packages like `fivetran/github_source`, you need to ensure `fivetran/github` is installed and deactivate the transformation models.

Package maintainers that would like make their package compatible with <Constant name="fusion"/> can refer to the [Fusion package upgrade guide](/guides/fusion-package-compat) for instructions.
