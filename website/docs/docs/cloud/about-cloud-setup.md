---
title: About dbt setup
id: about-cloud-setup
description: "Configuration settings for dbt."
sidebar_label: "About dbt setup"
pagination_next: "docs/cloud/account-settings"
pagination_prev: null
---

<Constant name="dbt_platform" /> (dbt Cloud) — это самый быстрый и надёжный способ развертывания ваших dbt jobs. Он включает в себя множество настроек, которые могут конфигурироваться администраторами: от базовых и необходимых (интеграция с платформой данных) до улучшений безопасности (SSO) и функций, повышающих удобство работы (RBAC).

В этом разделе документации мы познакомим вас с различными настройками в интерфейсе <Constant name="cloud" />, включая:

- [Подключение к платформе данных](/docs/cloud/connect-data-platform/about-connections)
- Настройка доступа к [GitHub](/docs/cloud/git/connect-github), [GitLab](/docs/cloud/git/connect-gitlab) или вашему собственному [URL репозитория git](/docs/cloud/git/import-a-project-by-git-url).
- [Управление пользователями и лицензиями](/docs/cloud/manage-access/seats-and-users)
- [Настройка безопасного доступа](/docs/cloud/manage-access/about-user-access)

Инструкции по установке инструментов разработки <Constant name="cloud" /> см. в разделе [<Constant name="cloud" /> CLI](/docs/cloud/cloud-cli-installation) или [<Constant name="cloud_ide" /> (браузерная версия)](/docs/cloud/studio-ide/develop-in-studio).

Эти настройки предназначены для администраторов <Constant name="cloud" />. Если вам нужен более подробный гайд по первичной настройке для конкретных платформ данных, ознакомьтесь с нашими [quickstart‑гайдами](/guides) или следуйте [чек‑листу конфигурации платформы dbt](/docs/configuration-checklist). Если вы хотите более глубокое обучение, рекомендуем пройти курс dbt Fundamentals на нашем [сайте dbt Learn](https://learn.getdbt.com/).

## Предварительные требования

- Для настройки <Constant name="cloud" /> вам потребуется учетная запись <Constant name="cloud" /> с правами администратора. Если вам еще нужно создать учетную запись <Constant name="cloud" />, [зарегистрируйтесь сегодня](https://getdbt.com) на наших североамериканских серверах или [свяжитесь с нами](https://getdbt.com/contact) для международных вариантов.
- Для наилучшего опыта работы с <Constant name="cloud" /> рекомендуем использовать современные и актуальные веб‑браузеры, такие как Chrome, Safari, Edge и Firefox.
