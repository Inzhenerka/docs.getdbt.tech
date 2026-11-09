---
title: "О свойстве модульных тестов"
sidebar_label: "Модульные тесты"
resource_types: [models]
datatype: test
---

<VersionCallout version="1.8" />

Модульные тесты проверяют вашу SQL-логику моделирования на небольшом наборе статических входных данных перед тем, как вы материализуете вашу полную модель в производственной среде. Они поддерживают подход разработки, основанный на тестировании, улучшая как эффективность разработчиков, так и надежность кода.

Чтобы запустить только ваши модульные тесты, используйте команду:
`dbt test --select test_type:unit`

import UnitTestsPrereqs from '/snippets/_unit-tests-prereqs.md';

<UnitTestsPrereqs />

<File name='models/schema.yml'>

```yaml

unit_tests:
- name: <test-name> # уникальное имя теста
    model: <model-name>
    versions: #необязательно
      include: <list-of-versions-to-include> #необязательно
      exclude: <list-of-versions-to-exclude> #необязательно
    config: 
      meta: {dictionary}
      tags: <string> | [<string>]
      enabled: {boolean} # optional. v1.9 or higher. If not configured, defaults to `true`
      compute: local | remote # optional. v2.0 or higher. Defaults to `remote`.  Requires DBT_ENGINE_EXPERIMENTAL_LOCAL_UNIT_TESTS=true. See [Run unit tests locally](/docs/build/unit-tests#run-unit-tests-locally)
    given:
      - input: <ref_or_source_call> # опционально для seeds
        format: dict | csv | sql
        # либо определите строки в коде, либо имя фикстуры
        rows: {dictionary} | <string>
        fixture: <fixture-name> # SQL или CSV
      - input: ... # объявить дополнительные входные данные
    expect:
      format: dict | csv | sql
# либо определите строки непосредственно здесь, либо укажите имя фикстуры
      rows: {dictionary} | <string>
      fixture: <fixture-name> # SQL или CSV
    overrides: # необязательно: конфигурация окружения выполнения dbt
      macros:
        is_incremental: true | false
        dbt_utils.current_timestamp: <string>
        # ... любая другая Jinja‑функция из https://docs.getdbt.tech/reference/dbt-jinja-functions
        # ... любое другое свойство контекста
      vars: {dictionary}
      env_vars: {dictionary}
- name: <test-name> ... # объявите дополнительные модульные тесты
```

</File>

## Примеры {#examples}

<File name='models/schema.yml'>

```yaml

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
    expect: # ожидаемый результат, учитывая вышеуказанные входные данные
      rows:
        - {email: cool@example.com,    is_valid_email_address: true}
        - {email: cool@unknown.com,    is_valid_email_address: false}
        - {email: badgmail.com,        is_valid_email_address: false}
        - {email: missingdot@gmailcom, is_valid_email_address: false}

```
</File>

<File name='models/schema.yml'>

```yaml

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
        format: csv
        rows: |
          tld
          example.com
          gmail.com
    expect: # ожидаемый результат, учитывая вышеуказанные входные данные
      format: csv
      fixture: valid_email_address_fixture_output

```
</File>

<File name='models/schema.yml'>

```yaml

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
        format: sql
        rows: |
          select 'example.com' as tld union all
          select 'gmail.com' as tld
    expect: # ожидаемый результат, учитывая вышеуказанные входные данные
      format: sql
      fixture: valid_email_address_fixture_output

```
</File>
