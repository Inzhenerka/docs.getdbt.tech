---
title: "MaxCompute setup"
description: "Read this guide to learn about the MaxCompute setup in dbt."
meta:
  maintained_by: Alibaba Cloud MaxCompute Team
  authors: "Alibaba Cloud MaxCompute Team"
  github_repo: "aliyun/dbt-maxcompute"
  pypi_package: "dbt-maxcompute"
  min_core_version: "v1.8.0"
  cloud_support: Not Supported
  platform_name: "MaxCompute"
  config_page: "/reference/resource-configs/no-configs"
---

import SetUpPages from '/snippets/\_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to MaxCompute with **dbt-maxcompute**

Check out the dbt profile configuration below for details.

<File name='~/.dbt/profiles.yml'>

```yaml
dbt-maxcompute: # this needs to match the profile in your dbt_project.yml file
  target: dev
  outputs:
    dev:
      type: maxcompute
      project: PROJECT_ID
      schema: SCHEMA_NAME
      endpoint: ENDPOINT
      auth_type: access_key
      access_key_id: ACCESS_KEY_ID
      access_key_secret: ACCESS_KEY_SECRET
```

</File>

Currently it supports the following parameters:

| **Field**           | **Description**                                                                                                              | **Default Value**       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `type`              | Specifies the type of database connection; must be set to "maxcompute" for MaxCompute connections.                           | `maxcompute`            |
| `project`           | The name of your MaxCompute project.                                                                                         | N/A (Must be specified) |
| `endpoint`          | The endpoint URL for connecting to MaxCompute.                                                                               | N/A (Must be specified) |
| `schema`            | The namespace schema that the models will use in MaxCompute.                                                                 | N/A (Must be specified) |
| `auth_type`         | Authentication type for accessing MaxCompute                                                                                 | `access_key`            |
| `access_key_id`     | The Access ID for authentication with MaxCompute.                                                                            | N/A                     |
| `access_key_secret` | The Access Key for authentication with MaxCompute.                                                                           | N/A                     |
| other auth type     | such as STS, see [Authentication Configuration](https://github.com/aliyun/dbt-maxcompute/blob/master/docs/authentication.md) | N/A                     |

**Notes**: The fields marked as "N/A (Must be specified)" indicate that these values are required and do not have default values.
