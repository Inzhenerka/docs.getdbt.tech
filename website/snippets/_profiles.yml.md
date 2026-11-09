Если вы используете dbt из командной строки, вам нужен файл `profiles.yml`, содержащий параметры подключения к вашей платформе данных.

:::note Учетные записи платформы dbt
Для проектов <Constant name="dbt_platform" /> файл profiles.yml не требуется, если только вы не ведете разработку на локальном компьютере вместо облачного интерфейса.
:::

## О файле profiles.yml

Файл `profiles.yml` хранит учетные данные для подключения к базе данных и настройки проектов dbt, в том числе:

- **Параметры подключения** &mdash; Идентификаторы учетных записей, хосты, порты и учетные данные для аутентификации.
- **Определения целевых окружений** &mdash; Позволяют задать разные окружения (dev, staging, prod) в одном профиле.
- **Целевое окружение по умолчанию** &mdash; Позволяет указать, какое окружение использовать по умолчанию.
- **Параметры выполнения** &mdash; Количество потоков, тайм-ауты и настройки повторных попыток.
- **Отдельное хранение учетных данных** &mdash; Позволяет хранить конфиденциальную информацию вне системы контроля версий.

The `profile` field in [`dbt_project.yml`](/reference/dbt_project.yml) references a profile name defined in `profiles.yml`.

## Location of profiles.yml

Only one `profiles.yml` file is required and it can manage multiple projects and connections. 

<Tabs>
<TabItem value="fusion" label="dbt v2">

<Constant name="fusion"/> searches for the parent directory of `profiles.yml` in the following order and uses the first location it finds:

1. `--profiles-dir` flag &mdash; Override for CI/CD or testing.
2. Project root directory &mdash; Project-specific credentials.
3. `~/.dbt/` directory (Recommended location) &mdash; Shared across all projects.

</TabItem>
<TabItem value="core" label="dbt v1">

<Constant name="core"/> searches for the parent directory of `profiles.yml` in the following order and uses the first location it finds:

<VersionBlock lastVersion="1.10">

1. `--profiles-dir` flag
2. `DBT_PROFILES_DIR` environment variable
3. Current working directory
4. `~/.dbt/` directory (Recommended location)

</VersionBlock>

<VersionBlock firstVersion="1.11">

1. `--profiles-dir` flag
2. `DBT_ENGINE_PROFILES_DIR` environment variable
3. `DBT_PROFILES_DIR` environment variable (legacy variable but supported for backward compatibility)
4. Current working directory
5. `~/.dbt/` directory (Recommended location)

**Note:** <Constant name="core"/> prefers `DBT_ENGINE_PROFILES_DIR` for the profiles directory, which aligns with the `DBT_ENGINE_*` env var naming in v1.11. Use `DBT_ENGINE_PROFILES_DIR` going forward; `DBT_PROFILES_DIR` remains supported for compatibility.

</VersionBlock>

