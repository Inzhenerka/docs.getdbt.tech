---
title: entry_point
sidebar_label: "entry_point"
id: entry-point
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      runtime_version: <string> # required for Python UDFs
      entry_point: <string> # required for Python UDFs
```

</File>

## Definition

When creating Python UDFs, specify the Python function to be called in `entry_point`.

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Volatility](/reference/resource-configs/volatility)
- [runtime_version](/reference/resource-configs/runtime-version)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
