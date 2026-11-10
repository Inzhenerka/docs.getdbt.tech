---
title: "Без префикса + в путях к ресурсам"
id: "require_resource_names_without_plus_prefix"
sidebar_label: "Имена ресурсов без префикса +"
---

:::info Флаг только для <Constant name="fusion" />

Этот флаг изменения поведения предназначен только для <Constant name="fusion" /> и не имеет аналога в <Constant name="core" />.

:::

| require_resource_names_without_plus_prefix | <Constant name="fusion" /> |
|-----------------|------------------|
| Введён | 2.0.0-preview.208 |
| Переведён в стабильный статус (по умолчанию → `true`) | — |
| Удалён | — |

По умолчанию флаг `require_resource_names_without_plus_prefix` имеет значение `false`.

В `dbt_project.yml` [префикс `+`](/reference/resource-configs/plus-prefix) обозначает настройку, а ключ без этого префикса рассматривается как часть [пути к ресурсу](/reference/resource-configs/resource-path) (имя папки или файла). Исторически dbt допускал пути к ресурсам, начинающиеся с `+` (например, папку с именем `+my_folder` внутри `models`), хотя префикс `+` предназначен только для настроек. Это непреднамеренное поведение приводит к появлению вводящих в заблуждение сообщений об ошибках, когда у настройки отсутствует префикс `+`, поскольку dbt не может надёжно определить, является ли ключ с префиксом `+` именем папки или ошибочно записанной настройкой.

Когда флаг `require_resource_names_without_plus_prefix` имеет значение `false`, dbt выдаёт предупреждение для каждого пути к ресурсу, начинающегося с `+`:

```shell

[warning] [InvalidConfig (dbt1005)]: Resource path `snapshot_contract.+path_1` in dbt_project.yml starts with `+`. This will be deprecated in future versions of dbt.

```

Когда флаг имеет значение `true`, dbt рассматривает ключ с префиксом `+` как нераспознанный ключ настройки и вместо предупреждения выдаёт ошибку:

```shell

[error] [SerializationError (dbt1013)]: Invalid model definition `snapshot_contract.+path_1`: Unrecognized key `snapshot_contract.+path_1`. Custom keys must go under `+meta`.

```

Чтобы устранить предупреждение или ошибку, удалите префикс + из всех имён папок и файлов в dbt_project.yml. Пользовательские ключи размещайте внутри [`+meta`](/reference/resource-configs/meta).

Например, задайте путь к ресурсу так, чтобы он не начинался с `+`:

<File name="dbt_project.yml">

```yml

models:
  my_project:
    my_folder:        # resource path — no + prefix
      +enabled: true  # config — keep the + prefix

```
</File>
