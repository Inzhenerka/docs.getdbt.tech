---
datatype: version
required: True
keyword: версия проекта, версионирование проекта, версионирование проекта dbt
---

import VersionsCallout from '/snippets/_version-callout.md';

<VersionsCallout />

Проекты dbt имеют два различных типа тегов `version`. Это поле имеет разное значение в зависимости от его расположения.

## Версии в `dbt_project.yml`

Тег версии в файле `dbt_project` представляет собой версию вашего проекта dbt.

Начиная с версии dbt 1.5, `version` в `dbt_project.yml` является *необязательным параметром*. Если он используется, версия должна быть в формате [семантической версии](https://semver.org/), например `1.0.0`. Значение по умолчанию — `None`, если не указано. Для пользователей dbt версии 1.4 или ниже этот тег является обязательным, хотя в настоящее время он не используется dbt значимо.

Для получения дополнительной информации о версиях Core смотрите [О версиях dbt Core](/docs/dbt-versions/core).

<File name='dbt_project.yml'>

```yml
version: version
```

</File>

## Версии в файлах свойств `.yml`

Тег версии в файле свойств `.yml` предоставляет управляющий тег, который информирует, как dbt обрабатывает файлы свойств.

Начиная с версии 1.5, dbt больше не требует этой конфигурации в ваших ресурсных файлах `.yml`. Если вы хотите узнать больше о том, почему этот тег ранее был обязательным, вы можете обратиться к [Часто задаваемым вопросам](#faqs). Для пользователей dbt версии 1.4 или ниже этот тег является обязательным.

Для получения дополнительной информации о файлах свойств смотрите их общую [документацию](/reference/configs-and-properties#where-can-i-define-properties) на той же странице.

<Tabs
  groupId="resource-version-configs"
  defaultValue="version-specified"
  values={[
    { label: 'Файл свойств ресурса с указанной версией', value: 'version-specified', },
    { label: 'Файл свойств ресурса без указанной версии', value: 'no-version-specified', },
  ]
}>
<TabItem value="version-specified">

<File name='<any valid filename>.yml'>

```yml
version: 2  # Только 2 принимается dbt версиями до 1.4.latest.

models: 
    ...
```

</File>

</TabItem>

<TabItem value="no-version-specified">

<File name='<any valid filename>.yml'>

```yml

models: 
    ...
```

</File>

</TabItem>

</Tabs>

## Часто задаваемые вопросы

<FAQ path="Project/why-version-2" />