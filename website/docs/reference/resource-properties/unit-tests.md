---
title: "О тестах на уровне единиц"
sidebar_label: "Тесты на уровне единиц"
resource_types: [models]
datatype: test
---

:::note 

Эта функциональность доступна в dbt Core версии 1.8+ и [выпусках dbt Cloud](/docs/dbt-versions/cloud-release-tracks).

:::

Тесты на уровне единиц проверяют вашу логику SQL моделирования на небольшом наборе статических входных данных перед тем, как вы материализуете вашу полную модель в производственной среде. Они поддерживают подход разработки, ориентированный на тестирование, что повышает как эффективность разработчиков, так и надежность кода.

Чтобы запустить только ваши тесты на уровне единиц, используйте команду:
`dbt test --select test_type:unit`

## Перед началом

- В настоящее время мы поддерживаем только тестирование на уровне единиц для SQL моделей.
- В настоящее время мы поддерживаем добавление тестов на уровне единиц только к моделям в вашем _текущем_ проекте.
- Если у вашей модели есть несколько версий, по умолчанию тест на уровне единиц будет выполняться на *всех* версиях вашей модели. Читайте [тестирование версионированных моделей](/reference/resource-properties/unit-testing-versions) для получения дополнительной информации.
- Тесты на уровне единиц должны быть определены в YML файле в директории `models/`.
- Если вы хотите протестировать модель, которая зависит от эфемерной модели, вы должны использовать `format: sql` для этого входа.

<file name='dbt_project.yml'>

```yml

unit_tests:
  - name: <test-name> # это уникальное имя теста
    model: <model-name> 
      versions: #опционально
        include: <list-of-versions-to-include> #опционально
        exclude: <list-of-versions-to-exclude> #опционально
    config: 
      meta: {dictionary}
      tags: <string> | [<string>]
    given:
      - input: <ref_or_source_call> # опционально для seeds
        format: dict | csv | sql
        # либо определите строки встроенно, либо укажите имя фикстуры
        rows: {dictionary} | <string>
        fixture: <fixture-name> # sql или csv 
      - input: ... # объявите дополнительные входные данные
    expect:
      format: dict | csv | sql
      # либо определите строки встроенно, либо укажите имя фикстуры
      rows: {dictionary} | <string>
      fixture: <fixture-name> # sql или csv 
    overrides: # опционально: конфигурация для среды выполнения dbt
      macros:
        is_incremental: true | false
        dbt_utils.current_timestamp: <string>
        # ... любая другая функция jinja из https://docs.getdbt.com/reference/dbt-jinja-functions
        # ... любое другое свойство контекста
      vars: {dictionary}
      env_vars: {dictionary}
  - name: <test-name> ... # объявите дополнительные тесты на уровне единиц

  ```

</file>

## Примеры

```yml

unit_tests:
  - name: test_is_valid_email_address # это уникальное имя теста
    model: dim_customers # имя модели, которую я тестирую
    given: # макет данных для ваших входных данных
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
    expect: # ожидаемый вывод с учетом вышеуказанных входных данных
      rows:
        - {email: cool@example.com,    is_valid_email_address: true}
        - {email: cool@unknown.com,    is_valid_email_address: false}
        - {email: badgmail.com,        is_valid_email_address: false}
        - {email: missingdot@gmailcom, is_valid_email_address: false}

```

```yml

unit_tests:
  - name: test_is_valid_email_address # это уникальное имя теста
    model: dim_customers # имя модели, которую я тестирую
    given: # макет данных для ваших входных данных
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
    expect: # ожидаемый вывод с учетом вышеуказанных входных данных
      format: csv
      fixture: valid_email_address_fixture_output

```

```yml

unit_tests:
  - name: test_is_valid_email_address # это уникальное имя теста
    model: dim_customers # имя модели, которую я тестирую
    given: # макет данных для ваших входных данных
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
    expect: # ожидаемый вывод с учетом вышеуказанных входных данных
      format: sql
      fixture: valid_email_address_fixture_output

```