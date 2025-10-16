---
title: "dbt Fusion engine"
id: "fusion"
description: "Fusion is the next-generation engine and development experience for dbt projects."
pagination_next: "docs/fusion/about-fusion"
pagination_prev: "docs/introduction"
---

import FusionFeaturesTable from '/snippets/_fusion-features-table.md';
import FusionAvailability from '/snippets/_fusion_availability.md';

<IntroText><Constant name="fusion" /> is the next-generation engine built on Rust, that powers development across the <Constant name="dbt_platform" /> (formerly dbt Cloud), the VS Code extension, and local environments.</IntroText>

- It’s faster, smarter, and more consistent &mdash; bringing static analysis, instant feedback, and more &mdash; to every dbt workflow, and an integrated VS Code experience through the [Language Server Protocol (LSP)](https://docs.getdbt.com/blog/dbt-fusion-engine-components#the-dbt-vs-code-extension-and-language-server), which enables features like autocomplete, hover info, and inline error highlights.
- <Constant name="fusion" /> elevates [<Constant name="core" />](/docs/about-dbt-install), our open source software (OSS) engine, to a new level of performance and developer experience. It can be installed locally to accelerate dbt projects.
- <Constant name="fusion_engine" /> includes a mix of [source-available (ELv2)](https://www.elastic.co/licensing/elastic-license), open-source (Apache 2.0), and proprietary components. Refer to [<Constant name="fusion" /> licensing details](https://www.getdbt.com/licenses-faq) for more information.

## Getting started

<FusionAvailability/>

<FusionFeaturesTable />
