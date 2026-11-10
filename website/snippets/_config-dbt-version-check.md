Если вы выбираете [канал релизов в <Constant name="dbt" />](/docs/dbt-versions/dbt-release-tracks), чтобы регулярно получать обновления версии dbt, dbt будет игнорировать настройку `require-dbt-version`.

dbt Labs стремится не допускать изменений, нарушающих совместимость кода в проектах dbt, при регулярном выпуске новых версий <Constant name="dbt" />. Мы также рекомендуем следующие практики:

<Expandable alt_header="Установка пакетов dbt">

Если вы устанавливаете dbt‑пакеты для использования в проекте — независимо от того, поддерживается ли пакет вашими коллегами или участником open source‑сообщества dbt — мы рекомендуем закреплять пакет на конкретной ревизии или границе `version`. dbt управляет этим «из коробки», _фиксируя_ версию/ревизию пакетов в разработке, чтобы гарантировать предсказуемые сборки в продакшене. Подробнее см. [Predictable package installs](/reference/commands/deps#predictable-package-installs).

</Expandable>
<Expandable alt_header="Поддержка dbt‑пакетов"  anchor_id="dbt-details-2">

Если вы поддерживаете dbt‑пакеты — будь то для коллег или для участников open source‑сообщества — мы рекомендуем писать защитный код, который проверяет наличие других необходимых пакетов и глобальных макросов. Например, если ваш пакет зависит от наличия макроса `date_spine` в глобальном пространстве имён `dbt`, вы можете написать:

<File name="models/some_days.sql">

```sql
{% macro a_few_days_in_september() %}

    {% if not dbt.get('date_spine') %}
      {{ exceptions.raise_compiler_error("Expected to find the dbt.date_spine macro, but it could not be found") }}
    {% endif %}

    {{ date_spine("day", "cast('2020-01-01' as date)", "cast('2030-12-31' as date)") }}

{% endmacro %}
```

</File>

</Expandable>
