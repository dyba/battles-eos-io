#include "gameplay.cpp"

void cardgame::login(eosio::name user) {
  require_auth(user);

  auto user_iterator = _users.find(user.value);
  if (user_iterator == _users.end()) {
    user_iterator =
        _users.emplace(user, [&](auto &new_user) { new_user.key = user; });
  }
}

void cardgame::startgame(eosio::name user) {
  require_auth(user);

  auto &user_record = _users.get(user.value, "User doesn't exist");

  _users.modify(user_record, user, [&](auto &modified_user) {
    game game_data;

    for (uint8_t i = 0; i < 4; i++) {
      draw_one_card(game_data.deck_player, game_data.hand_player);
      draw_one_card(game_data.deck_ai, game_data.hand_ai);
    }

    modified_user.game_data = game_data;
  });
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

void cardgame::playcard(eosio::name user, uint8_t player_card_idx) {
  require_auth(user);

  eosio_assert(player_card_idx < 4, "playcard: Invalid hand index");

  auto &user_record = _users.get(user.value, "User doesn't exist");

  eosio_assert(user_record.game_data.status == ONGOING,
               "playcard: This game has ended. Please start a new one.");

  eosio_assert(user_record.game_data.selected_card_player == 0,
               "playcard: The player has played his card this turn!");

  _users.modify(user_record, user, [&](auto &modified_user) {
    game &game_data = modified_user.game_data;

    game_data.selected_card_player = game_data.hand_player[player_card_idx];
    game_data.hand_player[player_card_idx] = 0;
  });
}

EOSIO_DISPATCH(cardgame, (login)(startgame)(playcard))
