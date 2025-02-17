---
title: "Лучшие практики материализаций"
id: materializations-guide-1-guide-overview
slug: 1-guide-overview
description: Прочтите это руководство, чтобы понять, как использование материализаций в dbt является важным навыком для эффективной аналитической инженерии.
displayText: Лучшие практики материализаций
hoverSnippet: Прочтите это руководство, чтобы понять, как использование материализаций в dbt является важным навыком для эффективной аналитической инженерии.
---

Что _действительно_ происходит, когда вы вводите `dbt build`? Вопреки распространенному мнению, команда микроскопических эльфов данных _не_ строит ваши данные строка за строкой, хотя правда кажется не менее волшебной. Это руководство исследует реальный ответ на этот вопрос, с вводным взглядом на объекты, которые создаются в вашем хранилище, почему они важны и как dbt знает, что строить.

Конфигурации, которые указывают dbt, как строить эти объекты, называются _материализациями_, и знание того, как их использовать, является важным навыком для эффективной аналитической инженерии. Когда вы завершите это руководство, вы сможете использовать три основные материализации, которые охватывают большинство распространенных ситуаций аналитической инженерии.

:::info
😌 **Материализации абстрагируют DDL и DML**. Обычно в сыром SQL- или python-основанном [преобразовании данных](https://www.getdbt.com/analytics-engineering/transformation/) вам нужно писать конкретные императивные инструкции о том, как строить или изменять ваши объекты данных. Материализации dbt делают это декларативным: мы указываем dbt, как мы хотим, чтобы вещи были построены, и он сам определяет, как это сделать, учитывая уникальные условия и качества нашего хранилища.
:::

### Цели обучения

К концу этого руководства вы должны иметь четкое понимание:

- 🛠️ что такое **материализации**
- 👨‍👨‍👧 как три основные материализации, поставляемые с dbt — **table**, **view** и **incremental** — различаются
- 🗺️ **когда** и **где** использовать конкретные материализации для оптимизации ваших разработок и производственных сборок
- ⚙️ как **настраивать материализации** на различных уровнях, от отдельной модели до целой папки

### Предварительные требования

- 📒 Вам нужно будет пройти [руководство по быстрому старту](/guides) и иметь проект, чтобы проработать эти концепции.
- 🏃🏻‍♀️ Концепции, такие как запуски dbt, операторы `ref()` и модели, должны быть вам знакомы.
- 🔧 [**Опционально**] Чтение [Как мы структурируем наши проекты dbt](/best-practices/how-we-structure/1-guide-overview) будет полезно для последнего раздела этого руководства, когда мы рассмотрим лучшие практики для материализаций, используя подход dbt к этапам моделей и витрин.

### Основной принцип

Мы будем подробно исследовать это на протяжении всего руководства, но основное правило — **начинайте с самого простого**. Мы будем следовать многоуровневому подходу, переходя на следующий уровень только тогда, когда это необходимо.

- 🔍 **Начните с представления (view).** Когда представление становится слишком длинным для _запроса_ конечными пользователями,
- ⚒️ **Сделайте его таблицей (table).** Когда таблица становится слишком длинной для _построения_ в ваших dbt Jobs,
- 📚 **Стройте его инкрементально (incremental).** То есть добавляйте данные по частям по мере их поступления.