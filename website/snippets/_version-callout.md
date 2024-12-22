:::info Версии моделей, версии dbt_project.yml и версии .yml

Обратите внимание, что [версии моделей](/docs/collaborate/govern/model-versions) отличаются от [версий dbt_project.yml](/reference/project-configs/version#dbt_projectyml-versions) и [версий файлов свойств .yml](/reference/project-configs/version#yml-property-file-versions).

Версии моделей — это _функция_, которая позволяет улучшить управление и контроль моделей данных, позволяя отслеживать изменения и обновления моделей с течением времени. Версии dbt_project.yml относятся к совместимости проекта dbt с определенной версией dbt. Номера версий в файлах свойств .yml указывают, как dbt интерпретирует эти YAML файлы. Последние два являются полностью необязательными, начиная с dbt версии 1.5.

:::