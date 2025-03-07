---
title: "Доступ, регионы и IP-адреса"
sidebar: "Доступ, регионы и IP-адреса"
id: "access-regions-ip-addresses"
description: "Доступные регионы и IP-адреса"
---

dbt Cloud [размещается](/docs/cloud/about-cloud/architecture) в нескольких регионах и всегда будет подключаться к вашей платформе данных или провайдеру git с указанных ниже IP-адресов. Убедитесь, что вы разрешили трафик с этих IP в вашем файрволе, и включите их в любые разрешения на базе данных.

Планы [dbt Cloud Enterprise](https://www.getdbt.com/pricing/) могут выбрать размещение своего аккаунта в любом из указанных ниже регионов. Организации **должны** выбрать один регион для каждого аккаунта dbt Cloud. Если вам нужно запускать dbt Cloud в нескольких регионах, мы рекомендуем использовать несколько аккаунтов dbt Cloud.

| Регион | Местоположение | URL доступа | IP-адреса | План разработчика | Командный план | Корпоративный план |
|--------|---------------|-------------|-----------|-------------------|---------------|-------------------|
| Северная Америка [^1] | AWS us-east-1 (Северная Вирджиния) | **Мультиарендный:** cloud.getdbt.com <br /> **На основе ячеек:** ACCOUNT_PREFIX.us1.dbt.com | 52.45.144.63 <br /> 54.81.134.249 <br />52.22.161.231 <br />52.3.77.232 <br />3.214.191.130 <br />34.233.79.135 | ✅ | ✅ | ✅ |
| Северная Америка [^1] | Azure <br /> Восток США 2 (Вирджиния) | **На основе ячеек:** ACCOUNT_PREFIX.us2.dbt.com | 20.10.67.192/26 | ❌ | ❌ | ✅ |
| EMEA [^1] | AWS eu-central-1 (Франкфурт) | emea.dbt.com | 3.123.45.39 <br /> 3.126.140.248 <br /> 3.72.153.148 | ❌ | ❌ | ✅ |
| EMEA [^1] | Azure <br /> Северная Европа (Ирландия) | **На основе ячеек:** ACCOUNT_PREFIX.eu2.dbt.com | 20.13.190.192/26 | ❌ | ❌ | ✅ |
| APAC [^1] | AWS ap-southeast-2 (Сидней) | au.dbt.com | 52.65.89.235 <br /> 3.106.40.33 <br /> 13.239.155.206 <br />| ❌ | ❌ | ✅ |
| Виртуальный частный dbt или одноарендный | Настраиваемый | Настраиваемый | Обратитесь в [поддержку](/community/resources/getting-help#dbt-cloud-support) для получения ваших IP | ❌ | ❌ | ✅ |

[^1]: Эти регионы поддерживают [мультиарендные](/docs/cloud/about-cloud/tenancy) среды развертывания, размещенные dbt Labs.

## Доступ к вашему аккаунту

Чтобы войти в dbt Cloud, используйте URL, который соответствует вашей среде. Ваш URL доступа будет зависеть от нескольких факторов, включая местоположение и аренду:
- **Мультиарендный в США:** Используйте ваш уникальный URL, который начинается с префикса вашего аккаунта, за которым следует `us1.dbt.com`. Например, `abc123.us1.dbt.com`. Вы также можете использовать `cloud.getdbt.com`, но этот URL будет удален в будущем.
    - Если вы не уверены в вашем URL доступа, перейдите на `us1.dbt.com` и введите ваши учетные данные dbt Cloud. Если вы являетесь участником одного аккаунта, вы будете авторизованы, и ваш URL будет отображен в браузере. Если вы являетесь участником нескольких аккаунтов, вам будет представлен список опций вместе с соответствующими URL для входа для каждого.

    <Lightbox src="/img/docs/dbt-cloud/find-account.png" title="Аккаунты dbt Cloud" />

- **Мультиарендный в EMEA:** Используйте `emea.dbt.com`.
- **Мультиарендный в APAC:** Используйте `au.dbt.com`.
- **Одноарендный по всему миру и VPC:** Используйте vanity URL, предоставленный во время вашей регистрации.

## Поиск ваших IP-адресов dbt Cloud

Существует два способа просмотра ваших IP-адресов dbt Cloud:
- Если в аккаунте нет проектов, создайте новый проект, и IP-адреса будут отображены во время шагов **Настройка вашей среды**.
- Если у вас есть существующий проект, перейдите в **Настройки аккаунта** и убедитесь, что вы находитесь на вкладке **Проекты**. Нажмите на имя проекта, и откроется окно **Настройки проекта**. Найдите поле **Подключение** и нажмите на имя. Прокрутите вниз до **Настройки**, и первый текстовый блок перечислит ваши IP-адреса.

### Статические IP-адреса

dbt Cloud, как и многие облачные сервисы, полагается на инфраструктуру облака AWS для операций. Хотя мы можем предложить статические URL для доступа, мы не можем предоставить список IP-адресов для настройки подключений из-за природы облачных сервисов AWS.

* Динамические IP-адреса &mdash; инфраструктура dbt Cloud использует Amazon Web Services (AWS). dbt Cloud предлагает статические URL для упрощенного доступа, но динамическая природа облачных сервисов означает, что базовые IP-адреса иногда меняются. AWS управляет диапазонами IP и может изменять их в соответствии с их операционными и безопасными потребностями.

* Использование имен хостов для постоянного доступа &mdash; Чтобы обеспечить непрерывный доступ, мы рекомендуем использовать услуги dbt Cloud с использованием имен хостов. Имена хостов предоставляют постоянную точку отсчета, независимо от любых изменений в базовых IP-адресах. Мы следуем стандартной практике, применяемой такими организациями, как Snowflake.

* Оптимизация VPN-подключений &mdash; Вы должны интегрировать прокси вместе с VPN для пользователей, которые используют VPN-подключения. Эта стратегия позволяет использовать постоянные IP-адреса для ваших подключений, обеспечивая плавный поток трафика через VPN и далее в dbt Cloud. Используя прокси и VPN, вы можете направлять трафик через VPN, а затем в dbt Cloud. Важно настроить прокси, если вам нужно интегрироваться с дополнительными сервисами.

## URL-адреса доступа к API

Аккаунты dbt Cloud с префиксами на основе ячеек имеют уникальные URL-адреса доступа для API аккаунта. Эти URL-адреса можно найти в **Настройках аккаунта** ниже панели **Информация об аккаунте**.

<Lightbox src="/img/docs/dbt-cloud/access-urls.png" title="URL-адреса доступа в настройках аккаунта" />

Эти URL-адреса уникальны для каждого аккаунта и начинаются с того же префикса, что и URL, используемый для [доступа к вашему аккаунту](#accessing-your-account). URL-адреса охватывают следующие API:

- Административный API (через URL доступа)
- JDBC API семантического слоя
- GraphQL API семантического слоя
- API обнаружения

Узнайте больше об этих функциях в нашей [документации по API](/docs/dbt-cloud-apis/overview).