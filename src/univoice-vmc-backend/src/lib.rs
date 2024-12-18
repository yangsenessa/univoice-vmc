mod ledgertype;
mod types;

use candid::{candid_method, export_service, CandidType, Deserialize, Encode, Nat, Principal};
use ic_cdk::storage;
use std::borrow::{Borrow, BorrowMut};
use std::future::IntoFuture;
use std::mem;
use std::ops::{DerefMut, Index};
use std::str::FromStr;
use std::{cell::RefCell, result};

use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod, HttpResponse, TransformArgs,
    TransformContext,
};
use serde::{Serialize};
use serde_json::{self, Value};
use ledgertype::{
    ApproveResult, MinerTxState, TransferArgs, TransferTxState, TxIndex, UnvMinnerLedgerRecord,
    WorkLoadLedgerItem,
};
use types::{NftUnivoicePricipal};

use icrc_ledger_types::icrc1::account::{self, Account, Subaccount};
use icrc_ledger_types::icrc1::transfer::{BlockIndex, NumTokens};
use icrc_ledger_types::icrc2::approve::{ApproveArgs, ApproveError};
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};

#[derive(Clone, Debug, CandidType, Deserialize)]
struct Subscriber {
    topic: String,
}

#[derive(Clone, CandidType, Deserialize)]
struct Event0301008 {
    topic: String,
    payload: WorkLoadLedgerItem,
}

#[derive(CandidType, Deserialize, Clone, Default)]
pub struct State {
    unv_tx_leger: Vec<UnvMinnerLedgerRecord>,
    unv_nft_owners:Vec<Account>
}

#[derive(CandidType, Default, Deserialize, Clone)]
struct StableState {
    state: State,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}


#[ic_cdk::update]
async fn call_unvoice_for_ext_nft( nft_owners:NftUnivoicePricipal)->Result<usize,String>{
   
    STATE.with(|s| {
        s.borrow_mut().unv_nft_owners.clear();
        for owner_principal in nft_owners.owners {
            s.borrow_mut().unv_nft_owners.push(
                Account::from_str(owner_principal.as_str()).expect(
                    "Error principal refered"
                )
            );          
    };
    Ok( s.borrow_mut().unv_nft_owners.len())
    })
  
}
#[ic_cdk::update]
async fn query_poll_balance() -> Result<NumTokens, String> {
    ic_cdk::println!("Query balance of mining pool {}", ic_cdk::id(),);

    let balance = ic_cdk::call::<(Account,), (Nat,)>(
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai")
            .expect("Could not decode the principal."),
        "icrc1_balance_of",
        (Account::from(ic_cdk::id()),),
    )
    .await
    .map_err(|e| format!("fail to call ledger:{:?}", e))?
    .0
    .clone();

    Ok(balance)
}

#[ic_cdk::update]
async fn transfer(args: TransferArgs) -> Result<BlockIndex, String> {
    ic_cdk::println!(
        "Transferring {} tokens to account {}",
        &args.amount,
        &args.to_account,
    );

    let transfer_from_args = TransferFromArgs {
        // the account we want to transfer tokens from (in this case we assume the caller approved the canister to spend funds on their behalf)
        from: Account::from(ic_cdk::caller()),
        // can be used to distinguish between transactions
        memo: None,
        // the amount we want to transfer
        amount: args.amount,
        // the subaccount we want to spend the tokens from (in this case we assume the default subaccount has been approved)
        spender_subaccount: None,
        // if not specified, the default fee for the canister is used
        fee: None,
        // the account we want to transfer tokens to
        to: args.to_account,
        // a timestamp indicating when the transaction was created by the caller; if it is not specified by the caller then this is set to the current ICP time
        created_at_time: None,
    };

    // 1. Asynchronously call another canister function using `ic_cdk::call`.
    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        // 2. Convert a textual representation of a Principal into an actual `Principal` object. The principal is the one we specified in `dfx.json`.
        //    `expect` will panic if the conversion fails, ensuring the code does not proceed with an invalid principal.
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai")
                .expect("Could not decode the principal."),
        //ic_cdk::caller(),
        // 3. Specify the method name on the target canister to be called, in this case, "icrc1_transfer".
        "icrc2_transfer_from",
        // 4. Provide the arguments for the call in a tuple, here `transfer_args` is encapsulated as a single-element tuple.
        (transfer_from_args,),
    )
    .await // 5. Await the completion of the asynchronous call, pausing the execution until the future is resolved.
    // 6. Apply `map_err` to transform any network or system errors encountered during the call into a more readable string format.
    //    The `?` operator is then used to propagate errors: if the result is an `Err`, it returns from the function with that error,
    //    otherwise, it unwraps the `Ok` value, allowing the chain to continue.
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    // 7. Access the first element of the tuple, which is the `Result<BlockIndex, TransferError>`, for further processing.
    .0
    // 8. Use `map_err` again to transform any specific ledger transfer errors into a readable string format, facilitating error handling and debugging.
    .map_err(|e: TransferFromError| format!("ledger transfer error {:?}", e))
}

