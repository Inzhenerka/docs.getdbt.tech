---
title: Как тестировать и документировать seeds?
description: "Используйте файл схемы для тестирования и документирования seeds"
sidebar_label: 'Тестирование и документирование seeds'
id: testing-seeds

---

Чтобы тестировать и документировать seeds, используйте [файл схемы](/reference/configs-and-properties) и разместите конфигурации под ключом `seeds:`

## Пример {#example}

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: country_codes
    description: Сопоставление двухбуквенных кодов стран с названиями стран
    columns:
      - name: country_code
        data_tests:
          - unique
          - not_null
      - name: country_name
        data_tests:
          - unique
          - not_null
```

</File>