---
title: "Отладка ошибок"
id: "debug-errors"
description: Узнайте об ошибках и искусстве их отладки.
displayText: Отладка ошибок
hoverSnippet: Узнайте об ошибках и искусстве их отладки.
icon: 'guides'
hide_table_of_contents: true
tags: ['Troubleshooting', 'dbt platform']
level: 'Beginner'
---

<div style={{maxWidth: '900px'}}>

## Общий процесс отладки {#general-process-of-debugging}

Умение отлаживать код — это навык, который поможет вам стать отличным специалистом!
1. Прочитайте сообщение об ошибке — при разработке dbt мы стараемся сделать сообщения об ошибках как можно более полезными. Сообщение об ошибке, которое выдает dbt, обычно содержит тип ошибки (подробнее о типах ошибок ниже) и имя файла, в котором она возникла.
2. Изучите файл, вызвавший проблему, и посмотрите, нет ли очевидного способа ее исправить.
3. Изолируйте проблему — например, запускайте по одной модели за раз или отмените изменения в коде, которые привели к сбою.
4. Освойте работу со скомпилированными файлами и логами.
    - Каталог `target/compiled` содержит операторы `select`, которые можно выполнить в любом редакторе запросов.
    - Каталог `target/run` содержит SQL-код, который dbt выполняет для построения ваших моделей.
    - Файл `logs/dbt.log` содержит все запросы, которые выполняет dbt, и дополнительные записи логов. Последние ошибки находятся в конце файла.
    - **Пользователи <Constant name="dbt" />**: используйте перечисленные выше файлы и каталоги или вкладку `Details` в выводе команды.
    - **Пользователи <Constant name="core" />**: обратите внимание, что ваш редактор кода _может_ скрывать эти файлы в дереве <Term id="view" /> [Справка по VSCode](https://stackoverflow.com/questions/42891463/how-can-i-show-ignored-files-in-visual-studio-code)).
5. Если вы никак не можете решить проблему, попробуйте [обратиться за помощью](/community/resources/getting-help). Прежде чем это сделать, уделите время грамотной формулировке вопроса, чтобы другие могли быстро разобраться в проблеме.

## Типы ошибок {#types-of-errors}
Ниже мы перечислили некоторые из наиболее распространенных ошибок. Полезно понимать, что именно dbt делает «за кулисами», когда вы выполняете команду вроде `dbt run`.

| Этап | Описание | Тип ошибки |
|:-----|:------------|:-----------|
| Инициализация | Проверьте, что это проект dbt, и что dbt может подключиться к хранилищу данных | `Runtime Error` |
| Парсинг | Проверьте, что фрагменты Jinja в файлах `.sql` и файлы `.yml` валидны. | `Compilation Error` |
| Валидация графа | Скомпилируйте зависимости в граф. Проверьте, что он ацикличен. | `Dependency Error` |
| Выполнение SQL | Запустите модели | `Database Error` |

Давайте углубимся в некоторые из этих ошибок и как их отлаживать 👇. Примечание: не все ошибки здесь охвачены!

## Ошибки времени выполнения
_Примечание: если вы используете <Constant name="studio_ide" /> для работы над проектом, вы вряд ли столкнётесь с этими ошибками._

### Не проект dbt {#not-a-dbt-project}

```
Running with dbt=1.7.1
Encountered an error:
Runtime Error
  fatal: Not a dbt project (or any of the parent directories). Missing dbt_project.yml file
```
<details>
<summary>Отладка</summary>

- Используйте `pwd`, чтобы проверить, находитесь ли вы в правильной директории. Если нет, используйте `cd`, чтобы перейти туда!
- Проверьте, есть ли у вас файл с именем `dbt_project.yml` в корневой директории вашего проекта. Вы можете использовать `ls`, чтобы перечислить файлы в директории, или также открыть директорию в редакторе кода и увидеть файлы в "дереве".

</details>

### Не удалось найти профиль {#could-not-find-profile}

```
Running with dbt=1.7.1

Encountered an error:
Runtime Error
  Could not run dbt
  Could not find profile named 'jaffle_shops'
```
<details>
<summary>Отладка</summary>

- Проверьте ключ `profile:` в вашем `dbt_project.yml`. Например, этот проект использует профиль `jaffle_shops` (обратите внимание на множественное число):

<File name='dbt_project.yml'>

```yml
profile: jaffle_shops # обратите внимание на множественное число
```
</File>

- Проверьте профили, которые у вас есть в файле `profiles.yml`. Например, этот профиль называется `jaffle_shop` (обратите внимание на единственное число).

<File name='profiles.yml'>

```yaml
jaffle_shop: # это не соответствует ключу profile:
  target: dev

  outputs:
    dev:
      type: postgres
      schema: dbt_alice
      ... # другие детали подключения
```

</File>

- Обновите их так, чтобы они совпадали.
- Если вы не можете найти свой файл `profiles.yml`, выполните `dbt debug --config-dir` для помощи:
```
$ dbt debug --config-dir
Running with dbt=1.7.1
To view your profiles.yml file, run:

open /Users/alice/.dbt
```

- Затем выполните `open /Users/alice/.dbt` (при необходимости изменив путь) и убедитесь, что у вас есть файл `profiles.yml`. Если его нет, создайте его, следуя [этой документации](/docs/local/profiles.yml).

</details>

### Не удалось подключиться {#failed-to-connect}

```
Encountered an error:
Runtime Error
  Database error while listing schemas in database "analytics"
  Database Error
    250001 (08001): Failed to connect to DB: your_db.snowflakecomputing.com:443. Incorrect username or password was specified.
```

<details>
<summary>Отладка</summary>

- Откройте ваш файл `profiles.yml` (если вы не уверены, где он находится, выполните `dbt debug --config-dir`)
- Подтвердите, что ваши учетные данные верны — возможно, вам потребуется работать с администратором базы данных, чтобы подтвердить это.
- После обновления учетных данных выполните `dbt debug`, чтобы проверить, можете ли вы подключиться

```
$ dbt debug
Running with dbt=1.7.1
Using profiles.yml file at /Users/alice/.dbt/profiles.yml
Using dbt_project.yml file at /Users/alice/jaffle-shop-dbt/dbt_project.yml

Configuration:
  profiles.yml file [OK found and valid]
  dbt_project.yml file [OK found and valid]

Required dependencies:
 - git [OK found]

Connection:
  ...
  Connection test: OK connection ok
```

</details>

### Неверный файл `dbt_project.yml` {#invalid-dbt_projectyml-file}

```
Encountered an error while reading the project:
  ERROR: Runtime Error
  at path []: Additional properties are not allowed ('hello' was unexpected)

Error encountered in /Users/alice/jaffle-shop-dbt/dbt_project.yml
Encountered an error:
Runtime Error
  Could not run dbt
```

<details>
<summary>Отладка</summary>

- Откройте ваш файл `dbt_project.yml`.
- Найдите ошибочный ключ (например, `hello`, как указано в "'hello' was unexpected")

<File name='dbt_project.yml'>

```yml
name: jaffle_shop
hello: world # это не разрешено

```

</File>

- Используйте справочный раздел для файлов [`dbt_project.yml`](/reference/dbt_project.yml.md), чтобы исправить эту проблему.
- Если вы используете ключ, который является допустимым согласно документации, проверьте, что вы используете последнюю версию dbt с помощью `dbt --version`.

</details>

## Ошибки компиляции {#compilation-errors}

_Примечание: если вы используете <Constant name="studio_ide" /> для работы над проектом dbt, эта ошибка часто отображается в виде красной полосы в командной строке во время работы над проектом. Для пользователей <Constant name="core" /> такие ошибки обнаруживаются только при выполнении `dbt run` или `dbt compile`._

### Неверная функция `ref` {#invalid-ref-function}
```
$ dbt run -s customers
Running with dbt=1.1.0

Encountered an error:
Compilation Error in model customers (models/customers.sql)
  Model 'model.jaffle_shop.customers' (models/customers.sql) depends on a node named 'stg_customer' which was not found
```
<details>
<summary>Отладка</summary>

- Откройте файл `models/customers.sql`.
- Используйте `cmd + f` (или эквивалент) для поиска `stg_customer`. Для этого должна существовать файл с именем `stg_customer.sql`.
- Замените эту ссылку на ссылку на другую модель (т.е. имя файла другой модели), в данном случае `stg_customers`. ИЛИ переименуйте вашу модель в `stg_customer`.

</details>

### Неверный Jinja {#invalid-jinja}

```
$ dbt run
Running with dbt=1.7.1
Compilation Error in macro (macros/cents_to_dollars.sql)
  Reached EOF without finding a close tag for macro (searched from line 1)
```
<details>
<summary>Отладка</summary>

Здесь мы полагаемся на библиотеку Jinja, чтобы передать ошибку, а затем просто передаем ее вам.

Этот конкретный пример связан с забытым тегом `{% endmacro %}`, но вы также можете получить такие ошибки за:
- Забытую закрывающую `}`
- Закрытие цикла `for` перед закрытием оператора `if`

Чтобы исправить это:
- Перейдите к ошибочному файлу (например, `macros/cents_to_dollars.sql`), указанному в сообщении об ошибке
- Используйте сообщение об ошибке, чтобы найти свою ошибку

Чтобы этого избежать:
- _(<Constant name="core" /> only)_ Используйте сниппеты для автодополнения фрагментов Jinja ([пакет atom-dbt](https://github.com/dbt-labs/atom-dbt))

</details>

### Неверный YAML {#invalid-yaml}
dbt не смог преобразовать ваш YAML в допустимый словарь.

```
$ dbt run
Running with dbt=1.7.1

Encountered an error:
Compilation Error
  Error reading jaffle_shop: schema.yml - Runtime Error
    Syntax error near line 5
    ------------------------------
    2  |
    3  | models:
    4  | - name: customers
    5  |     columns:
    6  |       - name: customer_id
    7  |         data_tests:
    8  |           - unique

    Raw Error:
    ------------------------------
    mapping values are not allowed in this context
      in "<unicode string>", line 5, column 12
```
<details>

<summary>Отладка</summary>

Обычно это связано с отступами — вот ошибочный YAML, который вызвал эту ошибку:
```yaml

models:
  - name: customers
      columns: # этот отступ слишком большой!
      - name: customer_id
        data_tests:
          - unique
          - not_null
```

Чтобы исправить это:
- Откройте ошибочный файл (например, `schema.yml`)
- Проверьте строку в сообщении об ошибке (например, `line 5`)
- Найдите ошибку и исправьте ее

Чтобы предотвратить это:

- (<Constant name="core" /> users) Включите направляющие отступов в вашем редакторе кода, чтобы было проще проверять структуру файлов
- Используйте валидатор YAML ([пример](http://www.yamllint.com/)) для отладки любых проблем

</details>

### Неправильная спецификация YAML {#incorrect-yaml-spec}
Несколько другая ошибка — структура YAML правильная (т.е. парсер YAML может преобразовать это в словарь Python), _но_ есть ключ, который dbt не распознает.

```
$ dbt run
Running with dbt=1.7.1

Encountered an error:
Compilation Error
  Invalid models config given in models/schema.yml @ models: {'name': 'customers', 'hello': 'world', 'columns': [{'name': 'customer_id', 'tests': ['unique', 'not_null']}], 'original_file_path': 'models/schema.yml', 'yaml_key': 'models', 'package_name': 'jaffle_shop'} - at path []: Additional properties are not allowed ('hello' was unexpected)
```

<details>
<summary>Отладка</summary>

- Откройте файл (например, `models/schema.yml`), как указано в сообщении об ошибке
- Найдите ошибочный ключ (например, `hello`, как указано в "**'hello'** was unexpected")
- Исправьте это. Используйте документы [свойств модели](/reference/model-properties), чтобы найти допустимые ключи
- Если вы используете допустимый ключ, проверьте, что вы используете последнюю версию dbt с помощью `dbt --version`

</details>

## Ошибки зависимостей {#dependency-errors}
```
$ dbt run
Running with dbt=1.7.1-rc

Encountered an error:
Found a cycle: model.jaffle_shop.customers --> model.jaffle_shop.stg_customers --> model.jaffle_shop.customers

```

Ваш DAG в dbt не является ациклическим, и его необходимо исправить!

- Обновите вызовы функции `ref`, чтобы разорвать цикл.
- Если вам нужно сослаться на текущую модель, используйте переменную [`{{ this }}`](/reference/dbt-jinja-functions/this) вместо этого.

## Ошибки базы данных {#database-errors}

Самые сложные ошибки из всех! Эти ошибки исходят из вашего <Term id="data-warehouse" />, и dbt передает сообщение. Возможно, вам потребуется использовать документацию вашего хранилища данных (т.е. документацию Snowflake или BigQuery), чтобы отладить их.

```
$ dbt run
...
Completed with 1 error and 0 warnings:

Database Error in model customers (models/customers.sql)
  001003 (42000): SQL compilation error:
  syntax error line 14 at position 4 unexpected 'from'.
  compiled SQL at target/run/jaffle_shop/models/customers.sql
```

В 90% случаев причина — ошибка в SQL-коде вашей модели. Чтобы исправить её:
1. Откройте файл с ошибкой:
    - **<Constant name="dbt" />:** Откройте модель (в данном случае `models/customers.sql`, как указано в сообщении об ошибке)
    - **<Constant name="core" />:** Откройте модель, как описано выше. Также откройте скомпилированный SQL (в данном случае `target/run/jaffle_shop/models/customers.sql`, как указано в сообщении об ошибке) — может быть полезно расположить эти файлы рядом в редакторе кода.
2. Попробуйте повторно выполнить SQL, чтобы локализовать ошибку:
    - **<Constant name="dbt" />:** Используйте кнопку `Preview` в файле модели
    - **<Constant name="core" />:** Скопируйте и вставьте скомпилированный запрос в инструмент для выполнения запросов (например, веб-интерфейс Snowflake или настольное приложение, такое как DataGrip / TablePlus) и выполните его
3. Исправьте ошибку.
4. Повторно запустите модель, выполнение которой завершилось с ошибкой.

Иногда причиной становятся служебные запросы, которые dbt выполняет автоматически:

- Запросы списка объектов в базе данных.
- Запросы на создание схем.
- Хуки `pre-hook`, `post-hook`, `on-run-end` и `on-run-start`.
- Операции слияния, обновления и вставки для инкрементальных моделей и снимков.

В таких случаях следует проверить журналы — в них содержатся _все_ запросы, выполненные dbt.
- **<Constant name="dbt" />**: Чтобы просмотреть журналы, откройте `Details` в выводе команды или проверьте файл `logs/dbt.log`
- **<Constant name="core" />**: Откройте файл `logs/dbt.log`.

:::tip Изоляция ошибок в журналах
Если вы сталкиваетесь с странной `Database Error`, может быть хорошей идеей очистить ваши журналы, открыв файл и удалив содержимое. Затем повторно выполните `dbt run` только для _проблемной_ модели. Журналы будут содержать _только_ нужный вам вывод.
:::

## Распространённые ошибки {#common-pitfalls}

### `Preview` и `dbt run`: в чём разница {#preview-vs-dbt-run}
_(Только для пользователей <Constant name="studio_ide" />)_

- **Preview** выполняет SQL из активной вкладки. Это аналог запуска скомпилированного `select` из `target/compiled` в редакторе запросов.
- **dbt run** создаёт объекты в базе данных.

Использование кнопки `Preview` полезно при разработке моделей, когда вы хотите визуально проверить результаты запроса. Однако вам нужно убедиться, что вы выполнили `dbt run` для всех вышестоящих моделей — в противном случае dbt попытается выбрать `from` таблицы и представления, которые не были построены.

### Забыли сохранить файлы перед запуском {#forgetting-to-save-files-before-running}
С этим сталкивались все. dbt использует последнюю **сохранённую** версию файла при выполнении команды. В большинстве редакторов кода, а также в <Constant name="cloud_ide" />, точка рядом с именем файла означает, что в нём есть несохранённые изменения. Перед запуском любых команд dbt убедитесь, что вы нажали `cmd + s` (или аналогичную комбинацию) — со временем это становится привычкой.


### Редактирование скомпилированных файлов {#editing-compiled-files}

_(Прежде всего для пользователей <Constant name="core" />.)_

Если вы открыли SQL-файл из каталога `target/` для отладки, легко случайно внести правку в скомпилированный файл. Настройте редактор так, чтобы файлы в `target/` отображались серым. Так проще отличить их от исходных файлов модели.

## Часто задаваемые вопросы {#faqs}

Вот некоторые полезные часто задаваемые вопросы, которые помогут вам отладить ваш проект dbt:

- <FAQ path="Troubleshooting/generate-har-file" />
- <FAQ path="Troubleshooting/refresh-snowflake-oauth-credentials" />  
- <FAQ path="Troubleshooting/could-not-parse-project" />
- <FAQ path="Troubleshooting/gitignore" />
- <FAQ path="Troubleshooting/job-memory-limits" />
- <FAQ path="Troubleshooting/runtime-packages.yml" />
- <FAQ path="Troubleshooting/dispatch-could-not-find-package" />
- <FAQ path="Troubleshooting/sql-errors" />

</div>
