<Constant name="platform_cli" /> в настоящее время не поддерживает относительные пути в [файле `packages.yml`](/docs/build/packages). Вместо этого используйте [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), который поддерживает относительные пути в этом случае.

Ниже приведён пример конфигурации [локального пакета](/docs/build/packages#local-packages) в файле `packages.yml`, которая не будет работать с <Constant name="platform_cli" />:

```yaml
# repository_root/my_dbt_project_in_a_subdirectory/packages.yml

packages:
  - local: ../shared_macros
```

В этом примере `../shared_macros` — это относительный путь, который указывает dbt:
- `..` &mdash; перейти на один уровень вверх (в `repository_root`);
- `/shared_macros` &mdash; найти папку `shared_macros` в корневом каталоге.

Чтобы обойти это ограничение, используйте [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio), который полностью поддерживает относительные пути в `packages.yml`.