#[ic_cdk::update]
async fn setup_subscribe(publisher_id: Principal, topic: String) {
    let subscriber = Subscriber { topic };
    let _call_result: Result<(), _> = ic_cdk::call(publisher_id, "subscribe", (subscriber,)).await;
}

#[ic_cdk::update]
async fn publish_0301008(event: Event0301008) -> Result<TxIndex, String> {
    let ledger_item = event.payload;

    ic_cdk::println!("Init Nft owners");

    let nft_vec_param = init_nft_tokens(&ledger_item).await;
    ic_cdk::println!("Finish init Nft owners");
    let mut miner_acounts:Vec<Account> = Vec::new();



    //Build miner_collection
    for nft_vec in  nft_vec_param {
        ic_cdk::println!("Call Nft collection params");
        let miners_nft = ic_cdk::call::<(Vec<Nat>,), (Vec<Option<Account>>,)>(
            Principal::from_str(&ledger_item.nft_pool)
                       .expect("Could not decode the principal."),
            "icrc7_owner_of",
            (nft_vec,),
        )
        .await
        .map_err(|e| format!("failed to call ledger: {:?}", e));

        match miners_nft {
            Ok(accounts_opt) => {
                let accounts = accounts_opt;
                for account in accounts.0 {
                    if let Some(acctwithsub) = account {
                        if acctwithsub
                            .owner
                            .eq(&Principal::from_str(&ledger_item.nft_pool).unwrap())
                        {
                            continue;
                        }
                        ic_cdk::println!("Add nft owner");
                        miner_acounts.push(acctwithsub.clone());
    
                    }
                }
                
            }
            Err(e) => ic_cdk::println!("Call NFT err {}", e),
        }
    }
    let sharding_size = miner_acounts.len();
    let block_tokens = ledger_item.clone().block_tokens/sharding_size;
    ic_cdk::println!("Per-nft sharing of {} tokens", block_tokens);
    let mut blockindex:Nat = Nat::from(0 as u128);
    for miner in miner_acounts {
        blockindex = produce_unv_miner_ledger(&ledger_item, &miner,&block_tokens);
    
        ic_cdk::println!(
                        "NFT owner is {}, blockindex is {}",
                        miner.owner.to_text(),
                        blockindex
                    );
    }   
    Ok(TxIndex::from(blockindex))
}


#[ic_cdk::query]
fn get_all_miner_jnl() -> Option<Vec<UnvMinnerLedgerRecord>> {
    STATE.with(|s| Some(s.borrow().unv_tx_leger.clone()))
}

#[ic_cdk::update]
async fn claim_to_account_from_index(block_index: BlockIndex) -> Result<TxIndex, String> {
    let miner_ledger = get_unclaimed_mint_ledger(&block_index);
    match miner_ledger {
        Some(ledger_item) => {
            let transfer_result = call_transfer(&ledger_item).await;
            match transfer_result {
                Result::Ok(i) => {
                    let mut claimed_ledger = ledger_item.clone();
                    claimed_ledger.biz_state = TransferTxState::Claimed;
                    claimed_ledger.meta_workload.mining_status =
                        MinerTxState::Claimed(String::from("claimed"));
                    claimed_mint_ledger(&block_index)
                                     .map_err(|e|{format!("fail to call ledger:{:?}", e)});
                    ic_cdk::println!("Transfer Success {}", i);
                }
                Result::Err(e) => {
                    ic_cdk::println!("Transfer fail {}", e);
                    return Err(String::from(e.to_string()));
                }
            }
        }
        None => return Err(String::from("None ledger need to be claimed")),
    };
    Ok(TxIndex::from(0 as u128))
}

