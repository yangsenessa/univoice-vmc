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
#[derive(CandidType,Deserialize,Clone)]

pub enum TransferTxState {
    Finished,
    Cancel
}
impl Default  for TransferTxState {
    fn default() -> Self {
        TransferTxState::Finished
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

#[derive(Clone, CandidType, Deserialize)]
pub struct UnvMinnerLedgerRecord{
    pub minner:Principal,
    pub meta_workload:WorkLoadLedgerItem,
    pub block_index:BlockIndex,
    pub trans_tx_index:TxIndex,
    pub tokens:NumTokens,
    pub gmt_pay_finish:Timestamp,
    pub biz_state:TransferTxState
}

#[derive(CandidType, Deserialize, Serialize)]
pub struct TransferArgs {
    pub amount: NumTokens,
    pub to_account: Account,
}




