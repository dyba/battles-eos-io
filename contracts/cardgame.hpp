#include <eosiolib/eosio.hpp>

using namespace std;

class [[eosio::contract]] cardgame : public eosio::contract {

public:
  cardgame(eosio::name receiver, eosio::name code,
           eosio::datastream<const char *> ds)
      : contract(receiver, code, ds), _users(receiver, code.value),
        _seed(receiver, code.value){};

  [[eosio::action]] void login(eosio::name username);

  [[eosio::action]] void startgame(eosio::name username);

  [[eosio::action]] void playcard(eosio::name username, uint8_t player_card_idx);

private:
  enum game_status : int8_t { ONGOING = 0, PLAYER_WON = 1, PLAYER_LOST = -1 };

  enum card_type : uint8_t {
    EMPTY = 0,
    FIRE = 1,
    WOOD = 2,
    WATER = 3,
    NEUTRAL = 4,
    VOID = 5
  };

  struct card {
    uint8_t type;
    uint8_t attack_point;
  };

  typedef uint8_t card_id;

  const map<card_id, card> card_dict = {
      {0, {EMPTY, 0}},    {1, {FIRE, 1}},   {2, {FIRE, 1}},   {3, {FIRE, 2}},
      {4, {FIRE, 2}},     {5, {FIRE, 3}},   {6, {WOOD, 1}},   {7, {WOOD, 1}},
      {8, {WOOD, 2}},     {9, {WOOD, 2}},   {10, {WOOD, 3}},  {11, {WATER, 1}},
      {12, {WATER, 1}},   {13, {WATER, 2}}, {14, {WATER, 2}}, {15, {WATER, 3}},
      {16, {NEUTRAL, 3}}, {17, {VOID, 0}}};

  struct game {
    int8_t status = ONGOING;
    int8_t life_ai = 5;
    int8_t life_player = 5;
    vector<card_id> deck_player = {1,  2,  3,  4,  5,  6,  7,  8, 9,
                                   10, 11, 12, 13, 14, 15, 16, 17};
    vector<card_id> deck_ai = {1,  2,  3,  4,  5,  6,  7,  8, 9,
                               10, 11, 12, 13, 14, 15, 16, 17};
    vector<card_id> hand_player = {0, 0, 0, 0};
    vector<card_id> hand_ai = {0, 0, 0, 0};
    card_id selected_card_player = 0;
    card_id selected_card_ai = 0;
    uint8_t life_lost_player = 0;
    uint8_t life_lost_ai = 0;
  };

  struct seed {
    uint64_t key = 1;
    uint32_t value = 1;

    auto primary_key() const { return key; }
  };

  struct [[eosio::table]] user {
    eosio::name key;
    uint16_t win_count = 0;
    uint16_t lost_count = 0;
    game game_data;

    uint64_t primary_key() const { return key.value; }
  };

  typedef eosio::multi_index<"users"_n, user> user_index;

  typedef eosio::multi_index<"seed"_n, seed> seed_index;

  user_index _users;

  seed_index _seed;

  void draw_one_card(vector<uint8_t> & deck, vector<uint8_t> & hand);

  int random(const int range);
};
