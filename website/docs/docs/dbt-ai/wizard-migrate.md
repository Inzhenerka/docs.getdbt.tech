---
title: "Переход на dbt Wizard"
id: "wizard-migrate"
description: "Перенесите контекст проекта и навыки из Claude Code в dbt Wizard."
sidebar_label: "Переход на dbt Wizard"
tags: [AI, Wizard]
availability: local_all
---

<IntroText>
Перейдите с Claude Code на <Constant name="wizard" />, сохранив принятые в проекте соглашения.
</IntroText>

<Constant name="wizard" /> автоматически импортирует инструкции, навыки и настройки Claude Code из вашего репозитория. Эта страница предназначена для тех, кто уже использует Claude Code в проектах dbt и хочет перенести контекст проекта, навыки или настройки модели. Если вы только начинаете работать с ИИ-агентами, ознакомьтесь с [обзором dbt Wizard](/docs/platform/wizard-overview).

## Предварительные требования

Вам понадобятся:

- Установленный [CLI <Constant name="wizard" />](/docs/dbt-ai/wizard-cli) или включённый <Constant name="wizard" /> в [<Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [BYOK](/docs/dbt-ai/wizard-byok), настроенный для поддерживаемого в CLI провайдера (OpenAI, Anthropic, AWS Bedrock или Snowflake Cortex в предварительной версии)
- Существующие файлы Claude Code, которые вы хотите перенести, например `CLAUDE.md`, `.claude/CLAUDE.md` или `.claude/skills/`

## Проверьте контекст проекта и навыки

<Constant name="wizard" /> автоматически считывает распространённые файлы инструкций для агентов и навыки из вашего репозитория. Обычно перед началом работы с <Constant name="wizard" /> переносить существующий контекст проекта не требуется.

<SimpleTable>

| Файл или папка | Что делает Wizard | Нужен ли перенос? |
| --- | --- | --- |
| `AGENTS.override.md` в корне проекта | Сначала проверяет этот файл на наличие локальных переопределяющих инструкций. | Нет |
| `AGENTS.md` в корне проекта | Использует его как основной файл инструкций проекта. | Нет |
| `CLAUDE.md` в корне проекта | Использует его как встроенный резервный вариант при отсутствии `AGENTS.md`. | Нет |
| `.claude/CLAUDE.md` | Использует его как ещё один резервный файл инструкций. | Нет |
| `.claude/skills/NAME/SKILL.md` | Автоматически обнаруживает эти файлы как навыки. | Нет |
| Многоразовые промпты или новые навыки | Размещайте их в `.agents/skills/NAME/SKILL.md` в корне репозитория. | Да |

</SimpleTable>

<Constant name="wizard" /> также проходит по дереву каталогов от корня проекта до текущего рабочего каталога, считывает файлы инструкций на каждом уровне и объединяет их для сеанса.

Полное описание формата навыков приведено в разделе [Навыки](/docs/dbt-ai/wizard-skills).

### Преобразуйте многоразовые промпты в навыки

Используйте навыки для повторяющихся рабочих процессов или специализированных инструкций, а не для общего контекста проекта, который уже содержится в `AGENTS.md` или `CLAUDE.md`. Каждый навык уровня репозитория хранится в `.agents/skills/SKILL_NAME/SKILL.md`.

```bash
mkdir -p .agents/skills/my-team-style
touch .agents/skills/my-team-style/SKILL.md
```

Затем добавьте блок метаданных и инструкции:

```markdown
---
name: my-team-style
description: Apply team-specific dbt modeling conventions when creating, editing, refactoring, testing, or documenting models in this project.
---

# Team style

(add your reusable instructions here)
```

Сформулируйте конкретное описание в `description:`, поскольку <Constant name="wizard" /> использует его, чтобы определить, когда загружать навык.

## Настройте параметры модели

Укажите учётные данные провайдера, следуя разделу [Настройка BYOK](/docs/dbt-ai/wizard-byok).

Чтобы задать модель по умолчанию для всех сеансов, добавьте следующую строку в `~/.dbt/wizard/config.toml`:

```toml
model = "claude-sonnet-4-6"   # use a model ID from `wizard debug models`
```

Вы также можете выбрать модель в TUI с помощью `/model`, не изменяя конфигурацию и не используя флаг `--config`. Выполните `wizard --help`, чтобы увидеть все доступные флаги.

## Проверьте результат переноса

Запустите новый сеанс из корневого каталога проекта dbt:

```bash
wizard
```

Попросите <Constant name="wizard" /> выполнить задачу, для которой должен использоваться перенесённый навык, например:

```text
create a new staging model for raw_invoices
```

Если принятые в проекте соглашения не применяются, проверьте следующее:

- Общий контекст проекта находится в файле инструкций, например `AGENTS.md` или `CLAUDE.md`
- Многоразовые навыки находятся в `.agents/skills/` в корне проекта или в `~/.agents/skills/` для навыков, доступных глобально в CLI
- У навыка есть понятное описание в `description:`
- После добавления навыка вы начали новый сеанс

## Связанная документация

- [Использование dbt Wizard локально](/docs/platform/wizard-overview#get-started)
- [Навыки](/docs/dbt-ai/wizard-skills)
- [Настройка BYOK](/docs/dbt-ai/wizard-byok)
- [Сценарии использования и примеры](/docs/dbt-ai/wizard-use-cases)
- [Как использовать dbt Wizard в проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro) — рекомендуемые рабочие процессы