fn get_unclaimed_mint_ledger(index: &BlockIndex) -> Option<UnvMinnerLedgerRecord> {
    STATE.with(|s| {
        for item in s.borrow().unv_tx_leger.iter() {
            if *index == item.clone().block_index.unwrap() {
                return Some(item.clone());
            }
        }
        None
    })
}

fn claimed_mint_ledger(index:&BlockIndex) -> Result<(),String> {
    STATE.with(|s| {
        for item in s.borrow_mut().unv_tx_leger.iter_mut() {
            if *index == item.clone().block_index.unwrap() {
                item.biz_state = TransferTxState::Claimed;
                item.meta_workload.mining_status = MinerTxState::Claimed(String::from("claimed"));
                return Ok(());
            }
        }
        Err(String::from("Ledger is in blackhole"))
    } )
}

async fn call_approve_with_block_tokens(account: &Account, tokens: &NumTokens) -> ApproveResult {
    let approve_args = ApproveArgs {
        fee: Some(NumTokens::from(10 as u128)),
        memo: None,
        from_subaccount: None,
        created_at_time: Some(ic_cdk::api::time()),
        amount: tokens.clone(),
        expected_allowance: None,
        expires_at: None,
        spender: account.clone(),
    };
    ic_cdk::call::<(ApproveArgs,), (ApproveResult,)>(
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai")
            .expect("Could not decode the principal."),
        // 3. Specify the method name on the target canister to be called, in this case, "icrc1_transfer".
        "icrc2_approve",
        // 4. Provide the arguments for the call in a tuple, here `transfer_args` is encapsulated as a single-element tuple.
        (approve_args,),
    )
    .await
    .map_err(|e| format!("fail to call ledger:{:?}", e))
    .unwrap()
    .0
}

//Call icrc1_ledger
async fn call_transfer(miner_ledger: &UnvMinnerLedgerRecord) -> Result<BlockIndex, String> {
    let transfer_from_args = TransferFromArgs {
        // the account we want to transfer tokens from (in this case we assume the caller approved the canister to spend funds on their behalf)
        from: Account::from_str(&miner_ledger.meta_workload.token_pool).expect("Get token pool error"),
        // can be used to distinguish between transactions
        memo: None,
        // the amount we want to transfer
        amount: miner_ledger.tokens.clone(),
        // the subaccount we want to spend the tokens from (in this case we assume the default subaccount has been approved)
        spender_subaccount: None,
        // if not specified, the default fee for the canister is used
        fee: None,
        // the account we want to transfer tokens to
        to: miner_ledger.minner.clone(),
        // a timestamp indicating when the transaction was created by the caller; if it is not specified by the caller then this is set to the current ICP time
        created_at_time: None,
    };

    // 1. Asynchronously call another canister function using `ic_cdk::call`.
    ic_cdk::call::<(TransferFromArgs,), (Result<BlockIndex, TransferFromError>,)>(
        // 2. Convert a textual representation of a Principal into an actual `Principal` object. The principal is the one we specified in `dfx.json`.
        //    `expect` will panic if the conversion fails, ensuring the code does not proceed with an invalid principal.
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai")
            .expect("Could not decode the principal."),
        // 3. Specify the method name on the target canister to be called, in this case, "icrc2_transfer_from".
        "icrc2_transfer_from",
        // 4. Provide the arguments for the call in a tuple, here `transfer_args` is encapsulated as a single-element tuple.
        (transfer_from_args,),
    )
    .await // 5. Await the completion of the asynchronous call, pausing the execution until the future is resolved.
    // 6. Apply `map_err` to transform any network or system errors encountered during the call into a more readable string format.
    //    The `?` operator is then used to propagate errors: if the result is an `Err`, it returns from the function with that error,
    //    otherwise, it unwraps the `Ok` value, allowing the chain to continue.
    .map_err(|e| format!("failed to call ledger: {:?}", e))?
    // 7. Access the first element of the tuple, which is the `Result<BlockIndex, TransferError>`, for further processing.
    .0
    // 8. Use `map_err` again to transform any specific ledger transfer errors into a readable string format, facilitating error handling and debugging.
    .map_err(|e: TransferFromError| format!("ledger transfer error {:?}", e))
}

