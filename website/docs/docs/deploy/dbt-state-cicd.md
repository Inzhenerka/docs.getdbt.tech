---
title: "Настройка аутентификации для неинтерактивных сред"
sidebar_label: "Настройка аутентификации для неинтерактивных сред"
description: "Узнайте, как настроить аутентификацию dbt State для CI/CD и других неинтерактивных сред с помощью служебных токенов."
id: "dbt-state-cicd"
tags: ['dbt State']
availability: everywhere_usage
---

# Настройка аутентификации для неинтерактивных сред

В неинтерактивной среде dbt работает без участия человека, который мог бы пройти аутентификацию вручную &mdash; например, в конвейерах CI/CD (таких как GitHub Actions, GitLab CI и Jenkins) и инструментах оркестрации в производственной среде (таких как Airflow и Prefect). В этих средах аутентификация через браузер невозможна. Вместо этого dbt State проходит аутентификацию с помощью учётных данных, переданных через переменные окружения, что позволяет продолжать кеширование состояния и оптимизацию сборок.

dbt State автоматически определяет, что работает в неинтерактивной среде. Если действительные учётные данные не предоставлены, dbt State отключается и выводит предупреждение, позволяя вашим командам dbt продолжить работу без кеширования.

Для запуска dbt в неинтерактивной среде требуется токен служебной учётной записи для аутентификации. Для создания служебного токена необходима учётная запись <Constant name="dbt_platform" />; если у вас её ещё нет, обратитесь к разделу [Настройка dbt State](/docs/deploy/dbt-state-setup), чтобы создать бесплатную учётную запись, прежде чем продолжить.

Если вы ранее зарегистрировались в dbt State через отдельное приложение (`app.state.dbt.com`) и ещё не перешли на <Constant name="dbt_platform" />, обратитесь к разделу [Учётные данные клиента OAuth](/docs/deploy/dbt-state-oauth).

## Предварительные требования

Прежде чем начать, убедитесь, что у вас есть:

- Учётная запись <Constant name="dbt_platform" />.
- Права **Owner** или **Account Admin** для создания служебного токена.
- Установленный и настроенный dbt State. Дополнительную информацию см. в разделе [Настройка dbt State](/docs/deploy/dbt-state-setup).

## Создание служебного токена

Чтобы создать токен служебной учётной записи в <Constant name="dbt_platform" />, обратитесь к разделу [Создание токенов служебных учётных записей](/docs/dbt-apis/service-tokens#generate-service-account-tokens). При добавлении разрешений для токена назначьте хотя бы одно из следующих:

- **Account Admin**

Следующие разрешения доступны только на тарифных планах Enterprise:
- **Owner**
- **Job Admin**
- **Job Creator**
- **Job Runner** (рекомендуется; предоставляет минимальные права доступа, необходимые для dbt State)
- **Developer**

## Настройка аутентификации

Задайте следующие переменные окружения в своей среде оркестрации:

```bash
DBT_CLOUD_TOKEN=YOUR_SERVICE_TOKEN
DBT_CLOUD_ACCOUNT_HOST=YOUR_ACCOUNT_HOST
DBT_CLOUD_ACCOUNT_ID=YOUR_ACCOUNT_ID
```

Замените `YOUR_SERVICE_TOKEN` своим служебным токеном, `YOUR_ACCOUNT_HOST` — [хостом вашей учётной записи](/docs/platform/about-platform/access-regions-ip-addresses) (например, `abc123.us1.dbt.com`), а `YOUR_ACCOUNT_ID` — числовым идентификатором вашей учётной записи. Перейдите в **Account settings** > **Account**, чтобы найти идентификатор и хост учётной записи (имя хоста из поля **Access URL**).

### Требования к сети

Если ваша сеть или среда ограничивает исходящий трафик, разрешите доступ к следующим URL-адресам, чтобы dbt State мог проходить аутентификацию и взаимодействовать с <Constant name="dbt_platform" />:

<SimpleTable>
| URL | Описание |
|-----|-------------|
| `auth.state.dbt.com` | Аутентификация dbt State |
| `api.state.dbt.com` | API dbt State |
| `abc123.us1.dbt.com` | Ваш [URL-адрес доступа](/docs/platform/about-platform/access-regions-ip-addresses) к <Constant name="dbt_platform" /> (замените URL-адресом доступа вашей учётной записи) |
</SimpleTable>

После настройки аутентификации [убедитесь, что dbt State активен](#verifying-dbt-state-is-active).

## Проверка активности dbt State {#verifying-dbt-state-is-active}

1. Запустите любое задание преобразования dbt в своей среде оркестрации.
2. Проверьте вывод журнала. Вы должны увидеть сообщение, подобное приведённому ниже, а затем статус конкретного шага dbt State:

   ```
   dbt State adapter: dbt-state v2.10.1 is enabled
   ```

## Связанная документация

- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
- [Конфигурации dbt State](/reference/resource-configs/dbt-state-configs)
- [Переход с оркестрации с учётом состояния](/docs/deploy/dbt-state-migration)
