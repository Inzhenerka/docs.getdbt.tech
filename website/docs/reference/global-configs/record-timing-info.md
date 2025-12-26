---
title: "Запись информации о времени выполнения"
id: "record-timing-info"
---

Флаг `-r` или `--record-timing-info` сохраняет информацию о профилировании производительности в файл. Этот файл можно визуализировать с помощью `snakeviz`, чтобы понять характеристики производительности вызова dbt.

<File name='Usage'>

```text
$ dbt run -r timing.txt
...

$ snakeviz timing.txt
```

</File>

В качестве альтернативы, вы можете использовать [`py-spy`](https://github.com/benfred/py-spy) для сбора профилей [speedscope](https://github.com/jlfwong/speedscope) команд dbt следующим образом:

```shell
python -m pip install py-spy
sudo py-spy record -s -f speedscope -- dbt parse
```