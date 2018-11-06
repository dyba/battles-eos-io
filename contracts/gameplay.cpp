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

void cardgame::draw_one_card(vector<uint8_t> &deck, vector<uint8_t> &hand) {
  int deck_card_idx = random(deck.size());

  int first_empty_slot = -1;
  for (int i = 0; i <= hand.size(); i++) {
    auto id = hand[i];

    if (card_dict.at(id).type == EMPTY) {
      first_empty_slot = i;
      break;
    }
  }

  eosio_assert(first_empty_slot != -1, "No empty slot in the player's hand");

  hand[first_empty_slot] = deck[deck_card_idx];

  deck.erase(deck.begin() + deck_card_idx);
}
