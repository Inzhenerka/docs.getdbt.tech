---
title: "О команде dbt deps"
sidebar_label: "deps"
id: "deps"
---

`dbt deps` загружает самую последнюю версию зависимостей, перечисленных в вашем файле `packages.yml`, из git. Для получения дополнительной информации см. [Управление пакетами](/docs/build/packages).

Где это уместно, dbt будет отображать актуальные и/или последние версии пакетов, которые перечислены на dbt Hub. Пример ниже.

> Это НЕ относится к пакетам, которые устанавливаются через git/локально

```yaml
packages:
  - package: dbt-labs/dbt_utils
    version: 0.7.1
  - package: brooklyn-data/dbt_artifacts
    version: 1.2.0
    install-prerelease: true
  - package: dbt-labs/codegen
    version: 0.4.0
  - package: calogica/dbt_expectations
    version: 0.4.1
  - git: https://github.com/dbt-labs/dbt-audit-helper.git
    revision: 0.4.0
  - git: "https://github.com/dbt-labs/dbt-labs-experimental-features" # URL git
    subdirectory: "materialized-views" # имя подкаталога, содержащего `dbt_project.yml`
    revision: 0.0.1
  - package: dbt-labs/snowplow
    version: 0.13.0
```

```txt
Installing dbt-labs/dbt_utils@0.7.1
  Installed from version 0.7.1
  Up to date!
Installing brooklyn-data/dbt_artifacts@1.2.0
  Installed from version 1.2.0
Installing dbt-labs/codegen@0.4.0
  Installed from version 0.4.0
  Up to date!
Installing calogica/dbt_expectations@0.4.1
  Installed from version 0.4.1
  Up to date!
Installing https://github.com/dbt-labs/dbt-audit-helper.git@0.4.0
  Installed from revision 0.4.0
Installing https://github.com/dbt-labs/dbt-labs-experimental-features@0.0.1
  Installed from revision 0.0.1
   and subdirectory materialized-views
Installing dbt-labs/snowplow@0.13.0
  Installed from version 0.13.0
  Updated version available: 0.13.1
Installing calogica/dbt_date@0.4.0
  Installed from version 0.4.0
  Up to date!

Updates available for packages: ['tailsdotcom/dbt_artifacts', 'dbt-labs/snowplow']
Update your versions in packages.yml, then run dbt deps
```

## Предсказуемая установка пакетов

Начиная с dbt v1.7, dbt генерирует файл `package-lock.yml` в корне вашего проекта. Этот файл обеспечивает согласованную и предсказуемую установку пакетов, сохраняя точные версии (включая SHA коммитов) всех разрешенных пакетов, указанных в вашем `packages.yml` или `dependencies.yml`. Эта согласованность важна для поддержания стабильности в средах разработки и производства, предотвращая неожиданные проблемы из-за новых релизов с потенциальными ошибками.

Когда вы запускаете `dbt deps`, dbt устанавливает пакеты на основе зафиксированных версий в `package-lock.yml`. Чтобы обновить эти зафиксированные версии, вы должны явно запустить `dbt deps --upgrade` и зафиксировать обновленный файл `package-lock.yml`. Хранение этого файла в системе контроля версий гарантирует согласованность во всех средах и для всех разработчиков.

### Управление `package-lock.yml`

Файл `package-lock.yml` должен быть изначально зафиксирован в Git и обновляться только тогда, когда вы намерены изменить версии или удалить пакет. Например, запустите `dbt deps --upgrade`, чтобы получить обновленные версии пакетов, или `dbt deps --lock`, чтобы обновить файл блокировки на основе изменений в конфигурации пакетов без установки пакетов.

Чтобы полностью обойти использование `package-lock.yml`, вы можете добавить его в `.gitignore` вашего проекта. Однако этот подход жертвует предсказуемостью сборок. Если вы выберете этот путь, мы настоятельно рекомендуем добавлять фиксацию версий для сторонних пакетов в вашу конфигурацию `packages`.

### Обнаружение изменений в конфигурации `packages`

Файл `package-lock.yml` включает `sha1_hash` вашей конфигурации пакетов. Если вы обновите `packages.yml`, dbt обнаружит изменение и повторно выполнит разрешение зависимостей при следующем запуске команды `dbt deps`. Чтобы обновить файл блокировки без установки новых пакетов, используйте флаг `--lock`:

```shell
dbt deps --lock
```

### Принудительное обновление пакетов

Чтобы обновить все пакеты, даже если `packages.yml` не изменился, используйте флаг `--upgrade`:

```shell
dbt deps --upgrade
```

Это особенно полезно для получения последних коммитов из ветки `main` внутренне поддерживаемого Git-пакета.

:::warning
Принудительное обновление пакетов может привести к несогласованности сборок, если не управлять этим осторожно.
:::

### Добавление конкретных пакетов

Команда `dbt deps` может добавлять или обновлять конфигурации пакетов напрямую, избавляя вас от необходимости запоминать точный синтаксис.

#### Пакеты из Hub (по умолчанию)

Пакеты из Hub являются пакетами по умолчанию и их проще всего установить.

```shell
dbt deps --add-package dbt-labs/dbt_utils@1.0.0

# с диапазоном семантических версий
dbt deps --add-package dbt-labs/snowplow@">=0.7.0,<0.8.0"
```

#### Не Hub пакеты

Используйте флаг `--source`, чтобы указать тип пакета для установки:

```shell
# Git пакет
dbt deps --add-package https://github.com/fivetran/dbt_amplitude@v0.3.0 --source git

# Локальный пакет
dbt deps --add-package /opt/dbt/redshift --source local
```