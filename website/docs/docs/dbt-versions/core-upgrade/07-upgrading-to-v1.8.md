---
title: "Обновление до версии v1.8"
id: upgrading-to-v1.8
description: Новые функции и изменения в dbt Core v1.8
displayed_sidebar: "docs"
---

## Ресурсы {#resources}

- [Changelog](https://github.com/dbt-labs/dbt-core/blob/1.8.latest/CHANGELOG.md)
- [<Constant name="core" /> Руководство по установке CLI](/docs/core/installation-overview)
- [Руководство по обновлению в Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud)

## Что нужно знать перед обновлением {#what-to-know-before-upgrading}

dbt Labs стремится обеспечивать обратную совместимость для всех версий 1.x, за исключением изменений, явно указанных на этой странице. Если вы столкнетесь с ошибкой при обновлении, пожалуйста, сообщите нам, [создав задачу](https://github.com/dbt-labs/dbt-core/issues/new).

## Треки релизов {#release-tracks}

Начиная с 2024 года, <Constant name="cloud" /> предоставляет функциональность из новых версий dbt Core через [release tracks](/docs/dbt-versions/cloud-release-tracks) с автоматическими обновлениями. Выберите release track в ваших [средах](/docs/deploy/deploy-environments) разработки, staging и production, чтобы получить доступ ко всем возможностям dbt Core v1.8+ и не только. Чтобы обновить среду через [<Constant name="cloud" /> Admin API](/docs/dbt-cloud-apis/admin-cloud-api) или [Terraform](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest), установите параметр `dbt_version` в строковое значение `latest`.

## Новые и измененные функции и функциональность {#new-and-changed-features-and-functionality}

Новые функции и функциональность в dbt v1.8.

### Новая процедура установки адаптера dbt Core {#new-dbt-core-adapter-installation-procedure}

До dbt Core v1.8, когда вы устанавливали адаптер для хранилища данных с помощью `pip install`, `pip` автоматически устанавливал `dbt-core` вместе с ним. Адаптер dbt напрямую зависел от компонентов `dbt-core`, а `dbt-core` зависел от адаптера для выполнения. Эта двусторонняя зависимость затрудняла разработку адаптеров независимо от `dbt-core`.

Начиная с версии v1.8, [`dbt-core` и адаптеры разделены](https://github.com/dbt-labs/dbt-adapters/discussions/87). В дальнейшем ваши установки должны явно включать _как_ `dbt-core`, _так и_ нужный адаптер. Новая команда установки `pip` должна выглядеть так:

```shell
pip install dbt-core dbt-ADAPTER_NAME
```

Например, если вы используете Snowflake, используйте следующую команду:
```shell
pip install dbt-core dbt-snowflake
```

На данный момент мы сохранили зависимости во время установки, чтобы избежать неожиданных сбоев в существующих скриптах; `pip install dbt-snowflake` продолжит устанавливать последние версии как `dbt-core`, так и `dbt-snowflake`. Учитывая, что мы можем удалить эту неявную зависимость в будущих версиях, мы настоятельно рекомендуем обновить скрипты установки **сейчас**.

### Модульные тесты {#unit-tests}

Исторически, тестовое покрытие dbt ограничивалось [“данными” тестами](/docs/build/data-tests), оценивающими качество входных данных или структуру результирующих наборов данных.

В версии v1.8 мы вводим нативную поддержку [модульного тестирования](/docs/build/unit-tests). Модульные тесты проверяют вашу SQL-логику моделирования на небольшом наборе статических входных данных __до__ того, как вы материализуете вашу полную модель в производстве. Они поддерживают подход разработки, основанный на тестировании, улучшая как эффективность разработчиков, так и надежность кода.

Начиная с версии v1.8, когда вы выполняете команду `dbt test`, она будет запускать как модульные, так и данные тесты. Используйте метод [`test_type`](/reference/node-selection/methods#test_type), чтобы запускать только модульные или данные тесты:

```shell
dbt test --select "test_type:unit"           # запустить все модульные тесты
dbt test --select "test_type:data"           # запустить все данные тесты
```

Модульные тесты определяются в YML-файлах в вашем каталоге `models/` и в настоящее время поддерживаются только для SQL-моделей. Чтобы различать их, конфигурация `tests:` была переименована в `data_tests:`. Оба варианта в настоящее время поддерживаются для обратной совместимости.

#### Новый синтаксис `data_tests:` {#new-data_tests-syntax}

Синтаксис `tests:` изменяется, чтобы отразить добавление модульных тестов. Начните миграцию вашего [теста данных](/docs/build/data-tests#new-data_tests-syntax) YML на использование `data_tests:` после обновления до версии v1.8, чтобы избежать проблем в будущем.

```yml
models:
  - name: orders
    columns:
      - name: order_id
        data_tests:
          - unique
          - not_null
```

#### Флаг `--empty` {#the-empty-flag}

Команды [`run`](/reference/commands/run#the-`--empty`-flag) и [`build`](/reference/commands/build#the---empty-flag) теперь поддерживают флаг `--empty` для выполнения сухих прогонов только со схемой. Флаг `--empty` ограничивает ссылки и источники до нуля строк. dbt все равно выполнит SQL модели в целевом хранилище данных, но избежит дорогостоящих чтений входных данных. Это проверяет зависимости и гарантирует, что ваши модели будут правильно построены.

### Устаревшая функциональность {#deprecated-functionality}

Возможность для установленных пакетов переопределять встроенные материализации без явного согласия пользователя устаревает.

- Переопределение встроенной материализации из установленного пакета вызывает предупреждение об устаревании.
- Использование пользовательской материализации из установленного пакета не вызывает предупреждения об устаревании.
- Использование переопределения встроенной материализации из корневого проекта через оберточную материализацию все еще поддерживается. Например:

  ```sql
  {% materialization view, default %}
  {{ return(my_cool_package.materialization_view_default()) }}
  {% endmaterialization %}
  ```

### Управление изменениями в устаревших поведениях {#managing-changes-to-legacy-behaviors}

dbt Core v1.8 ввел флаги для [управления изменениями в устаревших поведениях](/reference/global-configs/behavior-changes). Вы можете включить недавно введенные изменения (по умолчанию отключены) или отключить зрелые изменения (по умолчанию включены), установив значения `True` / `False` соответственно для `flags` в `dbt_project.yml`.

Вы можете прочитать больше о каждом из этих изменений поведения по следующим ссылкам:

- (Зрелое, включено по умолчанию) [Требовать явные переопределения пакетов для встроенных материализаций](/reference/global-configs/behavior-changes#require_explicit_package_overrides_for_builtin_materializations)
- (Введено, отключено по умолчанию) [Требовать имена ресурсов без пробелов](/reference/global-configs/behavior-changes#require_resource_names_without_spaces)
- (Введено, отключено по умолчанию) [Запускать проектные хуки (`on-run-*`) в команде `dbt source freshness`](/reference/global-configs/behavior-changes#source_freshness_run_project_hooks)

## Быстрые заметки {#quick-hits}

- Пользовательские значения по умолчанию для [глобальных конфигурационных флагов](/reference/global-configs/about-global-configs) следует устанавливать в словаре `flags` в [`dbt_project.yml`](/reference/dbt_project.yml), вместо [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml). Поддержка `profiles.yml` устарела.
- Новый флаг CLI [`--resource-type`/`--exclude-resource-type`](/reference/global-configs/resource-type) для включения/исключения ресурсов из dbt `build`, `run` и `clone`.
- Для улучшения производительности dbt теперь выполняет один (пакетный) запрос при расчете `source freshness` через метаданные, вместо выполнения запроса для каждого источника.
- Синтаксис для `DBT_ENV_SECRET_` изменен на `DBT_ENV_SECRET` и больше не требует завершающего подчеркивания.