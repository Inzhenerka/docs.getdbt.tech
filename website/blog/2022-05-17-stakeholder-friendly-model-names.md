---
title: "Названия моделей, понятные заинтересованным сторонам: Конвенции именования моделей, которые дают контекст"
description: "Названия ваших моделей обычно создаются инженерами для инженеров. Хотя это отлично для поддерживаемости, ваши конечные пользователи не будут иметь такого же контекста в этих названиях моделей, как вы."
slug: stakeholder-friendly-model-names

authors: [pat_kearns]

tags: [analytics craft]
hide_table_of_contents: false

date: 2022-05-17
is_featured: true
---

Инженеры по аналитике (AEs) постоянно работают с названиями моделей в своем проекте, поэтому именование важно для поддерживаемости вашего проекта в том, как вы к нему обращаетесь и работаете в нем. По умолчанию, dbt будет использовать имя файла вашей модели в качестве имени представления или таблицы в базе данных. Но это означает, что имя имеет жизнь за пределами dbt и поддерживает многих конечных пользователей, которые, возможно, никогда не узнают о dbt и откуда взялись эти данные, но все равно будут обращаться к объектам базы данных в базе данных или инструменте бизнес-аналитики (BI).

Конвенции именования моделей обычно создаются AEs для AEs. Хотя это полезно для поддерживаемости, это исключает людей, для которых именование моделей должно в первую очередь приносить пользу: конечных пользователей. **Хорошие конвенции именования моделей должны создаваться с одной мыслью: предполагайте, что ваш конечный пользователь не будет иметь никакого другого контекста, кроме имени модели.** Папки, схемы и документация могут добавить дополнительный контекст, но они могут не всегда присутствовать. Ваши имена моделей всегда будут отображаться в базе данных.

<!--truncate-->

В этой статье мы более подробно рассмотрим, почему конвенции именования моделей важны с точки зрения заинтересованных сторон, которые фактически используют их результаты. Мы исследуем:

- Кто эти заинтересованные стороны
- Как они получают доступ к вашим проектам и как выглядит пользовательский опыт
- Что они действительно ищут в ваших именах моделей
- Некоторые лучшие практики именования моделей, которые вы можете следовать, чтобы сделать всех счастливыми

## Ваши имена моделей и опыт ваших конечных пользователей

>“[Данные], что мы [создаем в базе данных]... отзываются в вечности.” -Макс(имус, Гладиатор)

Инженеры по аналитике часто находятся в центре компании, между аналитиками данных и инженерами данных. Это означает, что все, что создают AEs, может быть прочитано и должно быть понято как аналитической или клиентской командой, так и командами, которые проводят большую часть своего времени в коде и базе данных. В зависимости от аудитории, объем доступа различается, что означает, что пользовательский опыт и контекст меняются. Давайте подробнее рассмотрим, как может выглядеть этот опыт, разделив конечных пользователей на две категории:

- Аналитики / пользователи BI
- Инженеры по аналитике / инженеры данных

### Пользовательский опыт аналитика

Аналитики взаимодействуют с данными извне. Они участвуют в встречах с заинтересованными сторонами, клиентами, заказчиками и руководством внутри организации. Эти заинтересованные стороны хотят четко сформулированных мыслей, ответов, тенденций, инсайтов от аналитика, которые помогут продвинуть дело вперед, помочь бизнесу расти, повысить производительность, увеличить прибыльность и т.д. С этими целями они должны сформулировать гипотезу и доказать свою точку зрения с помощью данных. Они будут получать доступ к данным через:

- Предварительно вычисленные представления/таблицы в инструменте BI
- Доступ только для чтения к документации dbt Cloud IDE
- Полный список таблиц и представлений в их <Term id="data-warehouse" />

#### Предварительно вычисленные представления/таблицы в инструменте BI

Здесь у нас есть функция перетаскивания и интерфейс поверх `database.schema.table`, где хранится объект базы данных. Инструмент BI был настроен инженером по аналитике или инженером данных для автоматического объединения наборов данных, когда вы кликаете/перетаскиваете поля в ваше исследование.

