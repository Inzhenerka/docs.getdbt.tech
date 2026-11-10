---
title: "Подключение Firebird к dbt v1"
sidebar_label: "Firebird"
description: "В этом руководстве описана настройка хранилища данных Firebird в dbt."
id: "firebird-setup"
meta:
  maintained_by: Сообщество
  authors: 'Fernando Lozer (https://github.com/flozer)'
  github_repo: 'flozer/dbt-firebird'
  pypi_package: 'dbt-firebird'
  min_core_version: 'v1.8.0'
  cloud_support: Не поддерживается
  min_supported_version: 'Firebird 3.0'
  slack_channel_name: 'n/a'
  slack_channel_link: 'https://www.getdbt.com/community'
  platform_name: 'Firebird'
  config_page: '/reference/resource-configs/no-configs'
availability: local_free
---


:::info Плагин сообщества

Некоторые основные функции могут быть ограничены. Если вы хотите внести свой вклад, ознакомьтесь с исходным кодом в каждом из перечисленных ниже репозиториев.

:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} installPackages="dbt-core dbt-firebird">

Примечание: при установке адаптера <Constant name="core" /> не устанавливается автоматически. Это связано с тем, что версии адаптеров и <Constant name="core" /> независимы друг от друга, чтобы избежать перезаписи установленных версий <Constant name="core" />. Для установки используйте следующую команду:

</SetUpPages>


Адаптер <a href="https://pypi.org/project/dbt-firebird/">dbt-firebird</a> подключает <Constant name="core" /> к базам данных <a href="https://firebirdsql.org/">Firebird</a> (3.0, 4.0 и 5.0) через официальный пакет <a href="https://pypi.org/project/firebird-driver/">firebird-driver</a>. Он поддерживает материализации table, view, incremental, seed и snapshot (SCD2), тесты данных, генерацию документации и интерактивную настройку с помощью `dbt init`.

Адаптер проверен с помощью официальных наборов тестов <Constant name="core" /> и матрицы CI, охватывающей Firebird 3/4/5 на Python версий от 3.9 до 3.12.

## Подключение к Firebird с помощью dbt-firebird

Базы данных Firebird хранятся в отдельных файлах. Поле `path` содержит путь к файлу базы данных с точки зрения сервера. Если dbt работает на том же компьютере, что и сервер, это обычный локальный путь; для удалённого сервера это путь на стороне сервера (например, `/data/prod.fdb` в Linux).

### Локальное подключение

Используйте этот профиль, если Firebird работает на том же компьютере, что и dbt. Достаточно указать путь к файлу базы данных в поле `path`.

<File name='~/.dbt/profiles.yml'>

```yaml
# Replace PROFILE_NAME with the profile name in your dbt_project.yml
PROFILE_NAME:
  target: dev
  outputs:
    dev:
      type: firebird
      path: C:/data/mydb.fdb
      user: SYSDBA
      password: masterkey
      threads: 1
```

</File>

### Удалённый сервер

Используйте этот профиль, если Firebird работает на другом компьютере. Укажите `host`, `port` и `path` — путь к файлу с точки зрения этого сервера.

<File name='~/.dbt/profiles.yml'>

```yaml
# Replace PROFILE_NAME with the profile name in your dbt_project.yml
PROFILE_NAME:
  target: dev
  outputs:
    dev:
      type: firebird
      host: 192.168.0.10
      port: 3050
      path: /data/prod.fdb
      user: SYSDBA
      password: masterkey
      charset: WIN1252
      threads: 1
```

</File>

### Описание полей профиля Firebird

Эти поля применяются как к локальным, так и к удалённым подключениям:

