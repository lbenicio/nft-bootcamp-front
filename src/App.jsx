import "./styles/App.css"
import twitterLogo from "./assets/twitter-logo.svg"
import capybara from "./assets/capybara.jpg"
import React, { useEffect, useState } from "react"
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json";

// Constants
const TWITTER_HANDLE = "lbenicio_"
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`
const OPENSEA_LINK = "https://testnets.opensea.io/collection/chavesnft-31"
const CONTRACT_ADDRESS = "0x47224EB775d7ce89D1BC37ea9C9b42292b10Ba11";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isCoinProgress, setIsCoinProgress] = useState(false);
  const [totalMintCount, setTotalMintCount]  = useState(1);
  
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log("Will open the wallet now to pay the gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        setIsCoinProgress(true);
        console.log("Coin..... wait please!");
        await nftTxn.wait();
        console.log(
          `Coined, check out the transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
        setIsCoinProgress(false);
      } else {
        console.log("Etherium object does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Setup do listener.
  const setupEventListener = async () => {
    // é bem parecido com a função
    try {
      const { ethereum } = window

      if (ethereum) {
        // mesma coisa de novo
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        // Aqui está o tempero mágico.
        // Isso essencialmente captura nosso evento quando o contrato lança
        // Se você está familiar com webhooks, é bem parecido!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(
            `Olá pessoal! Já cunhamos seu NFT. Pode ser que esteja branco agora. Demora no máximo 10 minutos para aparecer no OpenSea. Aqui está o link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
          )
          setTotalMintCount(totalMintCount+1)
        })

        console.log("Setup event listener!")
      } else {
        console.log("Objeto ethereum não existe!")
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  // Render Methods
  const renderMinigGif = () => {
    <img src="./assets/mining.png" alt="mining"></img>
  }
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>Connect Wallet</button>
  )

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Certifique-se que você tem a MetaMask instalada!")
      return;
    } else {
      console.log("Temos o objeto ethereum!", ethereum)
    }
    
    const accounts = await ethereum.request({ method: "eth_accounts" });
    
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Encontrou uma conta autorizada:", account);
      setCurrentAccount(account);

      // Setup listener! Isso é para quando o usuário vem no site
      // e já tem a carteira conectada e autorizada
      setupEventListener()
    } else {
      console.log("Nenhuma conta autorizada foi encontrada");
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Baixe a MetaMask!");
        return;
      }
      
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      
      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);

      // Setup listener! Para quando o usuário vem para o site
      // e conecta a carteira pela primeira vez
      setupEventListener()
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <div className="capybara"><img src={capybara} alt="capybara" width="300px"></img></div>
          <span>Here a Capybara!</span>
          <p className="sub-text">🌊 Checkout my collection on <a href={OPENSEA_LINK}>Open Sea</a></p>
          <p className="sub-text">Mint Count: <span>{totalMintCount}</span></p>
          <p className="sub-text">Exclusives! Wonderfuls! Uniques! Find your NFT today.</p>
           {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              Coin NFT
            </button>
          )}
          { isCoinProgress === true ? (
              renderMinigGif()
            ) : null }
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`build with ❤️ by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  )
}

export default App
