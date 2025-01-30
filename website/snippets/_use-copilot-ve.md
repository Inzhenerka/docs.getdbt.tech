dbt Copilot seamlessly integrates with the [Visual Editor](/docs/cloud/visual-editor), a drag-and-drop experience that helps you build your visual models, by helping you generate SQL code using natural language prompts through the dbt Copilot icon. To use dbt Copilot in the Visual Editor:

1. Make sure you can access the [Visual Editor](/docs/cloud/use-visual-editor#access-visual-edito)).
2. As you [create](/docs/cloud/use-visual-editor#create-a-model) or [edit](/docs/cloud/use-visual-editor#edit-an-existing-model) a model, select the **Formula** [operator](/docs/cloud/visual-editor-interface#operators) and connect it to the model you want to edit.
3. Click **Configure Formula** and select the **dbt Copilot** icon in the **Expression** field.
   - The **Formula** operator requires a <Term term id="sql-expression" /> and an alias. For example, `total_price > 100 AS high_value_order` means this expression filters orders where `total_price` is greater than 100 and assigns the alias `high_value_order`.
4. Enter your prompt in the **Expression** field.
5. Click **Generate** &mdash; dbt Copilot generates the SQL code and alias set for you.
6. Click the **Run** button to preview the data and confirm the results and continue building your model.


#### Questions
- If you've generated code that you want to regenerate ????
- If the code is not what you want, ????


<Lightbox src="/img/docs/dbt-cloud/copilot-ve-formula.gif" title="Use Formula operator" />
