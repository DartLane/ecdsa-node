const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const EthCrypto = require('eth-crypto');


app.use(cors());
app.use(express.json());

const balances = {
  "96977bc1865d418e942d26aaaa5872f3daadb2c2": 100,
  "72e10daa4d39a7a9d43fe602c91d9232ea2b4fea": 50,
  "cd5e3b62a0064b76e1d664e51d4aab17dfcc9971": 75,
};

const decoder = (key, value) => {
  if (key === "r" || key === "s") {
    return BigInt(value);
  }
  return value;
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { recipient, amount, message, signature } = req.body;

  const bMessage = utf8ToBytes(message);
  const hashedMessage = keccak256(bMessage);

  const signatureAux = JSON.parse(signature, decoder);
  const signatureObj = new secp.secp256k1.Signature(signatureAux.r, signatureAux.s, signatureAux.recovery);

  const publicKey = signatureObj.recoverPublicKey(hashedMessage);

  const sender2 = EthCrypto.publicKey.toAddress(publicKey.toHex());

  const sender = setInitialBalance(sender2.slice(2));
  const recipient2 = setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient2] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  for (const key of Object.keys(balances)) {
    if (key.toLocaleUpperCase() === address.toLocaleUpperCase()) {
      return key;
    }
  }

  balances[address] = 0;
  return address;
}
