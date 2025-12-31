---
title: Путь к ресурсам
description: "Узнайте, как использовать пути к ресурсам для настройки типов ресурсов в dbt."
id: resource-path
sidebar_label: "О путях к ресурсам"
---

В этой документации используется номенклатура `<resource-path>` для описания настройки типов ресурсов, таких как модели, семена, снимки, тесты, источники и другие, из вашего файла `dbt_project.yml`.

Она представляет собой вложенные ключи словаря, которые предоставляют путь к директории этого типа ресурса или к отдельному экземпляру этого типа ресурса по имени.

```yml
resource_type:
  project_name:
    directory_name:
      subdirectory_name:
        instance_of_resource_type (по имени):
          ...
```

## Пример {#example}

Следующие примеры в основном относятся к моделям и источнику, но те же концепции применимы к семенам, снимкам, тестам, источникам и другим типам ресурсов.

### Применение конфигурации ко всем моделям {#apply-config-to-all-models}

Чтобы применить конфигурацию ко всем моделям, не используйте `<resource-path>`:

<File name='dbt_project.yml'>

```yml
models:
  +enabled: false # это отключит все модели (возможно, не то, что вы хотите сделать)
```

</File>

### Применение конфигурации ко всем моделям в вашем проекте {#apply-config-to-all-models-in-your-project}

Чтобы применить конфигурацию ко всем моделям только в _вашем_ проекте, используйте [имя вашего проекта](/reference/project-configs/name) в качестве `<resource-path>`:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    +enabled: false # это применится ко всем моделям в вашем проекте, но не к установленным пакетам
```

</File>

### Применение конфигурации ко всем моделям в поддиректории {#apply-config-to-all-models-in-a-subdirectory}

Чтобы применить конфигурацию ко всем моделям в поддиректории вашего проекта, например, `staging`, вложите директорию под именем проекта:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    staging:
      +enabled: false # это применится ко всем моделям в директории `staging/` вашего проекта
```

</File>

В следующем проекте это применится к моделям в директории `staging/`, но не в директории `marts/`:
```
.
├── dbt_project.yml
└── models
    ├── marts
    └── staging

```

### Применение конфигурации к конкретной модели {#apply-config-to-a-specific-model}

Чтобы применить конфигурацию к конкретной модели, вложите полный путь под именем проекта. Для модели в `/staging/stripe/payments.sql` это будет выглядеть так:

<File name='dbt_project.yml'>

```yml
name: jaffle_shop

models:
  jaffle_shop:
    staging:
      stripe:
        payments:
          +enabled: false # это применится только к одной модели
```

</File>

В следующем проекте это применится только к модели `payments`:

```
.
├── dbt_project.yml
└── models
    ├── marts
    │   └── core
    │       ├── dim_customers.sql
    │       └── fct_orders.sql
    └── staging
        ├── jaffle_shop
        │   ├── customers.sql
        │   └── orders.sql
        └── stripe
            └── payments.sql

```
### Применение конфигурации к источнику, вложенному в подкаталог {#apply-config-to-a-source-nested-in-a-subfolder}

Чтобы отключить таблицу источника, вложенную в YAML-файл в подкаталоге, вам нужно указать подкаталог(и) в пути к этому YAML-файлу, а также имя источника и имя таблицы в файле `dbt_project.yml`.<br /><br />
Следующий пример показывает, как отключить таблицу источника, вложенную в YAML-файл в подкаталоге:

<File name='dbt_project.yml'>

```yaml
sources:
  your_project_name:
    subdirectory_name:
      source_name:
        source_table_name:
          +enabled: false
```
</File>