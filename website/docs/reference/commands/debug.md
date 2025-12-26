---
title: "О команде dbt debug"
sidebar_label: "debug"
description: "Use dbt debug to test database connections and check system setup."
intro_text: "Use dbt debug to test database connections and check system setup."
---

`dbt debug` — это вспомогательная утилита для проверки подключения к базе данных и отображения информации для отладки, такой как корректность файла проекта, [версия dbt](/reference/dbt-jinja-functions/dbt_version) и наличие всех необходимых зависимостей (например, `git` при выполнении `dbt deps`).

Команда проверяет подключение к базе данных, локальную конфигурацию и системное окружение по нескольким направлениям, помогая выявить потенциальные проблемы до запуска других команд dbt.

По умолчанию `dbt debug` проверяет:
- **Подключение к базе данных** (для настроенных profiles)
- **Настройку dbt‑проекта** (например, валидность `dbt_project.yml`)
- **Системное окружение** (ОС, версия Python, установленная версия dbt)
- **Обязательные зависимости** (например, `git` для `dbt deps`)
- **Детали адаптера** (установленные версии адаптеров и их совместимость)

*Примечание: не путать с [debug‑level logging](/reference/global-configs/logs#debug-level-logging) через опцию `--debug`, которая лишь увеличивает подробность логов.*

## Flags

Большинство флагов `dbt debug` применимы к CLI <Constant name="core" />. Некоторые флаги также работают в <Constant name="cloud_cli" />, но в <Constant name="cloud_ide" /> поддерживается только `--connection`.

- <Constant name="core" /> CLI: поддерживает все флаги.
- <Constant name="cloud_ide" />: поддерживает только `dbt debug` и `dbt debug --connection`.
- <Constant name="cloud_cli" />: поддерживает только `dbt debug` и `dbt debug --connection`. Также можно использовать команду [`dbt environment`](/reference/commands/dbt-environment) для взаимодействия с окружением <Constant name="cloud" />.

При использовании интерфейса командной строки (CLI) `dbt debug` поддерживает следующие флаги:

```text
Usage: dbt debug [OPTIONS]

 Show information on the current dbt environment and check dependencies, then
 test the database connection. Not to be confused with the --debug option
 which increases verbosity.

Options:
 --cache-selected-only / --no-cache-selected-only
                В начале выполнения заполнять реляционный кэш
                только для схем, содержащих выбранные узлы,
                либо для всех интересующих схем.

 -d, --debug / --no-debug    
                Отображать debug‑логи во время выполнения dbt.
                Полезно для отладки и создания bug‑репортов.

 --defer / --no-defer      
                Если задано, разрешать невыбранные узлы,
                откладывая их к manifest в директории --state.

 --defer-state DIRECTORY     
                Переопределить директорию состояния для
                deferral.

 --deprecated-favor-state TEXT  
                Внутренний флаг для вывода из эксплуатации
                старой переменной окружения.

 -x, --fail-fast / --no-fail-fast
                 Останавливать выполнение при первой ошибке.

 --favor-state / --no-favor-state
                Если задано, использовать аргумент флага
                state для разрешения невыбранных узлов,
                даже если узел уже существует как объект
                базы данных в текущем окружении.

 --indirect-selection [eager|cautious|buildable|empty]
                Выбор того, какие тесты выбирать рядом с
                выбранными ресурсами. eager — самый
                инклюзивный, cautious — самый строгий,
                buildable — промежуточный вариант. empty
                не включает тесты вовсе.

 --log-cache-events / --no-log-cache-events
                Включить подробное логирование событий
                реляционного кэша для отладки.

 --log-format [text|debug|json|default]
                Задать формат логов в консоли и файле логов.
                Используйте --log-format-file, чтобы задать
                формат файла логов отдельно от консоли.

 --log-format-file [text|debug|json|default]
                Задать формат логов в файле логов, переопределяя
                значение по умолчанию и общий --log-format.

 --log-level [debug|info|warn|error|none]
                Задать минимальный уровень важности событий,
                логируемых в консоль и файл логов. Используйте
                --log-level-file, чтобы задать уровень отдельно
                для файла логов.

 --log-level-file [debug|info|warn|error|none]
                Задать минимальный уровень важности событий,
                логируемых в файл логов, переопределяя значение
                по умолчанию и общий --log-level.

 --log-path PATH         
                Настроить 'log-path'. Применяется только для
                текущего запуска. Переопределяет 'DBT_LOG_PATH',
                если он задан.

 --partial-parse / --no-partial-parse
                Разрешить частичный парсинг с использованием
                pickle‑файла в директории target. Переопределяет
                пользовательский конфигурационный файл.

 --populate-cache / --no-populate-cache
                В начале выполнения использовать запросы `show`
                или `information_schema` для заполнения
                реляционного кэша, что может ускорить последующие
                материализации.

 --print / --no-print      
                Выводить все вызовы макроса {{ print() }}.

 --printer-width INTEGER     
                Задать ширину вывода в терминале.

 --profile TEXT         
                Какой существующий profile загружать.
                Переопределяет настройку в dbt_project.yml.

 -q, --quiet / --no-quiet    
                Подавлять все логи, кроме ошибок, в stdout.
                Не влияет на вызовы макроса {{ print() }}.

 -r, --record-timing-info PATH  
                При указании этой опции dbt будет выводить
                низкоуровневую статистику времени выполнения
                в указанный файл. Пример:
                `--record-timing-info output.profile`

 --send-anonymous-usage-stats / --no-send-anonymous-usage-stats
                Отправлять анонимную статистику использования
                в dbt Labs.

 --state DIRECTORY        
                Если не переопределено, использовать эту
                директорию состояния как для сравнения
                состояний, так и для deferral.

 --static-parser / --no-static-parser
                Использовать статический парсер.

 -t, --target TEXT        
                Какой target загружать для данного profile.

 --use-colors / --no-use-colors 
                Указать, использовать ли цветной вывод логов
                в консоли и файле логов. Используйте
                --use-colors-file/--no-use-colors-file, чтобы
                настроить файл логов отдельно.

 --use-colors-file / --no-use-colors-file
                Указать, использовать ли цветной вывод в файле
                логов, переопределяя значение по умолчанию и
                общий --use-colors/--no-use-colors.

 --use-experimental-parser / --no-use-experimental-parser
                Включить экспериментальные возможности парсинга.

 -V, -v, --version        
                Показать информацию о версии и выйти.

 --version-check / --no-version-check
                Если задано, проверять, что установленная версия
                dbt соответствует require-dbt-version из файла
                dbt_project.yml (если указано). В противном
                случае разрешать расхождения.

 --warn-error   
                Если dbt обычно выводит предупреждение, вместо
                этого выбрасывать исключение. Примеры:
                --select, который ничего не выбирает,
                deprecations, конфигурации без связанных
                моделей, некорректные конфигурации тестов,
                отсутствующие sources/refs в тестах.

 --warn-error-options WARNERROROPTIONSTYPE
                Если dbt обычно выводит предупреждение,
                выбрасывать исключение на основе конфигурации
                include/exclude. Аргумент должен быть YAML‑строкой
                с ключами 'include' или 'exclude', например:
                '{"include": "all",
                "exclude": ["NoNodesForSelectionCriteria"]}'

 --write-json / --no-write-json 
                Записывать ли файлы manifest.json и
                run_results.json в директорию target.

 --connection          
                Проверить подключение к целевой базе данных
                независимо от проверки зависимостей.
                Доступно в Studio IDE и dbt Core CLI.

 --config-dir          
                Вывести системно‑зависимую команду для доступа
                к директории, в которой текущий dbt‑проект ищет
                файл profiles.yml, и завершить работу. При
                использовании этого флага остальные шаги debug
                не выполняются.

 --profiles-dir PATH       
                Директория, в которой искать файл profiles.yml.
                Если не задано, dbt сначала ищет в текущей
                рабочей директории, затем в HOME/.dbt/.

 --project-dir PATH       
                Директория, в которой искать файл
                dbt_project.yml. По умолчанию — текущая рабочая
                директория и её родительские директории.

 --vars YAML           
                Передать переменные в проект. Этот аргумент
                переопределяет переменные, определённые в
                dbt_project.yml. Аргумент должен быть YAML‑строкой,
                например: '{my_variable: my_value}'

 -h, --help           
                Показать это сообщение и выйти.
```

Тестировать только подключение к платформе данных и пропустить другие проверки, которые выполняет `dbt debug`:

```shell
dbt debug --connection
```

Показать настроенное местоположение файла `profiles.yml` и выйти:

```text
dbt debug --config-dir
Чтобы просмотреть файл `profiles.yml`, выполните команду:

open /Users/alice/.dbt
```

Проверьте соединение в <Constant name="cloud_ide" />:

```text
dbt debug --connection
```

<Lightbox src="/img/reference/dbt-debug-ide.png" title="Проверка соединения в IDE Studio" />
