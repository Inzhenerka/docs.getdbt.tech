---
title: Как тестировать и документировать seeds?
description: "Используйте файл схемы для тестирования и документирования seeds"
sidebar_label: 'Тестирование и документирование seeds'
id: testing-seeds

---

Чтобы тестировать и документировать seed-файлы, используйте [файл свойств](/reference/configs-and-properties) и размещайте настройки внутри ключа `seeds:`

## Пример {#example}

<File name='seeds/properties.yml'>

```yml
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