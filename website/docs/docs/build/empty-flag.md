---
title: "About the empty flag"
description: "Use the empty flag to test your code and build your tables withoug populating data."
sidebar_label: "The empty flag"
pagination_next: "docs/build/sample-flag"
pagination_prev: null
---

# About the `--empty` flag

There are cases during dbt development where you'll want to validate that your models are semantically correct without the time-consuming cost of building the entire model in the data warehouse. The [`run`](/reference/commands/run) and [`build`](/reference/commands/run) commands support the `--empty` flag for building schema-only dry runs. The `--empty` flag limits the refs and sources to zero rows. dbt will still execute the model SQL against the target data warehouse but will avoid expensive reads of input data. This validates dependencies and ensures your models will build properly.

### Examples

Run the entire project while building only the schemas in your development environment:

```
dbt run --empty
```

Build a specific model:

```
dbt run --select path/to/your_model --empty
```

dbt will then build and execute the SQL, resulting in an empty schema in the data warehouse.

