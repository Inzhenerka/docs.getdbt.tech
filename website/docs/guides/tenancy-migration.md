---
title: 'Миграция между типами размещения dbt platform'
id: tenancy-migration
description: "Руководство по самостоятельной миграции между типами размещения dbt platform, например с мультитенантного на однотенантное."
hoverSnippet: "Руководство по самостоятельной миграции между типами размещения dbt platform."
icon: 'guides'
hide_table_of_contents: true
tags: ['Migration', 'Tenancy', 'dbt platform']
keywords: ['tenancy migration', 'multi-tenant', 'single tenant', 'MT to ST', 'migrate tenant', 'cell-based']
level: 'Advanced'
unlisted: true
---

:::warning Требуется изменение договора
Для миграции между типами размещения необходимо изменить договор.

Перед началом процесса обязательно свяжитесь со своим менеджером по работе с клиентами, чтобы подтвердить возможность миграции, согласовать сроки и инициировать необходимые изменения договора. _Не приступайте_ к миграции, пока изменение договора не будет подтверждено.
:::

## Обзор {#overview}

В этом руководстве описана самостоятельная миграция между [типами размещения <Constant name="dbt_platform"/>](/docs/platform/about-platform/tenancy) &mdash; например, переход с мультитенантного на однотенантное размещение.

Оно предназначено для аккаунтов, сложность миграции которых команда dbt Labs оценила как низкую. Ваш контакт в dbt Labs предоставит вам временное окно для миграции &mdash; не начинайте, пока не получите его.

С помощью следующей таблицы убедитесь, что это руководство подходит для вашего аккаунта. Если хотя бы один показатель вашего аккаунта достигает порога высокой сложности, рекомендуем провести миграцию под руководством команды Professional Services.

<SimpleTable>

