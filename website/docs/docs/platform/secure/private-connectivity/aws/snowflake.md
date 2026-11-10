---
title: "Настройка Snowflake и AWS PrivateLink"
id: aws-snowflake
description: "Настройка AWS PrivateLink для Snowflake."
sidebar_label: "Snowflake"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка Snowflake PrivateLink

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Следующие шаги помогут настроить размещенную в AWS конечную точку Snowflake PrivateLink в мультитенантной среде <Constant name="dbt" />.

<CloudProviders type='Snowflake' />

import SnowflakeOauthWithPL from '/snippets/_snowflake-oauth-with-pl.md'; 

<SnowflakeOauthWithPL />

## Настройка AWS PrivateLink

В этом разделе описана настройка размещенной в AWS конечной точки Snowflake PrivateLink в <Constant name="dbt_platform" />. Настройку можно выполнить двумя способами:
- [Самостоятельная настройка частных конечных точек](#self-serve-private-endpoints): самостоятельная настройка конечных точек Snowflake PrivateLink непосредственно в пользовательском интерфейсе <Constant name="dbt_platform" />. В настоящее время доступна в бета-версии. 
- [Настройка с помощью службы поддержки](#support-led-setup): для настройки конечных точек Snowflake PrivateLink необходимо обратиться в службу поддержки dbt. Этот способ не предусматривает самостоятельную настройку конечных точек Snowflake PrivateLink. 

### Самостоятельная настройка частных конечных точек <Lifecycle status="beta" /> {#self-serve-private-endpoints}

_Самостоятельная настройка частных конечных точек для Snowflake в AWS в настоящее время находится в стадии бета-тестирования и доступна всем клиентам, соответствующим требованиям. Эта функция недоступна для Azure и GCP. Если в настройках вашей учетной записи нет раздела **Private endpoints**, воспользуйтесь [настройкой с помощью службы поддержки](#support-led-setup)._

В этом разделе описан процесс запроса новой конечной точки Snowflake PrivateLink в <Constant name="dbt_platform" />. 

##### Предварительные требования

- Набор разрешений [Account admin](/docs/platform/manage-access/enterprise-permissions?version=2.0#account-admin) или [Project creator](/docs/platform/manage-access/enterprise-permissions?version=2.0#project-creator) в <Constant name="dbt_platform"/>. Пользователи с лицензией IT также могут создавать частные конечные точки.
- [Разрешения `ACCOUNTADMIN` в Snowflake](https://docs.snowflake.com/en/user-guide/security-access-control-overview#system-defined-roles).

##### Перед началом работы

Прежде чем запрашивать частную конечную точку, добавьте учетную запись AWS компании <Constant name="dbt" /> Labs в список разрешенных в Snowflake. Это однократная настройка для каждой учетной записи Snowflake, которая выполняется через обращение в службу поддержки Snowflake и может занять некоторое время &mdash; завершите ее до начала процедуры запроса.

1. Создайте обращение в службу поддержки Snowflake, чтобы разрешить доступ из учетной записи AWS <Constant name="dbt" />.
   - Snowflake предпочитает, чтобы владелец учетной записи создавал обращение самостоятельно, а не через dbt Labs. Дополнительные сведения см. в [статье базы знаний Snowflake](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
   - Укажите идентификатор вашей учетной записи <Constant name="dbt" />, а также другую информацию, запрашиваемую в статье.
     - **Идентификатор учетной записи AWS**: `346425330055` &mdash; _Примечание: этот идентификатор учетной записи применим только к мультитенантным средам <Constant name="dbt" /> в AWS. Чтобы получить идентификаторы учетных записей AWS Virtual Private/Single-Tenant, обратитесь в [службу поддержки dbt](mailto:support@getdbt.com)._
2. Прежде чем продолжить, дождитесь подтверждения от Snowflake о предоставлении доступа.

   <Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink1.png" title="Создание обращения в службу поддержки Snowflake"/>

#### Запрос новой частной конечной точки

После того как Snowflake подтвердит добавление учетной записи AWS компании <Constant name="dbt" /> Labs в список разрешенных в Snowflake, вы сможете запросить новую частную конечную точку. Для этого выполните следующие действия:

1. В <Constant name="dbt_platform" /> перейдите в **Account settings → Private endpoints**.
2. В таблице **Private endpoints** просмотрите существующие конечные точки. В таблице представлены все частные конечные точки вашей учетной записи (в том числе не относящиеся к Snowflake) со следующими сведениями:
   - **Name** — имя
   - **Connection type** — тип подключения (например, Snowflake)
   - **URL**
   - **Connectivity status** — состояние подключения (например, **Success** или **Unknown**)
   - **Connections** — количество подключений <Constant name="dbt_platform" />, использующих конечную точку

   Можно выполнять поиск по **Name** или **URL**. В таблице перечислены все частные конечные точки вашей учетной записи, но самостоятельное создание, редактирование и удаление в настоящее время доступны только для Snowflake в AWS.

    <Lightbox src="/img/docs/dbt-platform/private-endpoint-page.png" title="Таблица частных конечных точек с существующими конечными точками, состоянием подключения и кнопкой Request new"/>

3. Чтобы запросить новую конечную точку, нажмите **Request new**.
4. В разделе **Provider type** убедитесь, что выбран **Snowflake**. В настоящее время другие поставщики конечных точек не поддерживаются. Если вам нужно подключиться к другому сервису, обратитесь в [службу поддержки dbt](mailto:support@getdbt.com).
5. Скопируйте SQL-команду из раздела **SQL command snippet**.
6. Перейдите в Snowflake и выполните SQL-команду, скопированную из <Constant name="dbt_platform" />: `SELECT SYSTEM$GET_PRIVATELINK_CONFIG();`
7. Скопируйте результат из Snowflake и вернитесь в <Constant name="dbt_platform" />, чтобы вставить его в поле **Snowflake output**. Если результат корректен, под текстовым полем появится сообщение наподобие **Output looks good**. Если возникнет ошибка, ознакомьтесь с сообщением и внесите необходимые исправления.
8. Нажмите **Submit request**.

    <Lightbox src="/img/docs/dbt-platform/private-endpoint-config.png" title="Форма запроса конечной точки с полями Provider type, SQL command snippet и Snowflake output"/>

9. После отправки появится всплывающее окно с подтверждением (например, **Endpoint request submitted**). В этом окне можно запросить еще одну конечную точку или вернуться в **Private endpoints**, чтобы отслеживать статус запроса.
10. Перейдите на страницу **Connections** и выполните действия из раздела [Создание подключения в dbt](#create-connection-in-dbt), чтобы настроить PrivateLink. 
После настройки PrivateLink на странице **Connections** новая конечная точка появится в разделе **Private endpoints → Associated connections**.

:::note Распространение изменений DNS
Если проверка подключения завершается ошибкой сразу после настройки, это ожидаемо и не означает, что что-то настроено неправильно. Распространение изменений DNS может занять несколько минут. Подождите несколько минут и повторите проверку, прежде чем обращаться в службу поддержки.
:::

<Expandable alt_header="Редактирование или удаление частной конечной точки" is_open={true}>

Если вы не видите **Edit** или **Delete endpoint**, обратитесь к менеджеру вашей учетной записи, чтобы включить возможность изменения частных конечных точек для вашей учетной записи.

**Редактирование конечной точки**

1. В таблице **Private endpoints** нажмите на конечную точку, которую хотите изменить.
2. На странице сведений о конечной точке нажмите **Edit**.
3. При необходимости измените **Name** и/или **Port**.
4. Нажмите **Save changes**.
5. В модальном окне **Save changes?** нажмите **Save changes**, чтобы применить изменения.

<Lightbox src="/img/docs/dbt-platform/private-endpoint-details-edit.png" title="Страница сведений о частной конечной точке с кнопкой Edit" />

**Удаление конечной точки**

Конечную точку со связанными подключениями удалить нельзя. Сначала удалите эти подключения.

1. В таблице **Private endpoints** нажмите на конечную точку, которую хотите удалить.
2. На странице сведений о конечной точке нажмите **Edit**.
3. Прокрутите страницу вниз и нажмите **Delete endpoint**.
4. В модальном окне **Delete endpoint** введите `DELETE` для подтверждения, затем нажмите **Delete endpoint**.

<Lightbox src="/img/docs/dbt-platform/private-endpoint-details-delete.png" title="Страница сведений о частной конечной точке в режиме редактирования с кнопкой Delete endpoint" />

</Expandable>

#### Повторные запросы конечных точек

Если вы отправите запрос с идентификатором VPCE, совпадающим с идентификатором существующей конечной точки, <Constant name="dbt_platform"/> отобразит всплывающее окно **Endpoint already exists** с двумя вариантами:

- **Reuse existing interface endpoint** (по умолчанию, рекомендуется) — связывает новую частную конечную точку с уже одобренной интерфейсной конечной точкой. Используйте этот вариант, если ваша VPCE уже одобрена, чтобы избежать дублирования инфраструктуры.
- **Create new interface endpoint** — создает новую интерфейсную конечную точку с собственной сетевой политикой. Используйте этот вариант, только если вам нужна отдельная конфигурация сетевой политики.

Выберите нужный вариант и нажмите **Confirm & Submit**.

  <Lightbox src="/img/docs/dbt-platform/endpoint-exists.png" width="70%" title="Всплывающее окно Endpoint already exists с вариантами создания новой интерфейсной конечной точки или повторного использования существующей"/>

#### Устранение неполадок и ошибки

Если запрос конечной точки завершается ошибкой, <Constant name="dbt_platform"/> отображает сведения об ошибке, которыми можно безопасно делиться за пределами организации.

Если вы видите статус ошибки без четких указаний о дальнейших действиях, соберите сведения о запросе (имя конечной точки, время создания, статус и предоставленный вами результат Snowflake) и обратитесь в [службу поддержки dbt](mailto:support@getdbt.com).

### Настройка с помощью службы поддержки {#support-led-setup}

Если раздел **Private endpoints** недоступен в настройках вашей учетной записи, настройте Snowflake PrivateLink, выполнив следующие действия и отправив запрос в службу поддержки dbt.

Чтобы настроить [PrivateLink](https://aws.amazon.com/privatelink) для экземпляров Snowflake, размещенных в AWS:

1. Создайте обращение в службу поддержки Snowflake, чтобы разрешить доступ из учетной записи AWS <Constant name="dbt" />.
   - Snowflake предпочитает, чтобы владелец учетной записи создавал обращение самостоятельно, а не через dbt Labs. Дополнительные сведения см. в [статье базы знаний Snowflake](https://community.snowflake.com/s/article/HowtosetupPrivatelinktoSnowflakefromCloudServiceVendors).
   - Укажите идентификатор вашей учетной записи <Constant name="dbt" />, а также другую информацию, запрашиваемую в статье.
     - **Идентификатор учетной записи AWS**: `346425330055` &mdash; _Примечание: этот идентификатор учетной записи применим только к мультитенантным средам <Constant name="dbt" /> в AWS. Чтобы получить идентификаторы учетных записей AWS Virtual Private/Single-Tenant, обратитесь в [службу поддержки dbt](mailto:support@getdbt.com)._
   - Вам необходимы [разрешения `ACCOUNTADMIN` в Snowflake](https://docs.snowflake.com/en/user-guide/security-access-control-overview#system-defined-roles).

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink1.png" title="Создание обращения в службу поддержки Snowflake"/>

2. После того как Snowflake предоставит запрошенный доступ, выполните системную функцию Snowflake [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) и скопируйте результат.

3. Добавьте необходимую информацию в следующий шаблон и отправьте запрос в [службу поддержки dbt](mailto:support@getdbt.com):

<Expandable alt_header="Шаблон письма для обращения в службу поддержки" is_open={true}>

```text
Subject: New Multi-Tenant (Azure or AWS) PrivateLink Request

- Type: Snowflake
- dbt platform account URL:
- SYSTEM$GET_PRIVATELINK_CONFIG output:
- *Use privatelink-account-url or regionless-privatelink-account-url?:
- **Create Internal Stage PrivateLink endpoint? (Y/N):
- dbt AWS multi-tenant environment (US, EMEA, AU, JP):
```

</Expandable>
_*По умолчанию <Constant name="dbt" /> будет настроен на использование `privatelink-account-url` из предоставленного результата [SYSTEM$GET_PRIVATELINK_CONFIG](https://docs.snowflake.com/en/sql-reference/functions/system_get_privatelink_config.html) в качестве конечной точки PrivateLink. По запросу вместо него можно использовать `regionless-privatelink-account-url`._

_** Для использования этой функции необходимо [включить Internal Stage PrivateLink в учетной записи Snowflake](https://docs.snowflake.com/en/user-guide/private-internal-stages-aws#prerequisites)_


import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Создание подключения в dbt {#create-connection-in-dbt}

После того как служба поддержки <Constant name="dbt" /> завершит настройку, вы сможете создавать новые подключения с использованием PrivateLink. 

<PrivateLinkCreateConnection platform="Snowflake" />

## Настройка PrivateLink для внутренней области хранения в <Constant name="dbt" />

Если конечная точка Internal Stage PrivateLink уже создана, необходимо настроить среды dbt на использование этой конечной точки вместо конечной точки по умолчанию, заданной для учетной записи в Snowflake.

1. Получите DNS-имя конечной точки Internal Stage PrivateLink в службе поддержки dbt. Например, `*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com`.
2. В соответствующем проекте dbt перейдите в **Orchestration** → **Environments**.
3. Откройте среду, которая должна использовать конечную точку dbt Internal Stage PrivateLink, и задайте **Extended attributes**. Шаги настройки различаются для сред развертывания и разработки; см. раздел [Расширенные атрибуты](/docs/dbt-platform-environments#extended-attributes). Используйте значение, аналогичное следующему:
```
s3_stage_vpce_dns_name: '*.vpce-012345678abcdefgh-4321dcba.s3.us-west-2.vpce.amazonaws.com'
```
4. Сохраните изменения.

<Lightbox src="/img/docs/dbt-platform/snowflake-internal-stage-dns.png" title="DNS-имя внутренней области хранения"/>

## Настройка сетевых политик {#configuring-network-policies}
Если ваша организация использует [сетевые политики Snowflake](https://docs.snowflake.com/en/user-guide/network-policies) для ограничения доступа к учетной записи Snowflake, необходимо добавить сетевое правило для <Constant name="dbt" />. Snowflake поддерживает два типа сетевых правил: на основе идентификатора VPCE (рекомендуется) и на основе IP/CIDR. В следующих шагах используется идентификатор VPCE. Если вашей организации требуется сетевая политика на основе IP-адресов, диапазон CIDR недоступен в интерфейсе <Constant name="dbt_platform" />. Чтобы получить его, обратитесь в [службу поддержки dbt](mailto:support@getdbt.com).

Для создания сетевой политики в Snowflake вам потребуется идентификатор VPCE:
1. В <Constant name="dbt_platform" /> перейдите в **Account settings → Private endpoints** 
2. Нажмите на конечную точку в таблице, затем найдите поле **Endpoint identifier** на странице сведений о конечной точке. 
3. Если вы настроили PrivateLink [с помощью службы поддержки](#support-led-setup) или раздел **Private endpoints** недоступен в настройках вашей учетной записи, обратитесь в [службу поддержки <Constant name="dbt" />](mailto:support@getdbt.com), чтобы получить идентификатор VPCE. 
4. Если вы создаете конечную точку для Internal Stage, ее идентификатор VPCE отличается от идентификатора VPCE основной конечной точки сервиса.

:::note Сетевая политика для Snowflake Internal Stage PrivateLink
Рекомендации по защите как сервиса Snowflake, так и внутренней области хранения см. в документации Snowflake по [сетевым политикам](https://docs.snowflake.com/en/user-guide/network-policies#strategies-for-protecting-both-service-and-internal-stage) и [сетевым правилам](https://docs.snowflake.com/en/user-guide/network-rules#incoming-requests). 

:::

### Использование пользовательского интерфейса

Откройте интерфейс Snowflake и выполните следующие действия:
1. Перейдите на вкладку **Security**.
2. Нажмите **Network Rules**.
3. Нажмите **Add Rule**.
4. Задайте имя правила.
5. Выберите базу данных и схему, в которых будет храниться правило. Этот выбор служит для настройки разрешений и организации объектов; на само правило он не влияет.
6. Установите тип `AWS VPCE ID` и режим `Ingress`.
7. Введите в поле идентификатора идентификатор VPCE со страницы сведений о конечной точке в <Constant name="dbt_platform" /> (или полученный от службы поддержки <Constant name="dbt" />, если вы использовали настройку с помощью службы поддержки).
8. Нажмите **Create Network Rule**.

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink2.png" title="Создание сетевого правила"/>

9. На вкладке **Network Policy** отредактируйте политику, в которую хотите добавить правило. Это может быть политика уровня учетной записи или политика для конкретных пользователей, подключающихся из <Constant name="dbt" />.

10. Добавьте новое правило в список разрешенных и нажмите **Update Network Policy**.

<Lightbox src="/img/docs/dbt-platform/snowflakeprivatelink3.png" title="Обновление сетевой политики"/>

### Использование SQL

Для быстрой и автоматизированной настройки сетевых правил с помощью SQL в Snowflake используйте следующие команды, которые позволяют создавать и настраивать правила доступа для <Constant name="dbt" />. Эти примеры SQL показывают, как добавить сетевое правило и соответствующим образом обновить сетевую политику.

1. Создайте новое сетевое правило с помощью следующего SQL:
```sql

CREATE NETWORK RULE allow_dbt_cloud_access
  MODE = INGRESS
  TYPE = AWSVPCEID
  VALUE_LIST = ('<VPCE_ID>'); -- Замените '<VPCE_ID>' фактическим значением идентификатора VPCE

```

2. Добавьте правило в сетевую политику с помощью следующего SQL:
```sql

ALTER NETWORK POLICY <network_policy_name>
  ADD ALLOWED_NETWORK_RULE_LIST =('allow_dbt_cloud_access');

```
