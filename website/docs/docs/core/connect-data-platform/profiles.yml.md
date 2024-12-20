---
title: "О файле profiles.yml"
id: profiles.yml
---

Если вы используете [dbt Core](/docs/core/installation-overview), вам понадобится файл `profiles.yml`, который содержит данные для подключения к вашей платформе данных. Когда вы запускаете dbt Core из командной строки, он читает ваш файл `dbt_project.yml`, чтобы найти имя `profile`, а затем ищет профиль с таким же именем в вашем файле `profiles.yml`. Этот профиль содержит всю информацию, необходимую dbt для подключения к вашей платформе данных.

Для получения подробной информации вы можете обратиться к [Профили подключения](/docs/core/connect-data-platform/connection-profiles).

:::tip Файл `profiles.yml` не нужен для dbt Cloud
Если вы используете dbt Cloud, вы можете [подключиться к вашей платформе данных](/docs/cloud/connect-data-platform/about-connections) непосредственно в интерфейсе dbt Cloud и вам не нужен файл `profiles.yml`.
:::

Этот раздел определяет части вашего `profiles.yml`, которые не специфичны для конкретной платформы данных. Для получения конкретных данных о подключении обратитесь к соответствующей странице для вашей платформы данных.

<VersionBlock lastVersion="1.7">

:::warning Глобальные конфигурации

Начиная с dbt v1.8, глобальные конфигурации были исключены из файла `profiles.yml` и должны быть настроены в файле [`dbt_project.yml`](/reference/dbt_project.yml).

:::

<File name='profiles.yml'>

```yml
[config](/reference/global-configs/about-global-configs):
  [send_anonymous_usage_stats](/reference/global-configs/usage-stats): <true | false>
  [use_colors](/reference/global-configs/print-output#print-color): <true | false>
  [partial_parse](/reference/global-configs/parsing): <true | false>
  [printer_width](/reference/global-configs/print-output#printer-width): <integer>
  [write_json](/reference/global-configs/json-artifacts): <true | false>
  [warn_error](/reference/global-configs/warnings): <true | false>
  [warn_error_options](/reference/global-configs/warnings): <include: all | include: [<error-name>] | include: all, exclude: [<error-name>]>
  [log_format](/reference/global-configs/logs): <text | json | default>
  [debug](/reference/global-configs/logs#log-level): <true | false>
  [version_check](/reference/global-configs/version-compatibility): <true | false>
  [fail_fast](/reference/global-configs/failing-fast): <true | false>
  [indirect_selection](/reference/global-configs/indirect-selection): <eager | cautious | buildable | empty>
  [use_experimental_parser](/reference/global-configs/parsing): <true | false>
  [static_parser](/reference/global-configs/parsing): <true | false>
  [cache_selected_only](/reference/global-configs/cache): <true | false>
  [populate_cache](/reference/global-configs/cache): <true | false>

<profile-name>:
  target: <target-name> # это целевой объект по умолчанию
  outputs:
    <target-name>:
      type: <bigquery | postgres | redshift | snowflake | other>
      schema: <schema_identifier>
      threads: <natural_number>

      ### специфические для базы данных детали подключения
      ...

    <target-name>: # дополнительные целевые объекты
      ...

<profile-name>: # дополнительные профили
  ...

```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.8">

<File name='profiles.yml'>

```yml

<profile-name>:
  target: <target-name> # это целевой объект по умолчанию
  outputs:
    <target-name>:
      type: <bigquery | postgres | redshift | snowflake | other>
      schema: <schema_identifier>
      threads: <natural_number>

      ### специфические для базы данных детали подключения
      ...

    <target-name>: # дополнительные целевые объекты
      ...

<profile-name>: # дополнительные профили
  ...

```

</File>

</VersionBlock>

## Конфигурация пользователя

Вы можете установить значения по умолчанию для глобальных конфигураций для всех проектов, которые вы запускаете на вашем локальном компьютере. Обратитесь к [О глобальных конфигурациях](/reference/global-configs/about-global-configs) для получения подробностей.