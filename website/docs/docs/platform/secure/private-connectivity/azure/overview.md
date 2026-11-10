---
title: "Частные подключения в Azure"
id: azure-overview
description: "Настройка частных подключений для развертываний платформы dbt в Azure."
sidebar_label: "Об Azure Private Link"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import AzureMatrix from '/snippets/_azure-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Azure Private Link обеспечивает безопасное частное подключение между <Constant name="dbt" /> и вашими сервисами, размещенными в Azure. При использовании Private Link трафик между dbt и вашими платформами данных или самостоятельно размещенными сервисами остается в сети Azure и не проходит через общедоступный интернет.

Дополнительные сведения см. в [документации Azure Private Link](https://learn.microsoft.com/en-us/azure/private-link/).

<AzureMatrix />

## Межрегиональные частные подключения

dbt Labs располагает частными сетями, соединенными между собой по всему миру и предназначенными специально для размещения частных конечных точек, которые подключены к средам экземпляров <Constant name="dbt" />. Такое сетевое взаимодействие позволяет средам <Constant name="dbt" /> подключаться к любому поддерживаемому региону из любого экземпляра <Constant name="dbt" /> в пределах сети одного облачного провайдера. Для обеспечения безопасности доступ к этим конечным точкам защищен группами безопасности, сетевыми политиками и средствами защиты подключений на уровне приложений в дополнение к механизмам аутентификации и авторизации, предоставляемым каждой из подключенных платформ.
