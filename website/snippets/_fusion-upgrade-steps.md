import FusionDWH from '/snippets/_fusion-dwh.md';

:::tip Before you start
   - Review the [significant changes](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#changed-functionality) in the upgrade guide. Update dbt packages and resolve all deprecations surfaced by Fusion validation. Use the [dbt-autofix tool](https://github.com/dbt-labs/dbt-autofix) to fix many of them.
   - Pick environments intentionally. During rollout, you may have a development/staging environment on Fusion while your production environment stays on Latest (dbt Core engine). That’s fine during the upgrade process, but note that  stateful features (like `state:modified`) across that boundary may not work as expected. Check out the [Known limitations during upgrade](#known-limitations-during-upgrade) section for more details.
:::

The following recommended steps will help you upgrade safely to the dbt Fusion engine:

1. Make sure you're using a supported adapter and authentication method:
        <FusionDWH /> 

2. Prepare your project
   - To increase the compatibility of your project, update all jobs and environments to the `Latest` release track and follow our [upgrade guide](/docs/dbt-versions/core-upgrade/upgrading-to-fusion). 
   - Update [packages to Fusion-compatible releases](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#packages-and-deprecations).
   - Resolve deprecations and validation errors surfaced by Fusion. Use the [dbt-autofix tool](https://github.com/dbt-labs/dbt-autofix) to fix them.

3. Upgrade development environment first
   - Following the [recommended guidance](#testing-your-changes-before-upgrading), create a Fusion development environment (on a long-lived feature branch that's not `main`).
        <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions/upgrade-fusion.png" width="90%" title="Upgrading to the Fusion engine in dbt platform's environment settings." />
   - Execute `dbt parse`/`dbt compile` in your development environment and make sure the commands pass successfully.
   - (Optional) If using the Studio IDE, refresh the development environment to apply the new packages and settings.

4. Validate before merging
   - With prod still on Latest (dbt Core engine), confirm the following in the Fusion development environment:
     - Fusion data matches the data from Latest (dbt Core engine) for models/datasets. 
     - Downstream projects and `dbt docs generate` also succeed in the Fusion environment.
   - (Optional) You can create a staging Fusion environment for side-by-side comparison.

5. Cut over production
   - Now that you've checked all the boxes, switch your production environment to Fusion.
   - Delete the Latest (dbt Core engine) environment (or optional staging environment) when stable to keep your environment list clean.

#### Known limitations during upgrade

The following are known limitations during the upgrade process:

- **Manifest incompatibility** &mdash; Fusion writes manifest v20; whereas the dbt Core engine writes to [earlier manifest versions](/reference/artifacts/manifest-json). Manifests from different engines (Core and Fusion) can’t be used together across environments, so avoid using `state:modified`, `--defer`, or cross-env `dbt docs generate` until _all_ environments are upgraded to the **Latest Fusion** version. Using these features before all environments are on Fusion may cause errors and failures.

- **State-aware orchestratio**n &mdash; If using [state-aware orchestration](/docs/deploy/state-aware-about), dbt doesn't detect a change if a table or view is dropped externally. This means state-aware orchestration _will not_ rebuild it.
  - Workarounds:
    - Use **Clear cache** button on the Environment settings page to force a full rebuild (acts like a reset). <!-- not avail yet and link to Bianca's doc on instructions) --> OR 
    - Temporarily disable State-aware orchestration for the job and rerun it again.
