<Constant name="fusion_engine" /> powers dbt development everywhere — in the [<Constant name="dbt_platform" />](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine), VS Code/Cursor, and locally.

Features vary by environment. Whether you’re new to dbt or already set up, the following table shows which Fusion-friendly tools you can use and what’s available where.

<Constant name="fusion_engine" /> for <Constant name="dbt_platform" /> is currently in private preview. Contact your account team for access.

<!-- table 1 for orientation (“Which tool should I use?”)-->

| <div style={{width:'120px'}}>Developing in</div> | <div style={{width:'150px'}}>Tools you can use</div> | <div style={{width:'160px'}}>Available to</div> | <div style={{width:'160px'}}>Engine supported</div> | <div style={{width:'280px'}}>Features available</div> |
| --- | --- | --- | --- | --- |
| **<Constant name="dbt_platform" />** | - [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)<br />- [<Constant name="visual_editor" />](/docs/cloud/canvas)<br />- [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt)<br /><small>(VS Code or Cursor)</small>| - <Constant name="dbt_platform" /> users <br />- Hybrid users |- <Constant name="fusion_engine" /> <small>(Rust-based)</small><br />- <Constant name="core" /> engine <small>(Python-based)</small> | - The <Constant name="fusion_engine"/> offers fast, reliable compilation, static analysis, validation, and job execution.<br />- <Constant name="fusion"/> has visual and interactive features: autocomplete, inline errors, live CTE previews, lineage, and more. |
| **Local environment** | - [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt)<br /><small>(VS Code or Cursor)</small> <br />- [Fusion CLI](/docs/fusion/install-fusion-cli) <br />- [dbt CLI (Core)](/docs/core/installation-overview) | - <Constant name="dbt_platform" /> users<br />- <Constant name="core" /> users<br />- Hybrid users | - <Constant name="fusion_engine" /><br />- <Constant name="core" /> engine | - **VS Code extension:** Combines <Constant name="fusion"/> performance with visual features when developing locally.<br /><br />- **Fusion CLI:** Provides <Constant name="fusion"/> performance benefits (faster parsing, compilation, execution) but _does not include_ visual features like autocomplete or lineage.<br /><br />- **dbt CLI (Core):** Uses the Python-based <Constant name="core" /> engine for traditional workflows. |

---


|  <div style={{width:'120px'}}>Developing in</div> | <div style={{width:'220px'}}>Fusion-friendly tool you can use</div>  | <div style={{width:'125px'}}>Supports projects in</div> | Fusion features |
| --- | --- | --- | --- | 
| <Constant name="dbt_platform" /> |- [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud)<br/ >- [<Constant name="visual_editor" />](/docs/cloud/canvas)<br />- [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt)| <Constant name="dbt_platform" /><br /> <Constant name="core" />  | - Fast, reliable compilation, static analysis, validation, and job execution. <br /> - Visual and interactive features like autocomplete, inline errors, live CTE previews, lineage, and more.<br />- To upgrade, see [Upgrade to <Constant name="fusion" />](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine). |
| VS Code or Cursor | [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt) | <Constant name="dbt_platform" /><br /> <Constant name="core" />  |- Fast, reliable compilation, static analysis, validation, and job execution.<br /> - Visual and interactive features like autocomplete, inline errors, live CTE previews, lineage, and more. |
| <Constant name="core" /> local |- [Fusion CLI](/docs/fusion/install-fusion-cli)<br />-  [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt)  |  <Constant name="dbt_platform" /><br /> <Constant name="core" />  | - Fusion CLI: Provides <Constant name="fusion"/> performance benefits, such as faster performance, parsing, and execution (like `parse`, `compile`, `build`, and `run`) but _doesn't include_ the visual [features](/docs/dbt-extension-features) available in the <Constant name="dbt_platform" /> or VS Code extension (such as autocomplete, hover insights, lineage, and more).<br /><br />- VS Code extension: Comes with <Constant name="fusion"/> performance benefits, as well as those visual features when developing locally. |

:::info Not sure where to start?
Try out the [<Constant name="fusion" /> quickstart](/guides/fusion) and check out the [<Constant name="fusion" /> migration guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion) to see how to migrate your project.
:::
