<!--remove when the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection-->

#### Сообщения о совместимости пакетов

:::info Несоответствие предупреждений Fusion и логов `dbt-autofix`
Предупреждения <Constant name="fusion" /> и логи `dbt-autofix` могут содержать разные сообщения о совместимости пакетов.
:::

Если вы используете [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) при обновлении до <Constant name="fusion" /> в <Constant name="cloud_ide" /> или в расширении dbt для VS Code, вы можете увидеть различающиеся сообщения о совместимости пакетов между `dbt-autofix` и предупреждениями <Constant name="fusion" />.

Вот почему это происходит:
- Предупреждения <Constant name="fusion" /> формируются на основе параметра пакета `require-dbt-version` и того, содержит ли `require-dbt-version` версию `2.0.0`.
- Некоторые пакеты уже совместимы с <Constant name="fusion" />, даже если их мейнтейнеры ещё не обновили значение `require-dbt-version`.
- `dbt-autofix` знает о таких совместимых пакетах и не пытается обновлять пакет, если он уже считается совместимым.

Это означает, что даже если вы видите предупреждение <Constant name="fusion" /> для пакета, который `dbt-autofix` определяет как совместимый, вам не нужно менять этот пакет.

Расхождение в сообщениях является временным и будет устранено по мере внедрения и распространения улучшенного механизма определения совместимости из `dbt-autofix` в предупреждениях <Constant name="fusion" />.

Ниже приведён пример предупреждения <Constant name="fusion" /> в <Constant name="cloud_ide" />, которое сообщает, что пакет не совместим с <Constant name="fusion" />, тогда как `dbt-autofix` указывает, что он совместим:
```text
dbt1065: Package 'dbt_utils' requires dbt version [>=1.30,<2.0.0], but current version is 2.0.0-preview.72. This package may not be compatible with your dbt version. dbt(1065) [Ln 1, Col 1]
```
