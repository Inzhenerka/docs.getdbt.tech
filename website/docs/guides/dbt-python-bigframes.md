---
title: "Quickstart for using BigQuery Dataframes with dbt python models"
id: dbt-python-bigframes
description: "Use this guide to help you setup dbt Core with BigQuery Dataframes (BigFrames)."
sidebar_label: "Quickstart for BigQuery Dataframes and dbt python"
# time_to_complete: '30 minutes' comment out until test
icon: 'guides'
hide_table_of_contents: true
tags: ['BigQuery', 'Google', 'GCP', 'Bigframes','Quickstart']
keywords: ['BigQuery','dbt Core', 'Google']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

This guide will help you set up dbt Core to be used with BigQuery Dataframes (Bigframes).

In addition to the existing dataproc/pyspark based submission methods for executing python models, you can now use the bigframes submission method to execute pandas and scikit- learn code at scale on the BigQuery SQL engine.

BigQuery Dataframes  is an open source python package that transpiles pandas and sci-kit learn code to scalable BigQuery SQL. The dbt-bigquery adapter relies on the BigQuery Studio Notebook Executor Service to run the python client side code.


### What you'll use during the lab

- A [Google Cloud account](https://cloud.google.com/free) 
- A [dbt Cloud account](https://www.getdbt.com/signup/) or dbt Core Setup

### What you'll learn

- How to build scalable data transformation pipelines using dbt and Google Cloud, with SQL and Python.
- How to leverage Bigframes from dbt for scalable BigQuery SQL.

### What you need to know

- Basic to intermediate SQL and python.
- Basic understanding of dbt fundamentals. We recommend the [dbt Fundamentals course](https://learn.getdbt.com) if you're interested.

### What you'll build

This guide contains three sections:
- Google Cloud project configuration
    - One shot initial configuration on the project you want to use
- Client side configuration
    - One shot initial configuration of the dbt runner node
- Execute a python model

<Lightbox src="/img/guides/gcp-guides/gcp-bigframes-architecture.png" title="Implementation of the bigframes submission method"/>

**Figure 1** - Implementation of the bigframes submission method for dbt python models

Overall we are going to set up the environments, build scalable pipelines in dbt, and execute a python model.

## Configure Google Cloud

The dbt bigframes submission method supports both service account and OAuth credentials. Take the service account as an example.

1. **Create a new Google Cloud Project**

Your new project will have the following list of APIs already enabled, including BigQuery, which is required.

[Default APIs](https://cloud.google.com/service-usage/docs/enabled-service#default)

Then enable the BigQuery API which also enables the following additional APIs automatically
[BigQuery API's](https://cloud.google.com/bigquery/docs/enable-assets#automatic-api-enablement)


2. **Create a service account and grant IAM permissions**

This service account will be used by dbt to read and write data on BigQuery and use BigQuery Studio Notebooks

```python
#Create Service Account
gcloud iam service-accounts create dbt-bigframes-sa
#Grant BigQuery User Role
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.user
#Grant BigQuery Data Editor role. This can be restricted at dataset level
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/bigquery.dataEditor
#Grant Service Account user 
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/iam.serviceAccountUser
#Grant Colab Entperprise User
gcloud projects add-iam-policy-binding ${GOOGLE_CLOUD_PROJECT} --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/aiplatform.colabEnterpriseUser
```

NOTE: There are other optional IAM requirements required to apply for using remote functions and ML remote models.

[Remote Functions](https://cloud.google.com/bigquery/docs/use-bigquery-dataframes#remote-function-requirements)

[ML Remote Models](https://cloud.google.com/bigquery/docs/use-bigquery-dataframes#remote-models)

3. *(Optional)* **Create a test BigQuery Dataset**

Create a new BigQuery Dataset if you don't already have one.

```python
#Create BQ dataset 
bq mk --location=${REGION} echo "${GOOGLE_CLOUD_PROJECT}" | tr '-' '_'_dataset
```

4. *(Optional)* **Create a GCS bucket to stage the python code**

If you wish to store the python compiled code on a GCS bucket, create a new one.

```python
#Create GCS bucket
gcloud storage buckets create gs://${GOOGLE_CLOUD_PROJECT}-bucket --location=${REGION}
#Grant Storage Admin over the bucket to your SA 
xgcloud storage buckets add-iam-policy-binding gs://${GOOGLE_CLOUD_PROJECT}-bucket --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/storage.admin
```

5. **Create a GCS bucket to hold the logs**
```python
#Create GCS bucket
gcloud storage buckets create gs://${GOOGLE_CLOUD_PROJECT}-bucket-logs --location=${REGION}
#Grant Storage Admin over the bucket to your SA 
gcloud storage buckets add-iam-policy-binding gs://${GOOGLE_CLOUD_PROJECT}-bucket-logs --member=serviceAccount:dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com --role=roles/storage.admin
```

## Client Side Configuration 
[Not required in dbt Cloud]

This is the configuration of the server where the dbt python package will be installed (e.g. local dev environment, GCE, GKE ..)

1. **Install dbt-core and the dbt-bigquery adapter**

NOTE: This assumes bigframes support is already available on the dbt-bigquery package

```python
pip install dbt-core dbt-bigquery
```
2. **Generate a service account JSON key**
This guide uses the service account JSON Key as auth method, which is the preferred method for production environments. 
[Alternatives found here.](https://docs.getdbt.com/docs/core/connect-data-platform/bigquery-setup#authentication-methods)
```python
#Generate the JSON key
gcloud iam service-accounts keys create dbt-bigframes-sa-key.json --iam-account=dbt-bigframes-sa@${GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com
```

3. **Start and configure a new dbt project**
```python
dbt init
```
Enter values on the interactive shell:
- Enter dbt project name. 
- Select bigquery as database [1]
- Select service account as authentication method [2]
- Enter path of the JSON keyfile
- Enter GCP project name. 
- Enter BQ dataset 
- Leave threads to 1 for development purposes
- Leave timeout to the default value of 300 
- Select location e.g. us-central1

4. **Edit dbt profile.yml under $HOME/.dbt

For example (`service account` credential)

```yaml
my_dbt_project_sa:
  outputs:
    dev:
      dataproc_region: us-central1
      dataset: jialuo_test_us
      gcs_bucket: jialuo_bf_dbt_integration_dev1
      job_execution_timeout_seconds: 300
      job_retries: 1
      keyfile: /usr/local/google/home/jialuo/dbt_t2/secrets/sa_key.json
      location: US
      method: service-account
      priority: interactive
      project: bigframes-dbt-integration-dev
      threads: 1
      type: bigquery
  target: dev
```

OR ('Oauth' credential)

```yaml
my_dbt_project:
  outputs:
    dev:
      dataproc_region: us-central1
      dataset: jialuo_test_us
      gcs_bucket: jialuo_bf_dbt_dev2
      job_execution_timeout_seconds: 300
      job_retries: 1
      location: US
      method: oauth
      priority: interactive
      project: bigframes-dev-perf
      threads: 1
      type: bigquery
  target: dev
```
Please note, the bigframes submission method does **NOT** introduce any new configuration in profile.yml under $HOME/.dbt.

5. Set Bigframes submission method

Set bigframes submission method by either 

(a) Project level configuration via dbt_project.yml, OR

For example

```python
# Name your project! Project names should contain only lowercase characters
# and underscores. A good package name should reflect your organization's
# name or the intended use of these models
name: 'my_dbt_project'
version: '1.0.0'

…

# Configuring models
# Full documentation: https://docs.getdbt.com/docs/configuring-models

# In this example config, we tell dbt to build all models in the example/
# directory as views. These settings can be overridden in the individual model
# files using the `{{ config(...) }}` macro.
models:
  my_dbt_project:
    submission_method: bigframes
    # Config indicated by + and applies to all files under models/example/
    example:
      +materialized: view
```

(b) The Python code via dbt.config, which you will be creating later and can overwrite (a)

For example

```python
def model(dbt, session):
   # Will overwrite the submission method setup in dbt_project.yml
   dbt.config(submission_method="bigframes")

   bdf = dbt.ref("my_sql_model") #loading from prev step
   <process bigquery dataframe >
   return bdf
```

## Execute a python model

1. **Add a new .py file on your dbt project**

Now, you can add python models to your dbt project models folder.

For example

```python
def model(dbt, session):
   # Will overwrite the submission method setup in dbt_project.yml
   dbt.config(submission_method="bigframes")

   bdf = dbt.ref("my_sql_model") #loading from prev step
   <process bigquery dataframe >
   return bdf
```

```python
# Already set bigframes submission method in dbt_project.yml
def model(dbt, session):  
   data = {"foo": [1, 2], "bar": [3, 4]}
   return bpd.DataFrame(data=data)
```

2. **Execute the dbt pipeline**
```
> dbt run
22:31:57  Running with dbt=1.9.3
22:31:59  Registered adapter: bigquery=1.9.2-a0
22:31:59  Unable to do partial parsing because saved manifest not found. Starting full parse.
22:32:01  Found 3 models, 4 data tests, 493 macros
22:32:01  
22:32:01  Concurrency: 1 threads (target='dev')
22:32:01  
22:32:03  1 of 3 START python table model jialuo_test_us.my_bigframes_model .............. [RUN]
22:35:52  BigQuery adapter: The colab notebook runtime outputs from GCS: 

```Some outputs of the Colab notebook from bigframes, which is stored in GCS```

22:35:52  1 of 3 OK created python table model jialuo_test_us.my_bigframes_model ......... [OK in 228.85s]
22:35:52  2 of 3 START sql table model jialuo_test_us.my_first_dbt_model ................. [RUN]
22:35:55  2 of 3 OK created sql table model jialuo_test_us.my_first_dbt_model ............ [CREATE TABLE (2.0 rows, 0 processed) in 3.25s]
22:35:55  3 of 3 START sql view model jialuo_test_us.my_second_dbt_model ................. [RUN]
22:35:56  3 of 3 OK created sql view model jialuo_test_us.my_second_dbt_model ............ [CREATE VIEW (0 processed) in 0.96s]
22:35:56  
22:35:56  Finished running 2 table models, 1 view model in 0 hours 3 minutes and 55.30 seconds (235.30s).
22:35:56  
22:35:56  Completed successfully
22:35:56  
22:35:56  Done. PASS=3 WARN=0 ERROR=0 SKIP=0 TOTAL=3
```

OR, just execute the selected model
```
> dbt run --select [your_bigframes_model]

...
```

3. **You can observe the python execution in the dbt logs**
For example
```
data:
    text/html: ['Query job eaa77dfe-1e17-492e-815d-4728d65a07e3 is DONE. 0 Bytes processed. <a target="_blank" href="https://console.cloud.google.com/bigquery?project=bigframes-dev-perf&j=bq:US:eaa77dfe-1e17-492e-815d-4728d65a07e3&page=queryresults">Open Job</a>']
    text/plain: ['<IPython.core.display.HTML object>']
metadata:
output_type:
    display_data

data:
    text/html: ['Query job dfe0d09d-3579-4838-beb3-567f4f9543c0 is DONE. 0 Bytes processed. <a target="_blank" href="https://console.cloud.google.com/bigquery?project=bigframes-dev-perf&j=bq:US:dfe0d09d-3579-4838-beb3-567f4f9543c0&page=queryresults">Open Job</a>']
    text/plain: ['<IPython.core.display.HTML object>']
metadata:
output_type:
    display_data
```

4. *(Optional)* **You can also go to the Colab Enterprise Executions tab and GCS bucket from the GCP console to view the codes and logs (including previous executions).**

The 'Runtime Templates' tab:

<Lightbox src="/img/guides/gcp-guides/gcp-bigframes-runtime.png" title="Runtime Templates"/>

Note:

If no `default` runtime template is available, it will automatically create one for the user and mark it `default` for next time usage.
To get the permissions that you need to create a runtime template in Colab Enterprise, ask your administrator to grant you the Colab Enterprise Admin (roles/aiplatform.colabEnterpriseAdmin) IAM role on the project ([runtime template link](https://cloud.google.com/colab/docs/create-runtime-template#:~:text=By%20creating%20a%20runtime%20template,characteristics%20based%20on%20your%20needs.)).

The 'Executions' tab:
<Lightbox src="/img/guides/gcp-guides/gcp-bigframes-executions.png" title="Executions"/>

The 'Results' and 'Source Notebook' will also be written into the specified bucket:
<Lightbox src="/img/guides/gcp-guides/gcp-bigframes-source.png" title="Source Notebook"/>

## FAQs

### Which new bigframes related config options are supported by the adapter?

We don’t introduce any new config option for dbt bigframes mode, but update/use on some existing options in the dbt bigframes mode: 
- submission_method = bigframes
    - Indicates to use the Notebook Execution Service to execute the python code
    - Its setup to (dataproc) serverless by default
- dataproc_region(same as dataproc)
    - Defines the region for the notebook and runtime.
    - (TODO) We plan to rename this to compute_region for broader applicability here, requiring changes in dbt-adapters.
- gcs_log_bucket (same as dataproc)
    - Specifies the Google Cloud Storage bucket for storing compiled code and execution results
- project (same as dataproc)
    - Define the bigquery project.
- location (same as dataproc)
    - Define the bigquery location.

### Is it required to create a GCS bucket to stage the python code?
Yes, a GCS bucket is needed because we will always write the compiled code and execution logs/outputs into  the bucket.

### How can I manage/delete past executions?
You can [manually delete past executions](https://cloud.google.com/colab/docs/schedule-notebook-run#delete-results) or use the API as any other Google Cloud Service.

### How can I manage/delete past executions?
As long as you use the Default Runtime template, you will be billed via BQ slots as described [here](https://cloud.google.com/bigquery/pricing#external_services). If you choose to use a custom runtime, you will be billed using the standard Colab Enterprise billing as described [here](https://cloud.google.com/colab/pricing).

### How to use the runtime template?
Users don’t need to worry about it because  we will automatically check for them and create new one when needed:
- If users already have a default runtime template in the system (it has to be the one with the default flag), we will keep using it to create a runtime.
- If users  don’t have a default runtime template, we will create it and make it default. Then  we will keep using it to create a runtime unless users manually change the default flag.

### What are the specifications of the default notebook runtime template?
At the time of writing this guide, Its a e2-standard-4 machine with 100 GB Standard Disk (pd-standard).

### My python client code includes heavy processing outside pandas, can I set a  custom notebook runner with increased resources?
- No, we don’t directly support custom notebook runners (deleted this functionality already).
- Users can do it manually by modifying the default flag from the GCP console.

### Argolis specific considerations for CEs
- Networking configuration
- Org policies (constraints/compute.vmExternalIpAccess, constraints/compute.requireShieldedVm)


</div>