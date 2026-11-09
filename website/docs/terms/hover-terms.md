---
acid:
  displayText: ACID
  hoverSnippet: Atomicity, Consistency, Isolation, and Durability

ade-bench:
  displayText: ADE-bench
  hoverSnippet: The Analytics and Data Engineering benchmark, a framework for evaluating AI agents on data tasks with highly realistic testing environments.

agents:
  displayText: agents
  hoverSnippet: AI agents add a layer of abstraction over computing tasks. Instead of prompting for specific snippets of code, you define the goal and the agent takes action on your behalf. An agent can work independently for an extended period of time, and might write new code, use CLI tools or MCP servers, or search the web while completing its tasks.

aggregate:
  displayText: aggregate
  hoverSnippet: Тип UDF, который возвращает одно значение для каждой группы, агрегируя несколько строк.

cte:
  displayText: CTE
  hoverSnippet: Общая табличная выражение (CTE) — это временный набор результатов, который можно использовать в SQL-запросе. Вы можете использовать CTE, чтобы разбить сложные запросы на более простые блоки кода, которые могут соединяться и строиться друг на друге.

dag:
  displayText: DAG
  hoverSnippet: DAG — это направленный ациклический граф, тип графа, узлы которого направленно связаны друг с другом и не образуют направленного замкнутого цикла.

data-extraction:
  displayText: data extraction
  hoverSnippet: Извлечение данных — это процесс, при котором данные извлекаются из множества источников, часто различающихся по объему и структуре.

data-lake:
  displayText: data lake
  hoverSnippet: Озеро данных — это система управления данными, используемая для хранения больших объемов данных в их сыром, исходном виде в виде файлов. Озера данных могут хранить любые типы данных — структурированные, полуструктурированные, неструктурированные — в одном централизованном месте.

data-lineage:
  displayText: data lineage
  hoverSnippet: Происхождение данных предоставляет целостное представление о том, как данные перемещаются по организации, где они трансформируются и потребляются.

data-warehouse:
  displayText: data warehouse
  hoverSnippet: Хранилище данных — это система управления данными, используемая для хранения и вычисления данных, которая позволяет выполнять аналитические действия, такие как преобразование и обмен данными.

data-catalog:
  displayText: data catalog
  hoverSnippet: Каталог данных — это инвентарь данных из различных частей стека данных в организации. Этот каталог может отображать метаданные, происхождение и бизнес-определения из ваших различных источников данных.

data-wrangling:
  displayText: data wrangling
  hoverSnippet: Обработка данных описывает различные процессы, используемые для преобразования сырых данных в согласованный и легко используемый формат. Конечная цель обработки данных — работать таким образом, чтобы вы могли сразу приступить к анализу набора данных или построению на основе этих данных.

dataframe:
  displayText: dataframe
  hoverSnippet: DataFrame — это двумерная структура данных (строки и столбцы). Это наиболее распространённый способ представления больших наборов данных и работы с ними в Python.

ddl:
  displayText: DDL
  hoverSnippet: Язык определения данных (Data Definition Language, DDL) — это группа SQL-инструкций, которые можно выполнять для управления объектами базы данных, включая таблицы, представления и другие объекты.

deploying:
  displayText: Deploying
  hoverSnippet: Развертывание dbt в производственной среде означает настройку системы для выполнения задания dbt по расписанию, а не выполнение команд dbt вручную из командной строки.

dimensional-modeling:
  displayText: dimensional modeling
  hoverSnippet: Моделирование измерений — это техника моделирования данных, при которой вы разбиваете данные на «факты» и «измерения», чтобы организовать и описать сущности в вашем хранилище данных.

dml:
  displayText: DML
  hoverSnippet: Язык манипулирования данными (Data Manipulation Language, DML) — это класс SQL-инструкций, которые используются для запроса, изменения, добавления и удаления данных на уровне строк в таблицах или представлениях базы данных. Основные инструкции DML — SELECT, INSERT, DELETE и UPDATE.

dry:
  displayText: DRY
  hoverSnippet: DRY — это принцип разработки программного обеспечения, который расшифровывается как «Don’t Repeat Yourself» («Не повторяйся»). Следовать этому принципу — значит стремиться сокращать повторяющиеся шаблоны и дублирование кода и логики в пользу модульного кода, на который можно ссылаться.

