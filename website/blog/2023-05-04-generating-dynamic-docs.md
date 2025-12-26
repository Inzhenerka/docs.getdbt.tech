---
title: "Ускорьте работу с документацией: Генерация документации для целых папок сразу"
description: "Для колонок, которые используются в разных моделях, Микаэль рассказывает о методе DRY, чтобы упростить документацию, используя пакет dbt Codegen и блоки docs."
slug: generating-dynamic-docs-dbt

authors: [mikael_thorup]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2023-05-17
is_featured: true
---

В [Lunar](https://www.lunar.app/) большинство наших dbt моделей берут данные из событийно-ориентированной архитектуры. Например, у нас есть следующие модели для папки `activity_based_interest` в нашем слое загрузки:

- `activity_based_interest_activated.sql`
- `activity_based_interest_deactivated.sql`
- `activity_based_interest_updated.sql`
- `downgrade_interest_level_for_user.sql`
- `set_inactive_interest_rate_after_july_1st_in_bec_for_user.sql`
- `set_inactive_interest_rate_from_july_1st_in_bec_for_user.sql`
- `set_interest_levels_from_june_1st_in_bec_for_user.sql`

Это приводит к тому, что многие одинаковые колонки (например, `account_id`) существуют в разных моделях, в разных слоях. Это означает, что я в итоге:

1. Пишу/копирую одну и ту же документацию снова и снова
1. На полпути понимаю, что могу улучшить формулировку, чтобы сделать ее более понятной, и возвращаюсь, чтобы обновить файлы `.yml`, которые уже сделал
1. Понимаю, что сделал синтаксическую ошибку в своем файле `.yml`, поэтому возвращаюсь и исправляю ее
1. Понимаю, что колонки определены по-разному с использованием разных формулировок в других папках нашего проекта dbt
1. Переосмысливаю свой выбор карьеры и молюсь, чтобы большая языковая модель украла мою работу
1. Задумываюсь, есть ли лучший способ генерировать документацию, используемую в разных моделях

<!--truncate-->

На самом деле, я нашел лучший способ, используя некоторые команды CLI, пакет dbt Codegen и блоки docs. Я также сделал следующий мем в канале #memes-and-off-topic-chatter в [dbt Community Slack](https://www.getdbt.com/community/join-the-community/), чтобы охарактеризовать этот метод:

<Lightbox src="/img/blog/2023-05-04-generating-dynamic-docs/1.png" title="Мем о написании документации" />

## Какую проблему решает этот метод?

Если вам нужно документировать одну и ту же колонку несколько раз, этот метод ограничивает ручные ошибки, ускоряет написание и поддержку документации, а также улучшает ее согласованность. **Этот метод документации экономит мне 50-80% времени, которое я ранее тратил на документацию, делая процесс документации в dbt более <Term id="dry" /> и автоматизированным.**

## Чему вы научитесь после прочтения этой статьи?

Вы не только научитесь работать с документацией dbt более простым способом, но и станете более знакомыми с [пакетом dbt Codegen](https://hub.getdbt.com/dbt-labs/codegen/latest/), блоками docs, регулярными выражениями и командами терминала.

:::note
Обратите внимание, что это решение было протестировано на Mac/VS Code, и поведение регулярных выражений может варьироваться в зависимости от стека.
:::

## Предварительные требования

- Опыт написания документации dbt вручную
- Установка dbt, пакета dbt Codegen и VS Code
- Папка в вашем проекте dbt, в которой много недокументированных моделей dbt, где много имен колонок пересекаются между моделями

## Исследование

В этой статье мы используем текущую задачу, в которой я сопоставил следующие события, связанные с процентными ставками:

```
models/core/activity_based_interest
├── events
│   ├── activity_based_interest_activated.sql
│   ├── activity_based_interest_deactivated.sql
│   ├── activity_based_interest_updated.sql
│   ├── downgrade_interest_level_for_user.sql
│   ├── set_inactive_interest_rate_after_july_1st_in_bec_for_user.sql
│   ├── set_inactive_interest_rate_from_july_1st_in_bec_for_user.sql
│   └── set_interest_levels_from_june_1st_in_bec_for_user.sql
└── models
    └── f_activity_based_interest.sql
```

## Генерация `.yml` с помощью пакета Codegen

[Пакет dbt Codegen](https://github.com/dbt-labs/dbt-codegen) генерирует код dbt и выводит его в командную строку, чтобы вы могли скопировать и вставить его в свой проект dbt. Вместо того чтобы вручную писать содержимое файлов `.yml`, вы можете использовать макрос `generate_model_yaml`, который запрашивает базу данных для сбора имен таблиц и колонок и выводит это в формате, готовом для копирования и вставки в файл `.yml`.

Этот макрос позволяет выполнять команды, такие как:

```
dbt run-operation generate_model_yaml --args '{"model_names": ["your_model_name",], "upstream_descriptions": true}'
```

Аргументы, согласно документации Codegen:  
- `model_names` (обязательный): Модель(и), для которых вы хотите сгенерировать YAML.  
- `upstream_descriptions` (необязательный, `default=False`): Хотите ли вы включить описания для идентичных имен колонок из вышестоящих моделей.

Этот макрос генерирует YAML для списка моделей, который вы затем можете вставить в файл `schema.yml`, например:

```
$ dbt run-operation generate_model_yaml --args '{"model_names": [ "activity_based_interest_activated"] }'
```

выводит:
```
13:09:42  Running with dbt=1.3.1
13:09:45  version: 2

models:
  - name: activity_based_interest_activated
    description: ""
    columns:
      - name: id
        description: ""

      - name: user_id
        description: ""

      - name: start_date
        description: ""

      - name: end_date
        description: ""

      - name: tier_threshold_amount
        description: ""

      - name: tier_interest_percentage
        description: ""

      - name: event_time
        description: ""

      - name: event_day
        description: ""
```

Все от `version: 2` и далее можно скопировать и вставить в ваш файл `.yml`, и вот так вы сэкономили много времени на написание структуры вручную (*и неизбежно забыв где-то ", ', или сделав случайную ошибку с отступами...*).

### Генерация `.yml` для нескольких моделей сразу

Для внимательного наблюдателя, `model_names` принимает несколько моделей, чем мы можем воспользоваться. Таким образом, нам не нужно запускать этот инструмент один раз на модель. Вместо этого мы можем запустить:

```
$ dbt run-operation generate_model_yaml --args '{"model_names": [ "activity_based_interest_activated", "activity_based_interest_deactivated", "activity_based_interest_updated", "downgrade_interest_level_for_user", "f_activity_based_interest", "set_inactive_interest_rate_after_july_1st_in_bec_for_user", "set_inactive_interest_rate_from_july_1st_in_bec_for_user", "set_interest_levels_from_june_1st_in_bec_for_user"] }'
```

Это возвращает один файл `.yml`, содержащий документацию для всех моделей, аналогично выше. Вот подмножество результирующего набора:

```
13:16:21  Running with dbt=1.3.1
13:16:27  version: 2

models:
  - name: activity_based_interest_activated
    description: ""
    columns:
      - name: id
        description: ""

      - name: user_id
        description: ""

... (усечено для примера)

  - name: set_inactive_interest_rate_after_july_1st_in_bec_for_user
    description: ""
    columns:
      - name: id
        description: ""

      - name: user_id
        description: ""

      - name: start_date
        description: ""

      - name: event_time
        description: ""

      - name: event_day
        description: ""

  - name: set_inactive_interest_rate_from_july_1st_in_bec_for_user
    description: ""
    columns:
      - name: id
        description: ""

      - name: user_id
        description: ""

      - name: event_time
        description: ""

      - name: event_day
        description: ""
```

### Получение имен моделей программно

Чтобы не писать вручную все имена моделей, мы можем программно собрать имена соответствующих моделей:

```
$ dbt ls -m models/core/activity_based_interest --output name | xargs -I{} echo -n ' "{}",'
 "activity_based_interest_activated", "activity_based_interest_deactivated", "activity_based_interest_updated", "downgrade_interest_level_for_user", "f_activity_based_interest", "set_inactive_interest_rate_after_july_1st_in_bec_for_user", "set_inactive_interest_rate_from_july_1st_in_bec_for_user", "set_interest_levels_from_june_1st_in_bec_for_user",%
 ```

1. `dbt ls -m models/core/activity_based_interest`: Эта команда перечисляет все модели dbt в каталоге models/core/activity_based_interest.
1. `--output name`: Эта опция фильтрует вывод, чтобы показывать только имя каждой модели, а не контекст + имя модели.
1. `| xargs -I{} echo -n ' "{}",'`: Этот пайп отправляет вывод предыдущей команды в `xargs`, который выполняет команду echo для каждой строки вывода. 
    - `-I{}` указывает, что `{}` должно быть заменено на имя модели
    - Команда `echo` затем форматирует имя модели, оборачивая его в двойные кавычки и добавляя запятую и пробел: `"model", "name",` 
    - Опция `-n` для `echo` удаляет завершающий символ новой строки

Вывод (⚠️ за исключением последних двух символов `,%` ) затем можно скопировать и вставить в следующее:

```
dbt run-operation generate_model_yaml --args '{"model_names": [ReplaceWithYourOutputFromPreviousCommand]}'
```

Что, в свою очередь, можно скопировать и вставить в новый файл `.yml`. В нашем примере мы записываем его в `_activity_based_interest.yml`.

## Создание блоков docs для новых колонок

[Блоки docs](https://docs.getdbt.com/docs/build/documentation#using-docs-blocks) могут быть использованы для написания более DRY и надежной документации. Чтобы использовать блоки docs, обновите структуру папок, чтобы она содержала файл `.md`. Ваша структура файлов теперь должна выглядеть следующим образом:

```
models/core/activity_based_interest
├── _activity_based_interest_docs.md --Новый markdown файл блока docs
├── _activity_based_interest_docs.yml
├── events
│   ├── activity_based_interest_activated.sql
│   ├── activity_based_interest_deactivated.sql
│   ├── activity_based_interest_updated.sql
│   ├── downgrade_interest_level_for_user.sql
│   ├── set_inactive_interest_rate_after_july_1st_in_bec_for_user.sql
│   ├── set_inactive_interest_rate_from_july_1st_in_bec_for_user.sql
│   └── set_interest_levels_from_june_1st_in_bec_for_user.sql
└── models
    └── f_activity_based_interest.sql
```

```
$ cat models/core/activity_based_interest/_activity_based_interest_docs.md
{% docs activity_based_interest__id %}  

Первичный ключ таблицы. См. SQL для определения ключа.

{% enddocs %}

{% docs activity_based_interest__user_id %}  

Внутренний идентификатор компании для данного пользователя.

{% enddocs %}
```

```
$ cat models/core/activity_based_interest/_activity_based_interest_docs.yml
version: 2

models:
  - name: activity_based_interest_activated
    description: ""
    columns:
      - name: id
        description: "{{ doc('activity_based_interest__id') }}"

      - name: user_id
        description: "{{ doc('activity_based_interest__user_id') }}"

... (усечено для примера)

  - name: set_inactive_interest_rate_after_july_1st_in_bec_for_user
    description: ""
    columns:
      - name: id
        description: "{{ doc('activity_based_interest__id') }}"

      - name: user_id
        description: "{{ doc('activity_based_interest__user_id') }}"
```

Чтобы подтвердить, что форматирование работает, выполните следующую команду, чтобы запустить dbt Docs:

```
$ dbt docs && dbt docs serve
```
<Lightbox src="/img/blog/2023-05-04-generating-dynamic-docs/2.jpg" title="Интерфейс dbt Docs" />

Здесь вы можете подтвердить, что описания колонок с использованием блоков docs работают как задумано.
 

### Получение всех уникальных колонок в папке

Чтобы сократить копирование и вставку между вашими markdown и YAML файлами, найдите все уникальные колонки в папке и подпапках, выполнив следующую команду:

```
$ grep '      \- name:' models/core/activity_based_interest/_activity_based_interest_docs.yml | cut -c 15- | sort -u
end_date
event_day
event_time
id
is_active
last_updated_date
start_date
tier_interest_percentage
tier_threshold_amount
user_id
```

Разбор этой команды:
- `grep ' \- name:' models/core/activity_based_interest/_activity_based_interest_docs.yml` ищет шаблон ` - name:` в файле `_activity_based_interest_docs.yml`, расположенном в каталоге `models/core/activity_based_interest/`.
- `cut -c 15-` обрезает первые 14 символов каждой строки из вывода, т.е. в .yml файлах мы обрезаем `      - name: ` из `      - name: some_column_name`, так что остается только `some_column_name`.
- `sort -u` сортирует вывод в алфавитном порядке и удаляет любые дублирующиеся строки.

### Форматирование для соответствия с Jinja блоками docs

Скопируйте и вставьте вышеуказанный вывод в ваш `.md` файл, чтобы он выглядел следующим образом:

```
$ cat models/core/activity_based_interest/_activity_based_interest_docs.md
end_date
event_day
event_time
id
is_active
last_updated_date
start_date
tier_interest_percentage
tier_threshold_amount
user_id
```
Теперь откройте ваш редактор кода и замените `(.*)` на `{% docs column__activity_based_interest__$1 %}\n\n{% enddocs %}\n`, что приведет к следующему в вашем markdown файле:

<Lightbox src="/img/blog/2023-05-04-generating-dynamic-docs/3.png" title="Замена содержимого в вашем markdown файле" />

Теперь вы можете добавить документацию к каждой из ваших колонок.

## Обновление `.yml` файла для получения документации из `.md` файла

Вы можете программно определить все колонки и указать их на только что созданную документацию. В вашем редакторе кода замените `\s{6}- name: (.*)\n        description: ""` на `      - name: $1\n        description: "{{ doc('column__activity_based_interest__$1') }}`:

<Lightbox src="/img/blog/2023-05-04-generating-dynamic-docs/4.png" title="Замена описаний на динамические блоки docs" />

⚠️ Некоторые из ваших колонок могут уже быть доступны в существующих блоках docs. В этом примере выполнены следующие замены:
- `{{ doc('column__activity_based_interest__user_id') }}` → `{{ doc("column_user_id") }}`
- `{{ doc('column__activity_based_interest__event_day') }}` → `{{ doc("column_event_day") }}`

## Проверьте, что все работает
Запустите `dbt docs generate`. Если есть синтаксические ошибки, они будут обнаружены на этом этапе. Если успешно, мы можем запустить `dbt docs serve`, чтобы провести дымовой тест и убедиться, что все выглядит правильно:

<Lightbox src="/img/blog/2023-05-04-generating-dynamic-docs/5.jpg" title="Интерфейс dbt Docs, показывающий успешную документацию с использованием блоков docs" />

## Дополнительные соображения

- В: Что делать, если есть небольшие отклонения в документации колонок между моделями?
    - О: Я использую динамическую документацию, чтобы содержать "суть" документации, а затем добавляю статическую документацию, например:

    ```yaml
           - name: user_id
             description: "{{ doc('dynamic_docs') }}, дополнительная статическая информация" 
    ```
- В: Следует ли использовать этот подход при изменениях в существующей папке? 
    - О: При добавлении дополнительных моделей в папку или дополнительных колонок в существующую модель, я бы предложил добавлять новую документацию и блоки docs вручную, а не программно.

- В: Разве это нельзя сделать в виде shell-скрипта?
    - О: Да! Решение выше работает для меня достаточно хорошо, но если вы создадите скрипт, дайте мне знать, так как это сделает его еще проще в использовании.