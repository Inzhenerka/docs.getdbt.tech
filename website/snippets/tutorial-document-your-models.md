Добавление [документации](/docs/build/documentation) в ваш проект позволяет подробно описывать ваши модели и делиться этой информацией с вашей командой. Здесь мы добавим базовую документацию в наш проект.

1. Обновите ваш файл `models/schema.yml`, чтобы включить в него некоторые описания, как показано ниже.

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: customers
        description: Одна запись на каждого клиента
        columns:
          - name: customer_id
            description: Первичный ключ
            tests:
              - unique
              - not_null
          - name: first_order_date
            description: NULL, если клиент еще не сделал заказ.

      - name: stg_customers
        description: Эта модель очищает данные о клиентах
        columns:
          - name: customer_id
            description: Первичный ключ
            tests:
              - unique
              - not_null

      - name: stg_orders
        description: Эта модель очищает данные о заказах
        columns:
          - name: order_id
            description: Первичный ключ
            tests:
              - unique
              - not_null
          - name: status
            tests:
              - accepted_values:
                  values: ['placed', 'shipped', 'completed', 'return_pending', 'returned']
          - name: customer_id
            tests:
              - not_null
              - relationships:
                  to: ref('stg_customers')
                  field: customer_id
    ```

    </File>

2. Запустите `dbt docs generate`, чтобы сгенерировать документацию для вашего проекта. dbt анализирует ваш проект и ваш склад данных, чтобы создать <Term id="json" /> файл с подробной документацией о вашем проекте.