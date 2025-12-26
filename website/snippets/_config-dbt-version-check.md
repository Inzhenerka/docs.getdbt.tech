Начиная с 2024 года, когда вы выбираете [трассу обновлений в dbt Cloud](/docs/dbt-versions/cloud-release-tracks) для получения постоянных обновлений версии dbt, dbt будет игнорировать конфигурацию `require-dbt-version`.

Начиная с 2024 года, если вы выбираете [release track в <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks) для получения регулярных обновлений версий dbt, dbt будет игнорировать конфигурацию `require-dbt-version`.

dbt Labs придерживается принципа отсутствия ломающих изменений (zero breaking changes) для кода в dbt‑проектах при регулярных релизах в <Constant name="cloud" /> и выходе новых версий dbt Core. Мы также рекомендуем следовать следующим лучшим практикам:

<Expandable alt_header="Installing dbt packages" >

Если вы устанавливаете dbt‑пакеты для использования в проекте — независимо от того, поддерживаются ли они вашими коллегами или участниками open source‑сообщества dbt, — мы рекомендуем фиксировать пакет на конкретную ревизию или границу `version`. dbt делает это автоматически «из коробки», _блокируя_ версию/ревизию пакетов в процессе разработки, чтобы гарантировать предсказуемые сборки в продакшене. Подробнее см. в разделе [Predictable package installs](/reference/commands/deps#predictable-package-installs).

</Expandable>
<Expandable alt_header="Поддержка пакетов dbt">

Если вы поддерживаете пакеты dbt, будь то от имени ваших коллег или членов сообщества с открытым исходным кодом, мы рекомендуем писать защитный код, который проверяет наличие других необходимых пакетов и глобальных макросов. Например, если ваш пакет зависит от наличия макроса `date_spine` в глобальном пространстве имен `dbt`, вы можете написать:

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