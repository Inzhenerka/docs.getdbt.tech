#### Known limitations during upgrade

The following are known limitations during the upgrade process:

- **Manifest incompatibility** &mdash; Fusion writes manifest v20; whereas the dbt Core engine writes to [earlier manifest versions](/reference/artifacts/manifest-json). Manifests from different engines (Core and Fusion) can’t be used together across environments, so avoid using `state:modified`, `--defer`, or cross-env `dbt docs generate` until _all_ environments are upgraded to the **Latest Fusion** version. Using these features before all environments are on Fusion may cause errors and failures.

- **State-aware orchestratio**n &mdash; If using [state-aware orchestration](/docs/deploy/state-aware-about), dbt doesn't detect a change if a table or view is dropped externally. This means state-aware orchestration _will not_ rebuild it.
  - Workarounds:
    - Use the **Clear cache** button on the Environment settings page to force a full rebuild (acts like a reset). <!-- not avail yet and link to Bianca’s doc on instructions) --> OR
    - Temporarily disable State-aware orchestration for the job and rerun it again.
