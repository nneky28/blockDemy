"use client"
///Connect Modal component

///Libraries -->
import styles from "./connectModal.module.scss"
import { useModalStore } from "@/config/store";
import { MouseEvent, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import trust from "@/public/images/trust.png"
import coinbase from "@/public/images/coinbase.png"
import metamask from "@/public/images/metamask.png"
import Image from "next/image";
import { connectToWallet,  connectTrust, connectCoinbase } from "@/config/utils";
import { Cartesify } from "@calindra/cartesify";
import { BrowserProvider, Eip1193Provider } from 'ethers';

///Commencing the code 

/**
 * @title Connect Modal Component
 * @returns The Connect Modal component
 */

const fetch = Cartesify.createFetch({
    dappAddress: '0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C',
    endpoints: {
      graphQL: new URL("http://localhost:8080/graphql"),
      inspect: new URL("http://localhost:8080/inspect"),
    },
  })
const ConnectModal = () => {

    const [result, setResult] = useState<string>("");
    const [signer, setSigner] = useState<any>(undefined)
    const [loading, setLoading] = useState(false);

    const setModal = useModalStore(state => state.setModal);
    //const modal = useModalStore(state => state.modal);   

    ///This function is triggered when the background of the modal is clicked
    const closeModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void => {
        e.preventDefault()

        setModal(false)
        //console.log("modal closed")
    }

    ///This function is triggered when a wallet is clicked
    const connectWallet = async(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, wallet: string): Promise<void> => {
        e.preventDefault()

        if (wallet === "metamask") {
           
                try {
                  window.ethereum.request({ method: "eth_requestAccounts" })
                  .then(async () => {
                    const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
                    const signer = await provider.getSigner();
                    setSigner(signer);
                  })
              
                } catch(error) {
                  console.log(error);
                  alert("Connecting to metamask failed.");
                }
              
            // connectMetamask()
        } else if (wallet === "coinbase") {
            connectCoinbase()
        } else if (wallet === "trust") {
            connectTrust()
        }
    }

    const callYourEndpoint = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        // Pass the event object directly to connectWallet
        
        await connectWallet(e, "metamask");
        setLoading(true);
    
        let results;
    
        const response = await fetch("http://127.0.0.1:8383/your-endpoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ example: "Your body" }),
            signer // Ensure signer is defined somewhere
        });
    
        results = await response.json();
        setLoading(false);
        setResult(JSON.stringify(results));
    };

    let buttonProps:any = {}
    if(loading) buttonProps.isLoading = true

  return (
    <div className={styles.main}>
       <div className={styles.header}>
            <span>Sign up or Log in</span>
            <button onClick={(e) => closeModal(e)}>
                <CloseIcon className={styles.icon} />
            </button>
       </div>
       <span className={styles.brief}>Connect a wallet to continue</span>
       <div className={styles.wallets}>
            <button {...buttonProps} className={styles.wallet1} onClick={callYourEndpoint}>
                <Image 
                    className={styles.image}
                    alt=""
                    src={metamask}
                />
                <span>Metamask Wallet</span>
            </button>
            <button className={styles.wallet2} onClick={(e) => connectWallet(e, "coinbase")}>
                <Image 
                    className={styles.image}
                    alt=""
                    src={coinbase}
                />
                <span>Coinbase Wallet</span>
            </button>
            <button className={styles.wallet3} onClick={(e) => connectWallet(e, "trust")}>
                <Image 
                    className={styles.image}
                    alt=""
                    src={trust}
                />
                <span>Trust Wallet</span>
            </button>
       </div>
    </div>
  );
};

export default ConnectModal;