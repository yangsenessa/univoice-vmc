import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { createAgent } from "@dfinity/utils";
import { createActor } from 'declarations/univoice-vmc-backend';

try {
    // Canister IDs are automatically expanded to .env config - see vite.config.ts
    const canisterId = import.meta.env.CANISTER_ID_UNIVOICE_VMC_BACKEND;

    // We pass the host instead of using a proxy to support NodeJS >= v17 (ViteJS issue: https://github.com/vitejs/vite/issues/4794)
    const host = import.meta.env.VITE_HOST;

    // Create an actor to interact with the IC for a particular canister ID
    const actor = createActor(canisterId, { agentOptions: { host } });
    let input = '';
	let disabled = false;
	let greeting = '';
    // Call the IC
    greeting = await actor.greet(input);
} catch (err: unknown) {
    console.error(err);
}
