---
title: "Fusion package compatibility"
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

Thank you for being part of the [dbt package hub](https://hub.getdbt.com/) and maintaining dbt packages! Your work makes dbt’s ecosystem possible and helps thousands of teams reuse trusted models and macros to build faster, more reliable analytics.

This guide will help you upgrade your dbt packages to be <Constant name="fusion" />-compatible. A <Constant name="fusion" />-compatible package supports [<Constant name="fusion_engine" />](/docs/fusion) version 2.0.0 and higher using the [`require-dbt-version` config](/reference/project-configs/require-dbt-version) and aligns with the latest JSON schema introduced in dbt <Constant name="core"/> v1.10.0.

You can use `require-dbt-version` to signal that your package is compatible with <Constant name="fusion"/> and will be marked as such on dbt package hub.

### Who is this for?

This guide is for any dbt package maintainer, like [`dbt-utils`](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/), that are looking to upgrade their package to be compatible with <Constant name="fusion"/>. Updating your package ensures users have the latest version of your package, your package stays trusted on dbt package hub, and users benefit from the latest features and bug fixes.

In this guide, we'll go over:

- Updating your package to be compatible with <Constant name="fusion"/>
- Updating the `require-dbt-version` config to include `2.0.0` (like `require-dbt-version: ">=1.10.0,<3.0.0"` ).
- Cutting a new release of your package with the updated `require-dbt-version` config.
- Adding a badge to your package to indicate that it is compatible with <Constant name="fusion"/> - is this right?
- Updating your README to note that the package is compatible with <Constant name="fusion"/>.

## Requirements

Before you begin, make sure you have the following:

- You are a dbt package maintainer with a package on [dbt package hub](https://hub.getdbt.com/).
- `dbt-autofix` installed &mdash; dbt-autofix is an official CLI that automatically updates YAML files to comply with the latest dbt updates and best practices.
- Repository access &mdash; You’ll need permission to create a branch and release a new version of your package.
- A <Constant name="fusion"/> installation or test environment &mdash; You can use <Constant name="fusion"/> locally (using the `dbtf` binary) or in your CI pipeline to validate compatibility.
- Permission to release updates &mdash; You’ll need to tag a new version of your package once it’s <Constant name="fusion"/>-compatible.

## Steps to upgrade package
In this section, we'll go over how to upgrade your package to be compatible with <Constant name="fusion"/> by using `dbt-autofix` to automatically update your YAML files to comply with the latest dbt updates and best practices. These steps will assume you're using the command line and Git to make changes in your package repository.

1. In your dbt package repository, create a branch to work in:
    ```bash
    git checkout -b fusion-compat
    ```
2. Run `dbt-autofix` in your package directory to update your package code and rewrite YAML to conform to the latest JSON schema:
    ```bash
    dbt-autofix deprecations
    ```

3. You can also run `dbt-autofix` in check mode for CI:
    ```bash
    dbt-autofix deprecations --check
    ```

## Test your package with Fusion

You should only update your `require-dbt-version` after testing and confirming that your package works with <Constant name="fusion"/>. You can test your package in a couple of ways:

- Option 1: Run your integration tests with Fusion
- Option 2: Manual validation

### Run your integration tests with Fusion

1. If your package includes an `integration_tests/` folder (like `dbt-utils` or `dbt-date`):

    ```bash
    cd integration_tests
    ```

2. Run your tests with <Constant name="fusion"/>:

    ```bash
    dbtf build
    ```


or whatever Fusion executable is available in your environment.

If there are no errors, your package likely supports <Constant name="fusion"/>.

#### Manual validation

If you don’t have integration tests:

1. Create a small dbt project that installs your package.

2. Run it with <Constant name="fusion"/>:

    ```bash
    dbtf run
    ```

3. Confirm that models build successfully and there are no warnings.

4. Update your `require-dbt-version` in your `dbt_project.yml` to include `2.0.0`. We recommend using a range to ensure stability across releases:
    ```yaml
    require-dbt-version: [">=1.10.0,<3.0.0"] 
    ```
    This signals that your package supports both dbt <Constant name="core"/> and <Constant name="fusion"/>. dbt Labs will use this release metadata to mark your package with a <Constant name="fusion"/>-compatible badge in dbt package hub. Packages without this will not have the <Constant name="fusion"/>-compatible badge displayed in dbt package hub. 

5. Publish a new release of your package by merging your branch into main.
6. Update your `README` to note that the package is <Constant name="fusion"/>-compatible.
7. (Optional) Announce it in [#package-ecosystem on dbt Slack](https://getdbt.slack.com/archives/CU4MRJ7QB) if you’d like.



## Maintainer checklist

- Create a fusion-compat branch
- Run dbt-autofix deprecations
- Review, commit, and test changes
- Update require-dbt-version: [">=2.0.0"]
- Create a new release
- Announce the update (optional)
- Celebrate your new <Constant name="fusion"/>-compatible badge 🎉

## Frequently asked questions

- Why >=2.0.0?
Fusion and Core 1.10+ use the same new authoring layer. Declaring require-dbt-version: [">=2.0.0"] ensures your package is compatible with both.

- Can users patch my package themselves?
They can temporarily run:

```bash
dbt-autofix deprecations --include-packages
```

- How often will this change?
Expect a few more schema updates before October 2025. When a new schema version ships, rerun autofix and cut a patch release.

Q: How will users know my package is Fusion-compatible?
Fusion-compatible packages will soon display a badge on dbt Hub. This is automatically determined based on your package’s metadata and version requirements.


By upgrading now, you’re ensuring a smoother experience for users, paving the way for the next generation of dbt projects, and helping dbt <Constant name="fusion"/> reach full stability.

If you have questions or run into issues:

- Join the conversation in #package-maintainers or #dbt-fusion-engine on Slack.
- Open an issue in dbt-autofix
-  or dbt-core discussions

Lastly, thank you for your help in making the dbt ecosystem stronger — one package at a time 💚
