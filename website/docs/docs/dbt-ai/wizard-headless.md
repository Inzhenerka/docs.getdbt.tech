---
title: "Неинтерактивный режим"
id: "wizard-headless"
description: "Запускайте dbt Wizard в неинтерактивном режиме для скриптов, конвейеров CI и автоматизации."
sidebar_label: "Неинтерактивный режим"
tags: [AI, Wizard]
availability: local_all
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Неинтерактивный режим <Lifecycle status="beta"/>

<IntroText>
<Constant name="wizard" /> может работать без интерактивного текстового интерфейса (TUI) — это удобно для скриптов, конвейеров CI, хуков pre-commit и любых рабочих процессов, в которых нужно получить результат за один запуск без подтверждения со стороны пользователя.
</IntroText>

<WizardFeedbackCallout />

## `exec` — разовые запросы

Выполните один запрос и завершите работу:

```bash
wizard exec "list all models with no tests"
```

Передайте входные данные через stdin:

```bash
echo "which sources have stale freshness?" | wizard exec -
```

Используйте `exec` в CI, чтобы выполнять проверки качества перед переходом к следующим этапам:

```bash
# Check test coverage before merging
wizard exec "are there any models in models/marts/ with no tests?"
```

### Вывод в формате JSON

Для последующей обработки выводите структурированный поток событий в формате JSON:

```bash
wizard exec --json "summarize test coverage by schema" > coverage.json
```

Используйте JSON Schema, чтобы задать структуру ответа:

```bash
wizard exec \
  --json \
  --output-schema ./schemas/coverage-response.json \
  "summarize test coverage by schema"
```

Запишите итоговое сообщение в файл:

```bash
wizard exec \
  --output-last-message ./review-output.md \
  "review the changes in this branch for correctness"
```

## `review` — автоматическая проверка кода

Проверьте незакоммиченные изменения:

```bash
wizard review --uncommitted
```

Проверьте изменения в ветке относительно базовой ветки в CI:

```bash
wizard review --base main
```

Проверьте конкретный коммит:

```bash
wizard review --commit abc1234
```

### Пример: проверка кода в GitHub Actions

```yaml
- name: dbt Wizard review
  run: |
    wizard review \
      --base ${{ github.base_ref }} > review.md
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Разрешения в неинтерактивном режиме

В неинтерактивном режиме `exec` Wizard работает без интерактивных запросов на подтверждение. Заранее предоставьте необходимые разрешения для изолированной среды:

```bash
# Read-only analysis (default — safe for CI)
wizard exec "list models with no documentation"

# Allow file writes inside the workspace
wizard exec -s workspace-write "add not_null tests to all primary keys in staging"

# Allow shell commands like dbt compile
wizard exec -s workspace-write "compile and validate fct_orders"
```

Для задач анализа, требующих только чтения (проверки покрытия тестами, запросы для оценки влияния изменений, выявление пробелов в документации), достаточно разрешений по умолчанию. Для задач, которые записывают файлы или выполняют команды dbt, явно указывайте соответствующие флаги.

## Связанная документация

- [Справочник команд <Constant name="wizard" />](/docs/dbt-ai/wizard-cli-reference)
- [Сценарии использования и примеры](/docs/dbt-ai/wizard-use-cases)