**Как имена моделей могут усложнить это:**
Конечные пользователи могут даже не знать, к каким таблицам относятся данные, так как потенциально все объединено системой, и им не нужно писать свои собственные запросы. Если имена моделей выбраны плохо, есть большая вероятность, что слой BI поверх таблиц базы данных был переименован во что-то более полезное для аналитиков. Это добавляет дополнительный шаг умственной сложности в отслеживании <Term id="data-lineage">происхождения</Term> от модели данных до BI.

#### Доступ только для чтения к документации dbt Cloud IDE
Если аналитики хотят больше контекста через документацию, они могут вернуться к слою dbt и проверить модели данных либо в контексте проекта, либо базы данных. В представлении проекта они увидят модели данных в иерархии папок, присутствующих в репозитории вашего проекта. В представлении базы данных вы увидите вывод моделей данных, как он представлен в вашей базе данных, т.е. `database / schema / object`.

![Скриншот, изображающий меню Database view в dbt Cloud IDE, которое показывает вам вывод ваших моделей данных. Рядом с этим представлением находится представление Project view.](/img/blog/2022-05-17-stakeholder-friendly-model-names/project-view.png)

**Как имена моделей могут усложнить это:**
Для представления проекта, как правило, абстрагированные структуры отделов или организаций в качестве имен папок предполагают, что читатель/инженер знает, что содержится в папке заранее или чем на самом деле занимается этот отдел, или поощряют хаотичное нажатие для открытия папок, чтобы увидеть, что внутри. Организация конечных результатов по бизнес-единице или аналитической функции отлично подходит для конечных пользователей, но не точно представляет все источники и ссылки, которые должны были быть объединены для создания этого результата, так как они часто находятся в другой папке.

Для представления базы данных, молитесь, чтобы ваша команда объявила логическое распределение схем или логическую конвенцию именования моделей, иначе у вас будет длинный, алфавитный список объектов базы данных для прокрутки, где модели промежуточного, промежуточного и конечного вывода все перемешаны. Переход к модели данных и просмотр документации полезен, но вам нужно будет проверить DAG, чтобы увидеть, где модель находится в общем потоке.

#### Полный выпадающий список в их хранилище данных.

Если у них есть доступ к Worksheets, SQL runner или другому способу написания ad hoc SQL-запросов, то у них будет доступ к моделям данных, как они представлены в вашей базе данных, т.е. `database / schema / object`, но с меньшей документацией и большей склонностью к запросу таблиц для проверки их содержимого, что стоит времени и денег.

![Скриншот меню SQL Runner в Looker, демонстрирующий выпадающий список всех моделей данных, присутствующих в базе данных.](/img/blog/2022-05-17-stakeholder-friendly-model-names/data-warehouse-dropdown.png)

**Как имена моделей могут усложнить это:**
Без надлежащих конвенций именования вы столкнетесь с `analytics.order`, `analytics.orders`, `analytics.orders_new` и не будете знать, какая из них правильная, поэтому вы откроете вкладку с черновым заявлением и попытаетесь выяснить, какая из них правильная:

```sql
-- select * from analytics.order  limit 10
-- select * from analytics.orders  limit 10
select * from analytics.orders_new  limit 10
```
Надеюсь, вы выберете правильный вариант с помощью выборочных запросов или в конечном итоге узнаете, что есть истинный источник истины, определенный в совершенно отдельной области: `core.dim_orders`.

Проблема здесь в том, что единственная информация, которую вы можете использовать для определения того, какие данные содержатся в объекте или какова цель объекта, находится в схеме и имени модели.

### Пользовательский опыт инженера

Инженеры по аналитике и инженеры данных часто являются теми, кто создает аналитический код, используя SQL для преобразования данных таким образом, чтобы вызывать доверие в вашей команде — с тестированием, документацией и прозрачностью. Эти инженеры будут иметь дополнительные права и могут получить доступ и взаимодействовать с проектом (или его частями) из:

- Внутри инструмента BI
- Внутри хранилища данных
- Внутри структуры папок dbt Cloud IDE
- Внутри DAG (направленного ациклического графа)
- Внутри Pull Request (PR)

#### Внутри инструмента BI

Это в основном то же самое, что и опыт аналитика, описанный выше, за исключением того, что они, вероятно, создали или знают о объектах базы данных, представленных в инструменте BI.

