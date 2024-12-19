---
title: Свойства моделей
---

Свойства моделей могут быть объявлены в `.yml` файлах в директории `models/` (как определено в [конфигурации `model-paths`](/reference/project-configs/model-paths)).

Вы можете назвать эти файлы `whatever_you_want.yml` и вложить их на произвольную глубину в подпапки внутри директории `models/`.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - [name](/reference/resource-properties/model_name): <model name>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
    [latest_version](/reference/resource-properties/latest_version): <version_identifier>
    [deprecation_date](/reference/resource-properties/deprecation_date): <YAML_DateTime>
    [access](/reference/resource-configs/access): private | protected | public
    [config](/reference/resource-properties/config):
      [<model_config>](/reference/model-configs): <config_value>
    [constraints](/reference/resource-properties/constraints):
      - <constraint>
    [tests](/reference/resource-properties/data-tests):
      - <test>
      - ... # объявите дополнительные тесты данных
    [columns](/reference/resource-properties/columns):
      - name: <column_name> # обязательно
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<dictionary>}
        [quote](/reference/resource-properties/quote): true | false
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты данных
        [tags](/reference/resource-configs/tags): [<string>]
        
        # требуется только в сочетании с ключом time_spine
        granularity: <[любая поддерживаемая временная гранулярность](/docs/build/dimensions?dimension=time_gran)> 

      - name: ... # объявите свойства дополнительных столбцов

    [time_spine](/docs/build/metricflow-time-spine):
      standard_granularity_column: <column_name>

    [versions](/reference/resource-properties/versions):
      - [v](/reference/resource-properties/versions#v): <version_identifier> # обязательно
        [defined_in](/reference/resource-properties/versions#defined-in): <definition_file_name>
        [description](/reference/resource-properties/description): <markdown_string>
        [docs](/reference/resource-configs/docs):
          show: true | false
        [access](/reference/resource-configs/access): private | protected | public
        [constraints](/reference/resource-properties/constraints):
          - <constraint>
        [config](/reference/resource-properties/config):
          [<model_config>](/reference/model-configs): <config_value>
        [tests](/reference/resource-properties/data-tests):
          - <test>
          - ... # объявите дополнительные тесты данных
        columns:
          # включить/исключить столбцы из свойств модели верхнего уровня
          - [include](/reference/resource-properties/include-exclude): <include_value>
            [exclude](/reference/resource-properties/include-exclude): <exclude_list>
          # укажите дополнительные столбцы
          - name: <column_name> # обязательно
            [quote](/reference/resource-properties/quote): true | false
            [constraints](/reference/resource-properties/constraints):
              - <constraint>
            [tests](/reference/resource-properties/data-tests):
              - <test>
              - ... # объявите дополнительные тесты данных
            [tags](/reference/resource-configs/tags): [<string>]
        - v: ... # объявите дополнительные версии

```

</File>