---
title: О настройке dbt
id: about-platform-setup
description: "Параметры конфигурации dbt."
sidebar_label: "О настройке dbt"
pagination_next: "docs/platform/account-settings"
pagination_prev: null
availability:
  surface: platform
  access: login_required
---

<Constant name="dbt_platform" /> — самый быстрый и надёжный способ запуска заданий dbt. Платформа предлагает множество параметров, которые могут настраивать администраторы: от базовых возможностей (интеграция с платформой данных) до средств повышения безопасности (SSO) и функций для удобства работы (RBAC).

В этом разделе документации мы рассмотрим различные настройки в пользовательском интерфейсе <Constant name="dbt" />, в том числе:

- [Подключение к платформе данных](/docs/platform/connect-data-platform/about-connections)
- Настройку доступа к [GitHub](/docs/platform/git/connect-github), [GitLab](/docs/platform/git/connect-gitlab) или вашему собственному [репозиторию Git по URL](/docs/platform/git/import-a-project-by-git-url).
- [Управление пользователями и лицензиями](/docs/platform/manage-access/seats-and-users)
- [Настройку безопасного доступа](/docs/platform/manage-access/about-user-access)

Инструкции по установке инструментов разработки <Constant name="dbt" /> приведены в разделах [<Constant name="dbt" /> CLI](/docs/platform/dbt-cli-installation) и [<Constant name="studio_ide" /> (в браузере)](/docs/platform/studio-ide/develop-in-studio).

Эти настройки предназначены для администраторов <Constant name="dbt" />. Если вам нужно более подробное руководство по первоначальной настройке для конкретной платформы данных, ознакомьтесь с нашими [руководствами по быстрому старту](/guides) или воспользуйтесь [контрольным списком настройки платформы dbt](/docs/configuration-checklist). Для более углублённого изучения рекомендуем пройти курс dbt Fundamentals на нашем [сайте dbt Learn](https://learn.getdbt.com/).

## Предварительные требования

- Для настройки <Constant name="dbt" /> вам потребуется учётная запись <Constant name="dbt" /> с правами администратора. Если у вас ещё нет учётной записи <Constant name="dbt" />, [зарегистрируйтесь](https://getdbt.com) на наших серверах в Северной Америке или [свяжитесь с нами](https://getdbt.com/contact), чтобы узнать о вариантах размещения в других регионах.
- Для наиболее комфортной работы с <Constant name="dbt" /> рекомендуем использовать современные веб-браузеры, такие как Chrome, Safari, Edge и Firefox, и своевременно обновлять их.
