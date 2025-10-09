#### Upgrade considerations

Keep in mind the following considerations during the upgrade process:

- **Manifest incompatibility** &mdash; <Constant name="fusion" /> is backwards-compatible and can read <Constant name="core" /> [manifests](/reference/artifacts/manifest-json). However, <Constant name="core" /> isn't forward-compatible and can't read Fusion manifests.

  As a result, mixing <Constant name="core" /> and <Constant name="fusion" /> manifests across environments breaks cross-environment features. Use `state:modified`, `--defer`, and cross-env `dbt docs generate` only once _all_ environments run the latest <Constant name="fusion" /> version. Using these features before all environments are on <Constant name="fusion" /> may cause errors and failures.

- **State-aware orchestration** &mdash; If using [state-aware orchestration](/docs/deploy/state-aware-about), dbt doesn't detect a change if a table or view is dropped externally. This means state-aware orchestration _will not_ rebuild it.
  - Use the following workarounds:
    - Use the **Clear cache** button on the selected Environment settings' page to force a full rebuild (acts like a reset) OR
    - Temporarily disable State-aware orchestration for the job and rerun it again.
