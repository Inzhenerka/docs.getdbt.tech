---
title: "Hybrid setup"
sidebar_label: "Hybrid setup"
description: "Learn how to set up hybrid projects in dbt Cloud."
---

# Hybrid setup <Lifecycle status='beta,enterprise'/>

<IntroText>
Set up Hybrid projects to upload dbt Core artifacts into dbt Cloud for better collaboration and visibility.
</IntroText>

:::tip Available in private beta
To join the private beta, you must have an active dbt Cloud Enterprise account. Register here or reach out to your account representative.
:::

## How it works

<!-- will summarize the below even further and use content to break them down in additional h2s for instructions -->
add a flowchart or something that explains in bullet how it works

## Set up Hybrid projects

In a hybrid project, you use dbt Core locally and can upload artifacts of that dbt Core project to dbt Cloud for central visibility, cross-project referencing, and easier collaboration. 

This setup requires connecting your dbt Core project to a dbt Cloud project and configuring a few environment values and access settings.

Follow these steps to set up Hybrid projects and upload dbt Core artifacts into dbt Cloud:

<!--no toc --> 
- [Hybrid setup ](#hybrid-setup-)
  - [How it works](#how-it-works)
  - [Set up Hybrid projects](#set-up-hybrid-projects)
    - [Make dbt Core models public](#make-dbt-core-models-public)
    - [Connect project in dbt Cloud](#connect-project-in-dbt-cloud)
    - [Enable artifact upload](#enable-artifact-upload)
    - [Configure dbt Core project and upload artifacts](#configure-dbt-core-project-and-upload-artifacts)
    - [Review artifacts in dbt Cloud](#review-artifacts-in-dbt-cloud)
  - [Integrate dbt Mesh workflows](#integrate-dbt-mesh-workflows)

### Make dbt Core models public

Before connecting your dbt Core project a dbt Cloud project, you should make sure the dbt Core models that you want to share use `access: public` in their model configuration. This setting makes those models visible to other dbt Cloud projects for better collaboration, such as [cross-project referencing](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref). 

The easiest way to set this would be in your dbt_project.yml file, however you can set this in the following places:
- `dbt_project.yml` (project-level)
- `properties.yml` (for individual models)
- A model’s `.sql` file using a `config` block

Here’s an example using a dbt_project.yml file where the marts directory is set as public so they can be consumed by downstream tools.

<File name="dbt_project.yml">
```yaml
models:
  define_public_models: # This is my project name, remember it must be specified
    marts:
      +access: public
```
</File>

After defining `access: public`, rerun a dbt execution (like `dbt run`) to apply the change.

For more details on how to set this up, see Learn more about [access modifier](/docs/collaborate/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access). 

### Connect project in dbt Cloud

To connect a dbt Core project with dbt Cloud, check out the following steps. A dbt Cloud Account admin should perform the following steps and share the artifacts information with a dbt Core user.

1. To create a new project in dbt Cloud, navigate to **Account home**.
2. Click on **+New project**. Fill out the **Project name** and **Project subdirectory**. Name the project something that allows you to recognize it's a dbt Core project. 
   - You don't need to set up a data warehouse or Git connection, however to upgrade the hybrid project to a full dbt Cloud project, you'd need to set up data warehouse and Git.
3. Select the **Hybrid development** checkbox to link the dbt Core project to the dbt Cloud project.
4. Click **Continue**.
5. Create a [production environment](/docs/deploy/deploy-environments#create-a-deployment-environment)
6. (Optional) For existing dbt projects, navigate to **Account settings** and then select the **Project**. Click **Edit** and then check the **Hybrid development** checkbox.

### Enable artifact upload
Follow these steps to configure your dbt Core project so it's ready to upload generated artifacts to dbt Cloud:

1. Before configuring you dbt Core project, go to your Hybrid project Environment.
2. Select the **Artifact upload** button and copy the following values. You’ll need them to configure your dbt Core’s `dbt_project.yml` file in the next step:
   - Tenant URL
   - Account ID
   - Environment ID

### Configure dbt Core project and upload artifacts

1. In your local dbt Core project, add the following items you copied in the previous step, to the dbt Core's `dbt_project.yml` file:
   - Tenant URL
   - Account ID (using the `DBT_CLOUD_ACCOUNT_ID` environment variable prefix)
   - Environment ID (using the `DBT_CLOUD_ENVIRONMENT_ID` environment variable prefix)
   ```yaml
        name: "jaffle_shop"
        version: "3.0.0"
        require-dbt-version: ">=1.5.0"
            
        ....rest of dbt_project.yml configuration...
            
        dbt-cloud:
        project-id: 123456 # Your dbt Cloud project ID
        tenant: cloud.getdbt.com # Replace with your tenant URL
        DBT_CLOUD_ACCOUNT_ID: 1 # Replace with your account ID
        DBT_CLOUD_ENVIRONMENT_ID: 173 # Replace with your environment ID
    ```

2. Execute a `dbt run` in the CLI by prefixing the following variables to upload the artifacts into dbt Cloud's orchestrator.
   - Replace the `1` and `173` with your actual account ID and environment ID:
   - ```bash
    DBT_CLOUD_ACCOUNT_ID=1 DBT_CLOUD_ENVIRONMENT_ID=173 dbt run
    ```
3. Review the logs to confirm a successfully artifacts upload message. If there are any errors, resolve them by checking out the debug logs.

### Review artifacts in dbt Cloud
Now that you've uploaded dbt Core artifacts into dbt Cloud and executed a `dbt run`, you can view the artifacts job run:
1. Navigate to **Deploy**
2. Click on **Jobs** and select the job that says...'System'???

## Integrate dbt Mesh workflows

Now that you've integrated dbt Core artifacts with you dbt Cloud project, you can now:
- Seamlessly perform cross project references between dbt Core projects and dbt Cloud projects
- Navigate [dbt Explorer](/docs/collaborate/explore-projects) as a dbt Core user and view data assets. To view dbt Explorer, you must have a [read-only seat](/docs/cloud/manage-access/seats-and-users).
- anything else?
