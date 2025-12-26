---
title: "Подключение Databricks"
id: connect-databricks
description: "Инструкции по настройке подключения Databricks к dbt"
sidebar_label: "Подключение Databricks"
---

Адаптер dbt-databricks поддерживается командой Databricks. Команда Databricks стремится поддерживать и улучшать адаптер со временем, поэтому вы можете быть уверены, что интегрированный опыт предоставит лучшее от dbt и лучшее от Databricks. Подключение к Databricks через dbt-spark устарело.

## О адаптере dbt-databricks

dbt-databricks совместим со следующими версиями <Constant name="core" /> в <Constant name="cloud" /> с различной степенью функциональности.

| Функция | Версии dbt |
| ----- | ----------- | 
| dbt-databricks | Доступно, начиная с dbt 1.0 в <Constant name="cloud" /> |
| Unity Catalog | Доступно, начиная с dbt 1.1 | 
| Python models | Доступны, начиная с dbt 1.3 |

Адаптер dbt-databricks предлагает:
- **Более простая настройка**
- **Лучшие значения по умолчанию:**
Адаптер dbt-databricks более определен, направляя пользователей к улучшенному опыту с меньшими усилиями. Дизайнерские решения этого адаптера включают использование формата Delta по умолчанию, использование merge для инкрементных моделей и выполнение затратных запросов с Photon.
- **Поддержка Unity Catalog:**
Unity Catalog позволяет пользователям Databricks централизованно управлять всеми данными, упрощая управление доступом и улучшая производительность поиска и запросов. Пользователи Databricks теперь могут получить трехуровневую иерархию данных – каталог, схема, имя модели – что решает давнюю проблему в организации и управлении данными.

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для конкретной платформы данных, в <Constant name="cloud" />, обратитесь к разделу [Databricks-specific configuration](/reference/resource-configs/databricks-configs).

Чтобы предоставить пользователям или ролям разрешения на базу данных (права доступа и привилегии), обратитесь к странице [примеров разрешений](/reference/database-permissions/databricks-permissions).

Для настройки подключения к Databricks укажите следующие поля:

| Поле | Описание | Примеры |
| ----- | ----------- | -------- |
| Имя хоста сервера | Имя хоста аккаунта Databricks для подключения | dbc-a2c61234-1234.cloud.databricks.com |
| HTTP Path | HTTP путь к кластеру Databricks или SQL хранилищу | /sql/1.0/warehouses/1a23b4596cd7e8fg |
| Catalog | Имя каталога Databricks (необязательно) | Production |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dbt-databricks.png" title="Настройка подключения к Databricks с использованием адаптера dbt-databricks"/>