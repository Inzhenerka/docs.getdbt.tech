Начиная с 2024 года, когда вы выбираете [release track в <Constant name="cloud" />](/docs/dbt-versions/cloud-release-tracks), чтобы получать регулярные обновления версии dbt, dbt будет игнорировать конфигурацию `require-dbt-version`.

dbt Labs придерживается принципа нулевых «ломающих» изменений для кода в dbt‑проектах — при регулярных релизах в <Constant name="cloud" /> и выходе новых версий dbt Core. Мы также рекомендуем следующие best practices:

<Expandable alt_header="Установка dbt‑пакетов" >

Если вы устанавливаете dbt‑пакеты для использования в проекте — независимо от того, поддерживается ли пакет вашими коллегами или участником open source‑сообщества dbt — мы рекомендуем закреплять пакет на конкретной ревизии или границе `version`. dbt управляет этим «из коробки», _фиксируя_ версию/ревизию пакетов в разработке, чтобы гарантировать предсказуемые сборки в продакшене. Подробнее см. [Predictable package installs](/reference/commands/deps#predictable-package-installs).

</Expandable>
<Expandable alt_header="Поддержка dbt‑пакетов" >

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