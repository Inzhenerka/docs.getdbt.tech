---
title: Как мы оформляем наш YAML
id: 5-how-we-style-our-yaml
---

## Руководство по стилю YAML

- 2️⃣ Отступы должны составлять два пробела
- ➡️ Элементы списка должны быть с отступом
- 🔠 Элементы списка с единственным значением могут быть строкой. Например, `'select': 'other_user'`, но лучшей практикой является предоставление аргумента в виде явного списка. Например, `'select': ['other_user']`
- 🆕 Используйте новую строку для разделения элементов списка, которые являются словарями, когда это уместно
- 📏 Строки YAML не должны превышать 80 символов.
- 🛠️ Используйте [dbt JSON schema](https://github.com/dbt-labs/dbt-jsonschema) с любым совместимым IDE и форматировщиком YAML (рекомендуем [Prettier](https://prettier.io/)) для проверки ваших YAML файлов и их автоматического форматирования.

:::info
☁️ Как и в Python и SQL, в dbt Cloud IDE есть встроенное форматирование для YAML файлов (также для Markdown и JSON!), с помощью Prettier. Просто нажмите кнопку `Format`, и вы получите идеальный стиль. Как и в других инструментах, вы также можете [настроить правила форматирования](https://docs.getdbt.com/docs/cloud/dbt-cloud-ide/lint-format#format-yaml-markdown-json) по своему усмотрению, чтобы соответствовать стилевому руководству вашей компании.
:::

### Пример YAML

```yaml
version: 2

models:
  - name: events
    columns:
      - name: event_id
        description: This is a unique identifier for the event
        tests:
          - unique
          - not_null

      - name: event_time
        description: "When the event occurred in UTC (eg. 2018-01-01 12:00:00)"
        tests:
          - not_null

      - name: user_id
        description: The ID of the user who recorded the event
        tests:
          - not_null
          - relationships:
              to: ref('users')
              field: id
```