async  fn total_nft_supply(ledger:&WorkLoadLedgerItem ) ->Nat {
    ic_cdk::call::<(),(Nat,)> (
            Principal::from_text(ledger.nft_pool.clone())
                               .expect("Could not decode the principal."),
        "icrc7_total_supply",
        (),
    ).await
    .map_err(|e| format!("failed to call ledger: {:?}", e)).unwrap().0
}

async  fn total_nft_supply_owner(ledger:&WorkLoadLedgerItem ) ->Nat {
    ic_cdk::call::<(),(Nat,)> (
            Principal::from_text(ledger.nft_pool.clone())
                               .expect("Could not decode the principal."),
        "icrc7_total_supply",
        (),
    ).await
    .map_err(|e| format!("failed to call ledger: {:?}", e)).unwrap().0
}

async  fn init_nft_tokens(ledger:&WorkLoadLedgerItem ) -> Vec<Vec<Nat>> {
    let mut tokens_shard: Vec<Nat> = Vec::new();
    let mut nft_tokens_param: Vec<Vec<Nat>> = Vec::new();
    let max_tokenid:Nat = total_nft_supply(&ledger).await;
    ic_cdk::println!("Total Nft Supply is {}",&max_tokenid);

    let mut i: u128= 0 as u128;
    let tmp_tokennum:Nat=Nat::from(21_000 as u128) ;
    let glb_shard_size = 50;
    loop {
    
        tokens_shard.push(Nat::from(i.clone()));
        i +=1;
    
        if Nat::from(i).eq(&Nat::from(glb_shard_size as u128))  {
            nft_tokens_param.push(tokens_shard.clone());
            tokens_shard.clear();
            ic_cdk::println!("Init Nft shard to Index of {}", i);
        }

        if Nat::from(i) == max_tokenid {
            break;
        }                
    }
    if tokens_shard.len() > 0 {
        nft_tokens_param.push(tokens_shard.clone());
    }
    return nft_tokens_param;
}




fn produce_unv_miner_ledger(
    workloadledger: &WorkLoadLedgerItem,
    nft_owner: &Account,
    block_tokens:&Nat
) -> BlockIndex {
    STATE.with(|s| {
        let top_block = s.borrow_mut().unv_tx_leger.len();
        let block_index = BlockIndex::from(top_block + 1);
        let minner_ledger = UnvMinnerLedgerRecord {
            minner: nft_owner.clone(),
            meta_workload: workloadledger.clone(),
            block_index: Some(block_index.clone()),
            tokens: block_tokens.clone(),
            trans_tx_index: Option::None,
            gmt_datetime: ic_cdk::api::time(),
            biz_state: TransferTxState::WaitClaim,
        };
        s.borrow_mut().borrow_mut().unv_tx_leger.push(minner_ledger);
        return block_index;
    })
}

#[ic_cdk::pre_upgrade]
fn pre_upgrade() {
    let state = STATE.with(|state: &RefCell<State>| mem::take(&mut *state.borrow_mut()));
    let stable_state: StableState = StableState { state };
    ic_cdk::println!("pre_upgrade");
    storage::stable_save((stable_state,)).unwrap();
}

#[ic_cdk::post_upgrade]
fn post_upgrade() {
    ic_cdk::println!("post_upgrade");
    let (StableState { state },) =
        storage::stable_restore().expect("failed to restore stable state");
    STATE.with(|state0| *state0.borrow_mut() = state);
    ic_cdk::println!("post_upgrade");
}

ic_cdk::export_candid!();
