import { univoice_vmc_backend } from 'declarations/univoice-vmc-backend';
import type {Result,MinerWaitClaimBalance,UnvMinnerLedgerRecord,MainSiteSummary} from 'declarations/univoice-vmc-backend/univoice-vmc-backend.did';
import { isLocalNet } from '@/utils/env';


// Mode
const development = isLocalNet();
// Identity provider URL
const IDENTITY_PROVIDER = development
  ? `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943` 
  : "https://identity.ic0.app";


export const poll_balance = async () =>{
  return await univoice_vmc_backend.query_poll_balance();
}

export const get_total_listener = async() =>{
  console.log("Call backend get_total_listener");
  return await univoice_vmc_backend.get_total_listener();
}

/**
 * query custom should claimed
 * @param principalId 
 * @returns 
 */
export const gener_nft_owner_wait_claims = async(principalId:string):Promise<MinerWaitClaimBalance> => {
  let result:MinerWaitClaimBalance;
  result = await univoice_vmc_backend.gener_nft_owner_wait_claims(principalId);
  return result;  
}

export const get_miner_jnl = async(principalid:string):Promise<[] | [Array<UnvMinnerLedgerRecord>]> =>{
  console.log("get_miner_jnl with principalid of:"+ principalid);
  if(principalid) {
    return await univoice_vmc_backend.get_all_miner_jnl_with_principalid(principalid);

  } else {
    return await univoice_vmc_backend.get_all_miner_jnl();
  }
}

export const get_main_site_summary = async():Promise<MainSiteSummary> =>{

  return  univoice_vmc_backend.get_main_site_summary();

}

export const get_miner_license = async(user_principal: string, pre?: bigint, take?: bigint):Promise<Array<bigint>> =>  {
   let res = await  univoice_vmc_backend.get_miner_license(user_principal);
   return res;

}

export const sum_claimed_mint_ledger = async(user_principal:string):Promise<bigint> => {
  let res = await univoice_vmc_backend.sum_claimed_mint_ledger(user_principal);
  console.log("query sum_claimed_mint_ledger res = ", res);
  return res;
}

export const sum_unclaimed_mint_ledger_onceday = async(user_principal:string):Promise<bigint> => {
  let res = await univoice_vmc_backend.sum_unclaimed_mint_ledger_onceday(user_principal);
  console.log("query sum_unclaimed_mint_ledger_onceday res=", res);
  return res;
}