Note: <Constant name="core"/> supports using the <VersionBlock lastVersion="1.10">`DBT_PROFILES_DIR`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_PROFILES_DIR`</VersionBlock> environment variable or a `profiles.yml` file in the current working directory. These options aren't currently supported in <Constant name="fusion"/>.

</TabItem>
</Tabs>

`~/.dbt/profiles.yml` is the recommended location for the following reasons:

- **Security** &mdash; Keeps credentials out of project directories and version control.
- **Reusability** &mdash; A single file for all dbt projects on the machine.
- **Separation** &mdash; Connection details don't travel with project code.

#### When should I use project root?

Place your `profiles.yml` file in the project root directory for:

- Self-contained demo or tutorial projects.
- Docker containers with baked-in credentials.
- CI/CD pipelines with environment-specific configs.

## Create and configure the `profiles.yml` file

The easiest way to create and configure a `profiles.yml` file is to execute `dbt init` after you've installed dbt on your machine. This takes you through the process of configuring an adapter and places the file into the recommended `~/.dbt/` location. 

If your project has an existing `profiles.yml` file, running `dbt init` will prompt you to amend or overwrite it. If you select the existing adapter for configuration, dbt will automatically populate the existing values.

You can also manually create the file and add it to the proper location. To configure an adapter manually, copy and paste the fields from the adapter setup instructions for [<Constant name="core" />](/docs/local/connect-data-platform/about-dbt-connections) or [<Constant name="fusion" />](/docs/local/profiles.yml) along with the appropriate values for each. 

### Example configuration

To set up your profile, copy the correct sample profile for your warehouse into your `profiles.yml` file and update the details as follows:

- Profile name: Replace the name of the profile with a sensible name – it’s often a good idea to use the name of your organization. Make sure that this is the same name as the `profile` indicated in your `dbt_project.yml` file.
- `target`: This is the default target your dbt project will use. It must be one of the targets you define in your profile. Commonly it is set to `dev`.
- Populating your `outputs`:
  - `type`: The type of data warehouse you are connecting to
  - Warehouse credentials: Get these from your database administrator if you don’t already have them. Remember that user credentials are very sensitive information that should not be shared. May include fields like `account`, `username`, and `password`.
  - `schema`: The default schema that dbt will build objects in.
  - `threads`: The number of threads the dbt project will run on.

The following example highlights the format of the `profiles.yml` file. Note that many of the configs are adapter-specific and their syntax varies. 

<File name='~/.dbt/profiles.yml'>

```yml
my_project_profile:  # Имя профиля (соответствует dbt_project.yml)
  target: dev  # Целевая среда по умолчанию
  outputs:
    dev: # Среда разработки
      type: adapter_type # Обязательно: snowflake, bigquery, databricks, redshift, postgres и т. д.
      # Идентификаторы подключения (примеры-заполнители; поддерживаемые настройки см. на страницах соответствующих адаптеров)
      account: abc123  
      database: docs_team 
      schema: dev_schema       
      # Аутентификация (зависит от адаптера)
      auth_method: username_password  
      username: username
      password_credentials: password
      # Настройки выполнения (общие для всех адаптеров)
      threads: 4   # Количество параллельных потоков

# Multiple profiles (for multiple projects)
my_second_project_profile:
  target: dev
  outputs:
    dev:
      type: snowflake  # Example adapter
      account: account
      user: user
      password: password
      database: database
      schema: schema
      warehouse: warehouse
      threads: 4
```

</File>

### Переменные окружения

Используйте переменные окружения, чтобы не хранить конфиденциальные учетные данные в файле `profiles.yml`. Дополнительную информацию см. в справочнике по [env_var](/reference/dbt-jinja-functions/env_var).

Пример:

<File name='~/.dbt/profiles.yml'>

```yml
my_profile:
  target: dev
  outputs:
    dev:
      type: ADAPTER_NAME
      account: "{{ env_var('ADAPTER_ACCOUNT') }}"
      user: "{{ env_var('ADAPTER_USER') }}"
      password: "{{ env_var('ADAPTER_PASSWORD') }}"
      database: "{{ env_var('ADAPTER_DATABASE') }}"
      schema: "{{ env_var('ADAPTER_SCHEMA') }}"
      warehouse: "{{ env_var('ADAPTER_WAREHOUSE') }}"
      role: "{{ env_var('ADAPTER_ROLE') }}"
      threads: 4
