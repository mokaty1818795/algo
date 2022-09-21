
import algosdk from "algosdk"
import dotenv from "dotenv";
dotenv.config();
let recoveredAccount1 = algosdk.mnemonicToSecretKey(process.env.ACCOUNT_MNEMONIC);
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
  'X-API-Key': process.env.API_KEY
}

const algodClient = new algosdk.Algodv2(token, baseServer, port);


let params = await algodClient.getTransactionParams().do();
let note = undefined; // arbitrary data to be stored in the transaction; here, none is stored
let addr = recoveredAccount1.addr;   
let defaultFrozen = false
let decimals = 0;   
let totalIssuance =10;
let unitName = "";
let assetName = "Lgcse Certificate";
let assetURL = "https://aca-burger-app.herokuapp.com/";
let assetMetadataHash = undefined;
let manager = undefined;
let reserve = undefined;
let freeze = undefined;    
let clawback = undefined;

// signing and sending "txn" allows "addr" to create an asset
(async () => {

  let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
    addr,
    note,
    totalIssuance,
    decimals,
    defaultFrozen,
    manager,
    reserve,
    freeze,
    clawback,
    unitName,
    assetName,
    assetURL,
    assetMetadataHash,
    params);

  let rawSignedTxn = txn.signTxn(recoveredAccount1.sk)
  let tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());

  let assetID = null;
  const ptx = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
  assetID = ptx["asset-index"];
  console.log("Transaction " + tx.txId + " confirmed in round " + ptx["confirmed-round"]);
})().catch(e =>{
  console.log(e);
})
