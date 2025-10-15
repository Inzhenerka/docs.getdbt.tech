---
title: "dbt Fusion engine"
id: "fusion"
description: "Fusion is the next-generation engine and development experience for dbt projects."
pagination_next: "docs/fusion/about-fusion"
pagination_prev: "docs/introduction"
---

<Constant name="fusion" /> is the next-generation engine built on Rust, that powers development across the <Constant name="dbt_platform" /> (formerly dbt Cloud),  <Constant name="core" />, and the VS Code extension.

It’s faster, smarter, and more consistent &mdash; bringing static analysis, autocomplete, instant feedback &mdash; to every dbt workflow, and a deeply integrated VS Code experience powered by a [Language Server Protocol (LSP)](https://docs.getdbt.com/blog/dbt-fusion-engine-components#the-dbt-vs-code-extension-and-language-server) (which helps power editor features like autocomplete, hover info, and inline error highlighting)

## Getting started
Fusion is integrated in many different ways across the dbt ecosystem &mdash; in the <Constant name="dbt_platform" />, in VS Code/Cursor, or locally with <Constant name="core" />. 

All of these tools use the same next-generation Fusion engine, but the features and experience differ depending on where you develop. If you're not sure where to begin, check out the table to see which option is best for you:

<!-- table 1 for orientation (“Which tool should I use?”)-->
| Development | <div style={{width:'200px'}}>What you can use</div>  | <div style={{width:'125px'}}>Works with</div> | Fusion features |
| --- | --- | --- | --- | 
| <Constant name="dbt_platform" /> |- [<Constant name="cloud_ide" />](/docs/cloud-ide)<br/ >- [<Constant name="visual_editor" />](/docs/cloud/canvas)<br />- [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt)| <Constant name="dbt_platform" /><br /> <Constant name="core" />  | - Fast, reliable compilation, static analysis, validation, and job execution. <br /> - Visual and interactive features like autocomplete, inline errors, live CTE previews, lineage, and more. |
| VS Code or Cursor | [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt) | <Constant name="dbt_platform" /><br /> <Constant name="core" />  |- Fast, reliable compilation, static analysis, validation, and job execution.<br /> - Visual and interactive features like autocomplete, inline errors, live CTE previews, lineage, and more. |
| <Constant name="core" />  |- [Fusion CLI](/docs/fusion/install-fusion-cli) <br />-  [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt)  | <Constant name="dbt_platform" /><br /> <Constant name="core" />  | - Fusion CLI: Provides <Constant name="fusion"/> performance benefits, such as faster performance, parsing, and execution (like `parse`, `compile`, `build`, and `run`) but _doesn't include_ the visual features available in the <Constant name="dbt_platform" /> or VS Code extension (such as autocomplete, hover insights, lineage, and more).<br /><br />- VS Code extension: Comes with <Constant name="fusion"/> performance benefits, as well as those visual features when developing locally. |

:::info Not sure where to start?
Try out the [<Constant name="fusion" /> quickstart](/guides/fusion) and check out the [<Constant name="fusion" /> migration guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion) to see how to migrate your project.
:::

## Features and capabilities
<!-- table 2 for feature comparison (“What’s available where?”)-->
<Constant name="fusion_engine" /> comes with different features and capabilities depending on where you use it. The following table compares the features available in each environment.

> **Legend:** ✅ = Available 🟡 = Partial / compile-time only ❌ = Not available 🔜 = Coming soon  

| **Category / Capability** | **<Constant name="core" />** | **Fusion CLI**<br/><small>(self-hosted)</small> | **VS Code + Fusion** | **<Constant name="dbt_platform" />**<br/><small>( <Constant name="cloud_ide" /> / <Constant name="visual_editor" />)</small> |
|:---------------------------|:--------------------:|:--------------------:|:------------------:|:----------------------:|
| **Engine performance** |  |  |  |  |
| Faster parse / compile | ❌ | ✅ | ✅ | ✅ |
| Incremental compilation | ❌ | ✅ | ✅ | ✅ |
| **Editor & development experience** |  |  |  |  |
| Autocomplete / hover info | ❌ | ❌ | ✅ | ✅ |
| Inline errors (on save / in editor) | ❌ | 🟡 | ✅ | ✅ |
| CTE previews / compiled SQL view | ❌ | ❌ | ✅ | ✅ |
| Refactoring tools (rename model / column) | ❌ | ❌ | ✅ | 🔜 |
| Go-to definition / references | ❌ | ❌ | ✅ | 🔜 |
| Column-level lineage (in editor) | ❌ | ❌ | ✅ | 🔜 |
| **Platform & governance** |  |  |  |  |
| State-aware orchestration (SAO) | ❌ | ❌ | ❌ | ✅ |
| Governance (PII / PHI tracking) | ❌ | ❌ | ❌ | 🔜 |
| CI/CD cost optimization (Slimmer CI) | ❌ | ❌ | ❌ | 🔜 |

---

#### Considerations

- **Fusion CLI** – Completely **free**, no registration or login required. Provides the Fusion engine’s performance for `parse`, `compile`, `build`, and `run`, but **no visual IDE features**.  
- **VS Code extension** – Free; after 14 days you register an email.  
  - If you already have a **<Constant name="dbt_platform" /> user account** (even if a trial expired), sign in with the **same email**.  
  - The installer recognizes existing accounts to prevent duplicates; unlock or reset if locked.  
  - Free tier limit = 15 users per org (Enterprise = unlimited).  
- Local tools (`CLI`, `VS Code`) use **`profiles.yml`** and `dbt_cloud.yml`; <Constant name="dbt_platform" /> doesn't need a `profiles.yml` file.  

------
<!-- table 2 for feature comparison (“What’s available where?”)-->

#### Engine performance

| Capability | Core | Fusion CLI | VS Code + Fusion | dbt Platform |
|-------------|:----:|:-----------:|:----------------:|:-------------:|
| Faster parse/compile | ❌ | ✅ | ✅ | ✅ |
| Incremental compilation | ❌ | ✅ | ✅ | ✅ |

#### Editor and development experience

| Capability | Core | Fusion CLI | VS Code + Fusion | dbt Platform |
|-------------|:----:|:-----------:|:----------------:|:-------------:|
| Autocomplete / hover info | ❌ | ❌ | ✅ | ✅ |
| Inline errors on save | ❌ | 🟡 | ✅ | ✅ |
| CTE previews | ❌ | ❌ | ✅ | ✅ |
| Refactoring tools | ❌ | ❌ | ✅ | 🔜 |

#### Platform and governance

| Capability | Core | Fusion CLI | VS Code + Fusion | dbt Platform |
|-------------|:----:|:-----------:|:----------------:|:-------------:|
| SAO orchestration | ❌ | ❌ | ❌ | ✅ |
| Governance (PII/PHI) | ❌ | ❌ | ❌ | 🔜 |

## Availability and licensing

- Fusion CLI &mdash; Runs on <Constant name="fusion" /> (distinct from <Constant name="core" />) and is completely free to use. It includes a mix of [source-available (ELv2)](https://www.elastic.co/licensing/elastic-license) and open-source (Apache 2.0), and proprietary components. You can use only the source-available code if you prefer. Refer to [<Constant name="fusion" /> licensing details](https://www.getdbt.com/licenses-faq) for more information.
- The dbt VS Code extension is free to use and runs with the <Constant name="fusion_engine" />. It's also free to use (requires email registration within 14 days) and is capped at 15 users per organization.
