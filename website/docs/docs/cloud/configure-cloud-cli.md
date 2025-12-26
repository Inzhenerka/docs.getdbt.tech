---
title: Configure and use the dbt CLI
id: configure-cloud-cli
description: "Instructions on how to configure the dbt CLI"
sidebar_label: "Configuration and usage"
pagination_next: null
---

Узнайте, как настроить <Constant name="cloud_cli" /> для вашего проекта <Constant name="cloud" />, чтобы запускать команды dbt, такие как `dbt environment show` для просмотра конфигурации <Constant name="cloud" /> или `dbt compile` для компиляции проекта и проверки моделей и тестов. Вы также получите следующие преимущества:

- Безопасное хранение учетных данных на платформе <Constant name="cloud" />.
- [Автоматическое использование defer](/docs/cloud/about-cloud-develop-defer) для артефактов сборки из production-окружения вашего Cloud‑проекта.
- Более быстрые и экономичные сборки.
- Поддержка <Constant name="mesh" /> ([cross-project ref](/docs/mesh/govern/project-dependencies)) и многое другое.

## Предварительные условия

- Вам необходимо настроить проект в <Constant name="cloud" />.
  - **Примечание** &mdash; Если вы используете <Constant name="cloud_cli" />, вы можете подключиться к вашей [платформе данных](/docs/cloud/connect-data-platform/about-connections) напрямую в интерфейсе <Constant name="cloud" /> и вам не потребуется файл [`profiles.yml`](/docs/core/connect-data-platform/profiles.yml).
