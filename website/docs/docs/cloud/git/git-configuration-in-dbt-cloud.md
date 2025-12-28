---
title: "Настройка Git в dbt"
description: "Узнайте о провайдерах Git, поддерживаемых в dbt"
hide_table_of_contents: true
pagination_next: "docs/cloud/git/managed-repository"
---

[Контроль версий](/docs/cloud/git/version-control-basics) &mdash; система, которая позволяет вам и вашим коллегам безопасно и одновременно работать над одним проектом &mdash; является неотъемлемой частью рабочего процесса dbt. Она позволяет командам эффективно сотрудничать и поддерживать историю изменений в их проектах dbt. 

В <Constant name="cloud" />, вы можете настраивать интеграции <Constant name="git" />, чтобы с легкостью управлять кодом вашего проекта dbt. <Constant name="cloud" /> предлагает несколько способов интеграции с вашим провайдером <Constant name="git" />, удовлетворяя разнообразные потребности и предпочтения команд. 

Независимо от того, используете ли вы интеграцию <Constant name="git" />, которая нативно подключается к <Constant name="cloud" />, или предпочитаете работать с управляемым или клонированным репозиторием, <Constant name="cloud" /> поддерживает гибкие варианты для упрощения вашего рабочего процесса.

<div className="grid--3-col">

<Card
    title="Managed repository"
    body="Узнайте, как быстро настроить проект с управляемым репозиторием."
    link="/docs/cloud/git/managed-repository"
    icon="dbt-bit"/>

<Card
    title="Git clone"
    body="Узнайте, как подключиться к git‑репозиторию с помощью git URL и deploy‑keys."
    link="/docs/cloud/git/import-a-project-by-git-url"
    icon="dbt-bit"/>

<Card
    title="Подключение к GitHub"
    body="Узнайте, как подключиться к GitHub с помощью встроенной интеграции dbt."
    link="/docs/cloud/git/connect-github"
    icon="dbt-bit"/>

<Card
    title="Подключение к GitLab"
    body="Узнайте, как подключиться к GitLab с помощью нативной интеграции dbt."
    link="/docs/cloud/git/connect-gitlab"
    icon="dbt-bit"/>

<Card
    title="Подключение к Azure DevOps"
    body="Узнайте, как подключиться к Azure DevOps с помощью нативной интеграции dbt. <br /><br />Доступно в тарифных планах dbt Enterprise или Enterprise+."
    link="/docs/cloud/git/connect-azure-devops"
    icon="dbt-bit"/>

<Card
    title="Availability of CI features by Git provider"
    body="Узнайте, какие провайдеры Git имеют нативную поддержку рабочих процессов непрерывной интеграции"
    link="/docs/deploy/continuous-integration#git-providers-who-support-ci"
    icon="dbt-bit"/>
</div>
