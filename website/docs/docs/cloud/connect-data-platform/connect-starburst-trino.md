---
title: "Подключение Starburst или Trino"
description: "Настройка подключения к Starburst или Trino."
sidebar_label: "Подключение Starburst или Trino"
---

Ниже приведены необходимые поля для настройки подключения к кластеру [Starburst Enterprise](https://docs.starburst.io/starburst-enterprise/index.html), [Starburst Galaxy](https://docs.starburst.io/starburst-galaxy/index.html) или [Trino](https://trino.io/). Если не указано иное, под "кластером" подразумевается кластер любого из этих продуктов.

| Поле | Описание | Примеры |
| --- | --- | --- |
| **Host** | Имя хоста вашего кластера. Не включайте префикс HTTP протокола. | `mycluster.mydomain.com` |
| **Port** | Порт для подключения к вашему кластеру. По умолчанию это 443 для кластеров с включенным TLS. | `443` |
| **User** | Имя пользователя (учетной записи) для входа в ваш кластер. При подключении к кластерам Starburst Galaxy необходимо включать роль пользователя в качестве суффикса к имени пользователя.<br/><br/> | Формат для Starburst Enterprise или Trino зависит от настроенного метода аутентификации. <br/>Формат для Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> |
| **Password** | Пароль пользователя. |  -  |
| **Database** | Имя каталога в вашем кластере. | `example_catalog` |
| **Schema** | Имя схемы, существующей в указанном каталоге. | `example_schema` |

## Роли в Starburst Enterprise {#roles-in-starburst-enterprise}

<Snippet path="connect-starburst-trino/roles-starburst-enterprise" />

## Каталоги и схемы {#catalogs-and-schemas}

<Snippet path="connect-starburst-trino/schema-db-fields" />

## Конфигурация {#configuration}

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для платформы данных, в <Constant name="cloud" />, см. [конфигурацию, специфичную для Starburst/Trino](/reference/resource-configs/trino-configs).