- Для этого проекта у вас должны быть настроены ваши [учётные данные для персональной разработки](/docs/dbt-cloud-environments#set-developer-credentials). CLI <Constant name="cloud" /> будет использовать эти учётные данные, безопасно хранящиеся в <Constant name="cloud" />, для взаимодействия с вашей платформой данных.
- Вы должны использовать dbt версии 1.5 или выше. Инструкции по обновлению см. в разделе [версии <Constant name="cloud" />](/docs/dbt-versions/upgrade-dbt-version-in-cloud).

## Настройка dbt CLI

После установки <Constant name="cloud_cli" /> необходимо настроить его для подключения к проекту в <Constant name="cloud" />.

1. В <Constant name="cloud" /> выберите проект, для которого вы хотите настроить <Constant name="cloud_cli" />. В проекте уже должна быть настроена [среда разработки](/docs/dbt-cloud-environments#create-a-development-environment).
2. В главном меню перейдите в раздел **CLI**.
3. В разделе **Configure Cloud authentication** нажмите **Download CLI configuration file**, чтобы скачать файл учётных данных `dbt_cloud.yml`.

    <details>
    <summary>URL-адреса регионов для загрузки учётных данных</summary>

    Вы также можете скачать учётные данные по ссылкам, соответствующим вашему региону:

    - Северная Америка: <a href="https://cloud.getdbt.com/cloud-cli">https://cloud.getdbt.com/cloud-cli</a>
    - EMEA: <a herf="https://emea.dbt.com/cloud-cli">https://emea.dbt.com/cloud-cli</a>
    - APAC: <a href="https://au.dbt.com/cloud-cli">https://au.dbt.com/cloud-cli</a>
    - Североамериканская ячейка 1: <code>https:/ACCOUNT_PREFIX.us1.dbt.com/cloud-cli</code>
    - Однопользовательский: <code>https://YOUR_ACCESS_URL/cloud-cli</code>

    </details>

4. Сохраните файл `dbt_cloud.yml` в директории `.dbt`, в которой хранится конфигурация <Constant name="cloud_cli" />.

    - Mac или Linux: `~/.dbt/dbt_cloud.yml`
    - Windows: `C:\Users\yourusername\.dbt\dbt_cloud.yml`  

    Файл конфигурации выглядит следующим образом:
  
    ```yaml
    version: "1"
    context:
      active-project: "<project id from the list below>"
      active-host: "<active host from the list>"
      defer-env-id: "<optional defer environment id>"
    projects:
      - project-name: "<project-name>"
        project-id: "<project-id>"
        account-name: "<account-name>"
        account-id: "<account-id>"
        account-host: "<account-host>" # for example, "cloud.getdbt.com"
        token-name: "<pat-name>"
        token-value: "<pat-value>"
    
      - project-name: "<project-name>"
        project-id: "<project-id>"
        account-name: "<account-name>"
        account-id: "<account-id>"
        account-host: "<account-host>" # for example, "cloud.getdbt.com"
        token-name: "<pat-name>"
        token-value: "<pat-value>"  
    ```

    Храните файл конфигурации в безопасном месте, так как он содержит API‑ключи. Ознакомьтесь с разделом [FAQs](#faqs), чтобы узнать, как создать директорию `.dbt` и переместить файл `dbt_cloud.yml`. Если у вас есть несколько копий файла и его имя содержит числовое дополнение (например, `dbt_cloud(2).yml`), удалите лишний текст из имени файла. 

5. После загрузки файла конфигурации и создания директории перейдите к проекту в терминале:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

6. В файле `dbt_project.yml` убедитесь, что у вас есть (или добавлен) раздел `dbt-cloud` с полем `project-id`. Поле `project-id` содержит идентификатор проекта <Constant name="cloud" />, который вы хотите использовать.

    ```yaml
    # dbt_project.yml
    name:
    version:
    # Ваши конфигурации проекта...

    dbt-cloud: 
        project-id: PROJECT_ID
    ```

- Чтобы найти идентификатор проекта, выберите **Develop** в навигационном меню <Constant name="cloud" />. Вы можете использовать URL, чтобы определить идентификатор проекта. Например, в `https://YOUR_ACCESS_URL/develop/26228/projects/123456` идентификатор проекта — `123456`.

7. Теперь вы должны иметь возможность [использовать <Constant name="cloud_cli" />](#use-the-dbt-cloud-cli) и запускать [команды dbt](/reference/dbt-commands), такие как [`dbt environment show`](/reference/commands/dbt-environment), чтобы просмотреть сведения о конфигурации вашего <Constant name="cloud" />, или `dbt compile`, чтобы скомпилировать модели в вашем dbt‑проекте.

С вашим репозиторием, клонированным заново, вы можете добавлять, редактировать и синхронизировать файлы с вашим репозиторием.

## Установка переменных окружения

Чтобы задать переменные окружения в CLI <Constant name="cloud" /> для вашего dbt‑проекта:

1. В <Constant name="cloud" /> нажмите на имя своей учетной записи в меню слева и выберите **Account settings**.
2. В разделе **Your profile** выберите **Credentials**.
3. Нажмите на свой проект и прокрутите страницу до раздела **Environment variables**.
4. Нажмите **Edit** в правом нижнем углу и задайте пользовательские переменные окружения.

## Использование dbt CLI

<Constant name="cloud_cli" /> использует тот же набор [dbt commands](/reference/dbt-commands) и [MetricFlow commands](/docs/build/metricflow-commands), что и dbt Core, для выполнения переданных вами команд. Например, вы можете использовать команду [`dbt environment`](/reference/commands/dbt-environment), чтобы просмотреть детали конфигурации вашего <Constant name="cloud" />. С помощью <Constant name="cloud_cli" /> вы можете:

- Запускать [несколько вызовов параллельно](/reference/dbt-commands) и обеспечивать [безопасный параллелизм](/reference/dbt-commands#parallel-execution), который в настоящее время не гарантируется в `dbt-core`.
- Автоматически откладывать (defer) артефакты сборки в production‑окружение вашего Cloud‑проекта.
- Использовать [project dependencies](/docs/mesh/govern/project-dependencies), которые позволяют зависеть от другого проекта через сервис метаданных в <Constant name="cloud" />.  
  - Зависимости между проектами мгновенно подключаются и ссылаются (через `ref`) на публичные модели, определенные в других проектах. Вам не нужно самостоятельно выполнять или анализировать эти upstream‑модели — вместо этого вы используете их как API, возвращающее набор данных.
 
:::tip Используйте флаг <code>--help</code>
Как совет, большинство инструментов командной строки имеют флаг `--help`, чтобы показать доступные команды и аргументы. Используйте флаг `--help` с dbt двумя способами:
- `dbt --help`: Показывает доступные команды для dbt<br />
- `dbt run --help`: Показывает доступные флаги для команды `run`
:::
 
## Проверка SQL-файлов (linting)

Из CLI <Constant name="cloud" /> вы можете вызвать [SQLFluff](https://sqlfluff.com/) — модульный и настраиваемый SQL-линтер, который предупреждает о сложных функциях, проблемах с синтаксисом, форматированием и ошибках компиляции. Многие из тех же флагов, которые можно передать в SQLFluff напрямую, также доступны при использовании CLI <Constant name="cloud" />.

Доступные команды SQLFluff:

- `lint` &mdash; Линтинг SQL файлов, передавая список файлов или из стандартного ввода (stdin).
- `fix` &mdash; Исправление SQL файлов.
- `format` &mdash; Автоформатирование SQL файлов.

Чтобы выполнить линтинг SQL файлов, выполните команду следующим образом:  

```
dbt sqlfluff lint [PATHS]... [flags]
```

Если путь не указан, dbt выполняет линтинг всех SQL файлов в текущем проекте. Чтобы выполнить линтинг конкретного SQL файла или директории, укажите `PATHS` как путь к SQL файлу(ам) или директории файлов. Чтобы выполнить линтинг нескольких файлов или директорий, передайте несколько флагов `PATHS`.  

Чтобы показать подробную информацию о всех поддерживаемых dbt командах и флагах, выполните команду `dbt sqlfluff -h`. 

#### Соображения

При запуске `dbt sqlfluff` из <Constant name="cloud_cli" /> важно учитывать следующие особенности поведения:

- dbt читает файл `.sqlfluff`, если он существует, для любых пользовательских конфигураций, которые у вас могут быть.
- Для рабочих процессов непрерывной интеграции/непрерывной разработки (CI/CD) ваш проект должен иметь файл `dbt_cloud.yml`, и вы успешно выполнили команды из этого проекта dbt.
- Команда SQLFluff вернет код выхода 0, если она выполнена с любыми нарушениями в файлах. Это поведение dbt отличается от поведения SQLFluff, где нарушение линтинга возвращает ненулевой код выхода. dbt Labs планирует решить эту проблему в следующем выпуске.

## Важные моменты

import CloudCliRelativePath from '/snippets/_cloud-cli-relative-path.md';

<CloudCliRelativePath />

## Часто задаваемые вопросы (FAQ)

import DbtDirectoryFaq from '/snippets/_dbt-directory-faq.md';

<DetailsToggle alt_header="Как создать директорию .dbt и переместить ваш файл">

<DbtDirectoryFaq />

</DetailsToggle>

<DetailsToggle alt_header="Как пропустить загрузку артефактов">

По умолчанию [все артефакты](/reference/artifacts/dbt-artifacts) загружаются при выполнении команд dbt из <Constant name="cloud_cli" />. Чтобы пропустить загрузку этих файлов, добавьте `--download-artifacts=false` к команде, которую вы запускаете. Это может помочь улучшить производительность выполнения, но может нарушить рабочие процессы, которые зависят от таких артефактов, как [manifest](/reference/artifacts/manifest-json).

</DetailsToggle>

<FAQ path="Troubleshooting/long-sessions-cloud-cli" />
