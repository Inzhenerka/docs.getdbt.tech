---
title: "Использование навыков с dbt Wizard на dbt platform"
id: "wizard-platform-skills"
description: "Создавайте и используйте навыки, чтобы задавать dbt Wizard на dbt platform многократно используемые инструкции, учитывающие особенности проекта."
sidebar_label: "Использование навыков"
tags: [AI, Wizard]
pagination_prev: "docs/platform/wizard-home"
pagination_next: "docs/dbt-ai/wizard-platform-mcp"
availability: platform_usage
---

# Использование навыков с <Constant name="wizard" /> на <Constant name="dbt_platform" /> <Lifecycle status="beta"/>

<IntroText>
Навыки — это многократно используемые инструкции, которые помогают <Constant name="wizard" /> соблюдать принятые в вашей команде соглашения по SQL, правила именования, шаблоны моделирования и рабочие процессы без необходимости повторять их в каждом запросе.
</IntroText>

<Constant name="wizard" /> также включает встроенные навыки из [dbt Agent skills](https://github.com/dbt-labs/dbt-agent-skills), поддерживаемые dbt Labs. Они всегда доступны и не требуют настройки.

Общие сведения о контексте проекта (`AGENTS.md`, `CLAUDE.md`) см. в разделе [Переход на dbt Wizard](/docs/dbt-ai/wizard-migrate) — <Constant name="wizard" /> читает эти файлы инструкций без дополнительной настройки.

## Как работают навыки

В начале каждого сеанса <Constant name="wizard"/> ищет навыки уровня репозитория в каталоге `.agents/skills/` в корне вашего проекта dbt:

```text
.agents/
  skills/
    your-skill-name/
      SKILL.md
```

Пользовательские навыки используют формат [Agent Skills](https://agentskills.io/specification) — тот же формат, который используется в [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills) на GitHub. Файл навыка содержит блок метаданных YAML (`name`, `description`) и основную часть в формате Markdown с инструкциями.

Если пользовательский и встроенный навыки имеют одинаковое имя, приоритет имеет пользовательский навык.

## Создание навыка

В [Studio IDE](/docs/dbt-ai/wizard-ide) используйте проводник файлов, чтобы создать каталог и файл навыка:

1. Создайте папку `.agents/skills/SKILL_NAME/` в корне проекта.
2. Добавьте в неё файл `SKILL.md`. Обычно `SKILL.md` включает:
   - Блок метаданных YAML как минимум с полями `name` и `description`.
   - Основную часть в формате Markdown с разделами об условиях применения навыка, этапах рабочего процесса и соглашениях.
   - Необязательные файлы в `references/` с дополнительными сведениями, которые агент может загружать при необходимости.
3. При необходимости добавьте вспомогательные файлы в `.agents/skills/SKILL_NAME/references/` (например, `references/naming-conventions.md`), которые агент сможет читать, когда навык активен.
4. Начните новый чат с <Constant name="wizard"/> — навыки обнаруживаются в начале сеанса, поэтому изменения, внесённые во время сеанса, не будут учтены, пока вы не начнёте новый чат.

## Формат файла навыка

Файл навыка состоит из двух обязательных частей: блока метаданных YAML и основной части в формате Markdown.

- **Блок метаданных**: содержит как минимум `name` и `description`. Поле `description` особенно важно: именно по нему <Constant name="wizard"/> определяет, когда автоматически применять навык.
- **Основная часть**: разделы Markdown, объясняющие, когда использовать навык, что он делает, а также какие соглашения или ограничения следует соблюдать.
- **Справочные материалы** (необязательно): вспомогательные файлы `.md` в подпапке `references/` со сведениями, которые сделали бы `SKILL.md` слишком длинным.

### Пример файла навыка

Если вы только начинаете работать с навыками, создайте небольшой `SKILL.md`, как в примере ниже, а затем постепенно дополняйте его:

```markdown
---
name: my-team-style
description: Apply Santi Corp's modeling conventions when editing or creating dbt models. Use when the user asks for refactors, new models, or YAML in this project.
---

# My team style

## When to use

Use this skill whenever you are changing SQL or YAML under `models/` and the user did not override these rules.

## Conventions

- Staging models use prefix `stg_` and live in `models/staging/`.
- Facts and dimensions use `fct_` and `dim_` prefixes respectively.
- Document new columns in the same PR as the model change.
```

Полноценный пример для использования в реальном проекте см. в [навыке `adding-dbt-unit-test`](https://github.com/dbt-labs/dbt-agent-skills/blob/main/skills/dbt/skills/adding-dbt-unit-test/SKILL.md) от dbt.

## Использование навыка

В панели чата <Constant name="wizard"/>:

1. Отправьте агенту запрос и укажите навык по имени — например: `Use my-team-style to refactor this model and update related YAML`.
2. При необходимости используйте упоминания через `@`, чтобы напрямую указать файл навыка или вспомогательные файлы `.md`.
3. Просмотрите и подтвердите предложенные изменения в панели <Constant name="wizard"/>, как обычно.

## Встроенные навыки dbt

<Constant name="wizard"/> поставляется с навыками из [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills), поддерживаемыми dbt Labs и сообществом. Они содержат знания по аналитической инженерии для типовых рабочих процессов и все входят в комплект <Constant name="wizard"/>. Вам не нужно вызывать их напрямую: агент сам загружает навык, соответствующий вашему запросу.

Актуальный каталог см. в [репозитории dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills).

## Советы

- **Ограничивайте область применения `SKILL.md`.** Один навык должен решать одну задачу (руководство по стилю, соглашения по тестированию, процесс развёртывания). Небольшие навыки загружаются надёжнее, чем крупные монолитные.
- **Используйте `description`, чтобы управлять тем, когда <Constant name="wizard"/> активирует навык.** Точное описание («Используйте при создании или редактировании моделей в models/marts/») позволяет применять навык в подходящих случаях, а не при каждом запросе.
- **Начинайте новый сеанс после добавления или редактирования навыка.** Навыки обнаруживаются в начале сеанса — изменения, внесённые во время сеанса, не учитываются, пока вы не начнёте новый чат.
- **Совместное использование навыков между проектами пока не поддерживается.** Чтобы повторно использовать навык в другом репозитории, скопируйте файлы навыка вручную.

## Связанная документация

- [<Constant name="wizard"/> в Studio IDE](/docs/dbt-ai/wizard-ide)
- [Локальное использование навыков](/docs/dbt-ai/wizard-skills)
- [Как работает <Constant name="wizard"/>](/docs/dbt-ai/wizard-how-it-works)
