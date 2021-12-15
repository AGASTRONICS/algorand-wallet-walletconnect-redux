import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import algosdk from "algosdk";
import { useSelector } from 'react-redux';
import { reset, setConnected, onConnect, onSessionUpdate, killSession, selectConnector, selectAssets, selectAddress, getAccountAssets, selectChain, selectConnected, walletConnectInit, switchChain, setFetching, selectFetching } from '../../features/walletConnectSlice';
import AccountAssets from '../AccountAssets';
import LoadingIcon from '../LoadingIcon';


const SiteBody: React.FC = () => {

  const [selectedRadioBtn, setSelectedRadioBtn] = useState('');
  const [amount, setAmount] = useState('');

  const assets = useSelector(selectAssets);
  const loading = useSelector(selectFetching);
  const addr = useSelector(selectAddress);
  const receiver = ''
  if(selectedRadioBtn == 'Badmos'){
    const receiver = "HNYT2Z3DD55ZH463QISM3XP5ZTC7LCM44HAIHC5QZZLPJS2RDDPFSVALOQ";
  }
  else{
    const receiver = "77L5JXCEOYJX6573EIUOHC2ITXIDLNNWQGMS46OCQBGT6C6Y5TOWMNFYWI";
  }

  
  const isRadioSelected = (value: string): boolean => selectedRadioBtn === value;

  const handleRadioClick = (e: React.ChangeEvent<HTMLInputElement>): void => setSelectedRadioBtn(e.currentTarget.value);
  

  async function vote(){
    try {
        
        localStorage.setItem("t" , "2");
        await keypress();
        // Connect your client
        const algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        const algodServer = 'http://localhost';
        const algodPort = 4001;
        const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

        // Construct the transaction
        const params = await algodClient.getTransactionParams().do();
        
        // receiver defined as TestNet faucet address 
        const enc = new TextEncoder();
        const note = enc.encode("Hello World");
        const amount = 1000000;
        const closeout = receiver; //closeRemainderTo
        const sender = addr;
        const txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, note, params);

        // Sign the transaction
        const signedTxn = txn.signTxn(addr);
        const txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);

        // Submit the transaction
        await algodClient.sendRawTransaction(signedTxn).do();

        // Wait for confirmation
        const confirmedTxn = await waitForConfirmation(algodClient, txId, 4);
        //Get the completed Transaction
        // console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        // let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
        // console.log("Transaction information: %o", mytxinfo);
        const string = new TextDecoder().decode(note);
        console.log("Note field: ", string);
        const accountInfo = await algodClient.accountInformation(addr).do();
    }
    catch (err) {
        console.log("err", err);
        window.location.reload();
    }
    process.exit();
    

  }
  
  return (
    <div className="site-body">
      <div className="site-body-inner">
        {loading ? 
          <LoadingIcon/>
          : <AccountAssets assets={assets}/>
        }
      </div>
      <div id="total_gov_coin" className="alert">
        <span className="closebtn">&times;</span>
    </div>
    <div id="error" className="alert">
        <span className="closebtn">&times;</span>
      </div>
      <div className="vd">

            <div className="wrapper">
                <header>VOTE YOUR CANDIDATE</header>
          <div className="poll-area">
            
              <input 
                type="radio" 
                name="poll" 
                id="opt1" 
                value="Badmos"
                className="Rad"
                checked={isRadioSelected("Badmos")}
                onChange={handleRadioClick}
              />
              
              <input 
                type="radio" 
                name="poll" 
                id="opt2" 
                value="Davide"
                className="Rad"
                checked={isRadioSelected("Davide")}
                onChange={handleRadioClick}
            />

            <label htmlFor="opt1">Badmos</label>
            <label htmlFor="opt2">Davide</label>

                <input 
                type="text" 
                id="amount"
                className="wallet-address"
                autoFocus
                name="from"
                placeholder="Amount of choice"
              />
              </div>
              
          <button className="button" onClick={vote}>Vote { selectedRadioBtn }</button>

            </div>
        </div>
      </div>
  );
}

export default SiteBody;

function waitForConfirmation(algodClient: algosdk.Algodv2, txId: string, arg2: number) {
  throw new Error("Function not implemented.");
}

const keypress = async () => {
    process.stdin.setRawMode(true)
    return new Promise(() => process.stdin.once('data', () => {
        process.stdin.setRawMode(false)
    })) 
}
