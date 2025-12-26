---
title: Как исправить мой файл .gitignore?
description: "Используйте эти инструкции, чтобы исправить ваш файл gitignore"
sidebar_label: 'Как исправить ваш файл .gitignore'
id: gitignore
---

Файл gitignore определяет, какие файлы <Constant name="git" /> должен намеренно игнорировать. В вашем проекте такие файлы можно распознать по их курсивному оформлению.

Если вы не можете отменить изменения, переключиться на ветку или нажать на commit &mdash; это обычно происходит из-за отсутствия файла [.gitignore](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore) в вашем проекте ИЛИ ваш файл gitignore не содержит необходимого содержимого внутри папки.

Чтобы исправить это, выполните следующие шаги:

1. В <Constant name="cloud_ide" /> добавьте следующее содержимое [.gitignore](https://github.com/dbt-labs/dbt-starter-project/blob/main/.gitignore) в файл `.gitignore` вашего dbt‑проекта:
```bash
target/
dbt_packages/
logs/
# legacy -- переименовано в dbt_packages в dbt v1
dbt_modules/
```
2. Сохраните изменения, но _не делайте commit_.
3. Перезапустите <Constant name="cloud_ide" />, нажав на три точки рядом с **кнопкой статуса <Constant name="cloud_ide" />** в правом нижнем углу <Constant name="cloud_ide" />.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/restart-ide.png" width="50%" title="Перезапуск IDE с помощью кнопки с тремя точками в правом нижнем углу или через строку статуса" />

4. Выберите **Restart <Constant name="cloud_ide" />**.
5. Вернитесь в **File explorer** в IDE и удалите следующие файлы или папки, если они у вас есть:
    * `target`, `dbt_modules`, `dbt_packages`, `logs`
6. **Сохраните** изменения, затем выполните **Commit and sync**.
7. Снова перезапустите <Constant name="cloud_ide" />.
8. В меню **Version Control** создайте pull request (PR), чтобы интегрировать новые изменения.
9. Выполните merge PR на странице вашего git‑провайдера.
10. Переключитесь на основную ветку и нажмите **Pull from remote**, чтобы подтянуть все изменения в основную ветку. Вы можете проверить, что всё применилось корректно, убедившись, что файлы и папки, указанные в `.gitignore`, отображаются курсивом.

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/gitignore-italics.png" width="50%" title="Проект dbt в основной ветке с корректно настроенными папками из gitignore (выделены курсивом)." />

Для получения дополнительной информации, обратитесь к этому [подробному видео](https://www.loom.com/share/9b3b8e2b617f41a8bad76ec7e42dd014) для дополнительной помощи.