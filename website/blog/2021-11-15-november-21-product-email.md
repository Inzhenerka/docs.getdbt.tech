---
title: "Обновление dbt за ноябрь 2021: v1.0, переменные окружения и вопрос о размере волн 🌊"
description: "Будьте в курсе последних функций dbt. Читайте о нашем обновлении продукта за ноябрь 2021 года."
slug: dbt-product-update-2021-november
authors: [lauren_craigie] 

hide_table_of_contents: false

date: 2021-11-15
is_featured: false
---

Привет,

Прежде чем перейти к делу, хочу быстро напомнить, что до Coalesce осталось меньше 3 недель! 😱 Если бы вам нужно было выбрать только ОДНУ из более чем 60 сессий, обратите внимание на [ключевую речь Тристана с Мартином Касадо из A16z](https://coalesce.getdbt.com/talks/keynote-how-big-is-this-wave/?utm_medium=email&utm_source=hs_email&utm_campaign=h2-2021_coalesce-2021_awareness&utm_content=connect_prod-2_&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo).

Она включает два моих любимых элемента:

1) Острота 🌶️

2) На самом деле не о нас 😅

Мартин и Тристан обсудят то, о чем мы все, вероятно, задумывались с последней волной инноваций (и финансирования) в нашей области:

*Является ли современный стек данных просто очередной волной в длинной череде модных технологий или он как-то более постоянен?*

Узнайте их мнение и поделитесь своим, [зарегистрировавшись здесь](https://coalesce.getdbt.com/talks/keynote-how-big-is-this-wave/?utm_medium=email&utm_source=hs_email&utm_campaign=h2-2021_coalesce-2021_awareness&utm_content=connect_prod-2_&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo).

<!--truncate-->

## **Что нового** {#whats-new}
--------------

### dbt v1.0.0rc1: {#dbt-v100rc1}
- Посетите канал [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) в сообществе dbt Slack и пост Джереми на [Discourse](https://discourse.getdbt.com/t/prerelease-dbt-core-v1-0-0-b1/3180?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo)!

-   Первый релиз-кандидат v1.0 уже доступен! 🎉 Я уже немного рассказывал о v1.0, но эта версия также включает новый интерфейс логирования и первые шаги в решении [задачи по метрикам](https://github.com/dbt-labs/dbt/issues/4071?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo), упомянутой в прошлом месяце *(Дрю расскажет об этом гораздо подробнее на [Coalesce](https://coalesce.getdbt.com/talks/keynote-building-a-force-of-gravity/?utm_medium=ema%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo)!)*

### dbt v0.21.1: {#dbt-v0211}
- Посетите канал [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) в сообществе dbt Slack!

-   Доступен релиз-кандидат v0.21.1, а официальный выпуск запланирован на следующую неделю. В этом выпуске устранены некоторые [проблемы с замедлением работы](https://github.com/dbt-labs/dbt/issues/4012?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo), возникавшие в крупных проектах на v0.21.0.

### dbt Cloud v1.1.38 - v1.1.39: *Список изменений и документация находятся [здесь.](https://docs.getdbt.tech/docs/dbt-cloud/cloud-changelog?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo)* {#dbt-cloud-v1138-v1139-changelog-docs-located-here}

- [Переменные окружения](https://docs.getdbt.tech/docs/dbt-cloud/using-dbt-cloud/cloud-environment-variables?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) появились в dbt Cloud! Клонируйте приватные пакеты, ограничивайте данные, обрабатываемые в средах разработки, и многое другое.

## Новые ресурсы {#new-resources}
--------------

### Что попробовать 🛠️ {#things-to-try}

- Новый курс! Если вы новичок в dbt и хотите узнать, как перенести устаревший код трансформации в модульные модели данных dbt, наш новый [курс по рефакторингу](https://blog.getdbt.com/sql-refactoring-course/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) может помочь! *Он занимает всего 3,5 часа, так что никаких оправданий* 🙂

### Что почитать 📚 {#things-to-read}

- [dbt Discourse](https://discourse.getdbt.com/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) стал отличным местом для задавания вопросов в длинной форме и обмена полезными инструкциями, такими как [эта невероятно популярная статья](https://discourse.getdbt.com/t/how-we-sped-up-our-ci-runs-by-10x-using-slim-ci/2603?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) о 10-кратном ускорении CI с использованием Slim CI. Но чтобы собрать больше знаний от нашего сообщества, нам нужна большая лодка. Следите за решением, которое появится 29 ноября 👀
- Можете угадать, какая должность является самой популярной среди зарегистрировавшихся на Coalesce? 🛎️ Инженер данных! Но вам не обязательно быть им, чтобы получить пользу от более чем 60 сессий, предлагаемых на этой неделе. Ознакомьтесь с [этим блогом](https://blog.getdbt.com/coalesce-returns-for-year-two-this-december/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo) от самой Королевы Coalesce, чтобы помочь вам решить, какие сессии подходят именно вам.

### Что послушать 🎧 {#things-to-listen-to}

- Жюльен Ле Дем присоединился к [подкасту Analytics Engineer](https://roundup.getdbt.com/p/ep-10-why-data-lineage-matters-w?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo), чтобы поговорить о том, как проекты с открытым исходным кодом становятся стандартами и почему <Term id="data-lineage" /> в частности нуждается в открытом стандарте.

- [Восхождение инженера аналитики](https://youtu.be/ixyzF4Dy9Us?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-9SoWbfj9_ZRDew6i8p8yand1JSmLh7yfridIrLwO7bgHTUmnbKcRp3AEKCO8pOytotdxAo): Анна, директор сообщества dbt Labs, присоединилась к Thoughtspot, чтобы обсудить эволюцию инженерии аналитики или появление "полноценного аналитика данных".

На этом пока все! Увидимся на Coalesce!

*Лорен Крейджи*  
*Директор по маркетингу продукта, dbt Labs*