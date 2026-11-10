---
title: "Адаптеры сообщества"
id: "community-adapters"
sidebar_label: "Community adapters"
description: "Адаптеры сообщества подключают dbt к платформам данных. Их поддерживают dbt Labs, партнёры и сообщество."
hide_table_of_contents: true
availability: all_users
---

<VersionBlock lastVersion="1.99">

:::note
Программа Trusted Adapter Program для v1 завершена. Все адаптеры, поддерживаемые dbt Labs, партнёрами и сообществом, перечислены на этой странице.
:::

</VersionBlock>

Адаптеры подключают dbt к платформам данных. Их поддерживают dbt Labs, партнёры и участники сообщества.

Мы приветствуем [участие в разработке существующих адаптеров](/docs/contribute-dbt-adapters#contribute-to-a-pre-existing-adapter). Многие адаптеры поддерживаются добровольцами, поэтому будьте доброжелательны и помогайте по мере возможности.

<VersionBlock lastVersion="1.99">

Чтобы создать адаптер v1, обратитесь к руководству [Создание, тестирование, документирование и продвижение адаптеров](/guides/adapter-creation).

</VersionBlock>

<VersionBlock firstVersion="2.0">

Чтобы внести свой вклад в разработку адаптера v2, обратитесь к руководству [Участие в разработке адаптера dbt v2](/guides/adapter-creation-v2?step=1).

</VersionBlock>

import CommunityAdapters from '/snippets/_community-adapters.md';

<CommunityAdapters />

<VersionBlock lastVersion="1.99">

### Дополнительные адаптеры

<SimpleTable>

| Платформа данных |  |  |
| --- | --- | --- |
| [Confluent Cloud](/docs/local/connect-data-platform/confluent-setup) | [CrateDB](/docs/local/connect-data-platform/cratedb-setup) | [Databend Cloud](/docs/local/connect-data-platform/databend-setup) |
| [DeltaStream](/docs/local/connect-data-platform/deltastream-setup) | [Doris & SelectDB](/docs/local/connect-data-platform/doris-setup) | [Extrica](/docs/local/connect-data-platform/extrica-setup) |
| [Firebird](/docs/local/connect-data-platform/firebird-setup) | [Hologres](/docs/local/connect-data-platform/hologres-setup) | [IBM watsonx.data - Spark](/docs/local/connect-data-platform/watsonx-spark-setup) |
| [Infer](/docs/local/connect-data-platform/infer-setup) | [iomete](/docs/local/connect-data-platform/iomete-setup) | [MaxCompute](/docs/local/connect-data-platform/maxcompute-setup) |
| [MindsDB](/docs/local/connect-data-platform/mindsdb-setup) | [MySQL](/docs/local/connect-data-platform/mysql-setup) | [Rockset](/docs/local/connect-data-platform/rockset-setup) |
| [Sail](/docs/local/connect-data-platform/sail-setup) | [SQL Server & Azure SQL](/docs/local/connect-data-platform/mssql-setup) | [SQLite](/docs/local/connect-data-platform/sqlite-setup) |
| [Starrocks](/docs/local/connect-data-platform/starrocks-setup) | [TiDB](/docs/local/connect-data-platform/tidb-setup) | [TimescaleDB](https://dbt-timescaledb.debruyn.dev/) |
| [Upsolver](/docs/local/connect-data-platform/upsolver-setup) | [Vertica](/docs/local/connect-data-platform/vertica-setup) | [Watsonx-Presto](/docs/local/connect-data-platform/watsonx-presto-setup) |
| [Yellowbrick](/docs/local/connect-data-platform/yellowbrick-setup) |

</SimpleTable>

</VersionBlock>
