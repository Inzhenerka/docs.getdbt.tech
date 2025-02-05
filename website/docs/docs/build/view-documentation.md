---
title: "View documentation"
description: "Learn how robust documentation for your dbt models helps stakeholders discover and understand your datasets."
id: "view-documentation"
---

dbt provides an intuitive and scalable way to write, version-control, and share documentation for your dbt models. You can write [descriptions](/docs/build/documentation#adding-descriptions-to-your-project) (in plain text or markdown) for each resource, and then generate and view documentation to gain shared context for your dbt project.

You can view documentation in two complementary ways, depending on your needs:

| Option | Description | Availability |
|------|-------------|--------------|
| [**dbt Docs**](#dbt-docs) | Generates a static website with model lineage, metadata, and documentation that can be hosted on your web server (like S3 or Netlify). | dbt Core or dbt Cloud Developer plans |
| [**dbt Explorer**](/docs/collaborate/explore-projects) | The premier documentation experience in dbt Cloud. Builds on dbt Docs to provide a dynamic, real-time interface with rich [metadata](/docs/collaborate/explore-projects#generate-metadata), customizable views, deep insight into your project and resources, and collaborative tools. | dbt Cloud Team or Enterprise plans |

## Navigating your documentation
The following sections describe how to navigate your documentation in dbt Explorer and dbt Docs.

### dbt Explorer <Lifecycle status="team,enterprise" />

[dbt Explorer](/docs/collaborate/explore-projects) offers a dynamic, interactive way to explore your models, sources, and lineage.
To access dbt Explorer, navigate to the **Explore** option in the dbt Cloud navigation menu.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-details.png" width="95%" title="Example of dbt Explorer's resource details page and its lineage." />

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-main-page.gif" width="95%" title="Access dbt Explorer from dbt Cloud by clicking Explore in the navigation."/>

</DocCarousel>

dbt Explorer offers users a comprehensive suite of features to enhance data project navigation and understanding, like:

- Interactive lineage visualization to visualize your project's DAG to understand relationships between resources. 
- Comprehensive resource search bar with filters to help find project resources efficiently and quickly.
- Model performance insights to access metadata on dbt Cloud runs for in-depth analysis of model performance and quality. 
- Project recommendations to receive suggestions to improve test coverage and documentation across your data estate. 
- Data health signals to monitor the health and performance of each resource through data health indicators. 
- Model query history to track consumption queries on your models to gain deeper insights into data usage. 
- Auto-exposures to automatically expose relevant data models from tools like Tableau to enhance visibility. 

For additional details and instructions on how to explore your lineage, navigate your resources, view model query history and data health signals, feature availability, and more &mdash; refer to [Discover data with dbt Explorer](/docs/collaborate/explore-projects).

### dbt Docs

If you're using the dbt Docs interface, available on dbt Core or dbt Cloud Developer plans, you can navigate to the documentation for a specific model. That might look something like this:

<Lightbox src="/img/docs/building-a-dbt-project/testing-and-documentation/f2221dc-Screen_Shot_2018-08-14_at_6.29.55_PM.png" title="Auto-generated documentation for a dbt model"/>

Here, you can see a representation of the project structure, a markdown description for a model, and a list of all of the columns (with documentation) in the model.

From the dbt Docs page, you can click the green button in the bottom-right corner of the webpage to expand a "mini-map" of your DAG. This pane (shown below) will display the immediate parents and children of the model that you're exploring.

<Lightbox src="/img/docs/building-a-dbt-project/testing-and-documentation/ec77c45-Screen_Shot_2018-08-14_at_6.31.56_PM.png" title="Opening the DAG mini-map"/>

In this example, the `fct_subscription_transactions` model only has one direct parent. By clicking the "Expand" button in the top-right corner of the window, we can pivot the graph horizontally and view the full <Term id="data-lineage">lineage</Term> for our model. This lineage is filterable using the `--select` and `--exclude` flags, which are consistent with the semantics of [model selection syntax](/reference/node-selection/syntax). Further, you can right-click to interact with the DAG, jump to documentation, or share links to your graph visualization with your coworkers.

<Lightbox src="/img/docs/building-a-dbt-project/testing-and-documentation/ac97fba-Screen_Shot_2018-08-14_at_6.35.14_PM.png" title="The full lineage for a dbt model"/>

## Deploying the documentation site

Effortlessly deploy documentation in dbt Explorer or dbt Docs to view your project documentation and make it available to your team to collaborate.

:::caution Security

The `dbt docs serve` command is only intended for local/development hosting of the documentation site. Please use one of the methods listed in the next section (or similar) to ensure that your documentation site is hosted securely!

:::

### dbt Explorer <Lifecycle status="team,enterprise" />


dbt Explorer automatically updates documentation after each production or staging job run using the metadata generated after each job run. This means it always has the latest results for your project &mdash; no manual deployment needed. For details on how dbt Explorer uses metadata to automatically update documentation, refer to [Generate metadata](/docs/collaborate/explore-projects#generate-metadata). 

To learn how to deploy your documentation site, see [Build and view your docs with dbt Cloud](/docs/collaborate/build-and-view-your-docs).

### dbt Docs
dbt Docs was built to make it easy to host on the web. The site is "static," meaning you don't need any "dynamic" servers to serve the docs. You can host your documentation in several ways:

* Host on [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html) (optionally [with IP access restrictions](https://docs.aws.amazon.com/AmazonS3/latest/dev/example-bucket-policies.html#example-bucket-policies-use-case-3))
* Publish with [Netlify](https://discourse.getdbt.com/t/publishing-dbt-docs-to-netlify/121)
* Use your own web server like Apache/Nginx
* If you're on a dbt Cloud Developer plan, see [Build and view your docs with dbt Cloud](/docs/collaborate/build-and-view-your-docs#dbt-docs) to learn how to deploy your documentation site.

For a more seamless experience, use [dbt Explorer](/docs/collaborate/explore-projects) as the recommended documentation experience in dbt Cloud. 
