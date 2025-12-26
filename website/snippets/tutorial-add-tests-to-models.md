Добавление [data tests](/docs/build/data-tests) в проект помогает убедиться, что ваши модели работают корректно.

Чтобы добавить data tests в проект:

1. Создайте новый YAML-файл в директории `models`, назвав его `models/schema.yml`.
2. Добавьте в файл следующее содержимое:

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: customers
        columns:
          - name: customer_id
            data_tests:
              - unique
              - not_null

      - name: stg_customers
        columns:
          - name: customer_id
            data_tests:
              - unique
              - not_null

      - name: stg_orders
        columns:
          - name: order_id
            data_tests:
              - unique
              - not_null
          - name: status
            data_tests:
              - accepted_values:
                  arguments: # available in v1.10.5 and higher. Older versions can set the <argument_name> as the top-level property.
                    values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            data_tests:
              - not_null
              - relationships:
                  arguments:
                    to: ref('stg_customers')
                    field: customer_id

    ```

    </File>

3. Запустите `dbt test` и убедитесь, что все ваши тесты прошли успешно.

Когда вы запускаете `dbt test`, dbt проходит по вашим YAML-файлам и создает запрос для каждого теста. Каждый запрос вернет количество записей, которые не прошли тест. Если это число равно 0, то тест считается успешным.

#### Часто задаваемые вопросы

<FAQ path="Tests/available-tests" alt_header="Какие тесты доступны для использования в dbt? Могу ли я добавить свои собственные тесты?" />
<FAQ path="Tests/test-one-model" />
<FAQ path="Runs/failed-tests" />
<FAQ path="Project/schema-yml-name" alt_header="Должен ли мой файл с тестами называться `schema.yml`?" />
<FAQ path="Project/why-version-2" />
<FAQ path="Tests/recommended-tests" />
<FAQ path="Tests/when-to-test" />