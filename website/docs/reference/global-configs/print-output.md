---
title: "Вывод печати"
id: "print-output"
sidebar: "Вывод печати"
---

### Подавление сообщений `print()` в stdout

По умолчанию, dbt включает сообщения [`print()`](/reference/dbt-jinja-functions/print) в стандартный вывод (stdout). Вы можете использовать переменную окружения `DBT_PRINT`, чтобы предотвратить появление этих сообщений в stdout.

:::warning Устаревание синтаксиса

Изначальная переменная окружения `DBT_NO_PRINT` устарела, начиная с версии dbt v1.5. Обратная совместимость поддерживается, но будет удалена в будущем, дата которого пока не определена.

:::

Укажите флаг `--no-print` для команды `dbt run`, чтобы подавить отображение сообщений `print()` в stdout.

```text
dbt --no-print run
```

### Ширина печати

По умолчанию, dbt выводит строки, дополненные до ширины 80 символов. Вы можете изменить эту настройку, добавив следующее в ваш файл `profiles.yml`:

<File name='profiles.yml'>

```yaml
config:
  printer_width: 120
```

</File>

### Цвет печати

По умолчанию, dbt раскрашивает вывод в вашем терминале. Вы можете отключить это, добавив следующее в ваш файл `profiles.yml`:

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

Вы можете установить предпочтения цвета только для файловых логов в `profiles.yml` или используя флаги `--use-colors-file / --no-use-colors-file`.

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