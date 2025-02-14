
### Use dbt Copilot to generate SQL expressions

To use dbt Copilot in the Visual Editor to generate SQL expressions:

1. As you [create](/docs/cloud/use-visual-editor#create-a-model) or [edit](/docs/cloud/use-visual-editor#edit-an-existing-model) a model, select the **Formula** [operator](/docs/cloud/visual-editor-interface#operators) and connect it to the model you want to edit.
2. Click **Configure Formula** and select the **dbt Copilot** icon in the **Expression** field.
   - The **Formula** operator requires a <Term term id="sql-expression" /> and an alias. For example, `total_price > 100 AS high_value_order` means this expression filters orders where `total_price` is greater than 100 and assigns the alias `high_value_order`.
3. Enter your prompt in the **Expression** field.
4. Click **Generate** &mdash; dbt Copilot generates the SQL code and alias set for you.
5. Click the **Run** button to preview the data and confirm the results and continue building your model.

#### Questions
- If you've generated code that you want to regenerate ????
- If the code is not what you want, ????

<Lightbox src="/img/docs/dbt-cloud/copilot-ve-formula.gif" title="Use dbt Copilot in the Visual Editor Formula operator to generate SQL expressions using natural language prompts" />


