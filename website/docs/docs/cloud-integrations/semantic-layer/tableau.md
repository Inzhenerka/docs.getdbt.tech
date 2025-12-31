---
title: "Tableau"
description: "Используйте рабочие листы Tableau для выполнения запросов к dbt Semantic Layer и создания панелей с доверенными данными."
tags: [Semantic Layer]
sidebar_label: "Tableau"
---

# Tableau <Lifecycle status="self_service,managed,managed_plus" /> {#tableau}

Интеграция с Tableau позволяет использовать рабочие листы для выполнения запросов напрямую к <Constant name="semantic_layer" /> и создавать дашборды на основе доверенных данных. Она обеспечивает живое подключение к <Constant name="semantic_layer" /> через Tableau Desktop или Tableau Server.

## Предварительные требования {#prerequisites}

- Вы [настроили <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl) и используете dbt версии 1.6 или выше.
- У вас должен быть [Tableau Desktop](https://www.tableau.com/en-gb/products/desktop) версии 2021.1 или выше, Tableau Server либо [Tableau Cloud](https://www.tableau.com/products/cloud-bi).
- Войдите в Tableau Desktop (с учетными данными Cloud или Server) либо в Tableau Cloud. Также можно использовать лицензированное развертывание Tableau Server.
- Для входа вам понадобятся [хост <Constant name="cloud" />](/docs/use-dbt-semantic-layer/setup-sl#3-view-connection-detail), [Environment ID](/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer) и [service token](/docs/dbt-cloud-apis/service-tokens) или [personal access token](/docs/dbt-cloud-apis/user-tokens). Эта учетная запись должна быть настроена для работы с <Constant name="semantic_layer" />.
- У вас должна быть учетная запись <Constant name="cloud" /> уровня Starter или Enterprise ([account](https://www.getdbt.com/pricing)). Подходит как для Multi-tenant, так и для Single-tenant развертывания.

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Установка коннектора {#installing-the-connector}

Коннектор Tableau для <Constant name="semantic_layer" /> доступен для загрузки напрямую на [Tableau Exchange](https://exchange.tableau.com/products/1020). Коннектор поддерживается в Tableau Desktop, Tableau Server и Tableau Cloud.

В качестве альтернативы вы можете выполнить следующие шаги для установки коннектора. Обратите внимание, что эти шаги применимы только к Tableau Desktop и Tableau Server. Коннектор для Tableau Cloud управляется самой Tableau.

1. Загрузите [файл коннектора](https://github.com/dbt-labs/semantic-layer-tableau-connector/releases/latest/download/dbt_semantic_layer.taco) с GitHub локально и добавьте его в вашу папку по умолчанию:

| Операционная система | Tableau Desktop | Tableau Server |
| -------------------- | --------------- | -------------- |
| Windows | `C:\Users\\[Windows User]\Documents\My Tableau Repository\Connectors` | `C:\Program Files\Tableau\Connectors` |
| Mac | `/Users/[user]/Documents/My Tableau Repository/Connectors` | Не применимо |
| Linux | `/opt/tableau/connectors` | `/opt/tableau/connectors` |
 
2. Установите [JDBC драйвер](/docs/dbt-cloud-apis/sl-jdbc) в папку в зависимости от вашей операционной системы:
   - Windows: `C:\Program Files\Tableau\Drivers`
- Mac: `~/Library/Tableau/Drivers` или `/Library/JDBC` или `~/Library/JDBC`
   - Linux: `/opt/tableau/tableau_driver/jdbc`
3. Откройте Tableau Desktop или Tableau Server и найдите коннектор **<Constant name="semantic_layer" /> by dbt Labs** в левой части интерфейса. Возможно, вам потребуется перезапустить эти приложения, чтобы коннектор стал доступен.
4. Подключитесь, используя Host, Environment ID и данные service‑ или personal‑token, которые предоставляет <Constant name="cloud" /> в процессе [настройки <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/setup-sl).
   - В Tableau Server экран аутентификации может отображать поля «User» и «Password». В этом случае в поле User указывается Environment ID, а в поле Password — Service Token.

## Использование интеграции {#using-the-integration}

1. **Аутентификация** &mdash; После аутентификации система перенаправит вас на страницу источника данных.
2. **Доступ ко всем объектам <Constant name="semantic_layer" />** &mdash; Используйте источник данных **"ALL"**, чтобы получить доступ ко всем метрикам, измерениям и сущностям, настроенным в вашем <Constant name="semantic_layer" />. Обратите внимание, что источник данных **"METRICS_AND_DIMENSIONS"** был признан устаревшим и заменён на **"ALL"**. Обязательно используйте живое подключение, так как извлечения (extracts) в настоящее время не поддерживаются.
3. **Доступ к сохранённым запросам** &mdash; При необходимости вы можете получить доступ к отдельным [сохранённым запросам](/docs/build/saved-queries), которые вы определили. Они также будут отображаться как отдельные источники данных при входе в систему.
4. **Доступ к рабочему листу** &mdash; На экране выбора источника данных перейдите напрямую к рабочему листу, используя элемент в левом нижнем углу.
5. **Запрос метрик и измерений** &mdash; После этого в левой части окна вы увидите все метрики, измерения и сущности, доступные для запросов, в зависимости от выбранного источника.

Посетите [документацию Tableau](https://help.tableau.com/current/pro/desktop/en-us/gettingstarted_overview.htm), чтобы узнать больше о том, как использовать рабочие листы и панели Tableau.

### Публикация из Tableau Desktop в Tableau Server {#publish-from-tableau-desktop-to-tableau-server}

- **Из Desktop в Server** &mdash; Как и в любом рабочем процессе Tableau, вы можете опубликовать свою рабочую книгу из Tableau Desktop в Tableau Server. Для пошаговых инструкций посетите [руководство по публикации](https://help.tableau.com/current/pro/desktop/en-us/publish_workbooks_share.htm) от Tableau.

## Важные замечания {#things-to-note}

**Агрегация**<br />
- Все метрики в интерфейсе Tableau отображаются как использующие тип агрегации «SUM», и это нельзя изменить средствами интерфейса Tableau.
- Тип агрегации на уровне кода контролируется в <Constant name="semantic_layer" /> и намеренно зафиксирован. При этом важно помнить, что фактическая агрегация в <Constant name="semantic_layer" /> может быть не «SUM» (так как «SUM» — это значение по умолчанию в Tableau).

**Источники данных и отображение**<br />
- В источнике данных «ALL» Tableau отображает все метрики и измерения из <Constant name="semantic_layer" /> в левой панели. Обратите внимание, что не все метрики и измерения можно комбинировать между собой. Если конкретное измерение нельзя использовать для разреза метрики (или наоборот), вы получите сообщение об ошибке. Для объединения меньших наборов данных можно использовать сохранённые запросы.
- Чтобы отобразить доступные метрики и измерения, <Constant name="semantic_layer" /> возвращает метаданные для фиктивной таблицы, в которой измерения и метрики представлены как «столбцы». По этой причине вы не можете выполнять запросы к этой таблице для предпросмотра или создания extract’ов.

**Вычисления и запросы**<br />
- Некоторые табличные вычисления Tableau, такие как «Totals» и «Percent Of», могут быть неточными при использовании метрик с неаддитивной агрегацией (например, count distinct).
- В любом из интерфейсов <Constant name="semantic_layer" /> (не только в Tableau) при работе с любой кумулятивной метрикой, имеющей временное окно или гранулярность, необходимо включать [time dimension](/docs/build/cumulative#limitations).
- Мы поддерживаем вычисляемые поля для создания фильтров на основе параметров или для динамического выбора метрик и измерений. Однако другие сценарии использования вычисляемых полей не поддерживаются.
  - _Примечание: если у вас есть сценарии использования вычисляемых полей, которые в настоящее время не поддерживаются, пожалуйста, свяжитесь с <a href="mailto:support@getdbt.com?subject=dbt Semantic Layer feedback">службой поддержки dbt</a> и опишите их, чтобы мы могли лучше понять ваши потребности._
- При использовании сохранённых запросов, содержащих фильтры, мы автоматически применяем все фильтры, заданные в этом запросе.

## Неподдерживаемая функциональность {#unsupported-functionality}

Следующие возможности Tableau в настоящее время не поддерживаются. Однако <Constant name="semantic_layer" /> может поддержать часть этой функциональности в будущих версиях:

- Обновление страницы источника данных  
- Использование режима **"Extract"** для просмотра данных  
- Объединение таблиц (Unioning Tables)  
- Написание пользовательского SQL / Initial SQL  
- Расширения таблиц (Table Extensions)  
- Кросс-базовые соединения (Cross-Database Joins)  
- Некоторые функции в меню **Analysis --> Create Calculated Field**  
- Фильтрация по части даты (Date Part) для метрик кумулятивного типа  
- Изменение измерения даты на использование **"Week Number"**  
- Выполнение соединений между таблицами, которые создаёт <Constant name="semantic_layer" />. Он сам управляет соединениями, поэтому нет необходимости соединять компоненты внутри <Constant name="semantic_layer" />. Обратите внимание: вы _можете_ соединять таблицы из <Constant name="semantic_layer" /> с таблицами вне вашей платформы данных.  
- Интеграция с Tableau в настоящее время не отображает описательные метки, определённые в конфигурации `metrics`. Это означает, что пользовательские метки не будут видны при импорте или запросе этих метрик в Tableau.  

## FAQs {#faqs}
<FAQ path="Troubleshooting/sl-alpn-error" />
