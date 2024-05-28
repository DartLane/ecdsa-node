const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const EthCrypto = require('eth-crypto');

const PRIVATE_KEY = '6323cf4014ba72052a462b7ed5032cc8dc9b7e18556b7f20b161711801da2776';
const message = 'message';

//const privateKey = secp.secp256k1.utils.randomPrivateKey();

const publicKey = secp.secp256k1.getPublicKey(PRIVATE_KEY);

console.log('private key:', PRIVATE_KEY);

console.log('public key:', toHex(publicKey));

const publicKeyUncomp = secp.secp256k1.getPublicKey(PRIVATE_KEY, false);
console.log('public key - uncomp:', toHex(publicKeyUncomp));

const address = keccak256(publicKeyUncomp.slice(1)).slice(-20);
console.log('address            :', '0x' + toHex(address));

const bMessage = utf8ToBytes(message);
const hashedMessage = keccak256(bMessage);

const signature = secp.secp256k1.sign(hashedMessage, PRIVATE_KEY);

const jsonReplacer = (key, value) => typeof value === "bigint" ? value.toString() : value;

const testSign = JSON.stringify(signature, jsonReplacer);

console.log(signature);

console.log(testSign);

const decoder = (key, value) => {
    if (key === "r" || key === "s") {
        return BigInt(value);
    }
    return value;
};

const sign = JSON.parse(testSign, decoder);

const construcSign = new secp.secp256k1.Signature(sign.r, sign.s, sign.recovery);

console.log(construcSign);

console.log(secp.secp256k1.verify(construcSign, hashedMessage, publicKey));

const pk = signature.recoverPublicKey(hashedMessage);

console.log(pk.toHex());

const address2 = EthCrypto.publicKey.toAddress(pk.toHex());
console.log('address            :', address2);