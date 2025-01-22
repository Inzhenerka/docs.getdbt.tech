The dbt Cloud CLI doesn't currently support relative paths in the [`packages.yml` file](/docs/build/packages). This mostly applies to organizations that use a monorepo structure. 

For example, trying to reference the `shared_macros` directory from your `packages.yml` file like this won't work:

```yaml
# repository_root/my_dbt_project_in_a_subdirectory/packages.yml

packages:
  - local: ../shared_macros
```

In this example, `../shared_macros` is a relative path that tells dbt to look for:
- `..` &mdash; Go one directory up (to repository_root).
- `/shared_macros` &mdash; Find the `shared_macros` folder in the root directory.

To work around this limitation:
- Use the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) to support relative paths for this use case.
- If using a monorepo with multiple projects as subdirectories, use [private packages](/docs/build/packages#private-packages) or the [git clone method](/docs/build/packages#ssh-key-method-command-line-only) to share package across projects.
- If using a monorepo with multiple projects as separate repositories, use [project dependencies](/docs/collaborate/govern/project-dependencies) to share the package across projects.
- If using monorepo with single project, store the package in the same repository as the project.
