<!--remove when the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection-->

When upgrading to <Constant name="fusion" /> in the <Constant name="cloud_ide" />, you may see conflicting package-compatibility messages from deprecation warnings and `dbt-autofix`. This is temporary while deprecation warnings catch up to [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix)'s improved detection.

The <Constant name="cloud_ide" /> may warn that a package isn’t <Constant name="fusion" />-compatible even though `dbt-autofix` reports that it is. `dbt-autofix` is the source of truth, as it has additional context (like running its own integration tests) that the current warnings don’t yet incorporate.

Here's an example of a deprecation warning in the <Constant name="cloud_ide" /> that says a package isn't compatible with <Constant name="fusion" /> but `dbt-autofix` indicates it is compatible:
```text
dbt1065: Package 'dbt_utils' requires dbt version [>=1.30,<2.0.0], but current version is 2.0.0-preview.72. This package may not be compatible with your dbt version. dbt(1065) [Ln 1, Col 1]
```
