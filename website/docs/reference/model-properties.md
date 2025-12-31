---
title: Свойства моделей
---

Свойства моделей могут быть объявлены в файлах `.yml` в вашем каталоге `models/` (как определено в [конфигурации `model-paths`](/reference/project-configs/model-paths)).

Вы можете назвать эти файлы как угодно, например, `whatever_you_want.yml`, и вкладывать их на любую глубину в подкаталоги внутри каталога `models/`.

## Доступные свойства модели верхнего уровня {#available-top-level-model-properties}

|Свойство|	Тип	|Обязательно	|Описание|
|--------|--------|---------|-----------|
|[name](/reference/resource-properties/model_name)	|string	|Да	|Имя модели (должно совпадать с именем файла модели).|
|[description](/reference/resource-properties/description)|	string	|Нет	|Документация для модели.|
|[columns](/reference/resource-properties/columns) |	array	|Нет	|Список определений столбцов.|
|[config](/reference/resource-properties/config)	|object|	Нет	|Конфигурация модели (материализация, теги и т. д.).|
|[constraints](/reference/resource-properties/constraints)	|array	|	Нет|	Ограничения на уровне модели (первичный ключ, внешний ключ и т. д.).|
|[data_tests](/reference/resource-properties/data-tests)|	array|	Нет	|Тесты данных на уровне модели.|
|tests|	array|	Нет	|Устаревший псевдоним для data_tests.|
|[versions](/reference/resource-properties/versions)|	array	|Нет	|Определения версий модели.|
|[latest_version](/reference/resource-properties/latest_version)|	string/float|	Нет	|Последняя версия модели.|
|[deprecation_date](/reference/resource-properties/deprecation_date)|	string|	Нет	|Дата, когда модель помечена как устаревшая.|
|[access](/reference/resource-configs/access)	|string|	Нет|	Уровень доступа: private, protected или public. Поддерживается только на верхнем уровне для обратной совместимости. |
|[time_spine](/docs/build/metricflow-time-spine)|	object	|Нет	|Конфигурация временной оси для семантического слоя.|
### Пример файла {#example-file}

<File name='models/<filename>.yml'>

```yml

models:
  # Имя модели должно совпадать с именем файла модели — с учётом регистра
  - [name](/reference/resource-properties/model_name): model_name
    [description](/reference/resource-properties/description): <markdown_string>
    [latest_version](/reference/resource-properties/latest_version): <version_identifier>
    [deprecation_date](/reference/resource-properties/deprecation_date): <YAML_DateTime>
    [config](/reference/resource-properties/config):
      [<model_config>](/reference/model-configs): <config_value>
      [docs](/reference/resource-configs/docs):
        show: true | false
        node_color: <color_id> # Используйте название (например, node_color: purple) или hex-код в кавычках (например, node_color: "#cd7f32")
      [access](/reference/resource-configs/access): private | protected | public
    [constraints](/reference/resource-properties/constraints):
      - <constraint>
    [data_tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # объявите дополнительные data tests
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # обязательно
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/columns#quote): true | false
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные data tests
        [config](/reference/resource-properties/config):
          [meta](/reference/resource-configs/meta): {<dictionary>}
          [tags](/reference/resource-configs/tags): [<string>]

        # требуется только вместе с ключом time_spine
        [granularity](/docs/build/metricflow-time-spine#creating-a-time-spine-table): <[любая поддерживаемая временная гранулярность](/docs/build/dimensions?dimension=time_gran)>

      - name: ... # объявите свойства дополнительных колонок

    [time_spine](/docs/build/metricflow-time-spine):
      standard_granularity_column: <column_name>

    [versions](/reference/resource-properties/versions):
      - [v](/reference/resource-properties/versions#v): <version_identifier> # обязательно
        [defined_in](/reference/resource-properties/versions#defined-in): <definition_file_name>
        [description](/reference/resource-properties/description): <markdown_string>
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [config](/reference/resource-properties/config):
          [<model_config>](/reference/model-configs): <config_value>
          [docs](/reference/resource-configs/docs):
            show: true | false
          [access](/reference/resource-configs/access): private | protected | public
        [data_tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные data tests
        columns:
          # включить/исключить колонки из свойств модели верхнего уровня
          - [include](/reference/resource-properties/versions#include): <include_value>
            [exclude](/reference/resource-properties/versions#include): <exclude_list>
          # указать дополнительные колонки
          - name: <column_name> # обязательно
            [quote](/reference/resource-properties/columns#quote): true | false
            [constraints](/reference/resource-properties/constraints):
              - <constraint>
            [data_tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # объявите дополнительные data tests
            [tags](/reference/resource-configs/tags): [<string>]
        - v: ... # объявите дополнительные версии
```

</File>
