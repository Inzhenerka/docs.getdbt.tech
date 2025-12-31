---
title: "Создавайте документацию и тесты для dbt в 10 раз быстрее с ChatGPT"
description: "Вы можете использовать ChatGPT для определения контекста полей с длинными названиями из схем таблиц базы данных."
slug: create-dbt-documentation-10x-faster-with-ChatGPT

authors: [pedro_brito_de_sa]

tags: [analytics craft, data ecosystem]
hide_table_of_contents: true

date: 2023-07-18
is_featured: true
---

Независимо от того, создаете ли вы свои конвейеры в dbt впервые или просто добавляете новую модель время от времени, **хорошая документация и тестирование всегда должны быть приоритетом** для вас и вашей команды. Почему же мы избегаем этого как чумы? Потому что это хлопотно — записывать каждое отдельное поле, его описание простыми словами и выяснять, какие тесты следует провести, чтобы убедиться, что данные в порядке. Как мы можем сделать этот процесс быстрее и менее болезненным?

К настоящему времени все знают о чудесах моделей GPT для генерации кода и парного программирования, так что это не должно быть сюрпризом. Но **ChatGPT действительно выделяется** в определении контекста полей с длинными названиями из схем таблиц базы данных. Поэтому в этом посте я помогу вам ускорить создание документации и тестов в 10 раз, используя ChatGPT для выполнения большей части работы за вас.

<!--truncate-->

