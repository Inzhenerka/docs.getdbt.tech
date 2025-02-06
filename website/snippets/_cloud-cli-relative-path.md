The dbt Cloud CLI doesn't currently support relative paths in the [`packages.yml` file](/docs/build/packages).

For example, trying to install [a local package](/docs/build/packages#local-packages) (`shared_macros` directory) in your `packages.yml` file won't work:

```yaml
# repository_root/my_dbt_project_in_a_subdirectory/packages.yml

packages:
  - local: ../shared_macros
```

In this example, `../shared_macros` is a relative path that tells dbt to look for:
- `..` &mdash; Go one directory up (to repository_root).
- `/shared_macros` &mdash; Find the `shared_macros` folder in the root directory.

To work around this limitation, use the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud), which supports relative paths for this use case.
