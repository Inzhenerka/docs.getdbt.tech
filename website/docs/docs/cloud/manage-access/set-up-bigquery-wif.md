---
title: "Set up BigQuery WIF"
description: "Learn how configure dbt Cloud and BigQuery to use workload identity federation"
id: "set-up-bigquery-wif"
pagination_next: null
---

# Set up BigQuery workload identity federation <Lifecycle status='beta,managed'/> 

Workload identity federation (WIF) allows application workloads, running externally to dbt Cloud, to act as a service account without the need to manage service accounts or other keys. The following instructions will enable you to authenticate your BigQuery connection in dbt Cloud using WIF. 

## Set up dbt Cloud

To configure a BigQuery connection to use WIF authentication in dbt Cloud, you must set up a custom OAuth integration configured with details from the Entra application used as your workpool provider in GCP.

In dbt Cloud: 

1. Navigate to **Account settings** --> **Integrations** 
2. Scroll down to the section for **Custom OAuth Integrations** and create a new integration, 
3. Fill out all fields with the appropriate information from your Entra ID environment.
    - The Application ID URI should be set to the expected audience claim on tokens issued from the Entra application. It will be the same URI your workpool provider has been configured to expect.
    - You do not have to add the Redirect URI to your Entra application

## Create connections in dbt Cloud

To get started, create a new connection in dbt Cloud:

1. Navigate to **Account settings** --> **Connections**.
2. Click **New connection** and select **BigQuery** as the connection type.
3. You will be presented with two schema options for the connection (both use the same adapter):
    - **BigQuery:** Select this option to configure WIF.
    - **BigQuery (Legacy):** Still valid for other connection types but does not support WIF.

    <Lightbox src="/img/docs/dbt-cloud/wif/bigquery-adapter.png" title="Select the BigQuery adapter option." />

Continue to the section that matches your development environment workflows:
- Development environment uses [native OAuth](#wif-and-native-oauth)
- Development environment uses [service account credentials](#wif-and-service-account)

### WIF and native OAuth

If you are using native OAuth for development environments: 

1. For the **Deployment Environment Authentication Method**, select **Workload Identity Federation**. 
2. Fill out the **Google Cloud Project ID** and any optional settings you’d like. 
3. Scroll to the **External OAuth Configurations** section and select the Entra ID integration you configured in the first section. 
4. If you use native OAuth for development environments, navigate to the **OAuth2.0 Settings** section and fill out the relevant details per the instructions [here](/docs/cloud/manage-access/set-up-bigquery-oauth).


### WIF and service account

If you are using service account authentication for development environments and WIF for deployment environments, you will need to create two separate connections: 

1. For the **Deployment Environment Authentication Method**, select **Workload Identity Federation**. 
2. Fill out the **Google Cloud Project ID** and any optional settings you’d like. 
3. Scroll to the **External OAuth Configurations** section and select the Entra ID integration you configured in the first section. 
4. To configure service account authentication, upload your JSON file. Fill out any optional settings you’d like to use and save the connection. Be sure to give your connections descriptive names for easier lookup later.

## Set up project

To connect a new project to your WIF configuration:
1. Navigate to **Account settings** --> **Projects**.
2. Click **New project**. 
3. Give your project a name and (optional) subdirectory path and click **Continue**.
4. Select the **Connection** with the WIF configuration.
5. Configure the remainder of the project with the appropriate fields.

## Set up deployment environment

Create a new or update an existing environment to use the WIF connection. 

When you set your environment connection to the WIF configuration, you will then see two fields appear under the Deployment credentials section: 
- **Workload pool provider path:** This field is required for all WIF configurations.
    Example: `//iam.googleapis.com/projects/<numeric_project_id>/locations/global/workloadIdentityPools/<workpool_name>/providers/<workpool_providername>`
- **Service account impersonation URL:** Used only if you’ve configured your workpool to use a service account impersonation for accessing your BigQuery resources (as opposed to granting the workpool direct resource access to the BigQuery resources).
    Example: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts<serviceaccountemail>:generateAccessToken`

If you don’t already have a job based on the deployment environment with a connection set up to use WIF, you should create one now. Once you’ve configured it with the preferred settings, run the job.
