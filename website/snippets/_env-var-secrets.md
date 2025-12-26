Функция `env_var` может использоваться для подключения переменных окружения из системы к вашему проекту dbt. Вы можете использовать функцию `env_var` в файле `profiles.yml`, в файле `dbt_project.yml`, в файле `sources.yml`, в файлах `schema.yml`, а также в `.sql`‑файлах моделей. По сути, `env_var` доступна везде, где dbt обрабатывает Jinja‑код.

При использовании в файле `profiles.yml` (чтобы избежать хранения учетных данных на сервере) это может выглядеть следующим образом:

<File name='profiles.yml'>

```yaml
profile:
  target: prod
  outputs:
    prod:
      type: postgres
      host: 127.0.0.1
      # IMPORTANT: Make sure to quote the entire Jinja string here
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASSWORD') }}"
      ....
```

</File>
