---
title: "Настройка Git в dbt"
description: "Узнайте о провайдерах Git, поддерживаемых в dbt"
hide_table_of_contents: true
pagination_next: "docs/cloud/git/managed-repository"
---

[Version control](/docs/cloud/git/version-control-basics) &mdash; a system that allows you and your teammates to work safely and simultaneously on a single project &mdash; is an essential part of the dbt workflow. It enables teams to collaborate effectively and maintain a history of changes to their dbt projects. 

In <Constant name="cloud" />, you can configure <Constant name="git" /> integrations to manage your dbt project code with ease. <Constant name="cloud" /> offers multiple ways to integrate with you <Constant name="git" /> provider, catering to diverse team needs and preferences. 

Whether you use a <Constant name="git" /> integration that natively connects with <Constant name="cloud" /> or prefer to work with a managed or cloned repository, <Constant name="cloud" /> supports flexible options to streamline your workflow.

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
    body="Learn which Git providers have native support for Continuous Integration workflows"
    link="/docs/deploy/continuous-integration#git-providers-who-support-ci"
    icon="dbt-bit"/>
</div>
