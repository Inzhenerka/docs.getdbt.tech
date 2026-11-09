## Генерация метаданных {#generate-metadata}

<Constant name="catalog" /> использует метаданные, предоставляемые [Discovery API](/docs/dbt-apis/discovery-api), для отображения подробной информации о [состоянии вашего проекта dbt](/docs/dbt-apis/project-state). Доступные метаданные зависят от [среды развертывания](/docs/deploy/deploy-environments), которую вы обозначили как _production_ или _staging_ в своем проекте <Constant name="dbt" />.

## Метаданные dbt {#dbt-metadata}

Если вы используете [гибридную конфигурацию проекта](/docs/deploy/hybrid-setup) и загружаете артефакты из dbt v1, обязательно следуйте [инструкциям по настройке](/docs/deploy/hybrid-setup#create-hybrid-project), чтобы подключить свой проект в <Constant name="dbt" />. Это позволит <Constant name="catalog" /> корректно получать и отображать ваши метаданные.

- <VersionBlock lastVersion="1.99">Чтобы все метаданные были доступны в <Constant name="catalog" />, выполняйте `dbt build` и `dbt docs generate` в рамках задания в среде production или staging. Выполнение этих двух команд обеспечивает доступность всех необходимых метаданных (таких как зависимости между ресурсами, результаты тестов, документация и многое другое) в <Constant name="catalog" />.</VersionBlock><VersionBlock firstVersion="2.0">Чтобы все метаданные были доступны в <Constant name="catalog" />, выполняйте `dbt build` в рамках задания в среде production или staging. Задания, использующие v2, автоматически обновляют метаданные каталога при каждом запуске, поэтому шаг `dbt docs generate` не требуется.</VersionBlock>
- <Constant name="catalog" /> автоматически получает обновления метаданных после каждого запуска задания в среде развертывания production или staging, поэтому в нем всегда доступны актуальные результаты для вашего проекта. Это относится и к заданиям развертывания и слияния.
    - Обратите внимание, что задания CI не обновляют <Constant name="catalog" />. Это связано с тем, что они не отражают состояние production и не предоставляют необходимые обновления метаданных.
- Чтобы просмотреть ресурс и его метаданные, необходимо определить ресурс в проекте и запустить задание в среде production или staging.
- Итоговые метаданные зависят от [команд](/docs/deploy/job-commands), выполняемых заданиями.

### Когда dbt создает метаданные модели

dbt заполняет метаданные модели в <Constant name="catalog" />, когда выполняются оба следующих условия:
- Модель определена в вашем проекте dbt (присутствует в манифесте).
- Модель присутствует в `run_results` команды [`dbt build`](/reference/commands/build), [`dbt run`](/reference/commands/run) или [`dbt clone`](/reference/commands/clone), независимо от того, завершилось выполнение успешно или с ошибкой.<VersionBlock lastVersion="1.99"> Обратите внимание, что сама по себе команда `dbt docs generate` не создает записи моделей в <Constant name="catalog" />. Она предоставляет дополнительные метаданные, такие как сведения о столбцах и описания, для уже существующих моделей.</VersionBlock>

### Когда dbt удаляет метаданные модели

dbt удаляет метаданные модели из <Constant name="catalog" /> в двух случаях:

- **Модель удалена из проекта**: если модель удалена из вашего проекта dbt (и, следовательно, больше не присутствует в манифесте), ее метаданные удаляются после последующего запуска задания, в которое эта модель больше не включена.
- **Отсутствие активности в среде**: если в среде не было запусков заданий за последние 3 месяца, все метаданные этой среды удаляются. Чтобы этого избежать, настройте запуск заданий по расписанию не реже одного раза в 3 месяца.

<VersionBlock lastVersion="1.99">

| Чтобы просмотреть в <Constant name="catalog" /> | Необходимо успешно выполнить |
|---------------------|---------------------------|
| Все метаданные        | [dbt build](/reference/commands/build), [dbt docs generate](/reference/commands/cmd-docs) и [dbt source freshness](/reference/commands/source#dbt-source-freshness) вместе в рамках одного задания в этой среде |
| Зависимости модели, сведения о ней или результаты выполнения | [dbt run](/reference/commands/run) или [dbt build](/reference/commands/build) для конкретной модели в рамках задания в этой среде |
| Столбцы и статистику для моделей, источников и снимков| [dbt docs generate](/reference/commands/cmd-docs) в рамках [задания](/docs/explore/build-and-view-your-docs) в этой среде |
| Результаты тестов данных | [dbt test](/reference/commands/test) или [dbt build](/reference/commands/build) в рамках задания в этой среде |
| Результаты модульных тестов | [dbt test](/reference/commands/test) или [dbt build](/reference/commands/build) в рамках задания в этой среде. Модульные тесты обычно выполняются в средах разработки или CI, поэтому их результаты редко появляются в <Constant name="catalog" /> для среды production. |
| Результаты проверки актуальности источников | [dbt source freshness](/reference/commands/source#dbt-source-freshness) в рамках задания в этой среде |
| Сведения о снимках | [dbt snapshot](/reference/commands/snapshot) или [dbt build](/reference/commands/build) в рамках задания в этой среде |
| Сведения о seed | [dbt seed](/reference/commands/seed) или [dbt build](/reference/commands/build) в рамках задания в этой среде |

</VersionBlock>

<VersionBlock firstVersion="2.0">

| Чтобы просмотреть в <Constant name="catalog" /> | Необходимо успешно выполнить |
|---------------------|---------------------------|
| Все метаданные        | [dbt build](/reference/commands/build) и [dbt source freshness](/reference/commands/source#dbt-source-freshness) вместе в рамках одного задания в этой среде |
| Зависимости модели, сведения о ней или результаты выполнения | [dbt run](/reference/commands/run) или [dbt build](/reference/commands/build) для конкретной модели в рамках задания в этой среде |
| Столбцы и статистику для моделей, источников и снимков| Любое [задание](/docs/explore/build-and-view-your-docs) в этой среде. Задания, использующие v2, автоматически обновляют метаданные каталога. |
| Результаты тестов данных | [dbt test](/reference/commands/test) или [dbt build](/reference/commands/build) в рамках задания в этой среде |
| Результаты модульных тестов | [dbt test](/reference/commands/test) или [dbt build](/reference/commands/build) в рамках задания в этой среде. Модульные тесты обычно выполняются в средах разработки или CI, поэтому их результаты редко появляются в <Constant name="catalog" /> для среды production. |
| Результаты проверки актуальности источников | [dbt source freshness](/reference/commands/source#dbt-source-freshness) в рамках задания в этой среде |
| Сведения о снимках | [dbt snapshot](/reference/commands/snapshot) или [dbt build](/reference/commands/build) в рамках задания в этой среде |
| Сведения о seed | [dbt seed](/reference/commands/seed) или [dbt build](/reference/commands/build) в рамках задания в этой среде |

</VersionBlock>
