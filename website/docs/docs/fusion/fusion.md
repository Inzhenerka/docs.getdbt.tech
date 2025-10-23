---
title: "dbt Fusion engine"
id: "fusion"
description: "Fusion is the next-generation engine and development experience for dbt projects."
pagination_next: "docs/fusion/about-fusion"
pagination_prev: "docs/introduction"
---

import FusionFeaturesTable from '/snippets/_fusion-features-table.md';
import FusionAvailability from '/snippets/_fusion_availability.md';

<IntroText><Constant name="fusion" /> is the next-generation engine built in Rust, that powers development across the <Constant name="dbt_platform" /> (formerly dbt Cloud), and local development in VS Code and Cursor.</IntroText>

- It’s faster, smarter, and more cost-efficient &mdash; bringing SQL comprehension and state awareness, instant feedback, and more &mdash; to every dbt workflow, and an integrated VS Code experience through the [dbt extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt) and [Language Server Protocol (LSP)](https://docs.getdbt.com/blog/dbt-fusion-engine-components#the-dbt-vs-code-extension-and-language-server), which enables features like live CTE previews, hover info, error highlighting, and more.
- Use the <Constant name="fusion_engine" /> to power your projects in the <Constant name="dbt_platform" />, available in private preview. Contact your account team for access. <Lifecycle status="private_preview" /> 
  - You can also work on the <Constant name="dbt_platform"/> with the traditional <Constant name="core" /> engine (Python-based). It doesn't include <Constant name="fusion_engine" /> [features](/docs/fusion/supported-features#features-and-capabilities) like 30x faster compilation/parsing, autocomplete, hover info, inline error highlights, and more
- Like <Constant name="core" />, you can install <Constant name="fusion" /> locally from the CLI to power local workflows. For a hyper-fast and intelligent development experience powered by <Constant name="fusion" />, [install the VS Code extension](/docs/fusion/install-dbt-extension).
## Getting started

<FusionAvailability/>

<FusionFeaturesTable />
