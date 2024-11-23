use icrc_nft_types::{
    icrc7::{
        metadata::{Icrc7CollectionMetadata, Icrc7TokenMetadata},
        transfer::{TransferArg, TransferResult},

    },
    Account,
};

use crate::ledgertype::*;
use crate::types::{NFTtokenId};

pub(super) fn mining_factory(work_load_record:WorkLoadLedgerItem)
                        ->Result<UnvMinnerLedgerRecord,miningerr::Err>{
    let miners:Vec<Principal> = get_nft_holders();




}

fn get_nft_holders(){

    let nft_colloction:Vec<NFTtokenId> = Vec

}
