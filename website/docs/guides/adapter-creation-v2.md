---
title: "Добавление адаптера dbt v2"
id: adapter-creation-v2
description: "Узнайте, как добавить новый адаптер сообщества в монорепозиторий dbt v2 на Rust: от регистрации драйвера ADBC до SQL-макросов."
hoverSnippet: "Пошаговое руководство по добавлению адаптера сообщества в dbt v2, включая структуру крейтов, паттерны Rust и макросы Jinja."
icon: 'guides'
hide_table_of_contents: false
tags: ['Adapter creation']
level: 'Advanced'
---

<div style={{maxWidth: '900px'}}>

:::info
Это руководство предназначено для <Constant name="core_v2" />. Для <Constant name="core_v1" /> см. [Создание, тестирование, документирование и продвижение адаптеров](/guides/adapter-creation).
:::

## Шаг 1: Введение

Адаптеры <Constant name="core_v2" /> существенно отличаются от адаптеров v1, и прежде чем приступать к работе, стоит разобраться почему.

В <Constant name="core_v1" /> каждый адаптер представлял собой **отдельный пакет Python**, который сообщество сопровождало независимо от других. Такая модель плохо масштабировалась: с каждым новым хранилищем росли затраты на сопровождение, ошибки приходилось исправлять отдельно в каждом пакете, а общие улучшения редко распространялись на всю экосистему.

В <Constant name="core_v2" /> этот подход полностью изменился. Теперь адаптеры находятся **в едином монорепозитории на Rust**, организованном по функциональным областям, а не по хранилищам. Исправление в модуле аутентификации приносит пользу сразу всем адаптерам. Добавляя новый адаптер, вы расширяете общий код, а не создаёте совершенно новый пакет с нуля. В терминах Rust это означает добавление ветвей в *существующие* выражения match. Чем больше адаптеров уже существует, тем проще добавить следующий. Ваш вклад улучшает всю экосистему.

Ещё одно преимущество <Constant name="core_v2" />: управление подключениями вынесено за пределы адаптера. В v1 каждый адаптер должен был реализовывать собственную логику подключения, создавая обёртки над SDK поставщиков или реализуя спецификацию Python DB API. **В v2 эту задачу выполняют драйверы ADBC**: предварительно скомпилированные бинарные файлы, которые вы регистрируете, но не пишете. Подробное объяснение ADBC и его использования в <Constant name="core_v2" /> см. в разделе [ADBC в <Constant name="core_v2" />](/docs/dbt/adbc?version=2.0).

Вам нужно добавить именно ту логику, которая различается между хранилищами: учётные данные, именование объектов БД, макросы и запросы к каталогу. Полноценный адаптер сообщества затрагивает около 13 файлов — именно на такой объём работы мы ориентируемся.

Это руководство познакомит вас с архитектурой, структурой крейтов и пошаговым процессом добавления адаптера <Constant name="core_v2" />. Меня зовут Хоуп Уотсон, я менеджер по продукту адаптеров <Constant name="core_v2" /> в dbt Labs. Я подготовила этот материал, чтобы помочь спроектировать, задокументировать и организовать этот процесс для сообщества в мире v2. 

