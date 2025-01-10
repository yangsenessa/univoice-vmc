import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";
import { createActor } from 'declarations/univoice-vmc-backend';
const COLLECTION_CANISTER_ID_DEV="br5f7-7uaaa-aaaaa-qaaca-cai";
const COLLECTION_CANISTER_ID_PROD="3blo3-qqaaa-aaaam-ad3ea-cai";

const canisterId = COLLECTION_CANISTER_ID_DEV;
    
// We pass the host instead of using a proxy to support NodeJS >= v17 (ViteJS issue: https://github.com/vitejs/vite/issues/4794)
// Host
//const host = "https://mainnet.dfinity.network";
const host = "http://127.0.0.1:4944";

// Create an actor to interact with the IC for a particular canister ID
const actor = createActor(canisterId, { agentOptions: { host } });
const get_actor = async() => {
    try {
        // Canister IDs are automatically expanded to .env config - see vite.config.ts
       
        let input = '';
        let disabled = false;
        let greeting = '';
        // Call the IC
        greeting = await actor.greet(input);
    } catch (err: unknown) {
        console.error(err);
    }
}


