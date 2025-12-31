---
title: "Установка Fusion CLI"
sidebar_label: "Только установка Fusion CLI"
description: "Установите движок Fusion локально через интерфейс командной строки (CLI), чтобы вывести преобразование данных на новый уровень."
keywords: ["dbt Fusion engine", "Fusion", "Install Fusion", "Update Fusion", "Fusion updates" ]
id: install-fusion-cli
---

import FusionManualInstall from '/snippets/_fusion-manual-install.md';

# Установка Fusion через CLI <Lifecycle status="preview" /> {#install-fusion-from-the-cli}

Fusion можно установить из командной строки, загрузив его из нашего официального CDN (content delivery network).

<FusionManualInstall />

## Обновление Fusion {#update-fusion}

Следующая команда обновит Fusion и код адаптеров до последней версии:

```shell
dbtf system update
```

## Удаление Fusion {#uninstall-fusion}

Эта команда удалит бинарный файл Fusion из вашей системы, однако алиасы останутся там, где они были настроены (например, `~/.zshrc`):

```shell
dbtf system uninstall
```

## Установка адаптеров {#adapter-installation}

Установка Fusion автоматически включает адаптеры, перечисленные в разделе [Fusion requirements](/docs/fusion/supported-features#requirements). Поддержка дополнительных адаптеров будет добавлена позднее.

## Устранение неполадок {#troubleshooting}

Распространённые проблемы и способы их решения:

- **dbt command not found:** убедитесь, что путь установки корректно добавлен в ваш `$PATH`.
- **Version conflicts:** проверьте, что на системе не установлены (или не активны) другие версии <Constant name="core" /> или dbt CLI, которые могут конфликтовать с Fusion.
- **Installation permissions:** убедитесь, что у вашего пользователя есть необходимые права для локальной установки программного обеспечения.

## Часто задаваемые вопросы {#frequently-asked-questions}

- Можно ли вернуться к предыдущей установке dbt?

    Да. Если вы хотите протестировать Fusion, не затрагивая существующие рабочие процессы, рекомендуется изолировать установку или управлять ею с помощью отдельных окружений или виртуальных машин.

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
