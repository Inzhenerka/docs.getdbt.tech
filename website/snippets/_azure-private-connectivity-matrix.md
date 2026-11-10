## Матрица частных подключений в Azure {#azure-private-connectivity-matrix}

В следующих таблицах представлены варианты частного подключения для развертываний <Constant name="dbt" /> в Azure ([мультитенантных и однотенантных](/docs/platform/about-platform/tenancy)).

**Условные обозначения:**
- ✅ = Доступно
- ❌ = В настоящее время недоступно

_Модель тенантности:_ MT (мультитенантная) и ST (однотенантная) — [подробнее о моделях тенантности](/docs/platform/about-platform/tenancy).

:::note О приведенных ниже таблицах
Эти таблицы показывают, можно ли установить частное подключение к определенным сервисам, с учетом основных факторов, таких как сетевой уровень и базовые механизмы аутентификации. dbt проверила эти конфигурации на распространенных схемах развертывания и типичных сценариях использования. Однако конкретные конфигурации могут отличаться. Если вы столкнетесь с проблемами или у вас возникнут вопросы о вашей среде, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support) за рекомендациями.
:::

---

### Подключение к платформе dbt (входящий трафик) {#connecting-to-the-dbt-platform-ingress}

Ваши сервисы могут подключаться к <Constant name="dbt" /> по частному соединению с использованием модели <Term id="dbt-provisioned">подготовки ресурсов на стороне dbt</Term>. В этом случае dbt выступает в роли <Term id="service-producer">поставщика сервиса</Term>, а вы — в роли <Term id="consumer">потребителя</Term>.

| Тип подключения | MT | ST |
|-------------------|-----|-----|
| Частный доступ к <Constant name="dbt" /> | ❌ | ✅ |
| Двойной доступ (публичный + частный) | ❌ | ✅ |

---

### Подключение платформы dbt к управляемым сервисам (исходящий трафик) {#connecting-the-dbt-platform-to-managed-services-egress}

<Constant name="dbt" /> может устанавливать частные подключения к управляемым платформам данных и облачным сервисам.

| Сервис | MT | ST | Руководство по настройке |
|---------|-----|-----|-------------|
| Snowflake | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/azure/azure-snowflake) |
| &nbsp;&nbsp;Внутренняя область промежуточного хранения Snowflake (Internal Stage) | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/azure/azure-snowflake) |
| Databricks | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/azure/azure-databricks) |
| Azure Database for PostgreSQL Flexible Server | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/azure/azure-postgres) |
| Azure Synapse | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/azure/azure-synapse) |
| Azure Fabric  <Lifecycle status="beta"/> | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/azure/azure-fabric) |
| Teradata VantageCloud | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/azure/azure-teradata) |

---

### Подключение платформы dbt к самостоятельно размещенным сервисам (исходящий трафик) {#connecting-the-dbt-platform-to-self-hosted-services-egress}

Для всех перечисленных ниже сервисов используется общее руководство по настройке Private Link — конфигурация серверной части зависит от сервиса. Подключения к самостоятельно размещенным сервисам используют модель <Term id="customer-provisioned">подготовки ресурсов на стороне клиента</Term>: вы выступаете в роли <Term id="service-producer">поставщика сервиса</Term>, а dbt — в роли <Term id="consumer">потребителя</Term>.

**Руководство по настройке:** [Настройка Azure Private Link для самостоятельно размещенных сервисов](/docs/platform/secure/private-connectivity/azure/azure-self-hosted)

| Сервис | MT | ST |
|---------|-----|-----|
| GitHub Enterprise Server | ✅ | ✅ |
| GitLab Self-Managed | ✅ | ✅ |
| Bitbucket Data Center | ✅ | ✅ |
| Azure DevOps Server | ✅ | ✅ |
| Postgres | ✅ | ✅ |
| Starburst / Trino | ✅ | ✅ |
| Teradata (самостоятельное размещение) | ✅ | ✅ |

Если у вас есть вопросы о поддержке вашей конкретной архитектуры, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support).
