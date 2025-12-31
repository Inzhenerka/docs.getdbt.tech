---
title: "Конфигурации Vertica"
id: "vertica-configs"
---
## Конфигурация инкрементальных моделей {#configuration-of-incremental-models}

### Использование параметра конфигурации on_schema_change {#using-the-onschemachange-config-parameter}

Вы можете использовать параметр `on_schema_change` со значениями `ignore`, `fail` и `append_new_columns`. Значение `sync_all_columns` в настоящее время не поддерживается.

#### Конфигурация параметра `ignore` (по умолчанию) {#configuring-the-ignore-default-parameter}

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', }
  ]
}>

<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
    
    {{config(materialized = 'incremental',on_schema_change='ignore')}} 
    
    select * from {{ ref('seed_added') }}


```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
      insert into "VMart"."public"."merge" ("id", "name", "some_date")
    (
        select "id", "name", "some_date"
        from "merge__dbt_tmp"
    )

```
</File>
</TabItem>
</Tabs>


#### Конфигурация параметра `fail` {#configuring-the-fail-parameter}

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
      {{config(materialized = 'incremental',on_schema_change='fail')}} 
      
      
      select * from {{ ref('seed_added') }}


```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```text
    
            The source and target schemas on this incremental model are out of sync!
              They can be reconciled in several ways:
                - set the `on_schema_change` config to either append_new_columns or sync_all_columns, depending on your situation.
                - Re-run the incremental model with `full_refresh: True` to update the target schema.
                - update the schema manually and re-run the process.

              Additional troubleshooting context:
                 Source columns not in target: {{ schema_changes_dict['source_not_in_target'] }}
                 Target columns not in source: {{ schema_changes_dict['target_not_in_source'] }}
                 New column types: {{ schema_changes_dict['new_target_types'] }}
```
</File>
</TabItem>
</Tabs>


#### Конфигурация параметра `append_new_columns` {#configuring-the-appendnewcolumns-parameter}

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>

<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
    
   
{{ config( materialized='incremental', on_schema_change='append_new_columns') }}



    select * from  public.seed_added


```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
          insert into "VMart"."public"."over" ("id", "name", "some_date", "w", "w1", "t1", "t2", "t3")
          (
                select "id", "name", "some_date", "w", "w1", "t1", "t2", "t3"
                from "over__dbt_tmp"
          )



```
</File>
</TabItem>
</Tabs>

### Использование параметра конфигурации `incremental_strategy` {#using-the-incremental_strategy-config-parameter}

**Стратегия `append` (по умолчанию)**:

Вставка новых записей без обновления или перезаписи существующих данных. `append` добавляет только новые записи на основе условия, указанного в условном блоке `is_incremental()`.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql

{{ config(  materialized='incremental',     incremental_strategy='append'  ) }} 


    select * from  public.product_dimension


    {% if is_incremental() %} 
    
        where product_key > (select max(product_key) from {{this }}) 
    
    
    {% endif %}
```

</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
   insert into "VMart"."public"."samp" (

        "product_key", "product_version", "product_description", "sku_number", "category_description", 
        "department_description", "package_type_description", "package_size", "fat_content", "diet_type",
        "weight", "weight_units_of_measure", "shelf_width", "shelf_height", "shelf_depth", "product_price",
        "product_cost", "lowest_competitor_price", "highest_competitor_price", "average_competitor_price", "discontinued_flag")
    (
          select "product_key", "product_version", "product_description", "sku_number", "category_description", "department_description", "package_type_description", "package_size", "fat_content", "diet_type", "weight", "weight_units_of_measure", "shelf_width", "shelf_height", "shelf_depth", "product_price", "product_cost", "lowest_competitor_price", "highest_competitor_price", "average_competitor_price", "discontinued_flag"

          from "samp__dbt_tmp"
    )