**Как имена моделей могут усложнить это:**
Нет ничего хуже, чем потратить всю неделю на разработку задачи, отправку Pull Requests, получение отзывов от членов команды, а затем представление моделей данных в инструменте BI, только чтобы понять, что лучшее именование моделей данных имело бы больше смысла в контексте инструмента BI. Вы сталкиваетесь с выбором: переименовать вашу модель данных в инструменте BI (быстрое исправление) или вернуться в стек, переименовать модели и все зависимости, отправить новый PR, получить отзывы, запустить и протестировать, чтобы убедиться, что ваше быстрое исправление ничего не сломает, затем продолжить представление вашей правильно названной модели в инструменте BI, обеспечивая сохранение того же имени на протяжении всей линии (долгое исправление).

#### Внутри хранилища данных
Это в основном то же самое, что и опыт аналитика, описанный выше, за исключением того, что они создали модели данных или знают их этимологию. Они, вероятно, более комфортно пишут ad hoc запросы, но также имеют возможность вносить изменения, что добавляет уровень мыслительного процесса при работе.

**Как имена моделей могут усложнить это:**
Требуется время, чтобы стать экспертом в базе данных. Вам нужно будет знать, в какой схеме находится предмет, какие таблицы являются источником истины и/или моделями вывода, в отличие от экспериментов, устаревших объектов или строительных блоков, использованных на пути. Работая в этом контексте, инженеры знают историю и корпоративные легенды о том, почему таблица была названа так или как ее цель может немного отличаться от ее имени, но они также имеют возможность вносить изменения.

Управление изменениями сложно; сколько мест вам нужно будет обновить, переименовать, задокументировать и протестировать, чтобы исправить плохой выбор имени из прошлого? Это пугающая позиция, которая может создать внутренние разногласия, когда ограничены во времени, стоит ли постоянно обновлять и рефакторить для поддерживаемости или сосредоточиться на создании новых моделей в том же шаблоне, что и раньше.

#### Внутри структуры папок Cloud IDE
![Скриншот проводника папок в dbt Cloud IDE, который показывает имена моделей данных.](/img/blog/2022-05-17-stakeholder-friendly-model-names/dbt-cloud-ide-folder.png)

Разрабатывая в IDE, у вас есть почти полный набор информации, чтобы рассуждать о том, что содержится в модели данных. У вас есть структура папок, которая определит стадии или любые другие полезные группировки. Вы можете увидеть любые конфигурации, которые могут определить цель вашей модели данных — база данных, схема и т.д. У вас есть документация, как в виде комментариев, так и более формализованная в описаниях в yml. Наконец, у вас есть имя модели, которое должно дать вам дополнительный контекст.

**Как имена моделей могут усложнить это:**
В этом контексте имена моделей не кажутся такими важными, так как они окружены стольким другим контекстуальным материалом. Если вы по ошибке полагаетесь на эту контекстуальную информацию для передачи информации конечному пользователю, она будет потеряна, когда контекст будет удален.

Без надлежащих конвенций именования вы упускаете возможность определить происхождение. Вы можете рассуждать об этом с помощью иерархии папок или просматривая DAG, но это не всегда возможно.

#### Внутри DAG

Напротив, при просмотре DAG на сайте документации или в вкладке происхождения, вы получаете происхождение, которое добавляет больше контекста к зависимостям и направленному потоку. Вы получаете представление о том, как модели используются как строительные блоки слева направо для преобразования ваших данных из грубых или нормализованных исходных источников в очищенные модульные производные части, и, наконец, в конечные результаты на крайнем правом краю DAG, готовые к использованию аналитиком в бесконечных комбинациях для представления их таким образом, чтобы помочь клиентам, заказчикам и организациям принимать лучшие решения.

![Скриншот графа происхождения в dbt Cloud, который демонстрирует все модели данных в проекте и их результаты.](/img/blog/2022-05-17-stakeholder-friendly-model-names/dag-view.png)

**Как имена моделей могут усложнить это:**
Проблема в том, что вы увидите только имена моделей (которые становятся узлами в DAG), но не увидите папки, конфигурации базы данных/схемы, документацию и т.д. Вы можете увидеть логический поток данных через ваш конвейер dbt, но без четко определенного именования моделей/узлов цель модели может быть неправильно понята, что приведет к странным путям DAG в будущем.

