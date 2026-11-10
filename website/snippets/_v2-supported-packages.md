Чтобы определить, совместим ли пакет с dbt v2, посетите [каталог пакетов dbt](https://hub.getdbt.com/) и найдите значок совместимости с <Constant name="fusion" /> или проверьте [настройку `require-dbt-version`](/reference/project-configs/require-dbt-version#pin-to-a-range) пакета.

- Пакеты, у которых значение `require-dbt-version` равно `2.0.0` или задаёт диапазон, включающий эту версию, совместимы с dbt v2. Например, `require-dbt-version: ">=1.10.0,<3.0.0"`.

    Даже если в каталоге пакетов не указана совместимость пакета, он всё равно может работать с v2. Взаимодействуйте с сопровождающими пакетов, чтобы отслеживать обновления, и перед развёртыванием [тщательно тестируйте пакеты](https://docs.getdbt.com/guides/dbt-package-compat?step=5), совместимость которых явно не подтверждена.

- Сопровождающие пакетов, которые хотят обеспечить совместимость своих пакетов с v2, могут найти инструкции в [руководстве по обновлению пакетов для dbt v2](/guides/dbt-package-compat).

Особенности пакетов Fivetran:

- Пакеты Fivetran `source` и `transformation` объединены в один пакет.
- Если вы вручную установили пакеты источников, такие как `fivetran/github_source`, необходимо убедиться, что установлен пакет `fivetran/github`, и деактивировать модели преобразования.

import FusionPackageCompatibility from '/snippets/_v2-package-compatibility.md';

<FusionPackageCompatibility />
