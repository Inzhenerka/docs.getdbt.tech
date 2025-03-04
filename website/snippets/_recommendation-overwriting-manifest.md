To prevent the `manifest.json` from being overwritten before dbt reads it for change detection, update your workflow using one of these methods:

- Move the `manifest.json` to a dedicated folder (for example `state/`) after dbt generates it in the `target/ folder`. This makes sure dbt references the correct saved state instead of comparing the current state with the just-overwritten version. It also avoids issues caused by setting `--state` and `--target-path` to the same location, which can lead to non-idempotent behavior.

    - This ensures dbt compares against the correct previous state, and it avoids issues caused by setting `--state` and `--target-path` to the same path, which can lead to non-idempotent behavior.

- Write the manifest to a different `--target-path` in the build stage (where dbt would generate the `target/manifest.json`) or in the reproduction stage (the sequence of steps that lead to the issue where dbt overwrites the `manifest.json` before it can be used for change detection).
- Pass the `--no-write-json` flag: `dbt --no-write-json ls --select state:modified --state target`: during the reproduction stage.