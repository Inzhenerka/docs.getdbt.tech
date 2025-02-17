---
title: "О проектах dbt"
id: "projects"
pagination_next: null
pagination_prev: null
---

Проект dbt информирует dbt о контексте вашего проекта и о том, как трансформировать ваши данные (создавать наборы данных). По замыслу, dbt обеспечивает верхнеуровневую структуру проекта dbt, такую как файл `dbt_project.yml`, директорию `models`, директорию `snapshots` и так далее. В пределах верхнеуровневых директорий вы можете организовать свой проект любым способом, который соответствует потребностям вашей организации и конвейера данных.

Минимально, все, что нужно проекту, это файл конфигурации проекта `dbt_project.yml`. dbt поддерживает ряд различных ресурсов, поэтому проект может также включать:

| Ресурс  | Описание  |
| :--- | :--- |
| [models](/docs/build/models) | Каждая модель находится в одном файле и содержит логику, которая либо преобразует сырые данные в набор данных, готовый для аналитики, либо, чаще всего, является промежуточным шагом в таком преобразовании. |
| [snapshots](/docs/build/snapshots) | Способ зафиксировать состояние ваших изменяемых таблиц, чтобы вы могли обратиться к нему позже. |
| [seeds](/docs/build/seeds) | CSV-файлы со статическими данными, которые вы можете загрузить в вашу платформу данных с помощью dbt. |
| [data tests](/docs/build/data-tests) | SQL-запросы, которые вы можете написать для тестирования моделей и ресурсов в вашем проекте. |
| [macros](/docs/build/jinja-macros) | Блоки кода, которые вы можете использовать многократно. |
| [docs](/docs/build/documentation) | Документация для вашего проекта, которую вы можете создать. |
| [sources](/docs/build/sources) | Способ именования и описания данных, загруженных в ваш хранилище инструментами Extract и Load. |
| [exposures](/docs/build/exposures) | Способ определения и описания использования вашего проекта на нижнем уровне. |
| [metrics](/docs/build/build-metrics-intro) | Способ определения метрик для вашего проекта. |
| [groups](/docs/build/groups) | Группы позволяют организовывать узлы совместно в ограниченных коллекциях. |
| [analysis](/docs/build/analyses) | Способ организации аналитических SQL-запросов в вашем проекте, таких как главная книга из вашего QuickBooks. |
| [semantic models](/docs/build/semantic-models) | Семантические модели определяют основные отношения данных в [MetricFlow](/docs/build/about-metricflow) и [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), позволяя вам запрашивать метрики с использованием семантического графа. |
| [saved queries](/docs/build/saved-queries) | Сохраненные запросы организуют повторно используемые запросы, группируя метрики, измерения и фильтры в узлы, видимые в dbt DAG. |

При создании структуры вашего проекта вы должны учитывать следующие аспекты, влияющие на рабочий процесс вашей организации:

* **Как люди будут запускать команды dbt** &mdash; Выбор пути
* **Как люди будут навигировать внутри проекта** &mdash; Будь то разработчики в IDE или заинтересованные стороны из документации
* **Как люди будут настраивать модели** &mdash; Некоторые массовые настройки проще выполнять на уровне директории, чтобы людям не приходилось помнить о необходимости делать все в блоке конфигурации с каждой новой моделью

## Конфигурация проекта
Каждый проект dbt включает файл конфигурации проекта под названием `dbt_project.yml`. Он определяет директорию проекта dbt и другие конфигурации проекта.

Редактируйте `dbt_project.yml`, чтобы настроить общие конфигурации проекта, такие как:

<div align="center">

