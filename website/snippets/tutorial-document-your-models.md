Добавление [документации](/docs/build/documentation) в ваш проект позволяет подробно описывать ваши модели и делиться этой информацией с вашей командой. Здесь мы добавим базовую документацию в наш проект.

Обновите файл `models/schema.yml`, добавив описания, например приведённые ниже.

    <File name='models/schema.yml'>

    ```yaml
    version: 2

    models:
      - name: customers
        description: Одна запись на каждого клиента
        columns:
          - name: customer_id
            description: Первичный ключ
            data_tests:
              - unique
              - not_null
          - name: first_order_date
            description: NULL, если клиент еще не сделал заказ.

      - name: stg_customers
        description: Эта модель очищает данные о клиентах
        columns:
          - name: customer_id
            description: Первичный ключ
            data_tests:
              - unique
              - not_null

      - name: stg_orders
        description: Эта модель очищает данные о заказах
        columns:
          - name: order_id
            description: Первичный ключ
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

<Tabs>

<TabItem value="View in Catalog" >

[<Constant name="catalog" />](/docs/explore/explore-projects) предоставляет мощные инструменты для работы с вашими проектами dbt, в том числе с документацией:

1. Выполните одну из следующих команд:
   - `dbt docs generate`, если вы используете <Constant name="core" />
   - `dbt build`, если вы используете <Constant name="fusion_engine" />
2. Нажмите **<Constant name="catalog" />** в меню навигации, чтобы открыть <Constant name="catalog" />.
3. По умолчанию <Constant name="catalog" /> отображает среду **Production**. Если в вашей учетной записи есть дополнительные среды (например, **Staging**), вы можете выбрать их в раскрывающемся списке сред.

  <Lightbox src="/img/docs/collaborate/dbt-explorer/catalog-nav-dropdown.png" width="85%" title="Выбор среды в Catalog." />

4. Выберите свой проект в дереве файлов.
5. Используйте строку поиска или просмотрите список ресурсов, чтобы найти модель `customers`.
6. Нажмите на модель, чтобы просмотреть сведения о ней, включая добавленные вами описания.

  <Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-details.png" width="85%" title="Просмотр документации модели и графа зависимостей в Catalog." />

<Constant name="catalog" /> отображает описание вашей модели, документацию столбцов, тесты данных и граф зависимостей. Вы также можете видеть, для каких столбцов отсутствует документация, и отслеживать покрытие тестами во всем проекте.

</TabItem>

<TabItem value="View in Studio IDE" >

Вы можете просматривать документацию непосредственно в IDE, если используете **v1 Latest** или другую версию <Constant name="core" />. Обратите внимание: это устаревший режим просмотра, который не обеспечивает такой же уровень интерактивности, как <Constant name="catalog" />.

1. В IDE выполните `dbt docs generate`.
2. На панели навигации нажмите значок **View docs**, расположенный справа от **имени ветки**.
   <Lightbox src="/img/docs/collaborate/dbt-explorer/docs-icon.png" width="30%" title="Значок View docs в Studio IDE." />
3. В разделе **Projects** выберите имя своего проекта и разверните папки.
4. Нажмите **models** > **marts** > **customers**.
  <Lightbox src="/img/docs/collaborate/dbt-explorer/legacy-docs-view.png" width="85%" title="Просмотр документации модели в устаревшем режиме просмотра документации." />

</TabItem>

</Tabs>
