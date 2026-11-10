## Матрица приватных подключений в AWS {#aws-private-connectivity-matrix}

В следующих таблицах представлены варианты приватного подключения для развертываний <Constant name="dbt" /> в AWS ([мультитенантных и однотенантных](/docs/platform/about-platform/tenancy)).

**Условные обозначения:**
- ✅ = Доступно
- ❌ = В настоящее время недоступно

_Модель тенантности:_ MT (мультитенантная) и ST (однотенантная) — [подробнее о тенантности](/docs/platform/about-platform/tenancy).

:::note О приведенных ниже таблицах
В этих таблицах указано, можно ли установить приватное подключение к определенным сервисам с учетом основных факторов, таких как сетевой уровень и уровень базовой аутентификации. dbt проверила эти конфигурации с использованием распространенных схем развертывания и типичных сценариев использования. Однако отдельные конфигурации могут отличаться. Если у вас возникли проблемы или вопросы о вашей среде, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support) за рекомендациями.
:::

---

### Подключение к платформе dbt (входящий трафик) <Lifecycle status="beta"/> {#connecting-to-the-dbt-platform-ingress}

Ваши сервисы могут подключаться к <Constant name="dbt" /> по приватному соединению, используя модель <Term id="dbt-provisioned">с настройкой на стороне dbt</Term>. В этом случае dbt выступает в роли <Term id="service-producer">поставщика сервиса</Term>, а вы — в роли <Term id="consumer">потребителя</Term>.

| Тип подключения | MT | ST | Руководство по настройке |
|-------------------|-----|-----|-------------|
| Приватный доступ к <Constant name="dbt" /> | ❌ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-ingress) |
| Двойной доступ (публичный + приватный) | ❌ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-ingress) |

---

### Подключение платформы dbt к управляемым сервисам (исходящий трафик) {#connecting-the-dbt-platform-to-managed-services-egress}

<Constant name="dbt" /> может устанавливать приватные подключения к управляемым платформам данных и облачным сервисам.

| Сервис | MT | ST | Руководство по настройке |
|---------|-----|-----|-------------|
| Snowflake | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-snowflake) |
| &nbsp;&nbsp;Snowflake Internal Stage | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-snowflake) |
| Databricks | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-databricks) |
| Redshift | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-redshift) |
| Redshift Serverless | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-redshift) |
| Amazon Athena с AWS Glue | ❌ | ✅ | |
| AWS CodeCommit | ❌ | ✅ | |
| Teradata VantageCloud | ✅ | ✅ | [Открыть](/docs/platform/secure/private-connectivity/aws/aws-teradata) |

---

### Подключение платформы dbt к самостоятельно размещенным сервисам (исходящий трафик) {#connecting-the-dbt-platform-to-self-hosted-services-egress}

Для всех перечисленных ниже сервисов используется общее руководство по настройке PrivateLink — конфигурация серверной части зависит от сервиса. Подключения к самостоятельно размещенным сервисам используют модель <Term id="customer-provisioned">с настройкой на стороне клиента</Term>: вы выступаете в роли <Term id="service-producer">поставщика сервиса</Term>, а dbt — в роли <Term id="consumer">потребителя</Term>.

**Руководство по настройке:** [Настройка AWS PrivateLink для самостоятельно размещенных сервисов](/docs/platform/secure/private-connectivity/aws/aws-self-hosted)

| Сервис | MT | ST |
|---------|-----|-----|
| GitHub Enterprise Server | ✅ | ✅ |
| GitLab Self-Managed | ✅ | ✅ |
| Bitbucket Data Center | ✅ | ✅ |
| Azure DevOps Server | ✅ | ✅ |
| Postgres | ✅ | ✅ |
| Spark | ✅ | ✅ |
| Starburst / Trino | ✅ | ✅ |
| Teradata (самостоятельное размещение) | ✅ | ✅ |

Если у вас есть вопросы о поддержке вашей конкретной архитектуры, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support).
