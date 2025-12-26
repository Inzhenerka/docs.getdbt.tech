Выполните следующую команду, заменив `<client-id>`, `<client-secret>`, `<application-ID-URI>` и `<tenant-id>` на ваши реальные значения:

```bash
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'client_id=<client-id> \
  &scope=<application-ID-URI>/.default \
  &client_secret=<client-secret> \
  &grant_type=client_credentials' \
  'https://login.microsoftonline.com/<tenant-id>/oauth2/v2.0/token'
```

В ответе будет содержаться `access_token`. Вы можете декодировать этот токен с помощью сервиса [jwt.io](https://jwt.io), чтобы посмотреть значение claim `sub`.
