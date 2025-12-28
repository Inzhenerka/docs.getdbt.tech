---
title: "Подключение Azure Synapse Analytics"
description: "Настройка подключения Azure Synapse Analytics."
sidebar_label: "Подключение Azure Synapse Analytics"
---

# Подключение Azure Synapse Analytics

## Поддерживаемые методы аутентификации
Поддерживаемые методы аутентификации:
- Сервисный принципал Microsoft Entra ID
- Пароль Active Directory
- Аутентификация SQL сервера

### Сервисный принципал Microsoft Entra ID
Ниже приведены необходимые поля для настройки подключения к Azure Synapse Analytics с использованием аутентификации сервисного принципала Microsoft Entra ID.

| Поле | Описание |
| --- | --- |
| **Server** | Значение **Synapse host name** сервисного принципала (без завершающей строки `, 1433`) для тестовой конечной точки Synapse. |
| **Port** | Порт для подключения к Azure Synapse Analytics. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Значение **database** сервисного принципала для тестовой конечной точки Synapse. |
| **Authentication** | Выберите **Service Principal** из выпадающего списка. | 
| **Tenant ID** | **Directory (tenant) ID** сервисного принципала. |
| **Client ID** | **application (client) ID id** сервисного принципала. |
| **Client secret** | **client secret** сервисного принципала (не **client secret id**). |  

### Пароль Active Directory

Ниже приведены необходимые поля для настройки подключения к Azure Synapse Analytics с использованием аутентификации по паролю Active Directory.

| Поле | Описание |
| --- | --- |
| **Server** | Имя хоста сервера для подключения к Azure Synapse Analytics. |
| **Port** | Порт сервера. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Имя базы данных. |
| **Authentication** | Выберите **Active Directory Password** из выпадающего списка. | 
| **User** | Имя пользователя AD. |
| **Password** | Пароль имени пользователя AD. |

### Аутентификация SQL сервера

Ниже приведены необходимые поля для настройки подключения к Azure Synapse Analytics с использованием аутентификации SQL сервера.

| Поле | Описание |
| --- | --- |
| **Server** | Имя хоста сервера или IP для подключения к Azure Synapse Analytics. |
| **Port** | Порт сервера. Вы можете использовать `1433` (по умолчанию), который является стандартным номером порта SQL сервера. |
| **Database** | Имя базы данных. |
| **Authentication** | Выберите **SQL** из выпадающего списка. | 
| **User** | Имя пользователя. |
| **Password** | Пароль имени пользователя. |

## Конфигурация

## Конфигурация

Чтобы узнать, как оптимизировать производительность с помощью конфигураций, специфичных для конкретной платформы данных, в <Constant name="cloud" />, см. раздел [Microsoft Azure Synapse DWH configurations](/reference/resource-configs/azuresynapse-configs).
