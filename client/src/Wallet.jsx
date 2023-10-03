import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  //sign,
  //setSign,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    //const sign = evt.target.value;
    setPrivateKey(privateKey);
    //setSign(sign);
    const address = toHex(secp256k1.getPublicKey(privateKey));
    //const address = secp256k1.getPublicKey(privateKey); b
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Paste the private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div>Address : 0x{address.slice(0, 100)}...</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
