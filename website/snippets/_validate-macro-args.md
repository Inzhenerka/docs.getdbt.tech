:::tip
From dbt Core v1.10, you can opt into validating the arguments you define in macro documentation using the `validate_macro_args` behavior change flag. When enabled, dbt will:

- Raise a warning if documented argument names don’t match the macro definition.
- Raise a warning if `type` fields don’t follow [supported formats](/reference/resource-properties/arguments#supported-types).

dbt will:
- Raise a warning if documented argument names don’t match the macro definition.
- Raise a warning if `type` fields don’t follow [supported formats](/reference/resource-properties/arguments#supported-types).

Learn more about [macro argument validation](/reference/resource-properties/arguments#supported-types).
:::
