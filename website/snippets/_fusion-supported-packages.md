Чтобы определить, совместим ли пакет с <Constant name="fusion_engine" />, посетите [dbt package hub](https://hub.getdbt.com/) и найдите бейдж совместимости с <Constant name="fusion" />, либо изучите конфигурацию пакета [`require-dbt-version`](/reference/project-configs/require-dbt-version#pin-to-a-range).

- Пакеты с `require-dbt-version`, который равен `2.0.0` или включает его, совместимы с <Constant name="fusion" />. Например: `require-dbt-version: ">=1.10.0,<3.0.0"`.

    Даже если пакет не отражает совместимость в package hub, он всё равно может работать с <Constant name="fusion" />. Рекомендуется взаимодействовать с мейнтейнерами пакета, чтобы отслеживать обновления, и [тщательно тестировать пакеты](https://docs.getdbt.com/guides/fusion-package-compat?step=5), совместимость которых не очевидна, перед развертыванием.

- Мейнтейнеры пакетов, которые хотят сделать свой пакет совместимым с <Constant name="fusion" />, могут обратиться к [руководству по обновлению пакетов для Fusion](/guides/fusion-package-compat) с подробными инструкциями.

Особенности пакетов Fivetran:

- Пакеты Fivetran `source` и `transformation` были объединены в один пакет.
- Если вы устанавливали source-пакеты вручную, например `fivetran/github_source`, необходимо убедиться, что установлен `fivetran/github`, и отключить модели трансформации.

import FusionPackageCompatibility from '/snippets/_fusion-package-compatibility.md';

<FusionPackageCompatibility />