| Показатель | Низкая сложность (самостоятельная миграция) | Высокая сложность (миграция под руководством Professional Services) |
|--------|----------------------------|--------------------------|
| Активные задания (запускавшиеся за последние 30 дней) | Менее 10 | 10 и более |
| Проекты | Менее 3 | 3 и более |
| Среды | Менее 5 | 5 и более |
| **Дальнейшие действия** | Если все показатели соответствуют низкой сложности, следуйте этому руководству или обратитесь за помощью к [команде Professional Services по миграции](https://www.getdbt.com/services) | Если один или несколько показателей соответствуют высокой сложности, свяжитесь со своим менеджером по работе с клиентами, чтобы определить объём работ по [миграции с участием Professional Services](https://www.getdbt.com/services) |

</SimpleTable>

Следующие факторы требуют дополнительной координации независимо от размера аккаунта &mdash; сообщите о них своему менеджеру по работе с клиентами, если они применимы:

- Задания CI или задания, запускаемые через вебхуки
- SSO или подготовка учётных записей через SCIM
- Конечные точки PrivateLink
- Несколько типов подключений к хранилищам данных

### Связанная документация {#related-docs}

- [Типы размещения](/docs/platform/about-platform/tenancy)
- [Доступ, регионы и IP-адреса](/docs/platform/about-platform/access-regions-ip-addresses)

## Что не переносится автоматически {#what-doesnt-migrate-automatically}

Инструмент миграции автоматизирует перенос большей части конфигурации, но некоторые элементы необходимо настроить вручную после применения конфигурации Terraform.

**Учётные данные и секреты** &mdash; их необходимо воссоздать вручную:

- SSH-ключи и учётные данные для репозиториев
- Токены сервисных аккаунтов
- Переменные среды, содержащие секреты
- Подключения к хранилищам данных и учётные данные на уровне сред
- Профили dbt platform

**Данные проектов** &mdash; не переносятся:

- История запусков заданий, артефакты и журналы

**Управление пользователями** &mdash; требует ручной проверки:

- Пользователи должны уже существовать в целевом аккаунте
- После миграции необходимо вручную проверить разрешения
- SSO, пары ключей и учётные данные для аутентификации в хранилищах данных необходимо настроить заново

**Неподдерживаемые ресурсы:**

- Конечные точки PrivateLink требуют помощи команды инфраструктуры dbt Labs &mdash; [создайте обращение в службу поддержки](https://www.getdbt.com/support)

## Предварительные требования {#prerequisites}

Перед началом миграции убедитесь в следующем:

- Изменение договора инициировано и подтверждено вашим менеджером по работе с клиентами
- Вы получили временное окно для миграции от команды поддержки dbt Labs
- У вас есть права администратора в исходном и целевом аккаунтах <Constant name="dbt_platform"/>
- Целевой аккаунт подготовлен в новой среде
- У вас есть сервисный токен с разрешениями Account Admin в исходном аккаунте

## Этапы миграции {#migration-steps}

Для этой миграции используются два инструмента с открытым исходным кодом:

- [Инструмент миграции <Constant name="dbt_platform"/>](https://github.com/dpguthrie/dbt-cloud-migration-tool) &mdash; экспортирует конфигурацию исходного аккаунта и применяет её к целевому аккаунту через Terraform
- [dbtcloud-terraforming](https://github.com/dbt-labs/dbtcloud-terraforming) &mdash; генерирует конфигурацию Terraform HCL на основе существующего аккаунта <Constant name="dbt_platform"/>

:::info
Учётные данные, секреты и некоторые другие элементы не переносятся автоматически &mdash; запланируйте их воссоздание вручную. Полный список приведён в разделе [Что не переносится автоматически](#what-doesnt-migrate-automatically).
:::

<Tabs>
<TabItem value="mac-linux" label="Mac/Linux">

### Шаг 1. Установите необходимые компоненты {#step-1-install-prerequisites}

Вам понадобятся Python, Terraform и `dbtcloud-terraforming`. Установите их любым удобным способом &mdash; здесь в качестве примера используется Homebrew.

Создайте и активируйте виртуальное окружение Python:

```shell
python3 -m venv tf_acct_migrator_env
source tf_acct_migrator_env/bin/activate
```

Установите Terraform:

```shell
brew tap hashicorp/tap && brew install hashicorp/tap/terraform
```

Установите `dbtcloud-terraforming`:

```shell
brew install dbt-labs/dbt-cli/dbtcloud-terraforming
```

### Шаг 2. Настройте инструмент миграции {#step-2-set-up-the-migration-tool}

Клонируйте репозиторий инструмента миграции и перейдите в него:

```shell
git clone https://github.com/dpguthrie/dbt-cloud-migration-tool
cd dbt-cloud-migration-tool
```

Задайте переменные среды для исходного аккаунта <Constant name="dbt_platform"/>:

```shell
export DBT_CLOUD_HOST_URL="https://YOUR_SOURCE_REGION.getdbt.com/api"
export DBT_CLOUD_TOKEN="your_source_service_token"
export DBT_CLOUD_ACCOUNT_ID="your_source_account_id"
```

### Шаг 3. Сгенерируйте и примените конфигурацию Terraform {#step-3-generate-and-apply-terraform-configuration}

Запустите инструмент миграции, чтобы сгенерировать файл `resources.tf` с ресурсами исходного аккаунта:

```shell
sh migrate.sh
```

Скопируйте пример файла переменных и добавьте сведения о целевом аккаунте:

```shell
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your target account details
```

Примените конфигурацию к целевому аккаунту:

```shell
terraform init
terraform plan
terraform apply
```

Terraform выведет сведения о созданных ресурсах, а также предупреждения и ошибки, если они возникнут. Возможно, потребуется запустить `migrate.sh` несколько раз, чтобы охватить все необходимые типы ресурсов.

</TabItem>
<TabItem value="windows" label="Windows">

### Шаг 1. Установите необходимые компоненты {#step-1-install-prerequisites-1}

Вам понадобятся Python, Terraform и `dbtcloud-terraforming`. Установите их любым удобным способом &mdash; здесь в качестве примера используется Chocolatey.

Установите Python и Terraform:

```shell
choco install python terraform -y
```

После установки перезапустите терминал и проверьте установленные версии:

```shell
python --version
terraform --version
```

Установите `dbtcloud-terraforming`, добавив его в каталог установки Terraform. Если вы использовали Chocolatey, обычно это каталог `C:\ProgramData\chocolatey\bin`.

### Шаг 2. Настройте инструмент миграции {#step-2-set-up-the-migration-tool-1}

Следующие действия необходимо выполнять в среде bash (например, Git Bash). Клонируйте репозиторий инструмента миграции и перейдите в него:

```shell
git clone https://github.com/dpguthrie/dbt-cloud-migration-tool.git
cd dbt-cloud-migration-tool
```

### Шаг 3. Настройте и запустите миграцию {#step-3-configure-and-run-the-migration}

Задайте переменные среды для исходного аккаунта <Constant name="dbt_platform"/> (они сбрасываются при закрытии терминала):

```shell
export DBT_CLOUD_HOST_URL="https://YOUR_SOURCE_REGION.getdbt.com/api"
export DBT_CLOUD_TOKEN="your_source_service_token"
export DBT_CLOUD_ACCOUNT_ID="your_source_account_id"
```

Запустите скрипт миграции:

```shell
sh migrate.sh
```

Скопируйте пример файла переменных и добавьте сведения о целевом аккаунте:

```shell
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your target account details
```

Примените конфигурацию к целевому аккаунту:

```shell
terraform init
terraform plan
terraform apply
```

Terraform выведет сведения о созданных ресурсах, а также предупреждения и ошибки, если они возникнут. Возможно, потребуется запустить `migrate.sh` несколько раз, чтобы охватить все необходимые типы ресурсов.

</TabItem>
</Tabs>

## Контрольный список после миграции {#post-migration-checklist}

- [ ] Проверьте все подключения, разрешения и секреты в целевом аккаунте
- [ ] Запустите тестовые задания, чтобы проверить работоспособность всего процесса
- [ ] Убедитесь, что список разрешённых IP-адресов и сетевые настройки обновлены для нового тенанта
- [ ] Обновите внутренние закладки, конфигурации SSO и интеграции с API, указав URL нового аккаунта
