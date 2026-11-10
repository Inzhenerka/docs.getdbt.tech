---
title: "Настройка отложенного разрешения ссылок в dbt State"
sidebar_label: "Настройка отложенного разрешения ссылок"
description: "Настройте среду, к которой dbt State обращается при отложенном разрешении ссылок, и используйте dbt State как источник сравнения для селекторов state:* в самостоятельно управляемых развертываниях."
id: "dbt-state-deferral"
tags: ['dbt State'] 
availability: everywhere_usage
---

# Настройка отложенного разрешения ссылок в dbt State

По умолчанию dbt State использует вашу производственную среду для отложенного разрешения ссылок. Настройка требуется только в том случае, если вы хотите изменить это поведение:

- **<Constant name="dbt_platform" />**: Чтобы использовать для отложенного разрешения ссылок среду, отличную от среды по умолчанию (например, staging), добавьте `defer-env-id` в блок `dbt-cloud` в `dbt_project.yml`. Подробнее см. в разделе [Настройка <Constant name="platform_cli" />](/docs/platform/dbt-cli-installation).

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    project-id: <your-project-id>
    defer-env-id: <your-environment-id>
  ```

  </File>

  :::note
  `defer-env-id` использует манифест. Если задать этот параметр, [селекторы `state:*` на основе dbt State](#dbt-state-powered-state-selectors) будут отключены. Дополнительную информацию см. в требованиях в соответствующем разделе.
  :::

- **Самостоятельно управляемые развертывания**: Если у вас нет доступа к манифесту производственной среды или среды развертывания, можно задать [`defer_to_target`](/reference/resource-configs/defer-to-target) в `profiles.yml` для автоматического отложенного разрешения ссылок по мере возможности. Обратите внимание, что у этого подхода есть известные ограничения; см. раздел [Ограничения dbt State при работе без манифеста](/reference/resource-configs/defer-to-target#caveats-to-dbt-state-without-a-manifest).

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

  В самостоятельно управляемых развертываниях можно использовать [селекторы `state:*` на основе dbt State](#dbt-state-powered-state-selectors), которые сравнивают каждый узел с его собственным последним выполнением, а не с `manifest.json` отдельного задания. Чтобы использовать эту возможность, подключите проект к <Constant name="dbt_platform" />.

Также можно передать `--state` или `--defer-state`, чтобы явно указать dbt State конкретный файл `manifest.json`.

:::note
Если вы переопределили макросы `generate_*_name()`, используя значения времени выполнения (например, переменные окружения, пути к файлам или даты), предоставьте файл `manifest.json`, чтобы dbt State мог корректно определять расположение объектов. Без этого файла расположение объектов определяется по вашим макросам и целевой конфигурации профиля, что в таких случаях может приводить к ошибкам. См. раздел [Ограничения dbt State при работе без манифеста](/reference/resource-configs/defer-to-target#caveats-to-dbt-state-without-a-manifest).
:::

## Селекторы `state:*` на основе dbt State <Lifecycle status="beta" /> {#dbt-state-powered-state-selectors}

Когда dbt State включен, [селекторы `state:*`](/reference/node-selection/methods#state) могут использовать dbt State как источник сравнения вместо отдельного файла `manifest.json` из последнего запуска задания. Каждый узел (модели, снимки, seed-файлы и тесты) сравнивается со своим собственным последним выполнением в среде [`defer_to_target`](/reference/resource-configs/defer-to-target) (по умолчанию: `prod`), поэтому узел выбирается как измененный только в том случае, если изменилась его собственная логика, независимо от того, какое задание выполняло его последним.

Эта возможность предназначена для **самостоятельно управляемых развертываний**: вы самостоятельно организуете запуски dbt (например, с помощью Airflow или GitHub Actions), а не используете задания <Constant name="dbt_platform" />. При этом для работы с dbt State по-прежнему требуется аутентификация в <Constant name="dbt_platform" /> с использованием `project-id`.

### Предварительные требования

- Для вашего проекта включен dbt State.
- В блоке `dbt-cloud` в `dbt_project.yml` задан `project-id`:

<File name="dbt_project.yml">

```yaml
dbt-cloud:
  project-id: <your-project-id>
```

</File>

:::note
При оркестрации с помощью <Constant name="dbt_platform" /> каждое задание создает `manifest.json`, поэтому dbt State использует его для сравнений `state:*` вместо истории выполнения отдельных узлов.
:::

## Укажите проект или организацию

Если у вас несколько проектов или организаций, использующих dbt State, настройте блок `dbt-cloud` в `dbt_project.yml`, чтобы dbt State знал, какой проект или какую организацию использовать:

- **Для пользователей <Constant name="dbt_platform" /> с несколькими проектами**: Добавьте `project-id`, чтобы указать, какой проект должен использовать dbt State.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    project-id: <your-project-id>
  ```

  </File>

- **Для самостоятельно управляемых развертываний с несколькими организациями dbt State**: Добавьте `state-org-id`, чтобы указать, какую организацию должен использовать dbt State.

  <File name="dbt_project.yml">

  ```yaml
  dbt-cloud:
    state-org-id: <your-org-id>
  ```

  </File>

## Связанная документация

- [Отложенное разрешение ссылок в dbt](/docs/platform/about-defer)
- [О dbt State](/docs/deploy/dbt-state-about)
- [Настройка dbt State](/docs/deploy/dbt-state-setup)
- [Параметры конфигурации dbt State](/reference/resource-configs/dbt-state-configs)
