Группы определяются в `.yml`‑файлах и указываются внутри ключа `groups:`. <VersionBlock firstVersion="1.10">Вы можете добавить конфигурацию `meta`, чтобы указать дополнительную информацию о группе.</VersionBlock>


<VersionBlock lastVersion="1.9">
<File name='models/marts/finance/finance.yml'>

```yaml
groups:
  - name: finance
    owner:
      # 'name' or 'email' is required; additional properties allowed
      email: finance@jaffleshop.com
      slack: finance-data
      github: finance-data-team
```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.10">
<File name='models/marts/finance/finance.yml'>

```yaml
groups:
  - name: finance
    owner:
      # 'name' or 'email' is required; additional properties will no longer be allowed in a future release
      email: finance@jaffleshop.com
    config:
      meta: # optional
        data_owner: Finance team
```

</File>
</VersionBlock>
