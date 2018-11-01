# Setup

Pull the eos-dev docker image:

```
docker pull eosio/eos-dev:v1.2.5
```

Create a local network:

```
docker network create eosdev
```

Create the Nodeos container:

```
docker run --name nodeos -d -p 8888:8888 --network eosdev \
-v /tmp/eosio/work:/work -v /tmp/eosio/data:/mnt/dev/data \
-v /tmp/eosio/config:/mnt/dev/config eosio/eos-dev:v1.2.5  \
/bin/bash -c "nodeos -e -p eosio --plugin eosio::producer_plugin \
--plugin eosio::history_plugin --plugin eosio::chain_api_plugin \
--plugin eosio::history_api_plugin \
 --plugin eosio::http_plugin -d /mnt/dev/data \
--config-dir /mnt/dev/config \
--http-server-address=0.0.0.0:8888 \
--access-control-allow-origin=* --contracts-console --http-validate-host=false"
```

Run the Keosd container:

```
docker run -d --name keosd --network=eosdev \
-i eosio/eos-dev:v1.2.5 /bin/bash -c "keosd --http-server-address=0.0.0.0:9876"
```

Verify your installation:

```
docker logs --tail 10 nodeos
```

Open nodeos shell:

```
docker exec -it keosd bash
```

List all wallets:

```
cleos --wallet-url http://127.0.0.1:9876 wallet list keys
```

Check the nodeos endpoints:

```
curl http://localhost:8888/v1/chain/get_info
```

Inspect the ip address for the keosd container:

```
docker network inspect eosdev
```

Use the ip address of the keosd container and create an alias for cleos:

```
alias cleos='docker exec -it nodeos /opt/eosio/bin/cleos --url http://127.0.0.1:8888 --wallet-url http://172.18.0.3:9876'
```

Create a wallet:

```
cleos wallet create --to-console
```

Don't forget to save the master password for the default wallet!

To list all keys:

```
cleos wallet keys
```

To create keys:

```
cleos create key --to-console
```

Do this twice!

Next, import both keys:

```
cleos wallet import --private-key PRIVATE_KEY1
cleos wallet import --private-key PRIVATE_KEY2
```

Make sure you select the private key and not the public key, otherwise, you'll get an error.

Verify that you've imported your key:

```
cleos wallet keys
```

You'll now see your public key. To see your private key:

```
cleos wallet private_keys --password YOUR_WALLET_PASSWORD
```

Now, to create your account, you must first unlock the wallet:

```
cleos wallet unlock -n WALLET_NAME -p WALLET_PASSWORD
```

Don't forget to import the private key for eosio to your default wallet:

```
cleos wallet import -n default
```

Create your account:

```
cleos create account eosio NEW_ACCOUNT OWNER_KEY ACTIVE_KEY 
```
