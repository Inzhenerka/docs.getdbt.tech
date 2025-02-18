
### Generate SQL expressions

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

### Build your visual models

To use dbt Copilot to generate and build models with natural language prompts:

1. Click on the dbt Copilot icon in Visual Editor.
2. In the dbt Copilot prompt box, enter your prompt in natural language for dbt Copilot to build the model(s) you want. You can reference existing models using the `@` symbol. For example, to build a model that calculates the total price of orders, you can enter `@orders` in the prompt and it'll use the `orders` model as a source.
3. Click **Generate** and dbt Copilot generates a summary of the model(s) you want to build.
   <Lightbox src="/img/docs/dbt-cloud/copilot-generate.jpg" width="40%" title="Enter a prompt in the dbt Copilot prompt box to build models using natural language" />
4. Click **Apply** to generate the model(s) in the Visual Editor.
5. Review the diff view in the canvas to see the generated operators built by dbt Copilot. dbt Copilot displays a visual "diff" view to help you compare the proposed changes with your existing code:
   - Green: Means new code that will be added if you accept the suggestion.
   - White: Means existing set up or blank canvas that will be removed or replaced by the suggested changes.
   <Lightbox src="/img/docs/dbt-cloud/copilot-diff.jpg" width="85%" title="Visual diff view of proposed changes" />
6. Reject or accept the suggestions
7. In the **Output** operator, click the play icon to preview the data
8. Confirm the results or continue building your model.
   <Lightbox src="/img/docs/dbt-cloud/copilot-output.jpg" width="85%" title="Output operator with play icon" />
