---
datatype: version
required: True
keyword: project version, project versioning, dbt project versioning
---

import VersionsCallout from '/snippets/_version-callout.md';

<VersionsCallout />

В dbt проектах существуют два различных типа тегов `version`. Это поле имеет разное значение в зависимости от его расположения.

## Версии в `dbt_project.yml`

Тег версии в файле `dbt_project` представляет версию вашего dbt проекта.

Начиная с версии dbt 1.5, `version` в `dbt_project.yml` является *необязательным параметром*. Если он используется, версия должна быть в формате [семантического версионирования](https://semver.org/), например, `1.0.0`. Значение по умолчанию — `None`, если не указано. Для пользователей на версии dbt 1.4 или ниже этот тег обязателен, хотя в настоящее время он не используется dbt значимо.

Для получения дополнительной информации о версиях Core, см. [О версиях dbt Core](/docs/dbt-versions/core).

<File name='dbt_project.yml'>

```yml
version: version
```

</File>

## Версии файлов свойств `.yml`

Тег версии в файле свойств `.yml` предоставляет управляющий тег, который информирует, как dbt обрабатывает файлы свойств.

Начиная с версии 1.5, dbt больше не будет требовать этой конфигурации в ваших ресурсных файлах `.yml`. Если вы хотите узнать больше о том, почему этот тег ранее был необходим, вы можете обратиться к [Часто задаваемым вопросам](#faqs). Для пользователей на версии dbt 1.4 или ниже этот тег обязателен.

Для получения дополнительной информации о файлах свойств, см. их общую [документацию](/reference/configs-and-properties#where-can-i-define-properties) на той же странице.

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

## ЧАВО

<FAQ path="Project/why-version-2" />