```
</File>
</TabItem>
</Tabs>



**Стратегия `merge`**:

Сопоставление записей на основе `unique_key`; обновление старых записей, вставка новых. (Если `unique_key` не указан, все новые данные вставляются, аналогично `append`.) Параметр конфигурации `unique_key` обязателен для использования стратегии `merge`, значение, принимаемое этим параметром, — это один столбец таблицы.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql

      {{ config( materialized = 'incremental', incremental_strategy = 'merge',  unique_key='promotion_key'   )  }}
      
      
          select * FROM  public.promotion_dimension


```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
       

      merge into "VMart"."public"."samp" as DBT_INTERNAL_DEST using "samp__dbt_tmp" as DBT_INTERNAL_SOURCE
          on DBT_INTERNAL_DEST."promotion_key" = DBT_INTERNAL_SOURCE."promotion_key"
  
        when matched then update set
        "promotion_key" = DBT_INTERNAL_SOURCE."promotion_key", "price_reduction_type" = DBT_INTERNAL_SOURCE."price_reduction_type", "promotion_media_type" = DBT_INTERNAL_SOURCE."promotion_media_type", "display_type" = DBT_INTERNAL_SOURCE."display_type", "coupon_type" = DBT_INTERNAL_SOURCE."coupon_type", "ad_media_name" = DBT_INTERNAL_SOURCE."ad_media_name", "display_provider" = DBT_INTERNAL_SOURCE."display_provider", "promotion_cost" = DBT_INTERNAL_SOURCE."promotion_cost", "promotion_begin_date" = DBT_INTERNAL_SOURCE."promotion_begin_date", "promotion_end_date" = DBT_INTERNAL_SOURCE."promotion_end_date"
        
        when not matched then insert
          ("promotion_key", "price_reduction_type", "promotion_media_type", "display_type", "coupon_type",
           "ad_media_name", "display_provider", "promotion_cost", "promotion_begin_date", "promotion_end_date")
        values
        (
          DBT_INTERNAL_SOURCE."promotion_key", DBT_INTERNAL_SOURCE."price_reduction_type", DBT_INTERNAL_SOURCE."promotion_media_type", DBT_INTERNAL_SOURCE."display_type", DBT_INTERNAL_SOURCE."coupon_type", DBT_INTERNAL_SOURCE."ad_media_name", DBT_INTERNAL_SOURCE."display_provider", DBT_INTERNAL_SOURCE."promotion_cost", DBT_INTERNAL_SOURCE."promotion_begin_date", DBT_INTERNAL_SOURCE."promotion_end_date"
        )


```
</File>
</TabItem>
</Tabs>



###### Использование параметра конфигурации `merge_update_columns` {#using-the-mergeupdatecolumns-config-parameter}

Параметр конфигурации `merge_update_columns` передается для обновления только указанных столбцов и принимает список столбцов таблицы.

 

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql

    {{ config( materialized = 'incremental', incremental_strategy='merge', unique_key = 'id', merge_update_columns = ["names", "salary"] )}}
    
        select * from {{ref('seed_tc1')}}

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
        merge into "VMart"."public"."test_merge" as DBT_INTERNAL_DEST using "test_merge__dbt_tmp" as DBT_INTERNAL_SOURCE on  DBT_INTERNAL_DEST."id" = DBT_INTERNAL_SOURCE."id"
        
        when matched then update set
          "names" = DBT_INTERNAL_SOURCE."names", "salary" = DBT_INTERNAL_SOURCE."salary"
        
        when not matched then insert
        ("id", "names", "salary")
        values
        (
          DBT_INTERNAL_SOURCE."id", DBT_INTERNAL_SOURCE."names", DBT_INTERNAL_SOURCE."salary"
        )
```
</File>
</TabItem>
</Tabs>


**Стратегия `delete+insert`**: 

С помощью инкрементальной стратегии `delete+insert` вы можете указать dbt использовать двухэтапный инкрементальный подход. Сначала он удалит записи, обнаруженные через настроенный блок `is_incremental()`, а затем повторно вставит их. Параметр `unique_key` обязателен для использования стратегии `delete+insert`, который указывает, как обновлять записи при наличии дублированных данных. Значение, принимаемое этим параметром, — это один столбец таблицы.




