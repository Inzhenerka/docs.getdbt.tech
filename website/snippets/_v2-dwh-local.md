<Expandable alt_header="Apache Spark (только CLI)" lifecycle="beta" lifecycle_size="75">
    - Thrift
      - Простой уровень аутентификации и безопасности (SASL), механизм PLAIN
      - Без SASL (NOSASL) 
    - Livy
      - Базовая аутентификация (имя пользователя и пароль)
      - При развертывании в Amazon Web Services (AWS): AWS Signature Version 4
        - Поддерживается аутентификация с использованием единого входа, сервисных учетных записей или пользовательских токенов
  </Expandable>

  <Expandable alt_header="DuckDB (только CLI)">
    DuckDB не требует аутентификации &mdash; он работает локально на вашем компьютере.
  </Expandable>
