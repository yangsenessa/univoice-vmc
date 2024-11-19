use std::default;

use candid::{CandidType, Principal,Deserialize,Nat};
use serde::Serialize;
use icrc_ledger_types::icrc1::account::{Account,Subaccount,DEFAULT_SUBACCOUNT};
use icrc_ledger_types::icrc1::transfer::{BlockIndex, NumTokens};


pub type TxIndex = Nat;
pub type Timestamp = u64;

#[derive(CandidType,Deserialize,Clone)]
pub enum MinerTxState {
    Prepared(String),
    Claimed(String)
}
impl Default  for MinerTxState {
    fn default() -> Self {
       MinerTxState::Prepared(String::from("prepared"))
   }
}

#[derive(Clone, Debug, Default, CandidType, Deserialize)]

pub struct ComfyUIPayload {
    pub promt_id:String,
    pub client_id:String,
    pub ai_node:String,
    pub app_info:String,
    pub wk_id:String,
    pub voice_key:String,
    pub deduce_asset_key:String,
    pub status:String,
    //Not the time of AI node, but the time on chain
    pub gmt_datatime:Timestamp
}

#[derive(Clone, Default, CandidType, Deserialize)]
pub struct WorkLoadLedgerItem {
    pub wkload_id:BlockIndex,
    pub work_load :ComfyUIPayload,
    pub block_tokens:NumTokens,
    pub mining_status:MinerTxState
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct TransferArgs {
    pub amount: NumTokens,
    pub to_account: Account,
}

#[derive(Clone, CandidType, Deserialize)]
pub struct MinerTxClaimRecord {
    pub miner_id:TxIndex,
    pub relate_workload_id:BlockIndex,
    pub owner:Principal,
    pub tokens:NumTokens,
    pub gmt_date:Timestamp,
    pub status:MinerTxState
}

