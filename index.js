const { hashData, getPublicAddress, extractSignature } = require("./scripts/generator.js");
const { secp256k1, Signature } = require("ethereum-cryptography/secp256k1");
const {
  utf8ToBytes,
  toHex,
  hexToBytes,
} = require("ethereum-cryptography/utils");

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3045;

app.use(cors());
app.use(express.json());

const balances = {
  "d71529ccb5dbe3c2c14ec5a406dcd6aeffe12d5b": 100,
  "fa73616d452236f2293d1aa7931008f6a8760113": 50,
  "6c2055e02316c1851fafacd929846444a09204be": 75,
};

const publicKeys = {
  "d71529ccb5dbe3c2c14ec5a406dcd6aeffe12d5b": "0252d43e5099edfef3fc01cdabaa310fcebed2994e7ee80cd873ec5201e4083bb5",
  "fa73616d452236f2293d1aa7931008f6a8760113": "039737d279bc55e18f95accb915ee2aefbb36eee0a7b31b24f0a1eb2bd0fb88c66",
  "6c2055e02316c1851fafacd929846444a09204be": "022d0bb52f3e3190abeac519b536db88e231096537df07a1d00298f17270725f9c"
}

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// app.get("/getBalance/:signature", (req, res) => {
//   const { signature } = req.params;
//   const signatureObject = extractSignature(signature);
//   console.log(signatureObject);
//   console.log(secp256k1.verify(signatureObject, hashData("20"), "022d0bb52f3e3190abeac519b536db88e231096537df07a1d00298f17270725f9c"))
//   const publicKey = Object.values(publicKeys).filter((publicKey)=>secp256k1.verify(signatureObject, hashData("20"), publicKey)?publicKey:0)[0];
//   console.log("Retreived Public Key", publicKey);
//   const publicAddress = toHex(getPublicAddress(hexToBytes(publicKey)));
//   console.log(publicAddress);
//   const balance = balances[publicAddress] || 0;
//   res.send({ balance, publicAddress });
// });

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const signatureObj = extractSignature(signature);
  const publicKey = publicKeys[sender]||false;

  if (!publicKey) {
    res.status(400).send({message: "Invalid public address!"})
  }

  isValid = secp256k1.verify(
    signatureObj, 
    hashData(`Sending ${amount}!`), 
    hexToBytes(publicKey)
    );
  
  if (isValid) {
    setInitialBalance(sender);
    setInitialBalance(recipient);
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ 
        balance: balances[sender]
      });
    }
  } else {
    res.status(401).send({ 
      message: "Verification failed!",
      amount: amount,
      recipient: recipient,
      signature: signature
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

// Export the Express API
module.exports = app;