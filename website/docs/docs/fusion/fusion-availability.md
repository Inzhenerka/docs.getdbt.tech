---
title: "Доступность Fusion"
id: "fusion-availability"
description: "Узнайте, где доступен движок dbt Fusion."
hide_table_of_contents: true
---

import FusionAvailability from '/snippets/_fusion_availability.md';

<FusionAvailability/>

- Как и <Constant name="core" />, вы можете установить <Constant name="fusion" /> локально из [CLI](/docs/fusion/install-fusion-cli) для поддержки локальных рабочих процессов. Для более удобной разработки и интеллектуальных возможностей на базе LSP (обеспечиваемых <Constant name="fusion" />) [установите расширение VS Code](/docs/fusion/install-dbt-extension).
- <Constant name="fusion" /> в <Constant name="dbt_platform" /> доступен в рамках закрытого предварительного доступа (private preview). Чтобы использовать <Constant name="fusion" /> в <Constant name="dbt_platform" />, обратитесь к вашей аккаунт‑команде для получения доступа, а затем [обновите окружения до <Constant name="fusion_engine" />](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-fusion-engine), чтобы использовать его в ваших проектах.
  - Если ваш аккаунт не использует <Constant name="fusion_engine" />, вы работаете с <Constant name="dbt_platform" /> на основе традиционного Python‑движка <Constant name="core" />. В этом случае недоступны [возможности](/docs/fusion/supported-features#features-and-capabilities) <Constant name="fusion" />, такие как компиляция и парсинг до 30 раз быстрее, автодополнение, подсказки при наведении, встроенная подсветка ошибок и многое другое. Чтобы использовать <Constant name="fusion" />, обратитесь к вашей аккаунт‑команде для получения доступа.
