Мы рекомендуем использовать формат PKCS#8 с шифрованием AES-256 для аутентификации с помощью пары ключей в <Constant name="fusion" />. <Constant name="fusion" /> не поддерживает устаревшее шифрование 3DES и форматы ключей без заголовка. Использование устаревших форматов ключей может привести к сбоям аутентификации.

Если вы столкнулись с ошибкой `Key is PKCS#1 (RSA private key). Snowflake requires PKCS#8`, ваш закрытый ключ имеет неверный формат. У вас есть два варианта:

- (Рекомендуемое решение) Повторно экспортируйте ключ с использованием современного шифрования:

  ```bash
  # Convert to PKCS#8 with AES-256 encryption
  openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes-256-cbc -inform PEM -out rsa_key.p8
  ```

- (Временное решение) Добавьте заголовок `BEGIN` и завершающую строку `END` к телу PEM:

  ```
  -----BEGIN ENCRYPTED PRIVATE KEY-----
  < Your existing encrypted private key contents >
  -----END ENCRYPTED PRIVATE KEY-----
  ```
