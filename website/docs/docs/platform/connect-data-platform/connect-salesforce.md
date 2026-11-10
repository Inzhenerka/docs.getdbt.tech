---
title: "Подключение к Salesforce Data 360"
id: connect-salesforce
description: "Настройка подключения к Salesforce Data 360."
sidebar_label: "Подключение к Salesforce Data 360"
unlisted: true
availability:
  surface: platform
  access: login_required
---

# Подключение к Salesforce Data 360 <Lifecycle status="beta"/> <ProductCard text="Совместимо с dbt v2" />

<Constant name="fusion_engine" /> в <Constant name="dbt_platform" /> поддерживает подключение к Salesforce Data 360.

import SalesforcePrereqs from '/snippets/_salesforce-data-cloud-prereqs.md';

<SalesforcePrereqs />

## Поля подключения

Чтобы подключиться к Salesforce Data 360, настройте параметры подключения и укажите учетные данные.

### Подключение

Заполните следующие поля, чтобы настроить подключение к Salesforce Data 360:

| Поле | Описание | Пример |
| ----- | ----------- | ------- |
| Connection name | Название подключения к Salesforce Data 360. | |
| Auth method | Метод аутентификации для подключения к Salesforce Data 360. Поддерживается только JWT. | JWT Bearer Flow (по умолчанию) |
| Login URL | URL экземпляра Salesforce. | `https://login.salesforce.com` (по умолчанию) |
| Database | (Необязательно) База данных Salesforce Data 360, к которой нужно подключиться. | |
| Data Transform Run Timeout | (Необязательно) Время ожидания (в миллисекундах) для запусков преобразования данных. | |

### Учетные данные

Введите следующие учетные данные для аутентификации в Salesforce Data 360:

<SimpleTable>
| Поле | Описание | Пример |
| ----- | ----------- | ------- |
| Username | Ваше имя пользователя в Salesforce Data 360. | user.name@example.com |
| Client ID | Значение `Consumer Key` приложения Salesforce Data 360. | |
| Private Key | Закрытый ключ для аутентификации по протоколу JWT bearer flow. | |
</SimpleTable>

- В поле **Username** укажите имя пользователя вашей учетной записи Salesforce. Аутентификация пройдет успешно, только если этому пользователю назначен один из профилей или наборов разрешений, добавленных во внешнее клиентское приложение на [шаге 9](#creating-the-external-client-app).
- Для поля **Client ID** получите Consumer Key из внешнего клиентского приложения в Salesforce. Перейдите в **Settings** > **OAuth Settings** > **Consumer Key and Secret**. Скопируйте **Consumer Key** и вставьте его в поле **Client ID**.
- **Private Key** — это файл `server.key`, созданный в разделе [Генерация закрытого ключа и сертификата](#generating-a-private-key-and-certificate).

## Метод аутентификации

Salesforce Data 360 поддерживает только аутентификацию JWT bearer. JWT bearer flow — это метод межмашинной аутентификации, который использует файл закрытого ключа и Consumer Key (Client ID) для аутентификации без участия пользователя.

## Конфигурация

Чтобы узнать, как оптимизировать производительность с помощью настроек, специфичных для платформы данных, в <Constant name="dbt_platform" />, обратитесь к разделу [Настройки Salesforce Data 360](/reference/resource-configs/data-cloud-configs).

## Ограничения

Следующие возможности dbt пока не поддерживаются для подключений к Salesforce Data 360 в <Constant name="dbt_platform" />:

- [Seeds](/docs/build/seeds)
    - В качестве обходного решения войдите в Salesforce и загрузите CSV-файл вручную.
- [Каталог](/docs/explore/explore-projects)
- [Семантический слой](/docs/use-dbt-semantic-layer/dbt-sl)