edw:
  displayText: EDW
  hoverSnippet: Корпоративное хранилище данных (Enterprise Data Warehouse, EDW), как и любое другое хранилище данных, представляет собой совокупность баз данных, в которых централизованно хранится информация компании из различных источников и приложений.

elt:
  displayText: ELT
  hoverSnippet: Извлечение, загрузка и преобразование (Extract, Load, Transform, ELT) — это процесс, при котором данные сначала извлекаются из различных источников, затем загружаются в целевое хранилище данных и в завершение преобразуются.

etl:
  displayText: ETL
  hoverSnippet: Извлечение, трансформация, загрузка (ETL) — это процесс, при котором сначала извлекаются данные из источника данных, затем трансформируются, а затем загружаются в целевое хранилище данных.

git-worktree:
  displayText: worktree
  hoverSnippet: A worktree is a second copy of your repo in its own folder, on its own branch. Same repo and same history, just a separate place to work, so changes in one worktree don't touch the files in another.
  hoverLink: https://git-scm.com/docs/git-worktree
  hoverLinkText: Refer to the git worktree docs.

grain:
  displayText: гранулярность
  hoverSnippet: Гранулярность данных определяется сочетанием столбцов, в пределах которого записи в таблице уникальны. В идеале это сочетание представлено одним столбцом с уникальным первичным ключом.

idempotent:
  displayText: идемпотентность
  hoverSnippet: Идемпотентная операция даёт один и тот же результат независимо от количества её выполнений. В dbt это означает, что запуски ваших моделей всегда будут давать согласованные результаты.

json:
  displayText: JSON
  hoverSnippet: JSON (JavaScript Object Notation) — это минимальный формат для полуструктурированных данных, используемый для фиксации отношений между полями и значениями.

lsp:
  displayText: LSP
  hoverSnippet: Протокол Language Server Protocol (LSP) обеспечивает возможности для разработчиков, такие как живые предпросмотры CTE, информация при наведении, подсветка ошибок и многое другое.

managed:
  displayText: управляемое подключение
  hoverSnippet: dbt Labs управляет подключением к провайдеру ИИ. Использование оплачивается через dbt, поэтому ключ провайдера не требуется.

inference:
  displayText: инференс
  hoverSnippet: Выполнение обученной модели ИИ для получения ответа. Каждый ход агента включает один или несколько вызовов инференса. Плата взимается за каждый вызов инференса.

materialization:
  displayText: материализация
  hoverSnippet: Конкретные инструкции языка определения данных (DDL), которые dbt будет использовать для создания объекта, соответствующего модели, в хранилище данных.

model:
  hoverSnippet: Модель — это основной строительный блок DAG
  displayText: модель

monotonically-increasing:
  displayText: монотонно возрастающая
  hoverSnippet: Монотонно возрастающая последовательность — это последовательность, значения которой упорядочены по возрастанию и не убывают. Например, последовательности 1, 6, 7, 11, 131 или 2, 5, 5, 5, 6, 10.

predicate-pushdown:
  displayText: Predicate pushdown
  hoverSnippet: Проталкивание предиката — это выражение, используемое для определения того, какие строки в базе данных применимы к конкретному запросу.

primary-key:
  displayText: первичный ключ
  hoverSnippet: Первичный ключ — это столбец в объекте базы данных, который не содержит значений NULL и однозначно идентифицирует каждую строку.

relational-database:
  displayText: relational database
  hoverSnippet: Реляционная база данных предоставляет структурированный способ хранения данных в таблицах, состоящих из строк и столбцов. Различные таблицы в реляционной базе данных могут быть объединены с использованием общих столбцов из каждой таблицы, формируя отношения.

reverse-etl:
  displayText: reverse ETL
  hoverSnippet: Обратный ETL — это процесс передачи преобразованных данных из хранилища данных в конечные бизнес-платформы, такие как CRM-системы для продаж и рекламные платформы.

scalar:
  displayText: scalar
  hoverSnippet: Тип UDF, который возвращает одно значение на строку.

scalar-value:
  displayText: scalar value
  hoverSnippet: Отдельное значение данных (например, число или строка), а не коллекция или набор значений.

sql-expression:
  displayText: SQL expression
  hoverSnippet: SQL-выражение — это комбинация столбцов, значений, операторов и функций, которая вычисляется в одно значение.

