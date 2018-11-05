#include "cardgame.hpp"

int cardgame::random(const int range) {
  auto seed_iterator = _seed.begin();

  if (seed_iterator == _seed.end()) {
    seed_iterator = _seed.emplace(_self, [&](auto &seed) {});
  }

  int prime = 65537;
  auto new_seed_value = (seed_iterator->value + now()) % prime;

  _seed.modify(seed_iterator, _self,
               [&](auto &s) { s.value = new_seed_value; });

  int random_result = new_seed_value % range;
  return random_result;
}