Будучи единственным аналитиком в [Sage](http://www.hellosage.com/), мне пришлось создавать наши конвейеры dbt с нуля. Это означало более 30 таблиц внутренних фактов и измерений + внешние данные в слое Staging, плюс все последующие слои расширенных моделей и таблиц Mart. В итоге мы говорим о более чем 3500 строк YAML, которые я не был в восторге начинать. К счастью для меня, это был февраль 2023 года, и ChatGPT только что вышел. И, о боже, как я был рад этому. После хорошей дозы "инженерии подсказок" мне удалось получить большую часть моей документации и тестов, требуя лишь небольших доработок.

Пишу эту статью в июле 2023 года, и теперь, с поддержкой GPT-4, а не GPT 3.5, уже легче получить те же результаты, что и я, поэтому вот мои выводы, которые, надеюсь, каждый сможет повторить.

## Используйте подробные таблицы с подробными полями {#use-verbose-tables-with-verbose-fields}

ChatGPT может сделать только столько, поэтому таблицы с именами и полями, которые напоминают ключи шифрования, вряд ли будут хороши для этого подхода. В этом примере мы будем использовать эту таблицу:

```sql
create or replace TRANSIENT TABLE STAGING.BASE.STG_STAFF_MEMBER (
      ID NUMBER(38,0),
      CREATEDATETIME TIMESTAMP_NTZ(9),
      UPDATEDATETIME TIMESTAMP_NTZ(9),
      VERSION NUMBER(38,0),
      FIRSTNAME VARCHAR(16777216),
      JOBTITLE VARCHAR(16777216),
      LASTNAME VARCHAR(16777216),
      MIDDLENAME VARCHAR(16777216),
      ISCAREADMIN BOOLEAN,
      ISARCHIVED BOOLEAN,
      ADDRESSID VARCHAR(16777216),
      ENTERPRISEID VARCHAR(16777216),
      ISDELETED BOOLEAN
);
```

---

Я скопировал это определение из Snowflake и рекомендую всегда включать как имя, так и тип полей, чтобы получить лучшие результаты. Это особенно полезно, если вы хотите убедиться, что ChatGPT правильно различает текстовые, числовые, булевые или массивные поля, что может быть не очевидно только по имени.

## Начинайте с простых подсказок {#start-out-with-simple-prompts}

Мы все знаем, как ChatGPT может обрабатывать очень сложные подсказки, но поскольку это инструмент для получения наилучших результатов для вашего случая использования, я бы рекомендовал начинать с простых, но конкретных подсказок.

Открывая ChatGPT с GPT4, моя первая подсказка обычно выглядит так:

<Lightbox src="/img/blog/2023-07-17-GPT-and-dbt-test/image1.png" title="Запрос ChatGPT для YAML файла" />

И результат этой простой подсказки просто потрясающий:

```yaml
version: 2

models:
  - name: STAFF_MEMBER
    description: This table contains information about the staff members.
    columns:
      - name: ID
        description: The unique identifier for the staff member.
        tests:
          - unique
          - not_null
      - name: CREATEDATETIME
        description: The timestamp when the record was created.
        tests:
          - not_null
      - name: UPDATEDATETIME
        description: The timestamp when the record was last updated.
      - name: VERSION
        description: Version number of the record.
      - name: FIRSTNAME
        description: The first name of the staff member.
        tests:
          - not_null
      - name: JOBTITLE
        description: The job title of the staff member.
        tests:
          - not_null
      - name: LASTNAME
        description: The last name of the staff member.
        tests:
          - not_null
      - name: MIDDLENAME
        description: The middle name of the staff member.
      - name: ISCARADMIN
        description: Boolean value indicating if the staff member is a care administrator.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: ISARCHIVED
        description: Boolean value indicating if the staff member record is archived.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: COMMUNITYID
        description: Identifier for the community of the staff member.
      - name: ENTERPRISEID
        description: Identifier for the enterprise of the staff member.
      - name: ISDELETED
        description: Boolean value indicating if the staff member record is deleted.
        tests:
          - accepted_values:
              values: ['true', 'false']
```

В мое время (5 месяцев назад) ChatGPT с GPT 3.5 не имел большого контекста о том, что такое YAML файл в стиле dbt, поэтому результат был странным, не dbt-форматом YAML. Если вы используете GPT 3.5 и результаты, которые вы получаете от первой подсказки, не компилируются в dbt, я бы рекомендовал дополнительный шаг, который я предпринял, чтобы передать ваше понимание того, что такое YAML файл в стиле dbt. Вы можете сделать это, просто скопировав и вставив часть общедоступного YAML файла, например, [этого из примера Jaffle Shop](https://github.com/dbt-labs/jaffle_shop/blob/main/models/schema.yml), или часть YAML из вашей собственной кодовой базы.

Подсказка для этого может выглядеть так:

<Lightbox src="/img/blog/2023-07-17-GPT-and-dbt-test/image2.png" title="Запрос ChatGPT на запоминание YAML в стиле dbt" />

## Уточняйте детали о стандартных тестах в ваших подсказках {#specify-details-on-generic-tests-in-your-prompts}

dbt имеет четыре встроенных стандартных теста: unique, not_null, accepted_values и relationships. Мой подход к добавлению деталей к этим тестам в подсказках заключается в том, что "больше — лучше", так как быстрее просто удалить тесты, которые мне не нужны в определенных полях, чем добавлять их вручную.

ChatGPT добавит тесты unique и not_null для большинства столбцов, в названии которых есть 'id', и, по моему опыту, он добавляет их в несколько больше столбцов, чем следует, что обычно быстро исправляется.

Accepted_values и relationships немного сложнее, но модель можно настроить, чтобы учитывать их довольно простыми способами. Мои советы:

- accepted_values: добавьте дополнительную деталь к схеме, например, дополнительное ключевое слово, такое как 'CATEGORICAL', после типа данных
- relationships: связывайте отношения с полями с конкретными именами. Для лучших результатов передайте список допустимых имен таблиц из вашей схемы, к которым она может обращаться.

Один из способов сделать это — использовать подсказку, подобную этой:

<Lightbox src="/img/blog/2023-07-17-GPT-and-dbt-test/image3.png" title="Запрос ChatGPT на написание YAML в стиле dbt с общими тестами" />

Что приводит к следующему результату:

```yaml
version: 2

models:
  - name: STAFF_MEMBER
    description: This table contains information about the staff members.
    columns:
      - name: ID
        description: The unique identifier for the staff member.
        tests:
          - unique
          - not_null
      - name: CREATEDATETIME
        description: The timestamp when the record was created.
        tests:
          - not_null
      - name: UPDATEDATETIME
        description: The timestamp when the record was last updated.
      - name: VERSION
        description: Version number of the record.
      - name: FIRSTNAME
        description: The first name of the staff member.
        tests:
          - not_null
      - name: JOBTITLE
        description: The job title of the staff member. This is a categorical field.
        tests:
          - not_null
          - accepted_values:
              values: ['Job Title 1', 'Job Title 2', 'Job Title 3'] # замените эти значения на фактические должности
      - name: LASTNAME
        description: The last name of the staff member.
        tests:
          - not_null
      - name: MIDDLENAME
        description: The middle name of the staff member.
      - name: ISCARADMIN
        description: Boolean value indicating if the staff member is a care administrator.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: ISARCHIVED
        description: Boolean value indicating if the staff member record is archived.
        tests:
          - accepted_values:
              values: ['true', 'false']
      - name: COMMUNITYID
        description: Identifier for the community of the staff member.
        tests:
          - relationships:
              to: STAGING.COMMUNITY.ID # замените на фактическую таблицу ссылок
              field: ID
      - name: ENTERPRISEID
        description: Identifier for the enterprise of the staff member.
        tests:
          - relationships:
              to: STAGING.ENTERPRISE.ID # замените на фактическую таблицу ссылок
              field: ID
      - name: ISDELETED
        description: Boolean value indicating if the staff member record is deleted.
        tests:
          - accepted_values:
              values: ['true', 'false']
```

Хотя он не угадывает магически категории ваших переменных или ваши отношения, он определенно полезен для наличия некоторых заполнителей в нужных местах.

В качестве дополнения, предоставление модели краткого описания моделей данных и таблиц, с которыми вы работаете, поможет ей лучше настроить ваши результаты.

## Заключение {#wrap-up}

Создание документации все еще остается очень ручной работой, и этот подход работает только для одной таблицы за раз (возможно, вы можете быть тем, кто использует API OpenAI и создает веб-приложение, которое обрабатывает несколько таблиц одновременно?). Однако ChatGPT явно может сократить много времени на эти задачи.

Надеюсь, эти простые советы помогут вам быть более мотивированными и эффективными в создании документации и тестов для ваших моделей данных. И помните: многословие на входе — многословие на выходе!