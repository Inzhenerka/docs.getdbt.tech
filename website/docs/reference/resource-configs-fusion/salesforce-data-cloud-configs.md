---
title: "Salesforce Data Cloud configurations"
description: "Salesforce Data Cloud Configurations - Read this in-depth guide to learn about configurations in dbt."
id: "data-cloud-configs"
---

⚠️ Disclaimer: This adapter is in the Alpha product stage and thus is not production-ready. It should only be used in sandbox or test environments. 
As we continue to develop and take in your feedback, the experience is subject to change — commands, configuration, and workflows may be updated or removed in future releases.


## Supported Materializations

| Materialization | Supported | Notes |
| --- | --- | --- |
| View | ❌ |  |
| Table | ✅ | Outputs to a data transform and DLO. Check out docs for more |
| Incremental | ❌ | Coming soon |
| Ephemeral | ❌ |  |
| Seeds | ❌ |  |
| Sources | ✅ | Required |
| Custom data tests | ❌ |  |
| Snapshots | ❌ |  |


### Sources
dbt models in your Data Cloud dbt project querying raw data must select from a dbt Source. This means you cannot select straight from a DLO. 

```yml
version: 2

sources:
  - name: default
    tables:
       - name: raw_customers__dll
         description: "Customers raw table stored in default dataspace"   
         columns:
            - name: id__c 
              description: "Customer ID"
              data_tests:
                - not_null
                - unique
            - name: first_name__c
              description: "Customer first name"
            - name: last_name__c
              description: "Customer last name"
            - name: email__c
              description: "Customer email address"
              data_tests:
                - not_null
                - unique
```                

### Table Materialization 
dbt supports the Table materialization on Salesforce Data Cloud. Execution of the materialization will result in the creation of a [batch Data Transform](https://help.salesforce.com/s/articleView?id=data.c360_a_batch_transform_overview.htm&language=en_US&type=5) and a [Data Lake Object (DLO)](https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_concepts_data_cloud_objects.htm) for querying. 

Today we only support a `profile` type DLO but will be supporting `engagement` soon. Profile DLOs require primary keys to be supplied. 


```sql
{{ config(
    materialized='table',
    primary_key='customer_id__c',
    category='Profile'
) }}

   select

        id__c as customer_id__c,
        first_name__c,
        last_name__c,
        email__c as customer_email__c

    from {{ source('default', 'raw_customers__dll') }}


```

## Salesforce Data Cloud Callouts
- All dbt Model names must end with __dll. If you omit this suffix in your file name, it will be appended automatically during execution (e.g., model_name becomes model_name__dll). This will break downstream dbt references because dbt will look for a DLO named `model_name` when Data Cloud has `model_name__dll. 
- Columns must end with __c. If you omit this suffix, Data Cloud will error out with an “unknown syntax” error message. 
- Model names cannot contain __ outside of the final __dll. For example, supplies__agg__dll will build as agg__dll, which can cause confusion for downstream refs.
- For category=profile, all dbt models must be configured with `primary_key` and `category=profile` in the model configuration. You can also apply the configurations in a resources.yml and dbt_project.yml. 

## Known Limitations
- **Reruns of dbt models**: Due to the Data Cloud architecture of metadata and dependency management, dbt is unable to rerun the same dbt model twice if Data Transform and DLO has been created. This is because dbt can not drop the Data Lake Object (DLO) during subsequent runs on table materializations (as expected on data warehouses). If your logic has changed between runs in the model, you will have to delete the dependencies of the Data Transform and DLO manually in the UI prior to executing a `dbtf run` This will be resolved when Data Cloud releases `auto-update`. 
- **Static Analysis on VS Code**: This impacts features like Column-level lineage, dbt Buttons for build, run test. All commands must include `--static-analysis off` for execution.  
- **Arbitrary queries** (e.g., SELECT 1 AS foo) All queries must be tied to a defined dbt source prior to building a dbt model on it.
- **`select *`** Due to the metadata system columns that are injected into every DLO by Data Cloud, the standard way dbt approaches metadata queries is failing. Bug fix in progress.







