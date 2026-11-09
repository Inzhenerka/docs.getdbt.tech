Группы определяются в файлах `.yml` внутри ключа `groups:`. В версии 1.10 и выше можно добавить `description` и конфигурацию `meta`, чтобы указать дополнительную информацию о группе.


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
    description: "All finance-related models owned by the Finance team." # optional
    owner:
      # 'name' or 'email' is required; additional properties will no longer be allowed in a future release
      email: finance@jaffleshop.com
    config:
      meta: # optional
        data_owner: Finance team
        cost_center: finance
        data_classification: sensitive
```

</File>
</VersionBlock>
