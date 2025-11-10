---
datatype: version-range | [version-range]
description: "Read this guide to understand the require-dbt-version configuration in dbt."
default_value: None
---

:::info Fusion compatibility
The `require-dbt-version` signals whether a project or package supports <Constant name="fusion_engine"/> (`2.0.0` and higher). 
- If your version range includes 2.0 and higher, it's compatible with <Constant name="fusion"/>. 
- Initially, <Constant name="fusion"/> will show a warning when a project's or package's `require-dbt-version` excludes 2.0+. 
- In a future release, this will error, matching <Constant name="core"/> behavior. 
- You can [bypass version checks](#disabling-version-checks) with `--no-version-check`. 

Refer to [pin to a range](#pin-to-a-range) for more info.
:::

<File name='dbt_project.yml'>

```yml
require-dbt-version: version-range | [version-range]
```

</File>

## Definition

You can use `require-dbt-version` to restrict your project to only work with a range of dbt versions. 

When you set this configuration, dbt issues error messages for any user who attempts to run the package with an unsupported version of dbt. This is currently only enforced for packages on the [dbt Packages hub](https://hub.getdbt.com/). This can be useful for package maintainers (such as [dbt-utils](https://github.com/dbt-labs/dbt-utils)) to ensure that users' dbt version is compatible with the package. Setting this configuration might also help your whole team remain synchronized on the same version of dbt for local development, to avoid compatibility issues from changed behavior.

You should pin to a major release. See [pin to a range](#pin-to-a-range) for more details. If this configuration isn't specified, no version check will occur.

:::info <Constant name="cloud" /> release tracks 

<Snippet path="_config-dbt-version-check" />

:::

## YAML quoting

This configuration needs to be interpolated by the YAML parser as a string. As such, you should quote the value of the configuration, taking care to avoid whitespace. For example:
```yml
# ✅ These will work
require-dbt-version: ">=1.0.0" # Double quotes are OK
require-dbt-version: '>=1.0.0' # So are single quotes

# ❌ These will not work
require-dbt-version: >=1.0.0 # No quotes? No good
require-dbt-version: ">= 1.0.0" # Don't put whitespace after the equality signs
```

#### Avoid unbounded upper limits

We don't recommend having an unbounded `require-dbt-version` (for example, `">=1.0.0"`). Without an upper limit, a project may break when dbt releases a new major version. We recommend [defining both lower and upper bounds](#pin-to-a-range), such as `">=1.0.0,<3.0.0"`, to ensure stability across releases. 

## Examples

The following examples showcase how to use the `require-dbt-version`:

<!-- no toc -->
- [Specify a minimum dbt version](#specify-a-minimum-dbt-version) &mdash; Use a <code>>=</code> operator for a minimum boundary.
- [Pin to a range](#pin-to-a-range) &mdash; Use a comma separated list to specify an upper and lower bound.
- [Require a specific dbt version](#require-a-specific-dbt-version) &mdash; Restrict your project to run only with an exact version of <Constant name="core" />.

### Specify a minimum dbt version
Use a `>=` operator to specify a lower and an upper limit. In the following example, this project will run with any version of dbt greater than or equal to 1.0.0.


<File name='dbt_project.yml'>

```yml
require-dbt-version: ">=1.0.0"
```

</File>

Remember, having an unbounded upper limit isn't recommended. Instead, check out the [pin to a range](#pin-to-a-range) example to define a range with both a lower and upper limit to ensure stability across releases.

### Pin to a range
Use a comma-separated list for an upper and lower bound. You can define a version range either as a YAML list (using square brackets) or as a comma-delimited string.

- [General range](#general-range) &mdash; Use a comma separated list to specify an upper and lower bound.
- [Fusion-compatible range](#fusion-compatible-range) &mdash; Include 2.0.0 or greater in your version range to signal compatibility with the <Constant name="fusion_engine"/>.

#### General range
In the following examples, this project will run with dbt 1.x.x:

<File name='dbt_project.yml'>

```yaml
require-dbt-version: [">=1.0.0", "<2.0.0"] # with a YAML list

# OR

require-dbt-version: ">=1.0.0,<2.0.0" # with a comma-delimited string

```
</File>

#### Fusion-compatible range

To signal compatibility with the <Constant name="fusion_engine"/>, include 2.0.0 or greater in your version range.

<File name='dbt_project.yml'>

```yaml
require-dbt-version: [">=1.10.0", "<3.0.0"] # with a YAML list

# OR

require-dbt-version: ">=1.10.0,<3.0.0" # with a comma-delimited string
```
</File>

If your range excludes 2.0.0 (for example, `>=1.6.0,<2.0.0`), <Constant name="fusion"/> will show a warning today and then an error in a future release. You can bypass version checks with `--no-version-check`.

 
### Require a specific dbt version

:::info Not recommended
Pinning to a specific dbt version is discouraged because it limits project flexibility and can cause compatibility issues, especially with dbt packages. It's recommended to [pin to a major release](#pin-to-a-range), using a version range (for example, `">=1.0.0", "<2.0.0"`) for broader compatibility and to benefit from updates.

While you can restrict your project to run only with an exact version of <Constant name="core" />, we do not recommend this for <Constant name="core" /> v1.0.0 and higher. 

:::

In the following example, the project will only run with dbt v1.5: 

<File name='dbt_project.yml'>

```yml
require-dbt-version: "1.5.0"
```

</File>

## Invalid dbt versions

If the version of dbt used to invoke a project disagrees with the specified `require-dbt-version` in the project or _any_ of the included packages, then dbt will fail immediately with the following error:
```
$ dbt compile
Running with dbt=1.5.0
Encountered an error while reading the project:
Runtime Error
  This version of dbt is not supported with the 'my_project' package.
    Installed version of dbt: =1.5.0
    Required version of dbt for 'my_project': ['>=1.6.0', '<2.0.0']
  Check the requirements for the 'my_project' package, or run dbt again with --no-version-check
```

## Disabling version checks

To suppress failures to to incompatible dbt versions, supply the `--no-version-check` flag to `dbt run`.
```
$ dbt run --no-version-check
Running with dbt=1.5.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

See [global configs](/reference/global-configs/version-compatibility) for usage details.
