---
title: Свойства моделей
---

Свойства моделей могут быть объявлены в файлах `.yml` в вашем каталоге `models/` (как определено в [конфигурации `model-paths`](/reference/project-configs/model-paths)).

Вы можете назвать эти файлы как угодно, например, `whatever_you_want.yml`, и вкладывать их на любую глубину в подкаталоги внутри каталога `models/`.

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - [name](/reference/resource-properties/model_name): <имя модели>
    [description](/reference/resource-properties/description): <markdown_string>
    [docs](/reference/resource-configs/docs):
      show: true | false
      node_color: <color_id> # Используйте имя (например, node_color: purple) или шестнадцатеричный код в кавычках (например, node_color: "#cd7f32")
    [latest_version](/reference/resource-properties/latest_version): <идентификатор версии>
    [deprecation_date](/reference/resource-properties/deprecation_date): <YAML_DateTime>
    [access](/reference/resource-configs/access): private | protected | public
    [config](/reference/resource-properties/config):
      [<model_config>](/reference/model-configs): <значение_конфигурации>
    [constraints](/reference/resource-properties/constraints):
      - <ограничение>
    [tests](/reference/resource-properties/data-tests):
      - <тест>
      - ... # объявите дополнительные тесты данных
    [columns](/reference/resource-properties/columns):
      - name: <имя_столбца> # обязательно
        [description](/reference/resource-properties/description): <markdown_string>
        [meta](/reference/resource-configs/meta): {<словарь>}
        [quote](/reference/resource-properties/quote): true | false
        [constraints](/reference/resource-properties/constraints):
          - <ограничение>
        [tests](/reference/resource-properties/data-tests):
          - <тест>
          - ... # объявите дополнительные тесты данных
        [tags](/reference/resource-configs/tags): [<строка>]
        
        # обязательно только в сочетании с ключом time_spine
        granularity: <[любая поддерживаемая временная гранулярность](/docs/build/dimensions?dimension=time_gran)> 

      - name: ... # объявите свойства дополнительных столбцов

    [time_spine](/docs/build/metricflow-time-spine):
      standard_granularity_column: <имя_столбца>

    [versions](/reference/resource-properties/versions):
      - [v](/reference/resource-properties/versions#v): <идентификатор версии> # обязательно
        [defined_in](/reference/resource-properties/versions#defined-in): <имя_файла_определения>
        [description](/reference/resource-properties/description): <markdown_string>
        [docs](/reference/resource-configs/docs):
          show: true | false
        [access](/reference/resource-configs/access): private | protected | public
        [constraints](/reference/resource-properties/constraints):
          - <ограничение>
        [config](/reference/resource-properties/config):
          [<model_config>](/reference/model-configs): <значение_конфигурации>
        [tests](/reference/resource-properties/data-tests):
          - <тест>
          - ... # объявите дополнительные тесты данных
        columns:
          # включить/исключить столбцы из свойств модели верхнего уровня
          - [include](/reference/resource-properties/include-exclude): <значение_включения>
            [exclude](/reference/resource-properties/include-exclude): <список_исключений>
          # указать дополнительные столбцы
          - name: <имя_столбца> # обязательно
            [quote](/reference/resource-properties/quote): true | false
            [constraints](/reference/resource-properties/constraints):
              - <ограничение>
            [tests](/reference/resource-properties/data-tests):
              - <тест>
              - ... # объявите дополнительные тесты данных
            [tags](/reference/resource-configs/tags): [<строка>]
        - v: ... # объявите дополнительные версии

```

</File>