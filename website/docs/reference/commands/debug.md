---
title: "About dbt debug command"
sidebar_label: "debug"
description: "Use dbt debug to test database connections and check system setup."
intro_text: "Use dbt debug to test database connections and check system setup."
---

`dbt debug` is a utility function to test the database connection and display information for debugging purposes, such as the validity of your project file, the [dbt version](/reference/dbt-jinja-functions/dbt_version), and your installation of any requisite dependencies (like `git` when you run `dbt deps`).

It checks your database connection, local configuration, and system setup across multiple axes to help identify potential issues before running dbt commands.

By default, `dbt debug` validates:
- **Database connection** (for configured profiles)
- **dbt project setup** (e.g., `dbt_project.yml` validity)
- **System environment** (OS, Python version, installed dbt version)
- **Required dependencies** (such as `git` for `dbt deps`)
- **Adapter details** (installed adapter versions and compatibility)

*Note: Not to be confused with [debug-level logging](/reference/global-configs/logs#debug-level-logging) via the `--debug` option which increases verbosity.

## Example usage

Only test the connection to the data platform and skip the other checks `dbt debug` looks for:

```shell
$ dbt debug --connection
```

Show the configured location for the `profiles.yml` file and exit:

```text
$ dbt debug --config-dir
To view your profiles.yml file, run:

open /Users/alice/.dbt
```
