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
Необязательно указывать пользовательский список директорий, в которых находятся файлы [seed](/docs/build/seeds).

## По умолчанию

По умолчанию dbt ожидает, что семена будут находиться в директории `seeds`. Например, `seed-paths: ["seeds"]`. 

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="seed-paths"
absolute="/Users/username/project/seed"
/>

- ✅ **Делайте**
  - Используйте относительный путь:
    ```yml
    seed-paths: ["seed"]
    ```

- ❌ **Не делайте:**
  - Избегайте абсолютных путей:
    ```yml
    seed-paths: ["/Users/username/project/seed"]
    ```

## Примеры
### Используйте директорию с именем `custom_seeds` вместо `seeds`

<File name='dbt_project.yml'>

```yml
seed-paths: ["custom_seeds"]
```

</File>

### Разместите ваши модели и семена в директории `models`
Примечание: это работает, потому что dbt ищет разные типы файлов для семян (`.csv` файлы) и моделей (`.sql` файлы).

<File name='dbt_project.yml'>

```yml
seed-paths: ["models"]
model-paths: ["models"]
```

</File>

### Разделите ваши семена на две директории
Примечание: Мы рекомендуем вместо этого использовать две поддиректории внутри директории `seeds/`, чтобы достичь аналогичного эффекта.

<File name='dbt_project.yml'>

```yml
seed-paths: ["seeds", "custom_seeds"]
```

</File>