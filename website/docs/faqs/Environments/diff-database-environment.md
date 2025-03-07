---
title: Can I set a different connection at the environment level?
description: "Separate projects for different environments workaround"
sidebar_label: 'Set different database connections at environment level'
id: diff-database-environment
---

dbt Cloud supports [Connections](/docs/cloud/connect-data-platform/about-connections#connection-management), available to all dbt Cloud users. Connections allows different data platform connections per environment, eliminating the need to duplicate projects. Projects can only use multiple connections of the same warehouse type. Connections are reusable across projects and environments.

Although you're unable to set a different connection at the environment level, there is a workaround where you can have separate projects for their different environments and link them to different hostnames, while still connecting to the same repo.
