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

The `volatility` config is an optional config that describes how predictable a UDF’s output is. Warehouses use this to decide if results can be cached, reordered, or inlined. Setting the appropriate volatility helps prevent incorrect results when a function isn’t safe to cache or reorder.

By default, dbt does not specify a volatility value. If you don’t set volatility, dbt generates a `CREATE` statement without a volatility keyword, and the warehouse’s default behavior applies.

## Supported volatility types

### deterministic

A deterministic function always returns the same output for the same input. Because its results are predictable, the warehouse can safely apply aggressive optimizations and caching.

### stable

A stable function returns the same value throughout a single query execution, but its result may change across different executions.

### non-deterministic

A non-deterministic function may return different results for the same inputs. Warehouses should not cache these results or reorder expressions in ways that assume stability.

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
