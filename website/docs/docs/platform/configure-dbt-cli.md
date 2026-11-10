---
title: Настройка и использование dbt platform CLI
id: configure-dbt-cli
description: "Инструкции по настройке dbt platform CLI"
sidebar_label: "Настройка и использование"
pagination_next: null
availability:
  surface: platform
  access: login_required
---

import LongSession from '/snippets/_long-sessions-cli.md';

Узнайте, как настроить <Constant name="platform_cli" /> для вашего проекта <Constant name="dbt" />, чтобы выполнять команды dbt, например `dbt environment show` для просмотра конфигурации <Constant name="dbt" /> или `dbt compile` для компиляции проекта и проверки моделей и тестов. Вы также получите следующие преимущества:

- Безопасное хранение учетных данных в <Constant name="dbt_platform" />.
- [Автоматическое перенаправление ссылок](/docs/platform/about-defer) с использованием артефактов сборки из производственной среды вашего проекта.
- Более быстрые сборки с меньшими затратами.
- Поддержка <Constant name="mesh" /> ([межпроектные ссылки ref](/docs/mesh/govern/project-dependencies)) и другие возможности.

## Предварительные требования

- Необходимо настроить проект в <Constant name="dbt" />.
  - **Примечание** &mdash; Если вы используете <Constant name="platform_cli" />, вы можете подключиться к своей [платформе данных](/docs/platform/connect-data-platform/about-connections) непосредственно в интерфейсе <Constant name="dbt_platform" />; файл [`profiles.yml`](/docs/local/profiles.yml) при этом не требуется. 
