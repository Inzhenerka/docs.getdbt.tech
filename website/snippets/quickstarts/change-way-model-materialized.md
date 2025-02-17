Одной из самых мощных функций dbt является возможность изменять способ материализации модели в вашем хранилище данных, просто изменяя значение конфигурации. Вы можете переключаться между таблицами и представлениями, изменяя ключевое слово, вместо того чтобы писать язык определения данных (DDL) для выполнения этого за кулисами.

По умолчанию все создается как представление. Вы можете переопределить это на уровне директории, чтобы все в этой директории материализовалось по-другому.

1. Отредактируйте ваш файл `dbt_project.yml`.
    - Обновите имя вашего проекта на:
      <File name='dbt_project.yml'>

      ```yaml
      name: 'jaffle_shop'
      ```

      </File>
    - Настройте `jaffle_shop` так, чтобы все в нем материализовалось как таблица; и настройте `example` так, чтобы все в нем материализовалось как представление. Обновите блок конфигурации `models` следующим образом:

      <File name='dbt_project.yml'>

      ```yaml
      models:
        jaffle_shop:
          +materialized: table
          example:
            +materialized: view
      ```

      </File>
    - Нажмите **Сохранить**.

2. Введите команду `dbt run`. Ваша модель `customers` теперь должна быть построена как таблица!
    :::info
    Для этого dbt сначала должен был выполнить оператор `drop view` (или API вызов на BigQuery), затем оператор `create table as`.
    :::

3. Отредактируйте `models/customers.sql`, чтобы переопределить `dbt_project.yml` только для модели `customers`, добавив следующий фрагмент в начало, и нажмите **Сохранить**:

    <File name='models/customers.sql'>

    ```sql
    {{
      config(
        materialized='view'
      )
    }}

    with customers as (

        select
            id as customer_id
            ...

    )

    ```

    </File>

4. Введите команду `dbt run`. Ваша модель `customers` теперь должна быть построена как представление.
   - Пользователям BigQuery необходимо выполнить `dbt run --full-refresh` вместо `dbt run`, чтобы полностью применить изменения материализации.
5. Введите команду `dbt run --full-refresh`, чтобы изменения вступили в силу в вашем хранилище данных.

### Часто задаваемые вопросы

<FAQ path="Models/available-materializations" />
<FAQ path="Project/which-materialization" />
<FAQ path="Models/available-configurations" />