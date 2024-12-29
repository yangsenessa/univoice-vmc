import { univoice_vmc_backend } from 'declarations/univoice-vmc-backend';
import type {Result} from 'declarations/univoice-vmc-backend/univoice-vmc-backend.did';
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";
import { isLocalNet } from '@/utils/env';


// Mode
const development = isLocalNet();
// Identity provider URL
const IDENTITY_PROVIDER = development
  ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943` 
  : "https://identity.ic0.app";


export const poll_balance = async () =>{
    let result :Result;
    result = await univoice_vmc_backend.query_poll_balance();

    console.log("Poll balance is:"+ result);
    if(result.Ok){
       return result.Ok;
    }
    return "Null";

}

