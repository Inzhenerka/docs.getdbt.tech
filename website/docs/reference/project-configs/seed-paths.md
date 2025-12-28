---
datatype: [directorypath]
default_value: [data]
---

<File name='dbt_project.yml'>

```yml
seed-paths: [directorypath]
```

</File>

## Определение
Позволяет опционально указать пользовательский список директорий, в которых находятся файлы [seed](/docs/build/seeds).

## Значение по умолчанию

По умолчанию dbt ожидает, что seeds будут располагаться в директории `seeds`. Например, `seed-paths: ["seeds"]`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="seed-paths"
absolute="/Users/username/project/seed"
/>

- ✅ **Нужно**
  - Использовать относительный путь:
    ```yml
    seed-paths: ["seed"]
    ```

- ❌ **Не нужно**
  - Избегать абсолютных путей:
    ```yml
    seed-paths: ["/Users/username/project/seed"]
    ```

## Примеры
### Использовать директорию с именем `custom_seeds` вместо `seeds`

<File name='dbt_project.yml'>

```yml
seed-paths: ["custom_seeds"]
```

</File>

### Хранить модели и seeds вместе в директории `models`
Примечание: это работает, потому что dbt ищет разные типы файлов для seeds (`.csv`) и моделей (`.sql`).

<File name='dbt_project.yml'>

```yml
seed-paths: ["models"]
model-paths: ["models"]
```

</File>

### Разделить seeds на две директории
Примечание: мы рекомендуем вместо этого использовать две поддиректории внутри директории `seeds/`, чтобы добиться аналогичного эффекта.

<File name='dbt_project.yml'>

```yml
seed-paths: ["seeds", "custom_seeds"]
```

</File>
