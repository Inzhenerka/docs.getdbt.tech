---
title: "Настройка Databricks PrivateLink"
id: databricks-privatelink
description: "Настройка PrivateLink для Databricks"
sidebar_label: "PrivateLink для Databricks"
pagination_next: null
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

Следующие шаги помогут вам настроить конечную точку Databricks AWS PrivateLink или Azure Private Link в многопользовательской среде dbt Cloud.

<CloudProviders type='Databricks'/>

## Настройка AWS PrivateLink

1. Найдите ваше [имя экземпляра Databricks](https://docs.databricks.com/en/workspace/workspace-details.html#workspace-instance-names-urls-and-ids)
    - Пример: `cust-success.cloud.databricks.com`

1. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос на AWS PrivateLink в [поддержку dbt](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support): 
    ```
    Тема: Новый запрос на AWS Multi-Tenant PrivateLink
    - Тип: Databricks
    - Имя экземпляра Databricks:
    - Регион кластера Databricks AWS (например, us-east-1, eu-west-2):
    - Многопользовательская среда dbt Cloud (US, EMEA, AU):
    ```
    <PrivateLinkSLA />

1. Как только поддержка dbt Cloud уведомит вас о завершении настройки, [зарегистрируйте конечную точку VPC в Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) и прикрепите её к рабочей области:
    - [Зарегистрируйте вашу конечную точку VPC](https://docs.databricks.com/en/security/network/classic/vpc-endpoints.html) &mdash; Зарегистрируйте конечную точку VPC, используя предоставленный поддержкой dbt идентификатор конечной точки VPC.
    - [Создайте объект настроек частного доступа](https://docs.databricks.com/en/security/network/classic/private-access-settings.html) &mdash; Создайте объект настроек частного доступа (PAS) с желаемыми настройками публичного доступа, установив уровень частного доступа на **Endpoint**. Выберите зарегистрированную конечную точку, созданную на предыдущем шаге.
    - [Создайте или обновите вашу рабочую область](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both) &mdash; Создайте рабочую область или обновите существующую. В разделе **Расширенные настройки → Private Link** выберите объект настроек частного доступа, созданный на предыдущем шаге.

    :::warning
    Если вы используете существующую рабочую область Databricks, все рабочие нагрузки в этой области должны быть остановлены для включения Private Link. Рабочие нагрузки также не могут быть запущены в течение 20 минут после внесения изменений. Из [документации Databricks](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both):

    "После создания (или обновления) рабочей области подождите, пока она не станет доступной для использования или создания кластеров. Статус рабочей области остается RUNNING, и изменение VPC происходит немедленно. Однако вы не можете использовать или создавать кластеры в течение следующих 20 минут. Если вы создаете или используете кластеры до истечения этого временного интервала, кластеры не запускаются успешно, могут завершиться с ошибкой или вызвать другие неожиданные поведения."

    :::

## Настройка Azure Private Link

1. Перейдите в вашу рабочую область Azure Databricks. 
    Формат пути: `/subscriptions/<subscription_uuid>/resourceGroups/<resource_group_name>/providers/Microsoft.Databricks/workspaces/<workspace_name>`.
2. На странице обзора рабочей области нажмите **JSON view**. 
3. Скопируйте значение в поле `resource_id`.  
4. Добавьте необходимую информацию в следующий шаблон и отправьте ваш запрос на Azure Private Link в [поддержку dbt](https://docs.getdbt.com/docs/dbt-support#dbt-cloud-support): 
    ```
      Тема: Новый запрос на Azure Multi-Tenant Private Link
    - Тип: Databricks
    - Имя экземпляра Databricks:
    - Идентификатор ресурса Azure Databricks:
    - Многопользовательская среда dbt Cloud: EMEA
    ```
5. Как только наша команда поддержки подтвердит, что ресурсы доступны в портале Azure, перейдите в рабочую область Azure Databricks и перейдите в **Networking** > **Private Endpoint Connections**. Затем выделите опцию с именем `dbt` и выберите **Approve**.


## Создание подключения в dbt Cloud

После завершения настройки в среде Databricks вы сможете настроить частную конечную точку в dbt Cloud:

1. Перейдите в **Settings** → **Create new project** → выберите **Databricks**. 
2. Вы увидите две радиокнопки: **Public** и **Private.** Выберите **Private**. 
3. Выберите частную конечную точку из выпадающего списка (это автоматически заполнит поле hostname/account).
4. Настройте оставшиеся детали платформы данных.
5. Проверьте ваше подключение и сохраните его.