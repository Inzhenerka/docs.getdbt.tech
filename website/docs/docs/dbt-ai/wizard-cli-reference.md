---
title: "Справочник команд Wizard CLI"
id: "wizard-cli-reference"
description: "Полный справочник всех подкоманд wizard и глобальных флагов."
sidebar_label: "Справочник команд"
tags: [AI, Wizard, Reference]
image: /img/docs/wizard-cli-intro.png
availability: local_all
---

import CliGenerated from './_wizard-cli-full-generated.md';


# Справочник команд <Constant name="wizard" /> <Lifecycle status="beta"/>

<IntroText>
Полный справочник всех подкоманд <code>wizard</code> и глобальных флагов.
</IntroText>


:::info Не путайте с командами dbt

Эта страница создаётся автоматически и описывает команды и флаги `wizard`. Сведения о стандартных командах для проектов dbt (`dbt run`, `dbt build`, `dbt test` и т. д.) см. в [справочнике команд dbt](/reference/dbt-commands).

Если вы обнаружите какие-либо проблемы, [сообщите о них](https://github.com/dbt-labs/docs.getdbt.com/issues), и мы с радостью поможем их решить.
:::

## Основные команды

Большинству пользователей для начала работы достаточно нескольких команд. Ознакомьтесь с таблицей ниже, а затем обратитесь к остальной части страницы или разделу [примеров](#examples) за дополнительными сведениями.

<SimpleTable>
| Я хочу... | Команда | Что она делает |
| --- | --- | --- |
| Начать интерактивный сеанс | `wizard` | Открывает интерактивный текстовый интерфейс (TUI), в котором вы общаетесь с агентом. |
| Начать сеанс с заданным запросом | `wizard "summarize what this project does"` | Открывает TUI с уже отправленным запросом. |
| Выполнить разовую задачу без TUI | `wizard exec "add tests to my staging models"` | Запускает агента один раз, выводит результат и завершает работу. Подходит для скриптов и CI. |
| Проверить мои незакоммиченные изменения | `wizard review --uncommitted` | Выполняет ревью кода для изменений, добавленных и не добавленных в индекс, а также для неотслеживаемых файлов. |
| Проверить мою ветку относительно базовой ветки | `wizard review --base main` | Выполняет ревью кода на основе различий между вашей веткой и базовой веткой. |
| Продолжить с того места, где я остановился | `wizard resume --last` | Снова открывает ваш последний сеанс с полной историей. |
| Проверить работоспособность установленного инструмента | `wizard doctor` | Выполняет диагностику установки, конфигурации, аутентификации и среды выполнения. |
| Обновиться до последней версии | `wizard update` | Обновляет Wizard до последней версии. |
| Применить последние изменения Wizard | `wizard apply TASK_ID` | Применяет последние изменения Wizard к вашему рабочему каталогу. |
| Войти в учётную запись или выйти из неё | `wizard login` / `wizard logout` | Выполняет вход в вашу учётную запись dbt или выход из неё. |
| Подключиться к серверам MCP | `wizard mcp add dbt` | Устанавливает подключения к серверам MCP. |
</SimpleTable>

<CliGenerated />

## Примеры {#examples}

Ниже приведены примеры и команды, которые могут вам пригодиться. Замените примеры запросов своими:


- **Выполнение задачи без TUI**

  Используйте `wizard exec` для разовых задач, скриптов и CI. Эта команда запускает агента, выводит результат и завершает работу.

  ```shell
  # Run a task and exit
  wizard exec "explain what the orders model does"

  # Pipe a prompt in from stdin
  echo "summarize my schema.yml files" | wizard exec -

  # Emit machine-readable output for scripting
  wizard exec --json "list my models" > result.jsonl
  ```

- **Проверка ваших изменений**

  `wizard review` выполняет ревью кода без запуска интерактивного сеанса.

  ```shell
  # Review staged, unstaged, and untracked changes
  wizard review --uncommitted

  # Review your branch against main
  wizard review --base main
  ```

- **Возобновление сеанса**

  ```shell
  # Continue your most recent session
  wizard resume --last

  # Pick from a list of past sessions
  wizard resume
  ```

- **Переопределение значения конфигурации**

  Используйте `-c`, чтобы переопределить любое значение из `~/.dbt/wizard/config.toml` для одного запуска, не редактируя файл.

  ```shell
  # Set the model for this run only
  wizard exec -c model="dbt/gpt-5.5" "your prompt"
  ```

## Связанная документация

- [Справочник слеш-команд](/docs/dbt-ai/wizard-slash-commands) — слеш-команды для интерактивного TUI
- [Режим без интерактивного интерфейса](/docs/dbt-ai/wizard-headless)
- [Справочник по конфигурации](/docs/dbt-ai/wizard-config)
- [Справочник команд dbt](/reference/dbt-commands) — `dbt run`, `dbt build` и другие команды dbt
