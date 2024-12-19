---
title: "Вывод печати"
id: "print-output"
sidebar: "Вывод печати"
---

### Подавление сообщений `print()` в stdout

По умолчанию dbt включает сообщения [`print()`](/reference/dbt-jinja-functions/print) в стандартный вывод (stdout). Вы можете использовать переменную окружения `DBT_PRINT`, чтобы предотвратить появление этих сообщений в stdout.

:::warning Устаревание синтаксиса

Исходная переменная окружения `DBT_NO_PRINT` устарела, начиная с версии dbt v1.5. Обеспечивается обратная совместимость, но она будет удалена в будущем релизе, дата которого пока не определена.

:::

Передайте флаг `--no-print` в команду `dbt run`, чтобы подавить сообщения `print()` в stdout.

```text
dbt --no-print run
```

### Ширина принтера

По умолчанию dbt будет выводить строки, дополненные до 80 символов в ширину. Вы можете изменить эту настройку, добавив следующее в ваш файл `profiles.yml`:

<File name='profiles.yml'>

```yaml
config:
  printer_width: 120
```

</File>

### Цвет печати

По умолчанию dbt будет раскрашивать вывод, который он печатает в вашем терминале. Вы можете отключить это, добавив следующее в ваш файл `profiles.yml`:

<File name='profiles.yml'>

```yaml
config:
  use_colors: False
```

</File>

```text
dbt --use-colors run
dbt --no-use-colors run
```

Вы можете установить предпочтения по цвету для файловых журналов только в `profiles.yml` или с помощью флагов `--use-colors-file / --no-use-colors-file`.

<File name='profiles.yml'>

```yaml
config:
  use_colors_file: False
```

</File>

```text
dbt --use-colors-file run
dbt --no-use-colors-file run
```