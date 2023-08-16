const { keccak256 } = require("ethereum-cryptography/keccak");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const {
  utf8ToBytes,
  toHex,
  hexToBytes,
} = require("ethereum-cryptography/utils");

function hashData(data) {
  return keccak256(utf8ToBytes(data));
}

function signData(data, privateKey) {
  hashedData = hashData(data);
  //   return secp256k1.sign(hashedData, privateKey, { recovered: true });
  return secp256k1.sign(hashedData, privateKey);
}

async function recoverKey(data, signature, recoveryBit) {
  return secp256k1.recoverPublicKey(hashData(data), signature, recoveryBit);
}

function getPublicAddress(publicKey) {
  keyHash = keccak256(publicKey.slice(1));
  return keyHash.slice(-20);
}


// Test

const privateKey = secp256k1.utils.randomPrivateKey();
const publicKey = secp256k1.getPublicKey(privateKey);
const publicAddress = getPublicAddress(publicKey);

// console.log("Private Key:", toHex(privateKey));
// console.log("Public Key:", toHex(publicKey));
// console.log("Public Address:", toHex(publicAddress));

// Private Key: 07c77813f97310d70f84a7780403cd6f643cbc269d16c4aa7081078a018912c3
// Public Key: 028fd1848a5f70728f879224de04005348a4bcfc918cef2c3c53a8b6149d6d6f84
// Public Address: 8aba914f6b7fee05c1d5374cf3c135eae2474b05

// console.log("Data Hash:", toHex(hashData("20")));
const signature = signData(
  "20",
  privateKey
);
// console.log("Signature:", signature);
// console.log(
//   "Sign Verified:",
//   secp256k1.verify(
//     signature,
//     hashData("20"),
//     publicKey
//   )
// );

// console.log(signature.r, signature.s);

// Data Hash: 731dc163f73d31d8c68f9917ce4ff967753939f70432973c04fd2c2a48148607
// Signature: Signature {
//   r: 83333512589823760804551731236966486108941038772322805657064965391917252413744n,
//   s: 53022503959961188670709310620288336723908460781931919839900790666311281271718n,
//   recovery: 1
// }
// Sign Verified: true
// 83333512589823760804551731236966486108941038772322805657064965391917252413744n

testSignString = `
Signature {
    r: 83333512589823760804551731236966486108941038772322805657064965391917252413744n,
    s: 53022503959961188670709310620288336723908460781931919839900790666311281271718n,
    recovery: 1
  }
`;
function extractSignature(signString) {
    let rStartIndex = signString.indexOf("r:")+2;
    let rEndIndex = signString.indexOf(",")-1;
    let sStartIndex = signString.indexOf("s:")+2;
    let sEndIndex = signString.lastIndexOf(",")-1;
    let recoveryStartIndex = signString.indexOf("y:")+2;

    const r = signString.slice(rStartIndex,rEndIndex+1);
    const s = signString.slice(sStartIndex,sEndIndex+1);
    const recovery = signString.slice(recoveryStartIndex,signString.length-2).trim();

    const signature = new secp256k1.Signature(BigInt(r.slice(0,-1)), BigInt(s.slice(0,-1)), recovery);
    return signature;
}

// console.log(extractSignature(testSignString));

module.exports = {hashData, getPublicAddress, extractSignature, signData };