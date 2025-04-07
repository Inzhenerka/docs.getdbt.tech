:::tip
From dbt Core v1.10, you can opt into validating the arguments you define in macro documentation using the `validate_macro_args` behavior change flag. When enabled, dbt will:

- Infer arguments from the macro and includes them in the [manifest.json](/reference/artifacts/manifest-json) file if no arguments are documented.

Learn more about [macro argument validation](/reference/resource-properties/arguments#supported-types).
:::
