## Варианты использования {#use-cases}

Следующая настройка подойдет для любого dbt-проекта:

- Добавьте [зависимости от пакетов](/docs/mesh/govern/project-dependencies#about-packagesyml-and-dependenciesyml) в `packages.yml`
- Добавьте [зависимости от проектов](/docs/mesh/govern/project-dependencies#about-packagesyml-and-dependenciesyml) в `dependencies.yml`

Однако, возможно, вы сможете объединить всё в один файл `dependencies.yml`. Прочитайте следующий раздел, чтобы узнать больше.

#### О `packages.yml` и `dependencies.yml` {#about-packagesyml-and-dependenciesyml}
Файл `dependencies.yml` может содержать оба типа зависимостей: зависимости от пакетов ("package") и от проектов ("project").
- [Зависимости от пакетов](/docs/build/packages#how-do-i-add-a-package-to-my-project) позволяют добавлять в ваш проект исходный код из dbt-проекта другого автора — как библиотеку.
- Зависимости от проектов (project dependencies) предоставляют другой способ строить решения поверх чужой работы в dbt.


Для приватных пакетов без токенов Jinja можно использовать [встроенную поддержку приватных пакетов](/docs/build/packages#native-private-packages) в `packages.yml` или `dependencies.yml`.

Если вашему проекту dbt не требуется Jinja в спецификациях пакетов, вы можете переименовать `packages.yml` в `dependencies.yml`. Если вам требуется Jinja в спецификациях пакетов (например, для переменной окружения или [метода с Git-токеном](/docs/build/packages#git-token-method)):
- В <Constant name="core" /> продолжайте использовать `packages.yml`. <Constant name="core" /> не обрабатывает Jinja в `dependencies.yml`.
- В <Constant name="fusion_engine" /> можно использовать Jinja в `dependencies.yml`. Если проект должен работать и в <Constant name="core" />, рекомендуется использовать `packages.yml`.

Полную таблицу поддержки см. в разделе [Поддержка Jinja по типам файлов](/reference/jinja-file-support). Используйте приведённые ниже переключатели, чтобы разобраться в различиях и определить, когда использовать `dependencies.yml` или `packages.yml` (или оба файла). Дополнительную информацию см. в разделе [Часто задаваемые вопросы](/docs/mesh/govern/project-dependencies#faqs).

<Expandable alt_header="Когда использовать зависимости проектов">

Зависимости проектов предназначены для работы с [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) и [межпроектными ссылками](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref):

- Используйте `dependencies.yml`, когда нужно настроить межпроектные ссылки между разными проектами dbt, особенно при использовании dbt Mesh.
- Используйте `dependencies.yml`, когда хотите включить в зависимости своего проекта как другие проекты, так и неприватные пакеты dbt.
- Используйте `dependencies.yml` для упорядочения зависимостей и упрощения их сопровождения, если вы используете одновременно [межпроектные ссылки](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) и [пакеты из dbt Hub](https://hub.getdbt.com/). Это позволяет сократить количество YAML-файлов, необходимых для управления зависимостями.

</Expandable>

<Expandable alt_header="Когда использовать package dependencies" >

Package dependencies позволяют добавлять в ваш проект исходный код из dbt-проекта другого автора — как библиотеку:

- Если вы используете только пакеты, например из [dbt Hub](https://hub.getdbt.com/), продолжайте использовать `packages.yml`.
- Используйте `packages.yml`, если хотите загружать пакеты dbt, например проекты dbt, в свой корневой или родительский проект dbt. Обратите внимание, что этот файл не участвует в рабочем процессе dbt Mesh.
- Используйте `packages.yml`, чтобы включать пакеты в зависимости вашего проекта. Это касается как общедоступных пакетов, например из [dbt Hub](https://hub.getdbt.com/), так и приватных пакетов. Теперь dbt поддерживает [нативную работу с приватными пакетами](/docs/build/packages#native-private-packages).
- По историческим причинам [`packages.yml` поддерживает рендеринг Jinja](/docs/build/dbt-tips#yaml-tips), что позволяет создавать динамические конфигурации. Это может быть полезно, если вам нужно подставлять значения из переменных окружения в спецификации пакетов, например при использовании [метода с токеном Git](/docs/build/packages#git-token-method). <Constant name="fusion_engine" /> также поддерживает Jinja в `dependencies.yml`; см. [поддержку Jinja по типам файлов](/reference/jinja-file-support).

Ранее для использования приватных Git-репозиториев в dbt приходилось применять обходной путь: встраивать Git token с помощью Jinja. Это неидеально, потому что требует дополнительных шагов — например, создавать пользователя и делиться Git token. Мы добавили поддержку [native private packages](/docs/build/packages#native-private-packages), чтобы решить эту проблему.

</Expandable>
