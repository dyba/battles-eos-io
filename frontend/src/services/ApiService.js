import { Api, JsonRpc, JsSignatureProvider } from 'eosjs';

async function takeAction(action, dataValue) {
  const privateKey = localStorage.getItem("cardgame_key");
  const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
  const signatureProvider = new JsSignatureProvider([privateKey]);
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  try {
    const resultWithConfig = await api.transact({
      actions: [{
        account: process.env.REACT_APP_EOS_CONTRACT_NAME,
        name: action,
        authorization: [{
          actor: localStorage.getItem("cardgame_account"),
          permission: 'active'
        }],
        data: dataValue
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    });

    return resultWithConfig;
  } catch (err) {
    throw(err);
  }
}

class ApiService {

  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem("cardgame_account")) {
        return reject();
      }
      takeAction("login", { username: localStorage.getItem("cardgame_account") })
        .then(() => {
          resolve(localStorage.getItem("cardgame_account"));
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  static startGame() {
    return takeAction("startgame", { username: localStorage.getItem("cardgame_account") });
  }

  static playCard(cardIdx) {
    return takeAction("playcard", {
      username: localStorage.getItem("cardgame_account"),
      player_card_idx: cardIdx
    });
  }

  static login({ username, key }) {
    return new Promise((resolve, reject) => {
      localStorage.setItem("cardgame_account", username);
      localStorage.setItem("cardgame_key", key);

      takeAction("login", { username: username })
        .then(() => {
          resolve();
        })
        .catch(err => {
          localStorage.removeItem("cardgame_account");
          localStorage.removeItem("cardgame_key");
          reject(err);
        });
    });
  }

  static async getUserByName(username) {
    try {
      const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const result = await rpc.get_table_rows({
        json: true,
        code: process.env.REACT_APP_EOS_CONTRACT_NAME,
        scope: process.env.REACT_APP_EOS_CONTRACT_NAME,
        table: "users",
        limit: 1,
        lower_bound: username
      });
      return result.rows[0];
    } catch (err) {
      console.error(err);
    }
  }
}

export default ApiService;
