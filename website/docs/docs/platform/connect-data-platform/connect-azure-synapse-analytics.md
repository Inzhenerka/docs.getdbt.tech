---
title: "Подключение к Azure Synapse Analytics"
description: "Настройка подключения к Azure Synapse Analytics."
sidebar_label: "Подключение к Azure Synapse Analytics"
availability:
  surface: platform
  access: login_required
---

# Подключение Azure Synapse Analytics {#connect-azure-synapse-analytics}

## Поддерживаемые методы аутентификации {#supported-authentication-methods}
Поддерживаемые методы аутентификации:
- Сервисный принципал Microsoft Entra ID
- Пароль Active Directory
- Аутентификация SQL сервера

### Сервисный принципал Microsoft Entra ID {#microsoft-entra-id-service-principal}
Ниже приведены необходимые поля для настройки подключения к Azure Synapse Analytics с использованием аутентификации сервисного принципала Microsoft Entra ID.

| Поле | Описание |
| --- | --- |
| **Server** | Значение **Synapse host name** субъекта-службы (без строки `, 1433` в конце) для тестовой конечной точки Synapse. |
| **Port** | Порт для подключения к Azure Synapse Analytics. Можно использовать `1433` (значение по умолчанию) — стандартный номер порта SQL-сервера. |
| **Database** | Значение **database** субъекта-службы для тестовой конечной точки Synapse. |
| **Authentication** | Выберите **Service Principal** в раскрывающемся списке. | 
| **Tenant ID** | Значение **Directory (tenant) ID** субъекта-службы. |
| **Client ID** | Значение **application (client) ID** субъекта-службы. |
| **Client secret** | Значение **client secret** субъекта-службы (не **client secret id**). |

### Пароль Active Directory {#active-directory-password}

Ниже приведены необходимые поля для настройки подключения к Azure Synapse Analytics с использованием аутентификации по паролю Active Directory.

| Поле | Описание |
| --- | --- |
| **Server** | Имя хоста сервера для подключения к Azure Synapse Analytics. |
| **Port** | Порт сервера. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Имя базы данных. |
| **Authentication** | Выберите **Active Directory Password** из выпадающего списка. | 
| **User** | Имя пользователя AD. |
| **Password** | Пароль имени пользователя AD. |

### Аутентификация SQL сервера {#sql-server-authentication}

Ниже приведены необходимые поля для настройки подключения к Azure Synapse Analytics с использованием аутентификации SQL сервера.

| Поле | Описание |
| --- | --- |
| **Server** | Имя хоста сервера или IP для подключения к Azure Synapse Analytics. |
| **Port** | Порт сервера. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Имя базы данных. |
| **Authentication** | Выберите **SQL** из выпадающего списка. | 
| **User** | Имя пользователя. |
| **Password** | Пароль имени пользователя. |

## Конфигурация {#configuration}

## Конфигурация

Чтобы узнать, как оптимизировать производительность с помощью настроек для конкретной платформы данных в <Constant name="dbt" />, см. [Конфигурации Microsoft Azure Synapse DWH](/reference/resource-configs/azuresynapse-configs).
