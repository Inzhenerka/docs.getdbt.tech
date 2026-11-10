---
title: "Пользовательские настройки"
id: "user-settings"
sidebar: "Пользовательские настройки"
description: "Настройте пользовательские параметры dbt в ~/.dbt/user_settings.yml."
---

`~/.dbt/user_settings.yml` — это файл конфигурации пользовательского уровня для личных настроек dbt. Поскольку он всегда находится в `~/.dbt/`, его настройки применяются глобально ко всем проектам на вашем компьютере независимо от того, какой проект вы запускаете и где расположен ваш `profiles.yml`.

На данный момент `user_settings.yml` в основном заполняется командой [`dbt login`](/reference/commands/login?version=2.0#dbt-login-with-dbt-state) для локальной настройки [dbt State](/docs/deploy/dbt-state-about) (`manage_state`). Со временем dbt может добавить в этот файл другие флаги пользовательского уровня.

Настройки в этом файле отделены от конфигурации уровня проекта ([`dbt_project.yml`](/reference/dbt_project.yml)) и конфигурации подключения ([`profiles.yml`](/docs/local/profiles.yml)). Используйте этот файл для настроек, относящихся к вам, а не к проекту, как альтернативу заданию переменных окружения или заполнению файла `.env`.

<File name="~/.dbt/user_settings.yml">

```yaml
flags:
  manage_state: true
```

</File>

Некоторые команды dbt автоматически записывают настройки в этот файл. Вы также можете редактировать его вручную.

При запуске [`dbt login`](/reference/commands/login?version=2.0#dbt-login-with-dbt-state) dbt записывает настройки в `user_settings.yml`:

- **Вход с помощью учётной записи <Constant name="dbt_platform" />**
  - В <Constant name="fusion_engine" /> CLI запрашивает подтверждение перед записью в `user_settings.yml`.
  - В dbt v1.13 dbt автоматически записывает `manage_state: true`. Если ранее вы задали `manage_state: false`, CLI запрашивает подтверждение перед перезаписью этого значения.
  - Настройка `manage_state: true` включает dbt State локально при каждом выполнении `dbt run` или `dbt build`.

Если в `user_settings.yml` уже задано значение, [`dbt login`](/reference/commands/login?version=2.0#dbt-login-with-dbt-state) запрашивает подтверждение перед его перезаписью.

## Приоритет настроек

`user_settings.yml` имеет самый низкий приоритет в иерархии флагов dbt. Более специфичные настройки всегда переопределяют его значения. Подробнее о приоритете флагов см. в разделе [О флагах (глобальных настройках)](/reference/global-configs/about-global-configs).

1. Параметр CLI (наивысший приоритет)
2. Переменная окружения
3. Уровень проекта (`dbt_project.yml`)
4. Уровень пользователя (`~/.dbt/user_settings.yml`) (самый низкий приоритет)

Например, если в `user_settings.yml` задано `manage_state: true`, но вы запускаете `dbt run --no-manage-state`, флаг CLI имеет приоритет, и dbt отключает dbt State для этого запуска.

## Если dbt State включён локально, но не в dbt platform

Если в `user_settings.yml` задано `manage_state: true`, но dbt State не включён в вашей учётной записи <Constant name="dbt_platform" />, dbt завершится с ошибкой при следующем выполнении `dbt run` или `dbt build`. Чтобы устранить проблему, выполните одно из следующих действий:

- [Включите dbt State в своей учётной записи <Constant name="dbt_platform" />](/docs/deploy/dbt-state-setup).
- Отключите dbt State локально, задав `manage_state: false` в `user_settings.yml`, или выполните `dbt run --no-manage-state`.
