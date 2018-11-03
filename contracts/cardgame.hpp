#include <eosiolib/eosio.hpp>

using namespace std;

class[[eosio::contract]] cardgame : public eosio::contract {

public:
  cardgame(eosio::name receiver, eosio::name code,
           eosio::datastream<const char *> ds)
      : contract(receiver, code, ds), _users(receiver, 0){};

  [[eosio::action]] void login(eosio::name username);

private:
  struct[[eosio::table]] user {
    eosio::name key;
    uint16_t win_count = 0;
    uint16_t lost_count = 0;

    uint64_t primary_key() const { return key.value; }
  };

  typedef eosio::multi_index<"users"_n, user> users_table;

  users_table _users;
};
