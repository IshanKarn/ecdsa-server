const { signData } = require("./generator");
const { hexToBytes} = require("ethereum-cryptography/utils");

const prompt = require('prompt-sync')();

const amount = prompt('Amount: ');
const privateKey = prompt('Private Key: ');

const message = `Sending ${amount}!`
const signature = signData(message, hexToBytes(privateKey));

console.log("\nCopy below signature for transaction:")
console.log(signature)


// Test Private Key: 
// c41d8451c6ef4d616ba768a152ff7b7f5406908fa4963dae264c6aa3cf1f9ab3
// Test Public Key: 
// 022d0bb52f3e3190abeac519b536db88e231096537df07a1d00298f17270725f9c