sql-rendering:
  displayText: Рендеринг SQL
  hoverSnippet: Движок dbt v1 принимает SQL с Jinja и раскрывает все макросы в модели, формируя SQL, готовый к выполнению в базе данных. Для синтаксического анализа и компиляции SQL используйте движок dbt v2, который позволяет лучше понимать структуру вашего SQL.

introspective-adapter-call:
  displayText: интроспективный вызов адаптера
  hoverSnippet: Вызов макроса, например adapter.execute или adapter.get_columns_in_relation, который отправляет запрос к вашей платформе данных во время выполнения. dbt lint никогда не подключается к хранилищу данных, поэтому при проверке кода эти вызовы не возвращают реальных результатов.

introspective-macro:
  displayText: интроспективный макрос
  hoverSnippet: Макрос, который выполняет интроспективный вызов адаптера, например adapter.execute или adapter.get_columns_in_relation, для отправки запроса к вашей платформе данных. dbt lint никогда не подключается к хранилищу данных, поэтому при проверке кода эти макросы не возвращают реальных результатов.

selector-expression:
  displayText: выражение селектора
  hoverSnippet: Выражение, используемое с --select и --exclude для включения или исключения определённых узлов в вашем проекте dbt.

subquery:
  displayText: subquery
  hoverSnippet: Подзапрос — это запрос внутри другого запроса. Подзапросы часто используются, когда необходимо обработать данные в несколько этапов.

surrogate-key:
  displayText: суррогатный ключ
  hoverSnippet: Суррогатный ключ — это уникальный идентификатор, полученный из самих данных. Часто он представляет собой хеш-значение нескольких столбцов, которое обеспечивает уникальность каждой строки.

target-schema:
  displayText: target schema
  hoverSnippet: Your target schema is the schema dbt builds your models into for a given environment, set in your connection or profile. Dev work usually goes to your own schema so you don't overwrite anyone else's tables.

table:
  displayText:  таблица
  hoverSnippet: Проще говоря, таблица — это непосредственное хранение данных в строках и столбцах. Представьте лист Excel с исходными значениями в каждой ячейке.

view:
  displayText: представление
  hoverSnippet: Представление (в отличие от таблицы) — это заранее определённый SQL-запрос, который можно выполнить в базе данных (или хранилище данных).

service-provider:
  displayText: Поставщик сервиса
  hoverSnippet: Сторона, которая публикует сервис для частного доступа. Это может быть сторонний поставщик (Snowflake, Databricks) или сама облачная платформа (Redshift, BigQuery).

service-producer:
  displayText: Сторона, предоставляющая сервис
  hoverSnippet: Сторона, которая развёртывает сервис, к которому подключается потребитель, и управляет им. Эта сторона публикует идентификатор ресурса, который потребитель использует для установления соединения.

consumer:
  displayText: Потребитель
  hoverSnippet: Сторона, которая создаёт частную конечную точку для подключения к сервису. Когда потребителем выступает dbt Cloud, он подключается к вашим сервисам.

native-provisioned:
  displayText: Предоставляется облачной платформой
  hoverSnippet: Облачная платформа (AWS, Azure, GCP) выступает стороной, предоставляющей собственные сервисы (Redshift, Synapse, BigQuery).

vendor-provisioned:
  displayText: Предоставляется сторонним поставщиком
  hoverSnippet: Сторонний поставщик (Snowflake, Databricks, Teradata) развёртывает инфраструктуру частного подключения.

customer-provisioned:
  displayText: Предоставляется клиентом
  hoverSnippet: Вы создаёте инфраструктуру частного подключения, управляете ею и предоставляете доступ к ней dbt.

dedicated-endpoint:
  displayText: Выделенная конечная точка
  hoverSnippet: Частная конечная точка, созданная специально для вашей учётной записи и обеспечивающая как сетевую изоляцию, так и контроль доступа.

shared-endpoint:
  displayText: Общая конечная точка
  hoverSnippet: Частная конечная точка, которую обслуживает dbt и используют несколько клиентов; изоляция трафика обеспечивается только средствами контроля доступа.

dbt-provisioned:
  displayText: Предоставляется dbt
  hoverSnippet: dbt развёртывает сервис конечной точки, к которому подключается ваша частная конечная точка, и управляет им. Это относится к подключениям К dbt Cloud.
---
