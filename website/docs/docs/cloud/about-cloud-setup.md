---
title: О настройке dbt Cloud
id: about-cloud-setup
description: "Настройки конфигурации для dbt Cloud."
sidebar_label: "О настройке dbt Cloud"
pagination_next: "docs/dbt-cloud-environments"
pagination_prev: null
---

dbt Cloud — это самый быстрый и надежный способ развертывания ваших dbt задач. Он содержит множество настроек, которые могут быть сконфигурированы администраторами, начиная от необходимых (интеграция с платформой данных) и заканчивая улучшениями безопасности (SSO) и функциями для удобства (RBAC).

Эта часть нашей документации проведет вас через различные настройки в интерфейсе dbt Cloud, включая:

- [Подключение к платформе данных](/docs/cloud/connect-data-platform/about-connections)
- Настройка доступа к [GitHub](/docs/cloud/git/connect-github), [GitLab](/docs/cloud/git/connect-gitlab) или вашему собственному [URL репозитория git](/docs/cloud/git/import-a-project-by-git-url).
- [Управление пользователями и лицензиями](/docs/cloud/manage-access/seats-and-users)
- [Настройка безопасного доступа](/docs/cloud/manage-access/about-user-access)

Для шагов по установке инструментов разработки dbt Cloud обратитесь к [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) или [dbt Cloud IDE (на основе браузера)](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).

Эти настройки предназначены для администраторов dbt Cloud. Если вам нужен более подробный гид по первичной настройке для конкретных платформ данных, ознакомьтесь с нашими [руководствами по быстрому старту](/guides). Если вы хотите более углубленное обучение, мы рекомендуем пройти курс dbt Fundamentals на нашем [сайте dbt Learn](https://learn.getdbt.com/).

## Предварительные требования

- Чтобы настроить dbt Cloud, вам потребуется учетная запись dbt Cloud с правами администратора. Если у вас еще нет учетной записи dbt Cloud, [зарегистрируйтесь сегодня](https://getdbt.com) на наших североамериканских серверах или [свяжитесь с нами](https://getdbt.com/contact) для международных вариантов.
- Для наилучшего опыта использования dbt Cloud мы рекомендуем использовать современные и обновленные веб-браузеры, такие как Chrome, Safari, Edge и Firefox.