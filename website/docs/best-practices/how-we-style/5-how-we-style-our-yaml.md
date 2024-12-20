---
title: Как мы оформляем наш YAML
id: 5-how-we-style-our-yaml
---

## Руководство по стилю YAML

- 2️⃣ Отступы должны составлять два пробела
- ➡️ Элементы списка должны иметь отступ
- 🔠 Элементы списка с одной записью могут быть строкой. Например, `'select': 'other_user'`, но лучшей практикой является предоставление аргумента в виде явного списка. Например, `'select': ['other_user']`
- 🆕 Используйте новую строку для разделения элементов списка, которые являются словарями, где это уместно
- 📏 Строки YAML не должны превышать 80 символов.
- 🛠️ Используйте [dbt JSON schema](https://github.com/dbt-labs/dbt-jsonschema) с любой совместимой IDE и форматировщиком YAML (мы рекомендуем [Prettier](https://prettier.io/)) для проверки ваших YAML файлов и их автоматического форматирования.

:::info
☁️ Как и в случае с Python и SQL, IDE dbt Cloud поставляется с встроенным форматированием для YAML файлов (а также Markdown и JSON!), через Prettier. Просто нажмите кнопку `Format`, и ваш стиль будет идеальным. Как и в других инструментах, вы можете [также настроить правила форматирования](https://docs.getdbt.com/docs/cloud/dbt-cloud-ide/lint-format#format-yaml-markdown-json) по своему усмотрению, чтобы они соответствовали руководству по стилю вашей компании.
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