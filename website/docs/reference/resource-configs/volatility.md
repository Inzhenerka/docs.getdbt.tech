---
title: volatility
sidebar_label: "volatility"
id: volatility
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      volatility: deterministic | stable | non-deterministic
```

</File>

## Definition

import VolatilityDefinition from '/snippets/_volatility-definition.md';

<VolatilityDefinition />

By default, dbt does not specify a volatility value. If you don’t set volatility, dbt generates a `CREATE` statement without a volatility keyword, and the warehouse’s default behavior applies &mdash; except in Redshift. In Redshift, dbt sets `non-deterministic` (`VOLATILE`) by default if no volatility is specified, because Redshift requires an explicit volatility and `VOLATILE` is the safest assumption.

import Volatility from '/snippets/_warehouse-volatility.md';

<Volatility />

## Supported volatility types

### `deterministic`

A `deterministic` function always returns the same output for the same input. Because its results are predictable, the warehouse can safely apply aggressive optimizations and caching.

For example, `substr()` returns the same substring when given the same string and parameters.

### `stable`

A `stable` function returns the same value throughout a single query execution, but its result may change across different executions. Not supported by all warehouses. For more information, see [Warehouse-specific volatility keywords](/reference/resource-configs/volatility#warehouse-specific-volatility-keywords).

For example, `now()` returns the current timestamp the moment a query starts. Its value is constant within a single query but different across runs.

### `non-deterministic`

A `non-deterministic` function may return different results for the same inputs. Warehouses should not cache these results or reorder expressions in ways that assume stability.

For example, `first()` may return different rows depending on the query plan or ordering. `random()` returns a random number that varies with each call, even with identical inputs.

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