| Поле | Описание | Обязательное? | Пример |
|-------|-------------|-----------|---------|
| type | Используемый адаптер | Да | `firebird` |
| path | Путь к файлу базы данных с точки зрения сервера. Используйте прямые косые черты | Да | `C:/data/mydb.fdb` |
| host | Имя хоста или IP-адрес сервера. Не указывайте это поле для прямого подключения к локальному файлу | Нет | `192.168.0.10` |
| port | TCP-порт сервера | Нет (по умолчанию `3050`) | `3050` |
| user | Пользователь базы данных | Да | `SYSDBA` |
| password | Пароль | Да | `masterkey` |
| charset | Набор символов подключения. См. раздел [Наборы символов](#character-sets) | Нет (по умолчанию `UTF8`) | `WIN1252` |
| role | Роль Firebird, если вы используете роли | Нет | `RDB$ADMIN` |
| lock_timeout | Время в секундах, в течение которого оператор ожидает снятия блокировки, удерживаемой другой транзакцией, прежде чем завершиться с ошибкой. `0` = не ждать, `-1` = ждать неограниченно | Нет (по умолчанию `10`) | `30` |
| threads | Количество параллельных выполнений моделей. Рекомендуется `1` | Нет (по умолчанию `1`) | `1` |
| database | Логическое имя, используемое внутри dbt. Никогда не включается в SQL. По умолчанию используется имя файла без расширения | Нет | `mydb` |
| schema | Логическое имя, используемое внутри dbt. В Firebird нет схем, поэтому оно никогда не включается в SQL. По умолчанию — `main` | Нет | `main` |

<br />

Команда `dbt init` также работает: она отображает `firebird` в списке, запрашивает все перечисленные выше поля, записывает профиль и в конце запускает `dbt debug`.

## Наборы символов {#character-sets}

Выберите значение `charset`, соответствующее способу хранения текста в вашей базе данных Firebird:

| Ситуация | `charset` |
|-----------|-----------|
| База данных создана с набором символов `UTF8` или содержит только данные ASCII | `UTF8` (по умолчанию) |
| Устаревшие или восстановленные базы данных с набором символов `NONE` и данными, содержащими символы с диакритическими знаками (например, в WIN1252) | `WIN1252` |

<br />

Если чтение завершается ошибкой `UnicodeDecodeError: 'utf-8' codec can't decode byte ...`, задайте `charset: WIN1252`. Это наиболее распространённый случай для устаревших бразильских баз данных Firebird.

## Именование объектов и чувствительность к регистру

Идентификаторы без кавычек в Firebird SQL хранятся в ВЕРХНЕМ РЕГИСТРЕ. Адаптер dbt создаёт объекты с именами в нижнем регистре, заключёнными в кавычки (по тому же принципу, что и адаптер Postgres), поэтому модель с именем `clientes` становится таблицей `"clientes"`:

```sql
select * from "clientes";  -- correct (quoted)
select * from clientes;    -- looks for CLIENTES, which does not exist
```

Чтобы к объектам можно было обращаться без кавычек, используя верхний регистр, задайте псевдоним модели или seed в верхнем регистре:

```yaml
seeds:
  my_project:
    store:
      +alias: STORE
```

## Поддерживаемые возможности

- Материализации: `table` (атомарная замена), `view` (`CREATE OR ALTER`), `incremental` (стратегии `append`, `delete+insert`, `merge`), `seed` (атомарная замена данных) и `snapshot` (стратегии `check` и `timestamp`)
- Обработка `on_schema_change` (`ignore`, `fail`, `append_new_columns`, `sync_all_columns`)
- Тесты данных: универсальные и специализированные
- `dbt docs generate` и `persist_docs` (записывает операторы `COMMENT ON`)
- Автоматические повторные попытки при конфликтах блокировок и настраиваемый параметр `lock_timeout`

### Ограничения

- Материализация `ephemeral` не поддерживается: dbt генерирует встроенные CTE с именами, начинающимися с подчёркивания, которые недопустимы в качестве идентификаторов Firebird без кавычек
- В Firebird нет схем: поля профиля `database` и `schema` служат только логическими именами
- Имена моделей и seed должны содержать не более 22 символов в Firebird 3 (dbt добавляет суффиксы наподобие `__dbt_tmp`, которые должны укладываться в ограничение длины идентификатора в 31 байт; Firebird 4+ допускает 63)
- Поддержка контрактов моделей (`contract: enforced`) не гарантирует полного соблюдения контракта: указывайте в YAML собственные типы данных Firebird
- Модели без предложения `FROM` недопустимы в Firebird SQL (например, используйте `select 1 as id from rdb$database`)
- Рекомендуется `threads: 1`; адаптер устойчив к конфликтам записи, но Firebird координирует параллельную запись в одном пространстве имён на уровне таблиц

## Права доступа к базе данных

Пользователю, указанному в профиле, необходимы права на чтение и запись объектов, которыми управляет dbt, а также разрешения на создание и изменение таблиц и представлений. Эти права охватывают все операции dbt: работу с таблицами, представлениями, seed, снимками и инкрементальными моделями:

| Право | Назначение |
|-----------|---------|
| `SELECT` | Чтение <Term id="table">таблиц</Term> и <Term id="view">представлений</Term> |
| `INSERT` | Загрузка моделей, [seed](/docs/build/seeds) и [снимков](/docs/build/snapshots) |
| `UPDATE` | Изменение существующих строк ([инкрементальные модели](/docs/build/incremental-models) и [снимки](/docs/build/snapshots)) |
| `DELETE` | Замена данных (замена таблиц и [инкрементальные модели](/docs/build/incremental-models)) |
| `CREATE` | Создание <Term id="table">таблиц</Term> и <Term id="view">представлений</Term> |
| `ALTER` | Изменение <Term id="table">таблиц</Term> и <Term id="view">представлений</Term> |
| `DROP` | Замена объектов, которые dbt создаёт заново |

<br />

Для SYSDBA или владельца базы данных дополнительные права не требуются.
