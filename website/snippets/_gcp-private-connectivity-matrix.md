## Матрица приватных подключений в GCP {#gcp-private-connectivity-matrix}

В следующих таблицах представлены варианты приватного подключения для развертываний <Constant name="dbt" /> в GCP ([мультиарендная архитектура](/docs/platform/about-platform/tenancy)).

**Условные обозначения:**
- ✅ = Доступно
- ❌ = Пока недоступно
- \* = <Term id="shared-endpoint">Общая конечная точка</Term> (все остальные — <Term id="dedicated-endpoint">выделенные</Term>)

_Архитектура аренды:_ MT (мультиарендная) — [подробнее об архитектуре аренды](/docs/platform/about-platform/tenancy).

:::note О следующих матричных таблицах
Эти таблицы показывают, можно ли установить приватное подключение к конкретным сервисам, с учетом основных факторов, таких как сетевой уровень и уровень базовой аутентификации. dbt проверила эти конфигурации с использованием распространенных схем развертывания и типичных сценариев использования. Однако отдельные конфигурации могут отличаться. Если вы столкнулись с проблемами или у вас есть вопросы о вашей среде, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support) за рекомендациями.

**Региональные особенности GCP:** Некоторые сервисы GCP, например BigQuery, могут иметь региональные ограничения для конечных точек Private Service Connect. Сведения о доступности в регионах для конкретных сервисов см. в [документации Google по Private Service Connect](https://cloud.google.com/vpc/docs/private-service-connect).
:::

---

### Подключение платформы dbt к управляемым сервисам (исходящий трафик) {#connecting-the-dbt-platform-to-managed-services-egress}

<Constant name="dbt" /> может устанавливать приватные подключения к управляемым платформам данных и облачным сервисам.

| Сервис | MT | Руководство по настройке |
|---------|-----|-------------|
| Snowflake | ✅ | [Открыть](/docs/platform/secure/private-connectivity/gcp/gcp-snowflake) |
| Google BigQuery | ✅* | [Открыть](/docs/platform/secure/private-connectivity/gcp/gcp-bigquery) |
| Teradata VantageCloud | ✅ | |

---

### Подключение платформы dbt к самостоятельно размещенным сервисам (исходящий трафик) {#connecting-the-dbt-platform-to-self-hosted-services-egress}

Для всех перечисленных ниже сервисов используется общее руководство по настройке Private Service Connect — конфигурация серверной части зависит от сервиса. Подключения к самостоятельно размещенным сервисам используют модель <Term id="customer-provisioned">предоставления ресурсов клиентом</Term> — вы выступаете в роли <Term id="service-producer">поставщика сервиса</Term>, а dbt — в роли <Term id="consumer">потребителя</Term>.

**Руководство по настройке:** [Настройка GCP Private Service Connect для самостоятельно размещенных сервисов](/docs/platform/secure/private-connectivity/gcp/gcp-self-hosted)

| Сервис | MT |
|---------|-----|
| GitHub Enterprise Server | ✅ |
| GitLab Self-Managed | ✅ |
| Bitbucket Data Center | ✅ |
| Azure DevOps Server | ✅ |
| Postgres | ✅ |
| Starburst / Trino | ✅ |
| Teradata (самостоятельное размещение) | ✅ |

Если у вас есть вопросы о поддержке вашей конкретной архитектуры, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support).
