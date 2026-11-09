---
title: Как мы оформляем наш YAML
id: 5-how-we-style-our-yaml
---

## Руководство по стилю YAML {#yaml-style-guide}

- 2️⃣ Отступы должны составлять два пробела
- ➡️ Элементы списка должны иметь отступ
- 🔠 Списки с одним элементом можно задавать строкой. Например, `'select': 'other_user'`, но рекомендуется передавать аргумент в виде явного списка. Например, `'select': ['other_user']`
- 🆕 При необходимости разделяйте элементы списка, представляющие собой словари, переводом строки
- 📏 Строки YAML не должны превышать 80 символов.
- 🛠️ Используйте [JSON-схему dbt](https://github.com/dbt-labs/dbt-jsonschema) с любым совместимым <Constant name="studio_ide" /> и инструментом форматирования YAML (рекомендуем [Prettier](https://prettier.io/)), чтобы проверять YAML-файлы и автоматически форматировать их.

Обратите внимание: дополнительную информацию о YAML можно найти в разделе [YAML tips](/docs/build/dbt-tips#yaml-tips).

:::info
☁️ Как и для Python и SQL, в <Constant name="studio_ide" /> есть встроенное форматирование YAML-файлов (а также Markdown и JSON!) с помощью Prettier. Просто нажмите кнопку `Format`, и ваш код будет идеально отформатирован. Как и в случае с другими инструментами, вы можете [настроить правила форматирования](/docs/platform/studio-ide/lint-format#format-yaml-markdown-json) по своему вкусу, чтобы они соответствовали руководству по стилю вашей компании.
:::

### Пример YAML {#example-yaml}

```yaml


models:
  - name: events
    columns:
      - name: event_id
        description: This is a unique identifier for the event
        data_tests:
          - unique
          - not_null

      - name: event_time
        description: "When the event occurred in UTC (eg. 2018-01-01 12:00:00)"
        data_tests:
          - not_null

      - name: user_id
        description: The ID of the user who recorded the event
        data_tests:
          - not_null
          - relationships:
              arguments: # доступно в версии v1.10.5 и выше. В более старых версиях можно указывать <argument_name> как свойство верхнего уровня.
                to: ref('users')
                field: id
```
