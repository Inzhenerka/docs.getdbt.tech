---
title: "Лучшие практики для рабочих процессов"
id: "best-practice-workflows"
---

Эта страница содержит коллективную мудрость опытных пользователей dbt о том, как лучше всего использовать его в вашей аналитической работе. Соблюдение этих лучших практик поможет вашей аналитической команде работать максимально эффективно, а внедрение профессиональных советов добавит блеска вашим проектам dbt!

## Лучшие практики рабочих процессов

### Контроль версий вашего проекта dbt
Все проекты dbt должны управляться с помощью системы контроля версий. Ветки Git должны создаваться для управления разработкой новых функций и исправления ошибок. Все изменения в коде должны быть проверены коллегой (или вами) в Pull Request перед слиянием в вашу производственную ветку, такую как `main`.

:::info Руководство по Git

Мы зафиксировали наши лучшие практики в Git в нашем [руководстве по Git](https://github.com/dbt-labs/corp/blob/main/git-guide.md).

:::

### Используйте отдельные среды для разработки и производства
dbt упрощает поддержание отдельных производственных и разработческих сред с помощью целей в профиле. Мы рекомендуем использовать цель `dev` при запуске dbt из командной строки и запускать только против цели `prod` при запуске из производственного развертывания. Вы можете прочитать больше [о управлении средами здесь](/docs/environments-in-dbt).

### Используйте стиль-код для вашего проекта
Стиль SQL, соглашения по именованию полей и другие правила для вашего проекта dbt должны быть зафиксированы, особенно в проектах, где несколько пользователей dbt пишут код.

:::info Наш стиль-код

Мы сделали наш [стиль-код](/best-practices/how-we-style/0-how-we-style-our-dbt-projects) публичным – он может служить хорошей отправной точкой для вашего собственного стиль-кода.

:::

## Лучшие практики в проектах dbt
### Используйте функцию ref
Функция [ref](/reference/dbt-jinja-functions/ref) делает dbt таким мощным! Использование функции `ref` позволяет dbt определять зависимости, гарантируя, что модели строятся в правильном порядке. Это также гарантирует, что ваша текущая модель выбирает данные из вышестоящих таблиц и <Term id="view">представлений</Term> в той же среде, в которой вы работаете. Всегда используйте функцию `ref` при выборе из другой модели, а не прямую ссылку на отношение (например, `my_schema.my_table`).

### Ограничьте ссылки на сырые данные
Ваш проект dbt будет зависеть от сырых данных, хранящихся в вашей базе данных. Поскольку эти данные обычно загружаются третьими сторонами, их структура может изменяться со временем – таблицы и столбцы могут быть добавлены, удалены или переименованы. Когда это происходит, обновление моделей становится проще, если сырые данные ссылаются только в одном месте.

:::info Использование источников для ссылок на сырые данные

Мы рекомендуем определять ваши сырые данные как [источники](/docs/build/sources) и выбирать из источника, а не использовать прямую ссылку на отношение. Наши проекты dbt не содержат прямых ссылок на отношения в каких-либо моделях.

:::

### Переименовывайте и изменяйте типы полей один раз
Сырые данные обычно хранятся в структуре, согласованной с источником, то есть следуя схеме и соглашениям по именованию, которые определяет источник. Эта структура не только будет отличаться между различными источниками, но и, вероятно, будет отличаться от соглашений по именованию, которые вы хотите использовать для аналитики.

Первый слой преобразований в проекте dbt должен:
* Выбирать только из одного источника
* Переименовывать поля и таблицы в соответствии с соглашениями, которые вы хотите использовать в вашем проекте, например, гарантируя, что все временные метки названы `<event>_at`. Эти соглашения должны быть объявлены в ваших соглашениях по кодированию проекта (см. выше).
* Изменять типы полей на правильные, например, преобразовывать даты в UTC и цены в долларовые суммы.

Все последующие модели данных должны строиться на основе этих моделей, уменьшая количество дублированного кода.

:::info Что случилось с базовыми моделями?

Ранние версии этой документации рекомендовали внедрять "базовые модели" как первый слой преобразования и давали советы по SQL в этих моделях. Мы поняли, что хотя причины этой конвенции были обоснованными, конкретные советы по "базовым моделям" представляли собой мнение, поэтому мы убрали их из официальной документации.

Вместо этого вы можете найти наши мнения о [том, как мы структурируем наши проекты dbt](/best-practices/how-we-structure/1-guide-overview).

:::

### Разбивайте сложные модели на более мелкие части
Сложные модели часто включают несколько Общих Табличных Выражений (<Term id="cte">CTE</Term>). В dbt вы можете вместо этого разделить эти CTE на отдельные модели, которые строятся друг на друге. Часто хорошей идеей является разбивка сложных моделей, когда:
* CTE дублируется в двух моделях. Разбивка CTE на отдельную модель позволяет ссылаться на модель из любого количества нижестоящих моделей, уменьшая дублирование кода.
* CTE изменяет <Term id="grain" /> данных, из которых он выбирает. Часто полезно тестировать любые преобразования, которые изменяют зерно (то есть, что представляет одна запись) ваших данных. Разбивка CTE на отдельную модель позволяет тестировать это преобразование независимо от более крупной модели.
* SQL в запросе содержит много строк. Разбивка CTE на отдельные модели может уменьшить когнитивную нагрузку, когда другой пользователь dbt (или вы сами в будущем) смотрит на код.

### Группируйте ваши модели в директории
Внутри вашего каталога `models/` вы можете иметь любое количество вложенных подкаталогов. Мы активно используем директории, так как использование вложенной структуры в директориях упрощает:
* Настройку групп моделей, указывая конфигурации в вашем файле `dbt_project.yml`.
* Запуск подмножества вашего DAG, используя [синтаксис выбора моделей](/reference/node-selection/syntax).
* Общение о шагах моделирования с сотрудниками
* Создание соглашений о допустимых вышестоящих зависимостях модели, например, "модели в каталоге `marts` могут выбирать только из других моделей в каталоге `marts` или из моделей в каталоге `staging`".

### Добавляйте тесты к вашим моделям
dbt предоставляет фреймворк для тестирования предположений о результатах, генерируемых моделью. Добавление тестов в проект помогает обеспечить, что:
* ваш SQL преобразует данные так, как вы ожидаете, и
* ваши исходные данные содержат ожидаемые значения

:::info Рекомендуемые тесты

Наш [стиль-код](https://github.com/dbt-labs/corp/blob/main/dbt_style_guide.md) рекомендует, чтобы как минимум каждая модель имела <Term id="primary-key" />, который тестируется на уникальность и отсутствие null.

:::

### Учитывайте информационную архитектуру вашего хранилища данных
Когда пользователь подключается к <Term id="data-warehouse" /> через SQL-клиент, он часто полагается на имена схем, отношений и столбцов, чтобы понять данные, которые ему представлены. Чтобы улучшить информационную архитектуру хранилища данных, мы:

* Используем [пользовательские схемы](/docs/build/custom-schemas) для разделения отношений на логические группы или скрытия промежуточных моделей в отдельной схеме. Обычно эти пользовательские схемы соответствуют каталогам, которые мы используем для группировки наших моделей, и настраиваются из файла `dbt_project.yml`.
* Используем префиксы в <Term id="table" /> именах (например, `stg_`, `fct_` и `dim_`), чтобы указать, какие отношения должны запрашиваться конечными пользователями.

### Выбирайте материализации с умом
[<Term id="materialization" />](/docs/build/materializations) определяют способ построения моделей через конфигурацию. Как общее правило:
* Представления быстрее строятся, но медленнее запрашиваются по сравнению с таблицами.
* Инкрементные модели обеспечивают такую же производительность запросов, как и таблицы, строятся быстрее по сравнению с материализацией таблицы, однако они добавляют сложность в проект.

Мы часто:
* Используем представления по умолчанию
* Используем эфемерные модели для легких преобразований, которые не должны быть доступны конечным пользователям
* Используем таблицы для моделей, которые запрашиваются BI-инструментами
* Используем таблицы для моделей, у которых есть несколько потомков
* Используем инкрементные модели, когда время построения моделей таблиц превышает допустимый порог

## Профессиональные советы для рабочих процессов
### Используйте синтаксис выбора моделей при локальном запуске
При разработке часто имеет смысл запускать только ту модель, над которой вы активно работаете, и любые нижестоящие модели. Вы можете выбрать, какие модели запускать, используя [синтаксис выбора моделей](/reference/node-selection/syntax).

### Запускайте только измененные модели для тестирования изменений ("slim CI")
Чтобы с уверенностью объединять изменения в коде, вы хотите быть уверены, что эти изменения не вызовут сбоев в других частях вашего проекта. По этой причине мы рекомендуем запускать модели и тесты в изолированной среде, отделенной от ваших производственных данных, как автоматическую проверку в вашем рабочем процессе git. (Если вы используете GitHub и dbt Cloud, прочитайте о [настройке CI-заданий](/docs/deploy/ci-jobs).

В то же время, запуск и тестирование всех моделей в вашем проекте требует времени (и денег). Эта неэффективность особенно ощутима, если ваш PR предлагает изменения только в нескольких моделях.

Сравнивая с артефактами из предыдущего производственного запуска, dbt может определить, какие модели изменены, и построить их поверх их неизмененных родителей.

```bash
dbt run -s state:modified+ --defer --state path/to/prod/artifacts
dbt test -s state:modified+ --defer --state path/to/prod/artifacts
```

Сравнивая с артефактами из предыдущего производственного запуска, dbt может определить статусы моделей и результатов тестов.

- `result:fail`
- `result:error`
- `result:warn`
- `result:success`
- `result:skipped`
- `result:pass`

Для более умных повторных запусков используйте селектор `result:<status>` вместо ручного переопределения команд dbt с моделями в области видимости.
```bash
dbt run --select state:modified+ result:error+ --defer --state path/to/prod/artifacts
```
  - Повторно запустите все мои ошибочные модели И запустите изменения, которые я сделал одновременно, которые могут относиться к ошибочным моделям для использования в нижестоящих моделях

```bash
dbt build --select state:modified+ result:error+ --defer --state path/to/prod/artifacts
```
  - Повторно запустите и протестируйте все мои ошибочные модели И запустите изменения, которые я сделал одновременно, которые могут относиться к ошибочным моделям для использования в нижестоящих моделях

```bash
dbt build --select state:modified+ result:error+ result:fail+ --defer --state path/to/prod/artifacts
```
  - Повторно запустите все мои ошибочные модели И все мои неудачные тесты
  - Повторно запустите все мои ошибочные модели И запустите изменения, которые я сделал одновременно, которые могут относиться к ошибочным моделям для использования в нижестоящих моделях
  - Есть неудачный тест, который не связан с измененными или ошибочными узлами (подумайте: тест источника, который нужно обновить, чтобы загрузка данных прошла успешно)

```bash
dbt test --select result:fail --exclude <example test> --defer --state path/to/prod/artifacts
```
  - Повторно запустите все мои неудачные тесты и исключите тесты, которые я знаю, что все еще будут неудачными
  - Это может применяться к обновлениям в исходных данных во время процесса "EL", которые нужно повторно запустить после их обновления

> Примечание: Если вы используете флаг `--state target/`, флаги `result:error` и `result:fail` могут быть выбраны одновременно (в одной команде) только при использовании команды `dbt build`. `dbt test` перезапишет `run_results.json` из `dbt run` в предыдущем вызове команды.

Поддерживается только версиями v1.1 или новее.

Сравнивая артефакт `sources.json` из предыдущего производственного запуска с текущим артефактом `sources.json`, dbt может определить, какие источники более свежие, и запускать нижестоящие модели на их основе.

```bash
# job 1
dbt source freshness # должен быть запущен для получения предыдущего состояния
```

Тестируйте все мои источники, которые более свежие, чем предыдущий запуск, и запускайте и тестируйте все модели, зависящие от них:

```bash
# job 2
dbt source freshness # должен быть запущен снова для сравнения текущего состояния с предыдущим
dbt build --select source_status:fresher+ --state path/to/prod/artifacts
```

Чтобы узнать больше, прочитайте документацию о [состоянии](/reference/node-selection/syntax#about-node-selection).

## Профессиональные советы для проектов dbt
### Ограничьте обрабатываемые данные при разработке
В среде разработки более быстрое время выполнения позволяет быстрее итеративно изменять ваш код. Мы часто ускоряем наши запуски, используя шаблон, который ограничивает данные на основе имени [target](/reference/dbt-jinja-functions/target):
```sql
select
*
from event_tracking.events
{% if target.name == 'dev' %}
where created_at >= dateadd('day', -3, current_date)
{% endif %}
```

### Используйте хуки для управления привилегиями на объектах, которые создает dbt
Используйте операторы `grant` из [хуков](/docs/build/hooks-operations), чтобы гарантировать, что разрешения применяются к объектам, созданным dbt. Закрепляя эти операторы grant в хуках, вы можете управлять версиями и повторно применять эти разрешения.

:::info Рекомендуемые операторы grant

Мы поделились точными операторами grant, которые используем, на [Discourse](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)

:::

### Разделяйте трансформации, ориентированные на источник, и бизнес-ориентированные трансформации
При моделировании данных мы часто обнаруживаем, что существуют два этапа:

1. Трансформации, ориентированные на источник, для преобразования данных из различных источников в согласованную структуру, например, переименование и изменение типов столбцов, или объединение, соединение или удаление дубликатов исходных данных, чтобы гарантировать, что ваша модель имеет правильное зерно; и
2. Бизнес-ориентированные трансформации, которые преобразуют данные в модели, представляющие сущности и процессы, актуальные для вашего бизнеса, или реализуют бизнес-определения в SQL.

Мы считаем наиболее полезным разделять эти два типа трансформаций на разные модели, чтобы сделать различие между логикой, ориентированной на источник, и бизнес-ориентированной логикой ясным.

### Управление пробелами, создаваемыми Jinja
Если вы используете макросы или другие элементы Jinja в ваших моделях, ваш скомпилированный SQL (находящийся в каталоге `target/compiled`) может содержать нежелательные пробелы. Ознакомьтесь с [документацией Jinja](http://jinja.pocoo.org/docs/2.10/templates/#whitespace-control), чтобы узнать, как управлять создаваемыми пробелами.