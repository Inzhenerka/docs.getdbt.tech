---
title: Как сохранить ведущие нули в исходных данных?
description: "Используйте типы столбцов для включения ведущих нулей в исходные данные"
sidebar_label: 'Включение ведущих нулей в файл исходных данных'
id: leading-zeros-in-seed

---

Если вам нужно сохранить ведущие нули (например, в почтовом индексе или номере мобильного телефона):

1. Начиная с версии v0.16.0: Включите ведущие нули в ваш файл исходных данных и используйте [конфигурацию](reference/resource-configs/column_types.md) `column_types` с типом данных varchar нужной длины.
2. До версии v0.16.0: Используйте последующую модель для добавления ведущих нулей с помощью SQL, например: `lpad(zipcode, 5, '0')`