```

</File>

При локальном использовании dbt вы также можете хранить переменные окружения в файле `.env` в корневом каталоге проекта вместо того, чтобы задавать их непосредственно в командной оболочке. dbt, расширение dbt для VS Code и <Constant name="dbt"/> v1.12+ автоматически загружают файл `.env` из текущего рабочего каталога. Переменные окружения, заданные в командной оболочке, имеют приоритет над значениями из файла `.env`. Дополнительную информацию см. в разделе [О функции env_var](/reference/dbt-jinja-functions/env_var#using-the-env-file).

Чтобы учетные данные не попадали в систему контроля версий, добавьте `.env` в файл `.gitignore` &mdash; в новых проектах, созданных с помощью `dbt init` в версии v1.12 и выше, эта запись включена по умолчанию.

## Пользовательская конфигурация

Вы можете задать значения глобальных настроек по умолчанию для всех проектов, которые запускаете на локальном компьютере. Подробнее см. в разделе [О глобальных настройках](/reference/global-configs/about-global-configs).

## Целевые окружения в профилях

dbt поддерживает несколько целевых окружений в одном профиле, чтобы способствовать использованию отдельных сред разработки и промышленной эксплуатации, как описано в разделе [Окружения dbt](/docs/local/dbt-environments).

Типичный профиль аналитика, использующего dbt локально, содержит целевое окружение с именем `dev`, которое выбрано по умолчанию.

В вашем профиле также может быть целевое окружение `prod`, в котором объекты создаются в промышленной схеме. Однако, поскольку промышленные запуски часто требуется выполнять по расписанию, мы рекомендуем развертывать проект dbt на отдельном компьютере, а не на локальном. У большинства пользователей dbt в профиле на локальном компьютере есть только целевое окружение `dev`.

Если в вашем профиле несколько целевых окружений и вы хотите использовать не то, которое выбрано по умолчанию, укажите флаг `--target` при выполнении команды dbt.

Например, чтобы выполнить запуск в целевом окружении `prod` вместо используемого по умолчанию `dev`:

```bash
dbt run --target prod
```

Флаг `--target` можно использовать с любой командой dbt, например:

```bash
dbt build --target prod
dbt test --target dev
dbt compile --target qa
```

### Переопределение профилей и целевых окружений

При выполнении команд dbt вы можете указать используемые профиль и целевое окружение через CLI с помощью [флагов](/reference/global-configs/about-global-configs#available-flags) `--profile` и `--target`. Эти флаги переопределяют настройки из `dbt_project.yml`, при условии что указанные профиль и целевое окружение уже определены в файле `profiles.yml`.

Чтобы запустить проект dbt с профилем или целевым окружением, отличным от выбранных по умолчанию, используйте следующие флаги CLI:
- Флаг `--profile` &mdash; переопределяет профиль, заданный в `dbt_project.yml`, указывая на другой профиль, определенный в `profiles.yml`.
- Флаг `--target` &mdash; указывает целевое окружение внутри этого профиля (как определено в `profiles.yml`).

Эти флаги полезны, когда вы работаете с несколькими профилями и целевыми окружениями и хотите переопределить значения по умолчанию, не изменяя файлы.

```bash
dbt run --profile my-profile-name --target dev
```
В этом примере команда `dbt run` будет использовать профиль `my-profile-name` и целевое окружение `dev`.

## Учетные данные хранилища данных

Мы рекомендуем каждому пользователю dbt иметь собственные учетные данные для базы данных, а для промышленных запусков dbt использовать отдельного пользователя — это помогает выявлять проблемные запросы, упрощает управление владельцами схем и повышает безопасность.

Чтобы dbt мог работать с учетными данными пользователя, указанными в целевом окружении, необходимо убедиться, что у пользователя есть соответствующие привилегии. Хотя конкретные необходимые привилегии зависят от хранилища данных, как минимум ваш пользователь должен иметь возможность:

* Читать исходные данные
* Создавать схемы¹
* Читать системные <Term id="table">таблицы</Term>

:::info Запуск dbt без привилегии на создание схем

Если вашему пользователю нельзя предоставить привилегию на создание схем, запуски dbt должны быть нацелены на существующую схему, в которой у пользователя есть разрешение на создание объектов базы данных.

:::

## Целевые схемы

Целевая схема — это схема по умолчанию, в которой dbt создает объекты. Она часто используется для разграничения отдельных окружений внутри хранилища данных.

:::info Схемы в BigQuery

Для единообразия dbt использует термин «схема» в целевом окружении для всех поддерживаемых хранилищ данных. Обратите внимание: в BigQuery схема фактически представляет собой набор данных (dataset).

:::

Схему, используемую в промышленном окружении, следует называть так, чтобы было понятно: она готова к использованию конечными пользователями для анализа — мы часто называем ее `analytics`.

Для разработки хорошо зарекомендовал себя подход, при котором схема в целевом окружении `dev` называется `dbt_<username>`. Добавление имени пользователя в качестве суффикса к имени схемы позволяет нескольким пользователям вести разработку в dbt: у каждого будет собственная отдельная схема для разработки, поэтому пользователи не будут перезаписывать объекты друг друга, а владельцы объектов и права доступа будут согласованы в пределах всей схемы.

Обратите внимание, что создавать целевую схему заранее не нужно — при запуске dbt проверит, существует ли она, и создаст ее при необходимости.

Хотя целевая схема представляет собой схему, которую dbt использует по умолчанию, иногда имеет смысл распределить модели по отдельным схемам. Это можно сделать с помощью [пользовательских схем](/docs/build/custom-schemas).

## Потоки выполнения

При запуске dbt создает направленный ациклический граф (DAG) связей между моделями. Количество потоков определяет максимальное число путей в графе, которые dbt может обрабатывать одновременно — увеличение количества потоков может сократить время выполнения вашего проекта. По умолчанию в пользовательских профилях задано 4 потока.

Дополнительную информацию см. в разделе [Использование потоков](/docs/running-a-dbt-project/using-threads).
