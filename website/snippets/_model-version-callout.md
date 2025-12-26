:::info Model versions, dbt_project.yml versions, and .yml versions

Слово «version» встречается в документации в нескольких местах и используется в разных значениях:
- [Model versions](/docs/mesh/govern/model-versions) &mdash; функция dbt <Constant name="mesh" />, которая обеспечивает более эффективное управление и контроль моделей данных, позволяя отслеживать изменения и обновления моделей с течением времени.
- [dbt_project.yml version](/reference/project-configs/version#dbt_projectyml-versions) (опционально) &mdash; версия `dbt_project.yml` не связана с <Constant name="mesh" /> и указывает на совместимость dbt-проекта с конкретной версией dbt.
- [.yml property file version](/reference/project-configs/version#yml-property-file-versions) (опционально) &mdash; номера версий в .yml-файлах свойств определяют, как dbt интерпретирует эти YAML-файлы. Не связано с <Constant name="mesh" />.

:::
