---
title: "Weekly dbt single-tenant release notes"
description: "Release notes for weekly single-tenant updates."
id: "dbt-cloud-release-notes-gen"
sidebar: "dbt single-tenant release notes"
pagination_next: null
pagination_prev: null
unlisted: true
---

<Constant name="cloud" /> Single-tenant release notes for weekly updates. Release notes fall into one of these categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by date for single-tenant environments.


## December 24, 2025

### New

- **AI Codegen**
  - **File-aware LangGraph agents**: Analysts can now drop `@path` references in the bundled CLI to stream local files into `/private/v1/agents/run`, which are auto-rendered as text inside the run so copilots have the exact config or SQL snippet you referenced.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/compare/f776c620d16de68bb3b5f61fd0c15e81a23b3730...fa7756165da9d3039ca4013b12e7fb264fe565ba -->

- **dbt platform**
  - **Slack Copilot feedback loops**: Copilot replies now carry inline "Did that answer your question?" buttons, backed by a dedicated `/integrations/slack/interactive/` endpoint and AI telemetry so tenants can rate answers without leaving Slack.  
  <!-- PR: link needed (not provided in diff bundle) -->
  - **Cost Insights role presets**: New Cost Insights Admin/Viewer permission sets package the exact account + project scopes required to manage or consume telemetry, making it easier to grant least-privilege access.  
  <!-- PR: link needed (not provided in diff bundle) -->

- **Codex Workflows**
  - **Databricks cost tracking for Model Cost Over Time**: A Databricks history provider and DBU-based cost query now surface daily model cost alongside Snowflake coverage, so Databricks tenants get unified FinOps reporting.  
  <!-- PR: https://github.com/dbt-labs/codex/compare/06888fddb250a8eb6650349d70e0ef4f22fbd189...1e103cbdcd951421cd0c93f3090bfc415333885c -->

- **MetricFlow**
  - **Public cancelQuery mutation**: Tenants can stop queued, compiling, or running MetricFlow jobs through the public GraphQL API, receiving clear errors if the job already completed or belongs to another environment.  
  <!-- PR: https://github.com/dbt-labs/metricflow-server/compare/45b411d96c1540a3c3624ddef1c5147fb3f6f658...a1695f6a71ea650c71c9a560328b42dbb4cb6c70 -->

- **Visual Editor**
  - **Canvas-in-Fusion previews & CSV upload GA**: Canvas previews, seed uploads, and docs updates honor the `VE-1886-canvas-in-fusion` flag end-to-end (inline invocations, shared artifacts) and the CSV upload endpoint is now generally available with better validation, so Fusion tenants see faster previews and reliable source onboarding.  
  <!-- PR: https://github.com/dbt-labs/visual-editor/compare/d52fdf77d5f90463e1b0d21617d3f2df31f4ae71...c854a51a529265fd7c1da7be7734d922cec039be -->

### Enhancements

- **AI Codegen**
  - **Semantic Layer-first workflows**: Internal Semantic Layer tools are promoted back into LangGraph with prompts that require `execute_sl_query` and dialect selection, reducing off-model SQL drift for Semantic Layer-heavy teams.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/compare/f776c620d16de68bb3b5f61fd0c15e81a23b3730...fa7756165da9d3039ca4013b12e7fb264fe565ba -->

- **Cloud Artifacts**
  - **Better similar-model suggestions**: Cosine-distance thresholds now apply after deduplicating embeddings, so attachment workflows only recommend meaningfully related models.  
  <!-- PR: https://github.com/dbt-labs/cloud-artifacts-internal-api/compare/65544c20206d2055212b4d6066f25aea6c3700b7...a98859c99ca0b03efa465dc26024279322ac12a3 -->

- **dbt platform**
  - **Unified SSO & SCIM admin**: Settings consolidate SSO + SCIM, add an empty state for auto-generated slugs, and render read-only login URLs so admins can start configuration without touching slug fields.  
  <!-- PR: link needed (not provided in diff bundle) -->
  - **SCIM token management polish**: Token tables gain fixed pagination, inline search, consistent iconography, and clearer deletion warnings to avoid accidental cuts to live integrations.  
  <!-- PR: link needed (not provided in diff bundle) -->
  - **Fusion model-build insights only when entitled**: Account Home now hides the "All model builds" chart unless both flags are on and the tenant truly has Fusion migration access, preventing empty widgets.  
  <!-- PR: link needed (not provided in diff bundle) -->
  - **Twice the per-environment custom variables**: The v3 API/UI now allow up to 20 scoped environment variables before enforcing limits, giving larger projects more room for secrets.  
  <!-- PR: link needed (not provided in diff bundle) -->

