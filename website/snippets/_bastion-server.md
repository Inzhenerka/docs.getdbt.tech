Чтобы подключиться к экземпляру {props.redshift}{props.postgresalloydb} через SSH‑туннель, при создании подключения выберите опцию **Use SSH Tunnel**. При настройке туннеля необходимо указать hostname, имя пользователя и порт для [bastion‑сервера](#about-the-bastion-server-in-aws).

После сохранения подключения для него будет сгенерирован и отображён публичный ключ. Вы можете скопировать этот публичный ключ на bastion‑сервер, чтобы авторизовать <Constant name="cloud" /> для подключения к вашей базе данных через bastion‑сервер.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" width="70%" title="Открытый ключ создаётся после сохранения"/>

#### О бастионном сервере в AWS {#about-the-bastion-server-in-aws}

<details>
  <summary>Что такое бастионный сервер?</summary>
  <div>
    <div>
      Bastion‑сервер в <a href="https://aws.amazon.com/blogs/security/how-to-record-ssh-sessions-established-through-a-bastion-host/">Amazon Web Services (AWS)</a> — это хост, который позволяет <Constant name="cloud" /> устанавливать SSH‑соединение.
      
      <br></br>
    
      <Constant name="cloud" /> отправляет только запросы и не передаёт большие объёмы данных. Это означает, что bastion‑сервер может работать на AWS‑инстансе практически любого размера, например t2.small или t2.micro.<br></br><br></br>
    
      Убедитесь, что инстанс расположен в той же Virtual Private Cloud (VPC), что и экземпляр {props.redshift}{props.postgres}, и что для группы безопасности bastion‑сервера настроены правила, позволяющие подключаться к порту хранилища данных.
    </div>
  </div>
</details>


#### Настройка bastion‑сервера в AWS {#configuring-the-bastion-server-in-aws}

Чтобы настроить SSH‑туннель в <Constant name="cloud" />, вам нужно указать hostname/IP вашего bastion‑сервера, имя пользователя и порт (на ваш выбор), к которому будет подключаться <Constant name="cloud" />. Выполните следующие шаги:

1. Убедитесь, что сетевые правила безопасности bastion‑сервера настроены так, чтобы принимать подключения с [IP‑адресов <Constant name="cloud" />](/docs/cloud/about-cloud/access-regions-ip-addresses) на тот порт, который вы настроили.
2. Создайте пользовательскую учётную запись с помощью CLI инстанса bastion‑сервера. В следующем примере используется имя пользователя `dbtcloud`:
    
    ```shell
    sudo groupadd dbtcloud
    sudo useradd -m -g dbtcloud dbtcloud
    sudo su - dbtcloud
    mkdir ~/.ssh
    chmod 700 ~/.ssh
    touch ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    ```  

3. Скопируйте и вставьте сгенерированный <Constant name="cloud" /> публичный ключ в файл `authorized_keys`.

После этого bastion‑сервер будет готов к использованию <Constant name="cloud" /> в качестве туннеля для подключения к окружению {props.redshift}{props.postgres}.
