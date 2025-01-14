---
title: "Quickstart for the dbt Cloud Visual Editor"
id: "visual-editor"
level: 'Beginner'
icon: 'dbt'
hide_table_of_contents: true
tags: ['Visual Editor','Analyist', 'dbt Cloud','model']
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

:::note beta feature

The Visual Editor is currently in a limited beta. [Contact us](https://www.getdbt.com/contact/) if you're interested in becoming a part of it. Features currently in the beta are subject to change or removal.

:::

The dbt Cloud Visual Editor offers a quick and simple way for anyone to build models for analytics, no background in analytics engineering required! In this guide, you will learn about:

- Access the Visual Editor and creating a new model
- How to navigate the interface
- How to build a model using operators
- How to commit your changes to Git
- Locating your Visual Editor model and data

## Prerequisites

To use the Visual Editor, you must meet the following prerequisites:

- Your account must have the following configured:
    - A data warehouse connection
    - Integration with a Git provider
- Source models for the Visual Editor must have been run at least once
- You must have a `developer` license
- The examples in this guide use the [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) repo sample project. You can use your own existing data with this guide.

## Access the Visual Editor

To access the Visual Editor:

1. From the **main menu**, click **Develop**. If you do not see the **Develop** option, ensure you have selected a **Project** from the menu.
2. Click **Visual Editor**.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/ve-main-menu.png" width="90%" title="Visual Editor in the main menu."/>

3. From the right side, click **Get started** and then click **Create new model**.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/ve-create-new-model.png" width="90%" title="Create a new model from the Visual Editor landing page."/>

## Navigating the interface

The Visual editor is comprised of a series of menus activated by clicking icons that surround the border of the larger canvas. With none of the menu items activated, the workspace looks like this:

<Lightbox src="/img/docs/dbt-cloud/visual-editor/ve-screen.png" width="90%" title="The Visual Editor canvas. The number items are defined in this section." />

Click on an icon to expand it's section or execute an action depending on it's purpose. The options are as follows:

1. The model's title. This defaults to "Untitled" but can be edited at any time by clicking on it.
2. The **Operators** menu that contains the building blocks of [creating a model](#create-a-model) with the editor. 
3. The **SQL code** area that displays the [SQL that compiles your model](#sql-code).
4. The **Runs and previews** that displays [run data and previews data](#runs-and-previews) for individual operators.
5. The **Commit history** display.
6. 
7. The navigation tab that has icons for (from top to bottom):
    - Zoom in
    - Zoom out
    - Center the model to fit to screen
    - Auto-layout option for the individual operator tiles
8. The **Run** command executes `dbt run` for the model.
9. This button is initially, a **Committ** command for your integrated Git provider. Changes to "Open pull request" once changes are committed. This will not appear until a change is made that would require a commit. 

## Create a model

This section will walk you through creating a model with operators using sample data from the [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) project.

The operators are the heart of your model. They determine what data will be transformed and how. Click the **"+""** icon to open the operator menu.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/operators.png" width="90%" title="The operators menu on the side of the Visual Editor canvas." />

Read more about the [individual operators](/docs/cloud/visual-editor-interface#operators) to understand the basic purpose of each. Keep in mind that the model you're creating relies on existing models, and that the term will mostly be used to reference the model operator in this section.

### Operator tiles

The operators are drag-and-drop from their menu to the canvas and each of them will create a tile when dropped.

The tiles have the same basic setup with different fields depending on their function. All of the operators except for **Model** require they be connected to another tile before they can be configured. Once configured, they' have the same basic layout.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/operator-tile.png" width="90%" title="An operator tile with configurations filled out." />

1. **The connectors:** Click-and-drag to the connector on another operator to link them.
2. **The title:** Click to change. The examples in this guide will remain default. 
3. **Play icon and menu:** Preview the data at any point in it's transofrmation by clicking the tiles play icon. The dropdown menu contains the optiont to **Delete** a tile. 
4. **Column icon:** The number next to it represents the number of columns in the data at that point in it's transformation.

:::tip

Make operator tile titles unique compared to your column names to avoid confusion. Same for any aliases you create.

:::

### Create your source models

To get started:

1. Drag the **Model** operator over to the canvas.
2. Click **Configure model** and then select the source `stg_models` from the dropdown. 
3. Click the **Output all columns** option.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/one-model-operator.png" width="90%" title="A single model operator." />

You now have your first data source!

4. Drag a new **Model** operator to the canvas below the first and repeat the previous steps, but this time set the source model to `stg_order_items`.

    <Lightbox src="/img/docs/dbt-cloud/visual-editor/two-model-operators.png" width="90%" title="Two model operators in te canvas."/>

Now you have two source data models and are ready to start transforming the data!

:::tip

Don't see a source model you're looking for? Ask your dbt admins to ensure it's been recently run and that it hasn't gone stale.

:::

### Create a join

1. Drag the **Join** operator on to the canvas to the right of the source models. 
    
    <Lightbox src="/img/docs/dbt-cloud/visual-editor/join-not-connected.png" width="90%" title="A join that has not been connected to the models" />

2. Click-and-drag a line from the **+** connector below the `L` on the join border to the **+** on the `stg_orders` model. Do the same for the `R` connector to the `stg_order_items` model.

    <Lightbox src="/img/docs/dbt-cloud/visual-editor/join-connected.png" width="90%" title="The join is connected to two model operators." />

3. In the **Join** tile, click **Configure join condition.**
4. Set the **Join type** to `Inner`.
5. In the pair of dropdowns, set both `stg_orders` and `stg_order_items` to `ORDER_ID`.
6. Click **Select and rename columns** and click **Configure columns**
select the following columns:
    - From `stg_orders` click `ORDER_ID` and `CUSTOMER_ID`.
    - From `stg_order` click `PRODUCT_ID`.
    - Note: These will appear in the order they are clicked.
7. You've now built your join! Test it by clicking the **Play icon** in the top right corner of the join tile. Your data will populate in the **Runs and previews** pane.

    <Lightbox src="/img/docs/dbt-cloud/visual-editor/preview-join.png" width="90%" title="A completed join with the sample data." />

:::tip

Your work in the Visual Editor is automatically saved as you progress, so if you need a break, you can always come back to a session later. Just be sure to give it a unique title!

:::

## Enhance your model

You've got the basics going with your Visual Editor model! It has succesfully joined two source models but you need to futher transform the data to get what you need. A list of customers who buy a lot of repeat items as you consider a loyalty club rewards program.

### Aggregate data

There are multiple options for transforming your data including custom formulas, filters, and unions. We're going to keep this guide simple and add a straightforward aggregation operator to tell you which of your customers are buying the most repeat products so you can offer them coupons as part of your Jaffle Shop rewards program.

1. Drag the **Aggregation** operator over to the right of the join.
2. Connect the aggregation operator to the join operator. 
3. Click **Configure aggregation** in the **Aggregation tile**.
4. Click in the **Group by** field and first select `CUSTOMER_ID` then `PRODUCT_ID`.
5. Configure the next three fields with the following:
    - **Function:** Count
    - **Column:** PRODUCT_ID
    - **Alias:** count_PRODUCT_ID

    <Lightbox src="/img/docs/dbt-cloud/visual-editor/aggregation.png" width="90%" title="The configured aggregation operator tile." />

6. Press the **Play icon** and preview the data. You're starting to see the results you're looking for, but the data is scattered. Let's clean it up a bit further.

:::tip

As your model growns, you can zoom in and out to view what you need. Click and hold to drag your setup across the screen. Click the **Fit view** icon to see your entire model on the screen. Click the **Auto layout** icon to auto arrange the tiles efficiently. 

:::

### Add some order

There's a lot of data there. Dozens of customers buying hundreds of products. You're going to sort it so the customers are sorted ascending by on the list by ID number with the products they've bought the most at the top. 

1. Drag the **Order** operator over to the right of the **Aggregation** tile and connec them.
2. Click **Configure order**.
3. In the **Sort order** field click **Select column** and click `Aggregation1.CUSTOMER_ID` from the dropdown. Set it to `Asc`. 
4. Click **Add sorting** and in the new **Select column** field select `Aggregation1.count_PRODUCT_ID`. Set it to `Desc`.
5. Press the **Play icon** to preview the new data.

    <Lightbox src="/img/docs/dbt-cloud/visual-editor/order.png" width="90%" title="The ordered data operator tile config and data preview." />

:::tip

Want to practice one on your own? Try adding a filter operator that removes any items with less than 10 sales for any given customer ID.

:::

## Run and share your model

Now that you've built a model that results in the data you want, it's time to run it and push it to your Git repo.

### Run

To run your model, all you need to do is click the big **Run** button. With the Visual Editor, there is no command line, no need to memorize a list of commands, there is only **Run**. Click it and you will see the results populate in the **Runs and previews** pane.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/run-results.png" width="90%" title="The results of a successful run in the 'Runs and previews' pane." />

This will materialize the data as a view in your developer schema in the database. Once the model has been merged with your project and `dbt run` is executed in your Staging or Production environments, it will be materialized as a view in their related schemas. 

### Git commit

WIP

</div>