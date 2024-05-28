const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak");


const privateKey = secp.secp256k1.utils.randomPrivateKey();

const publicKey = secp.secp256k1.getPublicKey(privateKey);

console.log('private key:', toHex(privateKey));

console.log('public key:', toHex(publicKey));

const publicKeyUncomp = secp.secp256k1.getPublicKey(privateKey, false);
console.log('public key - uncomp:', toHex(publicKeyUncomp));

const address = keccak256(publicKeyUncomp.slice(1)).slice(-20);
console.log('address            :', '0x' + toHex(address));