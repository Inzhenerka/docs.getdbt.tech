## Типы окружений {#types-of-environments}

В <Constant name="cloud" /> есть два типа окружений:
- **Окружение развертывания (Deployment environment)** &mdash; определяет настройки, используемые при выполнении джобов, созданных в этом окружении.<br></br>
    Типы окружений развертывания:
    - General
    - Staging
    - Production
- **Окружение разработки (Development environment)** &mdash; определяет настройки, используемые в <Constant name="cloud_ide" /> или <Constant name="cloud_cli" /> для конкретного проекта.

В каждом проекте <Constant name="cloud" /> может быть только одно окружение разработки, но может быть любое количество окружений развертывания типа General, одно окружение развертывания Production и одно окружение развертывания Staging.

|          | Development | General | Production | Staging |
|----------|-------------|---------|------------|---------|
| **Определяет настройки для** | <Constant name="cloud_ide" /> или <Constant name="cloud_cli" /> | Запуски джобов <Constant name="cloud" /> | Запуски джобов <Constant name="cloud" /> | Запуски джобов <Constant name="cloud" /> |
| **Сколько может быть в проекте?** | 1 | Любое количество | 1 | 1 |

:::note 
Для пользователей, знакомых с разработкой на <Constant name="core" />, каждое окружение примерно аналогично записи в файле `profiles.yml`, но с дополнительной информацией о вашем репозитории, чтобы гарантировать выполнение нужной версии кода. Подробнее об окружениях dbt core — [здесь](/docs/core/dbt-core-environments).
:::

## Общие настройки окружения {#common-environment-settings}

И окружения разработки, и окружения развертывания имеют раздел **General Settings**, в котором есть базовые настройки, которые определяются для всех окружений:

| Настройка | Пример значения | Определение | Допустимые значения |
| --- | --- | --- | --- |
| Название окружения | Production  | Имя окружения  | Любая строка! |
| Тип окружения | Deployment | Тип окружения | Deployment, Development |
| Set deployment type | PROD |  Обозначает тип окружения развертывания. | Production, Staging, General |
| Версия dbt | Latest | <Constant name="cloud" /> автоматически обновляет версию dbt, выполняемую в этом окружении, на основе выбранного вами [release track](/docs/dbt-versions/cloud-release-tracks). | Lastest, Compatible, Extended |
| Запускать только на custom branch | ☑️ | Определяет, нужно ли использовать ветку, отличную от ветки репозитория по умолчанию  | См. ниже |
| Custom branch | dev | Имя custom branch | См. ниже |

:::note О версии dbt

<Constant name="cloud" /> позволяет пользователям выбрать [release track](/docs/dbt-versions/cloud-release-tracks), чтобы получать обновления версий dbt с частотой, подходящей команде.
:::

### Поведение custom branch {#custom-branch-behavior}

По умолчанию все окружения используют ветку репозитория по умолчанию (обычно `main`) при доступе к вашему dbt‑коду. Это можно переопределить в каждом <Constant name="cloud" /> Environment с помощью опции **Default to a custom branch**. Поведение этой настройки немного отличается в зависимости от типа окружения:

- **Development**: определяет, от какой ветки в <Constant name="cloud_ide" /> или <Constant name="cloud_cli" /> разработчики создают ветки и против какой ветки открывают PR.
- **Deployment:** определяет, какая ветка клонируется при выполнении джобов в каждом окружении.

Подробнее см. на [FAQ‑странице по этой теме](/faqs/Environments/custom-branch-settings)!

### Расширенные атрибуты (Extended attributes) {#extended-attributes}

:::note 
Расширенные атрибуты сейчас _не_ поддерживаются для SSH‑туннелирования
:::

Расширенные атрибуты позволяют пользователям задавать гибкий фрагмент [profiles.yml](/docs/core/connect-data-platform/profiles.yml) в настройках окружения <Constant name="cloud" />. Это даёт больше контроля над окружениями (и deployment, и development) и расширяет возможности того, как <Constant name="cloud" /> подключается к платформе данных в рамках окружения.

Расширенные атрибуты задаются на уровне окружения и могут частично переопределять учётные данные подключения или окружения, включая любые custom environment variables. Вы можете задавать любые YAML‑атрибуты верхнего уровня, которые адаптер dbt принимает в `profiles.yml`.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/extended-attributes.png" width="95%" title="Extended Attributes помогает добавлять атрибуты profiles.yml в настройки окружения dbt через текстовое поле свободной формы." /> <br />

Следующий код — пример типов атрибутов, которые можно добавить в текстовое поле **Extended Attributes**:

```yaml
dbname: jaffle_shop      
schema: dbt_alice      
threads: 4
username: alice
password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'
```
#### Extended Attributes не маскируют значения секретов {#extended-attributes-dont-mask-secret-values}
Мы рекомендуем избегать указания секретных значений, чтобы они не были видны в текстовом поле и логах. Распространённый обходной путь — обернуть extended attributes в [environment variables](/docs/build/environment-variables). В примере выше `password: '{{ env_var(''DBT_ENV_SECRET_PASSWORD'') }}'` получит значение из переменной окружения `DBT_ENV_SECRET_PASSWORD` во время выполнения.

#### Как работают extended attributes {#how-extended-attributes-work}
Если вы разрабатываете в [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), [<Constant name="cloud_cli" />](/docs/cloud/cloud-cli-installation) или [оркестрируете запуски джобов](/docs/deploy/deployments), extended attributes парсят предоставленный YAML и извлекают атрибуты `profiles.yml`. Для каждого отдельного атрибута:

- Если атрибут существует в другом источнике (например, в настройках проекта), он заменит его значение (например, значения уровня окружения) в профиле. Он также переопределяет любые custom environment variables (если сам не задан через синтаксис для секретов выше)

- Если атрибут не существует, он добавит пару «атрибут/значение» в профиль.

#### В extended attributes принимаются только **ключи верхнего уровня** {#only-the-top-level-keys-are-accepted-in-extended-attributes}
Это означает, что если вы хотите изменить значение конкретного вложенного (sub-key) ключа, вы должны передать весь ключ верхнего уровня как JSON‑блок в итоговом YAML. Например, если вы хотите кастомизировать поле внутри [service account JSON](/docs/core/connect-data-platform/bigquery-setup#service-account-json) для подключения BigQuery (например, `project_id` или `client_email`), вам нужно переопределить весь ключ/атрибут верхнего уровня `keyfile_json` через extended attributes. Включите под‑поля как вложенный JSON‑блок.
