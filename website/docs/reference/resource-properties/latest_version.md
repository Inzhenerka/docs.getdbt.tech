---
resource_types: [models]
datatype: latest_version
required: no
---

<File name='models/<schema>.yml'>

```yml
models:
  - name: model_name
    latest_version: 2
    [versions](/reference/resource-properties/versions):
      - v: 2
      - v: 1
```

</File>

## Определение

Последняя версия этой модели. "Последняя" версия актуальна для:
1. Разрешения вызовов `ref()` к этой модели, которые "не зафиксированы" (версия не указана явно)
2. Выбора версий модели с использованием метода выбора [`version:`](/reference/node-selection/methods#version), в зависимости от того, является ли данная версия модели `latest`, `prerelease` или `old`

Это значение может быть строковым или числовым (целым или дробным) значением. Оно должно быть одним из [идентификаторов версий](/reference/resource-properties/versions#v), указанных в списке `versions` этой модели.

Чтобы запустить последнюю версию модели, вы можете использовать [флаг `--select`](/reference/node-selection/syntax). Подробнее о синтаксисе и возможностях см. в разделе [Версии моделей](/docs/mesh/govern/model-versions#run-a-model-with-multiple-versions).

## По умолчанию

Если не указано для модели с версиями, `latest_version` по умолчанию устанавливается на наибольший [идентификатор версии](/reference/resource-properties/versions#v): численно наибольший (если все идентификаторы версий числовые), в противном случае - последний в алфавитном порядке (если они строковые).

Для модели без версий (без списка `versions`) `latest_version` не имеет значения.

Если `latest_version` не указано для модели с версиями, `latest_version` по умолчанию устанавливается на наибольший.


## Пример

<File name='models/<schema>.yml'>

```yml
models:
  - name: model_name
    [versions](/reference/resource-properties/versions):
      - v: 3
      - v: 2
      - v: 1
```

</File>

Если `latest_version` не указано, то `latest_version` равна `3`. Любые не зафиксированные ссылки -- `ref('model_name')` -- будут разрешены в `model_name.v3`. Оба `v1` и `v2` считаются "старыми" версиями.

<File name='models/<schema>.yml'>

```yml
models:
  - name: model_name
    latest_version: 2
    [versions](/reference/resource-properties/versions):
      - v: 3
      - v: 2
      - v: 1
```

</File>

В этом случае `latest_version` явно установлена в `2`. Любые не зафиксированные ссылки будут разрешены в `model_name.v2`. `v3` считается "предрелизной", а `v1` считается "старой".