mod ledgertype;
mod types;

use candid::types::principal;
use candid::{candid_method, export_service, CandidType, Deserialize, Encode, Nat, Principal};
use ic_cdk::api::call::call;
use ic_cdk::storage;
use ic_cdk_macros::{query, update};
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
use ledgertype::{
    ApproveResult, MinerTxState, MinerWaitClaimBalance, TransferArgs, TransferTxState, TxIndex,
    UnvMinnerLedgerRecord, WorkLoadLedgerItem,
};
use serde::Serialize;
use serde_json::{self, Value};
use types::{NftUnivoicePricipal, UserIdentityInfo};

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
    unv_nft_owners: Vec<Account>,
    unv_user_infos: Vec<UserIdentityInfo>,
}

#[derive(CandidType, Default, Deserialize, Clone)]
struct StableState {
    state: State,
}

#[derive(CandidType, Deserialize, Debug)]
struct GetTransactionsRequest {
    start: Nat,
    length: Nat,
}

#[derive(CandidType, Deserialize, Debug)]
struct Transaction {
    id: Nat,
    amount: Nat,
    timestamp: i64,
    memo: Option<String>,
}

#[derive(CandidType, Deserialize, Debug)]
struct ArchivedTransaction {
    callback: Principal,
    start: Nat,
    length: Nat,
}

