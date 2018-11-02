#!/bin/sh

account_name=""
dir=""

while getopts ":n:d:" opt; do
    case ${opt} in
        n)
            account_name=$OPTARG
            ;;
        d)
            dir=$OPTARG
            ;;
    esac
done


[ -z "$account_name" ] && echo "name must be provided" && exit 1
[ -z "$dir" ] && echo "dir must be provided" && exit 1

source cleos-alias.sh

cleos set contract $account_name $dir cardgame.wasm cardgame.abi
