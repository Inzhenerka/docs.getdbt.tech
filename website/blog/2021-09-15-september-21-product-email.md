---
title: "Обновление dbt за сентябрь 2021: DAG в IDE + API метаданных в GA"
description: "dbt v1.0 скоро выйдет! Не забудьте обновить свои проекты до последней версии."
slug: dbt-product-update-2021-september
authors: [lauren_craigie] 

hide_table_of_contents: false

date: 2021-09-15
is_featured: false
---

:::tip Обновление за февраль 2024 года

Прошло уже несколько лет с тех пор, как dbt-core достиг версии 1.0! С тех пор мы взяли на себя обязательство по возможности не выпускать ломающие изменения, и обновление версий dbt Core стало значительно проще.

В 2024 году мы идём ещё дальше и делаем следующее:

- Стабилизация интерфейсов для всех — разработчиков и сопровождающих адаптеров, потребителей метаданных и, конечно же, всех, кто пишет код dbt, — как описано в [обновлении нашей дорожной карты за ноябрь 2023 года](https://github.com/dbt-labs/dbt/blob/main/docs/roadmap/2023-11-dbt-tng.md).
- Внедрение [каналов обновлений](/docs/dbt-versions/dbt-release-tracks) (ранее известных как Versionless) в dbt Cloud. Больше никаких ручных обновлений и необходимости во _втором проекте-песочнице_ только ради того, чтобы опробовать новые возможности в среде разработки. Подробнее см. в разделе [Обновление версии Core в Cloud](/docs/dbt-versions/upgrade-dbt-platform-version).

Остальную часть этого поста мы оставляем без изменений, чтобы мы все могли вспомнить, как это было раньше. Приятной прогулки по волнам памяти.

:::

Привет!

Помните? 21-й день сентября? 🎶 Конечно, помните, это было **два дня назад**. Ну, это уже победа в вашем активе, а день только начался! Так давайте добьемся победы для кого-то еще — например, для Джереми Коэна, менеджера по продукту dbt Core.

Я уверен, вы знаете, что половина обновлений в этом письме автоматически внедряется, когда мы обновляем всех до последней версии dbt Cloud 🚀

Но знали ли вы, что другая половина требует, чтобы вы (или ваш администратор аккаунта) активно переключались на последнюю версию dbt *Core*? 😱 Если это не происходит регулярно (видео-инструкция [здесь](https://www.loom.com/share/10f153f24b5448ad96074ebd0b2d917c?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD)), вы можете упустить важные улучшения производительности, стабильности и скорости.

Сделайте Джереми приятное и загляните в [блог](http://blog.getdbt.com/getting-ready-for-v1-0/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD), который он только что опубликовал, о том, почему это имеет еще большее значение в преддверии 💥dbt v1.0💥. Пока мы раздаем победы, не забудьте также [зарегистрироваться на его выступление на Coalesce](https://coalesce.getdbt.com/talks/dbt-v10-reveal/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD)!

<!--truncate-->


## **Что нового** {#whats-new}
--------------

### dbt v0.20.2 {#dbt-v0202}
- Загляните в канал [#dbt-releases](https://getdbt.slack.com/archives/C37J8BQEL?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD) в сообществе dbt Slack для получения полной информации!
- Больше исправлений ошибок, поддержка последней версии Python и лучшая на сегодняшний день частичная разборка для стабильной и быстрой разработки

### dbt v0.21.0-rc1 {#dbt-v0210-rc1}
- Загляните в канал [#dbt-prereleases](https://getdbt.slack.com/archives/C016X6ABVUK?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD) в сообществе dbt Slack и пост Джереми на [Discourse](https://discourse.getdbt.com/t/prerelease-dbt-core-v0-21-louis-kahn/3077?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD)!
- dbt build: Вы видели наш тизер в прошлом месяце на [Staging](https://www.youtube.com/watch?v=-XRD_IjWX2U&utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD)?
- Определение конфигураций ресурсов во всех ожидаемых местах (например, YAML файлы)
- Фиксация изменений в макросах в state:modified для лучшей Slim CI

 ![Screen Shot 2021-09-20 at 11.34.47 AM (1)](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202021-09-20%20at%2011.34.47%20AM%20(1).png?upscale=true&width=600&upscale=true&name=Screen%20Shot%202021-09-20%20at%2011.34.47%20AM%20(1).png) 

### dbt Cloud v1.1.32 - v1.1.35: {#dbt-cloud-v1132-v1135}
- Журнал изменений и дополнительные материалы находятся [здесь.](https://docs.getdbt.tech/docs/dbt-cloud/cloud-changelog?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD)*
- [DAG в IDE](https://blog.getdbt.com/on-dags-hierarchies-and-ides/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD): Мы хотим, чтобы пользователи имели беспрепятственный опыт при навигации между кодом и контекстом. Встраивание DAG в IDE значительно упрощает исследование структуры проекта
 ![Screen Shot 2021-09-22 at 4.59.24 PM](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Screen%20Shot%202021-09-22%20at%204.59.24%20PM.png?upscale=true&width=1120&upscale=true&name=Screen%20Shot%202021-09-22%20at%204.59.24%20PM.png) 
- [Metadata API](https://docs.getdbt.com/docs/dbt-apis/metadata-api?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD): Теперь общедоступен (GA)! Оценивайте состояние данных с помощью метаданных, созданных при последних запусках заданий dbt
-   [Плитки статуса для дашбордов](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-dashboard-status-tiles?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD): Встраивайте эту плитку везде, где поддерживаются iFrame, чтобы быстро проверять актуальность данных

## Новые ресурсы {#new-resources}
--------------

### Что почитать 📚 {#things-to-read}

- Подписались ли вы на [Обзор аналитической инженерии](https://roundup.getdbt.com/subscribe?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD)? Тристан (основатель и генеральный директор dbt Labs) и Анна (директор сообщества) только начали чередовать отправку по воскресеньям, давая им обоим немного больше времени, чтобы углубиться в тему, которая актуальна для всех в Data Twitter. Последнее размышление Анны? *[Ваш PM по данным не является панацеей](https://roundup.getdbt.com/p/your-data-pm-is-not-a-panacea?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD).*

### Что послушать 🎧 {#things-to-listen-to}

- Последний [эпизод](https://roundup.getdbt.com/p/brittany-bennett-sunrise-movement?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD) подкаста Analytics Engineering вышел сегодня утром, и я буквально слушаю его, пока печатаю. Гость, Бриттани Беннетт, говорит о найме на основе соответствия миссии, а не "технических" навыков. Я даже чувствую это в маркетинге продукта, поэтому мне интересно провести параллели! *Также, если вы думаете, что могли бы лучше справиться с этими письмами (я не сомневаюсь, что вы могли бы), вы должны присоединиться к моей команде — свяжитесь со мной.*

- Если вы пропустили предыдущий эпизод подкаста, наши друзья из [Hex](https://hex.tech/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD) присоединились к Тристану и Джулии, чтобы задать вопрос: *"Что если бы сотрудничество команды данных выглядело больше как GDoc, чем как Git workflow?"* 😱 Вдалеке можно услышать, как я спрашиваю, почему сотрудничество в маркетинге не может выглядеть больше как Powerpoint, но никто не отвечает, потому что никто не согласен.

### Что испытать ✨ {#things-to-experience}

- Всемирно известный ведущий подкастов и менеджер по продукту Джулия Шоттенштейн выступает на [конференции Open Source Data](https://www.opensourcedatastack.com/?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD) на следующей неделе! Она присоединится к звездной панели друзей из Snowplow, Meltano, Elementl и других.

- Всемирно известная воздушная акробатка и архитектор решений Эми Чен проведет мастер-класс на [Snowflake Build Summit](https://www.snowflake.com/build/?utm_source=dbt-labs&utm_medium=referral&utm_campaign=build-summit-na-en-partner-dbt&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD) в следующем месяце! Они поделятся [как построить масштабируемый конвейер данных](https://events.snowflake.com/build/agenda/session/619834?utm_campaign=Monthly%20Product%20Updates&utm_source=hs_email&utm_medium=email&_hsenc=p2ANqtz-8nIpohDBSr7SvpXrqY-5ONmnjdIgW0XMiAPkjQTb9Pgwt24nzqAWNX2Xgtj8LA0LrPoHpD) с использованием dbt + Snowflake для случаев использования в финансовой отчетности.

### Что наблюдать 👀 {#things-to-observe}

- Это фото меня на вершине горы Уитни после моего одиночного похода SOBO по JMT в прошлом месяце. Это и причина, по которой я больше никогда не буду есть овсянку, и причина, по которой вы не получили новостную рассылку в августе. *Извините за это.*

 ![Image from iOS (2)](https://hs-8698602.f.hubspotemail.net/hub/8698602/hubfs/Image%20from%20iOS%20(2).jpg?upscale=true&width=400&upscale=true&name=Image%20from%20iOS%20(2).jpg) 

Эй, спасибо за чтение. Я ценю вас.

*Лорен Крейги*  
*Директор по маркетингу продукта, dbt Labs*