---
title: "Разработка с помощью ИИ"
sidebar_label: "Разработка с помощью ИИ"
description: "Используйте ИИ для разработки проектов dbt в Studio IDE"
availability: platform_usage
---

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';
import CopilotResources from '/snippets/_use-copilot-resources.md';
import WizardIde from '/snippets/_wizard-ide.md';

# Разработка с помощью ИИ в Studio IDE

<IntroText>
Используйте ИИ для разработки проектов dbt в <Constant name="studio_ide" />.
</IntroText>

[<Constant name="wizard" />](/docs/platform/wizard-platform) в [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) — это новый и рекомендуемый способ разработки проектов dbt с помощью ИИ с соблюдением правил управления данными. Он использует контекст вашего проекта, чтобы помочь вам быстрее вносить изменения в dbt с соблюдением этих правил. Представьте его как интеллектуального ИИ-агента, у которого есть карта вашего проекта: вместо того чтобы просматривать каждый файл для понимания контекста, вы можете задавать ему вопросы и с его помощью быстрее разрабатывать и проверять изменения.

dbt также поддерживает dbt Copilot — отдельный инструмент встроенной ИИ-помощи для генерации SQL, документации, тестов и семантических моделей одним нажатием в <Constant name="studio_ide" />, <Constant name="canvas" /> и <Constant name="insights" />.

## Предварительные требования

- [Аккаунт <Constant name="dbt" />](https://www.getdbt.com/signup) на любом тарифном плане и [лицензия Developer](/docs/platform/manage-access/seats-and-users).
- [Среда разработки](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) и учётные данные, настроенные в <Constant name="studio_ide" />.

Функции ИИ включены по умолчанию. Администраторы могут [выключить или снова включить их в любое время](/docs/platform/manage-dbt-ai).

## dbt Wizard в Studio IDE <Lifecycle status="preview" />

Используйте [<Constant name="wizard" />](/docs/dbt-ai/wizard-ide) для автономной генерации моделей, рефакторинга и выполнения многоэтапных рабочих процессов в <Constant name="studio_ide" />. Он опирается на [dbt Information Schema](/docs/build/dbt-information-schema) &mdash; структурированное представление зависимостей, тестов, состояния моделей и семантических определений вашего проекта &mdash; поэтому понимает не только ваш код, но и ваши данные.

<Constant name="wizard" /> доступен на боковой панели или в разделе Console в <Constant name="studio_ide" />.

<WizardIde />

## dbt Copilot в Studio IDE {#dbt-copilot-in-studio-ide}

_Предыдущая версия dbt Copilot в Studio IDE доступна только для ограниченного числа аккаунтов. dbt Wizard доступен для всех аккаунтов и является рекомендуемым способом разработки с помощью ИИ в Studio IDE &mdash; он поддерживает все возможности быстрых действий dbt Copilot, а также многоэтапные изменения со встроенной проверкой._

[dbt Copilot](/docs/dbt-ai/copilot-overview) позволяет одним нажатием генерировать SQL, документацию, тесты и семантические модели в <Constant name="studio_ide" />, <Constant name="canvas" /> и <Constant name="insights" />.

1. Перейдите в <Constant name="studio_ide" /> и выберите SQL-файл модели в **File Explorer**.
2. В разделе **Console** нажмите кнопку **dbt Copilot**, чтобы просмотреть доступные функции ИИ.
3. Выберите доступные действия для [генерации ресурсов](#generate-resources), например используйте кнопки быстрых действий для генерации документации, тестов, семантических моделей или метрик.

В следующих разделах описано, как использовать dbt Copilot в <Constant name="studio_ide" />.

### Генерация ресурсов {#generate-resources}
Чтобы сгенерировать ресурсы с помощью dbt Copilot, выполните следующие действия:

<CopilotResources />

### Редактирование SQL непосредственно в редакторе

dbt Copilot поддерживает окно быстрого ввода запроса для точечных изменений SQL непосредственно в редакторе. Нажмите **Cmd+B** (Mac) или **Ctrl+B** (Windows), чтобы открыть окно ввода запроса в файле модели, опишите, что вы хотите сгенерировать или изменить, и dbt Copilot покажет различия между текущей и предлагаемой версиями — нажмите **Accept**, чтобы применить изменения, или **Reject**, чтобы отклонить их.

Это удобно для локальных изменений в одном SQL-файле. Для более масштабных или многоэтапных изменений — например, создания новой модели, рефакторинга нескольких файлов или генерации YAML — ознакомьтесь с тем, как вместо этого может помочь [<Constant name="wizard" />](/docs/dbt-ai/wizard-ide).
