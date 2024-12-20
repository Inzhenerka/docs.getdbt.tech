---
title: "Настройка BigQuery OAuth"
description: "Узнайте, как администраторы dbt Cloud могут использовать BigQuery OAuth для управления доступом в аккаунте dbt Cloud"
id: "set-up-bigquery-oauth"
pagination_next: null
---

:::info Функция для корпоративных клиентов

Это руководство описывает функцию плана dbt Cloud Enterprise. Если вы хотите узнать больше о корпоративном плане, свяжитесь с нами по адресу sales@getdbt.com.

:::

dbt Cloud поддерживает разработчиков с [OAuth](https://cloud.google.com/bigquery/docs/authentication) для BigQuery, предоставляя дополнительный уровень безопасности для корпоративных пользователей dbt. Когда BigQuery OAuth включен для проекта dbt Cloud, все разработчики dbt Cloud должны пройти аутентификацию с BigQuery, чтобы использовать IDE dbt Cloud. Среды развертывания проекта по-прежнему будут использовать ключ учетной записи службы BigQuery, установленный в учетных данных проекта.

Чтобы настроить BigQuery OAuth в dbt Cloud, администратор BigQuery должен:
1. [Найти значение перенаправления URI](#locate-the-redirect-uri-value) в dbt Cloud.
2. [Создать клиентский ID и секрет для BigQuery OAuth 2.0](#creating-a-bigquery-oauth-20-client-id-and-secret) в BigQuery.
3. [Настроить подключение](#configure-the-connection-in-dbt-cloud) в dbt Cloud.

Чтобы использовать BigQuery в IDE dbt Cloud, все разработчики должны:
1. [Аутентифицироваться в BigQuery](#authenticating-to-bigquery) в своих учетных данных профиля.

### Найдите значение перенаправления URI
Для начала найдите URI перенаправления для настройки BigQuery OAuth. Для этого:
 - Перейдите к названию вашего аккаунта, над значком вашего профиля на левой боковой панели  
 - Выберите **Настройки аккаунта** в меню 
 - На левой боковой панели выберите **Проекты** 
 - Выберите проект из списка
 - Выберите **Подключение**, чтобы отредактировать детали подключения
 - Найдите поле **Redirect URI** в разделе **OAuth 2.0 Settings**. Скопируйте это значение в буфер обмена для дальнейшего использования.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/dbt-cloud-bq-id-secret-02.png" title="Доступ к настройке BigQuery OAuth в dbt Cloud" />

### Создание клиентского ID и секрета для BigQuery OAuth 2.0
Для начала вам нужно создать клиентский ID и секрет для [аутентификации](https://cloud.google.com/bigquery/docs/authentication) с BigQuery. Этот клиентский ID и секрет будут храниться в dbt Cloud для управления OAuth-подключением между пользователями dbt Cloud и BigQuery.

В консоли BigQuery перейдите в **APIs & Services** и выберите **Credentials**:

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-nav.gif" title="Навигация в BigQuery к учетным данным" />

На странице **Credentials** вы можете увидеть свои существующие ключи, клиентские ID и учетные записи служб.

Настройте [экран согласия OAuth](https://support.google.com/cloud/answer/6158849), если вы еще этого не сделали. Затем нажмите **+ Create Credentials** в верхней части страницы и выберите **OAuth client ID**.

Заполните конфигурацию клиентского ID. **Авторизованные JavaScript Origins** не применимы. Добавьте элемент в **Авторизованные URI перенаправления** и замените `REDIRECT_URI` на значение, которое вы скопировали в буфер обмена ранее из раздела **OAuth 2.0 Settings** в dbt Cloud:

| Конфигурация                | Значение         |
| --------------------------- | ---------------- |
| **Тип приложения**          | Веб-приложение   |
| **Имя**                     | dbt Cloud        |
| **Авторизованные URI перенаправления** | `REDIRECT_URI` |

Затем нажмите **Create**, чтобы создать приложение BigQuery OAuth и увидеть значения клиентского ID и секрета приложения. Эти значения доступны даже если вы закроете экран приложения, так что это не единственный шанс их сохранить.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/bq-oauth-app-02.png" title="Создание OAuth приложения в BigQuery" />

### Настройка подключения в dbt Cloud
Теперь, когда у вас есть OAuth приложение, настроенное в BigQuery, вам нужно добавить клиентский ID и секрет в dbt Cloud. Для этого:
 - Вернитесь на страницу деталей подключения, как описано в [Найти значение перенаправления URI](#locate-the-redirect-uri-value)
 - Добавьте клиентский ID и секрет из приложения BigQuery OAuth в разделе **OAuth 2.0 Settings**

### Аутентификация в BigQuery
После того как приложение BigQuery OAuth настроено для проекта dbt Cloud, каждый пользователь dbt Cloud должен будет аутентифицироваться с BigQuery, чтобы использовать IDE. Для этого:

- Перейдите к названию вашего аккаунта, над значком вашего профиля на левой боковой панели
- Выберите **Настройки аккаунта** в меню
- На левой боковой панели выберите **Учетные данные**
- Выберите проект из списка
- Выберите **Аутентифицировать учетную запись BigQuery**

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/developer-bq-auth.gif" title="Аутентификация в BigQuery" />

Затем вы будете перенаправлены в BigQuery и вас попросят одобрить доступ к диску, облачной платформе и BigQuery, если подключение не имеет меньших привилегий.
<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/dbt-cloud-enterprise/BQ-auth/BQ-access.png" title="Запрос доступа к BigQuery" />

Выберите **Разрешить**. Это перенаправит вас обратно в dbt Cloud. Теперь вы должны быть аутентифицированным пользователем BigQuery, готовым использовать IDE dbt Cloud.

## Часто задаваемые вопросы

<FAQ path="Warehouse/bq-oauth-drive-scope" />