---
id: data-types
title: SQL Data Types
description: Различные типы данных в SQL включают числовые, строковые, даты, булевы и полуструктурированные. Этот материал охватывает различия между ними и их подкатегориями.
slug: /sql-reference/data-types
---

<head>
    <title>Какие существуют типы данных в SQL?</title>
</head>

Ниже мы разберем различные категории типов данных и уникальные типы данных, которые входят в каждую категорию.

## Числовые типы данных

Существует множество различных числовых типов в SQL, и это логично, потому что... мы работаем с данными, и числа важны, длина в битах важна, десятичные знаки еще более важны, и именно числа позволяют заинтересованным сторонам принимать определенные решения.

Существует небольшая разница в том, какие числовые типы данных поддерживаются в каждом хранилище данных, но в основном важно понимать различия между целыми числами, десятичными и плавающими числами.

| **Тип** | **Определение** | **Сценарии использования** |
|:---:|:---:|:---:|
| Integer | Целые числа — это числа без дробей. Подумайте о 1, 2, 72384191203 — красивые, чистые числа. | Хотя многие значения столбцов могут выглядеть как целые числа (и в теории они таковыми являются), они часто отображаются или приводятся к десятичным/числовым типам, чтобы обеспечить точность и масштаб в будущем, если это потребуется. |
| Decimal | Decimal, также известный как тип NUMERIC, — это числовой тип данных, который имеет стандартную точность 38 и масштаб 0. | Типичные числовые столбцы в наборах данных, такие как пожизненная ценность или идентификаторы пользователей. Скорее всего, это самая распространенная форма числовых данных в ваших таблицах. |
| Float | Плавающие числа используются для предоставления приблизительных числовых значений дробей с точностью до 64 бит. Плавающие числа предлагают больший диапазон значений по сравнению с десятичными числами. | Столбцы, которые являются процентами; долгота/широта. |

## Строковые типы данных

Строки повсюду в данных — они позволяют людям иметь описательные текстовые поля, использовать регулярные выражения в своей работе с данными, и, честно говоря, они просто делают мир данных более живым. Формально, строковый тип — это слово или комбинация символов, которые вы обычно видите заключенными в одинарные кавычки (например, 'Jaffle Shop', '1234 Shire Lane', 'Plan A').

Snowflake, Databricks, Google BigQuery и Amazon Redshift поддерживают строковый тип данных. У них могут быть немного разные подтипы для строк; некоторые хранилища данных, такие как Snowflake и Redshift, поддерживают строковые типы `text`, `char` и `character`, которые обычно отличаются по длине в байтах по сравнению с общим строковым типом.

Опять же, поскольку большинство строковых типов столбцов являются неотъемлемой частью ваших данных, вы, вероятно, сможете использовать общие varchar или строки для приведения, но никогда не помешает ознакомиться с документацией, специфичной для поддержки строк вашего хранилища данных!

## Типы данных даты

Даты, временные метки, часовые пояса — все эти забавные (и немного болезненные) вещи с данными, которые делают аналитиков настоящими практиками данных (людьми, которые иногда хотят вырвать себе волосы).

Ниже мы разберем даты, даты-времена, времена и временные метки, чтобы помочь вам лучше понять основные типы данных даты.

Начнем с самого простого и перейдем к более сложному: даты, обычно представленные типом DATE, это то, что вы обычно ассоциируете с календарной датой (например, 2022-12-16), и они ограничены диапазоном от 0001-01-01 до 9999-12-31.

Значения DATETIME содержат как календарную дату, так и время (например, 2022-12-16 02:33:24) и могут дополнительно включать доли секунд. Типы TIME обычно представлены как HH:MM:SS времени и не содержат указанного часового пояса.

Типы данных TIMESTAMP позволяют наибольшую спецификацию и точность момента времени и могут быть указаны с часовым поясом или без него. Большинство полей данных, основанных на событиях (например, время завершения заказа, время создания учетной записи, время ухода пользователя), будут представлены как временные метки в ваших источниках данных. Некоторые хранилища данных, такие как [Amazon Redshift](https://docs.amazonaws.cn/en_us/redshift/latest/dg/r_Datetime_types.html) и [Snowflake](https://docs.snowflake.com/en/sql-reference/data-types-datetime.html#date-time-data-types), поддерживают различные варианты временных меток, которые позволяют явное указание часового пояса (или его отсутствие).

В общем, две лучшие практики, когда дело касается дат и времени:
1. Сохраняйте (или преобразуйте) временные метки в один и тот же часовой пояс.
2. Сохраняйте типы дат в наиболее специфичном типе даты: вы всегда можете "отдалиться" от временной метки, чтобы получить дату, но не можете получить временную метку из даты.

В конечном итоге вы будете использовать удобные функции даты, чтобы "приближаться" и "отдаляться" от дат, преобразовывать даты или добавлять время к датам.

## Булевы значения

Булево значение — это значение столбца, которое может быть истинным, ложным или null. В ваших наборах данных вы будете использовать булевы значения для создания полей `is_` или `has_`, чтобы создавать четкие сегменты в ваших данных; например, вы можете использовать булевы значения, чтобы указать, ушел ли клиент (`has_churned`) или обозначить записи сотрудников (`is_employee`), или отфильтровать записи, которые были удалены из вашего исходного набора данных (`is_deleted`).

Обычно вы увидите `True` или `False` как фактические булевы значения в столбце, но также можете выбрать использование числовых значений, таких как 1 и 0, для представления истинных и ложных значений. Однако строки `True` и `False` обычно легче читать и интерпретировать для конечных бизнес-пользователей.

## Полуструктурированные типы данных

Полуструктурированные типы данных — это отличный способ объединить или агрегировать данные по нескольким полям; вы также можете оказаться в обратной ситуации, когда вам нужно распаковать полуструктурированные данные, такие как объект <Term id="json">JSON</Term>, и развернуть его в отдельные пары ключ-значение. Два основных полуструктурированных типа данных, которые вы увидите в хранилищах данных, — это JSON и массивы.

Ниже мы разберем, в чем разница между ними, и приведем пример каждого из них.

| **Тип** | **Определение** | **Пример** | **Сценарий использования** |
|:---:|:---:|:---:|:---:|
| JSON | Когда мы смотрим на данные, отформатированные в JSON, мы говорим, что данные хранятся в JSON-объектах. Они состоят из пар ключ-значение. JSON-объекты заключены в фигурные скобки (\{ \}), и каждая пара ключ-значение разделена запятой. Подробнее о использовании JSON можно прочитать здесь. | \{"customer_id":2947, "order_id":4923, "order_items":"cheesecake"\} | Одно из замечательных свойств JSON-данных заключается в том, что они не требуют определения схемы — до тех пор, пока вы их не развернете. Извлеките именно то, что вам нужно из вашего JSON-объекта, и вы можете забыть об остальном! JSON-значения часто будут неотъемлемой частью ваших источников данных, поэтому научитесь их разворачивать, и ваша жизнь станет проще. |
| Array | Подобно массивам в других языках программирования, массив содержит несколько элементов, доступных через их позицию в этом массиве. | ["cheesecake", "cupcake", "brownie"] | Массивы — это понятный способ агрегировать несколько значений вместе, чтобы создать одно значение. Здесь много сценариев использования, но будьте осторожны: использование агрегатных функций, таких как `array_agg`, может стать неэффективным на больших наборах данных. |