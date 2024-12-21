---
title: "Отладка ошибок"
id: "debug-errors"
description: Узнайте об ошибках и искусстве их отладки.
displayText: Отладка ошибок
hoverSnippet: Узнайте об ошибках и искусстве их отладки.
icon: 'guides'
hide_table_of_contents: true
tags: ['Troubleshooting', 'dbt Core', 'dbt Cloud']
level: 'Beginner'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Общий процесс отладки

Научиться отлаживать — это навык, который сделает вас отличным специалистом в вашей роли!
1. Прочитайте сообщение об ошибке — при написании кода для dbt мы стараемся сделать сообщения об ошибках максимально полезными. Сообщение об ошибке, которое генерирует dbt, обычно содержит тип ошибки (подробнее об этих типах ошибок ниже) и файл, в котором произошла ошибка.
2. Проверьте файл, который вызвал проблему, и посмотрите, есть ли немедленное решение.
3. Изолируйте проблему — например, запуская одну модель за раз или отменяя код, который вызвал сбой.
4. Ознакомьтесь с скомпилированными файлами и журналами.
    - Директория `target/compiled` содержит `select`-запросы, которые вы можете выполнить в любом редакторе запросов.
    - Директория `target/run` содержит SQL, который dbt выполняет для построения ваших моделей.
    - Файл `logs/dbt.log` содержит все запросы, которые выполняет dbt, и дополнительную информацию. Последние ошибки будут внизу файла.
    - **Пользователи dbt Cloud**: Используйте вышеуказанное или вкладку `Details` в выводе команды.
    - **Пользователи dbt Core**: Обратите внимание, что ваш редактор кода _может_ скрывать эти файлы из дерева <Term id="view" /> [Помощь по VSCode](https://stackoverflow.com/questions/42891463/how-can-i-show-ignored-files-in-visual-studio-code)).
5. Если вы действительно застряли, попробуйте [попросить о помощи](/community/resources/getting-help). Прежде чем это сделать, потратьте время на то, чтобы хорошо сформулировать свой вопрос, чтобы другие могли быстро диагностировать проблему.

## Типы ошибок
Ниже мы перечислили некоторые из распространенных ошибок. Полезно понимать, что делает dbt за кулисами, когда вы выполняете команду, такую как `dbt run`.

| Шаг | Описание | Тип ошибки |
|:-----|:------------|:-----------|
| Инициализация | Проверьте, что это проект dbt, и что dbt может подключиться к хранилищу данных | `Runtime Error` |
| Парсинг | Проверьте, что фрагменты Jinja в файлах `.sql` и файлы `.yml` валидны. | `Compilation Error` |
| Валидация графа | Скомпилируйте зависимости в граф. Проверьте, что он ацикличен. | `Dependency Error` |
| Выполнение SQL | Запустите модели | `Database Error` |

Давайте углубимся в некоторые из этих ошибок и как их отлаживать 👇. Примечание: не все ошибки здесь охвачены!

## Ошибки времени выполнения
_Примечание: если вы используете IDE dbt Cloud для работы над своим проектом, вы вряд ли столкнетесь с этими ошибками._

### Не проект dbt

```
Running with dbt=0.17.1
Encountered an error:
Runtime Error
  fatal: Not a dbt project (or any of the parent directories). Missing dbt_project.yml file
```
<details>
<summary>Отладка</summary>

- Используйте `pwd`, чтобы проверить, находитесь ли вы в правильной директории. Если нет, используйте `cd`, чтобы перейти туда!
- Проверьте, есть ли у вас файл с именем `dbt_project.yml` в корневой директории вашего проекта. Вы можете использовать `ls`, чтобы перечислить файлы в директории, или также открыть директорию в редакторе кода и увидеть файлы в "дереве".

</details>

### Не удалось найти профиль

```
Running with dbt=0.17.1

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
Running with dbt=0.17.1
To view your profiles.yml file, run:

open /Users/alice/.dbt
```

  - Затем выполните `open /Users/alice/.dbt` (с учетом корректировки), и проверьте, есть ли у вас файл `profiles.yml`. Если его нет, настройте его, используя [эти документы](/docs/core/connect-data-platform/profiles.yml)

</details>

### Не удалось подключиться

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
Running with dbt=0.17.1
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

### Неверный файл `dbt_project.yml`

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

## Ошибки компиляции

_Примечание: если вы используете IDE dbt Cloud для работы над своим проектом dbt, эта ошибка часто отображается в виде красной полосы в командной строке, когда вы работаете над своим проектом dbt. Для пользователей dbt Core эти ошибки не будут обнаружены, пока вы не выполните `dbt run` или `dbt compile`._

### Неверная функция `ref`
```
$ dbt run -s customers
Running with dbt=0.17.1

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

### Неверный Jinja

```
$ dbt run
Running with dbt=0.17.1
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

Чтобы предотвратить это:
- _(Только для пользователей dbt Core)_ Используйте сниппеты для автозаполнения фрагментов Jinja ([пакет atom-dbt](https://github.com/dbt-labs/atom-dbt), [расширение vscode-dbt](https://marketplace.visualstudio.com/items?itemName=bastienboutonnet.vscode-dbt))

</details>

### Неверный YAML
dbt не смог преобразовать ваш YAML в допустимый словарь.

```
$ dbt run
Running with dbt=0.17.1

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
    7  |         tests:
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
version: 2

models:
  - name: customers
      columns: # этот отступ слишком большой!
      - name: customer_id
        tests:
          - unique
          - not_null
```

Чтобы исправить это:
- Откройте ошибочный файл (например, `schema.yml`)
- Проверьте строку в сообщении об ошибке (например, `line 5`)
- Найдите ошибку и исправьте ее

Чтобы предотвратить это:
- (Пользователи dbt Core) Включите направляющие отступов в вашем редакторе кода, чтобы помочь вам проверить ваши файлы
- Используйте валидатор YAML ([пример](http://www.yamllint.com/)) для отладки любых проблем

</details>

### Неправильная спецификация YAML
Несколько другая ошибка — структура YAML правильная (т.е. парсер YAML может преобразовать это в словарь Python), _но_ есть ключ, который dbt не распознает.

```
$ dbt run
Running with dbt=0.17.1

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

## Ошибки зависимостей
```
$ dbt run
Running with dbt=0.17.1-rc

Encountered an error:
Found a cycle: model.jaffle_shop.customers --> model.jaffle_shop.stg_customers --> model.jaffle_shop.customers

```

Ваш граф dbt не является ацикличным и нуждается в исправлении!
- Обновите функции `ref`, чтобы разорвать цикл.
- Если вам нужно сослаться на текущую модель, используйте переменную [`{{ this }}`](/reference/dbt-jinja-functions/this) вместо этого.

## Ошибки базы данных

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

В 90% случаев в SQL вашей модели есть ошибка. Чтобы исправить это:
1. Откройте ошибочный файл:
    - **dbt Cloud:** Откройте модель (в данном случае `models/customers.sql`, как указано в сообщении об ошибке)
    - **dbt Core:** Откройте модель, как указано выше. Также откройте скомпилированный SQL (в данном случае `target/run/jaffle_shop/models/customers.sql`, как указано в сообщении об ошибке) — это может быть полезно показать их рядом в вашем редакторе кода.
2. Попробуйте повторно выполнить SQL, чтобы изолировать ошибку:
    - **dbt Cloud:** Используйте кнопку `Preview` из файла модели
    - **dbt Core:** Скопируйте и вставьте скомпилированный запрос в редактор запросов (например, интерфейс Snowflake или настольное приложение, такое как DataGrip / TablePlus) и выполните его
3. Исправьте ошибку.
4. Повторно выполните неудавшуюся модель.

В некоторых случаях эти ошибки могут возникать в результате запросов, которые dbt выполняет "за кулисами". К ним относятся:
- Интроспективные запросы для перечисления объектов в вашей базе данных
- Запросы на `создание` схем
- `pre-hooks`, `post-hooks`, `on-run-end` hooks и `on-run-start` hooks
- Для инкрементных моделей и снимков: операторы merge, update и insert

В этих случаях вам следует проверить журналы — они содержат _все_ запросы, которые выполняет dbt.
- **dbt Cloud**: Используйте `Details` в выводе команды, чтобы увидеть журналы, или проверьте файл `logs/dbt.log`
- **dbt Core**: Откройте файл `logs/dbt.log`.

:::tip Изоляция ошибок в журналах
Если вы сталкиваетесь с странной `Database Error`, может быть хорошей идеей очистить ваши журналы, открыв файл и удалив содержимое. Затем повторно выполните `dbt run` только для _проблемной_ модели. Журналы будут содержать _только_ нужный вам вывод.
:::

## Общие ошибки

### `Preview` vs. `dbt run`
_(Только для пользователей IDE dbt Cloud)_

Существует два интерфейса, которые выглядят похоже:
- Кнопка `Preview` выполняет любой SQL-запрос, находящийся в активной вкладке. Это эквивалентно извлечению скомпилированного `select`-запроса из директории `target/compiled` и выполнению его в редакторе запросов, чтобы увидеть результаты.
- Команда `dbt run` создает отношения в вашей базе данных

Использование кнопки `Preview` полезно при разработке моделей, когда вы хотите визуально проверить результаты запроса. Однако вам нужно убедиться, что вы выполнили `dbt run` для всех вышестоящих моделей — в противном случае dbt попытается выбрать `from` таблицы и представления, которые не были построены.

### Забыл сохранить файлы перед запуском
Мы все были там. dbt использует последнюю сохраненную версию файла, когда вы выполняете команду. В большинстве редакторов кода и в IDE dbt Cloud точка рядом с именем файла указывает на то, что файл имеет несохраненные изменения. Убедитесь, что вы нажали `cmd + s` (или эквивалент), прежде чем выполнять любые команды dbt — со временем это становится мышечной памятью.

### Редактирование скомпилированных файлов
_(Более вероятно для пользователей dbt Core)_

Если вы только что открыли SQL-файл в директории `target/`, чтобы помочь отладить проблему, не редкость случайно отредактировать этот файл! Чтобы избежать этого, попробуйте изменить настройки вашего редактора кода, чтобы сделать файлы в директории `target/` серыми — визуальный сигнал поможет избежать проблемы.

## Часто задаваемые вопросы

Вот некоторые полезные часто задаваемые вопросы, которые помогут вам отладить ваш проект dbt:

- <FAQ path="Troubleshooting/generate-har-file" />
- <FAQ path="Troubleshooting/auth-expired-error" />  
- <FAQ path="Troubleshooting/could-not-parse-project" />
- <FAQ path="Troubleshooting/gitignore" />
- <FAQ path="Troubleshooting/job-memory-limits" />
- <FAQ path="Troubleshooting/runtime-packages.yml" />
- <FAQ path="Troubleshooting/dispatch-could-not-find-package" />
- <FAQ path="Troubleshooting/sql-errors" />

</div>