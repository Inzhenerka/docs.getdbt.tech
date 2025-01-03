---
title: "Как обновить версии dbt (почти) без страха"
description: "Обновление вашего проекта dbt может быть пугающим – вы полагаетесь на dbt для обеспечения вашего аналитического рабочего процесса и не можете позволить себе изменения, которые могут привести к тому, что ваш ежедневный запуск перестанет работать. Я был в такой ситуации. Это список, который я хотел бы иметь, когда владел проектом dbt в своей последней компании."
slug: upgrade-dbt-without-fear

authors: [joel_labes]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2021-11-29
is_featured: true
---

:::tip Обновление на февраль 2024 года

Прошло несколько лет с тех пор, как dbt-core достиг версии 1.0! С тех пор мы обязались выпускать нулевые изменения, нарушающие совместимость, когда это возможно, и обновление версий dbt Core стало намного проще.

В 2024 году мы идем дальше, обещая:

- Стабилизировать интерфейсы для всех — поддерживающих адаптеры, потребителей метаданных и (конечно) людей, пишущих код dbt повсюду — как обсуждалось в [нашем обновлении дорожной карты за ноябрь 2023 года](https://github.com/dbt-labs/dbt-core/blob/main/docs/roadmap/2023-11-dbt-tng.md).
- Внедрить [Треки выпусков](/docs/dbt-versions/cloud-release-tracks) (ранее известные как Versionless) в dbt Cloud. Больше никаких ручных обновлений и необходимости в _втором песочном проекте_ только для того, чтобы попробовать новые функции в разработке. Для получения более подробной информации обратитесь к [Обновление версии Core в Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

Мы оставляем остальную часть этого поста как есть, чтобы мы все могли вспомнить, как это было раньше. Наслаждайтесь прогулкой по переулку памяти.

:::

По мере приближения к выпуску dbt v1.0 в декабре, это идеальное время, чтобы привести вашу установку в порядок. dbt 1.0 представляет собой кульминацию более чем пяти лет разработки и совершенствования опыта аналитической инженерии — сглаживание острых углов, ускорение рабочих процессов и создание совершенно новых классов работы.

Даже с учетом всех новых возможностей, обновление может быть пугающим — вы полагаетесь на dbt для обеспечения вашего аналитического рабочего процесса и не можете позволить себе изменения, которые могут привести к тому, что ваш ежедневный запуск перестанет работать. Я был в такой ситуации. Это список, который я хотел бы иметь, когда владел проектом dbt в своей последней компании.

<!--truncate-->

Это руководство охватывает шаги для безопасного обновления, используя гипотетический проект в качестве примера. Проект использует dbt v0.16.0 и является относительно зрелым. Он содержит пару сотен моделей и использует широкий спектр функциональности dbt — пользовательские тесты, макросы из dbt-utils и снимки для фиксации изменений в критически важных бизнес-данных.

Мы пройдем через шаги обновления с 0.16.0 до 0.17.2, но те же принципы применимы независимо от того, какую миграцию вы выполняете. Шаги процесса сводятся к:

1. Решите, до какой версии вы обновляетесь

2. Добавьте `require-dbt-version` в ваш файл `dbt_project.yml`

3. Обновите dbt

4. Попробуйте запустить `dbt compile`

5. Обработайте любые устаревшие функции

    1. Обновите ваши пакеты

    2. Исправьте ошибки, затем предупреждения

    3. Повторяйте, пока все ошибки и предупреждения не будут устранены

6. Тестируйте и проверяйте

7. Объедините и сообщите

>ℹ️ Если вы не уверены в разнице между основными, минорными и патч-версиями, будет полезно [прочитать блог-пост Джереми](https://blog.getdbt.com/getting-ready-for-v1-0/), который включает введение в семантическое версионирование.

## Шаг 1: Решите, до какой версии вы обновляетесь

Ключевые принципы:

* Переходите только на одну или две минорные версии за раз.

* Обновляйтесь до самой последней патч-версии данной минорной версии.

* Прочитайте руководство по миграции заранее.

Как отмечено выше, проект сейчас на версии 0.16.0. 0.17.2 — это финальный патч-релиз следующей минорной версии, поэтому мы будем обновляться до него.

>❓ Почему не более ранний патч? 0.17.0 ввел изменение, нарушающее совместимость, которое было отменено в более позднем выпуске; давайте сразу перейдем к самой стабильной версии 0.17 вместо того, чтобы проходить через каждый выпуск исправлений ошибок.
>
> Если это логика для патч-версий, почему бы не перейти сразу на dbt 0.21 или 1.0? Вкратце: **снижение риска**. Работа с устаревшими функциями и изменениями поведения по одному за раз облегчает определение причины проблемы.
>
> Практически это также позволяет вам зафиксировать "контрольные точки" известных стабильных настроек. Если вам нужно приостановить работу по миграции, чтобы справиться с срочным запросом, вы можете безопасно развернуть то, что вы уже сделали, вместо того, чтобы иметь кучу несвязанных незавершенных изменений.

Просмотрите руководства по миграции, чтобы получить первоначальное представление о том, какие изменения вам, возможно, придется внести. Например, в [руководстве по миграции для 0.17.0](/docs/dbt-versions/core-upgrade) есть несколько значительных изменений в функциональности dbt, но маловероятно, что все они будут применимы к вашему проекту. Мы рассмотрим это подробнее позже.

## Шаг 2: Добавьте `require-dbt-version` в ваш файл `dbt_project.yml`.

Ключевые принципы:

* Предотвратите случайное использование старой версии вашими коллегами.

Ваш файл `dbt_project.yml` позволяет предотвратить запуск вашего проекта dbt с неподдерживаемой версией dbt Core. Если в вашем проекте уже есть эта конфигурация, обновите ее. Если нет, добавьте ее следующим образом:

```yml
#/dbt_project.yml

name: 'your_company_project'

version: '0.1.0'

require-dbt-version: ">=0.17.2"

...
```

Вы можете добавить верхнюю границу поддерживаемых версий следующим образом: `[">=0.20.0", "<=1.0.0"]`, но для внутреннего аналитического проекта это, вероятно, излишне. Забавный факт: эта верхняя граница — это способ, которым поставщики пакетов предотвращают случайное использование старой версии пакета, такого как dbt-utils — об этом подробнее чуть позже!

## Шаг 3: Обновите dbt

Если вы используете dbt Cloud, вы можете обновиться [как описано здесь](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-choosing-a-dbt-version). Мы рекомендуем [создать второй "песочный" проект](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions#testing-your-changes-before-upgrading), чтобы ваши эксперименты не повлияли на остальную команду. Для dbt Core инструкции по обновлению будут варьироваться в зависимости от вашего [исходного метода установки](https://docs.getdbt.com/dbt-cli/installation).

## Шаг 4: Попробуйте запустить `dbt compile`

Ключевые принципы:

* Убедитесь, что ваша версия увеличилась, как вы ожидали.

* Быстро определите изменения, нарушающие обратную совместимость, которые необходимо устранить.

`dbt compile` — это самый быстрый способ проверить, что обновление прошло успешно. Если вы все еще на 0.16.0, ваше ограничение `require-dbt-version` отклонит команду.

Компиляция вашего проекта также проверит, что ваш проект действителен, взаимодействуя с базой данных как можно меньше, так что вам не придется ждать результатов запросов.

## Шаг 5: Обработайте любые устаревшие функции

Ключевые принципы:

* Сначала обновите пакеты — нет смысла беспокоиться о коде, который кто-то уже исправил.

* Исправьте ошибки, затем предупреждения.

* Оставайтесь сосредоточенными: не пытайтесь рефакторить логику "пока вы здесь".

* Повторяйте, пока не останется ошибок.

### Шаг 5a. Обновите ваши пакеты

Самые простые миграции — это те, которые кто-то сделал за вас. Установив обновленный пакет, вы сразу избавитесь от множества ошибок.

>ℹ️ Как упоминалось выше, большинство пакетов имеют верхнюю границу совместимости с версиями dbt, а также нижнюю. Рассмотрение будущих версий dbt Core как несовместимых с пакетом до тех пор, пока не будет доказано обратное, является защитным подходом, распространенным до выпуска dbt Core v1.0. Как только API стабилизируется в v1.0, верхние границы смогут ослабнуть, что облегчит обновления.

В данном случае наш примерный проект, вероятно, имеет установленную версию dbt 0.3.0. Просмотрев [матрицу совместимости dbt-utils x dbt-core](https://docs.google.com/spreadsheets/d/1RoDdC69auAtrwiqmkRsgcFdZ3MdNpeKcJrWkmEpXVIs/edit#gid=0), мы видим, что как 0.4.1, так и 0.5.1 совместимы с dbt Core v.0.17.2. Те же принципы применимы к пакетам, как и к версиям dbt Core — установите последний патч-релиз и не прыгайте слишком далеко вперед за один раз. Поскольку в 0.4.x нет изменений, нарушающих совместимость, мы можем безопасно перейти на 0.5.1.

>⚠️ Не забудьте запустить [`dbt clean`](https://docs.getdbt.com/reference/commands/clean) и [`dbt deps`](https://docs.getdbt.com/reference/commands/deps) после обновления вашего файла `packages.yml`!

### Шаг 5b. Исправьте ошибки, затем предупреждения

Очевидно, что ошибки, которые мешают вам вообще запустить ваш проект dbt, являются самыми важными для устранения. Предположим, что наш проект использовал слишком широко определенную переменную в файле макроса, поддержка которой была удалена в v0.17. [Руководство по миграции объясняет, что делать вместо этого](/docs/dbt-versions/core-upgrade), и это довольно простое исправление.

После того, как вы устраните ошибки, обратите внимание на предупреждения. Например, 0.17 ввел `config-version: 2` в `dbt_project.yml`. Хотя это пока обратно совместимо, мы знаем, что поддержка старой версии будет удалена в будущей версии dbt, так что мы можем заняться этим сейчас. Опять же, руководство по миграции объясняет [что нам нужно сделать](/docs/dbt-versions/core-upgrade) и как в будущем полностью воспользоваться новой функциональностью.

### Оставайтесь сосредоточенными

Может возникнуть соблазн обновить все ваши файлы `whatever.yml`, чтобы использовать новый синтаксис, или полностью переписать старый макрос, который зависел от широко определенной переменной "пока вы здесь". Подавите это желание! Основная цель — обновить все более или менее на месте. Когда вы наткнетесь на вещи, которые можно сделать более элегантно, сделайте заметку, чтобы вернуться к ним в конце вашего пути миграции.

Вы хотите сделать ваш код-ревью как можно проще, когда придет время объединить вашу работу обратно в основную ветку. Совмещение рефакторинга с обновлениями совместимости — это верный способ запутать вашего рецензента. Для более подробного обсуждения этой темы ознакомьтесь с отчетом команды Netlify о [переходе с одного хранилища на другое](https://www.netlify.com/blog/2021/08/10/how-the-netlify-data-team-migrated-from-databricks-to-snowflake/), который касается тех же принципов.

### Шаг 5c. Повторяйте

Эта часть процесса является итеративной петлей. По мере исправления каждой ошибки снова запускайте dbt compile, чтобы выявить любые новые проблемы. Например, до тех пор, пока вы не обновите dbt-utils с 0.3.0 до 0.5.1, ваш проект даже не начнет компилироваться из-за несоответствия `require-dbt-version`. Как только это будет исправлено, могут появиться новые проблемы.

## Шаг 6. Тестируйте и проверяйте

Ключевые принципы:

* Выполните полный `dbt run` и `dbt test`.

* Обновите версию dbt в вашей CI задаче.

* Проверьте вашу конфигурацию Slim CI.

* Откройте PR.

После того, как ваши проблемы с компиляцией будут решены, пришло время запустить вашу задачу по-настоящему, чтобы убедиться, что все работает от начала до конца. Маловероятно, что изменение версии dbt вызовет какие-либо ошибки выполнения с вашим SQL, так что вы должны чувствовать уверенность, что конец близок.

После этого убедитесь, что ваша среда CI в dbt Cloud или ваш оркестратор находятся на правильной версии dbt, затем откройте PR.

Если вы используете [Slim CI](https://docs.getdbt.com/docs/best-practices#run-only-modified-models-to-test-changes-slim-ci), имейте в виду, что артефакты не обязательно совместимы от одной версии к другой, так что вы не сможете использовать его, пока задача, на которую вы ссылаетесь, не завершит выполнение с обновленной версией dbt. Это не влияет на наш пример, так как поддержка Slim CI не вышла до 0.18.0.

## Шаг 7. Объедините и сообщите

Ключевые принципы:

* 🎉 Вы сделали это!

* Убедитесь, что все знают, что вы сделали это, иначе они столкнутся с ошибкой в следующий раз, когда запустят.

* Обновите версию dbt в вашей производственной среде.

* Переходите к следующему обновлению, пока вы находитесь в ударе.

Объедините вашу ветку обновления в основную ветку, а затем убедитесь, что ваши коллеги, в свою очередь, подтягивают основную ветку в свои ветки разработки и обновляют свои локальные среды.

>⚠️ Не забудьте также обновить вашу производственную среду!

>💡 Если вы переходите через несколько версий, возможно, вам захочется подождать и позволить вашим коллегам обновить свои среды разработки за один раз.

Спасибо [Клэр](https://twitter.com/clairebcarroll) и [Винни](https://twitter.com/gwenwindflower) за их помощь в разработке этого поста 💕