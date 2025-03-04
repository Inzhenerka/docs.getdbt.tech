dbt overwrites the `manifest.json` file during parsing, which means when you reference `--state` from the `target/ directory`, you may encounter a warning indicating that the saved manifest wasn't found.

<Lightbox src="/img/docs/reference/saved-manifest-not-found.png" title="Saved manifest not found error" /> 

During the next job run, in the reproduction step (this step refers to the specific sequence of steps that lead to the issue where dbt overwrites the `manifest.json` before it can be used for change detection), the `target/manifest.json` is overwritten. After overwriting, dbt reads the `target/manifest.json` again to detect changes but finds none. 

Avoid setting `--state` and `--target-path` to the same path with state-dependent features like `--defer` and `state:modified` as it can lead to non-idempotent behavior and won't work as expected.