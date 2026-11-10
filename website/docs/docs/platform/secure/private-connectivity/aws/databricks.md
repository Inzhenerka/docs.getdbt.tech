---
title: "Настройка Databricks и AWS PrivateLink"
id: aws-databricks
description: "Настройка AWS PrivateLink для Databricks."
sidebar_label: "Databricks"
pagination_next: null
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка Databricks PrivateLink

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Следующие шаги помогут вам настроить конечную точку Databricks AWS PrivateLink в многопользовательской среде <Constant name="dbt" />.

<CloudProviders type='Databricks'/>

## Настройка AWS PrivateLink

Настроить конечную точку Databricks AWS PrivateLink можно двумя способами:

- [Самостоятельная настройка частных конечных точек](#self-serve-private-endpoints): создавайте конечные точки Databricks PrivateLink и управляйте ими непосредственно в пользовательском интерфейсе <Constant name="dbt_platform" />. В настоящее время функция находится на стадии бета-тестирования.
- [Настройка с помощью службы поддержки](#support-led-setup): обратитесь в службу поддержки dbt для настройки конечной точки Databricks PrivateLink.

### Самостоятельная настройка частных конечных точек <Lifecycle status="beta" /> {#self-serve-private-endpoints}

_Самостоятельная настройка частных конечных точек для Databricks в AWS в настоящее время находится на стадии бета-тестирования и доступна всем клиентам, соответствующим условиям доступа. Эта функция недоступна для Azure и GCP. Если в настройках вашего аккаунта нет раздела **Private endpoints**, воспользуйтесь [настройкой с помощью службы поддержки](#support-led-setup)._

При самостоятельной настройке вы запрашиваете конечную точку Databricks PrivateLink в <Constant name="dbt_platform" /> без обращения в службу поддержки. Если запрос завершится ошибкой, вы можете удалить конечную точку в <Constant name="dbt_platform" /> и самостоятельно повторить попытку.

#### Предварительные требования

- Набор разрешений [Account admin](/docs/platform/manage-access/enterprise-permissions?version=2.0#account-admin) или [Project creator](/docs/platform/manage-access/enterprise-permissions?version=2.0#project-creator) в <Constant name="dbt_platform"/>. Пользователи с лицензией IT также могут создавать частные конечные точки.
- Имя вашего рабочего пространства Databricks и регион AWS, в котором оно размещено.

#### Запрос новой частной конечной точки

1. В <Constant name="dbt_platform" /> перейдите в **Account settings → Private endpoints**.
2. В таблице **Private endpoints** просмотрите существующие конечные точки. В таблице отображаются все частные конечные точки вашего аккаунта (включая конечные точки, не относящиеся к Databricks) со следующими сведениями:
   - **Name** — имя
   - **Connection type** — тип подключения (например, Databricks)
   - **URL** — URL-адрес
   - **Connectivity status** — состояние подключения (например, **Success** или **Unknown**)
   - **Connections** — количество подключений <Constant name="dbt_platform" />, использующих эту конечную точку

   Вы можете выполнять поиск по **Name** или **URL**.

   <Lightbox src="/img/docs/dbt-platform/private-endpoint-page.png" title="Таблица частных конечных точек с существующими конечными точками, состоянием подключения и кнопкой Request new"/>

3. Чтобы запросить новую конечную точку, нажмите **Request new**.
4. В разделе **Provider type** выберите **Databricks**.
5. В разделе **Step 1: Enter your workspace name** вставьте полный URL рабочего пространства (например, `my-workspace.cloud.databricks.com`) или только его имя (например, `my-workspace`).
6. В разделе **Step 2: Select your AWS region** выберите регион AWS, в котором размещено ваше рабочее пространство Databricks. В списке представлены только регионы, поддерживающие частные подключения Databricks.
7. Нажмите **Submit request**.

   <Lightbox src="/img/docs/dbt-platform/databricks-private-endpoint-request.png" title="Форма запроса конечной точки Databricks с полями типа поставщика, имени рабочего пространства и региона AWS"/>

   :::warning Имя рабочего пространства и регион нельзя изменить
   Имя рабочего пространства и регион AWS фиксируются при создании конечной точки. Это означает, что впоследствии их нельзя изменить. Если любое из этих значений указано неверно, создание ресурсов завершится ошибкой. Чтобы исправить это, удалите неудавшийся запрос и создайте новый с правильными данными. Обращаться в службу поддержки не требуется.
   :::

8. После отправки появится всплывающее окно подтверждения. В нем можно запросить еще одну конечную точку или вернуться в **Private endpoints**, чтобы отслеживать состояние запроса.
9. Перейдите на страницу **Connections** и выполните действия из раздела [Создание подключения в dbt](#create-connection-in-dbt), чтобы настроить PrivateLink. После настройки PrivateLink на странице **Connections** новая конечная точка появится в разделе **Private endpoints → Associated connections**.

:::note Распространение изменений DNS
Если проверка подключения завершается ошибкой сразу после настройки, это ожидаемо &mdash; это не означает, что что-то настроено неправильно. Распространение изменений DNS может занять несколько минут. Подождите несколько минут и повторите проверку, прежде чем обращаться в службу поддержки.
:::

#### Повторное использование существующей конечной точки

Databricks предоставляет один предопределенный сервис конечных точек на каждый регион AWS. Если вы отправляете запрос для региона, в котором уже есть интерфейсная конечная точка, <Constant name="dbt_platform"/> отображает всплывающее окно **Endpoint already exists** с двумя вариантами:

- **Re-use an existing interface endpoint** (рекомендуется) — создает только новую частную конечную точку, связанную с выбранной вами интерфейсной конечной точкой. В большинстве случаев это предпочтительный вариант, поскольку Databricks использует один общий сервис конечных точек на регион, а повторное использование позволяет избежать дублирования инфраструктуры.
- **Create a new interface endpoint** — создает новую интерфейсную конечную точку вместе с новой частной конечной точкой. Используйте этот вариант, только если вам нужна отдельная интерфейсная конечная точка.

Выберите подходящий вариант и нажмите **Confirm & Submit**.

  <Lightbox src="/img/docs/dbt-platform/endpoint-exists.png" width="70%" title="Всплывающее окно Endpoint already exists с вариантами создания новой интерфейсной конечной точки или повторного использования существующей"/>

#### Изменение или удаление частной конечной точки

<Expandable alt_header="Изменение или удаление частной конечной точки" anchor_id="modify-or-remove-private-endpoint-details" is_open={true}>

Если вы не видите **Edit** или **Delete endpoint**, обратитесь к менеджеру вашего аккаунта, чтобы включить возможность изменения частных конечных точек для вашего аккаунта.

**Изменение конечной точки**

Вы можете изменить **Name** и **Port** конечной точки. Имя рабочего пространства и регион AWS нельзя изменить после создания.

1. В таблице **Private endpoints** нажмите на конечную точку, которую хотите изменить.
2. На странице сведений о конечной точке нажмите **Edit**.
3. При необходимости измените **Name** и/или **Port**.
4. Нажмите **Save changes**.
5. В модальном окне **Save changes?** нажмите **Save changes**, чтобы применить изменения.

**Удаление конечной точки**

Конечную точку со связанными подключениями удалить нельзя. Сначала удалите эти подключения.

1. В таблице **Private endpoints** нажмите на конечную точку, которую хотите удалить.
2. На странице сведений о конечной точке нажмите **Edit**.
3. Прокрутите страницу вниз и нажмите **Delete endpoint**.
4. В модальном окне **Delete endpoint** введите `DELETE` для подтверждения, затем нажмите **Delete endpoint**.

</Expandable>

#### Устранение неполадок и ошибки

Если запрос конечной точки завершается ошибкой, <Constant name="dbt_platform"/> отображает сведения об ошибке, которыми можно безопасно делиться за пределами организации. Поскольку имя рабочего пространства и регион нельзя изменить после создания, неудавшийся запрос обычно означает, что одно из этих значений указано неверно &mdash; удалите запрос и отправьте новый с правильными данными.

Если вы видите состояние ошибки без четких указаний по дальнейшим действиям, соберите сведения о запросе (имя конечной точки, время создания и состояние) и обратитесь в [службу поддержки dbt](mailto:support@getdbt.com).

### Настройка с помощью службы поддержки {#support-led-setup}

Если раздел **Private endpoints** недоступен в настройках вашего аккаунта, настройте Databricks PrivateLink, выполнив следующие действия и отправив запрос в службу поддержки dbt.

1. Найдите [имя вашего экземпляра Databricks](https://docs.databricks.com/en/workspace/workspace-details.html#workspace-instance-names-urls-and-ids).
   - Пример: `cust-success.cloud.databricks.com`

2. Добавьте необходимые сведения в следующий шаблон и отправьте запрос на AWS PrivateLink в [службу поддержки dbt](mailto:support@getdbt.com):

   <Expandable alt_header="Шаблон письма для обращения в службу поддержки" is_open={true}>

   ```text
   Subject: New AWS Multi-Tenant PrivateLink Request

   - Type: Databricks
   - dbt platform account URL:
   - Databricks instance name:
   - Databricks cluster AWS Region (for example, us-east-1, eu-west-2):
   - dbt AWS multi-tenant environment (US, EMEA, AU, JP):
   ```

   </Expandable>
    <PrivateLinkSLA />

3. После того как служба поддержки <Constant name="dbt" /> сообщит о завершении настройки, [зарегистрируйте конечную точку VPC в Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) и привяжите ее к рабочему пространству:
    - [Зарегистрируйте конечную точку VPC](https://docs.databricks.com/en/security/network/classic/vpc-endpoints.html) &mdash; зарегистрируйте конечную точку VPC, используя идентификатор конечной точки VPC, предоставленный службой поддержки dbt.
    - [Создайте объект Private Access Settings](https://docs.databricks.com/en/security/network/classic/private-access-settings.html) &mdash; создайте объект Private Access Settings (PAS) с нужными настройками публичного доступа и задайте для Private Access Level значение **Endpoint**. Выберите зарегистрированную конечную точку, созданную на предыдущем шаге.
    - [Создайте или обновите рабочее пространство](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both) &mdash; создайте рабочее пространство или обновите существующее. В разделе **Advanced configurations → Private Link** выберите объект настроек частного доступа, созданный на предыдущем шаге.

    :::warning
    Если вы используете существующее рабочее пространство Databricks, для включения Private Link необходимо остановить все выполняющиеся в нем рабочие нагрузки. После внесения изменений рабочие нагрузки также нельзя запускать еще в течение 20 минут. Из [документации Databricks](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both):

    «После создания (или обновления) рабочего пространства дождитесь, пока оно станет доступно для использования или создания кластеров. Рабочее пространство остается в состоянии RUNNING, а изменение VPC происходит немедленно. Однако использовать или создавать кластеры нельзя еще в течение 20 минут. Если вы создадите или начнете использовать кластеры до истечения этого интервала, они могут не запуститься, завершиться с ошибкой или вызвать другое непредвиденное поведение».

    :::

## Создание подключения в dbt {#create-connection-in-dbt}

После завершения настройки вы можете настроить частную конечную точку в <Constant name="dbt" />:

<PrivateLinkCreateConnection platform="Databricks" />
