---
title: Как документировать макросы?
description: "Вы можете использовать файл схемы для документирования макросов"
sidebar_label: 'Документирование макросов'
id: documenting-macros
---

import MacroArgsNote from '/snippets/_validate-macro-args.md';

Чтобы задокументировать макросы, используйте [schema file](/reference/macro-properties) и вложите конфигурации под ключом `macros:`

## Пример {#example}

<File name='macros/schema.yml'>

```yml
version: 2

macros:
  - name: cents_to_dollars
    description: Макрос для преобразования центов в доллары
    arguments:
      - name: column_name
        type: column
        description: Имя столбца, который вы хотите преобразовать
      - name: precision
        type: integer
        description: Количество десятичных знаков. По умолчанию 2.
```

</File>

<MacroArgsNote />

## Документирование пользовательской материализации {#document-a-custom-materialization}

Когда вы создаёте [пользовательскую материализацию](/guides/create-new-materializations), dbt создаёт связанную с ней макрос с форматом, показанным ниже:
```
materialization_{materialization_name}_{adapter}
```

Чтобы задокументировать пользовательскую материализацию, используйте ранее упомянутый формат, чтобы определить имя(на) связанного макроса для документирования.

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