| YAML ключ  | Описание значения  |
| :--- | :--- |
| [name](/reference/project-configs/name) | Имя вашего проекта в [snake case](https://en.wikipedia.org/wiki/Snake_case) |
| [version](/reference/project-configs/version) | Версия вашего проекта |
| [require-dbt-version](/reference/project-configs/require-dbt-version) | Ограничьте ваш проект для работы только с определенным диапазоном [версий dbt Core](/docs/dbt-versions/core) |
| [profile](/reference/project-configs/profile) | Профиль, который dbt использует для подключения к вашей платформе данных |
| [model-paths](/reference/project-configs/model-paths) | Директории, где находятся ваши файлы моделей и источников  |
| [seed-paths](/reference/project-configs/seed-paths) | Директории, где находятся ваши seed-файлы |
| [test-paths](/reference/project-configs/test-paths) | Директории, где находятся ваши тестовые файлы |
| [analysis-paths](/reference/project-configs/analysis-paths) | Директории, где находятся ваши анализы |
| [macro-paths](/reference/project-configs/macro-paths) | Директории, где находятся ваши макросы |
| [snapshot-paths](/reference/project-configs/snapshot-paths) | Директории, где находятся ваши снимки |
| [docs-paths](/reference/project-configs/docs-paths) | Директории, где находятся ваши блоки документации |
| [vars](/docs/build/project-variables) | Переменные проекта, которые вы хотите использовать для компиляции данных |

</div>

Для получения полной информации о конфигурациях проекта, смотрите [dbt_project.yml](/reference/dbt_project.yml).

## Поддиректории проекта

Вы можете использовать опцию поддиректории проекта в dbt Cloud, чтобы указать поддиректорию в вашем git-репозитории, которую dbt должен использовать в качестве корневой директории для вашего проекта. Это полезно, когда у вас есть несколько проектов dbt в одном репозитории или когда вы хотите организовать файлы вашего проекта dbt в поддиректории для более легкого управления.

Чтобы использовать опцию поддиректории проекта в dbt Cloud, выполните следующие шаги:

1. Нажмите на значок шестеренки в правом верхнем углу страницы и выберите **Настройки аккаунта**.

2. В разделе **Проекты** выберите проект, который вы хотите настроить как поддиректорию проекта.

3. Выберите **Редактировать** в нижнем правом углу страницы.

4. В поле **Поддиректория проекта** добавьте имя поддиректории. Например, если файлы вашего проекта dbt находятся в поддиректории `<repository>/finance`, введите `finance` как поддиректорию.

    * Вы также можете ссылаться на вложенные поддиректории. Например, если файлы вашего проекта dbt находятся в `<repository>/teams/finance`, введите `teams/finance` как поддиректорию. **Примечание**: Вам не нужно добавлять ведущий или завершающий `/` в поле Поддиректория проекта.

5. Нажмите **Сохранить**, когда закончите.

После настройки опции поддиректории проекта, dbt Cloud будет использовать ее в качестве корневой директории для вашего проекта dbt. Это означает, что команды dbt, такие как `dbt run` или `dbt test`, будут работать с файлами в указанной поддиректории. Если в поддиректории проекта нет файла `dbt_project.yml`, вам будет предложено инициализировать проект dbt.

## Новые проекты

Вы можете создавать новые проекты и [делиться ими](/docs/collaborate/git-version-control) с другими людьми, делая их доступными в размещенном git-репозитории, таком как GitHub, GitLab и BitBucket.

После того как вы настроите соединение с вашей платформой данных, вы можете [инициализировать ваш новый проект в dbt Cloud](/guides) и начать разработку. Или запустите [dbt init из командной строки](/reference/commands/init), чтобы настроить ваш новый проект.

Во время инициализации проекта dbt создает примерные файлы моделей в вашей директории проекта, чтобы помочь вам быстро начать разработку.

## Примерные проекты

Если вы хотите более подробно изучить проекты dbt, вы можете клонировать [Jaffle shop](https://github.com/dbt-labs/jaffle_shop) от dbt Lab на GitHub. Это исполняемый проект, который содержит примерные конфигурации и полезные заметки.

Если вы хотите увидеть, как выглядит зрелый, производственный проект, ознакомьтесь с [публичным репозиторием команды данных GitLab](https://gitlab.com/gitlab-data/analytics/-/tree/master/transform/snowflake-dbt).

## Связанные документы
* [Лучшие практики: Как мы структурируем наши проекты dbt](/best-practices/how-we-structure/1-guide-overview)
* [Быстрый старт для dbt Cloud](/guides)
* [Быстрый старт для dbt Core](/guides/manual-install)