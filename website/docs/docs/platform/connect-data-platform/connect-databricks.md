---
title: "Подключение Databricks"
id: connect-databricks
description: "Инструкции по настройке подключения Databricks к dbt"
sidebar_label: "Подключение Databricks"
availability:
  surface: platform
  access: login_required
---

# Подключение Databricks <ProductCard text="Совместимо с dbt v2" />

Адаптер dbt-databricks поддерживается командой Databricks. Команда Databricks стремится поддерживать и совершенствовать адаптер в долгосрочной перспективе, поэтому вы можете быть уверены, что эта интеграция позволит использовать лучшие возможности dbt и Databricks. Подключение к Databricks через dbt-spark объявлено устаревшим.

## О адаптере dbt-databricks {#about-the-dbt-databricks-adapter}

dbt-databricks совместим со следующими версиями <Constant name="core" /> в <Constant name="dbt" /> с различной степенью поддержки функциональности.

| Функция | Версии dbt |
| ----- | ----------- | 
| dbt-databricks | Доступен начиная с dbt 1.0 в <Constant name="dbt" />|
| Unity Catalog | Доступен начиная с dbt 1.1 | 
| Модели Python | Доступны начиная с dbt 1.3 |

Адаптер dbt-databricks предлагает:
- **Более простая настройка**
- **Лучшие значения по умолчанию:**
Адаптер dbt-databricks более определен, направляя пользователей к улучшенному опыту с меньшими усилиями. Дизайнерские решения этого адаптера включают использование формата Delta по умолчанию, использование merge для инкрементных моделей и выполнение затратных запросов с Photon.
- **Поддержка Unity Catalog:**
Unity Catalog позволяет пользователям Databricks централизованно управлять всеми данными, упрощая управление доступом и улучшая производительность поиска и запросов. Пользователи Databricks теперь могут получить трехуровневую иерархию данных – каталог, схема, имя модели – что решает давнюю проблему в организации и управлении данными.

Чтобы узнать, как оптимизировать производительность с помощью настроек для конкретной платформы данных в <Constant name="dbt" />, обратитесь к разделу [Настройки для Databricks](/reference/resource-configs/databricks-configs).

Чтобы предоставить пользователям или ролям разрешения на базу данных (права доступа и привилегии), обратитесь к странице [примеров разрешений](/reference/database-permissions/databricks-permissions).

## Права доступа к хранилищу для <Constant name="fusion" />

import FusionDatabricksWarehousePerms from '/snippets/_v2-warehouse-permissions-databricks.md';

<FusionDatabricksWarehousePerms />

## Поля подключения

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Имя хоста сервера | Имя хоста аккаунта Databricks для подключения | dbc-a2c61234-1234.cloud.databricks.com |
| HTTP Path | HTTP путь к кластеру Databricks или SQL хранилищу | /sql/1.0/warehouses/1a23b4596cd7e8fg |
| Catalog | Имя каталога Databricks (необязательно) | Production |

<Lightbox src="/img/docs/dbt-platform/platform-configuring-dbt-platform/dbt-databricks.png" title="Настройка подключения к Databricks с помощью адаптера dbt-databricks"/>
