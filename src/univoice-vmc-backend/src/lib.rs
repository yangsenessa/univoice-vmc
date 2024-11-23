mod ledgertype;

use candid::{candid_method, export_service, 
    Nat, Principal,CandidType, Deserialize,Encode};
use std::borrow::Borrow;
use std::{cell::RefCell, result};
use std::mem;    
use ic_cdk::query;
use serde::Serialize;


use ledgertype::{ComfyUIPayload, TransferArgs, TxIndex, UnvMinnerLedgerRecord, WorkLoadLedgerItem};

use icrc_ledger_types::icrc1::account::{self, Account, Subaccount};
use icrc_ledger_types::icrc1::transfer::{BlockIndex, NumTokens};
use icrc_ledger_types::icrc2::transfer_from::{TransferFromArgs, TransferFromError};


#[derive(Clone, Debug, CandidType, Deserialize)]
struct Subscriber {
    topic: String,
}

#[derive(Clone, CandidType, Deserialize)]
struct Event0301008 {
    topic:String,
    payload:WorkLoadLedgerItem
}

#[derive(CandidType,Deserialize,Clone,Default)]
pub struct  State {
    unv_tx_leger:Vec<UnvMinnerLedgerRecord>
}

#[derive(CandidType, Default,Deserialize,Clone)]
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
#[query]
async fn query_poll_balance()->Result<NumTokens,String> {
    ic_cdk::println!(
        "Query balance of mining pool {}",
        ic_cdk::id(),
    );

    let balance = ic_cdk::call::<(Account,),(Nat,)> (
        Principal::from_text("mxzaz-hqaaa-aaaar-qaada-cai")
                       .expect("Could not decode the principal."),
        "icrc1_balance_of",
        (Account::from(ic_cdk::id()),)

    ).await
    .map_err(|e| format!("fail to call ledger:{:?}",e))?
    .0.clone();

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
    let _call_result: Result<(), _> =
        ic_cdk::call(publisher_id, "subscribe", (subscriber,)).await;
}

#[ic_cdk::update]
async fn publish_0301008(event:Event0301008) -> Result<TxIndex,String>{
    let ledger_item = event.payload;

    ic_cdk::println!("Init Nft owners");

    let nft_vec = init_nft_tokens();
    let miners_nft= ic_cdk::call::<(Vec<Nat>,),(Vec<Option<Account>>,)> (
        Principal::from_text("bkyz2-fmaaa-aaaaa-qaaaq-cai")
            .expect("Could not decode the principal."),
           "icrc7_owner_of" ,
           (nft_vec,),

    )
    .await
    .map_err(|e| format!("failed to call ledger: {:?}", e));
    
    match miners_nft {
        Ok(accounts_opt) => {
            let accounts = accounts_opt.0;
            for account in accounts {
                if let Some(acctwithsub) = account {
                    ic_cdk::println!("NFT owner is {}"
                              ,acctwithsub.owner.to_text() );
                }
            }
        },
        Err(e) => ic_cdk::println!("Call NFT err {}",e)
    }
    
    Ok(TxIndex::from(0 as u128))

}

fn init_nft_tokens() -> Vec<Nat> {
    let mut tokens:Vec<Nat> = Vec::new();
    tokens.push(Nat::from(0 as u32));
    tokens.push(Nat::from(1 as u32));
    tokens.push(Nat::from(2 as u32));
    tokens.push(Nat::from(3 as u32));
    return tokens;
}