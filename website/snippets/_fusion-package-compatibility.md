<!--remove when the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection-->


**Inconsistencies between Fusion package warnings and dbt-autofix logs** 

If you use autofix while upgrading to <Constant name="fusion" /> in the <Constant name="cloud_ide" />, you may see different messages about package compatibility between [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) and <Constant name="fusion" />. Fusion warnings are emitted based on a package's `require-dbt-version` and whether `require-dbt-version` contains `2.0.0`. There are certain packages that are already Fusion compatible, but package maintainers have not updated `require-dbt-version` yet. `dbt-autofix` is aware of these <Constant name="fusion" />-compatible package versions and will not attempt to upgrade these packages if your project is already using a <Constant name="fusion" />-compatible package version. 

This message mismatch is temporary while we implement and roll-out `dbt-autofix`'s enhanced compatibility detection to <Constant name="fusion" /> warnings. 

Here's an example of a <Constant name="fusion" /> warning in the <Constant name="cloud_ide" /> that says a package isn't compatible with <Constant name="fusion" /> but `dbt-autofix` indicates it is compatible:
```text
dbt1065: Package 'dbt_utils' requires dbt version [>=1.30,<2.0.0], but current version is 2.0.0-preview.72. This package may not be compatible with your dbt version. dbt(1065) [Ln 1, Col 1]
```
