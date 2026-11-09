## Матрица возможностей приватного подключения {#private-connectivity-feature-matrix}

В следующих таблицах представлены варианты подключения по частной сети для [мультитенантных (MT) и однотенантных (ST)](/docs/platform/about-platform/tenancy) развертываний <Constant name="dbt" />.

**Условные обозначения:**

_Доступность:_
- ✅ = Доступно
- ❌ = В настоящее время недоступно
- \- = Неприменимо

_Тип конечной точки:_
- \* = <Term id="shared-endpoint">Общая конечная точка</Term> (все остальные — <Term id="dedicated-endpoint">выделенные</Term>)

:::note О приведенных ниже таблицах совместимости
Эти таблицы показывают, можно ли установить подключение по частной сети к конкретным сервисам, с учетом основных факторов, таких как сеть и уровень базовой аутентификации. dbt проверил эти конфигурации с использованием распространенных схем развертывания и типичных сценариев использования. Однако отдельные конфигурации могут отличаться. Если у вас возникли проблемы или вопросы о вашей среде, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support) за рекомендациями.
:::

:::info Обновление терминологии
Для ясности в этих таблицах используется обновленная терминология:
- **Подключение к dbt Cloud** = ранее «Ingress»
- **Подключение dbt Cloud к управляемым сервисам** = ранее «Egress - DW»
- **Подключение dbt Cloud к самостоятельно размещенным сервисам** = ранее «Egress - VCS»
:::

---

### Подключение к dbt Cloud

Ваши сервисы могут подключаться к <Constant name="dbt" /> по частной сети. Эта возможность доступна только для однотенантных развертываний. Все подключения к dbt Cloud используют модель <Term id="dbt-provisioned">с предоставлением ресурсов со стороны dbt</Term>.

<table>
  <thead>
    <tr>
      <th>Тип подключения</th>
      <th>AWS ST</th>
      <th>Azure ST</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Доступ к <Constant name="dbt" /> по частной сети</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Двойной доступ (публичный + частный)</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
  </tbody>
</table>

---

### Подключение dbt Cloud к управляемым сервисам

<Constant name="dbt" /> может устанавливать подключения по частной сети к управляемым платформам данных и облачным сервисам.

<table>
  <thead>
    <tr>
      <th>Сервис</th>
      <th>AWS MT</th>
      <th>AWS ST</th>
      <th>Azure MT</th>
      <th>Azure ST</th>
      <th>GCP MT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Snowflake</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>&nbsp;&nbsp;Внутренняя область промежуточного хранения Snowflake (Internal Stage)</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Databricks</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Redshift</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Redshift Serverless</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Amazon Athena с AWS Glue*</td>
      <td>❌</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>AWS CodeCommit*</td>
      <td>❌</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Azure Database for PostgreSQL Flexible Server</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Azure Synapse</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Azure Fabric</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Google BigQuery*</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata VantageCloud</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

---

### Подключение dbt Cloud к самостоятельно размещенным сервисам

<Constant name="dbt" /> может устанавливать подключения по частной сети к вашим самостоятельно размещенным сервисам. Все подключения к самостоятельно размещенным сервисам используют модель <Term id="customer-provisioned">с предоставлением ресурсов со стороны клиента</Term>.

<table>
  <thead>
    <tr>
      <th>Сервис</th>
      <th>AWS MT</th>
      <th>AWS ST</th>
      <th>Azure MT</th>
      <th>Azure ST</th>
      <th>GCP MT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GitHub Enterprise Server</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>GitLab Self-Managed</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Bitbucket Data Center</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Azure DevOps Server</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Postgres</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Spark</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Starburst / Trino</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata (самостоятельное размещение)</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

Для сервисов, не указанных явно выше, также может быть возможно установить подключение по частной сети, используя тот же подход <Term id="customer-provisioned">с предоставлением ресурсов со стороны клиента</Term>. Подробные инструкции см. в руководстве по самостоятельно размещенным сервисам для вашей облачной платформы.

Если у вас есть вопросы о поддержке вашей конкретной архитектуры, [обратитесь в службу поддержки dbt](/community/resources/getting-help#dbt-support).
