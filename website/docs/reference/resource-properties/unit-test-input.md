---
title: "Входные данные для модульных тестов"
sidebar_label: "Входные данные"
---

Используйте входные данные в ваших модульных тестах, чтобы ссылаться на конкретную модель или источник для теста:

- Для `input:` используйте строку, которая представляет вызов `ref` или `source`:
    - `ref('my_model')` или `ref('my_model', v='2')` или `ref('dougs_project', 'users')`
    - `source('source_schema', 'source_name')`
- Опционально используйте для seeds:
    - Если вы не указываете входные данные для seed, мы используем seed _как_ входные данные.
    - Если вы указываете входные данные для seed, мы используем эти входные данные вместо этого.
- Используйте "пустые" входные данные, задавая строки как пустой список `rows: []`

<File name='models/schema.yml'>
```yml
unit_tests:
  - name: test_is_valid_email_address # это уникальное имя теста
    model: dim_customers # имя модели, которую я тестирую
    given: # фиктивные данные для ваших входных данных
      - input: ref('stg_customers')
        rows:
         - {email: cool@example.com,     email_top_level_domain: example.com}
         - {email: cool@unknown.com,     email_top_level_domain: unknown.com}
         - {email: badgmail.com,         email_top_level_domain: gmail.com}
         - {email: missingdot@gmailcom,  email_top_level_domain: gmail.com}
      - input: ref('top_level_email_domains')
        rows:
         - {tld: example.com}
         - {tld: gmail.com}
...

```
</File>
