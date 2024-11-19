#dfx stop
#set -e
#trap 'dfx stop' EXIT
echo "===========SETUP tokens========="
#dfx start --background --clean


#echo "==========prepare NFT================"
#installing
#npm i -g ic-mops
#vessel
#wget https://github.com/dfinity/vessel/releases/download/v0.6.4/vessel-macos

set -ex

dfx stop
dfx start --clean --background

dfx identity use univoicetest
dfx deploy icrc7_nft_canister --argument 'record {icrc7_args = null; icrc37_args =null; icrc3_args =null;}' --mode reinstall
dfx deploy  univoice-vmc-backend 
ADMIN_PRINCIPAL=$(dfx identity get-principal)


dfx identity use alice
ALICE_PRINCIPAL=$(dfx identity get-principal)

dfx identity use bob
BOB_PRINCIPAL=$(dfx identity get-principal)


ADMIN_PRINCIPAL=$(dfx identity get-principal)

#dfx deploy icrc7 --argument 'record {icrc7_args = null; icrc37_args =null; icrc3_args =null;}'

ICRC7_CANISTER=$(dfx canister id icrc7_nft_canister)
echo $ICRC7_CANISTER

dfx canister call icrc7_nft_canister init


dfx canister call icrc7_nft_canister icrcX_mint "(
  vec {
    record {
      token_id = 0 : nat;
      owner = opt record { owner = principal \"$ICRC7_CANISTER\"; subaccount = null;};
      metadata = variant {
        Map = vec {
          record { \"icrc97:metadata\"; variant { Map = vec {
            record { \"name\"; variant { Text = \"Image 1\" } };
            record { \"description\"; variant { Text = \"A beautiful space image from NASA.\" } };
            record { \"assets\"; variant { Array = vec {
              variant { Map = vec {
                record { \"url\"; variant { Text = \"https://images-assets.nasa.gov/image/PIA18249/PIA18249~orig.jpg\" } };
                record { \"mime\"; variant { Text = \"image/jpeg\" } };
                record { \"purpose\"; variant { Text = \"icrc97:image\" } }
              }}
            }}}
          }}}
        }
      };
      memo = opt blob \"\00\01\";
      override = true;
      created_at_time = null;
    };
    record {
      token_id = 1 : nat;
      owner = opt record { owner = principal \"$ICRC7_CANISTER\"; subaccount = null;};
      metadata = variant {
        Map = vec {
          record { \"icrc97:metadata\"; variant { Map = vec {
            record { \"name\"; variant { Text = \"Image 2\" }};
            record { \"description\"; variant { Text = \"Another stunning NASA image.\" } };
            record { \"assets\"; variant { Array = vec {
              variant { Map = vec {
                record { \"url\"; variant { Text = \"https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001465/GSFC_20171208_Archive_e001465~orig.jpg\" } };
                record { \"mime\"; variant { Text = \"image/jpeg\" } };
                record { \"purpose\"; variant { Text = \"icrc97:image\" } }
              }}
            }}}
          }}}
        }
      };
      memo = opt blob \"\00\01\";
      override = true;
      created_at_time = null;
    };
    record {
      token_id = 2 : nat;
      owner = opt record { owner = principal \"$ICRC7_CANISTER\"; subaccount = null;};
      metadata = variant {
        Map = vec {
          record { \"icrc97:metadata\"; variant { Map = vec {
            record { \"name\"; variant { Text = \"Image 3\" } };
            record { \"description\"; variant { Text = \"Hubble sees the wings of a butterfly.\" } };
            record { \"assets\"; variant { Array = vec {
              variant { Map = vec {
                record { \"url\"; variant { Text = \"https://images-assets.nasa.gov/image/hubble-sees-the-wings-of-a-butterfly-the-twin-jet-nebula_20283986193_o/hubble-sees-the-wings-of-a-butterfly-the-twin-jet-nebula_20283986193_o~orig.jpg\" } };
                record { \"mime\"; variant { Text = \"image/jpeg\" } };
                record { \"purpose\"; variant { Text = \"icrc97:image\" } }
              }}
            }}}
          }}}
        }
      };
      memo = opt blob \"\00\01\";
      override = true;
      created_at_time = null;
    };
    record {
      token_id = 3 : nat;
      owner = opt record { owner = principal \"$ICRC7_CANISTER\"; subaccount = null;};
      metadata = variant {
        Map = vec {
          record { \"icrc97:metadata\"; variant { Map = vec {
            record { \"name\"; variant { Text = \"Image 4\" } };
            record { \"description\"; variant { Text = \"Another beautiful image from NASA archives.\" } };
            record { \"assets\"; variant { Array = vec {
              variant { Map = vec {
                record { \"url\"; variant { Text = \"https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001518/GSFC_20171208_Archive_e001518~orig.jpg\" } };
                record { \"mime\"; variant { Text = \"image/jpeg\" } };
                record { \"purpose\"; variant { Text = \"icrc97:image\" } }
              }}
            }}}
          }}}
        }
      };
      memo = opt blob \"\00\01\";
      override = true;
      created_at_time = null;
    };
  }
)"
echo "==================net call $ICRC7_CANISTER ================"
dfx canister call icrc7_nft_canister icrc7_tokens_of "(record { owner = principal \"$ICRC7_CANISTER\"; subaccount = null;},null,null)"

#All tokens should be owned by the canister
echo "All tokens should be owned by the canister"

#Should be approved to transfer
echo "Should be approved to transfer"
dfx canister call icrc7_nft_canister icrc37_is_approved "(vec{record { spender=record {owner = principal \"$ADMIN_PRINCIPAL\"; subaccount = null;}; from_subaccount=null; token_id=0;}})" --query

#Check that the owner is spender
echo "Check that the owner is spender"
dfx canister call icrc7_nft_canister icrc37_get_collection_approvals "(record { owner = principal \"$ICRC7_CANISTER\"; subaccount = null;},null, null)" --query

#tranfer from a token to the admin
echo "tranfer from a token to the admin"
dfx canister call icrc7_nft_canister icrc37_transfer_from "(vec{record { 
  spender = principal \"$ADMIN_PRINCIPAL\";
  from = record { owner = principal \"$ICRC7_CANISTER\"; subaccount = null}; 
  to = record { owner = principal \"$ADMIN_PRINCIPAL\"; subaccount = null};
  token_id =  0 : nat;
  memo = null;
  created_at_time = null;}})"

dfx canister call icrc7_nft_canister icrc7_tokens_of "(record { owner = principal \"$ADMIN_PRINCIPAL\"; subaccount = null;},null,null)"


echo "===========Prepared Univoice Tokens===================="
dfx deploy icrc1_index_canister --argument '(opt variant { Init = record { ledger_id = principal "mxzaz-hqaaa-aaaar-qaada-cai"; retrieve_blocks_from_ledger_interval_seconds = opt 10; } })'

dfx deploy icrc1_ledger_canister --argument "(variant {
  Init = record {
    token_symbol = \"UNIVOICE\";
    token_name = \"L-UNIVOICE\";
    minting_account = record {
      owner = principal \"$(dfx identity --identity anonymous get-principal)\"
    };
    transfer_fee = 10_000;
    metadata = vec {};
    initial_balances = vec {
      record {
        record {
          owner = principal \"$(dfx identity --identity default get-principal)\";
        };
        10_000_000_000;
      };
    };
    archive_options = record {
      num_blocks_to_archive = 1000;
      trigger_threshold = 2000;
      controller_id = principal \"$(dfx identity --identity anonymous get-principal)\";
    };
    feature_flags = opt record {
      icrc2 = true;
    };
  }
})"
dfx canister call icrc1_ledger_canister icrc1_balance_of "(record {
  owner = principal \"$(dfx identity --identity default get-principal)\";
})"
echo "===========SETUP DONE========="


dfx canister call icrc1_ledger_canister icrc1_balance_of "(record {
  owner = principal \"$(dfx identity --identity default get-principal)\";
})"
# approve the token_transfer_from_backend canister to spend 100 tokens
echo "===========icrc2_approve========="

dfx canister call --identity default icrc1_ledger_canister icrc2_approve "(
  record {
    spender= record {
      owner = principal \"$(dfx canister id univoice-vmc-backend)\";
    };
    amount = 10_000_000_000: nat;
  }
)"
echo "===========icrc2_approve_end========="


dfx canister call --identity default univoice-vmc-backend transfer "(record {
  amount = 100_000_000;
  to_account = record {
    owner = principal \"$(dfx canister id univoice-vmc-backend)\";
  };
})"

echo "===========query balance========"

dfx canister call icrc1_ledger_canister icrc1_balance_of "(record {
  owner = principal \"$(dfx canister id univoice-vmc-backend)\";
})"

echo "===========query balance inner========"
dfx canister call  univoice-vmc-backend query_poll_balance

