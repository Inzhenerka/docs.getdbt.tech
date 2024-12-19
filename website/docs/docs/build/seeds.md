---
title: "Добавление семян в ваш DAG"
sidebar_label: "Семена"
description: "Прочитайте этот учебник, чтобы узнать, как использовать семена при работе с dbt."
id: "seeds"
---
## Связанные справочные документы
* [Конфигурации семян](/reference/seed-configs)
* [Свойства семян](/reference/seed-properties)
* [`seed` команда](/reference/commands/seed)

## Обзор
Семена — это CSV-файлы в вашем проекте dbt (обычно в директории `seeds`), которые dbt может загрузить в ваш <Term id="data-warehouse" /> с помощью команды `dbt seed`.

Семена могут быть использованы в последующих моделях так же, как и модели — с помощью функции [`ref` ](/reference/dbt-jinja-functions/ref).

Поскольку эти CSV-файлы находятся в вашем репозитории dbt, они находятся под контролем версий и могут быть подвергнуты код-ревью. Семена лучше всего подходят для статических данных, которые меняются редко.

Хорошие примеры использования семян:
* Список соответствий кодов стран и названий стран
* Список тестовых электронных адресов, которые следует исключить из анализа
* Список идентификаторов учетных записей сотрудников

Плохие примеры использования семян dbt:
* Загрузка необработанных данных, экспортированных в CSV
* Любые производственные данные, содержащие конфиденциальную информацию. Например, личные данные (PII) и пароли.

## Пример
Чтобы загрузить файл семян в ваш проект dbt:
1. Добавьте файл в директорию `seeds`, с расширением `.csv`, например, `seeds/country_codes.csv`

<File name='seeds/country_codes.csv'>

```text
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
...
```

</File>

2. Запустите команду `dbt seed` — новая <Term id="table" /> будет создана в вашем хранилище в целевой схеме с именем `country_codes`
```
$ dbt seed

Found 2 models, 3 tests, 0 archives, 0 analyses, 53 macros, 0 operations, 1 seed file

14:46:15 | Concurrency: 1 threads (target='dev')
14:46:15 |
14:46:15 | 1 of 1 START seed file analytics.country_codes........................... [RUN]
14:46:15 | 1 of 1 OK loaded seed file analytics.country_codes....................... [INSERT 3 in 0.01s]
14:46:16 |
14:46:16 | Finished running 1 seed in 0.14s.

Completed successfully

Done. PASS=1 ERROR=0 SKIP=0 TOTAL=1
```

3. Ссылайтесь на семена в последующих моделях, используя функцию `ref`.

<File name='models/orders.sql'>

```sql
-- Это ссылается на таблицу, созданную из seeds/country_codes.csv
select * from {{ ref('country_codes') }}
```

</File>

## Конфигурирование семян
Семена настраиваются в вашем `dbt_project.yml`, ознакомьтесь с документацией по [конфигурациям семян](reference/seed-configs.md) для получения полного списка доступных конфигураций.

## Документирование и тестирование семян
Вы можете документировать и тестировать семена в YAML, объявляя свойства — ознакомьтесь с документацией по [свойствам семян](/reference/seed-properties) для получения дополнительной информации.

## Часто задаваемые вопросы
<FAQ path="Seeds/load-raw-data-with-seed" />
<FAQ path="Seeds/configurable-data-path" /> 
<FAQ path="Seeds/full-refresh-seed" />
<FAQ path="Tests/testing-seeds" />
<FAQ path="Seeds/seed-datatypes" />
<FAQ path="Runs/run-downstream-of-seed" />
<FAQ path="Seeds/leading-zeros-in-seed" />
<FAQ path="Seeds/build-one-seed" />
<FAQ path="Seeds/seed-hooks" />