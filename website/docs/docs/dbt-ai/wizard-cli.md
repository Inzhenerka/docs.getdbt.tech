---
title: "Обзор CLI"
id: "wizard-cli"
description: "Установка, проверка, обновление и удаление dbt Wizard CLI на локальном компьютере."
sidebar_label: "Установка и обновление"
tags: [AI, Wizard]
image: /img/docs/wizard-cli-intro.png
availability: local_all
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';
import WizardTrialBilling from '/snippets/_wizard-trial-billing.md';
import WizardVideoCourse from '/snippets/_wizard-video-course.md';

# Установка <Constant name="wizard" /> CLI <Lifecycle status="beta"/>

<IntroText>
Установите <Constant name="wizard" /> CLI через терминал для разработки данных в dbt с помощью ИИ-агента и с соблюдением правил управления данными.
</IntroText>

В этом руководстве описано, как установить, проверить, обновить и удалить <Constant name="wizard" /> CLI на локальном компьютере.

<WizardTrialBilling />

<WizardCliDbtCliSupport />

## Предварительные требования

- macOS, Windows или Linux
- Проект dbt с созданным каталогом `target/` (`dbt parse`, `dbt compile` или `dbt build`)
- Доступ к поддерживаемому провайдеру ИИ. Вы можете использовать управляемого провайдера в dbt или настроить [BYOK](/docs/dbt-ai/wizard-byok) с собственными учётными данными провайдера.

### Поддерживаемые модели ИИ

<WizardSupportedProviders defaultSurface="local" />

<NewToTerminal />

## Установка и настройка dbt Wizard CLI

<WizardCliOnboarding />

Нужно повторить настройку? Чтобы повторно пройти аутентификацию, сбросить конфигурацию проекта или снова вызвать запрос о доверии к папке, обратитесь к разделу [Повторный запуск процедур первоначальной настройки](/docs/dbt-ai/wizard-config#re-trigger-onboarding-flows).


## Обновление

Выполните следующую команду, чтобы обновить <Constant name="wizard" /> до последней версии:

```bash
wizard update
```
<WizardVideoCourse />

## Удаление {#uninstall}

1. Выполните встроенную команду удаления. Она выводит список всех двоичных файлов, конфигураций и каталогов данных, которые будут удалены, а затем запрашивает подтверждение (`Proceed? [Y/N]`), прежде чем что-либо удалять:

    ```shell
    wizard system uninstall
    ```

При удалении `~/.dbt/wizard` удаляются локальная конфигурация, журналы и кеш. Это действие нельзя отменить. Ваши профили dbt (`~/.dbt/`) и проекты dbt не относятся к <Constant name="wizard" /> и не будут затронуты.


2. Убедитесь, что исполняемый файл удалён, проверив его наличие в системном пути поиска:

    ```bash
    which wizard
    ```

Если команда не возвращает путь, <Constant name="wizard" /> успешно удалён.


## Телеметрия

<Constant name="wizard" /> собирает анонимную телеметрию об использовании продукта, чтобы улучшать работу с ИИ-агентом, анализировать сценарии использования, оптимизировать производительность и учитывать затраты на вычисления, не собирая ваш код, запросы, промпты, ответы или содержимое файлов.

Подробную информацию о том, какие данные собираются, какие не собираются и как отказаться от отправки клиентской телеметрии, см. в разделе [Использование данных и телеметрия <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-telemetry).

:::tip Рекомендации по использованию dbt Wizard
После завершения настройки обратитесь к разделу [Как использовать dbt Wizard в вашем проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro), чтобы ознакомиться с рекомендуемыми рабочими процессами для реальных задач проекта.
:::

## Связанная документация

- [Обзор <Constant name="wizard" />](/docs/platform/wizard-overview): где доступен <Constant name="wizard" /> и как начать работу
- [Настройка BYOK](/docs/dbt-ai/wizard-byok): управление API-ключом и выбор модели ИИ
- [Справочник команд](/docs/dbt-ai/wizard-cli-reference): полный справочник всех подкоманд `wizard` и глобальных флагов
- [Сценарии использования и примеры](/docs/dbt-ai/wizard-use-cases): практические сценарии аналитической инженерии
- [Переход с другого ИИ-агента](/docs/dbt-ai/wizard-migrate): переход с другого ИИ-агента на <Constant name="wizard" />
- [Использование данных и телеметрия CLI](/docs/dbt-ai/wizard-telemetry): какие данные собирает <Constant name="wizard" /> CLI и как отказаться от их отправки
- [Как использовать dbt Wizard в вашем проекте dbt](/best-practices/how-to-use-wizard/wizard-1-intro): рекомендуемые рабочие процессы
