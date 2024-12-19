---
resource_types: [models]
title: включить
required: нет
---


<File name='models/<schema>.yml'>

```yml
version: 2

models:
  
  # свойства модели верхнего уровня
  - name: <model_name>
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # обязательно
    
    # версии этой модели
    [versions](/reference/resource-properties/versions):
      - v: <version_identifier> # обязательно
        columns:
          - include: '*' | 'all' | [<column_name>, ...]
            exclude:
              - <column_name>
              - ... # укажите дополнительные имена столбцов для исключения
          
          # укажите дополнительные столбцы -- это могут быть переопределения из верхнего уровня или дополнения
          - name: <column_name>
            ...

```

</File>

## Определение
Спецификация того, какие столбцы определены в свойстве верхнего уровня `columns` модели для включения или исключения в версии этой модели.

`include` может быть:
- списком конкретных имен столбцов для включения
- `'*'` или `'all'`, что указывает на то, что **все** столбцы из свойства верхнего уровня `columns` должны быть включены в версию модели

`exclude` — это список имен столбцов для исключения. Он может быть объявлен только в том случае, если `include` установлено на одно из значений `'*'` или `'all'`. 

Список `columns` версии модели может содержать _не более одного_ элемента `include/exclude`.

Вы можете объявить дополнительные столбцы в списке `columns` версии. Если имя столбца, специфичного для версии, совпадает с именем столбца, включенным из верхнего уровня, запись, специфичная для версии, переопределит этот столбец для данной версии.

## По умолчанию

По умолчанию `include` равно "all", а `exclude` — пустой список. Это приводит к тому, что все столбцы из базовой модели включаются в версию модели.

## Пример

<File name='models/customers.yml'>

```yml
models:
  - name: customers
    columns:
      - name: customer_id
        description: Уникальный идентификатор для этой таблицы
        data_type: text
        constraints:
          - type: not_null
        tests:
          - unique
      - name: customer_country
        data_type: text
        description: "Страна, где в настоящее время проживает клиент"
      - name: first_purchase_date
        data_type: date
    
    versions:
      - v: 4
      
      - v: 3
        columns:
          - include: "*"
          - name: customer_country
            data_type: text
            description: "Страна, где клиент впервые жил на момент первой покупки"
      
      - v: 2
        columns:
          - include: "*"
            exclude:
              - customer_country
      
      - v: 1
        columns:
          - include: []
          - name: id
            data_type: int
```

</File>

Поскольку `v4` не указал никаких `columns`, он будет включать все столбцы верхнего уровня.

Каждая другая версия объявила изменение по сравнению с верхним уровнем:
- `v3` будет включать все столбцы, но переопределяет столбец `customer_country` с другим `description`
- `v2` будет включать все столбцы, *кроме* `customer_country`
- `v1` не включает *никаких* столбцов верхнего уровня. Вместо этого он объявляет только один целочисленный столбец с именем `id`.