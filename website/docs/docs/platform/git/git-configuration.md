---
title: "Настройка Git в dbt"
description: "Узнайте о провайдерах Git, поддерживаемых в dbt"
id: "configure-git"
hide_table_of_contents: true
pagination_next: "docs/platform/git/managed-repository"
availability:
  surface: platform
  access: login_required
---

[Контроль версий](/docs/platform/git/version-control-basics) &mdash; система, которая позволяет вам и вашим коллегам безопасно и одновременно работать над одним проектом, &mdash; неотъемлемая часть рабочего процесса dbt. Она позволяет командам эффективно сотрудничать и сохранять историю изменений в проектах dbt. 

В <Constant name="dbt" /> можно настроить интеграции с <Constant name="git" />, чтобы с удобством управлять кодом проекта dbt. <Constant name="dbt" /> предлагает несколько способов интеграции с вашим провайдером <Constant name="git" />, учитывая различные потребности и предпочтения команд. 

Независимо от того, используете ли вы интеграцию с <Constant name="git" />, которая напрямую подключается к <Constant name="dbt" />, или предпочитаете работать с управляемым либо клонированным репозиторием, <Constant name="dbt" /> предоставляет гибкие возможности для оптимизации рабочего процесса.

<div className="grid--3-col">

<Card
    title="Управляемый репозиторий"
body="Узнайте, как быстро настроить проект с управляемым репозиторием."
    link="/docs/platform/git/managed-repository"
    icon="dbt-bit"/>

<Card
    title="Клонирование Git-репозитория"
body="Узнайте, как подключиться к репозиторию Git с помощью URL-адреса Git и ключей развертывания."
    link="/docs/platform/git/import-a-project-by-git-url"
    icon="dbt-bit"/>

<Card
    title="Подключение к GitHub"
    body="Узнайте, как подключиться к GitHub с помощью встроенной интеграции dbt."
    link="/docs/platform/git/connect-github"
    icon="dbt-bit"/>

<Card
    title="Подключение к GitLab"
    body="Узнайте, как подключиться к GitLab с помощью встроенной интеграции dbt."
    link="/docs/platform/git/connect-gitlab"
    icon="dbt-bit"/>

<Card
    title="Подключение к Azure DevOps"
    body="Узнайте, как подключиться к Azure DevOps с помощью встроенной интеграции dbt. <br /><br />Доступно на тарифных планах dbt Enterprise или Enterprise+."
    link="/docs/platform/git/connect-azure-devops"
    icon="dbt-bit"/>

<Card
    title="Доступность функций CI по провайдерам Git"
    body="Узнайте, какие провайдеры Git имеют нативную поддержку рабочих процессов непрерывной интеграции"
    link="/docs/deploy/continuous-integration#availability-of-features-by-git-provider"
    icon="dbt-bit"/>
</div>
