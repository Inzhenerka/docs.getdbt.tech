---
title: "Подключение Microsoft Fabric"
description: "Настройка подключения Microsoft Fabric."
sidebar_label: "Подключение Microsoft Fabric"
---

## Поддерживаемые методы аутентификации
Поддерживаемые методы аутентификации:
- Сервисный принципал Microsoft Entra
- Пароль Microsoft Entra

Пароль SQL (LDAP) не поддерживается в Microsoft Fabric Synapse Data Warehouse, поэтому вы должны использовать Microsoft Entra ID. Это означает, что для использования [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric) в dbt Cloud вам потребуется как минимум один сервисный принципал Microsoft Entra для подключения dbt Cloud к Fabric, желательно один сервисный принципал для каждого пользователя.

### Сервисный принципал Microsoft Entra
Ниже приведены необходимые поля для настройки подключения к Microsoft Fabric с использованием аутентификации сервисного принципала Microsoft Entra.

| Поле | Описание |
| --- | --- |
| **Server** | Значение **host** сервисного принципала для тестовой конечной точки Fabric. |
| **Port** | Порт для подключения к Microsoft Fabric. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Значение **database** сервисного принципала для тестовой конечной точки Fabric. |
| **Authentication** | Выберите **Service Principal** из выпадающего списка. | 
| **Tenant ID** | **Directory (tenant) ID** сервисного принципала. |
| **Client ID** | **application (client) ID** сервисного принципала. |
| **Client secret** | **client secret** сервисного принципала (не **client secret id**). |  

### Пароль Microsoft Entra

Ниже приведены необходимые поля для настройки подключения к Microsoft Fabric с использованием аутентификации по паролю Microsoft Entra.

| Поле | Описание |
| --- | --- |
| **Server** | Имя хоста сервера для подключения к Microsoft Fabric. |
| **Port** | Порт сервера. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Имя базы данных. |
| **Authentication** | Выберите **Active Directory Password** из выпадающего списка. | 
| **User** | Имя пользователя Microsoft Entra. |
| **Password** | Пароль Microsoft Entra. |

## Конфигурация

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для платформы данных в dbt Cloud, обратитесь к [конфигурациям Microsoft Fabric DWH](/reference/resource-configs/fabric-configs).