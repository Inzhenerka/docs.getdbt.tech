## Варианты использования {#use-cases}

Следующая настройка подойдет для любого dbt-проекта:

- Добавьте [зависимости от пакетов](/docs/mesh/govern/project-dependencies#when-to-use-project-dependencies) в `packages.yml`
- Добавьте [зависимости от проектов](/docs/mesh/govern/project-dependencies#when-to-use-package-dependencies) в `dependencies.yml`

Однако, возможно, вы сможете объединить всё в один файл `dependencies.yml`. Прочитайте следующий раздел, чтобы узнать больше.

#### О `packages.yml` и `dependencies.yml` {#about-packagesyml-and-dependenciesyml}
Файл `dependencies.yml` может содержать оба типа зависимостей: зависимости от пакетов ("package") и от проектов ("project").
- [Зависимости от пакетов](/docs/build/packages#how-do-i-add-a-package-to-my-project) позволяют добавлять в ваш проект исходный код из dbt-проекта другого автора — как библиотеку.
- Зависимости от проектов (project dependencies) предоставляют другой способ строить решения поверх чужой работы в dbt.

Если вашему dbt-проекту не требуется использовать Jinja в спецификациях пакетов, вы можете просто переименовать существующий `packages.yml` в `dependencies.yml`. Однако важно учитывать: если спецификации пакетов в вашем проекте используют Jinja (особенно в сценариях вроде добавления переменной окружения или метода [Git token method](/docs/build/packages#git-token-method) в спецификации приватного Git-пакета), стоит продолжать использовать имя файла `packages.yml`.

Используйте переключатели ниже, чтобы понять различия и решить, когда использовать `dependencies.yml` или `packages.yml` (или оба). Подробнее см. [FAQ](#faqs).

<Expandable alt_header="Когда использовать project dependencies" >

Project dependencies предназначены для воркфлоу [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) и [cross-project reference](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref):

- Используйте `dependencies.yml`, когда нужно настроить cross-project references между разными dbt-проектами, особенно в рамках dbt Mesh.
- Используйте `dependencies.yml`, когда хотите включить в зависимости проекта и другие проекты, и непубличные dbt-пакеты.
  - Приватные пакеты не поддерживаются в `dependencies.yml`, потому что там намеренно не поддерживается рендеринг Jinja или условная конфигурация. Это нужно, чтобы конфигурация оставалась статичной и предсказуемой, а также для совместимости с другими сервисами, такими как <Constant name="cloud" />.
- Используйте `dependencies.yml` для удобства и поддержки, если вы используете и [cross-project refs](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref), и [пакеты из dbt Hub](https://hub.getdbt.com/). Это снижает необходимость держать несколько YAML-файлов для управления зависимостями.

</Expandable>

<Expandable alt_header="Когда использовать package dependencies" >

Package dependencies позволяют добавлять в ваш проект исходный код из dbt-проекта другого автора — как библиотеку:

- Если вы используете только пакеты, например из [dbt Hub](https://hub.getdbt.com/), оставайтесь на `packages.yml`.
- Используйте `packages.yml`, когда нужно скачать dbt-пакеты (например, dbt-проекты) в корневой (root) или родительский (parent) dbt-проект. Важно: это не относится к воркфлоу dbt Mesh.
- Используйте `packages.yml`, чтобы включать пакеты в зависимости проекта. Это включает и публичные пакеты (например из [dbt Hub](https://hub.getdbt.com/)), и приватные пакеты. dbt теперь поддерживает [native private packages](/docs/build/packages#native-private-packages).
- `packages.yml` поддерживает рендеринг Jinja по историческим причинам, что позволяет делать динамические конфигурации. Это может быть полезно, если нужно подставлять значения (например метод [Git token method](/docs/build/packages#git-token-method) из переменной окружения) в спецификации пакетов.

Ранее для использования приватных Git-репозиториев в dbt приходилось применять обходной путь: встраивать Git token с помощью Jinja. Это неидеально, потому что требует дополнительных шагов — например, создавать пользователя и делиться Git token. Мы добавили поддержку [native private packages](/docs/build/packages#native-private-packages-), чтобы решить эту проблему.

</Expandable>
