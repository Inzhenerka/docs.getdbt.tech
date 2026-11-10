---
title: "О команде dbt snapshot"
sidebar_label: "snapshot"
id: "snapshot"
---

Команда `dbt snapshot` выполняет [снимки](/docs/build/snapshots), определённые в вашем проекте. Снимки фиксируют изменения исходных данных с течением времени, реализуя [медленно изменяющиеся измерения типа 2](https://en.wikipedia.org/wiki/Slowly_changing_dimension#Type_2:_add_new_row). Запускайте `dbt snapshot` по расписанию (например, ежедневно), чтобы фиксировать изменения в исходных таблицах.

Определяйте снимки в YAML, указывая стратегию и `unique_key`; подробности настройки см. в разделе [Конфигурации снимков](/reference/snapshot-configs). Вы также можете запускать снимки в составе [dbt build](/reference/commands/build).

dbt ищет снимки в каталогах, перечисленных в `snapshot-paths` в файле `dbt_project.yml`. По умолчанию dbt использует каталог `snapshots/`. Если вы храните снимки в нескольких папках, можно указать несколько путей.

## Использование

Чтобы просмотреть полный список поддерживаемых параметров в терминале, выполните:

```shell
dbt snapshot --help
```
Флаги `--select` и `--exclude` определяют, какие снимки выполнить. См. [Синтаксис выбора узлов](/reference/node-selection/syntax). Команда `dbt snapshot` также принимает общие параметры, например `--target` и `--threads`. Подробности, включая настройки журналов, приведены в разделе [Глобальные флаги](/reference/global-configs/about-global-configs).

Используйте `--vars`, если SQL-код вашего снимка обращается к значениям с помощью функции `var()`. Синтаксис, правила приоритета и дополнительные примеры приведены в разделе [Определение переменных в командной строке](/docs/build/project-variables#defining-variables-on-the-command-line).

```shell
dbt snapshot --select my_snapshot --vars '{"cutoff_date": "2026-01-01"}'
```

import SnapshotCompiledSql from '/snippets/_snapshot-compiled-sql.md';
import SnapshotFullRefresh from '/snippets/_snapshot-full-refresh.md';

<SnapshotFullRefresh />

<SnapshotCompiledSql />
