Generate documentation, tests, metrics, and semantic models resources with the click-of-a-button using dbt Copilot, saving you time. To access and use this AI feature:

1. Navigate to the dbt Cloud IDE and select a SQL model file under the **File Explorer**.
2. In the **Console** section (under the **File Editor**), click **dbt Copilot** to view the available AI options.
3. Select the available options to generate the YAML config: **Generate Documentation**, **Generate Tests**, or **Generate Semantic Model**. To generate metrics, you need to first have semantic models defined. Select **Generate Metrics**.
   - To generate multiple YAML configs for the same model, click each option separately. dbt Copilot intelligently saves the YAML config in the same file.
4. Verify the AI-generated code. You can update or fix the code as needed.
5. Click **Save As**. You should see the file changes under the **Version control** section.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Example of using dbt Copilot to generate documentation in the IDE" />
