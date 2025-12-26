---
title: "Обновление dbt за октябрь 2021: Метрики и фокусы 🎩"
description: "Будьте в курсе последних функций dbt. Читайте о нашем обновлении продукта за октябрь 2021 года."
slug: dbt-product-update-2021-october
authors: [lauren_craigie]

hide_table_of_contents: false

date: 2021-10-15
is_featured: false
---

:::tip February 2024 Update

Прошло уже несколько лет с тех пор, как dbt-core достиг версии 1.0! С тех пор мы стараемся по возможности выпускать обновления без ломающих изменений, и обновление версий dbt Core стало значительно проще.

В 2024 году мы идём ещё дальше и делаем следующее:

- Стабилизируем интерфейсы для всех — мейнтейнеров адаптеров, потребителей метаданных и (конечно же) всех, кто пишет dbt-код — как это обсуждалось в [обновлении roadmap за ноябрь 2023 года](https://github.com/dbt-labs/dbt-core/blob/main/docs/roadmap/2023-11-dbt-tng.md).
- Добавляем [Release tracks](/docs/dbt-versions/cloud-release-tracks) (ранее известные как Versionless) в dbt Cloud. Больше никаких ручных обновлений и никакой необходимости в _отдельном sandbox-проекте_ только для того, чтобы попробовать новые возможности в разработке. Подробнее см. в разделе [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

Мы оставляем остальную часть этого поста без изменений, чтобы мы все могли помнить, как это было раньше. Приятной прогулки по волнам памяти.

:::

Привет,

Хотя у меня есть много интересного, чем можно поделиться в этом месяце, я не могу начать с чего-то другого, кроме этого:

[![Скриншот 2021-10-20 в 6.12.16 PM](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202021-10-20%20at%206.12.16%20PM.png?upscale=true&width=800&upscale=true&name=Screen%20Shot%202021-10-20%20at%206.12.16%20PM.png)](https://twitter.com/getdbt/status/1449090582865981442?s=20&utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)

Да, это официально:

**💥[dbt будет поддерживать определение метрик](https://github.com/dbt-labs/dbt-core/issues/4071?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)💥**

С этой функцией вы сможете централизованно определять правила для агрегации метрик (например, "активные пользователи" или "MRR") в коде проекта dbt, который находится под версионным контролем, протестирован и документирован.

<!--truncate-->

Нам еще предстоит пройти долгий путь, но в будущем вы сможете исследовать эти метрики в инструментах BI и аналитики, которые вы знаете и любите.

Джереми (менеджер продукта dbt) расскажет больше о слое метрик в своем [презентации v1.0 на Coalesce](https://coalesce.getdbt.com/talks/dbt-v10-reveal/?utm_medium=email&utm_source=hs_email%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).

Хотя эта тема играет значительную вспомогательную роль в [ключевой речи Дрю](https://coalesce.getdbt.com/talks/keynote-building-a-force-of-gravity/?utm_medium=ema%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ), *это не вся история*🍿. В своем выступлении Дрю свяжет несколько тем, актуальных для индустрии прямо сейчас, и представит некоторые *очень* захватывающие перспективы для dbt и сообщества в целом.

*Вы действительно не хотите пропустить это - [зарегистрируйтесь бесплатно здесь](https://coalesce.getdbt.com/talks/keynote-building-a-force-of-gravity/?utm_medium=ema%5B%E2%80%A6%5Dn%3Dh2-2021_coalesce-2021_awareness&utm_content=connect_prod_&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).*

## Что нового
--------------

У меня есть три действительно захватывающие вещи, которыми я хочу поделиться в этом месяце!

### dbt v0.21: 
-	Посмотрите канал [#dbt-releases](https://getdbt.slack.com/archives/C37J8BQEL?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) в Slack-сообществе dbt для получения полной информации!

-   [dbt build](https://docs.getdbt.com/reference/commands/build?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) здесь! 🙌 Эта команда выполняет все, что вы хотите сделать в DAG, по порядку, и делает это с *мнениями*: Запускает модели, тестирует тесты, делает снимки и загружает данные, уделяя приоритетное внимание качеству и устойчивости. Сократите несколько шагов до одной команды и следуйте лучшим практикам 🚗

### v1.0 beta: 
-	Посмотрите канал [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) в Slack-сообществе dbt и пост Джереми на [Discourse](https://discourse.getdbt.com/t/prerelease-dbt-core-v1-0-0-b1/3180?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)!*

-   v1.0 — это огромная веха со всеми дополнениями, включая 100-кратное ускорение парсинга проектов по сравнению с v0.19.0 ⚡. Мы рады отпраздновать это с вами во время [сессии Джереми на Coalesce](https://coalesce.getdbt.com/talks/dbt-v10-reveal/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ), но до тех пор мы надеемся, что вы попробуете [бета-версию](https://getdbt.slack.com/archives/C016X6ABVUK/p1634151813050300?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)! И не забудьте присоединиться к каналу [#dbt-v1-readiness](https://getdbt.slack.com/archives/C02HM9AAXL4?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) в Slack.

### dbt Cloud v1.1.36 - v1.1.37
-	Список изменений и документация находятся [здесь.](https://docs.getdbt.com/docs/dbt-cloud/cloud-changelog?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)

-   [Бета-версия узких мест модели](https://getdbt.slack.com/archives/C02GUTGK73N?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ): Определите долго выполняющиеся модели, которые можно переработать (или переназначить). Новая панель времени выполнения модели на странице деталей запуска помогает быстро оценить состав задания, порядок и продолжительность, чтобы оптимизировать ваши рабочие процессы и сократить затраты💰

 ![image-1](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/image-1.png?upscale=true&width=1120&upscale=true&name=image-1.png)

Вкладка Model Timing в dbt Cloud выделяет модели, которые занимают особенно много времени для выполнения.


## Новые ресурсы 
--------------

### Что попробовать 🛠️

-   Почти *500* аккаунтов dbt Cloud используют CI. Хотите знать почему? (или, может быть... *как?*) Джулия объясняет это в своем [последнем блоге](https://blog.getdbt.com/adopting-ci-cd-with-dbt-cloud/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) и делится, как выбрать и настроить непрерывную доставку или развертывание в вашей организации.
- Hex только что [запустил интеграцию](https://hex.tech/blog/dbt-integration?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) с dbt! Она использует [dbt Cloud Metadata API](https://docs.getdbt.com/docs/dbt-cloud-apis/metadata-api?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ), чтобы отображать метаданные из dbt прямо в Hex, позволяя вам быстро получить необходимый контекст по таким вещам, как свежесть данных, без необходимости переключаться между несколькими приложениями и вкладками браузера. Начните [здесь](https://docs.hex.tech/connecting-to-data/configuring-data-connections/dbt-integration?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).
-   [Адаптер dbt-Rockset](https://github.com/rockset/dbt-rockset?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) (теперь в бета-версии) только что получил крупное обновление. Теперь он поддерживает материализации View, Table, Incremental и Ephemeral, чтобы помочь вам выполнять преобразования данных в реальном времени на Rockset. Подробнее читайте [здесь.](https://rockset.com/blog/real-time-data-transformations-dbt-rockset?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).

### Что почитать 📚

-   Все говорят о следующем слое современной дата-стека. Это [не новый разговор](https://benn.substack.com/p/metrics-layer?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ), но он начинает набирать обороты. Анна (директор сообщества dbt Labs) делает феноменальную работу, связывая события этой недели в последнем выпуске [Analytics Engineering Roundup](https://roundup.getdbt.com/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).

### Что посмотреть 📺

-   [Инфраструктура как код и современный опыт работы с данными](https://futuredata.brighttalk.live/talk/19069-506932/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ)

    На конференции Future Data на прошлой неделе Тристан отметил, что рабочие процессы с данными заимствуют многое из инженерии программного обеспечения, но еще не пересекли пропасть DevOps. Чего не хватает? Таблиц? На самом деле... *возможно.* 😅 Ладно, вы должны были быть там. К счастью, вы все еще можете! Посмотрите [запись](https://futuredata.brighttalk.live/talk/19069-506932/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ).
-   [Моделирование поведенческих данных с помощью Snowplow и dbt](https://get.snowplowanalytics.com/wbn/dbt-and-snowplow/data-modeling/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-_wfy8vfjMjwQ7o8TXEOVz-oXI35iVcVP1HtAvriVHfJoAd1IcsP-MCww6vJUDlvAfiuQjZ) (запланировано на 27 октября).
    Наша Санжана Сен присоединяется к команде Snowplow, чтобы обсудить моделирование данных событий Snowplow в dbt — включая то, как структурировать ваши модели данных, какие лучшие практики соблюдать и каких ключевых ошибок избегать.
- Как Blend устранил изолированные данные с помощью dbt и Hightouch.
    Финансово-технологический гигант Blend обрабатывает триллионы долларов в виде кредитов (и недавно вышел на IPO). Присоединяйтесь к этому выступлению с Уильямом Цу (операции по успеху клиентов в Blend), чтобы узнать, как внедрение dbt и Hightouch помогло им преодолеть изолированные данные и продолжать добиваться успеха.

На этом пока все! Спасибо за чтение, и, как всегда, *дайте мне знать, если есть что-то еще, что вы хотите увидеть в этих обновлениях!*

*Лорен Крейги*  
*Директор по маркетингу продукта, dbt Labs*