---
title: "Обновление dbt за август 2022: бета-версия v1.3, Программа технологических партнеров и Coalesce!"
description: "До Coalesce осталось менее 2 месяцев!"
slug: dbt-product-update-2022-august
authors: [lauren_craigie] 

hide_table_of_contents: false

date: 2022-08-31
is_featured: false
---

Семантический слой, поддержка моделей на Python, новый интерфейс dbt Cloud и IDE... наша команда с нетерпением ждет возможности поделиться с вами всем этим на [Coalesce](https://coalesce.getdbt.com/register?utm_medium=email&utm_source=hs_email&utm_campaign=q3-2023_coalesce-2022_awareness&utm_content=connect_product-update_) через несколько недель.

Но *как* все это сочетается — в связи с тем, куда движется dbt Labs — это то, о чем я больше всего хочу поговорить.

Вы услышите больше в [ключевом выступлении Тристана](https://coalesce.getdbt.com/agenda/keynote-the-end-of-the-road-for-the-modern-data-stack-you-know), но сейчас самое время напомнить вам, что Coalesce — это не только ответы на сложные вопросы... это также возможность их поднять. Это возможность поделиться вызовами, которые мы испытывали в изоляции, найти людей, с которыми вы хотите их решить, и потратить оставшуюся часть года на их преодоление. Как говорит Тристан в своем последнем блоге, [так эта индустрия движется вперед](https://www.getdbt.com/blog/finding-our-next-big-problem/).

[ЗАРЕГИСТРИРУЙТЕСЬ СЕЙЧАС](https://coalesce.getdbt.com/register?utm_medium=email&utm_source=hs_email&utm_campaign=q3-2023_coalesce-2022_awareness&utm_content=connect_product-update_)

<!--truncate-->

## **Что нового** {#whats-new}

- **Бета-версия dbt Core v1.3:** Используете Python для аналитики? Первая предварительная бета-версия dbt Core v1.3, включающая поддержку моделей dbt, написанных на Python, уже [доступна для ознакомления](https://docs.getdbt.com/docs/dbt-versions/dbt-upgrade/Older%20versions/upgrading-to-v1.3)! Попробуйте её и узнайте больше о поддерживаемых в dbt моделях на Python [в нашей документации](/docs/build/python-models).
- **Программа технологического партнёрства:** Мы только что запустили нашу новую [программу технологического партнёрства](https://www.getdbt.com/blog/dbt-labs-technology-partner-program/) совместно с более чем 40 партнёрами из экосистемы Modern Data Stack, чтобы обеспечить стабильную поддержку бесшовных интеграций, на которые могут положиться наши общие пользователи. Посетите новую [страницу интеграций dbt Cloud](http://www.getdbt.com/product/integrations), чтобы узнать, что доступно уже сегодня!
- **Пользователям выделенных сред (single-tenant):** dbt Cloud v1.1.60 теперь доступен в dbt Cloud Enterprise.

## Что улучшилось {#whats-better}

- **Интерфейс dbt Cloud:** [Новый интерфейс dbt Cloud](https://www.getdbt.com/blog/the-dbt-cloud-ui-is-getting-a-makeover/) находится в бета-версии и доступен для любого клиента dbt Cloud с несколькими арендаторами. Упрощенный интерфейс, улучшенная эргономика, меньше кликов до часто используемых экранов.
- **IDE dbt Cloud:** Вы заметили [Staging в прошлом месяце](https://www.getdbt.com/blog/staging-highlights-the-latest-from-dbt-labs/) (наше ежеквартальное обновление продукта)? IDE dbt Cloud был переработан для повышения скорости и производительности и теперь находится в бета-версии — [запишитесь, чтобы проверить!](https://bit.ly/dbt-cloud-ide-beta)

## Новые ресурсы {#new-resources}

**Что попробовать** 🛠️

- **dbt_artifacts v1.2.0:** [Brooklyn Data Co только что выпустила значительную переработку пакета dbt_artifacts](https://brooklyndata.co/blog/dbt-artifacts-v100). Захватывайте все метаданные, сгенерированные dbt в конце вызова (узлы проекта, процент успешности, результаты тестов и т.д.), и сохраняйте их непосредственно в Snowflake, Databricks или BigQuery для немедленного анализа.
- **Валидатор dbt YAML с использованием JSON схемы**: Если вы разрабатываете в VS Code, [этот репозиторий разблокирует автозаполнение и валидацию для YAML файлов dbt](https://github.com/dbt-labs/dbt-jsonschema/). Найдите те тесты, которые никогда не запускались из-за ошибки в отступах. *Не то чтобы это когда-либо случалось с вами.*
- **dbt Exposures для Hightouch**: [Exposures](https://docs.getdbt.tech/docs/build/exposures) в dbt позволяют быстро увидеть, как приложения, использующие данные, применяют ваши модели и источники dbt. Это не обязательно должны быть только дашборды в BI инструментах — [теперь вы можете представлять свои синхронизации Hightouch как dbt exposures](https://hightouch.com/blog/introducing-dbt-exposures-for-hightouch/).
- **Вы сертифицированный разработчик dbt?** Мы недавно запустили нашу новую программу [сертификации аналитических инженеров](https://www.getdbt.com/certifications/analytics-engineer-certification-exam/), и нам было бы интересно услышать ваше мнение. Нам особенно понравился [этот отзыв от Чарльза Верлейена](https://medium.com/astrafy/dbt-exam-feedback-8d07a0593648) о том, чего ожидать и сколько опыта/подготовки он рекомендует.

**Что почитать 📚**

- **Как применять правила в масштабе:** Это лучшая практика — добавлять тесты моделей в dbt, но можно ли это требовать? [В своем последнем блоге](https://docs.getdbt.tech/blog/enforcing-rules-pre-commit-dbt) Бенуа Перигод (старший аналитический инженер dbt Labs) делится, как использовать пакет pre-commit-dbt для этого.
- **Как мы сократили время выполнения модели на 90 минут:** [Узнайте, как мы использовали вкладку времени выполнения модели](https://docs.getdbt.tech/blog/how-we-shaved-90-minutes-off-model) в dbt Cloud, чтобы найти и переработать нашу самую долгую модель.
- **Как выбрать между хешированными или целочисленными суррогатными ключами:** Дэйв Коннорс (старший аналитический инженер dbt Labs) [разбирает плюсы и минусы каждого подхода](https://docs.getdbt.tech/blog/managing-surrogate-keys) в dbt.
- **Как думать о моделях dbt на Python в Snowpark:** [Эда Джонсон](https://www.linkedin.com/in/eda-johnson-saa-csa-pmp-0a2783/) написала хороший вводный материал о [подходе к моделям dbt на Python в Snowflake](https://medium.com/snowflake/a-first-look-at-the-dbt-python-models-with-snowpark-54d9419c1c72) с использованием Snowpark Python.
- **dbt Labs официально сотрудничает с Monte Carlo**: Партнерство упрощает для аналитических инженеров [дополнение тестирования dbt сквозной наблюдаемостью](https://www.getdbt.com/blog/monte-carlo-dbt-labs-partnering-for-more-reliable-data/).
- **Как Comcast случайно изобрела хранилище признаков в 2013 году:** Это действительно увлекательное чтение. Джош Берри описывает [взлеты и падения быстро развивающейся команды по науке о данных](https://towardsdatascience.com/features-are-not-just-for-data-scientists-6319406ac071), которая преодолела первоначальное отвращение к документации, чтобы создать "Розетту".

**Уголок консультирования** 🌎

Я только что обнаружила кладезь отличных ресурсов от консультантов-партнеров dbt Labs и хочу начать делиться ими здесь. Вот несколько, которые вы могли пропустить летом:

- **Сократите затраты на ETL:** Я только что увидела [этот блог](https://www.mighty.digital/blog/how-dbt-helped-us-reduce-our-etl-costs-significantly) от Mighty Digital и нашла его очень практичным (и кратким) вводным руководством по переосмыслению вашего <Term id="etl">ETL конвейера</Term> с dbt.
- **Исследуйте данные:** [Вторая часть серии об исследовании данных](https://vivanti.com/2022/07/28/exploring-data-with-dbt-part-2-extracting/) от Vivanti. Этот пост фокусируется на работе с <Term id="json" /> объектами в dbt, но я также рекомендую предыдущий пост, если вы хотите увидеть, как они развернули свой стек.
- **Отслеживайте исторические изменения:** [](https://blog.montrealanalytics.com/using-dbt-snapshots-with-dev-prod-environments-e5ed63b2c343)Снимки — это довольно удобная функция для отслеживания изменений в dbt, но они часто упускаются из виду при первоначальном внедрении. [Montreal Analytics объясняет, как их настроить](https://blog.montrealanalytics.com/using-dbt-snapshots-with-dev-prod-environments-e5ed63b2c343) в dev/prod средах.
- **Изучите dbt:** Есть новые лица в команде данных, которым может понадобиться введение в dbt? Наши друзья из GoDataDriven проводят [виртуальное обучение dbt с 12 по 14 сентября](https://www.tickettailor.com/events/dbtlabs/752537).

Спасибо!

*Этот выпуск новостей был подготовлен: Джоэлом, Глорией, Аззамом, Амосом и мной (Лорен)*