<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql

    {{ config( materialized = 'incremental', incremental_strategy = 'delete+insert',  unique_key='date_key'   )  }}


          select * FROM  public.date_dimension

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
        delete from "VMart"."public"."samp"
            where (
                date_key) in (
                select (date_key)
                from "samp__dbt_tmp"
            );

        insert into "VMart"."public"."samp" (
             "date_key", "date", "full_date_description", "day_of_week", "day_number_in_calendar_month", "day_number_in_calendar_year", "day_number_in_fiscal_month", "day_number_in_fiscal_year", "last_day_in_week_indicator", "last_day_in_month_indicator", "calendar_week_number_in_year", "calendar_month_name", "calendar_month_number_in_year", "calendar_year_month", "calendar_quarter", "calendar_year_quarter", "calendar_half_year", "calendar_year", "holiday_indicator", "weekday_indicator", "selling_season")
        (
            select "date_key", "date", "full_date_description", "day_of_week", "day_number_in_calendar_month", "day_number_in_calendar_year", "day_number_in_fiscal_month", "day_number_in_fiscal_year", "last_day_in_week_indicator", "last_day_in_month_indicator", "calendar_week_number_in_year", "calendar_month_name", "calendar_month_number_in_year", "calendar_year_month", "calendar_quarter", "calendar_year_quarter", "calendar_half_year", "calendar_year", "holiday_indicator", "weekday_indicator", "selling_season"
            from "samp__dbt_tmp"
        );

  ```
  </File>
</TabItem>
</Tabs>

**Стратегия `insert_overwrite`**:

Стратегия `insert_overwrite` не использует полное сканирование таблицы для удаления записей. Вместо удаления записей она удаляет целые разделы. Эта стратегия может принимать параметры `partition_by_string` и `partitions`. Вы предоставляете эти параметры, когда хотите перезаписать часть таблицы.

`partition_by_string` принимает выражение, на основе которого происходит разбиение таблицы на разделы. Это предложение PARTITION BY в Vertica.

`partitions` принимает список значений в столбце раздела.

Параметр конфигурации `partitions` должен использоваться с осторожностью. Две ситуации, которые следует учитывать:  
- Меньше разделов в параметре `partitions`, чем в условии where: в целевой таблице появляются дубликаты.
- Больше разделов в параметре `partitions`, чем в условии where: в целевой таблице отсутствуют строки. Меньше строк в целевой таблице, чем в исходной.

Чтобы узнать больше о предложении PARTITION BY, ознакомьтесь [здесь](https://www.vertica.com/docs/9.2.x/HTML/Content/Authoring/SQLReferenceManual/Statements/partition-clause.htm)
 
:::info Примечание:

Параметр `partitions` является необязательным, если параметр `partitions` не предоставлен, разделы в условии where будут удалены из целевой таблицы и вставлены обратно из исходной. Если вы используете условие where, вам может не понадобиться параметр `partitions`.

Условие where также является необязательным, но если оно не предоставлено, то все данные из источника вставляются в целевую таблицу. 

Если не предоставлено условие where и параметр `partitions`, то все разделы из таблицы удаляются и вставляются снова.

Если параметр `partitions` предоставлен, но условие where не предоставлено, в целевой таблице появляются дубликаты, потому что разделы в параметре `partitions` удаляются, но все данные из исходной таблицы (без условия where) вставляются в целевую.

Параметр конфигурации `partition_by_string` также является необязательным. Если параметр `partition_by_string` не предоставлен, то он ведет себя как `delete+insert`. Он удаляет все записи из целевой таблицы и затем вставляет все записи из исходной. Он не будет использовать или удалять разделы.

Если оба параметра `partition_by_string` и `partitions` не предоставлены, то стратегия `insert_overwrite` очищает целевую таблицу и вставляет данные из исходной таблицы в целевую.

Если вы хотите использовать параметр `partitions`, то вам нужно разбить таблицу на разделы, передав параметр `partition_by_string`.

:::


<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{config(materialized = 'incremental',incremental_strategy = 'insert_overwrite',partition_by_string='YEAR(cc_open_date)',partitions=['2023'])}}


        select * from online_sales.call_center_dimension
```
</File>
</TabItem>
<TabItem value="run">


<File name='vertica_incremental.sql'>

```sql

        select PARTITION_TABLE('online_sales.update_call_center_dimension');

        SELECT DROP_PARTITIONS('online_sales.update_call_center_dimension', '2023', '2023');
      
        SELECT PURGE_PARTITION('online_sales.update_call_center_dimension', '2023');
      
        insert into "VMart"."online_sales"."update_call_center_dimension"

        ("call_center_key", "cc_closed_date", "cc_open_date", "cc_name", "cc_class", "cc_employees",
       
        "cc_hours", "cc_manager", "cc_address", "cc_city", "cc_state", "cc_region")
      
        (

            select "call_center_key", "cc_closed_date", "cc_open_date", "cc_name", "cc_class", "cc_employees",
        
            "cc_hours", "cc_manager", "cc_address", "cc_city", "cc_state", "cc_region"

            from "update_call_center_dimension__dbt_tmp"
        );


  ```
 </File>
</TabItem>
</Tabs>



## Опции оптимизации для материализации таблиц {#optimization-options-for-table-materialization}