- В разделе **Account settings** необходимо настроить [личные учетные данные пользователя](/docs/dbt-platform-environments#set-developer-credentials) для этого проекта. <Constant name="platform_cli" /> будет использовать эти учетные данные, безопасно хранящиеся в <Constant name="dbt" />, для взаимодействия с вашей платформой данных.
- Необходимо использовать dbt версии 1.5 или выше. Инструкции по обновлению см. в разделе [Версии <Constant name="dbt" />](/docs/dbt-versions/upgrade-dbt-platform-version).

## Настройка dbt platform CLI {#configure-the-dbt-platform-cli}

После установки <Constant name="platform_cli" /> необходимо настроить его для подключения к проекту <Constant name="dbt" />.

1. В <Constant name="dbt" /> выберите проект, для которого вы хотите настроить <Constant name="platform_cli" />. В проекте уже должна быть настроена [среда разработки](/docs/dbt-platform-environments#create-a-development-environment).
2. Скачайте файл учетных данных `dbt_cloud.yml` и сохраните его в каталоге `.dbt` (`~/.dbt/dbt_cloud.yml` в macOS/Linux, `C:\Users\yourusername\.dbt\dbt_cloud.yml` в Windows). Инструкции по скачиванию, полную структуру файла и справочник полей см. в разделе [`dbt_cloud.yml`](/reference/dbt_cloud.yml).

3. После скачивания файла конфигурации и создания каталога перейдите в каталог проекта в терминале:

    ```bash
    cd ~/dbt-projects/jaffle_shop
    ```

4. Убедитесь, что в файле `dbt_project.yml` есть [блок `dbt-cloud`](/reference/dbt_cloud.yml#the-dbt-cloud-block-in-dbt_projectyml) с полем `project-id`, указывающим на ваш проект <Constant name="dbt" />, или добавьте его.

    ```yaml
    # dbt_project.yml
    dbt-cloud:
        project-id: PROJECT_ID
    ```

5. Теперь вы можете [использовать <Constant name="platform_cli"/>](#use-the-dbt-cli) и выполнять [команды dbt](/reference/dbt-commands), например [`dbt environment show`](/reference/commands/dbt-environment?version=2.0) для просмотра подробной информации о конфигурации <Constant name="dbt" /> или `dbt compile` для компиляции моделей в вашем проекте dbt.

После повторного клонирования репозитория вы можете добавлять и редактировать файлы, а также синхронизировать их с репозиторием.

## Настройка переменных окружения

Чтобы настроить переменные окружения в <Constant name="platform_cli" /> для вашего проекта dbt:

1. В <Constant name="dbt" /> нажмите на имя своей учетной записи в левом боковом меню и выберите **Account settings**.
2. В разделе **Your profile** выберите **Credentials**.
3. Нажмите на свой проект и прокрутите страницу до раздела **Environment variables**.
4. Нажмите **Edit** в правом нижнем углу, затем задайте переменные окружения на уровне пользователя.  

## Использование dbt platform CLI {#use-the-dbt-cli}

<Constant name="platform_cli" /> использует тот же набор [команд dbt](/reference/dbt-commands) и [команд MetricFlow](/docs/build/metricflow-commands), что и <Constant name="core" />, для выполнения указанных вами команд. Например, используйте команду [`dbt environment`](/reference/commands/dbt-environment?version=2.0), чтобы просмотреть подробную информацию о конфигурации <Constant name="dbt" />. С помощью <Constant name="platform_cli" /> вы можете:

- Выполнять [несколько вызовов параллельно](/reference/dbt-commands), обеспечивая [безопасное параллельное выполнение](/reference/dbt-commands#parallel-execution).
- Автоматически перенаправлять ссылки, используя артефакты сборки из производственной среды вашего проекта.
- Использовать [зависимости между проектами](/docs/mesh/govern/project-dependencies), которые позволяют вашему проекту зависеть от другого проекта с помощью сервиса метаданных в <Constant name="dbt" />. 
  - Зависимости между проектами позволяют сразу подключаться к публичным моделям, определенным в других проектах, и ссылаться на них (с помощью `ref`). Вам не нужно самостоятельно выполнять или анализировать эти вышестоящие модели. Вместо этого вы работаете с ними как с API, возвращающим набор данных.
 
:::tip Используйте флаг <code>--help</code>
Полезный совет: большинство инструментов командной строки поддерживают флаг `--help` для просмотра доступных команд и аргументов. Используйте флаг `--help` с dbt двумя способами:
- `dbt --help`: выводит список доступных команд dbt<br />
- `dbt run --help`: выводит список флагов, доступных для команды `run`
:::
 
## Проверка SQL-файлов линтером {#lint-sql-files}

Из <Constant name="platform_cli" /> можно вызывать [SQLFluff](https://sqlfluff.com/) — модульный настраиваемый SQL-линтер, который предупреждает о сложных функциях, ошибках синтаксиса, форматирования и компиляции. Многие флаги, которые можно передавать SQLFluff, также доступны в <Constant name="platform_cli" />.

Доступны следующие команды SQLFluff: 

- `lint` &mdash; Проверяет SQL-файлы линтером, принимая список файлов или данные из стандартного ввода (stdin).
- `fix` &mdash; Исправляет SQL-файлы.
- `format` &mdash; Автоматически форматирует SQL-файлы.


Чтобы проверить SQL-файлы линтером, выполните следующую команду:  

```
dbt sqlfluff lint [PATHS]... [flags]
```

Если путь не указан, dbt проверяет все SQL-файлы в текущем проекте. Чтобы проверить определенный SQL-файл или каталог, укажите в `PATHS` путь к SQL-файлу (или файлам) либо к каталогу с файлами. Чтобы проверить несколько файлов или каталогов, передайте несколько значений `PATHS`.  

Чтобы просмотреть подробную информацию обо всех командах и флагах, поддерживаемых dbt, выполните команду `dbt sqlfluff -h`. 

#### Особенности использования

При выполнении `dbt sqlfluff` из <Constant name="platform_cli" /> важно учитывать следующие особенности поведения:

- dbt считывает пользовательские настройки из файла `.sqlfluff`, если он существует.
- Для рабочих процессов непрерывной интеграции и непрерывной разработки (CI/CD) в проекте должен быть файл `dbt_cloud.yml`, а команды из каталога этого проекта dbt должны быть успешно выполнены хотя бы один раз.
- Команда SQLFluff возвращает код завершения 0, даже если при ее выполнении обнаружены нарушения в файлах. Это поведение dbt отличается от поведения SQLFluff, где нарушение, обнаруженное линтером, приводит к ненулевому коду завершения. dbt Labs планирует исправить это в одном из будущих выпусков.

## Особенности использования {#considerations-1}

import CloudCliRelativePath from '/snippets/_cloud-cli-relative-path.md';

<CloudCliRelativePath />

## Часто задаваемые вопросы

import DbtDirectoryFaq from '/snippets/_dbt-directory-faq.md';

<DetailsToggle alt_header="Как создать каталог .dbt и переместить в него файл">

<DbtDirectoryFaq />

</DetailsToggle>

<DetailsToggle alt_header="Как отключить скачивание артефактов">

По умолчанию <Constant name="platform_cli" /> скачивает [все артефакты](/reference/artifacts/dbt-artifacts) при выполнении команд dbt. Чтобы отключить скачивание этих файлов, добавьте `--download-artifacts=false` к команде, которую хотите выполнить. Это может ускорить выполнение, но способно нарушить рабочие процессы, зависящие от таких ресурсов, как [manifest](/reference/artifacts/manifest-json). 

</DetailsToggle>

<DetailsToggle alt_header="Что делать при ошибке `Session occupied` в dbt platform CLI?">

<LongSession />

</DetailsToggle>