- **Insights UI**
  - **Filter dropdowns keep prior selections**: Builder filters continue showing the selected value while dimension values load, preventing accidental clearing when editing saved queries.  
  <!-- PR: https://github.com/dbt-labs/insights-ui/compare/2864fa2fdc6cd56f7eaedd64e54a473fc9d3a081...e7693d6136f4995444c34255891f3286249f7564 -->

- **Visual Editor**
  - **Dialect-aware projection SQL**: SELECT * RENAME/EXCEPT support now respects each warehouse's syntax using schema metadata, so SQL previews and column metadata stay accurate across Snowflake, Databricks, BigQuery, and Redshift.  
  <!-- PR: https://github.com/dbt-labs/visual-editor/compare/d52fdf77d5f90463e1b0d21617d3f2df31f4ae71...c854a51a529265fd7c1da7be7734d922cec039be -->

### Fixes

- **dbt platform**
  - **Webhook editor keeps job selections**: Default values are cached after the first render and stop resetting once the user edits the form, eliminating accidental job-list clearing while tabbing through fields.  
  <!-- PR: link needed (not provided in diff bundle) -->

- **Codex GraphQL**
  - **Exposure parents mirror the manifest**: `parentsModels` and `parentsSources` now derive from the manifest's `parents` list, so exposures with mixed upstreams display complete lineage in both the GraphQL API and UI.  
  <!-- PR: https://github.com/dbt-labs/codex-api/compare/c4b816ccd4e7736a494ec9b2d25ab25d52037c1a...d24b0f0e9b9c8f2f1505a057731dfb171177ebf3 -->
  <!-- PR: https://github.com/dbt-labs/codex-api-gateway/compare/c4b816ccd4e7736a494ec9b2d25ab25d52037c1a...d24b0f0e9b9c8f2f1505a057731dfb171177ebf3 -->

- **Insights UI**
  - **Multi-filter queries honor AND/OR**: Builder now preserves the AND/OR operator selected for each additional condition, keeping dashboard results aligned with the preview.  
  <!-- PR: https://github.com/dbt-labs/insights-ui/compare/2864fa2fdc6cd56f7eaedd64e54a473fc9d3a081...e7693d6136f4995444c34255891f3286249f7564 -->

### Behavior changes

- **dbt platform**
  - **Legacy Cost Management UI retired**: All costManagement pages and hooks were removed, and platform metadata credentials now only expose catalog ingestion and Cost Insights toggles, eliminating dead-end controls.  
  <!-- PR: link needed (not provided in diff bundle) -->


## December 17, 2025

### New

- **dbt platform**
  - **Feature licensing service**: A new `/accounts/<id>/feature-licenses` endpoint issues short-lived JWTs that encode entitled features, and service/PAT authentication now checks that a caller holds an active license on the target account before any Fusion-enabled workflow runs. 
  - **Databricks platform metadata credentials**: Databricks warehouses can register platform metadata credentials (token plus optional catalog), enabling catalog ingestion, metadata sharing, and Cost Insights pipelines without custom adapters. 

### Enhancements

- **dbt platform**
  - **Large list pagination**: Settings's Projects and Credentials now paginate after 25 rows (with search boxes and skeleton states), keeping navigation responsive for large deployments.
- **Metadata Explorer**
  - **Model context & lineage polish**: Model panels now show materialization type, lineage renders metadata strips only when content exists, and upstream public-model columns load automatically for better cross-project visibility.
  - **Freshness clarity & Studio navigation**: Source tiles respect the `meta5161ExpiredUnconfiguredSources` flag (showing warn/error thresholds) and "Open in IDE" links now point at `/studio/{accountId}/projects/{projectId}` to drop users directly into dbt Studio.

- **Insights UI**
  - **Copilot guardrails**: The Copilot listener now hydrates builder tabs only when a semantic-layer payload arrives, preventing plain-SQL replies from overwriting editor state. 
