---
title: Как документировать макросы?
description: "Вы можете использовать файл схемы для документирования макросов"
sidebar_label: 'Документирование макросов'
id: documenting-macros
---

Для документирования макросов используйте [файл схемы](/reference/macro-properties) и вложите конфигурации под ключом `macros:`

## Пример

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: cents_to_dollars
    description: Макрос для преобразования центов в доллары
    arguments:
      - name: column_name
        type: string
        description: Имя столбца, который вы хотите преобразовать
      - name: precision
        type: integer
        description: Количество десятичных знаков. По умолчанию 2.
```

</File>

## Документирование пользовательской материализации

Когда вы создаете [пользовательскую материализацию](/guides/create-new-materializations), dbt создает связанный макрос со следующим форматом:
```
materialization_{materialization_name}_{adapter}
```

Чтобы задокументировать пользовательскую материализацию, используйте ранее упомянутый формат для определения имени(имен) связанных макросов, которые нужно задокументировать.

<File name='macros/properties.yml'>

```yaml
version: 2

macros:
  - name: materialization_my_materialization_name_default
    description: Пользовательская материализация для вставки записей в таблицу только для добавления и отслеживания времени их добавления.
  - name: materialization_my_materialization_name_xyz
    description: Пользовательская материализация для вставки записей в таблицу только для добавления и отслеживания времени их добавления.
```

</File>