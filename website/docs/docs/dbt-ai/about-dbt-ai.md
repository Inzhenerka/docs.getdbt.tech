---
title: "Об ИИ и dbt"
id: "about-dbt-ai"
description: "Узнайте о функциях и агентах на базе ИИ в dbt, которые помогают создавать, управлять и использовать данные с централизованным управлением в любом масштабе."
sidebar_label: "Об ИИ и dbt"
hide_table_of_contents: true
tags: [AI, Intelligence]
availability: all_users
---

<IntroText>
Аналитическая инженерия требует не только генерации кода &mdash; необходимо понимать свои данные, связи между ними и то, что может сломаться при изменениях. dbt встраивает в этот рабочий процесс специализированный ИИ, который опирается на граф зависимостей, тесты, контракты и определения метрик вашего проекта.
</IntroText>

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

<CopilotWizardDifferences/>

## Знакомство с dbt Wizard и ИИ

<div style={{maxWidth: '1200px'}} className="grid--3-col">

<Card
    title="О dbt Wizard"
    body="Специализированный ИИ для разработки данных с централизованным управлением в dbt platform, Desktop и CLI."
    link="/docs/platform/wizard-overview"
    icon="wizard"/>    

<Card
    title="Использование dbt Wizard локально"
    body="Установите dbt Wizard локально и начните сеанс в терминале."
    link="/docs/platform/wizard-overview#get-started"
    icon="wizard"/>

<Card
    title="dbt Wizard в dbt platform"
    body="ИИ включён по умолчанию в вашей учётной записи dbt platform. Используйте dbt Wizard для разработки данных в dbt с централизованным управлением, а dbt Copilot — для встроенной помощи ИИ."
    link="/docs/platform/wizard-platform"
    icon="wizard"/>

<Card
    title="Wizard Desktop"
    body="Нативное приложение для разработчиков данных и аналитиков. Просматривайте наглядные визуализации данных, различия в данных, граф зависимостей и многое другое, чтобы получать результаты быстрее, чем когда-либо."
    link="/docs/dbt-ai/wizard-desktop"
    icon="wizard"/>


<Card
    title="Переход на dbt Wizard"
    body="Перейдите с Claude Code, Cursor или другого ИИ-агента на dbt Wizard CLI со встроенной поддержкой контекста проекта."
    link="/docs/dbt-ai/wizard-migrate"
    icon="wizard"/>

</div>

## Знакомство с dbt Copilot

<div style={{maxWidth: '1200px'}} className="grid--2-col">

<Card
    title="dbt Copilot"
    body="Встроенный ИИ-помощник dbt для генерации SQL, документации, тестов и семантических моделей одним нажатием."
    link="/docs/dbt-ai/copilot-overview"
    icon="dbt-copilot"/>

<Card
    title="dbt Copilot в Insights"
    body="Общайтесь со своими данными с помощью dbt Copilot в Insights на базе Semantic Layer."
    link="/docs/dbt-ai/analyst-agent"
    icon="dbt-copilot"/>

</div>

## Знакомство с MCP-сервером dbt

<div style={{maxWidth: '1200px'}} className="grid--2-col">

<Card
    title="MCP-сервер dbt"
    body="Передавайте структурированный контекст dbt в любой ИИ-инструмент, совместимый с MCP."
    link="/docs/dbt-ai/about-mcp"
    icon="integration"/>

</div>
