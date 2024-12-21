---
title: "Опции командной строки"
id: "command-line-options"
sidebar: "Опции командной строки"
---

Для согласованности флаги интерфейса командной строки (CLI) должны следовать сразу после префикса `dbt` и его подкоманд. Это включает в себя "глобальные" флаги (поддерживаемые для всех команд). Для получения списка всех флагов CLI dbt, которые вы можете установить, обратитесь к [Доступные флаги](/reference/global-configs/about-global-configs#available-flags). При установке флаги CLI переопределяют [переменные окружения](/reference/global-configs/environment-variable-configs) и [флаги проекта](/reference/global-configs/project-flags).

Переменные окружения содержат префикс `DBT_`.

Например, вместо использования:

```bash
dbt --no-populate-cache run
```

Вы должны использовать:

```bash
dbt run --no-populate-cache
```

Исторически, передача флагов (таких как "глобальные флаги") _перед_ подкомандой является устаревшей функциональностью, которую dbt Labs может удалить в любое время. Мы не поддерживаем использование одного и того же флага до и после подкоманды.

## Использование булевых и небулевых флагов

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

### Пример

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

### Пример

<File name='CLI flags'>


```text

dbt run --version-check
dbt run --no-version-check 

```

</File>

</TabItem>

</Tabs>