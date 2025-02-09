---
title: "IBM watsonx.data Spark setup"
description: "Read this guide to learn about the IBM watsonx.data Spark setup in dbt."
id: "watsonx-Spark-setup"
meta:
  maintained_by: IBM
  authors: Bayan Albunayan, Reema Alzaid, Manjot Sidhu 
  github_repo: 'IBM/dbt-watsonx-spark'
  pypi_package: 'dbt-watsonx-spark'
  min_core_version: v0.0.8
  cloud_support: 'Supported'
  min_supported_version: 'n/a'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM watsonx.data
  config_page: /reference/resource-configs/watsonx-Spark-config
---

The dbt-watsonx-Spark adapter allows you to use dbt to transform and manage data on IBM watsonx.data Spark(Java), leveraging its distributed SQL query engine capabilities. Before proceeding, ensure you have the following:
<ul>
  <li>An active IBM watsonx.data Spark(Java) engine with connection details (host, port, catalog, schema) in SaaS/Software.</li>
  <li>Authentication credentials: Username and password/apikey.</li>
  <li>For watsonx.data instances, SSL verification is required for secure connections. If the instance host uses HTTPS, there is no need to specify the SSL certificate parameter. However, if the instance host uses an unsecured HTTP connection, ensure you provide the path to the SSL certificate file.</li>
</ul>
Refer to [Configuring dbt-watsonx-Spark](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=spark-configuration-setting-up-your-profile) for guidance on obtaining and organizing these details.


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Connecting to IBM watsonx.data Spark

To connect dbt with watsonx.data Spark, you need to configure a profile in your `profiles.yml` file located in the `.dbt/` directory of your home folder. The following is an example configuration for connecting to IBM watsonx.data SaaS and Software instances:

<File name='~/.dbt/profiles.yml'>

```yaml
my_project:
  outputs:
     dev:
      type: "watsonx_spark"
      method: "http"
      schema: "<wxd-schema>"
      host: "https://<host-url>"
      uri: "/lakehouse/api/v2/spark_engines/<engine-id>/query_servers/<query_servers_id>/connect/cliservice"
      auth:
        instance: "<instance-id>"
        user: "<username>"
        apikey: "<apikey>"
  target: "dev"

```

</File>

## Host parameters

The following profile fields are required to configure watsonx.data Spark connections. For IBM watsonx.data SaaS or Software instances, you can get the `profile` details by clicking **View connect details** after `the query server` is in RUNNING stat, The Connection details page opens with the profile configuration.
Copy the connection details. Then Paste the connection details in the profiles.yml file that is located in .dbt of your home directory


| Option    | Required/Optional | Description | Example  |
| --------- | ------- | ------- | ----------- |
| `method`  | Required | Specifies the authentication method for secure connections. Use `http` when connecting to IBM watsonx.data SaaS or Software instances. | `http` |
|   `user`  | Required | Username or email address for authentication. | `user` |
| `apikey`| Required | API key for authentication | `apikey` |
|   `host`  | Required | Hostname for connecting to Spark. | `https://cpd-cpd-instance.apps.mss-wxd.cp.fyre.ibm.com` |
| `instance`| Required | The instance id that connect to spark. | `172657404587268` |
|  `schema` | Required | The table schema name that is associated with the Spark engine that you need to run the dbt models. | `my_schema`  |
    Note: If you are using Iceberg catalog, specify the schema in the format <catalog_name>.<schema_name>.
|   `uri`  | Required | we provide uri to conect to ur query server.  

## Additional parameters

The following profile fields are optional to set up. They let you configure your instance session and dbt for your connection. 


| Profile field  |  Description                                                                                                | Example                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------         |
| `use_ssl`      | Optional (default: **true**) | To disable SSL connection, add the key use_ssl with the value False for your project.| `false`                              |
| `location_root`| Optional In case you want to create a new schema in your bucket, add the key location_root with the value,| `s3a://{your_bukect_name}/{your_schema_name}`. |
