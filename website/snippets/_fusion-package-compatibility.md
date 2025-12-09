<!--remove when the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection-->
When upgrading to <Constant name="fusion" /> in the <Constant name="cloud_ide" />, you might see conflicting messages about package compatibility. 

For example, you might see deprecation warnings about packages not being <Constant name="fusion" />-compatible, while [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) indicates they are compatible. `dbt-autofix` is the source of truth— because it has additional context that deprecation warnings don't yet have. This message misalignment is temporary while the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection.

Here's an example of a deprecation warning that says a package isn't compatible with <Constant name="fusion" /> but `dbt-autofix` indicates it is compatible:
```text
dbt1065: Package 'dbt_utils' requires dbt version [>=1.30,<2.0.0], but current version is 2.0.0-preview.72. This package may not be compatible with your dbt version. dbt(1065) [Ln 1, Col 1]
```
