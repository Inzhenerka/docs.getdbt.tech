---
title: Как протестировать и задокументировать семена?
description: "Используйте файл схемы для тестирования и документирования семян"
sidebar_label: 'Тестирование и документирование семян'
id: testing-seeds

---

Чтобы протестировать и задокументировать семена, используйте [файл схемы](/reference/configs-and-properties) и вложите конфигурации под ключом `seeds:`

## Пример

<File name='seeds/schema.yml'>

```yml
version: 2

seeds:
  - name: country_codes
    description: Сопоставление двухбуквенных кодов стран с названиями стран
    columns:
      - name: country_code
        tests:
          - unique
          - not_null
      - name: country_name
        tests:
          - unique
          - not_null
```

</File>