#### Внутри Pull Requests

При просмотре кода от кого-то другого, кто вносит вклад, вы увидите только файлы, которые были изменены в репозитории проекта.

![Скриншот имен файлов, которые были перечислены в разделе "Измененные файлы" Pull Request на GitHub](/img/blog/2022-05-17-stakeholder-friendly-model-names/PR-view.png)

**Как имена моделей могут усложнить это:**
Это сильно ограничит количество информации, которую вы видите, потому что она будет локализована в измененных файлах. Вы все равно увидите измененные папки и измененные имена моделей, но не будете иметь полного контекста проекта, где они полезны. Надеюсь, у вас есть надежный шаблон pull request и традиции связывания с задачей и предоставления контекста, почему работа была выполнена таким образом, иначе у человека, просматривающего ваши изменения, не будет много информации для ясных предложений по улучшению.

## Конвенции именования моделей, которые делают всех счастливыми
Хотя каждый из этих примеров обращается к одному и тому же (вашему SQL-коду и объектам базы данных, которые он создает), контекст меняется в зависимости от того, как вы к нему обращаетесь, и ни один из методов не показывает полную картину сам по себе. Единственная постоянная между всеми ними — это имя модели, которое, в свою очередь, становится именем объекта базы данных и именем узла DAG. Вот почему важно сосредоточиться на конвенциях именования моделей, в дополнение к, но с меньшим акцентом на структуру папок и имена схем, потому что последние два не будут сохраняться для всех точек доступа.

Итак, какие высокоуровневые эвристики могут использовать инженеры по аналитике, чтобы обеспечить максимальную информацию о назначении модели, сопровождающую имя модели?

### Встраивайте информацию в имя, используя согласованный шаблон

Практикуйте многословие воспроизводимым образом. Дополнительные символы в имени бесплатны. Потенциальные ошибки, вызванные выбором неправильного объекта базы данных или умственной сложностью по мере расширения вашего DAG/проекта до энтропии, могут стоить дорого.

#### Используйте формат, такой как `<type/dag_stage>_<source/topic>__<additional_context>`.

**`type/dag_stage`**

Где в DAG находится эта модель? Это также коррелирует с тем, является ли эта модель модульным строительным блоком или моделью вывода для анализа. Что-то вроде `stg_` или `int_` вероятно является очисткой или составной частью, используемой в dbt и не имеет отношения к аналитикам. Что-то вроде `fct_`, `dim_` будет моделью вывода, которая будет использоваться в инструменте BI аналитиками. Однако это не должно быть декларацией материализации. Вы должны иметь возможность изменить материализацию вашей модели без необходимости изменять имя модели.

**`source/topic`**

Дает подробный контекст содержимого. `stripe__payments` говорит вам, из какой системы источников он поступает и каково содержимое данных.

**`additional_context`**

Добавление суффикса для необязательных преобразований может добавить ясности. `__daily` или `__pivoted` скажет вам, какое преобразование было выполнено с некоторым другим набором данных. Это должно находиться в конце имени модели, чтобы они оставались вместе в алфавитном списке (например, `fct_paid_orders` и `fct_paid_orders__daily`).

Эти 3 части идут от наименее гранулярного (общего) к наиболее гранулярному (конкретному), чтобы вы могли просканировать список всех моделей и увидеть крупные категории с первого взгляда и сосредоточиться на интересующих моделях без дальнейшего контекста.

### Вперед...

В этой части серии мы говорили о том, почему имя модели является центром понимания назначения и содержимого внутри модели. В предстоящем руководстве ["Как мы структурируем наши проекты dbt"](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview) вы можете изучить, как использовать этот шаблон именования с более конкретными примерами в различных частях вашего DAG dbt, которые охватывают регулярные случаи использования:

- Как бы вы назвали модель, которая фильтруется по некоторым столбцам
- Рекомендуем ли мы называть снимки определенным образом
- Как бы мы назвали модели в случае:
    - Сессии интернет-пользователей
    - Заказы с клиентами, позициями и платежами
    - Модели программного обеспечения как услуги с ежегодной/ежемесячной выручкой от подписки и оттоком и т.д.