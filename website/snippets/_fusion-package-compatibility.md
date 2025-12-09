<!--remove when the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection-->
When upgrading to <Constant name="fusion" /> in the <Constant name="cloud_ide" />, you will see different messages about package compatibility. This message mismatch is temporary while the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection.

In the <Constant name="cloud_ide" />, you will see deprecation warnings about packages not being <Constant name="fusion" />-compatible, while [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) indicates they are compatible. `dbt-autofix` will always be the source of truth— because in this scenario because it has additional context that deprecation warnings don't yet have. 

Here's an example of a deprecation warning in the <Constant name="cloud_ide" /> that says a package isn't compatible with <Constant name="fusion" /> but `dbt-autofix` indicates it is compatible:
```text
dbt1065: Package 'dbt_utils' requires dbt version [>=1.30,<2.0.0], but current version is 2.0.0-preview.72. This package may not be compatible with your dbt version. dbt(1065) [Ln 1, Col 1]
```
