Теперь вы можете удалить файлы, которые dbt создал при инициализации проекта:

1. Удалите директорию `models/example/`.
2. Удалите ключ `example:` из вашего файла `dbt_project.yml`, а также любые конфигурации, которые перечислены под ним.

    <File name='dbt_project.yml'>

    ```yaml
    # до
    models:
      jaffle_shop:
        +materialized: table
        example:
          +materialized: view
    ```

    </File>

    <File name='dbt_project.yml'>

    ```yaml
    # после
    models:
      jaffle_shop:
        +materialized: table
    ```

    </File>

3. Сохраните изменения.

#### Часто задаваемые вопросы {#faqs}

<FAQ path="Models/removing-deleted-models" />
<FAQ path="Troubleshooting/unused-model-configurations" />