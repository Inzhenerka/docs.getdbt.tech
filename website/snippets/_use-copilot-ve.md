To begin building models with natural language prompts in the Visual Editor:

1. Click on the **dbt Copilot** icon in Visual Editor.
2. In the dbt Copilot prompt box, enter your prompt in natural language for dbt Copilot to build the model(s) you want. You can reference existing models using the `@` symbol. For example, to build a model that calculates the total price of orders, you can enter `@orders` in the prompt and it'll use the `orders` model as a source.
3. Click **Generate** and dbt Copilot generates a summary of the model(s) you want to build.
   <Lightbox src="/img/docs/dbt-cloud/copilot-generate.jpg" width="40%" title="Enter a prompt in the dbt Copilot prompt box to build models using natural language" />
4. Click **Apply** to generate the model(s) in the Visual Editor.
5. dbt Copilot displays a visual "diff" view to help you compare the proposed changes with your existing code. Review the diff view in the canvas to see the generated operators built by dbt Copilot:
   - White: Located in the top of the canvas and means existing set up or blank canvas that will be removed or replaced by the suggested changes.
   - Green: Located in the bottom of the canvas and means new code that will be added if you accept the suggestion. <br / >
   <Lightbox src="/img/docs/dbt-cloud/copilot-diff.jpg" width="85%" title="Visual diff view of proposed changes" />
6. Reject or accept the suggestions
7. In the **Output** operator, click the play icon to preview the data
8. Confirm the results or continue building your model.
   <Lightbox src="/img/docs/dbt-cloud/copilot-output.jpg" width="85%" title="Output operator with play icon" />
