---
title: "Настройка Teradata VantageCloud и Azure Private Link"
id: azure-teradata
description: "Настройка Azure Private Link для Teradata VantageCloud."
sidebar_label: "Teradata VantageCloud"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---
# Настройка Azure Private Link для Teradata VantageCloud
import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Следующие шаги помогут настроить конечную точку Azure Private Link для Teradata VantageCloud в многопользовательской среде <Constant name="dbt" />.

<CloudProviders type='Teradata VantageCloud' />

## Настройка Azure Private Link

1. Обратитесь к команде Teradata, сопровождающей вашу учётную запись, или в службу поддержки Teradata, чтобы получить:
   - Псевдоним ресурса Azure для вашей службы Teradata Private Link Service
   - Регион Azure, в котором размещена ваша среда Teradata

   Псевдоним генерируется Azure и выглядит примерно так:

   ```
   teradata-pls.abc12345-6789-0def-1234-56789abcdef0.eastus.azure.privatelinkservice
   ```

   :::note Идентификатор подписки Azure для dbt
   Если для предоставления доступа к службе конечной точки Teradata требуется идентификатор подписки Azure для <Constant name="dbt" />, [обратитесь в службу поддержки dbt](mailto:support@getdbt.com), чтобы запросить его.
   :::

2. Добавьте необходимую информацию в следующий шаблон и отправьте запрос на Azure Private Link в [службу поддержки dbt](mailto:support@getdbt.com):

   <Expandable alt_header="Шаблон письма в службу поддержки" is_open={true}>

   ```text
   Subject: New Azure Multi-Tenant Private Link Request

   - Type: Teradata
   - dbt platform account URL:
   - Display name (appears in the dbt connection dropdown):
   - Teradata Private Link Service alias:
   - Port: 1025 (change if not default)
   - Teradata Azure region:
   - dbt Azure multi-tenant environment (US or EMEA):
   ```

   </Expandable>

   <PrivateLinkSLA />

3. После того как служба поддержки dbt подтвердит, что конечная точка создана, а подключение проверено, она пришлёт имя хоста, которое нужно использовать при настройке проекта.

## Создание подключения в dbt

После завершения настройки совместно со службой поддержки dbt вы можете настроить частную конечную точку в <Constant name="dbt" />:

<PrivateLinkCreateConnection platform="Teradata" />
