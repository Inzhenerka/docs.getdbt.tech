---
title: "Настройка Teradata VantageCloud и AWS PrivateLink"
id: aws-teradata
description: "Настройка AWS PrivateLink для Teradata VantageCloud."
sidebar_label: "Teradata VantageCloud"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Настройка AWS PrivateLink для Teradata VantageCloud

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Следующие шаги помогут настроить конечную точку AWS PrivateLink для Teradata VantageCloud в многопользовательской среде <Constant name="dbt" />.

<CloudProviders type='Teradata VantageCloud' />

## Настройка AWS PrivateLink

1. Обратитесь к команде Teradata, сопровождающей вашу учетную запись, или в службу поддержки Teradata, чтобы получить:
   - Имя сервиса конечной точки VPC для вашего сервиса Teradata PrivateLink
   - Регион AWS, в котором размещена ваша среда Teradata

   Имя сервиса генерируется AWS и выглядит примерно так:

   ```
   com.amazonaws.vpce.us-east-1.vpce-svc-0abc123def456ghi7
   ```

   :::note Учетная запись dbt в AWS
   Если для предоставления доступа к вашему сервису конечной точки Teradata требуется идентификатор учетной записи <Constant name="dbt" /> в AWS, используйте **идентификатор учетной записи AWS**: `346425330055` &mdash; _Примечание: этот идентификатор учетной записи применяется только к многопользовательским средам <Constant name="dbt" /> в AWS. Чтобы получить идентификаторы учетных записей AWS для сред Virtual Private/Single-Tenant, обратитесь в [службу поддержки dbt](mailto:support@getdbt.com)._
   :::

2. Добавьте необходимые сведения в следующий шаблон и отправьте запрос на настройку AWS PrivateLink в [службу поддержки dbt](mailto:support@getdbt.com):

   <Expandable alt_header="Шаблон письма с запросом в службу поддержки" is_open={true}>

   ```text
   Subject: New AWS Multi-Tenant PrivateLink Request

   - Type: Teradata
   - dbt platform account URL:
   - Display name (appears in the dbt connection dropdown):
   - VPC Endpoint Service Name:
   - Port: 1025 (change if not default)
   - Teradata AWS Region (for example, us-east-1, eu-west-2):
   - dbt AWS multi-tenant environment (US, EMEA, AU, JP):
   ```

   </Expandable>

   <PrivateLinkSLA />

3. Когда служба поддержки dbt подтвердит, что конечная точка создана и подключение проверено, она отправит вам имя хоста, которое нужно использовать при настройке проекта.

## Создание подключения в dbt

Завершив настройку совместно со службой поддержки dbt, вы можете настроить частную конечную точку в <Constant name="dbt" />:

<PrivateLinkCreateConnection platform="Teradata"  />
