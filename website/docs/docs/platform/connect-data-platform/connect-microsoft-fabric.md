---
title: "Подключение к Microsoft Fabric"
description: "Настройка подключения к Microsoft Fabric."
sidebar_label: "Подключение к Microsoft Fabric"
availability:
  surface: platform
  access: login_required
---

## Поддерживаемые методы аутентификации {#supported-authentication-methods}
Поддерживаемые методы аутентификации:
- Сервисный принципал Microsoft Entra
- Пароль Microsoft Entra

Microsoft Fabric Data Warehouse не поддерживает аутентификацию с помощью пароля SQL (LDAP), поэтому необходимо использовать Microsoft Entra ID. Это означает, что для использования [Microsoft Fabric](https://www.microsoft.com/en-us/microsoft-fabric) в <Constant name="dbt" /> вам потребуется как минимум один субъект-служба Microsoft Entra для подключения <Constant name="dbt" /> к Fabric, а в идеале — отдельный субъект-служба для каждого пользователя.

### Сервисный принципал Microsoft Entra {#microsoft-entra-service-principal}
Ниже приведены необходимые поля для настройки подключения к Microsoft Fabric с использованием аутентификации сервисного принципала Microsoft Entra.

| Поле | Описание |
| --- | --- |
| **Server** | Значение **host** субъекта-службы для тестовой конечной точки Fabric. |
| **Port** | Порт для подключения к Microsoft Fabric. Можно использовать `1433` (по умолчанию) — стандартный номер порта SQL Server. |
| **Database** | Значение **database** субъекта-службы для тестовой конечной точки Fabric. |
| **Authentication** | Выберите **Service Principal** в раскрывающемся списке. | 
| **Tenant ID** | Значение **Directory (tenant) ID** субъекта-службы. |
| **Client ID** | Значение **application (client) ID** субъекта-службы. |
| **Client secret** | Значение **client secret** субъекта-службы (не **client secret id**). |

### Пароль Microsoft Entra {#microsoft-entra-password}

Ниже приведены необходимые поля для настройки подключения к Microsoft Fabric с использованием аутентификации по паролю Microsoft Entra.

| Поле | Описание |
| --- | --- |
| **Server** | Имя хоста сервера для подключения к Microsoft Fabric. |
| **Port** | Порт сервера. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Имя базы данных. |
| **Authentication** | Выберите **Active Directory Password** из выпадающего списка. | 
| **User** | Имя пользователя Microsoft Entra. |
| **Password** | Пароль Microsoft Entra. |

## Конфигурация {#configuration}

Чтобы узнать, как оптимизировать производительность с помощью конфигураций <Constant name="dbt" />, специфичных для вашей платформы данных, см. [Конфигурации Microsoft Fabric Data Warehouse](/reference/resource-configs/fabric-configs).
