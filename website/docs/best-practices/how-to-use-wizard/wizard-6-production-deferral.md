---
title: "Разработка с использованием deferral на основе состояния production в dbt Wizard"
id: "wizard-6-production-deferral"
description: "Настройте CLI dbt Wizard для повторного использования состояния production при разработке и проверке части проекта dbt."
sidebar_label: "Разработка с deferral на основе production"
tags: [AI, Wizard]
---

<IntroText>
Настройте deferral на основе состояния production в CLI <Constant name="wizard" />, чтобы при локальной разработке повторно использовать неизменённые объекты базы данных из другого окружения. Deferral сокращает количество вышестоящих моделей, которые нужно строить при исследовании, внесении и проверке конкретного изменения.
</IntroText>

Этот рабочий процесс предназначен для CLI <Constant name="wizard" />. <Constant name="dbt_platform" /> самостоятельно управляет учётными данными и deferral в собственных интерфейсах <Constant name="wizard" />.

## Выберите, кто управляет deferral

<Constant name="wizard" /> хранит настройки deferral для каждого проекта в `~/.dbt/wizard/wizard_config.toml`. Выберите режим, соответствующий вашему текущему способу управления состоянием.

<SimpleTable>

| `mode` | Когда использовать |
|---|---|
| `wizard` | Вы хотите, чтобы <Constant name="wizard" /> создавал и обновлял снимок состояния production на основе целевого окружения из `profiles.yml`. |
| `manual` | У вас уже есть каталог с файлом `manifest.json` из production, и вы хотите указать путь к нему. |
| `fusion_cloud` | <Constant name="fusion_engine" /> и <Constant name="dbt_platform" /> управляют deferral для подключённого окружения. |
| `cloud_cli` | <Constant name="platform_cli" /> управляет учётными данными и deferral через <Constant name="dbt_platform" />. |
| `dbt_state` | Ваш рабочий процесс с dbt State или run-cache управляет deferral, поэтому <Constant name="wizard" /> не должен создавать собственный снимок состояния production. |
| `disabled` | Вы не хотите использовать deferral для этого проекта. |

</SimpleTable>

В значениях конфигурации используются символы подчёркивания. Например, используйте `dbt_state`, а не `dbt-state`.

## Поручите Wizard управление состоянием production

Используйте `mode = "wizard"`, если в вашем `profiles.yml` есть целевое окружение, на объекты которого вы хотите ссылаться через deferral.

Добавьте или обновите запись проекта, заменив путь и целевое окружение своими значениями:

<File name='~/.dbt/wizard/wizard_config.toml'>

```toml
version = 1

[projects."/Users/you/jaffle-shop"]
path = "/Users/you/jaffle-shop/.venv/bin/dbt"

[projects."/Users/you/jaffle-shop".deferral]
mode = "wizard"
target = "prod"
favor_state = true
```

</File>

При запуске <Constant name="wizard" /> выполняет разбор проекта для целевого окружения production и по умолчанию сохраняет снимок в `target/prod-state`. Срок действия снимка по умолчанию — 24 часа.

Настройте параметры обновления глобально, если вашему проекту нужны другие аргументы разбора или другое расположение снимка:

<File name='~/.dbt/wizard/wizard_config.toml'>

```toml
[global]
prod_parse_on_startup = true
prod_parse_args = ["parse", "--target", "prod"]
prod_state_ttl_hours = 12
prod_state_dir = "/Users/you/.cache/dbt/prod-state"
```

</File>

Если вы явно задаёте `global.prod_parse_args`, эти аргументы имеют приоритет над значением `deferral.target` для отдельного проекта.

## Используйте существующий каталог состояния

Используйте `mode = "manual"`, если другой процесс загружает или создаёт артефакты production:

<File name='~/.dbt/wizard/wizard_config.toml'>

```toml
[projects."/Users/you/jaffle-shop".deferral]
mode = "manual"
state = "/Users/you/dbt-state/production"
favor_state = true
```

</File>

Каталог `state` должен содержать совместимый файл `manifest.json` из production. Поддерживайте артефакты достаточно актуальными, чтобы они соответствовали коду и пакетам в вашей рабочей ветке.

## Решите, отдавать ли приоритет состоянию deferral

По умолчанию `favor_state` имеет значение `true`.

- При `favor_state = true` объекты из окружения deferral имеют приоритет при разрешении ссылок в dbt.
- При `favor_state = false` dbt использует объект, который вы уже создали в окружении разработки, и обращается к состоянию deferral для объектов, недоступных в этом окружении.

Задавайте это значение осознанно. Приоритет состояния полезен, когда вам нужна стабильная исходная версия из production. Отключение этого приоритета полезно, когда вы хотите, чтобы нижестоящие модели использовали модели, уже построенные вами в окружении разработки.

Подробнее о соответствующем поведении dbt см. в разделе [`--favor-state`](/reference/node-selection/defer#favor-state).

## Начните сеанс и проверьте план

Перезапустите `wizard` после редактирования `wizard_config.toml`, а затем используйте запрос, явно указывающий нужное окружение:

```text
I am changing fct_orders. Use the configured production deferral state for
unchanged upstream models. Before running any dbt command, show me the selector,
target, state directory, and whether favor-state will be applied.
```

Прежде чем одобрить команду, убедитесь, что:

1. Все новые или изменённые объекты создаются в целевом окружении разработки.
2. Каталог состояния указывает на нужные артефакты production.
3. Селектор ограничен ресурсами, необходимыми для задачи.
4. Поведение `--favor-state` соответствует вашему выбору.

Deferral меняет то, где dbt разрешает ссылки на ещё не построенные объекты. Он не делает production безопасным целевым окружением для записи. Проверяйте целевое окружение и команду, прежде чем одобрять любую сборку, тест или запрос.

## Устранение неполадок deferral

<SimpleTable>

| Проблема | Что проверить |
|---|---|
| <Constant name="wizard" /> неожиданно создаёт снимок состояния production | Проверьте `mode`, `target` и явно заданные значения `global.prod_parse_args`. Используйте `manual`, `dbt_state` или `disabled`, если состоянием управляет другая система. |
| Запрос обращается не к тому объекту | Проверьте `favor_state`, целевое окружение разработки и наличие объекта в этом окружении. |
| Состояние устарело | Уменьшите `prod_state_ttl_hours`, обновите артефакты, которыми управляете вручную, или удалите устаревший снимок перед началом нового сеанса. |
| dbt не может найти манифест | Убедитесь, что `state` или `prod_state_dir` указывает на каталог, содержащий `manifest.json`, а не на сам файл. |
| Для компиляции нужны флаги, специфичные для проекта | Задайте `compile_extra_args` в записи проекта. Значения проекта переопределяют глобальные аргументы компиляции. |
| <Constant name="wizard" /> использует не тот профиль | Настройте `profile_override.path`, `profile_override.profile` и `profile_override.target` для проекта. |

</SimpleTable>

## Связанная документация

- [О deferral](/reference/node-selection/defer)
- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка <Constant name="wizard" />](/docs/dbt-ai/wizard-config#deferral)
- [Как работает <Constant name="wizard" />](/docs/dbt-ai/wizard-how-it-works#deferral-and-state)
- [Проверка изменений dbt с помощью <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
