---
title: "Fusion package compatibility guide"
id: "fusion-package-compat"
description: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
intro_text: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
hoverSnippet: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
# time_to_complete: '30 minutes' commenting out until we test
icon: 'zap'
hide_table_of_contents: true
tags: ['dbt Fusion engine']
level: 'Advanced'
---

## Introduction

Thank you for being part of the [dbt package community](https://getdbt.slack.com/archives/CU4MRJ7QB) and maintaining [dbt packages](https://hub.getdbt.com/)! Your work makes dbt’s ecosystem possible and helps thousands of teams reuse trusted models and macros to build faster, more reliable analytics.

This guide will help you upgrade your dbt packages to be [<Constant name="fusion" />](/docs/fusion)-compatible. A <Constant name="fusion" />-compatible package:
- Supports [<Constant name="fusion_engine" />](/docs/fusion) version `2.0.0`
- Uses the [`require-dbt-version` config](/reference/project-configs/require-dbt-version) to signal compatibility in the dbt package hub
- aligns with the latest JSON schema introduced in dbt <Constant name="core"/> v1.10.0.

In this guide, we'll go over:

- Updating your package to be compatible with <Constant name="fusion"/>,
- Testing your package with <Constant name="fusion"/>,
- Updating the `require-dbt-version` config to include `2.0.0`,
- Updating your README to note that the package is compatible with <Constant name="fusion"/>.

### Who is this for?

This guide is for any dbt package maintainer, like [`dbt-utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), that are looking to upgrade their package to be compatible with <Constant name="fusion"/>. Updating your package ensures users have the latest version of your package, your package stays trusted on dbt package hub, and users benefit from the latest features and bug fixes. 

A users stores their package in a `packages.yml` or `dependencies.yml` file. If a package excludes `2.0.0`, <Constant name="fusion"/> will warn today and error in a future release, matching <Constant name="core"/> behavior. 

This guide assumes you're using the command line and Git to make changes in your package repository. If you're interested in creating a new package from scratch, we recommend using the [dbt package guide](/guides/building-packages) to get started.

## Prerequisites

Before you begin, make sure you meet the following:

- dbt package maintainer &mdash; You're a dbt package maintainer with a package on [dbt package hub](https://hub.getdbt.com/) or interested in creating a new package.
- `dbt-autofix` installed &mdash; [Install `dbt-autofix`](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) to automatically update the package's YAML files to align with the latest dbt updates and best practices. We recommend [using/installing uv/uvx](https://docs.astral.sh/uv/getting-started/installation/) to run the tool.
  - Run the command `uvx dbt-autofix` for the latest version of the tool. For more installation options, see the [official `dbt-autofix` doc](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).
- Repository access &mdash; You’ll need permission to create a branch and release updates/a new version of your package. You’ll need to tag a new version of your package once it’s <Constant name="fusion"/>-compatible.
- A <Constant name="fusion"/> installation or test environment &mdash; You can use <Constant name="fusion"/> locally (using the `dbtf` binary) or in your CI pipeline to validate compatibility.
- You use the command line and Git to make changes in your package repository.

## Upgrade the package
This section of the guide will go over how to upgrade your package to be compatible with <Constant name="fusion"/> by:
- Using `dbt-autofix` to automatically update your YAML files
- Testing your package with <Constant name="fusion"/>
- Updating your `require-dbt-version` config
- Publishing a new release of your package

### Run dbt-autofix

1. In your dbt package repository, create a branch to work in. For example:
    ```bash
    git checkout -b fusion-compat
    ```

2. Ensure you have `dbt-autofix` installed. If you don't have it installed, run the command `uvx dbt-autofix`. For more installation options, see the [official `dbt-autofix` doc](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation).

3. Run `dbt-autofix` in your package directory so it automatically updates your package code and rewrites YAML to conform to the latest JSON schema:
    ```bash
    dbt-autofix deprecations
    ```

4. (Optional) You can also run `dbt-autofix` as a temporary continuous integration (CI) check until the package is <Constant name="fusion"/>-compatible:
    ```bash
    dbt-autofix deprecations --check
    ```

### Test package with Fusion

Now that you've run `dbt-autofix`, let's test your package with <Constant name="fusion"/> to ensure it's compatible before [updating](https://docs.getdbt.com//guides/fusion-package-compat?step=5) your `require-dbt-version` config. Refer to the [<Constant name="fusion"/> limitations documentation](/docs/fusion/supported-features#limitations) for more information on what to look out for. You can test your package by:

<!-- no toc -->
- [Running your integration tests with Fusion](#running-your-integration-tests-with-fusion)
- [Manually validating your package](#manually-validating-your-package)

#### Running your integration tests with Fusion

If your package includes an `integration_tests/` folder ([like `dbt-utils`](https://github.com/dbt-labs/dbt-utils/tree/main/integration_tests)):
1. Navigate to the folder (`cd integration_tests`) to run your tests. If you don't have an `integration_tests/` folder, you can either [create one](https://docs.getdbt.com/guides/building-packages?step=4) or navigate to the folder that contains your tests.
2. Then, run your tests with <Constant name="fusion"/> by running the following `dbtf build` command (or whatever <Constant name="fusion"/> executable is available in your environment).
3. If there are no errors, your package likely supports <Constant name="fusion"/> and you're ready to [update your `require-dbt-version`](https://docs.getdbt.com//guides/fusion-package-compat?step=5#update-your-require-dbt-version). If there are errors, you'll need to fix them first before updating your `require-dbt-version`.

#### Manually validating your package

If you don’t have integration tests:

1. Create a small, <Constant name="fusion"/>-compatible dbt project that installs your package and has a `packages.yml` or `dependencies.yml` file. 
2. Run it with <Constant name="fusion"/> using the `dbtf run` command.
3. Confirm that models build successfully and that there are no warnings. If there are errors/warnings, you'll need to fix them first. If you still have issues, reach out to the [#package-ecosystem channel](https://getdbt.slack.com/archives/CU4MRJ7QB) on Slack for help.

### Update `require-dbt-version` 

You should only update the [`require-dbt-version` config](/reference/project-configs/require-dbt-version) after testing and confirming that your package works with <Constant name="fusion"/>. 

1. Update the `require-dbt-version` in your `dbt_project.yml` to include `2.0.0`. We recommend using a range to ensure stability across releases:
    ```yaml
    require-dbt-version: [">=1.10.0,<3.0.0"] 
    ```
    This signals that your package supports both dbt <Constant name="core"/> and <Constant name="fusion"/>. dbt Labs will use this release metadata to mark your package with a <Constant name="fusion"/>-compatible badge in dbt package hub. Packages without this will not have the <Constant name="fusion"/>-compatible badge displayed.

2. Publish a new release of your package by merging your branch into main.
3. Update your `README` to note that the package is <Constant name="fusion"/>-compatible.
4. (Optional) Announce it in [#package-ecosystem on dbt Slack](https://getdbt.slack.com/archives/CU4MRJ7QB) if you’d like.

:::tip CI Fusion testing
When possible, add a step to your CI pipeline that runs `dbtf build` or equivalent to ensure ongoing <Constant name="fusion"/> compatibility.
:::

This should then update your package to be <Constant name="fusion"/>-compatible and be reflected in dbt package hub. To summarize, you've now:

- Created a fusion compatible branch
- Run `dbt-autofix` deprecations
- Reviewed, committed, and tested changes 
- Updated `require-dbt-version: [">=1.10.0,<3.0.0"]` to include `2.0.0`
- Published a new release
- Announced the update (optional)
- Celebrated your new <Constant name="fusion"/>-compatible badge 🎉

## Final thoughts

<ConfettiTrigger>

Now that you've upgraded your package to be <Constant name="fusion"/>-compatible, users will be able to use your package with <Constant name="fusion"/>! 🎉!

By upgrading now, you’re ensuring a smoother experience for users, paving the way for the next generation of dbt projects, and helping dbt <Constant name="fusion"/> reach full stability.

If you have questions or run into issues:

- Join the conversation in the [#package-ecosystem channel](https://getdbt.slack.com/archives/CU4MRJ7QB) on Slack.
- Open an issue in [dbt-autofix repository](https://github.com/dbt-labs/dbt-autofix/issues) on GitHub

Lastly, thank you for your help in making the dbt ecosystem stronger &mdash; one package at a time 💜.
</ConfettiTrigger>

## Frequently asked questions

The following are some frequently asked questions about upgrading your package to be <Constant name="fusion"/>-compatible.

<Expandable alt_header="Why do we need to update our package?"> 

<Constant name="fusion"/> and <Constant name="core"/> v1.10+ use the same new authoring layer. Ensuring your package supports `2.0.0` in your `require-dbt-version` config ensures your package is compatible with both.

Updating your package ensures users have the latest version of your package, your package stays trusted on dbt package hub, and users benefit from the latest features and bug fixes. You'll also be able to display a <Constant name="fusion"/>-compatible badge in dbt package hub.

If a package excludes `2.0.0`, <Constant name="fusion"/> will warn today and error in a future release, matching dbt <Constant name="core"/> behavior. 

</Expandable>

<Expandable alt_header="How do I test Fusion in CI?">

Add a separate job that installs <Constant name="fusion"/> (`dbtf`) and runs `dbtf build`. See this [PR](https://github.com/godatadriven/dbt-date/pull/31) for a working example.

You would want to do this to ensure all and any changes to your package are compatible with <Constant name="fusion"/>.
 </Expandable>

<Expandable alt_header="How will users know my package is Fusion-compatible?">

Users will know your package is <Constant name="fusion"/>-compatible by seeing 2.0.0 or higher included in the `require-dbt-version` range config.

<Constant name="fusion"/>-compatible packages will soon display a badge on dbt packages hub. This is automatically determined based on your package’s metadata and version requirements.

</Expandable>
