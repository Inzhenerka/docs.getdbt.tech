---
title: "Hybrid setup"
sidebar_label: "Hybrid setup"
description: "Learn how to set up hybrid projects in dbt Cloud."
intro_text: "Set up Hybrid projects to upload dbt Core artifacts into dbt Cloud for better collaboration and visibility."
---

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
    
    - [Make dbt Core models public](https://www.notion.so/Beta-Hybrid-projects-192bb38ebda780e2bbcac781873f1b9d?pvs=21)
    - [Connect a project](https://www.notion.so/Beta-Hybrid-projects-192bb38ebda780e2bbcac781873f1b9d?pvs=21)
    - [Configure project in dbt core project](https://www.notion.so/Beta-Hybrid-projects-192bb38ebda780e2bbcac781873f1b9d?pvs=21)
    - [Review artifacts in dbt Cloud](https://www.notion.so/Beta-Hybrid-projects-192bb38ebda780e2bbcac781873f1b9d?pvs=21)
    - Anything else?
    
    ### Make dbt Core models public
    
    Before connecting your dbt Core project a dbt CLoud project, you should make sure the dbt Core models that you want to share use `access: public` in their model configuration. This setting makes those models visible to other dbt Cloud projects for better collaboration, such as [cross-project referencing](https://docs.getdbt.com/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref). You can set this in the following places:
    
    - `dbt_project.yml` (project-level)
    - `properties.yml` (for individual models)
    - A model’s `.sql` file using a `config` block
    
    Here’s an example using a `properties.yml` file:
    
    <File name="models/properties_my_public_model.yml">
    ```sql
    version: 2
    
    models:
      - name: my_public_model
        config:
          access: public
    ```
    </File>
    
    After defining `access: public`, rerun a dbt execution (like `dbt run`) to apply the change.
    
    For more details on how to set this up, see Learn more about [access modifier](https://docs.getdbt.com/docs/collaborate/govern/model-access#access-modifiers) and how to set the [`access` config](https://docs.getdbt.com/reference/resource-configs/access). 
    
    ### Connect project in dbt Cloud
    
    To connect a dbt Core project with dbt Cloud, check out the following steps. A dbt Cloud Account admin should perform the following steps and share the artifacts information with a dbt Core user.
    
    1. To create a new project in dbt Cloud, navigate to **Account home**.
    2. Click on **+New project**. Fill out the **Project name** and **Project subdirectory**. Name the project something that allows you to recognize it's a dbt Core project. 
        1. You don't need to set up a data warehouse or Git connection, however to upgrade the hybrid project to a full dbt Cloud project, you'd need to set up data warehouse and Git.
    3. Select the **Hybrid development** checkbox to link the dbt Core project to the dbt Cloud project.
                
    4. Click **Continue**.
    5. Create a [production environment](https://docs.getdbt.com/docs/deploy/deploy-environments#create-a-deployment-environment)
    6. (Optional) For existing dbt projects, navigate to **Account settings** and then select the **Project**. Click **Edit** and then check the **Hybrid development** checkbox.         
    
    ### Enable artifact upload
    
    Follow these steps to configure your dbt Core project so it's ready to upload generated artifacts to dbt Cloud:
    
    7. Before configuring you dbt Core project, go to your Hybrid project Environment.
    8. Select the **Artifact upload** button and copy the following values. You’ll need them to configure your dbt Core’s `dbt_project.yml` file in the next step:
        1. Tenant URL
        2. Account ID
        3. Environment ID
           
    
    ### Configure dbt Core project and upload artifacts
    
    9. In your local dbt Core project, add the following items you copied in the previous step, to the dbt Core's `dbt_project.yml` file:
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
            
    10. Execute a `dbt run` in the CLI by prefixing the following variables to upload the artifacts into dbt Cloud's orchestrator.
        1. Replace the `1` and `173` with your actual account ID and environment ID:
        
        ```bash
        DBT_CLOUD_ACCOUNT_ID=1 DBT_CLOUD_ENVIRONMENT_ID=173 dbt run
        ```
        
    11. Review the logs to confirm a successfully artifacts upload message. If there are any errors, resolve them by checking out the debug logs.
    
    ### Review artifacts in dbt Cloud
    
    Now that you've uploaded dbt Core artifacts into dbt Cloud and executed a `dbt run`, you can view the artifacts job run:
    12. Navigate to **Deploy**
    13. Click on **Jobs** and select the job that says...'System'???
    
    ## Integrate dbt Mesh workflows
    
    Now that you've integrated dbt Core artifacts with you dbt Cloud project, you can now:
    
    - Seamlessly perform cross project references between dbt Core projects and dbt Cloud projects
    - Navigate [dbt Explorer](/docs/collaborate/explore-projects) as a dbt Core user and view data assets. To view dbt Explorer, you must have a [read-only seat](/docs/cloud/manage-access/seats-and-users).
    - anything else?
