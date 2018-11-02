#include "gameplay.cpp"

void cardgame::login(eosio::name user) {
  require_auth(user);

  auto user_iterator = _users.find(user.value);
  if (user_iterator == _users.end()) {
    user_iterator =
        _users.emplace(user, [&](auto &new_user) { new_user.key = user; });
  }
}

EOSIO_DISPATCH(cardgame, (login))
