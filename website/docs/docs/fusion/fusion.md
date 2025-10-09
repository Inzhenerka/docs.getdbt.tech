---
title: "The dbt Fusion engine"
id: "fusion"
description: "Fusion is the next-generation engine and development experience for dbt projects."
pagination_next: "docs/fusion/about-fusion"
pagination_prev: null
---

<Constant name="fusion" /> is the next-generation engine built on Rust, that powers development across <Constant name="core" />, the dbt platform, and the VS Code extension.

It’s faster, smarter, and more consistent — bringing static analysis, autocomplete, instant feedback to every dbt workflow, and a deeply integrated VS Code experience powered by a [Language Server Protocol (LSP)](https://docs.getdbt.com/blog/dbt-fusion-engine-components#the-dbt-vs-code-extension-and-language-server).

## Getting started
If you're not sure where to begin, choose the best path that matches how you use or plan to use dbt.

| If you are... | What to install or use | What happens | Learn more |
| --- | --- | --- | --- |
| Working in the dbt platform | Use <Constant name="cloud_ide" />, <Constant name="visual_editor" />, and more | <Constant name="fusion" /> powers compilation, jobs, and IDE sessions automatically | Learn more about [<Constant name="fusion" />  in the dbt platform](/docs/fusion/install-fusion) |
| Developing in VS Code| Install the [dbt extension for VSCode](/docs/install-dbt-extension) and Fusion. Available to all <Constant name="core"/> or dbt platform users | Get autocomplete, inline errors, lineage, and model previews as you code | Learn more about the [dbt extension for VSCode](/docs/install-dbt-extension) |
| Developing locally| Install the [Fusion CLI](/docs/fusion/install-fusion) | Get autocomplete, inline errors, lineage, and model previews as you code | Learn more about the [Fusion CLI](/docs/fusion/install-fusion) |


- [Install the dbt extension for VSCode](/docs/install-dbt-extension) <Lifecycle status="preview" />
- [Install the Fusion CLI](/docs/fusion/install-fusion) <Lifecycle status="preview" />
- [Upgrade to the dbt platform](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine) <Lifecycle status="beta" />

## How it works

At a glance, <Constant name="fusion_engine" /> is the engine that powers the modern dbt developer experience across <Constant name="core" />, the dbt platform (including features like <Constant name="studio" />, state-aware orchestration, and more), and the VS Code extension.

It brings static analysis and faster, more consistent compilation to every environment where you build with dbt.

Under the hood, Fusion:

Parses and analyzes your dbt project statically

Renders Jinja into SQL safely and predictably

Builds dependency graphs between models, macros, and sources

Generates and validates dbt artifacts

Communicates efficiently with your data platform for compilation and execution

Those capabilities live inside the Fusion Engine, which is the foundation for all Fusion experiences:

ADD DIAGRAM HERE

## Supported environments


## Paths
