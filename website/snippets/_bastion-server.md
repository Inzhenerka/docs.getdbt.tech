Используйте SSH-туннель, если ваш экземпляр {props.redshift}{props.postgresalloydb} недоступен из общедоступной сети и доступ к нему должен осуществляться через [бастионный сервер](/docs/platform/connect-data-platform/connect-redshift#about-the-bastion-server-in-aws). Если эта функция включена, <Constant name="dbt_platform" /> подключается к вашей базе данных, сначала устанавливая защищённое соединение с бастионным сервером, который затем перенаправляет трафик в вашу базу данных.

Чтобы настроить подключение через SSH-туннель:

1. Перейдите в **Account settings** (нажав на название своей учётной записи в левом боковом меню) и выберите **Connections**.
2. Выберите существующее подключение для редактирования или нажмите **+ New connection**.
3. В разделе **Connection settings** убедитесь, что установлен флажок **SSH Tunnel Enabled**.
4. Введите имя хоста, имя пользователя и порт бастионного сервера.

<Lightbox
  src="/img/docs/dbt-platform/platform-configuring-dbt-platform/postgres-redshift-ssh-tunnel.png"
  width="70%"
  title="Открытый ключ генерируется после сохранения"
/>

5. Нажмите **Save**. <Constant name="dbt_platform" /> сгенерирует и отобразит открытый ключ.
6. Скопируйте новый открытый ключ на бастионный сервер и добавьте его в файл `authorized_keys` сервера, чтобы разрешить <Constant name="dbt_platform" /> подключаться через бастионный сервер. Если новый ключ не добавлен, установить соединение через SSH-туннель не удастся.


    :::important
    Каждый раз, когда вы создаёте и сохраняете новое подключение через SSH-туннель, <Constant name="dbt_platform" /> генерирует уникальную пару SSH-ключей, даже если параметры подключения полностью совпадают с параметрами существующего подключения.
    :::

#### О бастионном сервере в AWS {#about-the-bastion-server-in-aws}

<details>
  <summary>Что такое бастионный сервер?</summary>
  <div>
    <div>
Бастионный сервер в <a href="https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/">Amazon Web Services (AWS)</a> — это хост, который позволяет <Constant name="dbt" /> устанавливать SSH-соединение.
      
      <br></br>
    
      <Constant name="dbt" /> только отправляет запросы и не передаёт большие объёмы данных. Это означает, что бастионный сервер может работать на инстансе AWS любого размера, например t2.small или t2.micro.<br></br><br></br>
    
      Убедитесь, что инстанс расположен в той же Virtual Private Cloud (VPC), что и экземпляр {props.redshift}{props.postgres}, и что для группы безопасности bastion‑сервера настроены правила, позволяющие подключаться к порту хранилища данных.
    </div>
  </div>
</details>


#### Настройка bastion‑сервера в AWS {#configuring-the-bastion-server-in-aws}

Чтобы настроить SSH-туннель в <Constant name="dbt" />, вам потребуется указать имя хоста или IP-адрес вашего бастионного сервера, имя пользователя и выбранный вами порт, к которому будет подключаться <Constant name="dbt" />. Выполните следующие действия:

1. Убедитесь, что правила сетевой безопасности бастионного сервера разрешают подключения с [IP-адресов <Constant name="dbt" />](/docs/platform/about-platform/access-regions-ip-addresses) через настроенный вами порт.
2. Настройте учетную запись пользователя с помощью интерфейса командной строки (CLI) экземпляра бастионного сервера. В следующем примере используется имя пользователя `dbtcloud`:
    
    ```shell
    sudo groupadd dbtcloud
    sudo useradd -m -g dbtcloud dbtcloud
    sudo su - dbtcloud
    mkdir ~/.ssh
    chmod 700 ~/.ssh
    touch ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    ```  

3. Скопируйте открытый ключ, сгенерированный <Constant name="dbt" />, и вставьте его в файл authorized_keys.

Теперь бастионный сервер должен быть готов к использованию <Constant name="dbt" /> в качестве туннеля для подключения к среде {props.redshift}{props.postgres}.