#[derive(CandidType, Deserialize, Debug)]
struct GetTransactionsResponse {
    first_index: Nat,
    log_length: Nat,
    transactions: Vec<Transaction>,
    archived_transactions: Vec<ArchivedTransaction>,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

fn get_total_minner() -> Result<Vec<Account>, String> {
    STATE.with(|s| Ok(s.borrow().unv_nft_owners.clone()))
}

#[ic_cdk::update]
async fn call_unvoice_for_ext_nft(nft_owners: NftUnivoicePricipal) -> Result<usize, String> {
    STATE.with(|s| {
        s.borrow_mut().unv_nft_owners.clear();
        for owner_principal in nft_owners.owners {
            ic_cdk::println!("Current principal id is {}", owner_principal);
            s.borrow_mut().unv_nft_owners.push(
                Account::from_str(owner_principal.as_str()).expect("Error principal refered"),
            );
        }
        Ok(s.borrow_mut().unv_nft_owners.len())
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

#[ic_cdk::query]
async fn get_miner_license(user_principal: String, pre: Nat, take: Nat) -> Vec<Nat> {
    let account: Account =
        Account::from_str(&user_principal).expect("Could not decode the principal");
    ic_cdk::call::<(Account, Nat, Nat), (Vec<Nat>,)>(
        Principal::from_str("bkyz2-fmaaa-aaaaa-qaaaq-cai")
            .expect("Could not decode the principal."),
        "icrc7_tokens_of",
        (account, pre, take),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))
    .unwrap()
    .0
}

#[ic_cdk::update]
async fn publish_0301008(event: Event0301008) -> Result<TxIndex, String> {
    let ledger_item = event.payload;

    ic_cdk::println!("Init Nft owners");

    let nft_vec_param = init_nft_tokens(&ledger_item).await;
    ic_cdk::println!("Finish init Nft owners");
    let mut miner_acounts: Vec<Account> = Vec::new();

    //Build miner_collection
    for nft_vec in nft_vec_param {
        ic_cdk::println!("Call Nft collection params");
        let miners_nft = ic_cdk::call::<(Vec<Nat>,), (Vec<Option<Account>>,)>(
            Principal::from_str(&ledger_item.nft_pool).expect("Could not decode the principal."),
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
    let block_tokens = ledger_item.clone().block_tokens / sharding_size;
    ic_cdk::println!("Per-nft sharing of {} tokens", block_tokens);
    let mut blockindex: Nat = Nat::from(0 as u128);
    for miner in miner_acounts {
        blockindex = produce_unv_miner_ledger(&ledger_item, &miner, &block_tokens);

        ic_cdk::println!(
            "NFT owner is {}, blockindex is {}",
            miner.owner.to_text(),
            blockindex
        );
    }
    Ok(TxIndex::from(blockindex))
}

#[ic_cdk::update]
async fn publish_0301008_EXT(event: Event0301008) -> Result<TxIndex, String> {
    let ledger_item = event.payload;
    let mut blockindex: Nat = Nat::from(0 as u128);

    let mut blockindex_vec: Vec<Nat> = Vec::new();
    let mut tx_index: Nat = Nat::from(0 as u128);

    ic_cdk::println!("Init Nft owners");
    STATE.with(|s| {
        let miner_set = get_total_minner().unwrap();
        let sharding_size = miner_set.len();
        let block_tokens = ledger_item.clone().block_tokens / sharding_size;
        ic_cdk::println!("Per-nft sharing of {} tokens", block_tokens);

        for miner in miner_set {
            blockindex = produce_unv_miner_ledger(&ledger_item, &miner, &block_tokens);
            blockindex_vec.push(blockindex.clone());
            ic_cdk::println!(
                "NFT owner is {}, blockindex is {}",
                miner.owner.to_text(),
                blockindex.clone()
            );
        }
    });
    for idx_ledger in blockindex_vec {
        tx_index = claim_to_account_from_index(idx_ledger.clone())
            .await
            .expect("fail to call claim");
    }

    Ok(TxIndex::from(tx_index))
}

#[ic_cdk::query]
fn get_all_miner_jnl() -> Option<Vec<UnvMinnerLedgerRecord>> {
    STATE.with(|s| Some(s.borrow().unv_tx_leger.clone()))
}

#[ic_cdk::query]
fn get_all_miner_jnl_with_principalid(principalid: String) -> Vec<UnvMinnerLedgerRecord> {
    let mut minting_ledeger: Vec<UnvMinnerLedgerRecord> = Vec::new();
    let account: Account = Account::from_str(&principalid).expect("Parse principal id err");

    STATE.with(|s| {
        for ledeger_item in s.borrow().unv_tx_leger.clone() {
            if account == ledeger_item.minner {
                minting_ledeger.push(ledeger_item);
            }
        }
    });
    return minting_ledeger;
}

#[ic_cdk::update]
fn sync_userinfo_identity(user_infos: Vec<UserIdentityInfo>) -> Result<usize, String> {
    STATE.with(|s| {
        let mut tmp_userinfo: Vec<UserIdentityInfo> = Vec::new();
        let mut idl_cnt = 0;

        for item in user_infos.clone() {
            if s.borrow().unv_user_infos.len() == 0 {
                ic_cdk::println!("Sync userinfos from univoice-init push");
                tmp_userinfo.push(item.clone());
            }

            for user_info_item in s.borrow().unv_user_infos.iter() {
                if item.user_id == user_info_item.user_id {
                    idl_cnt += 1;
                    break;
                }
            }

            if idl_cnt == 0 {
                ic_cdk::println!("Sync userinfos from univoice push {}", item.user_id);
                tmp_userinfo.push(item.clone());
            }
            idl_cnt = 0;
        }

        for add_item in tmp_userinfo {
            s.borrow_mut().unv_user_infos.push(add_item);
        }

        let userinfo_size: usize = s.borrow().unv_user_infos.len();
        Ok(userinfo_size)
    })
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
                    claimed_mint_ledger(&block_index, &i)
                        .map_err(|e| format!("fail to call ledger:{:?}", e));
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

#[ic_cdk::query]
fn gener_nft_owner_wait_claims(principal: String) -> MinerWaitClaimBalance {
    STATE.with(|s| {
        let miner_account: Account = Account::from(Principal::from_text(principal).unwrap());
        let mut balance: NumTokens = NumTokens::from(0 as u128);
        for unv_miner_ledger in s.borrow().unv_tx_leger.iter() {
            if miner_account == unv_miner_ledger.minner {
                balance = unv_miner_ledger.tokens.clone() + balance;
            }
        }
        return MinerWaitClaimBalance {
            pricipalid_txt: miner_account.owner.to_text(),
            tokens: balance,
        };
    })
}

#[ic_cdk::update]
async fn claim_to_account_by_principal(principalid: String) -> Result<TxIndex, String> {
    let miner_ledger_vec = get_unclaimed_mint_ledger_by_principal(principalid);
    match miner_ledger_vec {
        Some(ledger_item_vec) => {
            for ledger_item in ledger_item_vec.iter() {
                let transfer_result = call_transfer(&ledger_item).await;
                match transfer_result {
                    Result::Ok(i) => {
                        let mut claimed_ledger = ledger_item.clone();
                        claimed_ledger.biz_state = TransferTxState::Claimed;
                        claimed_ledger.meta_workload.mining_status =
                            MinerTxState::Claimed(String::from("claimed"));
                        let block_index: Nat = claimed_ledger.block_index.unwrap();
                        claimed_mint_ledger(&block_index, &i)
                            .map_err(|e| format!("fail to call ledger:{:?}", e));
                        ic_cdk::println!("Transfer Success {}", i);
                    }
                    Result::Err(e) => {
                        ic_cdk::println!("Transfer fail {}", e);
                        return Err(String::from(e.to_string()));
                    }
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
                if item.biz_state == TransferTxState::Claimed {
                    return None;
                }

                return Some(item.clone());
            }
        }
        None
    })
}

fn get_unclaimed_mint_ledger_by_principal(
    principalid: String,
) -> Option<Vec<UnvMinnerLedgerRecord>> {
    STATE.with(|s| {
        let mut ledgerRecord: Vec<UnvMinnerLedgerRecord> = Vec::new();
        for item in s.borrow().unv_tx_leger.iter() {
            if principalid == item.clone().minner.owner.to_text() {
                if item.biz_state == TransferTxState::Claimed {
                    ledgerRecord.push(item.clone());
                }
            }
        }
        return Some(ledgerRecord);
    })
}

fn claimed_mint_ledger(index: &BlockIndex, trans_index: &TxIndex) -> Result<(), String> {
    STATE.with(|s| {
        for item in s.borrow_mut().unv_tx_leger.iter_mut() {
            if *index == item.clone().block_index.unwrap() {
                item.biz_state = TransferTxState::Claimed;
                item.meta_workload.mining_status = MinerTxState::Claimed(String::from("claimed"));
                item.trans_tx_index = Some(trans_index.clone());
                return Ok(());
            }
        }
        Err(String::from("Ledger is in blackhole"))
    })
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
    ic_cdk::println!("Begin transfer {} tokens", miner_ledger.tokens);
    let transfer_from_args = TransferFromArgs {
        // the account we want to transfer tokens from (in this case we assume the caller approved the canister to spend funds on their behalf)
        from: Account::from_str(&miner_ledger.meta_workload.token_pool)
            .expect("Get token pool error"),
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

async fn total_nft_supply(ledger: &WorkLoadLedgerItem) -> Nat {
    ic_cdk::call::<(), (Nat,)>(
        Principal::from_text(ledger.nft_pool.clone()).expect("Could not decode the principal."),
        "icrc7_total_supply",
        (),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))
    .unwrap()
    .0
}

async fn total_nft_supply_owner(ledger: &WorkLoadLedgerItem) -> Nat {
    ic_cdk::call::<(), (Nat,)>(
        Principal::from_text(ledger.nft_pool.clone()).expect("Could not decode the principal."),
        "icrc7_total_supply",
        (),
    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e))
    .unwrap()
    .0
}

async fn init_nft_tokens(ledger: &WorkLoadLedgerItem) -> Vec<Vec<Nat>> {
    let mut tokens_shard: Vec<Nat> = Vec::new();
    let mut nft_tokens_param: Vec<Vec<Nat>> = Vec::new();
    let max_tokenid: Nat = total_nft_supply(&ledger).await;
    ic_cdk::println!("Total Nft Supply is {}", &max_tokenid);

    let mut i: u128 = 0 as u128;
    let tmp_tokennum: Nat = Nat::from(21_000 as u128);
    let glb_shard_size = 50;
    loop {
        tokens_shard.push(Nat::from(i.clone()));
        i += 1;

        if Nat::from(i).eq(&Nat::from(glb_shard_size as u128)) {
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
    block_tokens: &Nat,
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
        s.borrow_mut().unv_tx_leger.push(minner_ledger);
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

#[ic_cdk::query]
async fn get_user_balance(account_owner: Principal) -> Result<Nat, String> {
    ic_cdk::println!("Received account_owner: {}", account_owner.to_text());

    let ledger_canister_id =
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai").expect("Invalid Ledger Canister ID");

    let account = Account {
        owner: account_owner,
        subaccount: None,
    };

    let result: Result<(Nat,), _> = call(ledger_canister_id, "icrc1_balance_of", (account,)).await;

    match result {
        Ok((balance,)) => Ok(balance),
        Err(err) => Err(format!("Failed to fetch balance: {:?}", err)),
    }
}

#[query]
async fn get_transactions(request: GetTransactionsRequest) -> GetTransactionsResponse {
    let ledger_canister_id =
        Principal::from_text("jfqe5-daaaa-aaaai-aqwvq-cai").expect("Invalid Ledger Canister ID");

    let result: Result<(GetTransactionsResponse,), _> =
        call(ledger_canister_id, "get_transactions", (request,)).await;

    match result {
        Ok((response,)) => {
            ic_cdk::println!("Received response: {:?}", response);
            response
        }
        Err(err) => {
            ic_cdk::println!("Error calling ledger canister: {:?}", err);
            GetTransactionsResponse {
                first_index: Nat::default(),
                log_length: Nat::default(),
                transactions: vec![],
                archived_transactions: vec![],
            }
        }
    }
}

ic_cdk::export_candid!();
