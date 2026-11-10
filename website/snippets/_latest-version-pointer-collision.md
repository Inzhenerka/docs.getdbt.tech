Чтобы предотвратить конфликты имён, dbt выдаёт ошибку `dbt1005`, если псевдоним последней версии совпадает с именем представления-указателя. В <Constant name="fusion" />, где `latest_version_pointer` включён по умолчанию, эта ошибка может возникать для моделей с явно заданным `alias`, совпадающим с базовым именем модели, даже если вы сами никогда не настраивали указатель.

Например, следующая конфигурация вызовет ошибку `dbt1005`, поскольку и `dim_customers_v2`, и представление-указатель получат имя `dim_customers`:

```
dbt1005 (Cannot create latest version pointer: the latest version of 'dim_customers' is already aliased to 'dim_customers')
```

```yaml
models:
  - name: dim_customers
    versions:
      - v: 1
      - v: 2
        config:
          alias: dim_customers  # collides with the pointer view name
    config:
      latest_version_pointer:
        enabled: true
```

Чтобы исправить это, выберите один из следующих вариантов:

- [Удалить `alias` (рекомендуется)](#remove-the-alias-recommended)
- [Отключить указатель на последнюю версию для этой модели](#disable-the-latest-version-pointer-for-that-model)
- [Задать уникальный `alias`](#set-a-unique-alias)
- [Переопределить макрос `generate_latest_version_pointer_alias`](#override-the-generate_latest_version_pointer_alias-macro)

#### Удалить `alias` (рекомендуется) {#remove-the-alias-recommended}

Удалите `alias` из конфигурации последней версии и позвольте автоматически создаваемому указателю обеспечить доступ по этому имени:

```yaml
config:
  alias: dim_customers
```

#### Отключить указатель на последнюю версию для этой модели {#disable-the-latest-version-pointer-for-that-model}

Этот подход сразу обеспечивает обратную совместимость с существующими конфигурациями `alias`:

```yaml
        config:
          alias: dim_customers
    config:
      latest_version_pointer:
        enabled: false
```

#### Задать уникальный `alias` {#set-a-unique-alias}

```yaml
        config:
          alias: dim_customers_latest
```

#### Переопределить макрос `generate_latest_version_pointer_alias` {#override-the-generate_latest_version_pointer_alias-macro}

Переопределите макрос [`generate_latest_version_pointer_alias`](/docs/build/custom-aliases#generate_latest_version_pointer_alias), чтобы использовать другое правило именования на глобальном уровне:

<File name='macros/generate_latest_version_pointer_alias.sql'>

```sql
{% macro generate_latest_version_pointer_alias(custom_alias_name=none, node=none) -%}
    {{ node.name ~ "_latest" }}
{%- endmacro %}
```

</File>
