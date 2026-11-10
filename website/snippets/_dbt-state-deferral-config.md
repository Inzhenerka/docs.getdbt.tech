По умолчанию dbt State использует ваше окружение production для отложенного разрешения ссылок (deferral). Чтобы выбрать окружение для deferral в dbt State, настройте его в соответствии с вашим вариантом развертывания:

- **<Constant name="dbt_platform" />**: Добавьте `project-id` (и при необходимости `defer-env-id`) в блок конфигурации `dbt-cloud` в `dbt_project.yml`. Подробнее см. в разделе [Настройка CLI платформы dbt](/docs/platform/dbt-cli-installation).

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    project-id: <your-project-id>
    defer-env-id: <your-production-environment-id>  # optional
  ```

  </File>

- **Самостоятельное развертывание**: Добавьте `state-org-id` в блок конфигурации `dbt-cloud` в `dbt_project.yml`. По умолчанию dbt State использует целевую конфигурацию с именем `prod`.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    state-org-id: <your-org-id>
  ```

  </File>

  Чтобы использовать другую целевую конфигурацию или окружение (например, staging) для deferral, измените [`defer_to_target`](/reference/resource-configs/defer-to-target) в `profiles.yml`.

  <File name="profiles.yml">

  ```yaml
  my_project:
    outputs:
      uat:
        type: snowflake
        # ... connection settings
        defer_to_target: staging
  ```

  </File>

Вы также можете передать `--state` или `--defer-state`, чтобы явно указать dbt State конкретный файл `manifest.json` в качестве источника достоверных данных для клонирования объектов.

:::note
Если вы переопределили макросы `generate_*_name()`, используя значения, определяемые во время выполнения (например, переменные окружения, пути к файлам или даты), предоставьте файл `manifest.json`, чтобы dbt State мог корректно определить расположение объектов. Без этого файла расположение объектов определяется на основе ваших макросов и целевой конфигурации профиля, что в таких случаях может привести к неверному результату. См. раздел [Оговорки при использовании dbt State без манифеста](/reference/resource-configs/defer-to-target#caveats-to-dbt-state-without-a-manifest).
:::
