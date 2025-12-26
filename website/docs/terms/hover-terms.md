---
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
  hoverSnippet: DataFrame — это двумерная структура данных (строки и столбцы). Это наиболее распространенный способ представления и взаимодействия с большими наборами данных в Python.

ddl:
  displayText: DDL  
  hoverSnippet: Язык определения данных (DDL) — это группа SQL-операторов, которые вы можете выполнять для управления объектами базы данных, включая таблицы, представления и многое другое.

deploying: 
  displayText: Deploying
  hoverSnippet: Развертывание dbt в производственной среде означает настройку системы для выполнения задания dbt по расписанию, а не выполнение команд dbt вручную из командной строки.

dimensional-modeling:
  displayText: dimensional modeling
  hoverSnippet: Моделирование измерений — это техника моделирования данных, при которой вы разбиваете данные на «факты» и «измерения», чтобы организовать и описать сущности в вашем хранилище данных.

dml:
  displayText: DML  
  hoverSnippet: Язык манипулирования данными (DML) — это класс SQL-операторов, которые используются для запроса, редактирования, добавления и удаления данных на уровне строк из таблиц или представлений базы данных. Основные операторы DML — SELECT, INSERT, DELETE и UPDATE.

dry:
  displayText: DRY  
  hoverSnippet: DRY — это принцип разработки программного обеспечения, который означает «Не повторяйся». Следование этому принципу означает, что ваша цель — уменьшить повторяющиеся шаблоны и дублирование кода и логики в пользу модульного и ссылочного кода.

edw:
  displayText: EDW  
  hoverSnippet: Корпоративное хранилище данных (EDW), как и любое другое хранилище данных, представляет собой коллекцию баз данных, которые централизуют информацию бизнеса из множества источников и приложений.

elt:
  displayText: ELT  
  hoverSnippet: Извлечение, загрузка, трансформация (ELT) — это процесс, при котором сначала извлекаются данные из различных источников данных, загружаются в целевое хранилище данных, а затем трансформируются.

etl:
  displayText: ETL
  hoverSnippet: Извлечение, трансформация, загрузка (ETL) — это процесс, при котором сначала извлекаются данные из источника данных, затем трансформируются, а затем загружаются в целевое хранилище данных.

grain:
  displayText: grain  
  hoverSnippet: Зерно ваших данных — это комбинация столбцов, по которым записи в таблице уникальны. В идеале это фиксируется в одном столбце и уникальном первичном ключе.

idempotent:
  displayText: idempotent
  hoverSnippet: Идемпотентность описывает процесс, который дает вам один и тот же результат, независимо от того, сколько раз вы его выполняете.

json:
  displayText: JSON
  hoverSnippet: JSON (JavaScript Object Notation) — это минимальный формат для полуструктурированных данных, используемый для фиксации отношений между полями и значениями.

lsp:
  displayText: LSP
  hoverSnippet: Language Server Protocol (LSP) enables developer features like live CTE previews, hover info, error highlighting, and more.

materialization:
  displayText: materialization 
  hoverSnippet: Точный язык определения данных (DDL), который dbt будет использовать при создании эквивалента модели в хранилище данных.

model: 
  hoverSnippet: Модель — это основной строительный блок DAG
  displayText: model

monotonically-increasing:
  displayText: monotonically increasing 
  hoverSnippet: Монотонно возрастающая последовательность — это последовательность, значения которой отсортированы в порядке возрастания и не убывают. Например, последовательности 1, 6, 7, 11, 131 или 2, 5, 5, 5, 6, 10.

predicate-pushdown:
  displayText: Predicate pushdown
  hoverSnippet: Проталкивание предиката — это выражение, используемое для определения того, какие строки в базе данных применимы к конкретному запросу.

primary-key:
  displayText: primary key  
  hoverSnippet: Первичный ключ — это ненулевой столбец в объекте базы данных, который уникально идентифицирует каждую строку.

relational-database:
  displayText: relational database
  hoverSnippet: Реляционная база данных предоставляет структурированный способ хранения данных в таблицах, состоящих из строк и столбцов. Различные таблицы в реляционной базе данных могут быть объединены с использованием общих столбцов из каждой таблицы, формируя отношения.

reverse-etl:
  displayText: reverse ETL
  hoverSnippet: Обратный ETL — это процесс передачи ваших преобразованных данных, хранящихся в вашем хранилище данных, в конечные бизнес-платформы, такие как CRM для продаж и рекламные платформы.

scalar:
  displayText: scalar
  hoverSnippet: A UDF type that returns a single value per row.

scalar-value:
  displayText: scalar value
  hoverSnippet: A single piece of data (for example, a number or string) rather than a collection or set of values.

sql-expression:
  displayText: SQL expression
  hoverSnippet: A SQL expression is a combination of columns, values, operators, and functions that evaluates to a single value.

sql-rendering:
  displayText: SQL rendering  
  hoverSnippet: The dbt Core engine takes SQL with Jinja, and renders all the macros present in the model to produce SQL that is ready to run against the database. For SQL parsing and compilation capabilities, use the Fusion engine instead to better understand your SQL structure.

subquery:
  displayText: subquery
  hoverSnippet: Подзапрос — это запрос внутри другого запроса. Подзапросы часто используются, когда необходимо обработать данные в несколько этапов.

surrogate-key:
  displayText: surrogate key  
  hoverSnippet: Суррогатный ключ — это уникальный идентификатор, полученный из самих данных. Он часто принимает форму хешированного значения нескольких столбцов, которое создаст ограничение уникальности для каждой строки.

table:
  displayText:  table 
  hoverSnippet: В простейших терминах, таблица — это прямое хранение данных в строках и столбцах. Представьте себе лист Excel с сырыми значениями в каждой из ячеек.

view:
  displayText: view  
  hoverSnippet: Представление (в отличие от таблицы) — это определенный проходной SQL-запрос, который может быть выполнен в базе данных (или хранилище данных).
```
