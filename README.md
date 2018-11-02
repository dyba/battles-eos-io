# Setup

Pull the eos-dev docker image:

```
docker pull eosio/eos-dev:v1.3.0
```

Create a local network:

```
docker network create eosdev
```

Create the Nodeos container:

```
docker run --name nodeos \
    -d -p 8888:8888 \
    --network eosdev \
    -v /tmp/eosio/work:/work \
    -v /tmp/eosio/data:/mnt/dev/data \
    -v /tmp/eosio/config:/mnt/dev/config \
    --mount type=bind,source=$(pwd)/contracts,target=/app \
    eosio/eos-dev:v1.3.2  \
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
docker run -d \
    --name keosd \
    --network=eosdev \
    -i eosio/eos-dev:v1.3.0 \
    /bin/bash -c "keosd --http-server-address=0.0.0.0:9876"
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
[Development Wallet](https://developers.eos.io/eosio-home/v1.3.0/docs/wallets)

```
cleos wallet import -n default
```

Create your account:

```
cleos create account eosio NEW_ACCOUNT OWNER_KEY ACTIVE_KEY 
```

Next, publish your contract:

```
cleos set contract ACCOUNT_NAME cardgame app cardgame.wasm cardgame.abi
```

The first argument is the account name where the contract will be deployed, the second argument is the name of the contract, the third argument is the directory where your contract lives in your project, the fourth and fifth are the WASM and ABI files respectively.

Now you can execute actions on your contract:

```
cleos push action cardgame login '["ACCOUNT_NAME"]' -p ACCOUNT_NAME@active
```

## How Tos

### Starting and Stopping Containers

```
docker container start keosd
docker container start nodeos
```

### Using Docker Bind Mounts, or "How Do I Get My Source Files Into a Docker Container?"

See [Docker Bind Mounts](https://docs.docker.com/storage/bind-mounts/#start-a-container-with-a-bind-mount)

```
docker run -d \
    --name keosd \
    --network=eosdev \
    --mount type=bind,source="$(pwd)"/contracts,target=/app \
    -i eosio/eos-dev:v1.3.0 \
    /bin/bash -c "keosd --http-server-address=0.0.0.0:9876"
```


### Keep an open bash session in a Docker Container

```
docker container exec -it nodeos /bin/bash
```

## Troubleshooting

```
Reading WASM from cardgame.wasm/cardgame.abi...
Error 3160009: No wast file found
Error Details:
no wasm file found cardgame.wasm/cardgame.abi
```

This happens because you're using `cleos` as an alias: your wasm and abi files are on your host machine and not in the `keosd` Docker container. Use bind mounts. See above.

### Does Your Account Exist?

```
cleos get account ACCOUNT_NAME
```

```
2018-11-01T17:49:35.721 thread-0   main.cpp:3143                 main                 ] Failed with error: unspecified (0)
```

The above error indicates your account doesn't exist


### Did You Unlock Your Wallet?

```
cleos --url http://localhost:8888 --wallet-url http://172.18.0.2:9876 set contract ACCOUNT_NAME app cardgame.wasm cardgame.abi
```

```
Failed to get existing code hash, continue without duplicate check...
Reading WASM from app/cardgame.wasm...
Publishing contract...
Error 3090003: Provided keys, permissions, and delays do not satisfy declared authorizations
Ensure that you have the related private keys inside your wallet and your wallet is unlocked.
```

### What A Successful Published Contract Looks Like

```
cleos --url http://localhost:8888 --wallet-url http://172.18.0.2:9876 set contract ACCOUNT_NAME app cardgame.wasm cardgame.abi
```

```
Reading WASM from app/cardgame.wasm...
Publishing contract...
executed transaction: d70d70b6bb29ab4d540e013ad4f9da9f119298f1c2c480e1840aa47bd1315273  2704 bytes  11362 us
#         eosio <= eosio::setcode               {"account":"fuschia","vmtype":0,"vmversion":0,"code":"0061736d0100000001560f60027f7e0060000060017e00...
#         eosio <= eosio::setabi                {"account":"fuschia","abi":"0e656f73696f3a3a6162692f312e300000000000000000"}
warning: transaction executed locally, but may not be confirmed by the network yet    ]
```

### Contracts Must Belong To An Account

https://developers.eos.io/eosio-home/docs/data-persistence#section-step-11-deploy-the-contract

```
cleos create key --to-console
cleos create account eosio CONTRACT_NAME YOUR_PUBLIC_KEY
```

### My ABI is empty

Run the compile command *inside* the `contracts` directory. Don't reference any outside directories. 