Существует множество оптимизаций, которые можно использовать при материализации моделей в виде таблиц. Каждый параметр конфигурации применяет специфичное для Vertica предложение в сгенерированном DDL `CREATE TABLE`. 

Для получения дополнительной информации смотрите [Vertica](https://www.vertica.com/docs/12.0.x/HTML/Content/Authoring/SQLReferenceManual/Statements/CREATETABLE.htm) опции для оптимизации таблиц.

Вы можете настроить эти оптимизации в своем SQL-файле модели, как описано в примерах ниже: 

### Конфигурация предложения `ORDER BY` {#configuring-the-order-by-clause}

Чтобы использовать предложение `ORDER BY` в операторе `CREATE TABLE`, используйте параметр конфигурации `order_by` в вашей модели. 

#### Использование параметра конфигурации `order_by` {#using-the-order_by-config-parameter}

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>

<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
        {{ config(  materialized='table',  order_by='product_key') }} 
    
        select * from public.product_dimension


```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql

        create  table  "VMart"."public"."order_s__dbt_tmp" as 
            
             ( select * from public.product_dimension)
              
                 order by product_key;

  ```
 </File>
</TabItem>
</Tabs>

### Конфигурация предложения `SEGMENTED BY` {#configuring-the-segmented-by-clause}

Чтобы использовать предложение `SEGMENTED BY` в операторе `CREATE TABLE`, используйте параметры конфигурации `segmented_by_string` или `segmented_by_all_nodes` в вашей модели. По умолчанию для сегментации таблиц используется ALL NODES, поэтому предложение ALL NODES в SQL-операторе будет добавлено при использовании параметра конфигурации `segmented_by_string`. Вы можете отключить ALL NODES, используя параметр `no_segmentation`.

Чтобы узнать больше о предложении segmented by, ознакомьтесь [здесь](https://www.vertica.com/docs/12.0.x/HTML/Content/Authoring/SQLReferenceManual/Statements/hash-segmentation-clause.htm).


#### Использование параметра конфигурации `segmented_by_string` {#using-the-segmentedbystring-config-parameter}

Параметр конфигурации `segmented_by_string` может использоваться для сегментации данных проекции с использованием SQL-выражения, такого как хеш-сегментация.



<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
   
        {{ config( materialized='table', segmented_by_string='product_key'  )  }}  
        
        
        select * from public.product_dimension

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
      create  table
        
        "VMart"."public"."segmented_by__dbt_tmp"
        
        as (select * from public.product_dimension)
          
             segmented by product_key  ALL NODES;

  ```

</File>
</TabItem>
</Tabs>

#### Использование параметра конфигурации `segmented_by_all_nodes` {#using-the-segmentedbyall_nodes-config-parameter}

Параметр конфигурации `segmented_by_all_nodes` может использоваться для сегментации данных проекции для распределения по всем узлам кластера.

:::info Примечание:

 Если вы хотите передать параметр `segmented_by_all_nodes`, то вам нужно сегментировать таблицу, передав параметр `segmented_by_string`.

:::

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
        {{ config( materialized='table', segmented_by_string='product_key' ,segmented_by_all_nodes='True' )  }}  
        
            select * from public.product_dimension


```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
          
        create  table   "VMart"."public"."segmented_by__dbt_tmp" as
              
          (select * from public.product_dimension)
                  
            segmented by product_key  ALL NODES;

  ```
   </File>
</TabItem>
</Tabs>

### Конфигурация предложения UNSEGMENTED ALL NODES {#configuring-the-unsegmented-all-nodes-clause}

Чтобы использовать предложение `UNSEGMENTED ALL NODES` в операторе `CREATE TABLE`, используйте параметр конфигурации `no_segmentation` в вашей модели.

#### Использование параметра конфигурации `no_segmentation` {#using-the-no_segmentation-config-parameter}


<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>

<TabItem value="source">
<File name='vertica_incremental.sql'>

```sql
      
     {{config(materialized='table',no_segmentation='true')}}


          select * from public.product_dimension

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
       
  
           create  table
                      "VMart"."public"."ww__dbt_tmp"
    
                   INCLUDE SCHEMA PRIVILEGES as (
    
                select * from public.product_dimension )
                
                        UNSEGMENTED ALL NODES ;
    
  

 ```

</File>
</TabItem>
</Tabs>


### Конфигурация предложения `PARTITION BY` {#configuring-the-partition-by-clause}

Чтобы использовать предложение `PARTITION BY` в операторе `CREATE TABLE`, используйте параметры конфигурации `partition_by_string`, `partition_by_active_count` или `partition_by_group_by_string` в вашей модели. 

Чтобы узнать больше о предложении partition by, ознакомьтесь [здесь](https://www.vertica.com/docs/9.2.x/HTML/Content/Authoring/SQLReferenceManual/Statements/partition-clause.htm)

#### Использование параметра конфигурации `partition_by_string` {#using-the-partitionbystring-config-parameter}

`partition_by_string` (необязательный) принимает строковое значение любого одного конкретного `column_name`, на основе которого происходит разбиение данных таблицы на разделы.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
      
      {{ config( materialized='table', partition_by_string='employee_age' )}} 
    
      
        select * FROM public.employee_dimension

```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
        create table "VMart"."public"."test_partition__dbt_tmp" as 
        
        ( select * FROM public.employee_dimension); 
        
        alter table "VMart"."public"."test_partition__dbt_tmp"
         
        partition BY employee_age


 ```

</File>
</TabItem>
</Tabs>

#### Использование параметра конфигурации `partition_by_active_count` {#using-the-partitionbyactive_count-config-parameter}

`partition_by_active_count` (необязательный) указывает, сколько разделов активно для этой таблицы. Он принимает целочисленное значение.

:::info Примечание:

 Если вы хотите передать параметр `partition_by_active_count`, то вам нужно разбить таблицу на разделы, передав параметр `partition_by_string`.

:::


<Tabs
  defaultValue="source"
  values= {[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
    {{ config( materialized='table', 
    partition_by_string='employee_age',    
    partition_by_group_by_string="""
                                  CASE WHEN employee_age < 5 THEN 1
                                  WHEN employee_age>50 THEN 2
                                  ELSE 3 END""",
    
    partition_by_active_count = 2) }}


      select * FROM public.employee_dimension
 
 
 ```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
    
    create  table "VMart"."public"."test_partition__dbt_tmp" as
      
      ( select * FROM public.employee_dimension );
          
          alter table "VMart"."public"."test_partition__dbt_tmp" partition BY employee_ag  
          
            group by CASE WHEN employee_age < 5 THEN 1
        
        WHEN employee_age>50 THEN 2
        
        ELSE 3 END
        
        SET ACTIVEPARTITIONCOUNT 2  ;
   ```
</File>
</TabItem>
</Tabs>

#### Использование параметра конфигурации `partition_by_group_by_string` {#using-the-partitionbygroupbystring-config-parameter}

Параметр `partition_by_group_by_string` (необязательный) принимает строку, в которой пользователь должен указать каждую группу случаев в виде одной строки.

 Это значение выводится из значения `partition_by_string`.
 
 Параметр `partition_by_group_by_string` используется для объединения разделов в отдельные группы разделов. 

 
:::info Примечание:

 Если вы хотите передать параметр `partition_by_group_by_string`, то вам нужно разбить таблицу на разделы, передав параметр `partition_by_string`.

:::



<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql

    {{config(materialized='table',
    partition_by_string='number_of_children', 
    partition_by_group_by_string="""
                                  CASE WHEN number_of_children <= 2 THEN 'small_family'
                                  ELSE 'big_family' END""")}}
select * from public.customer_dimension
```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
      create  table "VMart"."public"."test_partition__dbt_tmp"  INCLUDE SCHEMA PRIVILEGES as 
    
        ( select * from public.customer_dimension ) ; 
        
      alter table "VMart"."public"."test_partition__dbt_tmp" 
      partition BY number_of_children
      group by CASE WHEN number_of_children <= 2 THEN 'small_family'
                                             ELSE 'big_family' END  ;
  ```

</File>
</TabItem>
</Tabs>

### Конфигурация предложения KSAFE {#configuring-the-ksafe-clause}

Чтобы использовать предложение `KSAFE` в операторе `CREATE TABLE`, используйте параметр конфигурации `ksafe` в вашей модели.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Исходный код', value: 'source', },
    { label: 'Код выполнения', value: 'run', },
  ]
}>


<TabItem value="source">

<File name='vertica_incremental.sql'>

```sql
{{  config(  materialized='table',    ksafe='1'   ) }} 
        
          select * from  public.product_dimension


```
</File>
</TabItem>
<TabItem value="run">

<File name='vertica_incremental.sql'>

```sql
        create  table "VMart"."public"."segmented_by__dbt_tmp" as 
  
        (select * from  public.product_dimension ) 
            ksafe 1;
```
</File>
</TabItem>
</Tabs>