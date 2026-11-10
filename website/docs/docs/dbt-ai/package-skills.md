---
title: "Установка навыков агента из пакетов dbt"
id: "package-skills"
description: "Добавляйте навыки агента в пакет dbt и устанавливайте их с помощью dbt deps."
sidebar_label: "Навыки из пакетов"
tags: [AI]
availability:
  surface: local
  engine: v2
---

# Установка навыков агента из пакетов dbt

<IntroText>
Добавьте набор навыков в пакет dbt, и `dbt deps` установит их в каталог, из которого ваш агент для работы с кодом считывает навыки. Вся команда получает одинаковые навыки из зависимости с контролем версий вместо того, чтобы управлять ими по отдельности.
</IntroText>

Навык — это каталог с файлом `SKILL.md`, который содержит многократно используемые инструкции для вашего агента для работы с кодом в формате [Agent Skills](https://agentskills.io/specification). Любой проект dbt может включать навыки, и любой проект, который устанавливает его как пакет, может установить и его навыки.

Предположим, в вашей команде есть правила именования моделей или размещения тестов. Вы можете записать эти правила в виде навыка _один раз_, добавить их в пакет, и агент каждого участника команды получит их при следующем запуске `dbt deps`. Так все участники команды будут использовать одни и те же правила, а обновлять их потребуется только в одном месте.

Навыки агента устанавливаются локально там, где работает ваш агент для работы с кодом. Навыки устанавливаются только при настроенном `ai_provider`. Без него `dbt deps` устанавливает пакеты как обычно и не затрагивает каталоги агента.

## Настройка флага ai_provider {#set-the-ai_provider-flag}

Задайте [`ai_provider` в блоке `flags`](/reference/global-configs/about-global-configs?version=2#available-flags) корневого проекта, чтобы указать dbt, в какой каталог записывать навыки. Например, если вы используете claude в качестве поставщика ИИ, настройка будет выглядеть так:

<File name='dbt_project.yml'>

```yml
flags:
  ai_provider: claude
```

</File>

У каждого поставщика есть каталог, из которого он считывает навыки. Большинство поставщиков используют `.agents/skills`; claude считывает навыки из собственного каталога. Поддерживаются следующие поставщики:

<SimpleTable>
| Значение `ai_provider` | Каталог установки |
|---------------------|-------------|
| `wizard` | `.agents/skills` |
| `claude` | `.claude/skills` |
| `openai` | `.agents/skills` |
| `codex`  | `.agents/skills` |
| `cursor` | `.agents/skills` |
| `gemini` | `.agents/skills` |
</SimpleTable>
Значения нечувствительны к регистру, поэтому `wizard`, `Wizard` и `WIZARD` обрабатываются одинаково.

Если вы используете <Constant name="wizard" />, укажите `wizard`, даже если вы [используете собственный ключ](/docs/dbt-ai/wizard-byok) или ИИ под управлением dbt (dbt-<Term id="managed"/> AI).

Также можно указать несколько поставщиков: в этом случае одинаковые навыки будут установлены в каталог каждого поставщика:

<File name='dbt_project.yml'>

```yml
flags:
  ai_provider:
    - wizard
    - claude
```

</File>

dbt определяет значение `ai_provider` из трёх источников в следующем порядке приоритета:

1. Параметр командной строки `--ai-provider`, который принимает список значений через запятую, например `dbt deps --ai-provider claude,cursor`.
2. Переменная окружения `DBT_ENGINE_AI_PROVIDER`.
3. Блок `flags` в файле `dbt_project.yml` корневого проекта, как показано выше.

Считывается только блок `flags` корневого проекта. Установка `ai_provider` в пакете не имеет эффекта, поскольку агента для работы с кодом выбирает пользователь, а не автор пакета.

Если ваш проект или его пакеты содержат навыки, но `ai_provider` не задан, `dbt deps` завершается успешно и выводит предупреждение о том, что навыки найдены, но ни один из них не установлен. Например:

```text
[warning] [AiProviderUnset (dbt1801)]: Found 3 agent skill(s) in this project and its packages, but 'ai_provider' is not set, so none were installed. Set it in dbt_project.yml (flags: {ai_provider: claude}), via --ai-provider, or with DBT_ENGINE_AI_PROVIDER. Known providers: wizard, claude, openai, codex, cursor, gemini.
```

## Добавление навыков в пакет

Создайте отдельный каталог для каждого навыка в каталоге `skills` вашего проекта и поместите в каждый из них файл `SKILL.md`:

```text
skills/
  naming-conventions/
    SKILL.md
  add-a-data-test/
    SKILL.md
```

Чтобы хранить навыки не в `skills`, а в другом каталоге, задайте [skill-paths](/reference/project-configs/skill-paths).

Каждый файл `SKILL.md` должен содержать блок метаданных YAML с полем `name`, совпадающим с именем каталога, и полем `description`, которое сообщает агенту, когда применять навык:

<File name='skills/naming-conventions/SKILL.md'>

```markdown
---
name: naming-conventions
description: Use when creating or renaming a model, so that staging, intermediate, and mart models follow the house naming convention.
---

# Naming conventions

Apply these prefixes when adding a new model:

- Staging models use the prefix `stg_` and live in `models/staging/`.
- Intermediate models use the prefix `int_` and live in `models/intermediate/`.
- Mart models use no prefix and are named for the business concept they expose.
```

</File>

Подробнее о создании эффективных навыков см. в разделе [Формат файла навыка](/docs/dbt-ai/wizard-skills#skill-file-format).

dbt считывает файлы `SKILL.md` пакета и никогда их не изменяет. Запись выполняется только в установленную копию.

Если dbt не может прочитать `SKILL.md` — из-за отсутствия блока метаданных или несовпадения `name` с именем каталога — он выводит предупреждение и пропускает этот навык. Один некорректно оформленный навык в пакете не мешает установке остальных.

## Установка навыков

Добавьте пакет в проект так же, как любую другую зависимость:

<File name='packages.yml'>

```yaml
packages:
  - local: "../packages/demo_skills"
```

</File>

Затем запустите `dbt deps`. dbt сообщает о каждом записанном навыке:

```shell
dbt deps
```

```text
Installing packages
Installing demo_skills
 Installed demo_skills
 Installed 1 package
Installing add-a-data-test (demo_skills) -> .agents/skills
Installing naming-conventions (demo_skills) -> .agents/skills
```

Если указано несколько поставщиков, dbt записывает копию в каждый каталог:

```text
Installing add-a-data-test (demo_skills) -> .agents/skills
Installing add-a-data-test (demo_skills) -> .claude/skills
```

dbt устанавливает навыки всякий раз, когда устанавливает пакеты, поэтому `dbt build`, `dbt run` и `dbt parse` тоже устанавливают их. Запускать `dbt deps` самостоятельно не требуется.

dbt собирает навыки как из корневого проекта, так и из всех установленных пакетов, включая пакеты, установленные как транзитивные зависимости. Навыки из каталога `skills` вашего проекта устанавливаются вместе с навыками из пакетов.

При повторном запуске команды, если ничего не изменилось, dbt ничего не записывает и не выводит сообщений. dbt перезаписывает установленную копию только при изменении исходного содержимого.

## Как dbt отслеживает установленные навыки

При установке навыка dbt записывает сведения о выполненных действиях в блок метаданных установленной копии, в поле `metadata`:

<File name='.agents/skills/naming-conventions/SKILL.md'>

```markdown
---
name: naming-conventions
description: Use when creating or renaming a model, so that staging, intermediate, and mart models follow the house naming convention.
metadata:
  dbt.managed_by: dbt
  dbt.source: package
  dbt.package: demo_skills
  dbt.source_path: skills/naming-conventions
  dbt.source_hash: sha256:fbdd25363736f004d0599b754323c661ddf79d8ffb76f54c0b8c263e7bc52def
  dbt.installed_at: 2026-09-09T19:21:14.595255+00:00
---
```

</File>

Эта запись — единственный способ, которым dbt распознаёт навык как управляемый им. Из этого следуют три важных момента:

- **Навыки, написанные вами вручную, никогда не затрагиваются.** dbt перезаписывает или удаляет только те каталоги навыков, в файле `SKILL.md` которых есть `dbt.managed_by: dbt`. Ваши собственные навыки могут безопасно находиться в том же каталоге.
- **После удаления записи dbt забывает о копии.** Если удалить записи `dbt.` из установленного навыка, dbt перестанет распознавать его и больше не будет его затрагивать, в том числе при выполнении [dbt clean](/reference/commands/clean).
- **Изменения навыков перезаписываются.** dbt всегда перезаписывает каталоги навыков, в файле `SKILL.md` которых есть `dbt.managed_by: dbt`. Чтобы изменения навыка, установленного из пакета, сохранялись, удалите метаданные dbt из блока метаданных файла `SKILL.md`.

Если автор навыка добавил собственные записи в `metadata`, dbt сохраняет их и добавляет свои записи после них.

`dbt.version` содержит версию, которую dbt определил для пакета. У локальных пакетов и пакетов из tarball-архивов нет закреплённой версии, поэтому для них это поле отсутствует; при этом `dbt.source_hash` по-прежнему позволяет точно определить установленное содержимое.

## Отключение навыка {#disable-a-skill}

Используйте конфигурацию `skills` в корневом проекте, указав в качестве ключа пакет, содержащий навык:

<File name='dbt_project.yml'>

```yml
skills:
  demo_skills:
    naming-conventions:
      +enabled: false
```

</File>

Собственная конфигурация `skills` пакета задаёт значения по умолчанию для содержащихся в нём навыков, а конфигурация `skills` корневого проекта переопределяет их. Это работает так же, как [включение и отключение других ресурсов](/reference/resource-configs/enabled).

## Дополнительные примеры

Задайте `+enabled` на уровне пакета, чтобы управлять всем пакетом, или вложите его в раздел с именем навыка, чтобы управлять отдельным навыком.

Отключить все навыки из одного пакета, оставив остальные включёнными:

<File name='dbt_project.yml'>
  
```yml
skills:
  demo_skills:
    +enabled: false
```
</File>

Включить навыки только из одного пакета и отключить их во всех остальных:

<File name='dbt_project.yml'>
  
```yml
skills:
  +enabled: false
  demo_skills:
    +enabled: true
```
</File>

Включить только два навыка и отключить все остальные:

<File name='dbt_project.yml'>
  
```yml
skills:
  demo_skills:
    +enabled: false
    naming-conventions:
      +enabled: true
    adding-exposures:
      +enabled: true
```
</File>

Отключить только два навыка, оставив все остальные включёнными:

<File name='dbt_project.yml'>
  
```yml
skills:
  demo_skills:
    naming-conventions:
      +enabled: false
    adding-exposures:
      +enabled: false
```
</File>

:::caution Имена навыков должны быть уникальными
Поскольку навыки устанавливаются под собственными именами, два включённых навыка с одинаковым именем заняли бы один и тот же каталог. Вместо того чтобы выбирать один из них, dbt завершает команду с ошибкой до начала записи:

```text
Two or more agent skills are named 'naming-conventions' (this project, package
'demo_skills'), so they would install into the same directory. Skill names must
be unique across your project and its packages.
```

Решите проблему так же, как при дублировании имён моделей: отключите все навыки, кроме одного, с помощью `+enabled: false` или попросите сопровождающего пакета переименовать его навык.
:::

## Удаление установленных навыков

[dbt clean](/reference/commands/clean) удаляет навыки, установленные dbt, и оставляет всё остальное на месте:

```shell
dbt clean
```

```text
  Removing add-a-data-test -> .agents/skills
  Removing naming-conventions -> .agents/skills
```

## Связанная документация

- [Использование навыков с CLI <Constant name="wizard" />](/docs/dbt-ai/wizard-skills)
- [Пакеты](/docs/build/packages)
- [skill-paths](/reference/project-configs/skill-paths)
- [О команде dbt deps](/reference/commands/deps)
- [О команде dbt clean](/reference/commands/clean)
