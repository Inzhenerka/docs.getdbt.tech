---
title: "Добавление Seeds в ваш DAG"
sidebar_label: "Seeds"
description: "Предоставляйте seed‑файлы данных для ваших моделей dbt."
id: "seeds"
---
## Связанные справочные документы
* [Конфигурации Seed](/reference/seed-configs)
* [Свойства Seed](/reference/seed-properties)
* [Команда `seed`](/reference/commands/seed)

## Обзор
Seeds — это CSV файлы в вашем проекте dbt (обычно в вашем каталоге `seeds`), которые dbt может загрузить в ваш <Term id="data-warehouse" /> с помощью команды `dbt seed`.

Seeds могут быть использованы в последующих моделях так же, как и модели — с использованием [функции `ref`](/reference/dbt-jinja-functions/ref).

Поскольку эти CSV файлы находятся в вашем репозитории dbt, они подлежат контролю версий и могут быть проверены в ходе код-ревью. Seeds лучше всего подходят для статических данных, которые редко изменяются.

Хорошие примеры использования seeds:
* Список соответствий кодов стран и названий стран
* Список тестовых email-адресов для исключения из анализа
* Список идентификаторов учетных записей сотрудников

Плохие примеры использования dbt seeds:
* Загрузка необработанных данных, экспортированных в CSV
* Любые производственные данные, содержащие конфиденциальную информацию. Например, персональные данные (PII) и пароли.

## Пример
Чтобы загрузить seed-файл в ваш dbt‑проект:

1. Добавьте файл в директорию `seeds` с расширением `.csv`, например `seeds/country_codes.csv`

<File name='seeds/country_codes.csv'>

```text
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
...
```

</File>

2. Выполните [команду](/reference/commands/seed) `dbt seed` — в вашем хранилище данных в целевой схеме будет создана новая <Term id="table" />, названная `country_codes`
```
$ dbt seed

Найдено 2 модели, 3 теста, 0 архивов, 0 анализов, 53 макроса, 0 операций, 1 seed файл

14:46:15 | Параллелизм: 1 поток (цель='dev')
14:46:15 |
14:46:15 | 1 из 1 НАЧАТЬ seed файл analytics.country_codes........................... [ВЫПОЛНЯЕТСЯ]
14:46:15 | 1 из 1 ОК загружен seed файл analytics.country_codes....................... [ВСТАВЛЕНО 3 за 0.01с]
14:46:16 |
14:46:16 | Завершено выполнение 1 seed за 0.14с.

Завершено успешно

Готово. УСПЕХ=1 ОШИБКА=0 ПРОПУСК=0 ВСЕГО=1
```

3. Ссылайтесь на seeds в последующих моделях, используя функцию `ref`.

<File name='models/orders.sql'>

```sql
-- Это ссылается на таблицу, созданную из seeds/country_codes.csv
select * from {{ ref('country_codes') }}
```

</File>

## Конфигурирование seeds
Seeds настраиваются в вашем `dbt_project.yml`, ознакомьтесь с документацией по [конфигурациям Seed](reference/seed-configs.md) для полного списка доступных настроек.

## Документирование и тестирование seeds
Вы можете документировать и тестировать seeds в YAML, объявляя свойства — ознакомьтесь с документацией по [свойствам Seed](/reference/seed-properties) для получения дополнительной информации.

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