В качестве примера на протяжении всего руководства используется адаптер Exasol, добавленный [Марко Нэтлицем](https://www.linkedin.com/in/marco-naetlitz/). Полный перечень файлов в [справочном разделе](#reference-file-by-file-implementation-guide) точно определяет, что вам предстоит создать.

### Чем отличаются адаптеры v1 и v2

| Аспект | <Constant name="core_v1" /> | <Constant name="core_v2" /> |
|-------|-------------|-------------|
| **Структура пакетов** | Отдельные пакеты Python (например, `dbt-snowflake` и `dbt-bigquery`), каждый из которых наследуется от `dbt-adapters` | Часть монорепозитория `dbt-labs/dbt`; изменения вносятся через PR |
| **Кто сопровождает** | dbt Labs сопровождает базовый адаптер и 6 основных адаптеров; остальные независимо сопровождает сообщество | dbt Labs сопровождает монорепозиторий; сообщество вносит изменения через pull request |
| **Язык** | Python | Rust (для SQL-логики по-прежнему используются SQL-макросы Jinja) |
| **Как загружаются** | Динамически во время выполнения через систему плагинов Python | Компилируются в бинарный файл монорепозитория |
| **Управление подключениями** | Каждый адаптер реализует собственную логику подключения на основе коннекторов/драйверов Python SDK поставщика | Подключениями управляют драйверы ADBC: единый интерфейс драйверов, скрывающий детали сетевого протокола |
| **Организация кода** | По хранилищам: каждый адаптер — изолированная кодовая база | По функциональным областям (вертикалям): исправление в одном крейте приносит пользу всем адаптерам |

### Что вы создаёте

Как участник сообщества, вы создаёте основу: подключение к своему хранилищу, выполнение макросов dbt и поддержку базовых материализаций. После добавления адаптера команды `dbt build` и `dbt run` должны работать. Около 13 файлов в [справочном разделе](#reference-file-by-file-implementation-guide) определяют полный объём работ.

Рассматривайте свой адаптер как связующее звено между <Constant name="core_v2" /> и вашим хранилищем: всё необходимое для взаимодействия dbt с ним, и ничего лишнего. Архитектурная схема ниже показывает место вашей работы в стеке.

<Lightbox src="/img/adapter-guide/adapter-creation-v2-architecture.svg" title="Архитектурная схема адаптера dbt v2: область вклада сообщества в монорепозитории, граница ADBC C ABI, драйвер ADBC и хранилище" />

## Шаг 2: Предварительные требования

**Знакомство с Rust**: вам не нужно быть экспертом по Rust. Нужно уметь читать код на Rust, понимать выражения сопоставления enum и разбираться в ошибках компилятора. Если Rust для вас в новинку, ознакомьтесь с главой 6 [The Rust Book](https://doc.rust-lang.org/book/) (перечисления и сопоставление с образцом). Именно эти концепции будут встречаться чаще всего.

**Основы dbt**: нужно понимать, как работает [`profiles.yml`](/docs/local/profiles.yml), что такое [материализации](/docs/build/materializations) и для чего нужны макросы [диспетчеризации адаптеров](/reference/dbt-jinja-functions/dispatch).

**Глубокое знание своего хранилища**: при работе с этим руководством вам нужно будет знать особенности его поведения:
- Какой символ используется для заключения идентификаторов в кавычки?
- Поддерживает ли оно имена объектов БД из двух или трёх частей?
- Какие параметры подключения ему требуются?
- Как оно обрабатывает транзакции?
- Какие типы данных соответствуют стандартным SQL-типам, таким как string, timestamp, boolean?
- Как наиболее эффективно получить список столбцов в схеме?

**Примечание о разработке с помощью ИИ**: архитектура <Constant name="core_v2" /> хорошо понятна ИИ-инструментам для написания кода. Ветви match заданы явно, ошибки компилятора точны, а область ответственности каждого файла узкая. Использовать LLM необязательно, но если вы решите это делать, такая структура вам поможет.

### Ваш драйвер ADBC

*Есть ли драйвер ADBC для вашего хранилища? Если нет, остановитесь здесь.* Наличие драйвера ADBC — обязательное условие для создания адаптера <Constant name="core_v2" />.

Проверьте следующие источники, чтобы узнать, существует ли драйвер для вашего хранилища:
- [apache/arrow-adbc](https://github.com/apache/arrow-adbc): исходный репозиторий сообщества
- [dbt-labs/arrow-adbc](https://github.com/dbt-labs/arrow-adbc): форк dbt Labs
- [ADBC driver foundry](https://github.com/adbc-drivers): основная площадка сообщества драйверов ADBC с активно развиваемыми драйверами и фреймворками на Rust/Go для создания новых
- Собственная организация поставщика вашего хранилища на GitHub

Если драйвера пока нет, его создание — отдельный проект, который должен предшествовать добавлению адаптера. Это выходит за рамки ответственности dbt Labs. Компания [Columnar](https://columnar.tech/) специализируется на разработке драйверов ADBC и может оказаться полезным ресурсом.

:::note В долгосрочной перспективе: распространение подписанных драйверов
dbt Labs работает над моделью, в которой драйверы сообщества можно будет безопасно распространять и загружать в виде подписанных бинарных файлов — подобно тому, как операционные системы проверяют установщики. Цель — сделать установку сторонних драйверов такой же простой и надёжной, как установку собственных. Пока эта возможность не реализована, но dbt Labs рассматривает такое направление.
:::

## Шаг 3: Изучите устройство кодовой базы перед началом разработки

### Вертикальная модель

В <Constant name="core_v2" /> логика адаптеров организована по *возможностям*, а не по хранилищам. Нет ни класса `SnowflakeAdapter`, ни класса `BigQueryAdapter`. Вместо этого все хранилища обслуживает единая общая кодовая база, а специфичное для хранилища поведение определяется выражениями `match adapter_type()`. Добавляя новое хранилище, вы добавляете ветви в эти выражения в нескольких функциональных областях — аутентификация, объекты БД, анализ каталога, макросы Jinja, — а не создаёте новый пакет верхнего уровня.

Структурная схема ниже показывает, как связаны уровни системы. Ваша работа сосредоточена на уровне **ADAPTER**: в крейтах, отвечающих за идентификацию хранилища, получение учётных данных, логику объектов БД и диспетчеризацию Jinja. Сразу под ним расположен XDBC (загрузка драйверов и пул подключений), где также требуется небольшой шаг регистрации.

<Lightbox src="/img/adapter-guide/adapter-creation-v2-structural.svg" title="Схема уровней системы dbt v2: USER, CLI, PIPELINE, TASK RUNNER, ADAPTER (выделен как область внесения изменений), XDBC и WAREHOUSE" />

### Карта крейтов

В Rust **крейт** — это пакет, единица компиляции, примерно соответствующая «библиотеке» или «модулю» в других языках. Репозиторий `dbt-labs/dbt` — это монорепозиторий из нескольких крейтов, каждый из которых отвечает за один функциональный срез для всех хранилищ. Ниже приведена краткая карта шести крейтов, которые вам предстоит изменить для создания адаптера, в том порядке, в котором вы будете работать с ними на шаге 5.

| Крейт | Расположение | Что вы изменяете |
|-------|----------|----------------|
| `dbt-adapter-core` | `crates/dbt-adapter-core/` | Вариант перечисления `AdapterType`, ветвь `quote_char` |
| `dbt-xdbc` | `crates/dbt-xdbc/` | Регистрация драйвера ADBC (перечисление `Backend`, имя библиотеки) |
| `dbt-schemas` | `crates/dbt-schemas/` | Структура конфигурации `profiles.yml` (вариант `DbConfig`) |
| `dbt-auth` | `crates/dbt-auth/` | Получение учётных данных, формирование URI подключения |
| `dbt-adapter` | `crates/dbt-adapter/` | Кавычки для имён объектов БД, запросы к каталогу метаданных, ветви match адаптера, построитель столбцов, sql_types |
| `dbt-loader` | `crates/dbt-loader/` | SQL-макросы Jinja (`dbt_macro_assets/dbt-<adapter>/`) |

### Место вашего адаптера в модели выполнения

К моменту вызова адаптера вся работа dbt уже выполнена. dbt разрешил вызовы `ref()` и `source()`, обработал все шаблоны Jinja и сформировал SQL для нужного диалекта. Ваш адаптер получает готовую строку и выполняет её.

:::tip Адаптер никогда не получает необработанный SQL-шаблон
dbt разрешает `ref()`, обрабатывает Jinja и передаёт адаптеру готовую строку. Вы выполняете её, а не обрабатываете шаблон.
:::

Пока вы пишете код, компилятор контролирует полноту реализации. Когда вы добавляете `AdapterType::MyWarehouse` в перечисление, каждый блок `match adapter_type()`, который его не обрабатывает, вызывает ошибку ровно в соответствующей строке. Список задач всегда перед глазами. Например:

```rust
// You add your variant to the enum in dbt-adapter-core:
pub enum AdapterType {
    Snowflake,
    BigQuery,
    DuckDb,
    Trino,
    MyWarehouse,  // ← you added this
}

// Now every match block in the codebase must handle it.
// This one in adapter_impl.rs doesn't yet:
match self.adapter_type() {
    AdapterType::Snowflake => { ... }
    AdapterType::BigQuery => { ... }
    AdapterType::DuckDb => { ... }
    AdapterType::Trino => { ... }
    // missing MyWarehouse → compile error
}
```

```text
error[E0004]: non-exhaustive patterns: `AdapterType::MyWarehouse` not covered
  --> crates/dbt-adapter/src/adapter/adapter_impl.rs:142:18
   |
   |     match self.adapter_type() {
   |           ^^^^^^^^^^^^^^^^^^^ pattern `AdapterType::MyWarehouse` not covered
```

Каждая ошибка — это конкретная задача по реализации.

### Переносите существующий адаптер v1?

Нет адаптера v1? Переходите к [шагу 4](#step-4-development-machine-setup). Если вы переносите адаптер, эта карта поможет точно понять, что можно перенести, что нужно переосмыслить и за что в v2 теперь отвечает dbt Labs.

<Lightbox src="/img/adapter-guide/adapter-creation-v2-blocks.svg" title="Схема компонентов адаптера v1: что напрямую переносится в v2 (зелёный), требует переосмысления (фиолетовый) или переходит в ведение dbt Labs либо драйвера ADBC (красный)" />

Большинство участников сообщества не создают адаптер с нуля, а переносят тот, который уже сопровождают или используют на Python для <Constant name="core_v1" />. Если это ваш случай, **у вас уже есть значительная фора**, и для подавляющего большинства участников это наиболее реалистичный путь.

Прежде чем писать код на Rust, проверьте несколько вещей:

1. Существует ли уже адаптер v1 для вашего хранилища?

Обратитесь к списку [адаптеров сообщества](/docs/community-adapters). Если такой адаптер есть, найдите его репозиторий на GitHub. SQL-код макросов и логику подключения можно использовать повторно почти без изменений.

2. Добавила ли dbt Labs заготовку для вашего хранилища?

Некоторые хранилища уже присутствуют в перечислении `AdapterType` в v2, но ещё не полностью реализованы: вариант перечисления существует, а значит, часть базового кода уже на месте. При добавлении оставшегося кода компилятор покажет, чего именно не хватает. В таком состоянии находятся следующие хранилища:

| Хранилище | Адаптер v1 | Состояние в <Constant name="core_v2" /> |
|-----------|------------|-------------------|
| Athena | [dbt-athena](https://github.com/dbt-athena/dbt-athena) | `AdapterType::Athena` существует: нужны аутентификация, макросы, ветви адаптера |
| Trino | [dbt-trino](https://github.com/starburstdata/dbt-trino) | `AdapterType::Trino` существует: нужны аутентификация, макросы, ветви адаптера |
| Starburst | [dbt-trino](https://github.com/starburstdata/dbt-trino) | `AdapterType::Starburst` существует: нужны аутентификация, макросы, ветви адаптера |
| Dremio | [dbt-dremio](https://github.com/dremio/dbt-dremio) | `AdapterType::Dremio` существует: нужны аутентификация, макросы, ветви адаптера |
| Oracle | [dbt-oracle](https://github.com/oracle/dbt-oracle) | `AdapterType::Oracle` существует: нужны аутентификация, макросы, ветви адаптера |

Для хранилищ, которых ещё нет в `AdapterType` (MySQL, Hive, Vertica, SQL Server, Teradata и других), начните с шага 5.1 — добавления варианта `AdapterType`.

#### Что переносится из v1 в v2

| Компонент v1 | Куда переносится в v2 | Примечания |
|--------------|---------------------|-------|
| `macros/adapters.sql` | `dbt-loader/.../dbt-<wh>/macros/adapters.sql` | В основном прямой перенос: тот же префикс диспетчеризации `<wh>__`, те же имена макросов и паттерны Jinja |
| `macros/catalog.sql` | В то же расположение | SQL-код для каталога (`list_relations_without_caching`, `get_catalog`) переносится почти дословно |
| Пользовательские материализации и переопределения адаптера | В то же расположение | Обратите внимание на конструкции Jinja, которые могут пока не поддерживаться в <Constant name="core_v2" />; их потребуется доработать отдельно |
| Поля профиля в `credentials.py` / `profile_template.yml` | Структура `DbConfig` в `dbt-schemas` | Каждое поле профиля становится полем структуры: для необязательных полей используется `Option<T>` |
| Формирование URI подключения / DSN в `connections.py` | `dbt-auth/src/<wh>/mod.rs` | Логика формирования URI хорошо вписывается в паттерн модуля аутентификации |
| `BaseRelation.quote_policy` / правила регистра идентификаторов | `include_policy()` в `crates/dbt-adapter/src/relation/relation_impl.rs`; `Policy` — псевдоним типа `ResolvedQuoting`, определённого в `crates/dbt-schemas/src/schemas/relations/base.rs` | Структура имён из трёх или двух частей и флаги кавычек напрямую соответствуют структуре `Policy` в <Constant name="core_v2" /> |
| SQL-код анализа каталога в макросах и `adapter.py` | `get_relation.rs` и макросы Jinja | Уже знакомые вам имена таблиц системного каталога и запросы переносятся напрямую |

#### Что не переносится по замыслу архитектуры

Четыре категории кода v1 в v2 просто отсутствуют, поэтому переносить нужно меньше кода:
- **Управление подключениями**: в v1 вы отвечали за полный жизненный цикл подключения через Python DB API. В v2 этим полностью занимается драйвер ADBC; пропускайте всё, что связано с курсорами, повторными попытками и пулом подключений.
- **Выполнение запросов**: низкоуровневую обработку запросов (`execute`, `add_query`) обеспечивает общая инфраструктура на Rust. Вам не нужно её реализовывать.
- **Иерархия классов адаптеров**: структура подклассов Python заменена общими выражениями match на Rust. Вы регистрируете адаптер, а не реализуете логику выполнения.
- **Упаковка и распространение**: нет ни `setup.py`, ни публикации в PyPI. После слияния PR dbt Labs выпускает ваш адаптер.

## Шаг 4: Настройка среды разработки {#step-4-development-machine-setup}

```shell
# Rust
rustup  # install from https://rustup.rs
rustup show  # verify

# Go (needed for driver builds)
go version  # verify

# Clone the repo
git clone https://github.com/dbt-labs/dbt
cd dbt

# Verify you can build
cargo build --bin dbt
```

Если возникнут ошибки Z3:

```shell
brew install pkg-config z3
```

Если во время сборки закончится место на диске:

```shell
cargo clean  # frees old build artifacts; you'll do this often
```

### Рабочий процесс разработки

Основной цикл разработки одинаков независимо от того, пишете ли вы код вручную или с ИИ-помощником:

1. Добавьте `AdapterType::MyWarehouse` в перечисление (шаг 5.1)
2. Выполните `cargo build -p <crate>`: компилятор перечислит все отсутствующие ветви match для нового варианта
3. Используйте вывод компилятора, редактируемый файл и соответствующий эталонный файл (из перечня внизу), чтобы написать каждую ветвь. Если используете ИИ-помощника, передайте ему все три элемента в качестве контекста.
   - *Пример:* чтобы добавить ветвь `quote_char`, передайте ошибку о том, что `AdapterType::MyWarehouse` не обработан, блок match функции `quote_char` из `dbt-adapter-core/src/lib.rs` и строку Exasol (`Exasol => '"'`) как образец.
4. Добавьте ветвь и снова проверьте результат с помощью `cargo build`
5. Повторяйте для каждого крейта, пока не устраните все ошибки

Каждый необработанный вариант вызывает ошибку компиляции, поэтому у ИИ-помощника всегда есть точная спецификация для работы.

Какой контекст полезен для каждой ветви:
- **Редактируемый файл**: вставьте соответствующий блок `match` или функцию. Например, блок `match self.adapter_type()` из `adapter_impl.rs`, в который нужно добавить новую ветвь.
- **Соответствующий эталонный файл** из перечня ниже. Например, при написании модуля аутентификации вставьте `crates/dbt-auth/src/exasol/mod.rs` в качестве образца.
- **Вывод компилятора с ошибкой.** Например: `error[E0004]: non-exhaustive patterns: AdapterType::MyWarehouse not covered`
- **Особенности вашего хранилища**: имена таблиц системного каталога и поля подключения из вашего `profiles.yml`.

На что обратить внимание:
- **Выдуманные пути к файлам**: ИИ часто придумывает пути в <Constant name="core_v2" />. Используйте перечень файлов ниже как достоверный источник.
- **Всегда проверяйте результат компилятором**: выполняйте `cargo build -p <crate>` после любых изменений, сгенерированных ИИ.
- **Паттерны SQL-макросов из v1** могут не подходить напрямую для <Constant name="core_v2" />. Сверяйтесь с эталонным `adapters.sql` по пути `crates/dbt-loader/src/dbt_macro_assets/dbt-exasol/macros/adapters.sql` в [dbt-labs/dbt](https://github.com/dbt-labs/dbt).

## Шаг 5: Создание нового адаптера

На этом шаге рассматривается каждый крейт, который нужно изменить. Проходите их по порядку: каждый следующий этап опирается на предыдущий. После каждого подшага запускайте проверку типов, чтобы находить пропущенные ветви match и ошибки типов:

```shell
cargo build -p <crate-name>
```

Замените `<crate-name>` на имя крейта, который вы только что изменили, например `dbt-adapter-core`, `dbt-xdbc`, `dbt-schemas`, `dbt-auth`, `dbt-adapter` или `dbt-loader`.

### 5.1: Регистрация типа адаптера

**Крейт:** `crates/dbt-adapter-core/`

`AdapterType` — центральное перечисление, которое идентифицирует ваше хранилище во всей кодовой базе. Сначала добавьте свой вариант именно сюда.

Выражения `match` в Rust должны явно обрабатывать все возможные варианты. Поэтому при добавлении `AdapterType::MyWarehouse` каждый блок `match adapter_type()`, который не обрабатывает этот вариант, вызывает **ошибку компиляции**. Выполните `cargo build -p <crate>`, и компилятор предоставит полный список того, что ещё нужно написать. Ничего скрытого или неявного.

```rust
// crates/dbt-adapter-core/src/lib.rs
pub enum AdapterType {
    Postgres, Snowflake, Bigquery, Databricks, Redshift,
    Spark, DuckDB, Fabric,
    ClickHouse, Athena, Starburst, Trino, Datafusion, Dremio, Oracle,
    Exasol,        // ← already added
    MyWarehouse,   // ← add yours here
}
```

Также добавьте ветвь `quote_char` в том же файле. Для большинства хранилищ используйте двойные кавычки `'"'`; BigQuery и Databricks используют обратную кавычку:

```rust
// crates/dbt-adapter-core/src/lib.rs
fn quote_char(&self) -> char {
    match self {
        // ... existing adapters ...
        Exasol => '"',         // double-quote (most warehouses)
        MyWarehouse => '"',    // ← add yours here
        BigQuery | Databricks => '`',
    }
}
```

### 5.2: Регистрация драйвера ADBC

**Крейт:** `crates/dbt-xdbc/`

Ваш драйвер уже существует (это рассматривалось на шаге 2). Здесь вы регистрируете его, чтобы <Constant name="core_v2" /> знал имя его библиотеки и способ загрузки во время выполнения.

| Файл | Что нужно сделать | Обязательно? |
|-------|-----------|-----------|
| `src/driver.rs` | Добавить вариант в перечисление `Backend`; указать имя библиотеки ADBC (например, `"adbc_driver_exasol"`) и протокол FFI; также определить `LoadStrategy` | **Да** |
| `src/install.rs` | Добавить URL загрузки из CDN и строки платформ | Нет, только для драйверов, распространяемых через CDN dbt Labs; это требует отдельного согласования с dbt Labs |

Перечисление `Backend` сопоставляется с именем динамической библиотеки ADBC (`lib<name>.so` / `<name>.dll` / `lib<name>.dylib`). Вы регистрируете сведения о драйвере, чтобы <Constant name="core_v2" /> знал, что загружать. Сам драйвер здесь не пишется.

#### Распространение через CDN и ручная установка

Для этих 11 адаптеров <Constant name="core_v2" /> автоматически загружает драйвер при первом использовании. Для всех остальных адаптеров требуется ручная установка — пользователям нужно выполнить дополнительный шаг настройки. Явно укажите это в документации (шаг 7).

| В CDN: загружаются автоматически |
|---|
| Snowflake, BigQuery, ClickHouse, Postgres, Databricks, Redshift, DuckDB, DuckDB Extended, Spark, SQL Server |

Что касается **нестандартных сопоставлений типов Arrow** (например, DuckDB это потребовалось для `HUGEINT`, `UTINYINT`): добавляйте специфичную для хранилища обработку типов только в том случае, если драйвер возвращает типы, не охваченные стандартной схемой Arrow. Большинству хранилищ это не нужно.

### 5.3: Добавление профиля подключения

**Крейт:** `crates/dbt-schemas/`

| Файл | Что нужно сделать |
|------|------------|
| `src/schemas/profiles.rs` | Добавить вариант `DbConfig` и структуру конфигурации со всеми полями подключения |

Структура конфигурации должна включать всё, что пользователь укажет в `profiles.yml` для вашего хранилища. Пример Exasol:

```rust
#[derive(Debug, Clone, Serialize, Deserialize, Default, DbtSchema, Merge)]
pub struct ExasolDbConfig {
    pub user: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none", alias = "pass")]
    pub password: Option<String>,
    pub host: Option<String>,
    pub port: Option<StringOrInteger>,
    pub database: Option<String>,
    pub schema: Option<String>,
    pub encryption: Option<bool>,
    pub certificate_validation: Option<bool>,
    pub certificate_fingerprint: Option<String>,
    pub connection_timeout: Option<StringOrInteger>,
    pub threads: Option<StringOrInteger>,
}
```

После добавления структуры конфигурации добавьте также `DbConfig::MyWarehouse(Box<MyWarehouseDbConfig>)` как новый вариант перечисления `DbConfig`. Затем компилятор укажет все места, где читается `DbConfig` и требуется новый вариант для вашего хранилища. Следуйте этим сообщениям об ошибках, чтобы подключить его во всех нужных местах.

### 5.3.1: Добавление генерации профиля через `dbt init` (необязательно, но настоятельно рекомендуется)

Это сделает ваш адаптер удобным в использовании. Когда пользователь запускает `dbt init` и выбирает ваше хранилище, интерактивные подсказки помогают создать `profiles.yml` — без поисков по документации и ручного редактирования YAML.

Добавьте поддержку в `crates/dbt-init/`:

1. Зарегистрируйте адаптер в `get_available_adapters()` в файле `crates/dbt-init/src/profile_setup.rs`:

```rust
pub fn get_available_adapters() -> &'static [AdapterType] {
    &[
        // ... existing adapters ...
        AdapterType::MyWarehouse,  // ← add this
    ]
}
```

2. Создайте файл конфигурации `crates/dbt-init/src/adapter_config/<warehouse>_config.rs`, реализующий `InteractiveSetup` для вашей структуры `DbConfig`: определите поля, которые должен запрашивать `dbt init`, и обработчик `set_field()`. Минимальный образец см. в `postgres_config.rs`.

3. Экспортируйте его из `crates/dbt-init/src/adapter_config/mod.rs`:

```rust
pub mod mywarehouse_config;
pub use mywarehouse_config::setup_mywarehouse_profile;
```

4. Добавьте ветвь match в `create_profile_for_adapter()` в файле `profile_setup.rs`:

```rust
AdapterType::MyWarehouse => {
    let config = match existing_config {
        Some(DbConfig::MyWarehouse(c)) => Some(c),
        _ => None,
    };
    DbConfig::MyWarehouse(setup_mywarehouse_profile(config.map(Box::as_ref))?)
}
```

### 5.4: Добавление аутентификации

**Крейт:** `crates/dbt-auth/`

| Файл | Что нужно сделать | Обязательно? |
|------|------------|-----------|
| `src/<warehouse>/mod.rs` | Получение учётных данных: чтение полей конфигурации, переменных окружения, файлов ключей, токенов; формирование URI подключения ADBC и учётных данных | **Да** |
| `src/<warehouse>/init.rs` | Генерация SQL инициализации, который должен выполняться при открытии подключения (например, `USE SCHEMA`, операторы `SET` и загрузка расширений) | Необязательно, только для хранилищ, которым требуется SQL при открытии подключения. Большинству это не нужно. |
| `src/lib.rs` | Зарегистрировать новый модуль через `mod <warehouse>;` и подключить его к match диспетчеризации аутентификации | **Да** |

Модуль аутентификации преобразует `DbConfig` в активное аутентифицированное подключение ADBC. Как минимум нужна базовая обработка учётных данных. Более сложные способы аутентификации (OAuth, SSO, пара ключей) можно добавлять постепенно.

Паттерн таков: прочитать поля конфигурации → сформировать URI → вызвать `builder.with_parse_uri(uri)`, `builder.with_username(user)`, `builder.with_password(password)`.

### 5.5: Создание уровня адаптера

**Крейт:** `crates/dbt-adapter/`

Это самый объёмный этап. Вы добавляете специфичное для хранилища поведение в общий уровень адаптера с помощью ветвей `match adapter_type()`.

:::tip Простые и сложные адаптеры
Большинство адаптеров, включая Exasol, Athena, Trino, Starburst, Dremio, Oracle и ClickHouse, добавляют ветви match непосредственно в общие файлы в `src/relation/`.

Собственный подкаталог в `src/relation/` есть только у адаптеров с существенно отличающейся логикой объектов БД (составные имена и правила регистра Snowflake; структура project/dataset BigQuery).

Если ваше хранилище использует стандартные имена `schema.table` или `database.schema.table` с простыми правилами кавычек, ваш адаптер относится к простым. Начните с простого решения и усложняйте его только по требованию компилятора.
:::

#### Тип объекта БД и кавычки

**Файл:** `crates/dbt-adapter/src/relation/relation_impl.rs`

Добавьте ветвь match, задающую вашу политику кавычек. Эта политика управляет тремя аспектами: включается ли база данных в полные имена, заключается ли схема в кавычки и заключается ли идентификатор в кавычки.

Например, Exasol использует имя из двух частей (`schema.table`, без префикса базы данных) и заключает обе части в кавычки:

```rust
// crates/dbt-adapter/src/relation/relation_impl.rs
fn include_policy(adapter_type: AdapterType, path: &RelationPath) -> Policy {
    match adapter_type {
        // ... existing adapters ...
        AdapterType::MyWarehouse => Policy::new(false, true, true),
        //                                      ↑      ↑     ↑
        //                                   database schema identifier
        //                                   disabled quoted  quoted
        _ => Policy::trues(), // default: all parts included and quoted
    }
}
```

Заранее определите, использует ли ваше хранилище имена из двух или трёх частей и чувствительны ли идентификаторы к регистру. Например, Exasol по умолчанию приводит идентификаторы без кавычек к верхнему регистру, поэтому во всех SQL-запросах поиска по каталогу используются сравнения с `upper()`.

**Файл:** `src/relation/factory.rs`

Добавьте свой `AdapterType` в match функции `create_static_relation`, связав его с `RelationStatic` (универсальным статическим объектом relation, используемым для `api.Relation` в Jinja):

```rust
Databricks | Spark | Fabric | DuckDB | Exasol | Postgres | Redshift | Bigquery => {
    let relation_type = RelationStatic { adapter_type, quoting };
    StaticBaseRelationObject::new(Arc::new(relation_type))
}
```

#### Анализ каталога

**Файл:** `src/metadata/get_relation.rs`

Добавьте ветвь match и функцию, которая запрашивает системный каталог вашего хранилища для поиска одного объекта БД по имени. Внимательно следуйте эталонным реализациям. Ожидается, что эта часть кодовой базы будет развиваться:

```rust
AdapterType::Exasol => exasol_get_relation(
    adapter, state, ctx, conn, database, schema, identifier, token,
),
```

```rust
fn exasol_get_relation(
    adapter: &AdapterImpl,
    state: &State,
    ctx: &QueryCtx,
    conn: &mut dyn Connection,
    database: &str,
    schema: &str,
    identifier: &str,
    token: CancellationToken,
) -> AdapterResult<Option<Box<dyn BaseRelation>>> {
    let q_schema = schema.to_uppercase();
    let q_ident = identifier.to_uppercase();

    let sql = format!(
        "select 'table' as \"type\" from sys.exa_all_tables \
         where table_schema = '{q_schema}' and table_name = '{q_ident}' \
         union all \
         select 'view' from sys.exa_all_views \
         where view_schema = '{q_schema}' and view_name = '{q_ident}'"
    );
    // execute, read result, return relation
}
```

Используйте `information_schema`, если ваше хранилище поддерживает стандартный SQL, или подходящие таблицы системного каталога (`sys.*`, `information_schema.*`).

#### Ветви match адаптера

**Файл:** `src/adapter/adapter_impl.rs`

После добавления `AdapterType::MyWarehouse` компилятор перечислит все блоки `match self.adapter_type()`, которым нужна новая ветвь. Большинство ветвей просто используют существующий паттерн. Например:

```rust
// Column builder: delegate to postgres-like builder
Exasol => Ok(Self::build_postgres_like(field, type_ops)),

// Schema column name for listing relations
Exasol => "name",

// DATA_TYPE column name in information schema
AdapterType::Exasol => "DATA_TYPE",  // in src/sql_types.rs
```

Для возможностей, которые ваш адаптер пока не поддерживает (например, `valid_incremental_strategies`), используйте `unimplemented!()`. Для первоначальной реализации адаптера сообщества это допустимо.

#### Построитель столбцов

**Файл:** `src/column/column_builder.rs`

Добавьте ветвь match, определяющую, как пакеты записей Arrow вашего хранилища преобразуются в объекты столбцов dbt. Большинство адаптеров могут делегировать эту работу `build_postgres_like`:

```rust
Exasol => Ok(Self::build_postgres_like(field, type_ops)),
```

Реализуйте собственную логику только в том случае, если у вашего хранилища есть необычные особенности обработки типов.

### 5.6: Написание SQL-макросов

**Крейт:** `crates/dbt-loader/`

Создайте новый каталог по пути `src/dbt_macro_assets/dbt-<adapter_type>/`.

:::note Регистрация выполняется автоматически
Загрузчик обнаруживает пакеты адаптеров, сканируя `src/dbt_macro_assets/`. Для регистрации каталога не нужно добавлять код на Rust. Достаточно создать его и файл `dbt_project.yml`.
:::

| Файл | Что нужно сделать |
|------|------------|
| `dbt_macro_assets/dbt-<warehouse>/dbt_project.yml` | Определение проекта плагина адаптера: `name: dbt_<warehouse>`, `macro-paths: ["macros"]` |
| `macros/adapters.sql` | Макросы адаптера <Constant name="core" />: `create_schema`, `drop_schema`, `drop_relation`, `rename_relation`, `truncate_relation`, `create_table_as`, `create_view_as`, `list_schemas`, `check_schema_exists`, `information_schema_name`, `current_timestamp`, `get_columns_in_relation`, `list_relations_without_caching` |

В v2 используется тот же паттерн `adapter.dispatch()`, что и в v1. Ваши макросы используют префикс `<warehouse>__` для переопределения реализаций по умолчанию:

```sql
{% macro exasol__create_table_as(temporary, relation, sql) -%}
  create or replace table {{ relation }} as (
    {{ sql }}
  )
{%- endmacro %}

{% macro exasol__create_view_as(relation, sql) -%}
  create or replace view {{ relation }} as (
    {{ sql }}
  )
{%- endmacro %}

{% macro exasol__drop_relation(relation) -%}
  {% call statement('drop_relation', auto_begin=False) -%}
    drop {{ relation.type }} if exists {{ relation }} cascade
  {%- endcall %}
{% endmacro %}

{% macro exasol__rename_relation(from_relation, to_relation) -%}
  {% call statement('rename_relation') -%}
    rename {{ from_relation.type }} {{ from_relation }} to {{ to_relation.identifier }}
  {%- endcall %}
{% endmacro %}
```

Примечание: `rename_relation` использует только `to_relation.identifier`, а не полное имя объекта БД. Синтаксис `RENAME` в Exasol не принимает полное имя целевого объекта.

Для анализа каталога используйте системный каталог вашего хранилища. Например, Exasol запрашивает `sys.*` вместо `information_schema`:

```sql
{% macro exasol__list_relations_without_caching(schema_relation) -%}
  {% call statement('list_relations_without_caching', fetch_result=True) -%}
    select
      '{{ schema_relation.database }}' as "database",
      table_name as "name",
      table_schema as "schema",
      'table' as "type"
    from sys.exa_all_tables
    where upper(table_schema) = upper('{{ schema_relation.schema }}')
    union all
    select
      '{{ schema_relation.database }}' as "database",
      view_name as "name",
      view_schema as "schema",
      'view' as "type"
    from sys.exa_all_views
    where upper(view_schema) = upper('{{ schema_relation.schema }}')
  {%- endcall %}
  {{ return(load_result('list_relations_without_caching').table) }}
{%- endmacro %}

{% macro exasol__information_schema_name(database) -%}
  sys
{%- endmacro %}
```

Если ваше хранилище похоже на уже поддерживаемое (например, совместимо с Postgres), начните с делегирования макросам этого диалекта и переопределяйте только те места, где поведение отличается:

```sql
{% macro mywarehouse__create_table_as(temporary, relation, sql) -%}
  {{ return(postgres__create_table_as(temporary, relation, sql)) }}
{%- endmacro %}
```


## Шаг 6: Тестирование адаптера

### Проверка типов после работы с каждым крейтом

Запускайте проверку типов после завершения работы с каждым крейтом, чтобы сразу обнаруживать пропущенные ветви match и ошибки типов:

```shell
cargo build -p dbt-adapter-core
cargo build -p dbt-xdbc
cargo build -p dbt-schemas
cargo build -p dbt-auth
cargo build -p dbt-adapter
cargo build -p dbt-loader
```

### Базовая проверка с проектом dbt

Выполните настоящий `dbt build` для вашего хранилища и убедитесь, что сборка проходит без ошибок. Как минимум проверьте материализации table, view, incremental и seed. Успешный `dbt build` проекта [jaffle-shop](https://github.com/dbt-labs/jaffle-shop) — один из примеров критерия приёмки адаптера сообщества.

```shell
# Build the CLI
cargo build --bin dbt

# Create a test project (or clone jaffle-shop)
./target/debug/dbt init

# Run against your warehouse
./target/debug/dbt build --project-dir <your-project>
```

### Тестирование в CI

Тестирование PR с адаптерами сообщества в CI согласовывается с командой адаптеров dbt Labs: тестовая инфраструктура не распространяется публично. Когда ваш PR будет готов, напишите в `#adapter-ecosystem` в [dbt Community Slack](https://community.getdbt.com/), отметьте Хоуп Уотсон (`@Hope Watson (dbt Labs)`), и команда адаптеров поможет вам с проверкой работы хранилища. Учтите, что это может потребовать времени и согласования.

:::caution Известное ограничение: CI требует согласования
Участники сообщества не могут самостоятельно запускать CI. Конвейер CI dbt Labs требует определённых проверок. Для некоторых адаптеров это означает необходимость предоставить учётные данные хранилища. dbt Labs пока определяет процесс такого взаимодействия для <Constant name="core_v2" />. Будьте готовы к тесному взаимодействию с командой адаптеров, к тому, что процесс одобрения займёт время, и к нескольким раундам обсуждений. Если возникнут сложности, сообщите о них в `#adapter-ecosystem`.
:::

## Шаг 7: Документирование адаптера

После слияния изменений и выхода адаптера в релизе подготовьте документацию, чтобы пользователи могли найти и настроить его.

### Напишите руководство по настройке

Опишите конфигурацию `profiles.yml` для вашего хранилища: какие поля обязательны, какие необязательны, и приведите примеры значений. Следуйте формату существующих [руководств по настройке адаптеров](/docs/local/connect-data-platform/about-dbt-connections?version=2.0).

:::caution Крайне важно описать установку драйвера
В отличие от адаптеров, распространяемых через CDN, ваши пользователи не получат драйвер автоматически: <Constant name="core_v2" /> не загрузит его за них. Руководство по настройке должно объяснять, где взять бинарный файл драйвера и как установить его, чтобы <Constant name="core_v2" /> мог найти его во время выполнения. Без этого пользователи настроят корректный профиль, но всё равно получат ошибку подключения. Укажите точное имя библиотеки, которую ищет <Constant name="core_v2" /> (например, `libadbc_driver_<yourwarehouse>.dylib`), и место, куда её нужно поместить.
:::

### Общие рекомендации по документации

- Предполагайте, что читатель знает основы dbt, но не является экспертом по внутреннему устройству вашего хранилища.
- Приведите полный рабочий пример `profiles.yml`.
- Опишите все особенности хранилища (например, имена из двух или трёх частей и чувствительность идентификаторов к регистру).
- Добавьте ссылку на документацию поставщика хранилища по драйверу ADBC.

## Шаг 8: Продвижение адаптера

:::caution Сначала ваш PR должен быть принят
dbt Labs рассматривает PR с адаптерами сообщества и сливает их в `dbt-labs/dbt`. Прежде чем направлять пользователей к адаптеру, дождитесь слияния PR и выхода адаптера в опубликованном релизе.
:::

### Каналы сообщества

Присоединитесь к [dbt Community Slack](https://community.getdbt.com/) и найдите:
- **`#adapter-ecosystem`**: основной канал для разработчиков адаптеров
- **`#db-<yourwarehouse>`**: если канал для вашего хранилища существует, сообщите пользователям о доступности поддержки v2. Примечание: пользователи адаптера v1 по-прежнему будут использовать адаптер на Python, и им потребуется миграция.

### Перед объявлением

Согласуйте с командой адаптеров, какие материализации вы планируете поддерживать в первоначальной реализации, известные ограничения драйвера ADBC и сроки. Это поможет избежать неожиданностей при рассмотрении изменений и сформировать у пользователей верные ожидания.

## Справочник: руководство по реализации для каждого файла {#reference-file-by-file-implementation-guide}

Адаптер <Constant name="core_v2" />, добавляемый сообществом, затрагивает примерно 13 файлов, и все они находятся в публичном репозитории [dbt-labs/dbt](https://github.com/dbt-labs/dbt). В столбце «Пример Exasol» показано, как это выглядит на практике. Везде подставляйте имя вашего хранилища и его системный каталог.

| Обобщённый путь | Назначение | Пример Exasol |
|--------------|--------------|----------------|
| `.changes/unreleased/Features-*.yaml` | Запись в журнале изменений | Одинаково для всех адаптеров |
| `crates/dbt-adapter-core/src/lib.rs` | Добавление варианта `AdapterType::<Warehouse>` и ветви `quote_char` | `AdapterType::Exasol` |
| `crates/dbt-xdbc/src/driver.rs` | Добавление варианта `Backend::<Warehouse>`: имя библиотеки ADBC и протокол FFI | `Backend::Exasol`, имя библиотеки `"adbc_driver_exasol"` |
| `crates/dbt-schemas/src/schemas/profiles.rs` | Структура `<Warehouse>DbConfig` и вариант `DbConfig::<Warehouse>`, подключённый ко всем ветвям match конфигурации | Структура `ExasolDbConfig` и вариант `DbConfig::Exasol` |
| `crates/dbt-auth/src/<warehouse>/mod.rs` | Модуль аутентификации: чтение полей конфигурации, получение учётных данных, формирование URI подключения | `src/exasol/mod.rs`, формирует URI из хоста, порта, имени пользователя/пароля и параметров TLS |
| `crates/dbt-adapter/src/adapter/adapter_impl.rs` | Все ветви исчерпывающих выражений `match adapter_type()`; большинство используют существующие паттерны; для пока не поддерживаемых функций используется `unimplemented!()` | Exasol добавляет около 10 ветвей, большинство — по 1–2 строки |
| `crates/dbt-adapter/src/column/column_builder.rs` | Ветвь match построителя столбцов: преобразование пакетов записей Arrow в объекты столбцов dbt | `Exasol => Ok(Self::build_postgres_like(...))` |
| `crates/dbt-adapter/src/metadata/get_relation.rs` | Функция поиска в каталоге: запрос системных таблиц для поиска объекта БД по имени | `exasol_get_relation()`, запрашивает `sys.exa_all_tables` / `sys.exa_all_views` |
| `crates/dbt-adapter/src/relation/relation_impl.rs` | Добавление адаптера в match функции `include_policy()`: определяет, включается ли префикс базы данных и заключаются ли части имени в кавычки | `Policy::new(false, true, true)`: база данных исключена, схема и идентификатор заключены в кавычки. Значение по умолчанию `Policy::trues()` включает все три части и заключает их в кавычки. |
| `crates/dbt-adapter/src/relation/factory.rs` | Добавление хранилища в ветвь `RelationStatic` в `create_static_relation` | Exasol добавлен вместе с Postgres, Redshift, DuckDB и другими. |
| `crates/dbt-adapter/src/sql_types.rs` | Ветви для имён столбцов метаданных: `DATA_TYPE` и имена столбцов для получения списка схем | Exasol использует стандартное имя столбца `DATA_TYPE` |
| `crates/dbt-loader/src/dbt_macro_assets/dbt-<warehouse>/dbt_project.yml` | Определение проекта плагина макросов | `dbt-exasol/dbt_project.yml` |
| `crates/dbt-loader/src/dbt_macro_assets/dbt-<warehouse>/macros/adapters.sql` | Все обязательные макросы адаптера | `dbt-exasol/macros/adapters.sql`, использует `sys.*` вместо `information_schema` |

## Справочник: полезные команды

```shell
# Type check a specific crate
cargo build -p <crate-name>

# Build the CLI binary
cargo build --bin dbt

# Run a full dbt build against your warehouse
./target/debug/dbt build --project-dir <your-project>

# Free disk space
cargo clean
```

</div>
