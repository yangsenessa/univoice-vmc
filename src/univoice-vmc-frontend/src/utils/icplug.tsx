import { PlugMobileProvider } from '@funded-labs/plug-mobile-sdk'
import { isLocalNet } from '@/utils/env';
import {tokenLedegerIdlFactory} from '@/idl/icrc1.did.js';

import MobileProvider from '@funded-labs/plug-mobile-sdk/dist/src/MobileProvider';
import { Principal } from '@dfinity/principal';

const isDev = isLocalNet();
const isMobile = PlugMobileProvider.isMobileBrowser()
const walletConnectProjectId = '1e0a755a594cfe1d94e3617f12f5ae64'
if (isMobile) {
  const provider = new PlugMobileProvider({
    debug: isDev, // If you want to see debug logs in console
    walletConnectProjectId: walletConnectProjectId, // Project ID from WalletConnect console
    window: window,
  })
  provider.initialize().catch(console.log)
  if (!provider.isPaired()) {
    provider.pair().catch(console.log)
  }
}

 

export const plugReady = (): boolean => {
  if (isMobile) {
    return true;
  } else {
    const w = window as any;
    if (!w.ic || !w.ic.plug) {
      alert('请先安装plug钱包插件');
      return false;
    }
    return true;
  }
}

// Canister Ids
const tokenCanisterId  = 'jfqe5-daaaa-aaaai-aqwvq-cai';
// Whitelist
const whitelist = [
  tokenCanisterId,
];

// Host
const host = "https://mainnet.dfinity.network";

export const reConnectPlug = async (): Promise<string> => {
  if (!plugReady()) return '';
  console.log("Reconnect Plug wallet");
  const plug = (window as any).ic.plug;
  // 断开旧的连接
  try{
    // if (plug.principalId) {
    plug.disconnect()
    // }
  } catch (e) {
    console.log('disconnect ic plug exception!', e);
  }
  try {
    const publicKey = await plug.requestConnect({
      // whitelist,
      // host,
      timeout: 50000
    });
    return plug.principalId ? plug.principalId : '';
  } catch (e) {
    console.log('connect ic plug exception!', e);
    return '';
  }
}

export const callBalance = async (principal_id:string): Promise<String> => {
   if (!plugReady()) return "";
   const plug = (window as any).ic.plug;
   const principal = Principal.fromText(principal_id) ;
   console.log('ICRC ledger call principal =' + principal);    

   const account =  {'owner' : principal,'subaccount' : [] };
   await plug.requestConnect({
    whitelist,
   }); 

   const tokenActor = await plug.createActor({
      canisterId: tokenCanisterId,
      interfaceFactory: tokenLedegerIdlFactory,
   });
   // use our actors getSwapInfo method
   console.log('ICRC ledger call agent begin');    

   var tokensStr  = await tokenActor.icrc1_balance_of(account);
   console.log('ICRC ledger call agent end :' + tokensStr);    

   return tokensStr;
}


export const callBalanceInstance= async (principal_id:string): Promise<String> => {


  if (!plugReady()) return "";
  const plug = (window as any).ic.plug;
  if(!plug) {
     return ""
  }
  const principal = Principal.fromText(principal_id) ;
  console.log('ICRC ledger call principal =' + principal);    

  const account =  {'owner' : principal,'subaccount' : [] };
  var tokensStr = "";
  // requestConnect callback function
  console.log('ICRC ledger call onConnectionUpdate');    

   // rebuild actor and test by getting Sonic info
  const tokenActor = await plug.createActor({
        anisterId: tokenCanisterId,
        interfaceFactory: tokenLedegerIdlFactory,
  });
// use our actors getSwapInfo method
  console.log('ICRC ledger call agent');    

  const tokens = await tokenActor.icrc1_balance_of(account);
  console.log('ICRC ledger call: ', tokens);    
  tokensStr = tokens.toString();
  
  return tokensStr;
} 

// const getPrincipal = async (): Promise<string> => {
//   if (!plugReady()) return '';
//   const plug = (window as any).ic.plug;
//   // const isConnected = await plug.isConnected(); // 会弹出连接窗
//   return plug.principalId ? plug.principalId : '';
// }

export default reConnectPlug;