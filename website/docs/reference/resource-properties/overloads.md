---
title: Перегрузки
sidebar_label: "Перегрузки"
id: overloads
---

# Перегрузки

<VersionCallout version="1.12" />

<File name='functions/<filename>.yml'>

```yml

functions:
  - name: <function name>
    arguments:
      - name: <arg name>
        data_type: <string>
    returns:
      data_type: <string>
    overloads:
      - defined_in: <string>       # обязательное поле, имя файла SQL, Python или JavaScript
        arguments:                 # необязательное поле
          - name: <arg name>       # обязательное поле, если задано arguments
            data_type: <string>    # обязательное поле, если задано arguments; зависит от хранилища данных
            description: <markdown_string>
            default_value: <string | boolean | integer> # необязательное поле, только для Snowflake и Postgres
        returns:                   # необязательное поле; если не задано, наследуется от основной функции
          data_type: <string>      # обязательное поле, если задано returns; зависит от хранилища данных
          description: <markdown_string>
      - defined_in: ...            # объявление дополнительных перегрузок

```

</File>

## Определение

Свойство `overloads` позволяет определить несколько сигнатур аргументов для одной и той же [пользовательской функции (UDF)](/docs/build/udfs). Это позволяет вызывать функцию с одним и тем же именем для разных типов входных данных, не создавая отдельную UDF для каждого варианта. Хранилище данных вызывает нужную версию на основе типов аргументов. Свойство `overloads` поддерживается для SQL UDF в Snowflake и Postgres, а также для Python и JavaScript UDF в Snowflake.

Каждая перегрузка ссылается на отдельный файл, содержащий тело функции, и может задавать необязательные свойства `arguments` и `returns`. Все перегрузки объединяются в один узел DAG (основную функцию), поэтому они создаются и выбираются вместе. При повторной попытке dbt пропускает успешно выполненные перегрузки и повторно запускает только те, которые завершились с ошибкой.

## Поведение

dbt выполняет все перегрузки независимо от ошибок в отдельных перегрузках, чтобы вы получили полную картину того, какие перегрузки выполнились успешно, а какие завершились с ошибкой. Действуют следующие правила:

- Если хотя бы одна перегрузка завершается с ошибкой, dbt помечает узел функции статусом `PARTIAL_SUCCESS` и пропускает зависимые узлы.
- [`dbt retry`](/reference/commands/retry) пропускает перегрузки, которые уже выполнились успешно, и повторно запускает только те, которые ранее завершились с ошибкой.
- [`state:modified`](/reference/node-selection/methods#the-state-method) обнаруживает изменения в теле функции, аргументах или типе возвращаемого значения любой перегрузки и помечает узел основной функции как изменённый.

## Свойства

Каждый элемент списка `overloads` поддерживает следующие свойства.

### defined_in

Имя файла (без расширения), содержащего тело перегрузки функции. Файл должен существовать в каталоге `functions/`. Например, `defined_in: null_if_empty_numeric` ссылается на `functions/null_if_empty_numeric.sql` для SQL UDF, `functions/null_if_empty_numeric.py` для Python UDF или `functions/null_if_empty_numeric.js` для JavaScript UDF.

Каждая перегрузка должна ссылаться на уникальный файл. Файл основной функции и файлы, указанные во всех значениях `defined_in`, должны отличаться друг от друга.

dbt выдаёт ошибку разбора, если:
- Значение `defined_in` соответствует файлу самой основной функции.
- Две перегрузки ссылаются на один и тот же файл.
- Указанный файл не существует в каталоге `functions/`.

### arguments

Список аргументов перегрузки. Имеет ту же структуру, что и [аргументы функции](/reference/resource-properties/function-arguments).

### returns

Тип возвращаемого значения перегрузки. Имеет ту же структуру, что и [returns](/reference/resource-properties/returns). Если свойство не задано, перегрузка наследует тип возвращаемого значения основной функции.

## Пример

<Tabs>
<TabItem value="SQL">

<File name='functions/null_if_empty.yml'>

```yml
functions:
  - name: null_if_empty
    arguments:
      - name: val
        data_type: varchar
    returns:
      data_type: varchar
    overloads:
      - defined_in: null_if_empty_numeric
        arguments:
          - name: val
            data_type: numeric
        returns:
          data_type: numeric
```

</File>

Создайте отдельный SQL-файл для тела каждой перегрузки. В этом примере основная функция обрабатывает пустые строки, а перегрузка — числовые значения:

<File name='functions/null_if_empty.sql'>

```sql
# синтаксис для Snowflake
CASE WHEN val = '' THEN NULL ELSE val END

# синтаксис для Postgres
SELECT CASE WHEN val = '' THEN NULL ELSE val END
```

</File>

<File name='functions/null_if_empty_numeric.sql'>

```sql
# синтаксис для Snowflake
CASE WHEN val = 0 THEN NULL ELSE val END

# синтаксис для Postgres
SELECT CASE WHEN val = 0 THEN NULL ELSE val END
```

</File>

</TabItem>
<TabItem value="Python">

<File name='functions/null_if_empty.yml'>

```yml
functions:
  - name: null_if_empty
    config:
      runtime_version: "3.11"
      entry_point: main
    arguments:
      - name: val
        data_type: varchar
    returns:
      data_type: varchar
    overloads:
      - defined_in: null_if_empty_numeric
        arguments:
          - name: val
            data_type: numeric
        returns:
          data_type: numeric
```

</File>

Создайте отдельный Python-файл для тела каждой перегрузки. В этом примере основная функция обрабатывает пустые строки, а перегрузка — числовые значения:

<File name='functions/null_if_empty.py'>

```python
def main(val):
    return None if val == '' else val
```

</File>

<File name='functions/null_if_empty_numeric.py'>

```python
def main(val):
    return None if val == 0 else val
```

</File>

</TabItem>
<TabItem value="JavaScript">

<File name='functions/null_if_empty.yml'>

```yml
functions:
  - name: null_if_empty
    arguments:
      - name: val
        data_type: varchar
    returns:
      data_type: varchar
    overloads:
      - defined_in: null_if_empty_numeric
        arguments:
          - name: val
            data_type: numeric
        returns:
          data_type: numeric
```

</File>

Создайте отдельный JavaScript-файл для тела каждой перегрузки. В этом примере основная функция обрабатывает пустые строки, а перегрузка — числовые значения:

<File name='functions/null_if_empty.js'>

```javascript
if (val === '') return null;
return val;
```

</File>

<File name='functions/null_if_empty_numeric.js'>

```javascript
if (val === 0) return null;
return val;
```

</File>

</TabItem>
</Tabs>

## Связанная документация

- [Пользовательские функции](/docs/build/udfs)
- [Свойства функций](/reference/function-properties)
- [Аргументы функций](/reference/resource-properties/function-arguments)
- [returns](/reference/resource-properties/returns)