- **dbt CLI**
  - **Improved monorepo support for file sync and the IDE**:
    - File sync now anchors itself to the invocation directory, making monorepo structures behave more predictably.
    - Nested `dependencies.yml` files correctly trigger dependency installs.
    - The IDE’s LSP and file sync now recognize dbt subdirectories properly.
    - Exclusion lists remain accurate even in multi-project repositories.
- **Notifications system**
  - **Webhook auditability**: Outbound calls now persist the exact JSON body in webhook history, making allowlisting and troubleshooting easier. 

- **Studio**
  - **Git sidebar & file refresh parity**: The file tree now mirrors Cloud VCS statuses (including conflicts) and automatically invalidates caches after `dbt deps`/`dbt clean`, so new or removed files appear without a reload.
  - **Log viewers & Autofix UX**: Command and interactive query logs adopt the new accordion-based viewer, and Autofix sessions in Fusion treat plain `parse` commands as the trigger for deprecation summaries, keeping remediation flows consistent.

### Fixes

- **dbt platform**
  - **Environment variable editor stability**: Editing one variable no longer backfills blank cells with previously edited values, preventing accidental overrides. 
  - **Cost optimization indicator accuracy**: Job pages once again display “Cost optimization features” whenever Fusion actually runs (and gating conditions are met), so users see the right coverage status regardless of feature-flag permutations. 

### Behavior changes

- **dbt platform**
  - **Stronger tenant identity enforcement**: Service/PAT calls without an active license now fail authentication, Slack Copilot sessions build a scoped identity JWT for the invoking user, and SSO providers enforce auto-generated slugs (draft configs can’t be targeted), reducing misconfiguration risk. 

- **dbt CLI**
  - **User-isolated invocation history**: Every invocation lookup validates the caller’s user ID, preventing admins from accidentally reading another developer’s runs when multiple accounts share a CLI server. 
- **IDE server**
  - **Enhanced security for support-assisted sessions:** Support impersonation sessions now restrict the execution of `show`, `run`, `build`, and `test` commands. Artifacts generated by `dbt show` are also short-lived and will automatically expire after 15 minutes to limit unintended data retention.

- **dbt Orchestration**
  - **Fusion compare support & new dependency**: Fusion tracks now treat `dbt compare` as a supported command (no more target-path hacks). 

## December 10, 2025

### Enhancements

- **AI codegen API**: Streaming middleware enforces request-scoped instrumentation across every AI endpoint, offload warehouse calls via threads, and expose human-readable tool names while gating keyword search behind feature flag for approved tenants.
  
- **dbt platform**
  - **Operations clarity**: Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped so troubleshooting is faster.
  - **Collaboration & notifications**: Slack Copilot mentions are now more reliable, with hardened workers, support for CSV attachments, and improved logging. Webhook channels now accept longer URLs, handle “warning-only” subscriptions correctly, and automatically clean up corrupted job IDs.
  - **Profile & credential management**: Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync.

- **dbt CLI server**: Improved stability and performance for large projects.
- **Studio IDE**: For dbt Fusion logging, node start and end times will now properly be displayed in command output. 
- **Studio IDE**: Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps with clear UI labels. 
- **Studio IDE**: Tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.

### Fixes

- **Studio IDE server**: Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier, making automation failures actionable.

## December 3, 2025

### New

- **dbt platform**
  - **Autofix deprecation warnings**: When deprecations are detected, you now see "Autofix deprecation warnings."
  - **Autofix Packages detailed results**: After running Autofix, you see a results panel with upgraded packages (with links), packages left unchanged and why, and quick access to `packages.yml` to help assess Fusion readiness and next steps.

### Enhancements

- **dbt platform**
  - **Code Quality tab improvements**
    - Clearer lint/format actions (SQLFluff, Prettier), better empty states, visible Config button when applicable, and simplified logs retrieval.
    - Applies to SQL, JSON, YAML, and Markdown workflows.  
  - **Editor experience**
    - Upgraded editor for stability.
    - Improved container sizing/overflow.
    - "Save" overlay only appears when tabs are open.
    - Minor action‑bar refinements.

### Fixes

- **dbt platform lineage and command pane stability**: Reliability improved by aligning with updated IDE and VS Code command APIs; eliminates intermittent skips.

### Behavior changes

- **dbt platform:** dbt Core “versionless” renamed to “latest” so it's consistent and clear across tenants.
