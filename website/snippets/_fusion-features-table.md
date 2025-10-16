

## Features and capabilities
<!-- table 2 for feature comparison (“What’s available where?”)-->
<Constant name="fusion_engine" /> (built on Rust) gives your team 30x faster performance and comes with different features depending on where you use it. If you're not sure what is available where, check out the following table.

To stay up-to-date on the latest features and capabilities, check out the [Fusion diaries](https://github.com/dbt-labs/dbt-fusion/discussions).

> **Legend:** ✅ = Available 🟡 = Partial / compile-time only ❌ = Not available 🔜 = Coming soon  

| **Category / Capability** | **dbt Core**<br /><small>(self-hosted)</small> | **Fusion CLI**<br/><small>(self-hosted)</small> | **VS Code + Fusion** | **<Constant name="dbt_platform" />***<br/><small>(<Constant name="cloud_ide" />/<Constant name="visual_editor" />)</small> |
|:---------------------------|:--------------------:|:--------------------:|:------------------:|:----------------------:|
| **Engine performance** |  |  |  |  |
| SQL parsing & compilation | ✅ | ✅ | ✅ | ✅ |
| Uses the <Constant name="fusion_engine"/> | ❌ <br /><small>(Built on Python)</small> | ✅ | ✅ | ✅ |
| Faster parse / compile | ❌ | ✅ | ✅ | ✅ |
| Incremental compilation | ❌ | ✅ | ✅ | ✅ |
| **Editor & development experience** |  |  |  |  |
| IntelliSense / autocomplete / hover info | ❌ | ❌ | ✅ | ✅ |
| Inline errors (on save / in editor) | ❌ | 🟡 | ✅ | ✅ |
| Live CTE previews / compiled SQL view | ❌ | ❌ | ✅ | ✅ |
| Refactoring tools (rename model / column) | ❌ | ❌ | ✅ | 🔜 |
| Go-to definition / references | ❌ | ❌ | ✅ | 🔜 |
| Column-level lineage (in editor) | ❌ | ❌ | ✅ | 🔜 |
| **Platform & governance** |  |  |  |  |
| State-aware orchestration (SAO) | ❌ | ❌ | ❌ | ✅ |
| Governance (PII / PHI tracking) | ❌ | ❌ | ❌ | 🔜 |
| CI/CD cost optimization (Slimmer CI) | ❌ | ❌ | ❌ | 🔜 |

*[<Constant name="query_page" />](/docs/explore/dbt-insights) (our explore and query tool) also runs on the <Constant name="fusion_engine" /> and has the following [LSP features](/docs/explore/navigate-dbt-insights#lsp-features). <Constant name="fusion"/> support for other <Constant name="dbt_platform" /> tools, like <Constant name="semantic_layer" /> and <Constant name="explorer" />, is coming soon.

#### Additional considerations
Here are some additional considerations if using the Fusion CLI or VS Code extension:
    - **Fusion CLI** ([binary](/blog/dbt-fusion-engine-components))
      - Runs on the <Constant name="fusion_engine" /> (distinct from <Constant name="core" />) and free to use. 
      - Benefits from Fusion engine’s performance for `parse`, `compile`, `build`, and `run`, but doesn't include visual and interactive [features](/docs/dbt-extension-features) like autocomplete, hover insights, lineage, and more.  
      - Requires `profiles.yml` only (no `dbt_cloud.yml`).
    - **dbt VS Code extension**
      - Free to use and runs with the <Constant name="fusion_engine" />; after 14 days you register an email. 
      - Benefits from <Constant name="fusion" /> engine’s performance for `parse`, `compile`, `build`, and `run`, and also includes visual and interactive [features](/docs/dbt-extension-features) like autocomplete, hover insights, lineage, and more.
      - Capped at 15 users per organization.
      - If you already have a <Constant name="dbt_platform" /> user account (even if a trial expired), sign in with the same email. Unlock or reset it if locked.  
      - Requires both `profiles.yml` and `dbt_cloud.yml` files.
