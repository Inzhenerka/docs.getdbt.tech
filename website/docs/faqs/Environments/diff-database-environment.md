---
title: Can I set a different connection at the environment level?
description: "Separate projects for different environments workaround"
sidebar_label: 'Set different database connections at environment level'
id: diff-database-environment
---

dbt Cloud supports [Connections](/docs/cloud/connect-data-platform/about-connections#connection-management), available to all dbt Cloud users. Connections allows different data platform connections per environment, eliminating the need to duplicate projects. Projects can only use multiple connections of the same warehouse type. Connections are reusable across projects and environments.

