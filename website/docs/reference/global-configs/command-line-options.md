---
title: "Опции командной строки"
id: "command-line-options"
sidebar: "Опции командной строки"
---

Для единообразия флаги интерфейса командной строки (CLI) следует указывать сразу после префикса `dbt` и его подкоманд. Это относится и к «глобальным» флагам (поддерживаемым всеми командами). Полный список глобальных параметров CLI для <Constant name="core" /> или <Constant name="fusion_engine" /> (в зависимости от [выбранной версии документации](/docs/dbt-versions)) приведён в разделе [Доступные флаги](/reference/global-configs/about-global-configs#available-flags). Если флаги CLI заданы, они имеют приоритет над [переменными окружения](/reference/global-configs/environment-variable-configs) и [флагами проекта](/reference/global-configs/project-flags).

Например, вместо использования:

```bash
dbt --no-populate-cache run
```

Вы должны использовать:

```bash
dbt run --no-populate-cache
```

Исторически, передача флагов (таких как "глобальные флаги") _перед_ подкомандой является устаревшей функциональностью, которую dbt Labs может удалить в любое время. Мы не поддерживаем использование одного и того же флага до и после подкоманды.

## Использование булевых и небулевых флагов {#using-boolean-and-non-boolean-flags}

Вы можете составлять свои команды с булевыми флагами для включения или отключения или с небулевыми флагами, которые используют конкретные значения, такие как строки.

<Tabs>

<TabItem value="nonboolean" label="Небулевые конфигурации">

Используйте эту структуру небулевой конфигурации:
- Замените `<SUBCOMMAND>` на команду, к которой применяется эта конфигурация.
- `<THIS-CONFIG>` на конфигурацию, которую вы включаете или отключаете, и
- `<SETTING>` на новое значение для конфигурации.

<File name='CLI flags'>


```text

<SUBCOMMAND> --<THIS-CONFIG>=<SETTING> 

```

</File>

### Пример {#example}

<File name='CLI flags'>


```text

dbt run --printer-width=80 
dbt test --indirect-selection=eager

```

</File>

</TabItem>

<TabItem value="boolean" label="Булевые конфигурации">

Для включения или отключения булевых конфигураций:
- Используйте `<SUBCOMMAND>`, к которой применяется эта конфигурация.
- Следуйте за `--<THIS-CONFIG>`, чтобы включить, или `--no-<THIS-CONFIG>`, чтобы отключить.
- Замените `<THIS-CONFIG>` на конфигурацию, которую вы включаете или отключаете.

<File name='CLI flags'>


```text
dbt <SUBCOMMAND> --<THIS-CONFIG> 
dbt <SUBCOMMAND> --no-<THIS-CONFIG> 

```

</File>

### Пример {#example-1}

<File name='CLI flags'>


```text

dbt run --version-check
dbt run --no-version-check 

```

</File>

</TabItem>

</Tabs>

## Приоритет конфигурации {#config-precedence}

import SettingFlags from '/snippets/_setting-flags.md';

<SettingFlags />
