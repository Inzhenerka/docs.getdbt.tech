## Определение
При необходимости укажите пользовательский список директорий, где находятся файлы [seed](/docs/build/seeds).

## По умолчанию

По умолчанию dbt ожидает, что seeds будут находиться в директории `seeds`. Например, `seed-paths: ["seeds"]`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="seed-paths"
absolute="/Users/username/project/seed"
/>

- ✅ **Рекомендуется**
  - Использовать относительный путь:
    ```yml
    seed-paths: ["seed"]
    ```

- ❌ **Не рекомендуется:**
  - Избегать абсолютных путей:
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

### Разместите ваши модели и seeds в директории `models`
Примечание: это работает, потому что dbt ищет разные типы файлов для seeds (`.csv` файлы) и моделей (`.sql` файлы).

<File name='dbt_project.yml'>

```yml
seed-paths: ["models"]
model-paths: ["models"]
```

</File>

### Разделите ваши seeds между двумя директориями
Примечание: Мы рекомендуем вместо этого использовать две поддиректории внутри директории `seeds/`, чтобы достичь аналогичного эффекта.

<File name='dbt_project.yml'>

```yml
seed-paths: ["seeds", "custom_seeds"]
```

</File>