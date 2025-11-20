---
title: "Fusion package compatibility"
id: "fusion-package-compat"
description: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
intro_text: "Learn how to upgrade your packages to be compatible with the dbt Fusion engine."
---

Thank you for being part of the [dbt package hub](https://hub.getdbt.com/) and maintaining dbt packages! Your work makes dbt’s ecosystem possible  helping thousands of teams reuse trusted models and macros to build faster, more reliable analytics.

This guide will help you upgrade your dbt packages to be <Constant name="fusion" />-compatible. A <Constant name="fusion" />-compatible package supports <Constant name="fusion_engine" /> version 2.0.0 and higher using the `require-dbt-version` field and aligns with the strict JSON schema introduced in dbt Core v1.10.0.


## Who is this for?

This guide applies to any maintainer of a dbt package that defines models, macros, tests, metrics, or exposures in YAML.

If your package supports users on <Constant name="core" /> today, you’ll need to make it compatible with the <Constant name+fusion"/> authoring layer, which uses a stricter schema to validate YAML and prevent silent errors.

Why this matters:

- Fusion enforces validation: It uses JSON Schema to define exactly what valid dbt YAML looks like.
- Old YAML is being deprecated: In dbt Core 1.10, it triggers warnings; in Fusion, it’s ignored after a warning.
- User experience: Outdated YAML causes confusing warnings or runtime errors in packages that users don’t own.

Updating your package ensures users see clean runs — and your package stays visible and trusted on dbt Hub.

⚙️ Requirements

Before you begin:

dbt Core v1.10 or later
You’ll need at least this version to validate against the new authoring layer.

dbt-autofix
dbt-autofix is an official CLI that automatically updates your YAML files to comply with the new JSON Schema.

brew install uv
uv tool install --from git+https://github.com/dbt-labs/dbt-autofix.git
dbt-autofix --help


To upgrade later:

uv tool update dbt-autofix


Repository access
You’ll need permission to create a branch and release a new version of your package.

🔧 How to make your package Fusion-compatible
1. Create a migration branch
git checkout -b fusion-compat

2. Run dbt-autofix

Run autofix in your package directory:

dbt-autofix deprecations


This will automatically rewrite deprecated YAML to match the latest schema.

You can also run autofix in check mode for CI:

dbt-autofix deprecations --check


If your tests or example projects use packages, use:

dbt-autofix deprecations --include-packages

3. Review and test your changes

Review and commit the modified files.

Run your package’s tests to confirm everything still passes:

dbt test


Fix any manual items left in the diff that autofix couldn’t handle.

4. Update your dbt version requirement

In your dbt_project.yml, update the require-dbt-version
 field:

require-dbt-version: [">=2.0.0"]


This declares that your package supports the Fusion authoring layer (Core 1.10+).
Packages without this requirement will not be marked as Fusion-compatible on dbt Hub.

5. Cut a new release

Tag and publish your new release.

Update your README to note that the package is Fusion-compatible.

Announce it in #package-maintainers on dbt Slack if you’d like.

dbt Labs will use this release metadata to mark your package with a Fusion-compatible badge in dbt Hub.

⚡ TL;DR / Maintainer Checklist

 Create a fusion-compat branch

 Run dbt-autofix deprecations

 Review, commit, and test changes

 Update require-dbt-version: [">=2.0.0"]

 Cut a new release

 Announce the update (optional)

 Celebrate your new “Fusion-compatible” badge 🎉

💬 Common Questions

Q: Why >=2.0.0?
Fusion and Core 1.10+ use the same new authoring layer. Declaring require-dbt-version: [">=2.0.0"] ensures your package is compatible with both.

Q: Can users patch my package themselves?
They can temporarily run:

dbt-autofix deprecations --include-packages


However, this fix is overwritten each time dbt deps runs.
Permanent fixes must come from package maintainers.

Q: How often will this change?
Expect a few more schema updates before October 2025. When a new schema version ships, rerun autofix and cut a patch release.

Q: How will users know my package is Fusion-compatible?
Fusion-compatible packages will soon display a badge on dbt Hub. This is automatically determined based on your package’s metadata and version requirements.

❤️ Thank You

Your contributions make dbt’s package ecosystem thrive.
By upgrading now, you’re ensuring a smoother experience for users, paving the way for the next generation of dbt projects, and helping dbt Fusion reach full stability.

If you have questions or run into issues:

Join the conversation in #package-maintainers or #dbt-fusion-engine on Slack.

Open an issue in dbt-autofix
 or dbt-core discussions
.

Thank you again for helping us make the dbt ecosystem stronger — one package at a time 💚
