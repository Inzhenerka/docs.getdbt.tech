## Генерация метаданных {#generate-metadata}

<Constant name="explorer" /> использует метаданные, предоставляемые [Discovery API](/docs/dbt-cloud-apis/discovery-api), чтобы отображать сведения о [состоянии вашего dbt‑проекта](/docs/dbt-cloud-apis/project-state). Доступный набор метаданных зависит от [среды развертывания](/docs/deploy/deploy-environments), которую вы указали как _production_ или _staging_ в вашем проекте <Constant name="cloud" />.

<Constant name="explorer" /> также позволяет загружать внешние метаданные из Snowflake, предоставляя видимость таблиц, представлений и других ресурсов, которые не определены в dbt, непосредственно в <Constant name="explorer" />.

## Метаданные dbt {#dbt-metadata}

Если вы используете [гибридную настройку проекта](/docs/deploy/hybrid-setup) и загружаете артефакты из dbt Core, обязательно следуйте [инструкциям по настройке](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud), чтобы подключить проект в <Constant name="cloud" />. Это позволит <Constant name="explorer" /> корректно получать и отображать ваши метаданные.

- Чтобы все метаданные были доступны в <Constant name="explorer" />, запускайте `dbt build` и `dbt docs generate` в рамках задания в production или staging‑среде. Выполнение этих двух команд гарантирует, что все релевантные метаданные (такие как lineage, результаты тестов, документация и другое) будут доступны в <Constant name="explorer" />.
- <Constant name="explorer" /> автоматически получает обновления метаданных после каждого запуска задания в production или staging‑среде развертывания, поэтому всегда использует самые актуальные результаты по вашему проекту. Это относится как к deploy‑, так и к merge‑заданиям.
  - Обратите внимание, что CI‑задания не обновляют <Constant name="explorer" />. Это связано с тем, что они не отражают состояние production и не предоставляют необходимые обновления метаданных.
- Чтобы просмотреть ресурс и его метаданные, ресурс должен быть определён в вашем проекте, а задание должно быть выполнено в production или staging‑среде.
- Итоговый набор метаданных зависит от [команд](/docs/deploy/job-commands), которые выполняются в заданиях.

Обратите внимание, что <Constant name="explorer" /> автоматически удаляет устаревшие метаданные через 3 месяца, если не выполнялись задания для их обновления. Чтобы избежать этого, убедитесь, что задания с необходимыми командами запускаются чаще, чем раз в 3 месяца.

| Чтобы увидеть в <Constant name="explorer" /> | Необходимо успешно выполнить |
|---------------------|---------------------------|
| Все метаданные        |  [dbt build](/reference/commands/build), [dbt docs generate](/reference/commands/cmd-docs) и [dbt source freshness](/reference/commands/source#dbt-source-freshness) вместе в рамках одного задания в среде |
| Lineage модели, детали или результаты | [dbt run](/reference/commands/run) или [dbt build](/reference/commands/build) для конкретной модели в рамках задания в среде |
| Колонки и статистику для моделей, источников и snapshot’ов | [dbt docs generate](/reference/commands/cmd-docs) в рамках [задания](/docs/explore/build-and-view-your-docs) в среде |
| Результаты тестов | [dbt test](/reference/commands/test) или [dbt build](/reference/commands/build) в рамках задания в среде |
| Результаты source freshness | [dbt source freshness](/reference/commands/source#dbt-source-freshness) в рамках задания в среде |
| Детали snapshot’ов | [dbt snapshot](/reference/commands/snapshot) или [dbt build](/reference/commands/build) в рамках задания в среде |
| Детали seed’ов | [dbt seed](/reference/commands/seed) или [dbt build](/reference/commands/build) в рамках задания в среде |

По мере развития <Constant name="cloud" /> в <Constant name="explorer" /> будут доступны более полные и более оперативно обновляемые метаданные.
